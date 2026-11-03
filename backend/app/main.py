
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, inspect, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models, schemas
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    GOOGLE_CLIENT_ID,
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
    for table_name in ("suppliers", "purchases", "sales"):
        columns = {column["name"] for column in inspect(engine).get_columns(table_name)}
        if "user_id" not in columns:
            connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN user_id INTEGER REFERENCES users(id)"))
        connection.execute(text(f"CREATE INDEX IF NOT EXISTS ix_{table_name}_user_id ON {table_name} (user_id)"))
    connection.execute(text("CREATE INDEX IF NOT EXISTS ix_products_user_id ON products (user_id)"))
    user_columns = {column["name"] for column in inspect(engine).get_columns("users")}
    for column_name, definition in (
        ("google_sub", "VARCHAR(255)"),
        # Preserve login access for accounts created before email verification existed.
        ("email_verified", "BOOLEAN NOT NULL DEFAULT TRUE"),
        ("email_verification_token_hash", "VARCHAR(64)"),
        ("email_verification_expires_at", "TIMESTAMP WITH TIME ZONE"),
        ("email_verification_sent_at", "TIMESTAMP WITH TIME ZONE"),
    ):
        if column_name not in user_columns:
            connection.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {definition}"))
    connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_sub ON users (google_sub)"))
    connection.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email_verification_token_hash ON users (email_verification_token_hash)"))

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
    new_product = models.Product(**product.model_dump(), user_id=current_user.id)
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
    new_purchase = models.Purchase(user_id=current_user.id, product_id=product.id, supplier_id=supplier.id, quantity=purchase.quantity, total_cost=total)
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
    new_sale = models.Sale(user_id=current_user.id, product_id=product.id, quantity=sale.quantity, total_amount=total)
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
    raise HTTPException(status_code=410, detail="Email/password signup is disabled. Continue with Google to create an account.")
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
    raise HTTPException(status_code=410, detail="Email/password login is disabled. Please sign in with Google.")
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


# Vercel serves the committed public/ assets from its CDN. Keep this FastAPI
# function focused on API routes so it does not depend on a static directory
# that Vercel excludes from its runtime bundle.
