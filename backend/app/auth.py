
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from . import models
from .database import get_db


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    if os.getenv("VERCEL"):
        raise RuntimeError("Set JWT_SECRET_KEY in the Vercel project environment variables.")
    SECRET_KEY = "stocksetu-local-development-only-change-before-deploying"

ALGORITHM = "HS256"
ACCESS_TOKEN_TTL_HOURS = int(os.getenv("ACCESS_TOKEN_TTL_HOURS", "12"))
password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(password, hashed_password)
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_TTL_HOURS)
    payload = {"sub": str(user_id), "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# JWT Token Verification
security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        if credentials is None:
            raise HTTPException(status_code=401, detail="Please log in to continue")

        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = int(payload["sub"])

    except (jwt.PyJWTError, ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user
    
def verify_google_credential(credential: str) -> dict:
    """Validate a Google ID token (signature, expiry, audience) and return its claims."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=503,
            detail="Google sign-in is not configured on the server.",
        )

    try:
        from google.auth.exceptions import GoogleAuthError
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token

        claims = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10,
        )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Google sign-in could not be verified. Please try again.",
        )
    except GoogleAuthError:
        # Google's certificate server could not be reached.
        raise HTTPException(
            status_code=503,
            detail="Could not reach Google to verify your sign-in. Please try again.",
        )

    if not claims.get("email") or not claims.get("email_verified"):
        raise HTTPException(
            status_code=401,
            detail="Your Google account's email address is not verified.",
        )

    return claims
    
