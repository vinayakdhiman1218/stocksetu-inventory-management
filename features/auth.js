/* auth feature module. */
let googleIdentityScriptPromise;
let googleClientConfigPromise;

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleIdentityScriptPromise) {
    googleIdentityScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        googleIdentityScriptPromise = null;
        reject(new Error('Google sign-in could not load. Check your connection and try again.'));
      };
      document.head.appendChild(script);
    });
  }
  return googleIdentityScriptPromise;
}

function loadGoogleClientConfig() {
  if (!googleClientConfigPromise) {
    googleClientConfigPromise = fetch(`${API_BASE_URL}/auth/google/config`)
      .then(response => {
        if (!response.ok) throw new Error('Google sign-in configuration could not be loaded.');
        return response.json();
      })
      .catch(error => {
        googleClientConfigPromise = null;
        throw error;
      });
  }
  return googleClientConfigPromise;
}

function preloadGoogleSignIn() {
  // Start both network requests with the app shell so the button is ready
  // by the time the user opens login or signup.
  Promise.allSettled([loadGoogleClientConfig(), loadGoogleIdentityScript()]);
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
  try {
    const response = await fetch(`${API_BASE_URL}/auth/apple/config`);
    if (!response.ok) return;
    const config = await response.json();
    if (!config.client_id) return;
    await loadAppleIdentityScript();
    if (!section.isConnected || !window.AppleID?.auth) return;
    section.hidden = false;
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
  } catch { /* Keep Apple hidden until its provider is configured and available. */ }
}

async function setupGoogleSignIn(flow) {
  const section = document.querySelector(`#google-login-${flow}`);
  const button = document.querySelector(`#google-button-${flow}`);
  if (!section || !button) return;
  try {
    const [config] = await Promise.all([
      loadGoogleClientConfig(),
      loadGoogleIdentityScript(),
    ]);
    if (!config.client_id) return;
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

function bindPasswordAuth(flow) {
  const form = document.querySelector(`#${flow}-form`);
  if (!form) return;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const errorBox = document.querySelector(`#${flow}-error`);
    const submit = form.querySelector('[type="submit"]');
    errorBox.hidden = true;
    const values = Object.fromEntries(new FormData(form));
    if (flow === 'register' && values.password !== values.confirmPassword) {
      errorBox.textContent = 'Passwords do not match.';
      errorBox.hidden = false;
      form.querySelector('[name="confirmPassword"]')?.focus();
      return;
    }
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = flow === 'register' ? 'Creating account…' : 'Signing in…';
    try {
      const response = await fetch(`${API_BASE_URL}/${flow === 'register' ? 'register' : 'login'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        errorBox.textContent = data.detail || `${flow === 'register' ? 'Account creation' : 'Login'} failed. Please try again.`;
        errorBox.hidden = false;
        const resend = document.querySelector(`#${flow}-resend`);
        if (flow === 'login' && response.status === 403 && /verify/i.test(errorBox.textContent) && resend) resend.hidden = false;
        return;
      }
      if (flow === 'register') {
        document.querySelector('#register-form-wrap').innerHTML = `<span class="eyebrow">Check your inbox</span><h2>Verify your email</h2><p class="login-subtitle">We created an account for <strong>${escapeHTML(data.email || values.email)}</strong>. ${data.email_sent ? 'Open the verification link we sent to activate it.' : 'Email delivery is not configured yet, so the verification link could not be sent. Contact the workspace administrator to finish email setup.'}</p><div class="form-error" id="register-success" role="status"></div><button class="btn btn-light" id="register-resend" type="button" ${data.email_sent ? 'hidden' : ''}>Resend verification email</button><div class="login-bottom">Already verified? <a class="text-btn" href="#/login">Log in</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a>`;
        document.querySelector('#register-resend')?.addEventListener('click', () => resendVerificationEmail(values.email, 'register-success'));
        return;
      }
      if (!data.access_token) throw new Error('The server did not return a sign-in token.');
      const storage = form.querySelector('[name="remember"]')?.checked ? localStorage : sessionStorage;
      const otherStorage = storage === localStorage ? sessionStorage : localStorage;
      otherStorage.removeItem('stocksetu-token');
      storage.setItem('stocksetu-token', data.access_token);
      localStorage.setItem('stocksetu-user', values.email.trim().toLowerCase());
      state.settings = { ...seed.settings, owner: values.email.trim().split('@', 1)[0] };
      saveStore('settings');
      location.hash = '#/dashboard';
    } catch (error) {
      errorBox.textContent = error.message || 'Could not reach StockSetu. Check your connection and try again.';
      errorBox.hidden = false;
    } finally {
      if (submit.isConnected) { submit.disabled = false; submit.textContent = originalLabel; }
    }
  });
  form.querySelectorAll('[data-toggle-password]').forEach(button => button.addEventListener('click', () => {
    const input = form.querySelector(`#${button.dataset.togglePassword}`);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Show' : 'Hide';
    button.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
  }));
  document.querySelector(`#${flow}-resend`)?.addEventListener('click', () => resendVerificationEmail(form.elements.email.value, `${flow}-error`));
}

async function resendVerificationEmail(email, messageId) {
  const message = document.querySelector(`#${messageId}`);
  const button = document.querySelector(`#${messageId.replace('-success','')}-resend`);
  if (button) { button.disabled = true; button.textContent = 'Sending…'; }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/email/resend`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || 'Could not send a verification email.');
    if (message) { message.textContent = data.message || 'If the account needs verification, a fresh link will be sent.'; message.hidden = false; }
  } catch (error) {
    if (message) { message.textContent = error.message || 'Could not send a verification email.'; message.hidden = false; }
  } finally {
    if (button) { button.disabled = false; button.textContent = 'Resend verification email'; }
  }
}

function renderLogin() {
  root.innerHTML = `<main class="login-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">Your business, one place</span><h1>Make room for <em>better business.</em></h1><p>Bring stock, sales and supplier records together. Start with a clear view of what’s happening today.</p><div class="login-aside-points"><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Sales made simple</span><span>${icon('check')} Reports that help</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Welcome back</span><h2>Log in to StockSetu</h2><p class="login-subtitle">Use your email and password, or continue with Google.</p><div class="form-error" id="login-error" role="alert" hidden></div><form id="login-form" class="auth-form"><label class="field"><span>Email address</span><input name="email" type="email" autocomplete="username" placeholder="Your business email" maxlength="254" required /></label><label class="field"><span>Password</span><span class="password-input"><input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" maxlength="128" required /><button type="button" class="password-toggle" data-toggle-password="login-password" aria-label="Show password">Show</button></span></label><div class="auth-options"><label class="remember-option"><input type="checkbox" name="remember" checked /> Remember me</label><button type="button" class="text-btn" id="login-resend" hidden>Resend verification email</button></div><button class="btn login-submit" type="submit">Continue to workspace ${icon('arrow')}</button></form><div class="social-divider"><span>or continue with</span></div><div class="social-login google-only" id="google-login-login" hidden><div class="google-signin" id="google-button-login"></div></div><div class="social-login provider-login" id="apple-login-login" hidden><button class="apple-signin" id="apple-button-login" type="button"><span aria-hidden="true"></span> Continue with Apple</button></div><div class="login-demo"><strong>Workspace access:</strong> Use the email address and password you registered with. Verify your email before your first login.</div><div class="login-bottom">New to StockSetu? <a class="text-btn" href="#/register">Create an account</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  bindPasswordAuth('login');
  setupGoogleSignIn('login');
  setupAppleSignIn('login');
}

function renderRegister() {
  root.innerHTML = `<main class="login-page register-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">A clear start</span><h1>One place for <em>your business.</em></h1><p>Create your StockSetu account to keep your stock and daily records together.</p><div class="login-aside-points"><span>${icon('check')} Your own login</span><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Business records in one place</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap" id="register-form-wrap"><span class="eyebrow">Get started</span><h2>Create your account</h2><p class="login-subtitle">Use a real email address. We’ll send a verification link before your workspace is activated.</p><div class="form-error" id="register-error" role="alert" hidden></div><form id="register-form" class="auth-form"><label class="field"><span>Email address</span><input name="email" type="email" autocomplete="email" placeholder="Your business email" maxlength="254" required /></label><label class="field"><span>Password</span><span class="password-input"><input id="register-password" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" minlength="8" maxlength="128" required /><button type="button" class="password-toggle" data-toggle-password="register-password" aria-label="Show password">Show</button></span></label><p class="password-hint">Use at least 8 characters. A longer, unique password is safer.</p><label class="field"><span>Confirm password</span><span class="password-input"><input id="register-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" placeholder="Enter your password again" minlength="8" maxlength="128" required /><button type="button" class="password-toggle" data-toggle-password="register-confirm-password" aria-label="Show password">Show</button></span></label><button class="btn login-submit" type="submit">Create account ${icon('arrow')}</button></form><div class="social-divider"><span>or sign up with</span></div><div class="social-login google-only" id="google-login-register" hidden><div class="google-signin" id="google-button-register"></div></div><div class="social-login provider-login" id="apple-login-register" hidden><button class="apple-signin" id="apple-button-register" type="button"><span aria-hidden="true"></span> Sign up with Apple</button></div><div class="login-bottom">Already have an account? <a class="text-btn" href="#/login">Log in</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  bindPasswordAuth('register');
  setupGoogleSignIn('register');
  setupAppleSignIn('register');
}


const navGroups = [
  { label: 'Workspace', items: [ ['Overview','grid'], ['StockSathi','spark'], ['Inventory','box'], ['Stock history','clock'], ['Sales & invoices','receipt'], ['Purchases','cart'] ] },
  { label: 'Relationships', items: [ ['Customers','users'], ['Suppliers','truck'] ] },
  { label: 'Insights', items: [ ['Reports','chart'], ['Plans','tag'] ] },
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
