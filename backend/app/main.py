
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models, schemas

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(title="StockSetu Inventory Management")


# Home API
@app.get("/")
def home():
    return {
        "message": "StockSetu Backend is running!",
        "status": "success"
    }


# Add Product API
@app.post("/products")
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


# View All Products API
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

# Update Product API
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if product is None:
        return {"message": "Product not found"}

    product.name = updated_product.name
    product.category = updated_product.category
    product.quantity = updated_product.quantity
    product.cost_price = updated_product.cost_price
    product.selling_price = updated_product.selling_price
    product.min_stock = updated_product.min_stock

    db.commit()
    db.refresh(product)

    return {"message": "Product updated successfully"}

# Delete Product API
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if product is None:
        return {"message": "Product not found"}

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

