
from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    quantity = Column(Integer, default=0)
    cost_price = Column(Float)
    selling_price = Column(Float)
    min_stock = Column(Integer, default=5)
