
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Float, ForeignKey, text
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
    created_at = Column(DateTime(timezone=True), nullable=True)

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
    created_at = Column(DateTime(timezone=True), nullable=True)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    google_sub = Column(String(255), unique=True, nullable=True)
    apple_sub = Column(String(255), unique=True, nullable=True)
    # Existing accounts are grandfathered as verified by the additive DB migration.
    email_verified = Column(Boolean, nullable=False, default=True, server_default=text("true"))
    email_verification_token_hash = Column(String(64), nullable=True, unique=True)
    email_verification_expires_at = Column(DateTime(timezone=True), nullable=True)
    email_verification_sent_at = Column(DateTime(timezone=True), nullable=True)
    password_reset_token_hash = Column(String(64), nullable=True, unique=True, index=True)
    password_reset_expires_at = Column(DateTime(timezone=True), nullable=True)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    tier = Column(String(20), nullable=False, default="free")
    billing = Column(String(10), nullable=False, default="monthly")
    status = Column(String(20), nullable=False, default="active")
    expires_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    email = Column(String(254), nullable=False)
    role = Column(String(40), nullable=False, default="viewer")
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), nullable=True)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(64), nullable=False, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(80), nullable=False)
    target = Column(String(120), nullable=True)
    detail = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)


class WhatsAppSettings(Base):
    __tablename__ = "whatsapp_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    enabled = Column(Boolean, nullable=False, default=False)
    phone = Column(String(40), nullable=False, default="")
    low_stock_alerts = Column(Boolean, nullable=False, default=True)
    due_invoice_alerts = Column(Boolean, nullable=False, default=True)
    daily_summary = Column(Boolean, nullable=False, default=False)
    updated_at = Column(DateTime(timezone=True), nullable=True)


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_ref = Column(String(64), unique=True, nullable=False, index=True)
    tier = Column(String(20), nullable=False)
    billing = Column(String(10), nullable=False, default="monthly")
    amount = Column(Integer, nullable=False)  # paise
    provider = Column(String(20), nullable=False, default="manual")
    status = Column(String(20), nullable=False, default="created")
    transaction_id = Column(String(120), unique=True, nullable=True)
    provider_order_id = Column(String(120), nullable=True, index=True)
    utr = Column(String(60), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)


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
