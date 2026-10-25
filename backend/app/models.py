
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String(60), nullable=False, default="")
    category = Column(String)
    quantity = Column(Integer, default=0)
    unit = Column(String(30), nullable=False, default="pieces")
    cost_price = Column(Float)
    selling_price = Column(Float)
    supplier = Column(String(160), nullable=False, default="")
    min_stock = Column(Integer, default=5)

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(String)

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    product_id = Column(Integer, nullable=False)
    supplier_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_cost = Column(Float, nullable=False)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)


class BusinessSettings(Base):
    __tablename__ = "business_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    business_name = Column(String(120), nullable=False, default="Store Workspace")
    owner_name = Column(String(120), nullable=False)
    phone = Column(String(40), nullable=False, default="")
    email = Column(String(254), nullable=False, default="")
    address = Column(String(500), nullable=False, default="")
    currency = Column(String(3), nullable=False, default="INR")
