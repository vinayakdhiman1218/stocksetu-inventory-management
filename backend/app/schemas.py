
import re
from datetime import datetime
from typing import Optional

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
    supplier_id: Optional[int] = Field(default=None, gt=0)
    supplier_name: Optional[str] = Field(default=None, max_length=160)
    quantity: int = Field(gt=0)
    unit_cost: float = Field(ge=0)

class SaleCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    unit_price: Optional[float] = Field(default=None, ge=0)

class AssistantAsk(BaseModel):
    question: str = Field(default="", max_length=500)
    product_id: int | None = None

class AssistantLLM(BaseModel):
    question: str = Field(default="", max_length=500)
    product_id: int | None = None
    api_key: str | None = Field(default=None, max_length=256)
    provider: str = Field(default="groq", pattern="^(groq|openai|grok|ollama|pollinations)$")
    model: str | None = None


class BillingCreateOrder(BaseModel):
    tier: str | None = Field(default=None, pattern="^(silver|gold|diamond)$")
    billing: str = Field(default="monthly", pattern="^(monthly|yearly)$")
    amount: int | None = Field(default=None, ge=100)
    currency: str = Field(default="INR")
    receipt: str | None = Field(default=None, max_length=64)


class BillingDowngrade(BaseModel):
    tier: str = Field(pattern="^(free|silver|gold|diamond)$")
    billing: str = Field(default="monthly", pattern="^(monthly|yearly)$")


class BillingConfirmManual(BaseModel):
    order_ref: str = Field(min_length=6, max_length=64)
    utr: str = Field(min_length=6, max_length=40)


class BillingVerifyRazorpay(BaseModel):
    order_ref: str | None = Field(default=None, max_length=64)
    razorpay_payment_id: str = Field(min_length=6, max_length=64)
    razorpay_order_id: str = Field(min_length=6, max_length=64)
    razorpay_signature: str = Field(min_length=16, max_length=256)


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


class EmailVerificationRequest(BaseModel):
    token: str = Field(min_length=20, max_length=256)


class EmailResendRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().casefold()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", normalized):
            raise ValueError("Enter a valid email address")
        return normalized


class GoogleCredentialRequest(BaseModel):
    credential: str = Field(min_length=20, max_length=10000)


class AppleCredentialRequest(BaseModel):
    identity_token: str = Field(min_length=20, max_length=10000)


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


class ForgotPasswordRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=10, max_length=200)
    new_password: str = Field(min_length=8, max_length=128)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=10, max_length=500)


class TeamMemberCreate(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    role: str = Field(default="viewer", pattern="^(admin|biller|accountant|stock_keeper|viewer)$")


class TeamMemberOut(BaseModel):
    id: int
    email: str
    role: str
    status: str


class AuditLogOut(BaseModel):
    id: int
    action: str
    target: Optional[str] = None
    detail: Optional[str] = None
    created_at: Optional[datetime] = None


class WhatsAppSettingsUpdate(BaseModel):
    enabled: bool = False
    phone: str = Field(default="", max_length=40)
    low_stock_alerts: bool = True
    due_invoice_alerts: bool = True
    daily_summary: bool = False


class WhatsAppSettingsOut(BaseModel):
    enabled: bool
    phone: str
    low_stock_alerts: bool
    due_invoice_alerts: bool
    daily_summary: bool
