
from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str
    category: str
    quantity: int = Field(ge=0)
    cost_price: float = Field(ge=0)
    selling_price: float = Field(ge=0)
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
    email: str
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: str
    password: str
