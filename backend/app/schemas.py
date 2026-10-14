
from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str
    category: str
    quantity: int = Field(ge=0)
    cost_price: float = Field(ge=0)
    selling_price: float = Field(ge=0)
    min_stock: int = Field(default=5, ge=0)
