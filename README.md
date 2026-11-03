# StockSetu

StockSetu is a capstone prototype for everyday inventory, billing and supplier workflows.

## Google sign-in setup

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth client ID for a **Web application**.
2. Add the exact deployed StockSetu origin under **Authorized JavaScript origins** (for example, `https://your-domain.vercel.app`). For local development, add `http://localhost:5500` or the actual local origin you use. Google Identity Services requires HTTPS outside localhost.
3. Set `STOCKSETU_GOOGLE_CLIENT_ID` to that client ID in the backend environment for local development and in Vercel Production (and Preview if needed). `GOOGLE_CLIENT_ID` remains a supported fallback. Do not add a Google client secret to frontend code; this integration does not need one.
4. Redeploy the backend/frontend after setting the variable. The login and signup pages show Google's official button only when the backend reports that a client ID is configured.

Google ID tokens are verified server-side for signature, expiry, issuer, audience, and verified email. First-time Google users receive a StockSetu account and business settings; a verified matching email links Google sign-in to an existing StockSetu account.
