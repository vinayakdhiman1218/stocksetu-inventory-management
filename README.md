# StockSetu

StockSetu is a capstone prototype for everyday inventory, billing and supplier workflows.

## Google sign-in setup

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth client ID for a **Web application**.
2. Add the exact deployed StockSetu origin under **Authorized JavaScript origins** (for example, `https://your-domain.vercel.app`). For local development, add `http://localhost:5500` or the actual local origin you use. Google Identity Services requires HTTPS outside localhost.
3. Set `STOCKSETU_GOOGLE_CLIENT_ID` to that client ID in the backend environment for local development and in Vercel Production (and Preview if needed). `GOOGLE_CLIENT_ID` remains a supported fallback. Do not add a Google client secret to frontend code; this integration does not need one.
4. Redeploy the backend/frontend after setting the variable. The login and signup pages show Google's official button only when the backend reports that a client ID is configured.

Google ID tokens are verified server-side for signature, expiry, issuer, audience, and verified email. First-time Google users receive a StockSetu account and business settings; a verified matching email links Google sign-in to an existing StockSetu account.


## Email verification for password signups

Password-based signup creates a pending account and emails a one-time verification link. The link expires after 24 hours; users can request a replacement after a 60-second cooldown. Existing accounts remain verified, and Google sign-in remains verified by Google's ID token.

Configure these variables in the backend environment and in Vercel Production (and Preview if you use it):

```env
SMTP_HOST=<your SMTP server>
SMTP_PORT=587
SMTP_USERNAME=<SMTP login>
SMTP_PASSWORD=<SMTP password or app password>
SMTP_FROM_EMAIL=<verified sender address>
APP_BASE_URL=https://stocksetu-inventory-management.vercel.app
```

Port 587 uses STARTTLS by default. For an SSL-only SMTP service, set `SMTP_USE_SSL=true` and its SSL port (commonly 465). Keep credentials in environment variables; never commit them. Until SMTP is configured, signup will clearly report that it could not send the email and the pending account cannot log in.
