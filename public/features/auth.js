/* auth feature module. */
function renderLogin() {
  root.innerHTML = `<main class="login-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">Your business, one place</span><h1>Make room for <em>better business.</em></h1><p>Bring stock, sales and supplier records together. Start with a clear view of what’s happening today.</p><div class="login-aside-points"><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Sales made simple</span><span>${icon('check')} Reports that help</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Welcome back</span><h2>Log in to StockSetu</h2><p class="login-subtitle">Enter your details to open your workspace.</p><form id="login-form"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" placeholder="Your business email" autocomplete="email" required></div><div class="field"><label for="password">Password</label><div class="password-wrap"><input id="password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required><button type="button" class="show-password" id="show-password">Show</button></div></div><div class="form-error" id="login-error" role="alert" hidden>Please enter a valid email and password to continue.</div><div class="login-meta"><label class="remember"><input type="checkbox" name="remember" checked> Remember me</label><a class="text-btn" href="#" id="forgot-password">Forgot password?</a></div><button class="btn login-submit" type="submit">Continue to workspace ${icon('arrow')}</button></form><div class="login-demo"><strong>Workspace access:</strong> Use the email and password you registered with.</div><div class="login-bottom">New to StockSetu? <a class="text-btn" href="#/register" id="create-account">Create an account</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  document.querySelector('#show-password').addEventListener('click', event => { const input = document.querySelector('#password'); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; event.currentTarget.textContent = show ? 'Hide' : 'Show'; });
  document.querySelector('#forgot-password').addEventListener('click', event => { event.preventDefault(); showModal('Password reset', 'Password recovery is under development.', '<p class="muted-copy">This version cannot send verified reset links yet. Contact the account administrator to recover access.</p><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Close</button></div>'); });
 

document.querySelector('#login-form').addEventListener('submit', async event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  const errorBox = document.querySelector('#login-error');

  errorBox.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { detail: responseText.slice(0, 240) };
    }

    if (!response.ok) {
      throw new Error(data.detail || ('Login failed (' + response.status + ').'));
    }

    if (!data.access_token) {
      throw new Error('The backend did not return an access token.');
    }

    localStorage.removeItem('stocksetu-token');
    sessionStorage.removeItem('stocksetu-token');
    (form.get('remember') === 'on' ? localStorage : sessionStorage).setItem('stocksetu-token', data.access_token);
    localStorage.setItem('stocksetu-user', email);
    state.settings = { ...seed.settings, owner: email.split('@', 1)[0] };
    saveStore('settings');

    location.hash = '#/dashboard';
  } catch (error) {
    errorBox.textContent =
      error.message || 'Could not connect to the backend.';
    errorBox.hidden = false;
    errorBox.style.display = 'block';
  }
});
}

function renderRegister() {
  root.innerHTML = `<main class="login-page register-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">A clear start</span><h1>One place for <em>your business.</em></h1><p>Create your StockSetu account to keep your stock and daily records together.</p><div class="login-aside-points"><span>${icon('check')} Your own login</span><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Business records in one place</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Get started</span><h2>Create your account</h2><p class="login-subtitle">Use an email and a password with at least 8 characters.</p><form id="register-form"><div class="field"><label for="register-email">Email address</label><input id="register-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div><div class="field"><label for="register-password">Password</label><input id="register-password" name="password" type="password" placeholder="At least 8 characters" autocomplete="new-password" minlength="8" required></div><div class="field"><label for="register-confirm-password">Confirm password</label><input id="register-confirm-password" name="confirmPassword" type="password" placeholder="Enter the password again" autocomplete="new-password" minlength="8" required></div><div class="form-error" id="register-error" role="alert" hidden></div><button class="btn login-submit" type="submit">Create account ${icon('arrow')}</button></form><div class="register-success" id="register-success" role="status" hidden><strong>Your account is ready.</strong><span>Log in with the email and password you just registered.</span><a class="btn" href="#/login">Go to login ${icon('arrow')}</a></div><div class="login-bottom">Already have an account? <a class="text-btn" href="#/login">Log in</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  document.querySelector('#register-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get('email') || '').trim();
    const password = String(values.get('password') || '');
    const confirmation = String(values.get('confirmPassword') || '');
    const errorBox = document.querySelector('#register-error');
    const submit = form.querySelector('[type="submit"]');
    errorBox.hidden = true;
    if (password.length < 8) {
      errorBox.textContent = 'Password must be at least 8 characters.';
      errorBox.hidden = false;
      return;
    }
    if (password !== confirmation) {
      errorBox.textContent = 'The passwords do not match.';
      errorBox.hidden = false;
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Creating account…';
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Registration failed (${response.status}).`);
      form.hidden = true;
      document.querySelector('#register-success').hidden = false;
    } catch (error) {
      errorBox.textContent = error.message || 'Could not connect to the backend. Make sure it is running and try again.';
      errorBox.hidden = false;
      submit.disabled = false;
      submit.innerHTML = `Create account ${icon('arrow')}`;
    }
  });
}



const navGroups = [
  { label: 'Workspace', items: [ ['Overview','grid'], ['Inventory','box'], ['Stock history','clock'], ['Sales & invoices','receipt'], ['Purchases','cart'] ] },
  { label: 'Relationships', items: [ ['Customers','users'], ['Suppliers','truck'] ] },
  { label: 'Insights', items: [ ['Reports','chart'] ] },
];
