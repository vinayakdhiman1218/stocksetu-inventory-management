"""Email verification token and SMTP delivery helpers."""

import html
import logging
import os
import secrets
import smtplib
import ssl
from email.message import EmailMessage
from urllib.parse import quote

logger = logging.getLogger(__name__)


def create_verification_token() -> str:
    return secrets.token_urlsafe(36)


def hash_verification_token(token: str) -> str:
    import hashlib
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def send_verification_email(recipient: str, token: str) -> bool:
    """Deliver a one-time verification link; return False when SMTP is not configured."""
    host = os.getenv("SMTP_HOST", "").strip()
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    sender = os.getenv("SMTP_FROM_EMAIL", username).strip()
    if not host or not username or not password or not sender:
        logger.warning("Email verification is not sent because SMTP settings are incomplete")
        return False

    base_url = os.getenv("APP_BASE_URL", "").strip()
    if not base_url:
        if os.getenv("VERCEL"):
            vercel_domain = os.getenv("VERCEL_PROJECT_PRODUCTION_URL", "").strip()
            base_url = f"https://{vercel_domain}" if vercel_domain else "https://stocksetu-inventory-management.vercel.app"
        else:
            base_url = "http://localhost:5500"
    verify_url = f"{base_url.rstrip('/')}/#/verify-email?token={quote(token)}"

    safe_url = html.escape(verify_url, quote=True)
    message = EmailMessage()
    message["Subject"] = "Verify your StockSetu email"
    message["From"] = f"StockSetu <{sender}>"
    message["To"] = recipient
    message.set_content(
        "Welcome to StockSetu. Verify your email by opening this link:\n\n"
        f"{verify_url}\n\nThis link expires in 24 hours. If you did not create this account, ignore this email."
    )
    message.add_alternative(
        "<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1b2821'>"
        "<h1 style='color:#176b49'>Verify your StockSetu email</h1>"
        "<p>Confirm this email address to activate your StockSetu account.</p>"
        f'<p><a href="{safe_url}" style="display:inline-block;padding:14px 22px;border-radius:8px;background:#176b49;color:white;text-decoration:none">Verify email</a></p>'
        "<p>This link expires in 24 hours. If you did not create this account, you can ignore this email.</p>"
        "</div>",
        subtype="html",
    )

    port = int(os.getenv("SMTP_PORT", "587"))
    use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().casefold() in {"1", "true", "yes"}
    use_starttls = os.getenv("SMTP_USE_STARTTLS", "true").strip().casefold() in {"1", "true", "yes"}
    try:
        if use_ssl:
            with smtplib.SMTP_SSL(host, port, timeout=15, context=ssl.create_default_context()) as server:
                server.login(username, password)
                server.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=15) as server:
                server.ehlo()
                if use_starttls:
                    server.starttls(context=ssl.create_default_context())
                    server.ehlo()
                server.login(username, password)
                server.send_message(message)
    except (OSError, smtplib.SMTPException):
        logger.exception("Email verification delivery failed")
        return False
    return True
