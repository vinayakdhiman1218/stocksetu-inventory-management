
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models, schemas
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(title="StockSetu Inventory Management")

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
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
@app.post("/products", dependencies=[Depends(get_current_user)])
def add_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = models.Product(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product added successfully",
        "product_id": new_product.id
    }


# View All Products
@app.get("/products", dependencies=[Depends(get_current_user)])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products


# Update Product
@app.put("/products/{product_id}", dependencies=[Depends(get_current_user)])
def update_product(
    product_id: int,
    updated_product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.category = updated_product.category
    product.quantity = updated_product.quantity
    product.cost_price = updated_product.cost_price
    product.selling_price = updated_product.selling_price
    product.min_stock = updated_product.min_stock

    db.commit()
    db.refresh(product)

    return {"message": "Product updated successfully"}


# Delete Product
@app.delete("/products/{product_id}", dependencies=[Depends(get_current_user)])
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


# ================= SUPPLIERS =================

# Add Supplier
@app.post("/suppliers", dependencies=[Depends(get_current_user)])
def add_supplier(
    supplier: schemas.SupplierCreate,
    db: Session = Depends(get_db)
):
    new_supplier = models.Supplier(**supplier.model_dump())

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return {
        "message": "Supplier added successfully",
        "supplier_id": new_supplier.id
    }


# View All Suppliers
@app.get("/suppliers", dependencies=[Depends(get_current_user)])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()


# Update Supplier
@app.put("/suppliers/{supplier_id}", dependencies=[Depends(get_current_user)])
def update_supplier(
    supplier_id: int,
    updated_supplier: schemas.SupplierCreate,
    db: Session = Depends(get_db)
):
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id
    ).first()

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    supplier.name = updated_supplier.name
    supplier.phone = updated_supplier.phone
    supplier.email = updated_supplier.email
    supplier.address = updated_supplier.address

    db.commit()
    db.refresh(supplier)

    return {"message": "Supplier updated successfully"}


# Delete Supplier
@app.delete("/suppliers/{supplier_id}", dependencies=[Depends(get_current_user)])
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == supplier_id
    ).first()

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    db.delete(supplier)
    db.commit()

    return {"message": "Supplier deleted successfully"}


# ================= PURCHASES =================

# Add Purchase - Increase Stock
@app.post("/purchases", dependencies=[Depends(get_current_user)])
def add_purchase(
    purchase: schemas.PurchaseCreate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == purchase.product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    supplier = db.query(models.Supplier).filter(
        models.Supplier.id == purchase.supplier_id
    ).first()

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    total = purchase.quantity * purchase.unit_cost

    new_purchase = models.Purchase(
        product_id=purchase.product_id,
        supplier_id=purchase.supplier_id,
        quantity=purchase.quantity,
        total_cost=total
    )

    # Increase product quantity
    product.quantity += purchase.quantity

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)

    return {
        "message": "Purchase added successfully",
        "purchase_id": new_purchase.id,
        "total_cost": total,
        "updated_stock": product.quantity
    }


# View Purchase History
@app.get("/purchases", dependencies=[Depends(get_current_user)])
def get_purchases(db: Session = Depends(get_db)):
    return db.query(models.Purchase).all()


# ================= SALES =================

# Add Sale - Decrease Stock
@app.post("/sales", dependencies=[Depends(get_current_user)])
def add_sale(
    sale: schemas.SaleCreate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == sale.product_id
    ).first()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Prevent sales when stock is insufficient
    if product.quantity < sale.quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    total = sale.quantity * product.selling_price

    new_sale = models.Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        total_amount=total
    )

    # Reduce product quantity
    product.quantity -= sale.quantity

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return {
        "message": "Sale recorded successfully",
        "sale_id": new_sale.id,
        "total_amount": total,
        "remaining_stock": product.quantity
    }


# View Sales History
@app.get("/sales", dependencies=[Depends(get_current_user)])
def get_sales(db: Session = Depends(get_db)):
    return db.query(models.Sale).all()


# ================= DASHBOARD =================

@app.get("/dashboard", dependencies=[Depends(get_current_user)])
def get_dashboard(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    sales = db.query(models.Sale).all()
    purchases = db.query(models.Purchase).all()

    return {
        "total_products": len(products),
        "total_stock": sum(p.quantity for p in products),
        "total_sales": sum(s.total_amount for s in sales),
        "total_purchases": sum(p.total_cost for p in purchases),
        "low_stock_products": sum(
            1 for p in products
            if p.quantity <= p.min_stock
        )
    }


# ================= LOW STOCK ALERTS =================

@app.get("/alerts", dependencies=[Depends(get_current_user)])
def get_low_stock_alerts(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()

    low_stock_products = []

    for product in products:
        if product.quantity <= product.min_stock:
            low_stock_products.append({
                "id": product.id,
                "name": product.name,
                "quantity": product.quantity,
                "min_stock": product.min_stock
            })

    return low_stock_products


# ================= AUTHENTICATION =================

# Register - Public API
@app.post("/register", status_code=201)
def register_user(
    user: schemas.UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# Login - Public API
@app.post("/login")
def login_user(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(existing_user.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


# Serve the existing frontend from Vercel's CDN while keeping API routes on
# this same origin. The build step copies the root static files into public/.
app.frontend("/", directory="public")
