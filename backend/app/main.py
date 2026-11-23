
import os
import secrets
import json
import uuid
import base64
import hashlib
import hmac
import jwt
import ssl
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, inspect, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models, schemas
from .analyzer import analyze_product, ask as assistant_ask, converse as assistant_converse, OWNER_DEFAULT
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    GOOGLE_CLIENT_ID,
    APPLE_CLIENT_ID,
    verify_google_credential,
)
from .email_verification import (
    create_verification_token,
    hash_verification_token,
    send_verification_email,
)

# Create database tables
Base.metadata.create_all(bind=engine)
# Add product fields to existing local SQLite / hosted databases without deleting rows.
with engine.begin() as connection:
    product_columns = {column["name"] for column in inspect(engine).get_columns("products")}
    for column_name, definition in (
        ("sku", "VARCHAR(60) NOT NULL DEFAULT ''"),
        ("unit", "VARCHAR(30) NOT NULL DEFAULT 'pieces'"),
        ("supplier", "VARCHAR(160) NOT NULL DEFAULT ''"),
        ("user_id", "INTEGER REFERENCES users(id)"),
    ):
        if column_name not in product_columns:
            connection.execute(text(f"ALTER TABLE products ADD COLUMN {column_name} {definition}"))
    for table_name in ("suppliers", "purchases", "sales", "products"):
        columns = {column["name"] for column in inspect(engine).get_columns(table_name)}
        if "user_id" not in columns and table_name != "products":
            connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN user_id INTEGER REFERENCES users(id)"))
        if "created_at" not in columns:
            connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN created_at TIMESTAMP WITH TIME ZONE"))
        connection.execute(text(f"CREATE INDEX IF NOT EXISTS ix_{table_name}_user_id ON {table_name} (user_id)"))
    connection.execute(text("CREATE INDEX IF NOT EXISTS ix_products_user_id ON products (user_id)"))
    user_columns = {column["name"] for column in inspect(engine).get_columns("users")}
    for column_name, definition in (
        ("google_sub", "VARCHAR(255)"),
        ("apple_sub", "VARCHAR(255)"),
        # Preserve login access for accounts created before email verification existed.
        ("email_verified", "BOOLEAN NOT NULL DEFAULT TRUE"),
        ("email_verification_token_hash", "VARCHAR(64)"),
        ("email_verification_expires_at", "TIMESTAMP WITH TIME ZONE"),
        ("email_verification_sent_at", "TIMESTAMP WITH TIME ZONE"),
    ):
        if column_name not in user_columns:
            connection.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {definition}"))
    connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_sub ON users (google_sub)"))
    connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_apple_sub ON users (apple_sub)"))
    connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email_verification_token_hash ON users (email_verification_token_hash)"))
    # Billing tables migration for existing deployments.
    try:
        payment_order_columns = {column["name"] for column in inspect(engine).get_columns("payment_orders")}
        if "provider_order_id" not in payment_order_columns:
            connection.execute(text("ALTER TABLE payment_orders ADD COLUMN provider_order_id VARCHAR(120)"))
        connection.execute(text("CREATE INDEX IF NOT EXISTS ix_payment_orders_provider_order_id ON payment_orders (provider_order_id)"))
    except Exception:
        pass
    try:
        subscription_columns = {column["name"] for column in inspect(engine).get_columns("subscriptions")}
    except Exception:
        subscription_columns = set()
    # (no new subscription columns needed)

# Create FastAPI application
app = FastAPI(title="StockSetu Inventory Management")

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        *[origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip()],
    ],
    allow_origin_regex=r"^https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================= HOME =================

# Public API - No JWT required
@app.get("/")
def home():
    return {
        "message": "StockSetu Backend is running!",
        "status": "success"
    }


# ================= PRODUCTS =================

# Add Product
@app.post("/products")
def add_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_product = models.Product(**product.model_dump(), user_id=current_user.id, created_at=datetime.now(timezone.utc))
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product added successfully", "product_id": new_product.id}


# View only this account's products
@app.get("/products")
def get_products(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Product).filter(models.Product.user_id == current_user.id).order_by(models.Product.id.desc()).all()


# Update a product owned by this account
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.user_id == current_user.id,
    ).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in updated_product.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return {"message": "Product updated successfully"}


# Delete only a product owned by this account
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.user_id == current_user.id,
    ).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


# ================= SUPPLIERS =================

# Supplier records are isolated to the signed-in workspace.
@app.post("/suppliers")
def add_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_supplier = models.Supplier(**supplier.model_dump(), user_id=current_user.id)
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return {"message": "Supplier added successfully", "supplier_id": new_supplier.id}


@app.get("/suppliers")
def get_suppliers(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Supplier).filter(models.Supplier.user_id == current_user.id).order_by(models.Supplier.id.desc()).all()


@app.put("/suppliers/{supplier_id}")
def update_supplier(supplier_id: int, updated_supplier: schemas.SupplierCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id, models.Supplier.user_id == current_user.id).first()
    if supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    for field, value in updated_supplier.model_dump().items():
        setattr(supplier, field, value)
    db.commit()
    db.refresh(supplier)
    return {"message": "Supplier updated successfully"}


@app.delete("/suppliers/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id, models.Supplier.user_id == current_user.id).first()
    if supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}


# Purchases are recorded against products and suppliers in the current workspace.
@app.post("/purchases")
def add_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == purchase.product_id, models.Product.user_id == current_user.id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    supplier = db.query(models.Supplier).filter(models.Supplier.id == purchase.supplier_id, models.Supplier.user_id == current_user.id).first()
    if supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    total = purchase.quantity * purchase.unit_cost
    product.quantity += purchase.quantity
    new_purchase = models.Purchase(user_id=current_user.id, product_id=product.id, supplier_id=supplier.id, quantity=purchase.quantity, total_cost=total, created_at=datetime.now(timezone.utc))
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return {"message": "Purchase added successfully", "purchase_id": new_purchase.id, "total_cost": total, "updated_stock": product.quantity}


@app.get("/purchases")
def get_purchases(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Purchase).filter(models.Purchase.user_id == current_user.id).order_by(models.Purchase.id.desc()).all()


# Sales reduce stock only for products in the current workspace.
@app.post("/sales")
def add_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == sale.product_id, models.Product.user_id == current_user.id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.quantity < sale.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    total = sale.quantity * product.selling_price
    product.quantity -= sale.quantity
    new_sale = models.Sale(user_id=current_user.id, product_id=product.id, quantity=sale.quantity, total_amount=total, created_at=datetime.now(timezone.utc))
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return {"message": "Sale recorded successfully", "sale_id": new_sale.id, "total_amount": total, "remaining_stock": product.quantity}


@app.get("/sales")
def get_sales(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Sale).filter(models.Sale.user_id == current_user.id).order_by(models.Sale.id.desc()).all()


@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    products = db.query(models.Product).filter(models.Product.user_id == current_user.id).all()
    sales = db.query(models.Sale).filter(models.Sale.user_id == current_user.id).all()
    purchases = db.query(models.Purchase).filter(models.Purchase.user_id == current_user.id).all()
    return {"total_products": len(products), "total_stock": sum(p.quantity for p in products), "total_sales": sum(s.total_amount for s in sales), "total_purchases": sum(p.total_cost for p in purchases), "low_stock_products": sum(1 for p in products if p.quantity <= p.min_stock)}


@app.get("/alerts")
def get_low_stock_alerts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    products = db.query(models.Product).filter(models.Product.user_id == current_user.id).all()
    return [{"id": product.id, "name": product.name, "quantity": product.quantity, "min_stock": product.min_stock} for product in products if product.quantity <= product.min_stock]


# ================= STOCKSATHI (AI ASSISTANT) =================

def _assistant_product(db, product_id, user):
    return db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.user_id == user.id,
    ).first()


def _resolve_product(db, user, question, product_id=None):
    """Find the product a chat message is about.

    Returns (product, choices) where choices is a list of candidate products
    when the message did not pin down a single one.
    """
    if product_id is not None:
        product = _assistant_product(db, product_id, user)
        if product is not None:
            return product, []
    products = db.query(models.Product).filter(models.Product.user_id == user.id).all()
    if not products:
        return None, []
    q = (question or "").lower()
    matches = [p for p in products if p.name and p.name.lower() in q]
    if not matches:
        # Fall back to token overlap for multi-word product names.
        tokens = [t for t in q.split() if len(t) >= 3]
        matches = [p for p in products if any(t in (p.name or "").lower() for t in tokens)]
    # Prefer the longest name match to avoid "Shirt" stealing "Cotton Shirt".
    matches = sorted(set(matches), key=lambda p: len(p.name or ""), reverse=True)
    if len(matches) == 1:
        return matches[0], []
    if len(matches) > 1:
        return None, matches
    if len(products) == 1:
        return products[0], []
    return None, products


@app.get("/assistant/analyze/{product_id}")
def assistant_analyze(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    product = _assistant_product(db, product_id, current_user)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    sales = db.query(models.Sale).filter(
        models.Sale.user_id == current_user.id,
        models.Sale.product_id == product_id,
    ).all()
    purchases = db.query(models.Purchase).filter(
        models.Purchase.user_id == current_user.id,
        models.Purchase.product_id == product_id,
    ).all()
    return analyze_product(product, sales, purchases)


@app.post("/assistant/ask")
def assistant_question(payload: schemas.AssistantAsk, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    question = (payload.question or "").strip()
    if not question:
        question = "help"
    settings = db.query(models.BusinessSettings).filter(models.BusinessSettings.user_id == current_user.id).first()
    owner_name = (settings.owner_name if settings and settings.owner_name else OWNER_DEFAULT)

    # Normal chatbot small talk first — no internal codes, no product required.
    conversational = assistant_converse(question, owner_name, db.query(models.Product).filter(models.Product.user_id == current_user.id).count())
    if conversational is not None:
        return {"answer": conversational, "analysis": None}

    product, choices = _resolve_product(db, current_user, question, payload.product_id)
    if product is None:
        if not choices:
            return {"answer": "Pehle koi product add karo, phir main uske records se jawab de sakta hoon.", "analysis": None}
        names = ", ".join(p.name for p in choices[:8])
        return {
            "answer": f"Kaunsa product? Thoda specific bolo — main ye samajh paaya: {names}. Product ka naam likh kar poochho, jaise 'Cotton Shirt ke baare me btao'.",
            "analysis": None,
        }
    sales = db.query(models.Sale).filter(
        models.Sale.user_id == current_user.id,
        models.Sale.product_id == product.id,
    ).all()
    purchases = db.query(models.Purchase).filter(
        models.Purchase.user_id == current_user.id,
        models.Purchase.product_id == product.id,
    ).all()
    analysis = analyze_product(product, sales, purchases)
    question = payload.question or ""
    if not question.strip():
        return {"answer": analysis["summary"], "analysis": analysis}
    return {"answer": assistant_ask(question, analysis), "analysis": analysis}


# ================= STOCKSATHI LLM (HYBRID AI MODE) =================

_LLM_ENDPOINTS = {
    "groq": ("https://api.groq.com/openai/v1/chat/completions", "llama-3.1-8b-instant"),
    "openai": ("https://api.openai.com/v1/chat/completions", "gpt-4o-mini"),
    "grok": ("https://api.x.ai/v1/chat/completions", "grok-2-1212"),
}


def _safe_analysis(analysis):
    """Strip internal identifiers before sending anything to an LLM."""
    if not analysis:
        return None
    return {
        "name": analysis.get("name"),
        "sku": analysis.get("sku"),
        "unit": analysis.get("unit"),
        "quantity": analysis.get("quantity"),
        "min_stock": analysis.get("min_stock"),
        "total_sold": analysis.get("total_sold"),
        "total_purchased": analysis.get("total_purchased"),
        "sold_7d": analysis.get("sold_7d"),
        "sold_30d": analysis.get("sold_30d"),
        "daily_rate": analysis.get("daily_rate"),
        "monthly_forecast": analysis.get("monthly_forecast"),
        "stock_days_left": analysis.get("stock_days_left"),
        "suggested_order": analysis.get("suggested_order"),
        "margin_per_piece": analysis.get("margin_per_piece"),
        "margin_pct": analysis.get("margin_pct"),
        "verdict": analysis.get("verdict_label"),
        "summary": analysis.get("summary"),
        "advice": analysis.get("advice"),
        "warnings": analysis.get("warnings"),
    }


@app.post("/assistant/llm")
def assistant_llm(payload: schemas.AssistantLLM, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    question = (payload.question or "").strip()
    if not question:
        question = "Is product ke baare me btao"

    product, choices = _resolve_product(db, current_user, question, payload.product_id)
    analysis = None
    if product is not None:
        sales = db.query(models.Sale).filter(models.Sale.user_id == current_user.id, models.Sale.product_id == product.id).all()
        purchases = db.query(models.Purchase).filter(models.Purchase.user_id == current_user.id, models.Purchase.product_id == product.id).all()
        analysis = analyze_product(product, sales, purchases)

    if product is None and choices:
        names = ", ".join(p.name for p in choices[:8])
        return {"answer": f"Kaunsa product? Thoda specific bolo — main ye samajh paaya: {names}.", "analysis": None, "provider": payload.provider}

    settings = db.query(models.BusinessSettings).filter(models.BusinessSettings.user_id == current_user.id).first()
    owner_name = (settings.owner_name if settings and settings.owner_name else "Vinayak Dhiman")

    safe = _safe_analysis(analysis)
    system_prompt = (
        "You are StockSathi, an AI assistant for a small Indian shop using StockSetu. "
        "Answer in Hinglish (Roman Hindi mixed with English) or Hindi if the user wrote Hindi. "
        "Be concise, practical and friendly like a shopkeeper's saathi. "
        "Never reveal internal IDs, codes or system details. "
        "Use only the provided product data; if data is missing, say so. "
        "Owner name: " + owner_name + "."
    )
    user_prompt = "Product data: " + json.dumps(safe, ensure_ascii=False) + "\\n\\nQuestion: " + question

    api_key = (payload.api_key or "").strip()
    env_name = {
        "groq": "GROQ_API_KEY",
        "grok": "GROK_API_KEY",
        "openai": "OPENAI_API_KEY",
        "ollama": "OLLAMA_BASE_URL",
    }.get(payload.provider, "STOCKSETU_LLM_API_KEY")
    # Ollama runs locally and needs no API key.
    if payload.provider == "ollama":
        base = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        endpoint = base + "/v1/chat/completions"
        default_model = "qwen2.5:0.5b"
        api_key = api_key or "ollama"
    elif payload.provider == "pollinations":
        endpoint = "https://text.pollinations.ai/openai"
        default_model = "openai-fast"
        api_key = api_key or "pollinations"
    else:
        api_key = (os.getenv(env_name) or os.getenv("STOCKSETU_LLM_API_KEY") or "").strip()
        if not api_key:
            raise HTTPException(status_code=400, detail=f"API key missing. Set {env_name} in backend/.env or paste key in StockSathi settings.")
        endpoint, default_model = _LLM_ENDPOINTS[payload.provider]

    model = payload.model or default_model
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 260,
    }
    req = urllib.request.Request(
        endpoint,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key,
        },
        method="POST",
    )
    def _open(req):
        ctx = None
        try:
            import certifi
            ctx = ssl.create_default_context(cafile=certifi.where())
        except Exception:
            ctx = ssl.create_default_context()
        try:
            return urllib.request.urlopen(req, timeout=25, context=ctx)
        except urllib.error.URLError as exc:
            if "CERTIFICATE_VERIFY_FAILED" in str(exc) and not os.getenv("VERCEL"):
                return urllib.request.urlopen(req, timeout=25, context=ssl._create_unverified_context())
            raise

    try:
        with _open(req) as resp:
            raw = resp.read().decode("utf-8")
        parsed = json.loads(raw)
        answer = parsed["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"LLM request failed ({exc.code}): {detail[:200]}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM request failed: {str(exc)[:200]}")

    return {"answer": answer, "analysis": analysis, "provider": payload.provider}


# ================= BUSINESS SETTINGS =================

def serialize_business_settings(settings, user):
    if settings is None:
        return {
            "business_name": "Store Workspace",
            "owner_name": user.email.split("@", 1)[0],
            "phone": "",
            "email": "",
            "address": "",
            "currency": "INR",
        }

    return {
        "business_name": settings.business_name,
        "owner_name": settings.owner_name,
        "phone": settings.phone,
        "email": settings.email,
        "address": settings.address,
        "currency": settings.currency,
    }


@app.get("/settings")
def get_business_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settings = db.query(models.BusinessSettings).filter(
        models.BusinessSettings.user_id == current_user.id
    ).first()
    return serialize_business_settings(settings, current_user)


@app.put("/settings")
def update_business_settings(
    values: schemas.BusinessSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    business_name = values.business_name.strip()
    owner_name = values.owner_name.strip()
    if not business_name or not owner_name:
        raise HTTPException(status_code=422, detail="Business name and owner name are required")

    settings = db.query(models.BusinessSettings).filter(
        models.BusinessSettings.user_id == current_user.id
    ).first()
    if settings is None:
        settings = models.BusinessSettings(user_id=current_user.id)

    settings.business_name = business_name
    settings.owner_name = owner_name
    settings.phone = values.phone.strip()
    settings.email = values.email.strip()
    settings.address = values.address.strip()
    settings.currency = values.currency.upper()

    db.add(settings)
    db.commit()
    db.refresh(settings)
    return serialize_business_settings(settings, current_user)


# ================= AUTHENTICATION =================

# Register - Public API
@app.post("/register", status_code=201)
def register_user(
    user: schemas.UserRegister,
    db: Session = Depends(get_db)
):
    normalized_email = user.email.strip().casefold()
    existing_user = db.query(models.User).filter(
        func.lower(models.User.email) == normalized_email
    ).first()

    if existing_user and existing_user.email_verified:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists. Log in instead."
        )

    now = datetime.now(timezone.utc)
    if existing_user is None:
        new_user = models.User(
            email=normalized_email,
            password_hash=hash_password(user.password),
            email_verified=False,
        )
        try:
            db.add(new_user)
            db.flush()
            db.add(models.BusinessSettings(
                user_id=new_user.id,
                business_name="Store Workspace",
                owner_name=normalized_email.split("@", 1)[0],
                email=normalized_email,
                currency="INR",
            ))
            existing_user = new_user
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists. Log in instead.",
            )

    # A repeat signup can request another link only after the resend cooldown.
    if existing_user.email_verification_sent_at:
        sent_at = existing_user.email_verification_sent_at
        if sent_at.tzinfo is None:
            sent_at = sent_at.replace(tzinfo=timezone.utc)
        remaining = 60 - (now - sent_at).total_seconds()
        if remaining > 0:
            if db.new or db.dirty:
                db.rollback()
            raise HTTPException(
                status_code=429,
                detail="A verification email was just requested. Please wait a minute before trying again.",
            )

    token = create_verification_token()
    existing_user.email_verification_token_hash = hash_verification_token(token)
    existing_user.email_verification_expires_at = now + timedelta(hours=24)
    existing_user.email_verification_sent_at = now
    try:
        db.commit()
        db.refresh(existing_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This account could not be created. Please try again.")

    email_sent = send_verification_email(existing_user.email, token)
    return {
        "message": "Account created. Verify your email to activate your account.",
        "user_id": existing_user.id,
        "verification_required": True,
        "email_sent": email_sent,
    }


# Login - Public API
@app.post("/login")
def login_user(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    normalized_email = user.email.strip().casefold()
    existing_user = db.query(models.User).filter(
        func.lower(models.User.email) == normalized_email
    ).first()

    if existing_user is None or not verify_password(user.password, existing_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not existing_user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in. Use the resend option to request a fresh link.",
        )

    token = create_access_token(existing_user.id)
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/auth/email/verify")
def verify_email_address(
    payload: schemas.EmailVerificationRequest,
    db: Session = Depends(get_db),
):
    token_hash = hash_verification_token(payload.token)
    user = db.query(models.User).filter(
        models.User.email_verification_token_hash == token_hash
    ).first()
    if user is None or user.email_verified or user.email_verification_expires_at is None:
        raise HTTPException(status_code=400, detail="This verification link is invalid or has already been used.")

    expires_at = user.email_verification_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This verification link has expired. Request a new one and try again.")

    user.email_verified = True
    user.email_verification_token_hash = None
    user.email_verification_expires_at = None
    user.email_verification_sent_at = None
    db.commit()
    return {"message": "Email verified. Your account is ready."}


@app.post("/auth/email/resend", status_code=202)
def resend_verification_email(
    payload: schemas.EmailResendRequest,
    db: Session = Depends(get_db),
):
    generic_message = "If this email has an account that needs verification, a fresh link will be sent shortly."
    user = db.query(models.User).filter(
        func.lower(models.User.email) == payload.email
    ).first()
    if user is None or user.email_verified:
        return {"message": generic_message}

    now = datetime.now(timezone.utc)
    if user.email_verification_sent_at:
        sent_at = user.email_verification_sent_at
        if sent_at.tzinfo is None:
            sent_at = sent_at.replace(tzinfo=timezone.utc)
        if (now - sent_at).total_seconds() < 60:
            raise HTTPException(
                status_code=429,
                detail="A verification email was just requested. Please wait a minute before trying again.",
            )

    token = create_verification_token()
    user.email_verification_token_hash = hash_verification_token(token)
    user.email_verification_expires_at = now + timedelta(hours=24)
    user.email_verification_sent_at = now
    db.commit()
    sent = send_verification_email(user.email, token)
    if not sent:
        raise HTTPException(
            status_code=503,
            detail="Email delivery is not configured yet. Please try again later.",
        )
    return {"message": generic_message}


# Google Identity Services configuration and sign-in/signup.
@app.get("/auth/google/config")
def google_auth_config():
    # OAuth client IDs are public identifiers; never return the client secret here.
    return {"client_id": GOOGLE_CLIENT_ID}


@app.post("/auth/google")
def google_login(
    payload: schemas.GoogleCredentialRequest,
    db: Session = Depends(get_db),
):
    claims = verify_google_credential(payload.credential)
    email = str(claims["email"]).strip().casefold()
    google_sub = str(claims["sub"])
    display_name = str(claims.get("name") or email.split("@", 1)[0]).strip()[:120]

    user = db.query(models.User).filter(models.User.google_sub == google_sub).first()
    if user is None:
        user = db.query(models.User).filter(func.lower(models.User.email) == email).first()
        if user is not None and user.google_sub and user.google_sub != google_sub:
            raise HTTPException(status_code=409, detail="This account is linked to a different Google identity.")
        if user is None:
            user = models.User(
                email=email,
                password_hash=hash_password(secrets.token_urlsafe(48)),
                google_sub=google_sub,
            )
            db.add(user)
            db.flush()
            db.add(models.BusinessSettings(
                user_id=user.id,
                business_name="Store Workspace",
                owner_name=display_name,
                email=email,
                currency="INR",
            ))
        else:
            # Google has verified this exact email, so link it to the existing account.
            user.google_sub = google_sub

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This Google account could not be linked. Please log in and try again.")

    user.email_verified = True
    db.commit()
    settings = db.query(models.BusinessSettings).filter(
        models.BusinessSettings.user_id == user.id
    ).first()
    token = create_access_token(user.id)
    return {
        "message": "Google sign-in successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "owner_name": settings.owner_name if settings else display_name,
        },
    }


@app.get("/auth/apple/config")
def apple_auth_config():
    return {"client_id": APPLE_CLIENT_ID}


@app.post("/auth/apple")
def apple_login(payload: schemas.AppleCredentialRequest, db: Session = Depends(get_db)):
    if not APPLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Sign in with Apple is not configured yet.")
    try:
        signing_key = jwt.PyJWKClient("https://appleid.apple.com/auth/keys").get_signing_key_from_jwt(payload.identity_token)
        claims = jwt.decode(
            payload.identity_token,
            signing_key.key,
            algorithms=["RS256"],
            audience=APPLE_CLIENT_ID,
            issuer="https://appleid.apple.com",
            leeway=10,
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Apple sign-in could not be verified. Please try again.")
    except Exception:
        raise HTTPException(status_code=503, detail="Could not reach Apple to verify your sign-in.")

    apple_sub = str(claims.get("sub") or "")
    email = str(claims.get("email") or "").strip().casefold()
    if not apple_sub or not claims.get("email_verified"):
        raise HTTPException(status_code=401, detail="Apple did not return a verified account identity.")
    display_name = email.split("@", 1)[0] if email else "StockSetu owner"
    user = db.query(models.User).filter(models.User.apple_sub == apple_sub).first()
    if user is None and email:
        user = db.query(models.User).filter(func.lower(models.User.email) == email).first()
        if user and user.apple_sub and user.apple_sub != apple_sub:
            raise HTTPException(status_code=409, detail="This account is linked to a different Apple identity.")
    if user is None:
        if not email:
            raise HTTPException(status_code=400, detail="Apple did not provide an email for first-time account setup.")
        user = models.User(email=email, password_hash=hash_password(secrets.token_urlsafe(48)), apple_sub=apple_sub, email_verified=True)
        db.add(user)
        db.flush()
        db.add(models.BusinessSettings(user_id=user.id, business_name="Store Workspace", owner_name=display_name, email=email, currency="INR"))
    else:
        user.apple_sub = apple_sub
        user.email_verified = True
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This Apple account could not be linked. Please try again.")
    settings = db.query(models.BusinessSettings).filter(models.BusinessSettings.user_id == user.id).first()
    return {
        "message": "Apple sign-in successful",
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"email": user.email, "owner_name": settings.owner_name if settings else display_name},
    }


# Vercel serves the committed public/ assets from its CDN. Keep this FastAPI
# function focused on API routes so it does not depend on a static directory
# that Vercel excludes from its runtime bundle.

# ================= BILLING / PLANS =================

def _http_open(req, timeout=25):
    ctx = None
    try:
        import certifi
        ctx = ssl.create_default_context(cafile=certifi.where())
    except Exception:
        ctx = ssl.create_default_context()
    try:
        return urllib.request.urlopen(req, timeout=timeout, context=ctx)
    except urllib.error.URLError as exc:
        if "CERTIFICATE_VERIFY_FAILED" in str(exc):
            return urllib.request.urlopen(req, timeout=timeout, context=ssl._create_unverified_context())
        raise


PLAN_PRICES_PAISE = {
    "silver":  {"monthly": 19900,  "yearly": 199900},
    "gold":    {"monthly": 49900,  "yearly": 499900},
    "diamond": {"monthly": 99900,  "yearly": 999900},
}

PLAN_ORDER = {"free": 0, "silver": 1, "gold": 2, "diamond": 3}

PLAN_DURATION_DAYS = {"monthly": 30, "yearly": 365}


def _get_or_create_subscription(db, user_id):
    sub = db.query(models.Subscription).filter(models.Subscription.user_id == user_id).first()
    if sub is None:
        sub = models.Subscription(user_id=user_id, tier="free", billing="monthly", status="active")
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub


@app.get("/billing/subscription")
def billing_subscription(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sub = _get_or_create_subscription(db, current_user.id)
    return {
        "tier": sub.tier,
        "billing": sub.billing,
        "status": sub.status,
        "expires_at": sub.expires_at.isoformat() if sub.expires_at else None,
    }


@app.post("/billing/downgrade")
def billing_downgrade(payload: schemas.BillingDowngrade, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    target = payload.tier.strip().lower()
    sub = _get_or_create_subscription(db, current_user.id)
    current = (sub.tier or "free").strip().lower()
    if PLAN_ORDER.get(target, 0) >= PLAN_ORDER.get(current, 0):
        raise HTTPException(status_code=400, detail="This is not a downgrade. Choose a lower plan.")
    sub.tier = target
    sub.billing = payload.billing or sub.billing or "monthly"
    sub.status = "active"
    sub.expires_at = None
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)
    return {"tier": sub.tier, "billing": sub.billing, "status": sub.status, "expires_at": None}


@app.post("/billing/create-order")
def billing_create_order(payload: schemas.BillingCreateOrder, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    tier = payload.tier
    billing = payload.billing or "monthly"
    if payload.amount is not None:
        amount = int(payload.amount)
        if amount < 100:
            raise HTTPException(status_code=400, detail="Minimum amount is 100 paise")
        if tier is None:
            tier = "silver"
    else:
        if tier not in PLAN_PRICES_PAISE:
            raise HTTPException(status_code=400, detail="Invalid plan (provide tier or amount)")
        amount = PLAN_PRICES_PAISE[tier][billing]
    if tier not in PLAN_PRICES_PAISE:
        tier = "silver"

    order_ref = payload.receipt or ("ORD-" + uuid.uuid4().hex[:12].upper())
    order = models.PaymentOrder(
        user_id=current_user.id,
        order_ref=order_ref,
        tier=tier,
        billing=billing,
        amount=amount,
        provider="manual",
        status="created",
        created_at=datetime.now(timezone.utc),
    )

    razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "").strip()
    razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").strip()
    if razorpay_key_id and razorpay_key_secret:
        order.provider = "razorpay"
        # Create Razorpay order
        rz_payload = {
            "amount": amount,
            "currency": "INR",
            "receipt": order_ref,
            "notes": {"order_ref": order_ref, "tier": tier, "billing": billing, "user_id": str(current_user.id)},
        }
        rz_auth = base64.b64encode(f"{razorpay_key_id}:{razorpay_key_secret}".encode("utf-8")).decode("ascii")
        rz_req = urllib.request.Request(
            "https://api.razorpay.com/v1/orders",
            data=json.dumps(rz_payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": "Basic " + rz_auth},
            method="POST",
        )
        try:
            with _http_open(rz_req, timeout=25) as resp:
                rz_parsed = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 401:
                raise HTTPException(
                    status_code=502,
                    detail="Razorpay authentication failed. API keys are invalid or disabled. Open Razorpay Dashboard → Test Mode → Settings → API Keys → Regenerate Key, then update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
                )
            raise HTTPException(status_code=502, detail=f"Razorpay order create failed: HTTP {exc.code}")
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Razorpay order create failed: {str(exc)[:200]}")
        rz_order_id = rz_parsed.get("id")
        if not rz_order_id:
            raise HTTPException(status_code=502, detail="Razorpay did not return an order id")
        order.provider_order_id = rz_order_id
        db.add(order)
        db.commit()
        db.refresh(order)
        return {
            "provider": "razorpay",
            "order_id": rz_order_id,
            "order_ref": order_ref,
            "amount": amount,
            "currency": "INR",
            "key_id": razorpay_key_id,
            "razorpay_order_id": rz_order_id,
        }

    phonepe_mid = os.getenv("PHONEPE_MERCHANT_ID")
    phonepe_salt = os.getenv("PHONEPE_SALT_KEY")
    phonepe_index = os.getenv("PHONEPE_SALT_INDEX", "1")
    phonepe_env = os.getenv("PHONEPE_ENV", "sandbox").lower()

    if phonepe_mid and phonepe_salt:
        order.provider = "phonepe"
        base = "https://api-preprod.phonepe.com/apis/pg-sandbox" if phonepe_env != "production" else "https://api.phonepe.com/apis/hermes"
        body = {
            "merchantId": phonepe_mid,
            "merchantTransactionId": order_ref,
            "merchantUserId": f"U{current_user.id}",
            "amount": amount,
            "redirectUrl": os.getenv("BILLING_REDIRECT_URL", "http://localhost:5500/#/dashboard") + f"?payment=success&order={order_ref}",
            "redirectMode": "REDIRECT",
            "callbackUrl": os.getenv("BILLING_WEBHOOK_URL", "http://localhost:8000/billing/webhook/phonepe"),
            "paymentInstrument": {"type": "PAY_PAGE"},
        }
        raw = json.dumps(body).encode("utf-8")
        b64 = base64.b64encode(raw).decode("ascii")
        x_verify = hashlib.sha256((b64 + "/pg/v1/pay" + phonepe_salt).encode("utf-8")).hexdigest() + "###" + phonepe_index
        db.add(order)
        db.commit()
        db.refresh(order)
        req = urllib.request.Request(
            base + "/pg/v1/pay",
            data=json.dumps({"request": b64}).encode("utf-8"),
            headers={"Content-Type": "application/json", "X-VERIFY": x_verify},
            method="POST",
        )
        try:
            with _http_open(req, timeout=25) as resp:
                parsed = json.loads(resp.read().decode("utf-8"))
            url = (parsed.get("data") or {}).get("instrumentResponse", {}).get("redirectInfo", {}).get("url")
            if not url:
                raise HTTPException(status_code=502, detail="PhonePe did not return a payment URL")
            return {"provider": "phonepe", "order_ref": order_ref, "amount": amount, "payment_url": url}
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"PhonePe create failed: {str(exc)[:200]}")

    paytm_mid = os.getenv("PAYTM_MERCHANT_ID")
    paytm_key = os.getenv("PAYTM_MERCHANT_KEY")
    paytm_env = os.getenv("PAYTM_ENV", "staging").lower()
    if paytm_mid and paytm_key:
        order.provider = "paytm"
        base = "https://securegw.paytm.in" if paytm_env != "staging" else "https://securegw-stage.paytm.in"
        callback = os.getenv("BILLING_WEBHOOK_URL", "http://localhost:8000/billing/webhook/paytm")
        redirect = os.getenv("BILLING_REDIRECT_URL", "http://localhost:5500/#/dashboard") + f"?payment=success&order={order_ref}"
        body = {
            "requestType": "Payment",
            "mid": paytm_mid,
            "websiteName": os.getenv("PAYTM_WEBSITE", "DEFAULT"),
            "orderId": order_ref,
            "txnAmount": {"value": f"{amount/100:.2f}", "currency": "INR"},
            "userInfo": {"custId": str(current_user.id)},
            "callbackUrl": callback,
        }
        try:
            import paytmchecksum
            checksum = paytmchecksum.generateSignature(json.dumps(body), paytm_key)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Paytm checksum failed: {str(exc)[:120]}")
        db.add(order)
        db.commit()
        db.refresh(order)
        req_body = {"body": body, "head": {"signature": checksum}}
        req = urllib.request.Request(
            f"{base}/theia/api/v1/initiateTransaction?mid={paytm_mid}&orderId={order_ref}",
            data=json.dumps(req_body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with _http_open(req, timeout=25) as resp:
                parsed = json.loads(resp.read().decode("utf-8"))
            result = (parsed.get("body") or {}).get("resultInfo") or {}
            if result.get("resultStatus") not in ("S", "TXN_SUCCESS"):
                raise HTTPException(status_code=502, detail=result.get("resultMsg", "Paytm initiate failed"))
            txn_token = (parsed.get("body") or {}).get("txnToken")
            if not txn_token:
                raise HTTPException(status_code=502, detail="Paytm did not return txnToken")
            return {"provider": "paytm", "order_ref": order_ref, "amount": amount, "mid": paytm_mid, "order_id": order_ref, "txn_token": txn_token, "base_url": base}
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Paytm create failed: {str(exc)[:200]}")

    # Manual UPI fallback (no merchant creds)
    vpa = os.getenv("STOCKSETU_UPI_VPA", "").strip() or "9467092793@ptyes"
    payee = os.getenv("STOCKSETU_UPI_NAME", "StockSetu")
    db.add(order)
    db.commit()
    db.refresh(order)
    upi_uri = f"upi://pay?pa={vpa}&pn={urllib.parse.quote(payee)}&am={amount/100:.2f}&cu=INR&tn={urllib.parse.quote(tier + ' plan')}"
    return {"provider": "manual", "order_ref": order_ref, "amount": amount, "currency": "INR", "upi_uri": upi_uri, "status": "created"}


import urllib.parse


@app.get("/billing/status/{order_ref}")
def billing_status(order_ref: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    order = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_ref == order_ref, models.PaymentOrder.user_id == current_user.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    # If phonepe and still created/pending, try to confirm via status API
    if order.provider == "phonepe" and order.status not in ("paid",):
        phonepe_mid = os.getenv("PHONEPE_MERCHANT_ID")
        phonepe_salt = os.getenv("PHONEPE_SALT_KEY")
        phonepe_index = os.getenv("PHONEPE_SALT_INDEX", "1")
        phonepe_env = os.getenv("PHONEPE_ENV", "sandbox").lower()
        if phonepe_mid and phonepe_salt:
            base = "https://api-preprod.phonepe.com/apis/pg-sandbox" if phonepe_env != "production" else "https://api.phonepe.com/apis/hermes"
            path = f"/pg/v1/status/{phonepe_mid}/{order_ref}"
            x_verify = hashlib.sha256((path + phonepe_salt).encode("utf-8")).hexdigest() + "###" + phonepe_index
            req = urllib.request.Request(base + path, headers={"Content-Type": "application/json", "X-VERIFY": x_verify, "X-MERCHANT-ID": phonepe_mid}, method="GET")
            try:
                with _http_open(req, timeout=20) as resp:
                    parsed = json.loads(resp.read().decode("utf-8"))
                state = ((parsed.get("data") or {}).get("state") or "").upper()
                if state == "COMPLETED":
                    _mark_order_paid(db, order, ((parsed.get("data") or {}).get("transactionId")))
            except Exception:
                pass
    if order.provider == "razorpay" and order.status not in ("paid",) and order.provider_order_id:
        razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "").strip()
        razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").strip()
        if razorpay_key_id and razorpay_key_secret:
            rz_auth = base64.b64encode(f"{razorpay_key_id}:{razorpay_key_secret}".encode("utf-8")).decode("ascii")
            req = urllib.request.Request(
                f"https://api.razorpay.com/v1/orders/{order.provider_order_id}",
                headers={"Authorization": "Basic " + rz_auth},
                method="GET",
            )
            try:
                with _http_open(req, timeout=20) as resp:
                    parsed = json.loads(resp.read().decode("utf-8"))
                status = (parsed.get("status") or "").lower()
                if status == "paid":
                    # fetch payments
                    req2 = urllib.request.Request(
                        f"https://api.razorpay.com/v1/orders/{order.provider_order_id}/payments",
                        headers={"Authorization": "Basic " + rz_auth},
                        method="GET",
                    )
                    with _http_open(req2, timeout=20) as resp2:
                        pdata = json.loads(resp2.read().decode("utf-8"))
                    items = (pdata.get("items") or [])
                    pid = items[0].get("id") if items else None
                    _mark_order_paid(db, order, pid)
            except Exception:
                pass
    if order.provider == "paytm" and order.status not in ("paid",):
        paytm_mid = os.getenv("PAYTM_MERCHANT_ID")
        paytm_key = os.getenv("PAYTM_MERCHANT_KEY")
        paytm_env = os.getenv("PAYTM_ENV", "staging").lower()
        if paytm_mid and paytm_key:
            base = "https://securegw.paytm.in" if paytm_env != "staging" else "https://securegw-stage.paytm.in"
            body = {"mid": paytm_mid, "orderId": order_ref}
            try:
                import paytmchecksum
                checksum = paytmchecksum.generateSignature(json.dumps(body), paytm_key)
                req_body = {"body": body, "head": {"signature": checksum}}
                req = urllib.request.Request(
                    f"{base}/v3/order/status",
                    data=json.dumps(req_body).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with _http_open(req, timeout=20) as resp:
                    parsed = json.loads(resp.read().decode("utf-8"))
                result = (parsed.get("body") or {}).get("resultInfo") or {}
                txn_status = ((parsed.get("body") or {}).get("txnStatus") or "").upper()
                if txn_status in ("TXN_SUCCESS", "SUCCESS"):
                    txn_id = (parsed.get("body") or {}).get("txnId")
                    _mark_order_paid(db, order, txn_id)
            except Exception:
                pass
    sub = _get_or_create_subscription(db, current_user.id)
    return {"order_ref": order.order_ref, "status": order.status, "tier": order.tier, "subscription_tier": sub.tier}


def _mark_order_paid(db, order, transaction_id=None):
    if order.status == "paid":
        return
    order.status = "paid"
    order.transaction_id = transaction_id or order.transaction_id
    order.paid_at = datetime.now(timezone.utc)
    sub = _get_or_create_subscription(db, order.user_id)
    sub.tier = order.tier
    sub.billing = order.billing
    sub.status = "active"
    sub.expires_at = datetime.now(timezone.utc) + timedelta(days=PLAN_DURATION_DAYS.get(order.billing, 30))
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()


@app.post("/billing/webhook/phonepe")
async def billing_webhook_phonepe(request: Request, db: Session = Depends(get_db)):
    phonepe_salt = os.getenv("PHONEPE_SALT_KEY")
    if not phonepe_salt:
        raise HTTPException(status_code=400, detail="PhonePe not configured")
    body = await request.body()
    x_verify = request.headers.get("x-verify", "")
    # body may be {"request": base64} or raw base64
    try:
        data = json.loads(body.decode("utf-8"))
        b64 = data.get("request", "")
    except Exception:
        b64 = body.decode("utf-8").strip().strip('"')
    calc = hashlib.sha256((b64 + phonepe_salt).encode("utf-8")).hexdigest()
    if not x_verify.startswith(calc):
        raise HTTPException(status_code=401, detail="Invalid signature")
    try:
        decoded = json.loads(base64.b64decode(b64).decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Bad payload")
    order_ref = decoded.get("merchantTransactionId")
    state = (decoded.get("state") or decoded.get("code") or "").upper()
    txn_id = decoded.get("transactionId")
    amount = decoded.get("amount")
    order = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_ref == order_ref).first()
    if order is None:
        return {"status": "ignored"}
    if amount is not None and int(amount) != int(order.amount):
        raise HTTPException(status_code=400, detail="Amount mismatch")
    if state in ("COMPLETED", "PAYMENT_SUCCESS", "SUCCESS"):
        _mark_order_paid(db, order, txn_id)
    return {"status": "ok"}


@app.post("/billing/confirm-manual")
def billing_confirm_manual(payload: schemas.BillingConfirmManual, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    order = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_ref == payload.order_ref, models.PaymentOrder.user_id == current_user.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == "paid":
        return {"status": "already_paid", "tier": order.tier}
    order.utr = payload.utr
    _mark_order_paid(db, order, None)
    order.utr = payload.utr
    db.commit()
    db.refresh(order)
    return {"status": "paid", "tier": order.tier}


@app.post("/billing/verify-razorpay")
def billing_verify_razorpay(payload: schemas.BillingVerifyRazorpay, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").strip()
    if not razorpay_key_secret:
        raise HTTPException(status_code=400, detail="Razorpay not configured")
    # Verify signature
    msg = (payload.razorpay_order_id + "|" + payload.razorpay_payment_id).encode("utf-8")
    expected = hmac.new(razorpay_key_secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, payload.razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid Razorpay signature")
    if payload.order_ref:
        order = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_ref == payload.order_ref, models.PaymentOrder.user_id == current_user.id).first()
    else:
        order = db.query(models.PaymentOrder).filter(models.PaymentOrder.provider_order_id == payload.razorpay_order_id, models.PaymentOrder.user_id == current_user.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.provider != "razorpay":
        raise HTTPException(status_code=400, detail="Order is not a Razorpay order")
    if order.provider_order_id and order.provider_order_id != payload.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Razorpay order mismatch")
    if order.status == "paid":
        sub = _get_or_create_subscription(db, current_user.id)
        return {"status": "already_paid", "tier": order.tier, "subscription_tier": sub.tier}
    # Optional: verify amount via Razorpay API
    _mark_order_paid(db, order, payload.razorpay_payment_id)
    order.utr = payload.razorpay_payment_id
    db.commit()
    db.refresh(order)
    sub = _get_or_create_subscription(db, current_user.id)
    return {"status": "paid", "tier": order.tier, "subscription_tier": sub.tier}


# --- /api aliases for standard integration paths ---
@app.post("/api/create-order")
def api_create_order(payload: schemas.BillingCreateOrder, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return billing_create_order(payload, db, current_user)


@app.post("/api/verify-payment")
def api_verify_payment(payload: schemas.BillingVerifyRazorpay, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return billing_verify_razorpay(payload, db, current_user)


@app.post("/billing/webhook/razorpay")
async def billing_webhook_razorpay(request: Request, db: Session = Depends(get_db)):
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "").strip()
    if not webhook_secret:
        raise HTTPException(status_code=400, detail="Razorpay webhook not configured")
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    expected = hmac.new(webhook_secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    try:
        data = json.loads(body.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Bad payload")
    event = data.get("event", "")
    if event not in ("payment.captured", "order.paid"):
        return {"status": "ignored", "event": event}
    payload = data.get("payload", {}) or {}
    payment = (payload.get("payment") or {}).get("entity") or {}
    order_entity = (payload.get("order") or {}).get("entity") or {}
    rz_order_id = payment.get("order_id") or order_entity.get("id")
    rz_payment_id = payment.get("id")
    amount = payment.get("amount")
    if not rz_order_id:
        return {"status": "ignored"}
    order = db.query(models.PaymentOrder).filter(models.PaymentOrder.provider_order_id == rz_order_id).first()
    if order is None:
        return {"status": "ignored"}
    if amount is not None and int(amount) != int(order.amount):
        raise HTTPException(status_code=400, detail="Amount mismatch")
    if order.status != "paid":
        _mark_order_paid(db, order, rz_payment_id)
    return {"status": "ok"}


@app.post("/billing/webhook/paytm")
async def billing_webhook_paytm(request: Request, db: Session = Depends(get_db)):
    paytm_key = os.getenv("PAYTM_MERCHANT_KEY")
    if not paytm_key:
        raise HTTPException(status_code=400, detail="Paytm not configured")
    # Paytm posts form-encoded params
    form = await request.form()
    params = {k: str(v) for k, v in form.items()}
    checksum = params.get("CHECKSUMHASH")
    if not checksum:
        # maybe JSON
        try:
            body = await request.json()
            params = {k: str(v) for k, v in body.items()}
            checksum = params.get("CHECKSUMHASH")
        except Exception:
            pass
    if not checksum:
        raise HTTPException(status_code=400, detail="Missing checksum")
    try:
        import paytmchecksum
        ok = paytmchecksum.verifySignature(params, paytm_key, checksum)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Paytm verify error: {str(exc)[:120]}")
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid signature")
    order_ref = params.get("ORDERID") or params.get("orderId")
    status = (params.get("STATUS") or params.get("status") or "").upper()
    txn_id = params.get("TXNID") or params.get("txnId")
    amount = params.get("TXNAMOUNT") or params.get("txnAmount")
    order = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_ref == order_ref).first()
    if order is None:
        return {"status": "ignored"}
    if amount is not None:
        try:
            if int(round(float(amount) * 100)) != int(order.amount):
                raise HTTPException(status_code=400, detail="Amount mismatch")
        except ValueError:
            pass
    if status in ("TXN_SUCCESS", "SUCCESS", "S"):
        _mark_order_paid(db, order, txn_id)
    return {"status": "ok"}
