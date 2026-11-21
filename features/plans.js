/* plans feature module — Free / Silver / Gold / Diamond */
const PLAN_LIMITS = {
  free:    { products: 25,  invoices: 30,   purchases: 20,   users: 1 },
  silver:  { products: 250, invoices: Infinity, purchases: Infinity, users: 2 },
  gold:    { products: Infinity, invoices: Infinity, purchases: Infinity, users: 5 },
  diamond: { products: Infinity, invoices: Infinity, purchases: Infinity, users: Infinity },
};

const PLAN_CATALOG = [
  {
    id: 'free', name: 'Free', badge: 'Shuruat',
    priceMonthly: 0, priceYearly: 0,
    highlight: false,
    tagline: 'Chhote dukaan ke liye, bina kisi cost ke.',
    features: ['25 products', '30 invoices / month', '20 purchases / month', '1 user', 'Inventory basics', 'In-app reminders', 'StockSathi basic', 'Invoice with StockSetu branding'],
    matrix: { csv: false, reports: 'basic', stockSathi: 'basic', teamRoles: false, barcode: false, multiWarehouse: false, multiBranch: false, api: false, audit: false, branding: 'powered' },
  },
  {
    id: 'silver', name: 'Silver', badge: 'Dukaan',
    priceMonthly: 199, priceYearly: 1999,
    highlight: false,
    tagline: 'Regular dukaan ke liye — unlimited billing.',
    features: ['250 products', 'Unlimited invoices', 'Unlimited purchases', '2 users', 'CSV export', 'Sales trend + stock health', 'Custom invoice footer', 'StockSathi full (Hindi/Hinglish)', 'Low-stock + due reminders'],
    matrix: { csv: true, reports: 'full', stockSathi: 'full', teamRoles: false, barcode: false, multiWarehouse: false, multiBranch: false, api: false, audit: false, branding: 'custom' },
  },
  {
    id: 'gold', name: 'Gold', badge: 'Vyapar', highlight: true,
    priceMonthly: 499, priceYearly: 4999,
    tagline: 'Growing business — team + advanced reports.',
    features: ['Unlimited products', 'Unlimited invoices', 'Unlimited purchases', '5 users', 'Team roles (Biller, Accountant, Stock Keeper, Viewer)', 'Advanced reports (profit, margin, forecast)', 'Barcode / QR labels', 'Multi-warehouse (2 godowns)', 'WhatsApp reminders', 'Priority email support', 'No StockSetu branding'],
    matrix: { csv: true, reports: 'advanced', stockSathi: 'full', teamRoles: true, barcode: true, multiWarehouse: true, multiBranch: false, api: false, audit: false, branding: 'none' },
  },
  {
    id: 'diamond', name: 'Diamond', badge: 'Enterprise',
    priceMonthly: 999, priceYearly: 9999,
    highlight: false,
    tagline: 'Chain / multi-branch — sab kuch unlimited.',
    features: ['Everything in Gold', 'Unlimited users', 'Multi-branch / multi-location', 'Custom roles & permissions', 'API access + webhooks', 'Audit log', 'Scheduled data export / backup', 'White-label invoice + custom domain', 'Dedicated support + onboarding'],
    matrix: { csv: true, reports: 'advanced', stockSathi: 'full', teamRoles: true, barcode: true, multiWarehouse: true, multiBranch: true, api: true, audit: true, branding: 'whitelabel' },
  },
];

let planBilling = (localStorage.getItem('stocksetu-plan-billing') || 'monthly');

function planStorageKey() { return `stocksetu-plan:${accountId()}`; }
function readPlan() {
  try {
    const v = JSON.parse(localStorage.getItem(planStorageKey()) || '{}');
    return { tier: v.tier || 'free', billing: v.billing || planBilling, status: v.status || 'active' };
  } catch { return { tier: 'free', billing: planBilling, status: 'active' }; }
}
function writePlan(value) {
  localStorage.setItem(planStorageKey(), JSON.stringify(value));
  localStorage.setItem('stocksetu-plan-billing', value.billing || planBilling);
}
function currentPlan() {
  const p = readPlan();
  return PLAN_CATALOG.find(x => x.id === p.tier) || PLAN_CATALOG[0];
}
function currentPlanId() { return readPlan().tier; }
function planLimit(key) { return PLAN_LIMITS[currentPlanId()]?.[key] ?? 0; }
function planPrice(plan, billing) {
  return billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
}
function invoicesThisMonth() {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  return (state.sales || []).filter(s => {
    const d = new Date(`${s.date}T00:00:00`);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}
function planCanAddProduct() {
  const limit = planLimit('products');
  return (state.products || []).length < limit;
}
function planCanCreateInvoice() {
  const limit = planLimit('invoices');
  return invoicesThisMonth() < limit;
}
function planCanAddPurchase() {
  const limit = planLimit('purchases');
  const monthCount = (state.purchases || []).filter(p => {
    const d = new Date(`${p.date}T00:00:00`);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  return monthCount < limit;
}
function planFeatureAllowed(feature) {
  const m = currentPlan().matrix || {};
  if (feature === 'csv') return !!m.csv;
  if (feature === 'reports') return m.reports !== 'basic';
  if (feature === 'advancedReports') return m.reports === 'advanced';
  if (feature === 'teamRoles') return !!m.teamRoles;
  if (feature === 'barcode') return !!m.barcode;
  if (feature === 'multiWarehouse') return !!m.multiWarehouse;
  if (feature === 'multiBranch') return !!m.multiBranch;
  if (feature === 'api') return !!m.api;
  if (feature === 'audit') return !!m.audit;
  return true;
}

function upgradeModal(targetId) {
  const target = PLAN_CATALOG.find(p => p.id === targetId) || PLAN_CATALOG.find(p => p.id === 'gold');
  const body = `
    <div class="plan-upgrade-modal">
      <p class="plan-upgrade-copy">Is feature ke liye <b>${escapeHTML(target.name)}</b> plan chahiye. UPI se pay kar ke instant upgrade ho jayega.</p>
      <div class="plan-upgrade-actions">
        <button class="btn btn-sm" data-action="select-plan" data-plan="${escapeHTML(target.id)}">Upgrade to ${escapeHTML(target.name)} ${icon('arrow')}</button>
        <button class="btn btn-light btn-sm" data-action="close-modal">Baad me</button>
      </div>
      <p class="plan-upgrade-note">Payment: PhonePe / Paytm UPI (zero commission). Abhi sandbox mode.</p>
    </div>`;
  showModal('Upgrade required', 'Plan limit cross ho gaya', body);
}

function planUsageBar(label, used, limit) {
  const pct = (limit === Infinity) ? Math.min(100, used) : Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
  const displayLimit = limit === Infinity ? '∞' : limit;
  const cls = pct >= 90 ? 'plan-bar-warn' : '';
  return `<div class="plan-usage-row"><div class="plan-usage-head"><span>${escapeHTML(label)}</span><b>${used} / ${displayLimit}</b></div><div class="plan-usage-track"><i class="${cls}" style="width:${pct}%"></i></div></div>`;
}

function planPage() {
  const p = readPlan();
  const plan = currentPlan();
  const products = (state.products || []).length;
  const invoices = invoicesThisMonth();
  const purchasesMonth = (state.purchases || []).filter(x => {
    const d = new Date(`${x.date}T00:00:00`); const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
  }).length;
  const limits = PLAN_LIMITS[plan.id];
  const billing = p.billing || 'monthly';

  const cards = PLAN_CATALOG.map(pl => {
    const price = planPrice(pl, billing);
    const isCurrent = pl.id === plan.id;
    const isHighlight = pl.highlight;
    return `<article class="plan-card-tile ${isHighlight ? 'plan-highlight' : ''} ${isCurrent ? 'plan-current' : ''}">
      <div class="plan-tile-top">
        <span class="plan-tile-badge">${escapeHTML(pl.badge)}</span>
        ${isHighlight ? '<span class="plan-tile-popular">Most Popular</span>' : ''}
        ${isCurrent ? '<span class="plan-tile-current">Current</span>' : ''}
      </div>
      <h3>${escapeHTML(pl.name)}</h3>
      <p class="plan-tile-tagline">${escapeHTML(pl.tagline)}</p>
      <div class="plan-tile-price">
        <strong>${price === 0 ? 'Free' : '₹' + price.toLocaleString('en-IN')}</strong>
        ${price > 0 ? `<small>/${billing === 'yearly' ? 'year' : 'month'}</small>` : ''}
      </div>
      <ul class="plan-tile-features">${pl.features.map(f => `<li>${icon('check')} ${escapeHTML(f)}</li>`).join('')}</ul>
      <button class="btn ${isCurrent ? 'btn-light' : ''} btn-sm plan-tile-cta" data-action="${isCurrent ? 'close-modal' : 'select-plan'}" data-plan="${escapeHTML(pl.id)}" ${isCurrent ? 'disabled' : ''}>
        ${isCurrent ? 'Current plan' : (pl.priceMonthly === 0 ? 'Downgrade' : 'Upgrade ' + icon('arrow'))}
      </button>
    </article>`;
  }).join('');

  const matrixRows = [
    ['Products', PLAN_CATALOG.map(pl => (PLAN_LIMITS[pl.id].products === Infinity ? 'Unlimited' : PLAN_LIMITS[pl.id].products))],
    ['Invoices / month', PLAN_CATALOG.map(pl => (PLAN_LIMITS[pl.id].invoices === Infinity ? 'Unlimited' : PLAN_LIMITS[pl.id].invoices))],
    ['Purchases / month', PLAN_CATALOG.map(pl => (PLAN_LIMITS[pl.id].purchases === Infinity ? 'Unlimited' : PLAN_LIMITS[pl.id].purchases))],
    ['Team members', PLAN_CATALOG.map(pl => (PLAN_LIMITS[pl.id].users === Infinity ? 'Unlimited' : PLAN_LIMITS[pl.id].users))],
    ['CSV export', PLAN_CATALOG.map(pl => pl.matrix.csv ? '✓' : '—')],
    ['Reports', PLAN_CATALOG.map(pl => ({ basic: 'Basic', full: 'Full', advanced: 'Advanced' }[pl.matrix.reports]))],
    ['StockSathi', PLAN_CATALOG.map(pl => ({ basic: 'Basic', full: 'Full' }[pl.matrix.stockSathi]))],
    ['Team roles', PLAN_CATALOG.map(pl => pl.matrix.teamRoles ? '✓' : '—')],
    ['Barcode labels', PLAN_CATALOG.map(pl => pl.matrix.barcode ? '✓' : '—')],
    ['Multi-warehouse', PLAN_CATALOG.map(pl => pl.matrix.multiWarehouse ? '✓' : '—')],
    ['Multi-branch', PLAN_CATALOG.map(pl => pl.matrix.multiBranch ? '✓' : '—')],
    ['API & webhooks', PLAN_CATALOG.map(pl => pl.matrix.api ? '✓' : '—')],
    ['Audit log', PLAN_CATALOG.map(pl => pl.matrix.audit ? '✓' : '—')],
    ['Invoice branding', PLAN_CATALOG.map(pl => ({ powered: 'StockSetu', custom: 'Custom', none: 'None', whitelabel: 'White-label' }[pl.matrix.branding]))],
  ];

  const matrixHtml = `<div class="plan-matrix-wrap"><table class="plan-matrix"><thead><tr><th>Feature</th>${PLAN_CATALOG.map(pl => `<th>${escapeHTML(pl.name)}</th>`).join('')}</tr></thead><tbody>${matrixRows.map(([label, vals]) => `<tr><td>${escapeHTML(label)}</td>${vals.map(v => `<td>${escapeHTML(String(v))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  return `${pageHeader('Plans & billing', 'Apna plan choose karo. UPI se pay, instant upgrade.', `<div class="plan-billing-toggle"><button class="plan-toggle-btn ${billing === 'monthly' ? 'active' : ''}" data-action="toggle-billing" data-billing="monthly">Monthly</button><button class="plan-toggle-btn ${billing === 'yearly' ? 'active' : ''}" data-action="toggle-billing" data-billing="yearly">Yearly <span class="plan-save-badge">Save 17%</span></button></div>`)}
    <div class="plan-current-card">
      <div class="plan-current-left"><i>${icon('spark')}</i><div><b>${escapeHTML(plan.name)} plan</b><small>${plan.priceMonthly === 0 ? 'Free forever' : '₹' + planPrice(plan, billing).toLocaleString('en-IN') + '/' + (billing === 'yearly' ? 'yr' : 'mo')} · ${escapeHTML(p.status)}</small></div></div>
      <div class="plan-usage">
        ${planUsageBar('Products', products, limits.products)}
        ${planUsageBar('Invoices this month', invoices, limits.invoices)}
        ${planUsageBar('Purchases this month', purchasesMonth, limits.purchases)}
      </div>
    </div>
    <div class="plan-grid">${cards}</div>
    ${matrixHtml}
    <div class="plan-faq">
      <h3>Frequently asked questions</h3>
      <details><summary>Can I try StockSetu for free?</summary><p>Yes. The Free plan is free forever with 25 products and 30 invoices per month. No credit card needed.</p></details>
      <details><summary>How does a plan upgrade work?</summary><p>Pay via UPI (PhonePe, GPay, Paytm). Your plan upgrades instantly once payment is confirmed. Downgrades take effect at the next billing cycle.</p></details>
      <details><summary>Will my data be safe if I downgrade or cancel?</summary><p>Yes. Your products, sales and purchases stay intact. Only the premium features become locked.</p></details>
      <details><summary>Can multiple staff members use one account?</summary><p>Yes. Silver supports 2 users, Gold 5 users and Diamond unlimited users, with role-based access.</p></details>
      <details><summary>Is there a refund policy?</summary><p>Full refund within 7 days, no questions asked.</p></details>
      <details><summary>Do you charge any commission on payments?</summary><p>No. UPI payments go directly to your bank account with zero commission.</p></details>
      <details><summary>Can I switch between monthly and yearly billing?</summary><p>Yes, anytime. Yearly plans save you about 17% compared to monthly.</p></details>
    </div>`;
}

function landingPlansSection() {
  const billing = planBilling;
  const cards = PLAN_CATALOG.map(pl => {
    const price = planPrice(pl, billing);
    return `<article class="launch-plan-card ${pl.highlight ? 'launch-plan-highlight' : ''}">
      <div class="launch-plan-top">
        <span class="launch-plan-badge">${escapeHTML(pl.badge)}</span>
        ${pl.highlight ? '<span class="launch-plan-popular">Most Popular</span>' : ''}
      </div>
      <h3>${escapeHTML(pl.name)}</h3>
      <p>${escapeHTML(pl.tagline)}</p>
      <div class="launch-plan-price"><strong>${price === 0 ? 'Free' : '₹' + price.toLocaleString('en-IN')}</strong><small>${price > 0 ? '/' + (billing === 'yearly' ? 'yr' : 'mo') : ''}</small></div>
      <ul>${pl.features.slice(0, 5).map(f => `<li>${icon('check')} ${escapeHTML(f)}</li>`).join('')}</ul>
      <a class="launch-plan-cta" href="#/dashboard" data-page="Plans">${pl.priceMonthly === 0 ? 'Start free' : 'Upgrade ' + '→'}</a>
    </article>`;
  }).join('');
  return `<section class="launch-plans" id="plans"><div class="container"><div class="launch-section-intro reveal"><span class="launch-overline">Simple pricing</span><h2>Pick the plan that fits.<br><em>Upgrade anytime.</em></h2><p>Free se shuru karo, business grow ho toh upgrade kar lo. Zero commission payments.</p></div>
    <div class="launch-plan-toggle"><button class="launch-plan-toggle-btn ${billing === 'monthly' ? 'active' : ''}" data-action="toggle-billing" data-billing="monthly">Monthly</button><button class="launch-plan-toggle-btn ${billing === 'yearly' ? 'active' : ''}" data-action="toggle-billing" data-billing="yearly">Yearly <span class="launch-plan-save">Save 17%</span></button></div>
    <div class="launch-plan-grid">${cards}</div>
    <div class="launch-plan-foot"><a class="launch-text-link" href="#/register">Create your workspace ${icon('arrow')}</a> · <a class="launch-text-link" href="#capabilities">See all features</a></div>
  </div></section>`;
}
function bindPlans() {
  // toggle billing handled via data-action in handleAction
}
function planCardSidebar() {
  const plan = currentPlan();
  const p = readPlan();
  return `<i>${icon('spark')}</i><b>${escapeHTML(plan.name)} plan.</b><p>${plan.priceMonthly === 0 ? 'Free forever.' : '₹' + planPrice(plan, p.billing || 'monthly').toLocaleString('en-IN') + '/' + ((p.billing || 'monthly') === 'yearly' ? 'yr' : 'mo')}. Upgrade for more.</p><button data-page="Plans">View plans ${icon('arrow')}</button>`;
}
async function syncPlanFromBackend() {
  try {
    const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/billing/subscription`, { headers: { 'Authorization': 'Bearer ' + token } });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.tier) {
      const p = readPlan();
      writePlan({ tier: data.tier, billing: data.billing || p.billing, status: data.status || 'active' });
    }
  } catch (e) { /* offline: keep local */ }
}
async function handlePaymentReturn() {
  try {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const order = params.get('order');
    if (!order) return;
    const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/billing/status/${encodeURIComponent(order)}`, { headers: { 'Authorization': 'Bearer ' + token } });
    if (!res.ok) return;
    const data = await res.json();
    if (data.status === 'paid') {
      await syncPlanFromBackend();
      toast('Payment confirmed. Plan upgraded!');
    }
    // clean URL
    location.hash = '#/dashboard';
  } catch (e) {}
}
window.syncPlanFromBackend = syncPlanFromBackend;
window.handlePaymentReturn = handlePaymentReturn;

async function handlePlanAction(action, button) {
  if (action === 'toggle-billing') {
    const billing = button.dataset.billing;
    if (billing) {
      planBilling = billing;
      localStorage.setItem('stocksetu-plan-billing', billing);
      const p = readPlan();
      writePlan({ ...p, billing });
      renderDashboard();
      if (document.querySelector('.launch-plan-grid')) {
        // re-render landing plans section in place
        const sec = document.querySelector('#plans');
        if (sec) { sec.outerHTML = landingPlansSection(); runReveal(); }
      }
    }
    return true;
  }
  if (action === 'select-plan') {
    const tier = button.dataset.plan;
    if (!tier) return false;
    const plan = PLAN_CATALOG.find(x => x.id === tier);
    if (!plan) return false;
    if (plan.priceMonthly === 0) {
      writePlan({ tier, billing: planBilling, status: 'active' });
      toast(`${plan.name} plan activated.`);
      renderDashboard();
    } else {
      // Phase 2: create billing order (PhonePe auto or manual UPI)
      try {
        const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;
        if (!token) { toast('Please log in first.'); return true; }
        const res = await fetch(`${API_BASE_URL}/billing/create-order`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier, billing: planBilling }),
        });
        if (!res.ok) { const e = await res.json().catch(()=>({})); toast(e.detail || 'Order failed'); return true; }
        const data = await res.json();
        if (data.provider === 'phonepe' && data.payment_url) {
          writePlan({ tier, billing: planBilling, status: 'pending' });
          window.location.href = data.payment_url;
          return true;
        }
        if (data.provider === 'paytm' && data.txn_token) {
          writePlan({ tier, billing: planBilling, status: 'pending' });
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = `${data.base_url}/theia/paytmCallback?mid=${encodeURIComponent(data.mid)}&orderId=${encodeURIComponent(data.order_id)}`;
          const add = (name, value) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = name; i.value = value; form.appendChild(i); };
          add('mid', data.mid);
          add('orderId', data.order_id);
          add('txnToken', data.txn_token);
          document.body.appendChild(form);
          form.submit();
          return true;
        }
        // manual UPI flow
        writePlan({ tier, billing: planBilling, status: 'pending' });
        const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.upi_uri)}`;
        showModal(`Pay ₹${(data.amount/100).toLocaleString('en-IN')}`, `Upgrade to ${plan.name}`, `<div class="plan-pay-box">
          <p>Scan this QR with any UPI app (PhonePe, GPay, Paytm) and pay. Then enter the UTR number to auto-activate.</p>
          <div class="plan-pay-qr"><img src="${qrImg}" alt="UPI QR" width="220" height="220"><p class="plan-pay-hint">Kisi bhi UPI app (PhonePe, GPay, Paytm, BHIM) se scan karo aur pay karo.</p></div>
          <div class="field"><label>UTR / Reference number</label><input id="utr-input" type="text" placeholder="12-digit UTR" maxlength="40"></div>
          <div class="modal-actions">
            <button class="btn btn-sm" data-action="confirm-manual-payment" data-order="${escapeHTML(data.order_ref)}">I have paid ${icon('check')}</button>
            <button class="btn btn-light btn-sm" data-action="close-modal">Cancel</button>
          </div>
          <p class="plan-upgrade-note">Order: ${escapeHTML(data.order_ref)}</p>
        </div>`);
        // bind confirm button
        setTimeout(() => {
          const btn = document.querySelector('[data-action="confirm-manual-payment"]');
          if (btn) btn.addEventListener('click', async () => {
            const utr = (document.querySelector('#utr-input')?.value || '').trim();
            if (utr.length < 6) { toast('Enter valid UTR'); return; }
            const t = (typeof getAuthToken === 'function') ? getAuthToken() : null;
            const r = await fetch(`${API_BASE_URL}/billing/confirm-manual`, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_ref: btn.dataset.order, utr }),
            });
            if (!r.ok) { const e = await r.json().catch(()=>({})); toast(e.detail || 'Confirm failed'); return; }
            await syncPlanFromBackend();
            closeModal();
            toast('Payment confirmed. Plan upgraded!');
            renderDashboard();
          });
        }, 0);
      } catch (e) {
        toast('Network error: ' + e.message);
      }
    }
    return true;
  }
  if (action === 'confirm-payment') {
    const tier = button.dataset.plan;
    writePlan({ tier, billing: planBilling, status: 'active' });
    closeModal();
    toast('Payment confirmed. Plan upgraded!');
    renderDashboard();
    return true;
  }
  return false;
}
window.handlePlanAction = handlePlanAction;
window.planCanAddProduct = planCanAddProduct;
window.planCanCreateInvoice = planCanCreateInvoice;
window.planCanAddPurchase = planCanAddPurchase;
window.planFeatureAllowed = planFeatureAllowed;
window.upgradeModal = upgradeModal;
window.currentPlan = currentPlan;
window.planCardSidebar = planCardSidebar;
window.landingPlansSection = landingPlansSection;
window.planPage = planPage;