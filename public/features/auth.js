/* auth feature module. */
let googleIdentityScriptPromise;

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleIdentityScriptPromise) {
    googleIdentityScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Google sign-in could not load. Check your connection and try again.'));
      document.head.appendChild(script);
    });
  }
  return googleIdentityScriptPromise;
}

function loadAppleIdentityScript() {
  if (window.AppleID?.auth) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Apple sign-in could not load. Check your connection and try again.'));
    document.head.appendChild(script);
  });
}

async function setupAppleSignIn(flow) {
  const section = document.querySelector(`#apple-login-${flow}`);
  const button = document.querySelector(`#apple-button-${flow}`);
  if (!section || !button) return;
  section.hidden = false;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/apple/config`);
    if (!response.ok) { button.disabled = true; button.innerHTML = '<span aria-hidden="true"></span> Apple ID · setup required'; return; }
    const config = await response.json();
    if (!config.client_id) { button.disabled = true; button.innerHTML = '<span aria-hidden="true"></span> Apple ID · setup required'; return; }
    await loadAppleIdentityScript();
    if (!section.isConnected || !window.AppleID?.auth) return;
    button.disabled = false;
    button.addEventListener('click', async () => {
      const errorBox = document.querySelector(`#${flow}-error`);
      errorBox.hidden = true;
      try {
        window.AppleID.auth.init({ clientId: config.client_id, scope: 'name email', redirectURI: location.origin, usePopup: true });
        const result = await window.AppleID.auth.signIn();
        const authResponse = await fetch(`${API_BASE_URL}/auth/apple`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity_token: result.authorization.id_token }),
        });
        const data = await authResponse.json().catch(() => ({}));
        if (!authResponse.ok) throw new Error(data.detail || 'Apple sign-in failed.');
        if (!data.access_token) throw new Error('The backend did not return an access token.');
        sessionStorage.removeItem('stocksetu-token');
        localStorage.setItem('stocksetu-token', data.access_token);
        localStorage.setItem('stocksetu-user', data.user?.email || '');
        state.settings = { ...seed.settings, owner: data.user?.owner_name || (data.user?.email || '').split('@', 1)[0] };
        saveStore('settings');
        location.hash = '#/dashboard';
      } catch (error) {
        errorBox.textContent = error.message || 'Apple sign-in could not be completed.';
        errorBox.hidden = false;
      }
    });
  } catch (error) {
    const errorBox = document.querySelector(`#${flow}-error`);
    if (errorBox) { errorBox.textContent = error.message || 'Apple sign-in could not be loaded.'; errorBox.hidden = false; }
  }
}

async function setupGoogleSignIn(flow) {
  const section = document.querySelector(`#google-login-${flow}`);
  const button = document.querySelector(`#google-button-${flow}`);
  if (!section || !button) return;
  try {
    const configResponse = await fetch(`${API_BASE_URL}/auth/google/config`);
    if (!configResponse.ok) return;
    const config = await configResponse.json();
    if (!config.client_id) return;
    await loadGoogleIdentityScript();
    if (!section.isConnected || !window.google?.accounts?.id) return;

    window.stockSetuGoogleFlow = flow;
    window.google.accounts.id.initialize({
      client_id: config.client_id,
      callback: handleGoogleCredential,
      auto_select: false,
      itp_support: true,
    });
    section.hidden = false;
    window.google.accounts.id.renderButton(button, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: flow === 'register' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
      width: Math.min(Math.floor(button.clientWidth || 360), 400),
    });
  } catch (error) {
    const errorBox = document.querySelector(`#${flow === 'register' ? 'register-error' : 'login-error'}`);
    if (errorBox) {
      errorBox.textContent = error.message || 'Google sign-in could not be loaded.';
      errorBox.hidden = false;
    }
  }
}

async function handleGoogleCredential(response) {
  const flow = window.stockSetuGoogleFlow || 'login';
  const errorBox = document.querySelector(`#${flow === 'register' ? 'register-error' : 'login-error'}`);
  if (!response?.credential || !errorBox) return;
  errorBox.hidden = true;
  try {
    const result = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    const data = await result.json().catch(() => ({}));
    if (!result.ok) throw new Error(data.detail || `Google sign-in failed (${result.status}).`);
    if (!data.access_token) throw new Error('The backend did not return an access token.');

    sessionStorage.removeItem('stocksetu-token');
    localStorage.setItem('stocksetu-token', data.access_token);
    const email = data.user?.email || '';
    localStorage.setItem('stocksetu-user', email);
    state.settings = { ...seed.settings, owner: data.user?.owner_name || email.split('@', 1)[0] };
    saveStore('settings');
    location.hash = '#/dashboard';
  } catch (error) {
    errorBox.textContent = error.message || 'Google sign-in could not be completed.';
    errorBox.hidden = false;
    errorBox.style.display = 'block';
  }
}

function renderLogin() {
  root.innerHTML = `<main class="login-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">Your business, one place</span><h1>Make room for <em>better business.</em></h1><p>Bring stock, sales and supplier records together. Start with a clear view of what’s happening today.</p><div class="login-aside-points"><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Sales made simple</span><span>${icon('check')} Reports that help</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Welcome back</span><h2>Log in to StockSetu</h2><p class="login-subtitle">Sign in securely with your account.</p><div class="form-error" id="login-error" role="alert" hidden></div><div class="social-login google-only" id="google-login-login" hidden><div class="google-signin" id="google-button-login"></div></div><div class="social-login provider-login" id="apple-login-login"><button class="apple-signin" id="apple-button-login" type="button"><span aria-hidden="true"></span> Continue with Apple</button><small class="provider-status">Available across devices after Apple Developer setup.</small><button class="brand-signin-pending" type="button" disabled>Samsung Account · integration setup required</button></div><div class="login-demo"><strong>Workspace access:</strong> Sign in with the account linked to your StockSetu workspace. New accounts are created automatically.</div><div class="login-bottom">New to StockSetu? <a class="text-btn" href="#/register">Create an account</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  setupGoogleSignIn('login');
  setupAppleSignIn('login');
}

function renderRegister() {
  root.innerHTML = `<main class="login-page register-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">A clear start</span><h1>One place for <em>your business.</em></h1><p>Create your StockSetu account to keep your stock and daily records together.</p><div class="login-aside-points"><span>${icon('check')} Your own login</span><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Business records in one place</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Get started</span><h2>Create your account</h2><p class="login-subtitle">Continue with your account to create your secure workspace.</p><div class="form-error" id="register-error" role="alert" hidden></div><div class="social-login google-only" id="google-login-register" hidden><div class="google-signin" id="google-button-register"></div></div><div class="social-login provider-login" id="apple-login-register"><button class="apple-signin" id="apple-button-register" type="button"><span aria-hidden="true"></span> Sign up with Apple</button><small class="provider-status">Available across devices after Apple Developer setup.</small><button class="brand-signin-pending" type="button" disabled>Samsung Account · integration setup required</button></div><div class="login-demo"><strong>One tap to get started:</strong> Your verified account creates your StockSetu workspace automatically.</div><div class="login-bottom">Already have an account? <a class="text-btn" href="#/login">Log in</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  setupGoogleSignIn('register');
  setupAppleSignIn('register');
}



const navGroups = [
  { label: 'Workspace', items: [ ['Overview','grid'], ['Inventory','box'], ['Stock history','clock'], ['Sales & invoices','receipt'], ['Purchases','cart'] ] },
  { label: 'Relationships', items: [ ['Customers','users'], ['Suppliers','truck'] ] },
  { label: 'Insights', items: [ ['Reports','chart'] ] },
];


async function renderEmailVerification(token) {
  root.innerHTML = `<main class="login-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">One last step</span><h1>Verify your <em>email.</em></h1><p>Confirm your email address to activate your StockSetu workspace.</p></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Email verification</span><h2 id="email-verify-title">Checking your link…</h2><p class="login-subtitle" id="email-verify-copy">Please wait while we verify your email address.</p><div class="form-error" id="email-verify-error" role="alert" hidden></div><a class="btn login-submit" id="email-verify-login" href="#/login" hidden>Go to login ${icon('arrow')}</a><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  const title = document.querySelector('#email-verify-title');
  const copy = document.querySelector('#email-verify-copy');
  const error = document.querySelector('#email-verify-error');
  const login = document.querySelector('#email-verify-login');
  if (!token) {
    title.textContent = 'Verification link missing';
    copy.textContent = 'Create an account or request another verification link from the login page.';
    error.textContent = 'This link does not contain a verification token.';
    error.hidden = false;
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/email/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || 'This verification link could not be used.');
    title.textContent = 'Email verified';
    copy.textContent = 'Your StockSetu account is active. You can log in now.';
    login.hidden = false;
  } catch (verificationError) {
    title.textContent = 'Link could not be verified';
    copy.textContent = 'The link may have expired or already been used. Open the login page to request another one.';
    error.textContent = verificationError.message || 'This verification link could not be used.';
    error.hidden = false;
  }
}
