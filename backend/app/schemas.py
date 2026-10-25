
import re

from pydantic import BaseModel, Field, field_validator

class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    sku: str = Field(default="", max_length=60)
    category: str = Field(default="Uncategorized", max_length=100)
    quantity: int = Field(ge=0)
    unit: str = Field(default="pieces", min_length=1, max_length=30)
    cost_price: float = Field(ge=0)
    selling_price: float = Field(ge=0)
    supplier: str = Field(default="", max_length=160)
    min_stock: int = Field(default=5, ge=0)



class SupplierCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class PurchaseCreate(BaseModel):
    product_id: int = Field(gt=0)
    supplier_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    unit_cost: float = Field(ge=0)

class SaleCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class UserRegister(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().casefold()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", normalized):
            raise ValueError("Enter a valid email address")
        return normalized


class UserLogin(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().casefold()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", normalized):
            raise ValueError("Enter a valid email address")
        return normalized


class BusinessSettingsUpdate(BaseModel):
    business_name: str = Field(min_length=1, max_length=120)
    owner_name: str = Field(min_length=1, max_length=120)
    phone: str = Field(default="", max_length=40)
    email: str = Field(default="", max_length=254)
    address: str = Field(default="", max_length=500)
    currency: str = Field(default="INR", min_length=3, max_length=3)
