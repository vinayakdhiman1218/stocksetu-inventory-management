const icons = {
  mark: '<path d="M4 17.5 10.8 4h2.4L20 17.5h-3.2l-1.5-3.2h-5l-1.5 3.2H4Zm7.6-5.8h2.3l-1.1-2.5-1.2 2.5Z"/><path d="M5 20h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 6-7"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l2.7 12.2a2 2 0 0 0 2 1.5h8.7a2 2 0 0 0 2-1.6L21 8H5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  truck: '<path d="M3 6h12v12H3zM15 10h4l3 3v5h-7"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9L16 21h-2.8l-.3-1.9a8 8 0 0 1-1.7 0L11 21H8.2l-.3-2.1a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.5-1.2a8 8 0 0 1 0-1.8l-1.5-1.2 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9L8.2 7h2.8l.3 1.9a8 8 0 0 1 1.7 0L13.3 7h2.8l.3 2.1a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.5 1.2a8 8 0 0 1-.1 2Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  leaf: '<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-6 7-9 13-12"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.2 2.3L23 17l-2.8.8L19 20l-1.1-2.2L15 17l2.9-.7L19 14Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10a6 6 0 1 1-8 8M8 5v6M5 8h6M16 13v6M13 16h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  pencil: '<path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15v5Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  credit: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  filter: '<path d="M4 7h16M7 12h10m-7 5h4"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  phone: '',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  moon: '<path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.box}</svg>`;
const brand = () => `<a class="brand" href="#/" aria-label="StockSetu home"><span class="brand-mark">${icon('mark')}</span><span>stocksetu</span></a>`;
const root = document.querySelector('#app');
document.documentElement.dataset.theme = localStorage.getItem('stocksetu-theme') === 'dark' ? 'dark' : 'light';
const seed = {
  products: [
    { id: 'p1', name: 'Premium Basmati Rice', sku: 'GRC-001', category: 'Groceries', quantity: 86, unit: 'bags', cost: 980, price: 1240, supplier: 'Supplier One', reorder: 20 },
    { id: 'p2', name: 'Sunflower Oil 1L', sku: 'GRC-014', category: 'Groceries', quantity: 12, unit: 'bottles', cost: 112, price: 145, supplier: 'Supplier Two', reorder: 15 },
    { id: 'p3', name: 'Brown Kraft Packaging', sku: 'PKG-008', category: 'Packaging', quantity: 4, unit: 'bundles', cost: 240, price: 320, supplier: 'Supplier Three', reorder: 10 },
    { id: 'p4', name: 'Paper Carry Bags', sku: 'PKG-012', category: 'Packaging', quantity: 0, unit: 'packs', cost: 130, price: 180, supplier: 'Supplier Three', reorder: 12 },
    { id: 'p5', name: 'Organic Jaggery 500g', sku: 'GRC-021', category: 'Groceries', quantity: 42, unit: 'packs', cost: 48, price: 68, supplier: 'Supplier One', reorder: 15 },
    { id: 'p6', name: 'Glass Storage Jar', sku: 'KIT-005', category: 'Kitchen', quantity: 28, unit: 'pieces', cost: 92, price: 145, supplier: 'Supplier Four', reorder: 8 },
  ],
  sales: [
    { id: 'INV-1084', customer: 'Market One', date: daysAgo(0), amount: 4280, payment: 'Paid', items: 4 },
    { id: 'INV-1083', customer: 'Market Two', date: daysAgo(0), amount: 8650, payment: 'Due', items: 8 },
    { id: 'INV-1082', customer: 'Cafe One', date: daysAgo(1), amount: 2180, payment: 'Paid', items: 3 },
    { id: 'INV-1081', customer: 'Market One', date: daysAgo(2), amount: 5720, payment: 'Paid', items: 6 },
  ],
  purchases: [
    { id: 'PUR-0408', supplier: 'Supplier One', date: daysAgo(0), amount: 18600, items: 12, status: 'Received' },
    { id: 'PUR-0407', supplier: 'Supplier Three', date: daysAgo(1), amount: 9240, items: 8, status: 'Received' },
    { id: 'PUR-0406', supplier: 'Supplier Two', date: daysAgo(3), amount: 13850, items: 15, status: 'Received' },
  ],
  customers: [
    { id: 'c1', name: 'Market One', phone: '', email: '', due: 0 },
    { id: 'c2', name: 'Market Two', phone: '', email: '', due: 8650 },
    { id: 'c3', name: 'Cafe One', phone: '', email: '', due: 0 },
    { id: 'c4', name: 'Market Three', phone: '', email: '', due: 2400 },
  ],
  suppliers: [
    { id: 's1', name: 'Supplier One', phone: '', email: '', products: 2 },
    { id: 's2', name: 'Supplier Two', phone: '', email: '', products: 1 },
    { id: 's3', name: 'Supplier Three', phone: '', email: '', products: 2 },
    { id: 's4', name: 'Supplier Four', phone: '', email: '', products: 1 },
  ],
  activity: [
    { text: 'New invoice created', detail: 'INV-1084 · Market One', time: '10 min ago', icon: 'receipt' },
    { text: 'Stock received', detail: '12 items · Supplier One', time: '1 hour ago', icon: 'truck' },
    { text: 'Low stock alert', detail: 'Brown Kraft Packaging · 4 bundles left', time: 'Today, 9:20 AM', icon: 'bell' },
  ],
  movements: [
    { id: 'MOV-2041', product: 'Premium Basmati Rice', sku: 'GRC-001', type: 'Sale', delta: -3, unit: 'bags', reference: 'INV-1084', date: daysAgo(0), note: 'Invoice recorded' },
    { id: 'MOV-2040', product: 'Sunflower Oil 1L', sku: 'GRC-014', type: 'Purchase received', delta: 24, unit: 'bottles', reference: 'PUR-0408', date: daysAgo(0), note: 'Supplier delivery' },
    { id: 'MOV-2039', product: 'Brown Kraft Packaging', sku: 'PKG-008', type: 'Stock adjustment', delta: -2, unit: 'bundles', reference: 'ADJ-0023', date: daysAgo(1), note: 'Damaged stock' },
    { id: 'MOV-2038', product: 'Organic Jaggery 500g', sku: 'GRC-021', type: 'Sale', delta: -6, unit: 'packs', reference: 'INV-1082', date: daysAgo(1), note: 'Invoice recorded' },
  ],
  returns: [],
  settings: { businessName: 'Store Workspace', owner: 'Workspace Owner', phone: '', email: '', address: '', currency: 'INR' },
};
const state = Object.fromEntries(Object.entries(seed).map(([key, fallback]) => [key, readStore(key, fallback)]));
let activePage = 'Overview';
let searchTerm = '';
let statusFilter = 'all';
let chartPeriod = 7;
let toastTimer;
let revealObserver;

function daysAgo(days) {
  const date = new Date(); date.setDate(date.getDate() - days); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function readStore(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(`stocksetu-${key}`)); return value ?? structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function saveStore(key) { localStorage.setItem(`stocksetu-${key}`, JSON.stringify(state[key])); }
if (localStorage.getItem('stocksetu-branding-version') !== '2') {
  state.settings.businessName = 'Store Workspace'; state.settings.owner = 'Workspace Owner'; saveStore('settings');
  localStorage.setItem('stocksetu-user', 'Workspace Owner'); localStorage.setItem('stocksetu-branding-version', '2');
}
function nextMovementId() { const latest=Math.max(2040,...state.movements.map(m=>Number(String(m.id).match(/(\d+)$/)?.[1])||0)); return `MOV-${latest+1}`; }
function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
function money(value) { return `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`; }
function dateLabel(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function initials(name = 'Business owner') { return name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase(); }
function getUser() { return localStorage.getItem('stocksetu-user') || 'Workspace Owner'; }

const API_BASE_URL = 'http://127.0.0.1:8000';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('stocksetu-token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.detail || `Request failed (${response.status})`
    );
  }

  return result;
}

async function loadProductsFromBackend() {
  try {
    const products = await apiRequest('/products');

    state.products = products.map(product => ({
      id: String(product.id),
      name: product.name,
      sku: product.sku || '—',
      category: product.category || 'Uncategorized',
      quantity: Number(product.quantity ?? 0),
      unit: product.unit || 'pcs',
      cost: Number(product.cost_price ?? 0),
      price: Number(product.selling_price ?? 0),
      supplier: product.supplier || '',
      reorder: Number(product.min_stock ?? 5)
    }));

    if (location.hash === '#/dashboard') {
      renderDashboard();
    }
  } catch (error) {
    toast(`Could not load products: ${error.message}`);
  }
}



const API_BASE = 'http://127.0.0.1:8000';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('stocksetu-token');

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      (data && data.detail) || `Request failed: ${response.status}`
    );
  }

  return data;
}

function toast(message) {
  document.querySelector('.toast')?.remove(); const node = document.createElement('div'); node.className = 'toast'; node.innerHTML = `${icon('check')}<span>${escapeHTML(message)}</span>`;
  document.body.append(node); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.remove(), 3200);
}
function runReveal(scope = document) {
  revealObserver?.disconnect();
  const elements = scope.querySelectorAll('.reveal:not(.revealed)');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { elements.forEach(el => el.classList.add('revealed')); return; }
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -35px 0px' });
  elements.forEach((element, i) => { element.style.setProperty('--reveal-delay', `${(i % 4) * 75}ms`); revealObserver.observe(element); });
}
function brandPageHome() {
  root.innerHTML = `
    <div class="scroll-progress" aria-hidden="true"></div><header class="site-header"><div class="container nav">${brand()}
      <nav class="nav-links" id="site-nav"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#why-stocksetu">Why StockSetu</a></nav>
      <div class="nav-actions"><a class="nav-login" href="#/login">Log in</a><a class="btn btn-sm" href="#/login">Open workspace ${icon('arrow')}</a><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation">${icon('menu')}</button></div>
    </div></header>
    <main>
      <section class="hero"><div class="hero-glow hero-glow-one"></div><div class="hero-glow hero-glow-two"></div><div class="container hero-grid">
        <div class="hero-copy"><div class="eyebrow-pill"><i></i> Stock and daily accounts, together</div>
          <h1>Stock sambhalo.<br><span>Hisaab, seedha.</span></h1>
          <p>Products, purchases aur sales ka record ek hi workspace mein. Dekho kya stock mein hai, kya kam ho raha hai, aur aaj ka hisaab kahan khada hai.</p>
          <div class="hero-actions"><a class="btn btn-lg" href="#/login">View your workspace ${icon('arrow')}</a><a class="play-link" href="#how-it-works"><span>${icon('arrow')}</span> See how it works</a></div>
          <div class="hero-proof"><span><strong>One workspace</strong> for products, purchases and sales</span></div>
        </div>
        <div class="hero-art" aria-label="StockSetu inventory dashboard preview"><div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div>
          <div class="preview-card preview-main"><div class="preview-head"><span class="preview-brand"><i class="brand-mark">${icon('mark')}</i> stocksetu</span><span class="preview-user">VD</span></div><div class="preview-greeting"><div><small>SAMPLE WORKSPACE</small><h3>Stock and sales, at a glance</h3></div><i>${icon('bell')}</i></div>
            <div class="preview-stats"><div><small>Sales today</small><b>₹24,680</b><span class="positive">↗ 12.8%</span></div><div><small>Items in stock</small><b>1,284</b><span>Across 86 products</span></div><div><small>To collect</small><b>₹8,450</b><span>From 6 customers</span></div></div>
            <div class="preview-chart"><div class="preview-chart-title"><b>Sales overview</b><span>Last 7 days⌄</span></div><svg viewBox="0 0 420 130" preserveAspectRatio="none"><defs><linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#98cc9d" stop-opacity=".45"/><stop offset="1" stop-color="#98cc9d" stop-opacity="0"/></linearGradient></defs><path d="M0 99 C40 93 45 72 85 81 S130 52 168 67 S217 38 251 54 S294 73 330 38 S375 52 420 11 V130 H0Z" fill="url(#hero-fill)"/><path d="M0 99 C40 93 45 72 85 81 S130 52 168 67 S217 38 251 54 S294 73 330 38 S375 52 420 11" fill="none" stroke="#2c7d53" stroke-width="3" stroke-linecap="round"/></svg><div class="preview-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
            <div class="preview-stock"><div class="preview-chart-title"><b>Stock to watch</b><a href="#/login">View all ${icon('arrow')}</a></div><div><i class="mini-product">${icon('box')}</i><span><b>Sunflower oil 1L</b><small>12 bottles left</small></span><em>Low stock</em></div><div><i class="mini-product peach">${icon('box')}</i><span><b>Kraft packaging</b><small>4 bundles left</small></span><em>Low stock</em></div></div>
          </div><div class="float-chip chip-invoice"><i>${icon('receipt')}</i><span><b>Invoice ready</b><small>INV-1084 · ₹4,280</small></span><strong>✓</strong></div><div class="float-chip chip-alert"><i>${icon('bell')}</i><span><b>Restock reminder</b><small>2 products running low</small></span></div><div class="art-spark spark-one">✳</div><div class="art-spark spark-two">✦</div>
        </div>
      </div></section>
      <section class="trust-strip"><div class="container trust-inner"><span>EVERYDAY WORKFLOW</span><i></i><b>Products</b><b>Purchases</b><b>Sales &amp; invoices</b><b>Reports</b></div></section>
      <section class="features-section" id="features"><div class="container"><div class="section-heading reveal"><span class="eyebrow">Your whole shop, in sync</span><h2>Chhoti chhoti cheezein.<br><em>Ek bada clear picture.</em></h2><p>All the everyday tools to know what came in, what went out and what needs your attention next.</p></div>
        <div class="feature-grid">
          <article class="feature-card reveal"><i class="feature-icon green">${icon('box')}</i><h3>Inventory that updates itself</h3><p>See what’s available, what’s running low and every stock movement as it happens.</p><a href="#/login">Explore inventory ${icon('arrow')}</a></article>
          <article class="feature-card reveal"><i class="feature-icon yellow">${icon('receipt')}</i><h3>Billing without the busywork</h3><p>Create a clear invoice, record a payment and keep each sale easy to find.</p><a href="#/login">Explore billing ${icon('arrow')}</a></article>
          <article class="feature-card reveal"><i class="feature-icon lilac">${icon('truck')}</i><h3>Purchases, all accounted for</h3><p>Connect supplier purchases to stock so quantities stay up to date.</p><a href="#/login">Explore purchases ${icon('arrow')}</a></article>
          <article class="feature-card reveal"><i class="feature-icon peach">${icon('users')}</i><h3>Customers you know by name</h3><p>Keep contacts, invoices and pending balances together in one place.</p><a href="#/login">Explore customers ${icon('arrow')}</a></article>
          <article class="feature-card reveal"><i class="feature-icon blue">${icon('chart')}</i><h3>Reports that make sense</h3><p>Spot sales patterns, top sellers and the stock that needs a second look.</p><a href="#/login">Explore reports ${icon('arrow')}</a></article>
          <article class="feature-card reveal"><i class="feature-icon mint">${icon('bell')}</i><h3>A little heads-up, right on time</h3><p>Low-stock reminders make it easier to plan your next purchase.</p><a href="#/login">Explore alerts ${icon('arrow')}</a></article>
        </div>
      </div></section>
      <section class="story-section" id="how-it-works"><div class="container story-grid"><div class="story-copy reveal"><span class="eyebrow">Easy from day one</span><h2>One less thing<br>on your mind.</h2><p>Start with what you have. StockSetu keeps every next step connected, so your records make sense without slowing you down.</p><a class="btn" href="#/login">Take a look inside ${icon('arrow')}</a><div class="story-footnote">${icon('shield')} Your workspace keeps products, purchases and sales close at hand.</div></div>
        <div class="story-steps"><article class="story-step reveal"><span>01</span><div><i>${icon('tag')}</i><h3>Add your products</h3><p>Set names, prices and the quantity already on your shelves.</p></div></article><article class="story-step reveal"><span>02</span><div><i>${icon('receipt')}</i><h3>Record the day as it happens</h3><p>Track a sale, purchase or payment in just a few clicks.</p></div></article><article class="story-step reveal"><span>03</span><div><i>${icon('spark')}</i><h3>See what needs attention</h3><p>Get a clear view of sales, stock and what to restock next.</p></div></article></div>
      </div></section>
      <section class="why-section" id="why-stocksetu"><div class="container why-grid"><div class="why-image reveal"><div class="why-circle"></div><div class="why-note note-top"><i>${icon('check')}</i><span><b>Stock is in sync</b><small>Sale recorded just now</small></span></div><div class="why-note note-bottom"><i>${icon('chart')}</i><span><b>Your week at a glance</b><small>Simple, useful business insights</small></span></div><div class="why-doodle">✳</div></div><div class="why-copy reveal"><span class="eyebrow">Built around your day</span><h2>More clarity.<br><em>Less chasing.</em></h2><p>Your business deserves tools that feel straightforward. Keep the essentials close, find details fast and make your next decision with a little more confidence.</p><div class="why-points"><div>${icon('check')} Quick to learn, easy to use</div><div>${icon('check')} All your daily records together</div><div>${icon('check')} Designed to grow with your workflow</div></div></div></div></section>
      <section class="final-cta"><div class="container"><div class="cta-box reveal"><div><span class="eyebrow">Your next clear business day</span><h2>Ready to get your hisaab in order?</h2><p>Bring your stock and daily accounts into one clear workspace.</p></div><a class="btn btn-lime btn-lg" href="#/login">Open StockSetu ${icon('arrow')}</a><div class="cta-orb"></div></div></div></section>
    </main><footer class="site-footer"><div class="container footer-inner"><div>${brand()}<span>Stock sambhalo. Hisab saaf rakho.</span></div><nav><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#/login">Log in</a></nav><small>© 2026 StockSetu · Inventory and billing for everyday business</small></div></footer>`;
  const nav = document.querySelector('#site-nav');
  document.querySelector('#menu-toggle')?.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  runReveal();
}
function updateScrollProgress() {
  const bar = document.querySelector('.scroll-progress'); if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}

function renderLogin() {
  root.innerHTML = `<main class="login-page"><aside class="login-aside">${brand()}<div class="login-message"><span class="eyebrow">Your business, one place</span><h1>Make room for <em>better business.</em></h1><p>Bring stock, sales and supplier records together. Start with a clear view of what’s happening today.</p><div class="login-aside-points"><span>${icon('check')} Stock at a glance</span><span>${icon('check')} Sales made simple</span><span>${icon('check')} Reports that help</span></div></div><div class="login-aside-foot">© 2026 StockSetu · Simple tools for everyday business</div></aside><section class="login-main"><div class="login-form-wrap"><span class="eyebrow">Welcome back</span><h2>Log in to StockSetu</h2><p class="login-subtitle">Enter your details to open your workspace.</p><form id="login-form"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" placeholder="Your business email" autocomplete="email" required></div><div class="field"><label for="password">Password</label><div class="password-wrap"><input id="password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required><button type="button" class="show-password" id="show-password">Show</button></div></div><div class="form-error" id="login-error" role="alert" hidden>Please enter a valid email and password to continue.</div><div class="login-meta"><label class="remember"><input type="checkbox" checked> Remember me</label><a class="text-btn" href="#" id="forgot-password">Forgot password?</a></div><button class="btn login-submit" type="submit">Continue to workspace ${icon('arrow')}</button></form><div class="login-demo"><strong>Workspace access:</strong> Use the email and password you registered with.</div><div class="login-bottom">New to StockSetu? <a class="text-btn" href="#/register" id="create-account">Create an account</a></div><a class="login-back" href="#/">${icon('arrow')} Back to home</a></div></section></main>`;
  document.querySelector('#show-password').addEventListener('click', event => { const input = document.querySelector('#password'); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; event.currentTarget.textContent = show ? 'Hide' : 'Show'; });
  document.querySelector('#forgot-password').addEventListener('click', event => { event.preventDefault(); toast('Password recovery is not connected in this preview yet.'); });
 

document.querySelector('#login-form').addEventListener('submit', async event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  const errorBox = document.querySelector('#login-error');

  errorBox.hidden = true;

  try {
    const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed. Check your credentials.');
    }

    if (!data.access_token) {
      throw new Error('The backend did not return an access token.');
    }

    localStorage.setItem('stocksetu-token', data.access_token);
    localStorage.setItem('stocksetu-user', email);

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
function productStatus(item) {
  if (Number(item.quantity) <= 0) return { text: 'Out of stock', className: 'out' };
  if (Number(item.quantity) <= Number(item.reorder || 15)) return { text: 'Low stock', className: 'low' };
  return { text: 'In stock', className: '' };
}
function topbar(title) {
  const dark = document.documentElement.dataset.theme === 'dark';
  return `<header class="topbar"><div class="topbar-left"><button class="icon-btn mobile-menu" data-action="menu" aria-label="Open menu">${icon('menu')}</button><span class="breadcrumbs">Workspace ${icon('chevron')} <b>${escapeHTML(title)}</b></span></div><div class="top-actions"><span class="today-chip">${icon('calendar')} ${new Date().toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short'})}</span><button class="icon-btn theme-toggle" data-action="toggle-theme" aria-label="${dark?'Switch to light mode':'Switch to dark mode'}" title="${dark?'Switch to light mode':'Switch to dark mode'}" aria-pressed="${dark}">${icon(dark?'sun':'moon')}</button><button class="icon-btn" data-action="help" aria-label="Help">${icon('spark')}</button><button class="icon-btn notification-button" data-action="notifications" aria-label="Notifications">${icon('bell')}<i></i></button></div></header>`;
}
function renderDashboard() {
  window.removeEventListener('scroll', updateScrollProgress);
  const title = activePage;
  const nav = navGroups.map(group => `<div class="workspace-label">${group.label}</div><div class="side-links">${group.items.map(([name, glyph]) => `<button class="side-link ${name === activePage ? 'active' : ''}" data-page="${escapeHTML(name)}">${icon(glyph)}<span>${escapeHTML(name)}</span>${name === 'Inventory' && lowProducts().length ? `<i class="nav-count">${lowProducts().length}</i>` : ''}</button>`).join('')}</div>`).join('');
  root.innerHTML = `<div class="dashboard"><aside class="sidebar" id="sidebar">${brand()}<div class="workspace-select"><i>${icon('grid')}</i><span><small>YOUR WORKSPACE</small><b>${escapeHTML(state.settings.businessName)}</b></span>${icon('chevron')}</div>${nav}<div class="workspace-label">Preferences</div><div class="side-links"><button class="side-link ${activePage === 'Settings' ? 'active' : ''}" data-page="Settings">${icon('settings')}<span>Settings</span></button></div><div class="side-bottom"><div class="plan-card"><i>${icon('spark')}</i><b>Everything in one place.</b><p>Your workspace is ready. Add items or record today’s first sale.</p><button data-action="add-product">+ Add a product</button></div><div class="profile"><i class="profile-avatar">${initials(getUser())}</i><span class="profile-info"><b>${escapeHTML(getUser())}</b><small>Workspace owner</small></span><button class="logout-btn" data-action="logout" aria-label="Log out">${icon('logout')}</button></div></div></aside><section class="dash-main">${topbar(title)}<main class="main-content" id="main-content">${renderPage(activePage)}</main></section><div class="mobile-backdrop" data-action="close-menu"></div></div>`;
  bindDashboard();
  if (activePage === 'Overview' || activePage === 'Reports') drawDashboardChart();
}
function pageHeader(title, subtitle, actions = '') { const today=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase(); return `<div class="page-heading"><div><div class="eyebrow">${escapeHTML(title === 'Overview' ? today : 'YOUR BUSINESS')}</div><h1>${title === 'Overview' ? `Good morning, ${escapeHTML(getUser().split(' ')[0])} 👋` : escapeHTML(title)}</h1><p>${escapeHTML(subtitle)}</p></div><div class="heading-actions">${actions}</div></div>`; }
function actionButton(text, action, kind = 'primary', glyph = 'plus') { return `<button class="btn ${kind === 'light' ? 'btn-light' : ''} btn-sm" data-action="${action}">${icon(glyph)} ${escapeHTML(text)}</button>`; }
function statCard(label, value, glyph, note, trend = '') { return `<article class="stat-card"><div class="stat-top"><span>${escapeHTML(label)}</span><i class="stat-icon">${icon(glyph)}</i></div><strong>${value}</strong><div class="stat-change ${trend === 'down' ? 'down' : ''}">${trend === 'down' ? '↘' : '↗'} ${escapeHTML(note)}</div></article>`; }
function renderPage(page) {
  if (page === 'Overview') return overviewPage();
  if (page === 'Inventory') return inventoryPage();
  if (page === 'Stock history') return stockHistoryPage();
  if (page === 'Sales & invoices') return salesPage();
  if (page === 'Purchases') return purchasesPage();
  if (page === 'Customers') return customersPage();
  if (page === 'Suppliers') return suppliersPage();
  if (page === 'Reports') return reportsPage();
  if (page === 'Settings') return settingsPage();
  return overviewPage();
}
function overviewPage() {
  const salesToday = state.sales.filter(sale => sale.date === daysAgo(0)).reduce((sum, sale) => sum + Number(sale.amount), 0);
  const stockValue = state.products.reduce((sum, product) => sum + Number(product.cost || product.price) * Number(product.quantity), 0);
  return `${pageHeader('Overview', 'Here’s what’s happening with your business today.', actionButton('New sale','new-sale') + actionButton('Add product','add-product','primary'))}
    <div class="stat-grid">${statCard('Sales today', money(salesToday), 'receipt', 'Across today’s invoices')}${statCard('Products in catalogue', state.products.length.toLocaleString('en-IN'), 'box', `${state.products.reduce((n,p)=>n+Number(p.quantity),0).toLocaleString('en-IN')} units in stock`)}${statCard('Stock value', money(stockValue), 'coins', 'At purchase cost')}${statCard('Needs a restock', lowProducts().length.toLocaleString('en-IN'), 'bell', 'Low or out of stock', lowProducts().length ? 'down' : '')}</div>
    <div class="dash-grid"><section class="panel chart-panel"><div class="panel-header"><div><h2>Sales overview</h2><p>Sales recorded over the selected period</p></div><select class="select-mini" data-action="period"><option value="7" ${chartPeriod===7?'selected':''}>Last 7 days</option><option value="30" ${chartPeriod===30?'selected':''}>This month</option><option value="90" ${chartPeriod===90?'selected':''}>Last 3 months</option></select></div><div class="revenue-chart" id="dashboard-chart"></div></section><section class="panel"><div class="panel-header"><div><h2>Stock to watch</h2><p>Items that could use a restock</p></div><button class="text-btn" data-page="Inventory">View inventory ${icon('arrow')}</button></div><div class="low-stock-list">${lowProducts().slice(0,4).map(product => `<div class="low-stock-item"><i class="stock-icon">${icon('box')}</i><span class="low-stock-info"><b>${escapeHTML(product.name)}</b><small>${escapeHTML(product.sku)} · ${escapeHTML(product.category)}</small></span><span class="stock-count">${product.quantity} ${escapeHTML(product.unit)}<small>Reorder at ${product.reorder}</small></span></div>`).join('') || '<div class="empty-small">Everything is stocked up. Nice work.</div>'}</div><div class="panel-footer"><button data-page="Inventory">See all products ${icon('arrow')}</button></div></section></div>
    <div class="dash-grid lower-grid"><section class="panel"><div class="panel-header"><div><h2>Recent sales</h2><p>Latest invoices from your business</p></div><button class="text-btn" data-page="Sales & invoices">All invoices ${icon('arrow')}</button></div>${salesTable(state.sales.slice(0,4),false)}</section><section class="panel activity-panel"><div class="panel-header"><div><h2>Recent activity</h2><p>Little things, all in sync</p></div><span class="live-badge"><i></i> RECENT ACTIVITY</span></div><div class="activity-list">${state.activity.slice(0,4).map(item => `<div class="activity-item"><i>${icon(item.icon)}</i><span><b>${escapeHTML(item.text)}</b><small>${escapeHTML(item.detail)}</small></span><time>${escapeHTML(item.time)}</time></div>`).join('')}</div></section></div>`;
}
function lowProducts() { return state.products.filter(product => Number(product.quantity) <= Number(product.reorder || 15)); }
function inventoryPage() {
  const inStock = state.products.filter(product => productStatus(product).className === '').length;
  const stockValue = state.products.reduce((sum,p) => sum + p.quantity * p.cost,0);
  return `${pageHeader('Inventory','Keep every item, quantity and reorder level in one place.',actionButton('Adjust stock','stock-adjust','light','filter')+actionButton('Add product','add-product'))}
    <div class="stat-grid compact-stats">${statCard('Total products',state.products.length,'box','In your catalogue')}${statCard('Healthy products',inStock,'check','Above reorder level')}${statCard('Stock value',money(stockValue),'coins','At purchase cost')}${statCard('Needs a restock',lowProducts().length,'bell','Low or out of stock',lowProducts().length?'down':'')}</div>
    <section class="panel table-panel"><div class="table-toolbar"><div><h2>All products <span class="soft-count">${state.products.length}</span></h2><p>Search or filter to find what you need.</p></div><div class="table-tools"><label class="search">${icon('search')}<input type="search" id="table-search" placeholder="Search name, SKU…" value="${escapeHTML(searchTerm)}" aria-label="Search products"></label><select class="select-mini" id="status-filter"><option value="all" ${statusFilter==='all'?'selected':''}>All status</option><option value="low" ${statusFilter==='low'?'selected':''}>Low stock</option><option value="out" ${statusFilter==='out'?'selected':''}>Out of stock</option></select></div></div><div class="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>STOCK</th><th>BUY PRICE</th><th>SELL PRICE</th><th>STATUS</th><th></th></tr></thead><tbody id="product-rows">${filteredProducts().map(productRow).join('') || '<tr><td class="table-empty" colspan="7">No products match this filter.</td></tr>'}</tbody></table></div><div class="table-bottom"><span>Showing ${filteredProducts().length} of ${state.products.length} products</span><span>Stock changes update automatically with each sale or purchase</span></div></section>`;
}
function stockHistoryPage() {
  return `${pageHeader('Stock history','A clear record of stock coming in, going out and being adjusted.',actionButton('Export CSV','export-movements','light','download')+actionButton('Adjust stock','stock-adjust'))}<div class="stat-grid compact-stats">${statCard('Movements recorded',state.movements.length,'clock','Every stock change')}${statCard('Stock increases',state.movements.filter(m=>m.delta>0).length,'truck','Purchases, returns and adjustments')}${statCard('Stock decreases',state.movements.filter(m=>m.delta<0).length,'receipt','Sales and adjustments')}${statCard('Products to restock',lowProducts().length,'bell','Based on reorder levels',lowProducts().length?'down':'')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>Movement ledger <span class="soft-count">${state.movements.length}</span></h2><p>Each entry shows the quantity change and its reference.</p></div><label class="search">${icon('search')}<input type="search" id="movement-search" placeholder="Search product, reference or note" aria-label="Search stock history"></label></div><div class="table-wrap"><table><thead><tr><th>PRODUCT</th><th>TYPE</th><th>CHANGE</th><th>REFERENCE</th><th>DATE</th><th>NOTE</th></tr></thead><tbody id="movement-rows">${movementRows(state.movements)}</tbody></table></div></section>`;
}
function movementRows(items) { return items.map(m=>`<tr><td><span class="table-product"><i class="stock-icon">${icon('box')}</i><span>${escapeHTML(m.product)}<small>${escapeHTML(m.sku)}</small></span></span></td><td><span class="movement-type ${m.delta>0?'in':'out'}">${m.delta>0?'↙':'↗'} ${escapeHTML(m.type)}</span></td><td><b class="${m.delta>0?'movement-positive':'movement-negative'}">${m.delta>0?'+':''}${m.delta} ${escapeHTML(m.unit)}</b></td><td><span class="sku-tag">${escapeHTML(m.reference)}</span></td><td>${dateLabel(m.date)}</td><td>${escapeHTML(m.note||'—')}</td></tr>`).join('')||'<tr><td colspan="6" class="table-empty">No stock movements recorded yet.</td></tr>'; }
function filteredProducts() {
  return state.products.filter(item => {
    const q = searchTerm.toLowerCase(); const match = `${item.name} ${item.sku} ${item.category} ${item.supplier}`.toLowerCase().includes(q);
    const status = productStatus(item).className;
    return match && (statusFilter === 'all' || (statusFilter === 'low' && status === 'low') || (statusFilter === 'out' && status === 'out'));
  });
}
function productRow(item) {
  const status = productStatus(item);
  return `<tr><td><span class="table-product"><i class="stock-icon">${icon('box')}</i><span>${escapeHTML(item.name)}<small>${escapeHTML(item.category)}</small></span></span></td><td><span class="sku-tag">${escapeHTML(item.sku)}</span></td><td><b class="qty-value">${Number(item.quantity).toLocaleString('en-IN')}</b> <span class="muted-small">${escapeHTML(item.unit)}</span><small class="reorder-sub">Reorder at ${item.reorder}</small></td><td>${money(item.cost)}</td><td><b class="dark-value">${money(item.price)}</b></td><td><span class="badge ${status.className}">${status.text}</span></td><td><button class="icon-btn row-action" data-action="edit-product" data-id="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.name)}">${icon('pencil')}</button><button class="icon-btn row-action" data-action="delete-product" data-id="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.name)}">${icon('trash')}</button></td></tr>`;
}
function salesTable(items, full = true) {
  return `<div class="table-wrap"><table><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>PAYMENT</th>${full?'<th></th>':''}</tr></thead><tbody>${items.map(item => `<tr><td><b>${escapeHTML(item.id)}</b></td><td>${escapeHTML(item.customer)}</td><td>${dateLabel(item.date)}</td><td><b class="dark-value">${money(item.amount)}</b></td><td><span class="badge ${item.payment==='Due'?'low':''}">${escapeHTML(item.payment)}</span></td>${full?`<td><button class="icon-btn row-action" data-action="view-invoice" data-id="${escapeHTML(item.id)}" aria-label="View invoice">${icon('eye')}</button></td>`:''}</tr>`).join('') || `<tr><td class="table-empty" colspan="${full?6:5}">No sales yet. Record your first sale to see it here.</td></tr>`}</tbody></table></div>`;
}
function salesPage() {
  const total = state.sales.reduce((sum,sale)=>sum+sale.amount,0); const due = state.sales.filter(sale=>sale.payment==='Due').reduce((sum,sale)=>sum+sale.amount,0);
  return `${pageHeader('Sales & invoices','Create a sale, record payment and keep every invoice close.',actionButton('Record a return','new-return','light','arrow')+actionButton('Export CSV','export-sales','light','download')+actionButton('New sale','new-sale'))}<div class="stat-grid compact-stats">${statCard('Total invoices',state.sales.length,'receipt','All recorded sales')}${statCard('Sales value',money(total),'coins','Across your invoices')}${statCard('Payments received',money(total-due),'check','Marked as paid')}${statCard('Returns recorded',state.returns.length,'arrow','Stock returned')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>All invoices <span class="soft-count">${state.sales.length}</span></h2><p>Sales records for your business.</p></div><label class="search">${icon('search')}<input type="search" id="sales-search" placeholder="Search invoice or customer" aria-label="Search sales"></label></div><div id="sales-table">${salesTable(state.sales)}</div></section><section class="panel table-panel"><div class="panel-header"><div><h2>Sales returns <span class="soft-count">${state.returns.length}</span></h2><p>Returned items are added back to inventory.</p></div><button class="text-btn" data-action="new-return">Record return ${icon('plus')}</button></div><div class="table-wrap"><table><thead><tr><th>RETURN</th><th>CUSTOMER</th><th>PRODUCT</th><th>QUANTITY</th><th>INVOICE</th><th>DATE</th></tr></thead><tbody>${returnRows(state.returns)}</tbody></table></div></section>`;
}
function returnRows(items){return items.map(item=>`<tr><td><b>${escapeHTML(item.id)}</b></td><td>${escapeHTML(item.customer)}</td><td>${escapeHTML(item.product)}<small class="reorder-sub">${escapeHTML(item.sku)}</small></td><td>+${item.quantity} ${escapeHTML(item.unit)}</td><td>${escapeHTML(item.reference)}</td><td>${dateLabel(item.date)}</td></tr>`).join('')||'<tr><td colspan="6" class="table-empty">No returns recorded yet.</td></tr>';}
function purchasesPage() {
  const total=state.purchases.reduce((sum,p)=>sum+p.amount,0);
  return `${pageHeader('Purchases','Record incoming stock and keep supplier purchases together.',actionButton('Export CSV','export-purchases','light','download')+actionButton('New purchase','new-purchase'))}<div class="stat-grid compact-stats">${statCard('Purchase orders',state.purchases.length,'cart','All recorded purchases')}${statCard('Purchase value',money(total),'coins','Across your records')}${statCard('Suppliers',state.suppliers.length,'truck','In your directory')}${statCard('Items to reorder',lowProducts().length,'bell','Based on reorder levels',lowProducts().length?'down':'')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>Purchase history</h2><p>Incoming stock from your suppliers.</p></div><label class="search">${icon('search')}<input type="search" id="purchase-search" placeholder="Search purchase or supplier" aria-label="Search purchases"></label></div><div class="table-wrap"><table><thead><tr><th>REFERENCE</th><th>SUPPLIER</th><th>DATE</th><th>ITEMS</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody id="purchase-rows">${purchaseRows(state.purchases)}</tbody></table></div></section>`;
}
function purchaseRows(items) { return items.map(item=>`<tr><td><b>${escapeHTML(item.id)}</b></td><td>${escapeHTML(item.supplier)}</td><td>${dateLabel(item.date)}</td><td>${item.items} items</td><td><b class="dark-value">${money(item.amount)}</b></td><td><span class="badge">${escapeHTML(item.status)}</span></td></tr>`).join('')||'<tr><td class="table-empty" colspan="6">No purchases recorded yet.</td></tr>'; }
function customersPage() {
  const due=state.customers.reduce((sum,c)=>sum+Number(c.due||0),0);
  const repeatCustomers=state.customers.filter(c=>state.sales.filter(s=>s.customer===c.name).length>1).length;
  return `${pageHeader('Customers','Keep customer details and pending balances easy to find.',actionButton('Export CSV','export-customers','light','download')+actionButton('Add customer','add-customer'))}<div class="stat-grid compact-stats">${statCard('Customers',state.customers.length,'users','In your directory')}${statCard('Outstanding balance',money(due),'clock','Across customer accounts',due?'down':'')}${statCard('Invoices',state.sales.length,'receipt','Linked to your sales')}${statCard('Repeat customers',repeatCustomers,'check','With more than one invoice')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>Customer directory <span class="soft-count">${state.customers.length}</span></h2><p>Contact details and account balance.</p></div><label class="search">${icon('search')}<input type="search" id="customer-search" placeholder="Search customers" aria-label="Search customers"></label></div><div class="table-wrap"><table><thead><tr><th>CUSTOMER</th><th>PHONE</th><th>EMAIL</th><th>INVOICES</th><th>BALANCE DUE</th><th></th></tr></thead><tbody id="customer-rows">${customerRows(state.customers)}</tbody></table></div></section>`;
}
function customerRows(items) { return items.map(c=>`<tr><td><span class="table-product"><i class="person-avatar">${initials(c.name)}</i><span>${escapeHTML(c.name)}<small>Customer since 2026</small></span></span></td><td>${escapeHTML(c.phone||'—')}</td><td>${escapeHTML(c.email||'—')}</td><td>${state.sales.filter(s=>s.customer===c.name).length}</td><td><b class="dark-value">${money(c.due)}</b></td><td><button class="icon-btn row-action" data-action="contact-customer" data-id="${escapeHTML(c.id)}" aria-label="Contact customer">${icon('phone')}</button></td></tr>`).join('')||'<tr><td colspan="6" class="table-empty">No customers yet.</td></tr>'; }
function suppliersPage() {
  const sourcedProducts=state.products.filter(p=>p.supplier&&state.suppliers.some(s=>s.name===p.supplier)).length;
  return `${pageHeader('Suppliers','A handy directory for the people who keep your shelves stocked.',actionButton('Export CSV','export-suppliers','light','download')+actionButton('Add supplier','add-supplier'))}<div class="stat-grid compact-stats">${statCard('Suppliers',state.suppliers.length,'truck','In your directory')}${statCard('Products sourced',sourcedProducts,'box','Linked to a supplier')}${statCard('Purchases recorded',state.purchases.length,'cart','In purchase history')}${statCard('Purchase value',money(state.purchases.reduce((a,p)=>a+p.amount,0)),'coins','From your records')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>Supplier directory</h2><p>Supplier contacts and linked items.</p></div><label class="search">${icon('search')}<input type="search" id="supplier-search" placeholder="Search suppliers" aria-label="Search suppliers"></label></div><div class="table-wrap"><table><thead><tr><th>SUPPLIER</th><th>PHONE</th><th>EMAIL</th><th>PRODUCTS</th><th>PURCHASES</th><th></th></tr></thead><tbody id="supplier-rows">${supplierRows(state.suppliers)}</tbody></table></div></section>`;
}
function supplierRows(items) { return items.map(s=>`<tr><td><span class="table-product"><i class="supplier-avatar">${icon('truck')}</i><span>${escapeHTML(s.name)}<small>Supplier</small></span></span></td><td>${escapeHTML(s.phone||'—')}</td><td>${escapeHTML(s.email||'—')}</td><td>${state.products.filter(p=>p.supplier===s.name).length}</td><td>${state.purchases.filter(p=>p.supplier===s.name).length}</td><td><button class="icon-btn row-action" data-action="contact-supplier" data-id="${escapeHTML(s.id)}" aria-label="Contact supplier">${icon('mail')}</button></td></tr>`).join('')||'<tr><td colspan="6" class="table-empty">No suppliers yet.</td></tr>'; }
function reportsPage() {
  const revenue=state.sales.reduce((a,s)=>a+s.amount,0); const cost=state.products.reduce((a,p)=>a+p.cost*p.quantity,0); const top=[...state.products].sort((a,b)=>b.quantity-a.quantity).slice(0,5);
  return `${pageHeader('Reports','A simple read on your sales, stock and business activity.',actionButton('Download report','export-report','light','download'))}<div class="stat-grid compact-stats">${statCard('Total sales',money(revenue),'receipt','From recorded invoices')}${statCard('Estimated stock value',money(cost),'coins','Using purchase cost')}${statCard('Average invoice',money(state.sales.length?revenue/state.sales.length:0),'chart','Across all invoices')}${statCard('Items to reorder',lowProducts().length,'bell','Current low-stock count',lowProducts().length?'down':'')}</div><div class="dash-grid"><section class="panel chart-panel"><div class="panel-header"><div><h2>Sales trend</h2><p>Seven-day overview · recorded sales</p></div><span class="live-badge">THIS WEEK</span></div><div class="revenue-chart" id="report-chart"></div></section><section class="panel"><div class="panel-header"><div><h2>Stock health</h2><p>Current inventory breakdown</p></div></div><div class="health-wrap"><div class="health-ring" style="--healthy:${state.products.length?Math.round(state.products.filter(p=>productStatus(p).className==='').length/state.products.length*100):0}%"><div><b>${state.products.length?Math.round(state.products.filter(p=>productStatus(p).className==='').length/state.products.length*100):0}%</b><small>healthy</small></div></div><div class="health-legend"><span><i class="dot-green"></i> In stock <b>${state.products.filter(p=>productStatus(p).className==='').length}</b></span><span><i class="dot-amber"></i> Low stock <b>${state.products.filter(p=>productStatus(p).className==='low').length}</b></span><span><i class="dot-red"></i> Out of stock <b>${state.products.filter(p=>productStatus(p).className==='out').length}</b></span></div></div></section></div><section class="panel table-panel"><div class="panel-header"><div><h2>Most stocked products</h2><p>Use this view to plan your next purchase.</p></div></div><div class="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>QUANTITY</th><th>STOCK VALUE</th><th>STATUS</th></tr></thead><tbody>${top.map(p=>`<tr><td>${escapeHTML(p.name)}</td><td>${escapeHTML(p.sku)}</td><td>${escapeHTML(p.category)}</td><td>${p.quantity} ${escapeHTML(p.unit)}</td><td>${money(p.cost*p.quantity)}</td><td><span class="badge ${productStatus(p).className}">${productStatus(p).text}</span></td></tr>`).join('')}</tbody></table></div></section>`;
}
function settingsPage() {
  const s=state.settings;
  return `${pageHeader('Settings','A few details about your business workspace.', '')}<div class="settings-layout"><nav class="settings-tabs"><button class="active">${icon('grid')} Business profile</button><button data-action="settings-notice">${icon('users')} Team & access</button><button data-action="settings-notice">${icon('receipt')} Invoice preferences</button><button data-action="settings-notice">${icon('bell')} Notifications</button></nav><section class="panel settings-panel"><div class="panel-header"><div><h2>Business profile</h2><p>These details personalise your workspace.</p></div><i class="settings-emblem">${icon('settings')}</i></div><form id="settings-form" class="settings-form"><div class="settings-logo-row"><i>${initials(s.businessName)}</i><span><b>Business name</b><small>This name appears in your workspace.</small></span><button type="button" class="btn btn-light btn-sm" data-action="settings-notice">Update</button></div><div class="modal-grid"><div class="field"><label for="business-name">Business name</label><input id="business-name" name="businessName" value="${escapeHTML(s.businessName)}" required></div><div class="field"><label for="owner-name">Owner name</label><input id="owner-name" name="owner" value="${escapeHTML(s.owner)}" required></div><div class="field"><label for="business-phone">Phone</label><input id="business-phone" name="phone" type="tel" placeholder="Add a business phone" value="${escapeHTML(s.phone)}"></div><div class="field"><label for="business-email">Email</label><input id="business-email" name="email" type="email" placeholder="Add a business email" value="${escapeHTML(s.email)}"></div><div class="field"><label for="currency">Currency</label><select id="currency" name="currency"><option value="INR" selected>INR — Indian Rupee (₹)</option></select></div><div class="field"><label for="business-address">Business address</label><input id="business-address" name="address" placeholder="Add a business address" value="${escapeHTML(s.address)}"></div></div><div class="form-footer"><span>Changes are saved in this browser only.</span><button class="btn btn-sm" type="submit">Save changes ${icon('check')}</button></div></form></section></div>`;
}
function drawDashboardChart() {
  const node=document.querySelector('#dashboard-chart, #report-chart'); if(!node)return;
  const period=node.id==='report-chart'?7:chartPeriod;const today=new Date();const rangeStart=period===30?new Date(today.getFullYear(),today.getMonth(),1):new Date(today.getFullYear(),today.getMonth(),today.getDate()-period+1);const dayCount=period===30?today.getDate():period;const starts=Array.from({length:7},(_,i)=>{const date=new Date(rangeStart);date.setDate(date.getDate()+Math.floor(i*dayCount/7));return date;});const ends=starts.map((date,i)=>i===6?new Date(today.getFullYear(),today.getMonth(),today.getDate()+1):starts[i+1]);const amounts=starts.map((start,i)=>state.sales.filter(s=>{const date=new Date(`${s.date}T00:00:00`);return date>=start&&date<ends[i];}).reduce((sum,s)=>sum+s.amount,0));
  const max=Math.max(...amounts,1000); const pts=amounts.map((amount,i)=>[28+i*82,125-(amount/max)*95]);
  const line=pts.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '); const area=`${line} L520 145 L28 145 Z`;
  const labels=starts.map((date,i)=>`<text class="chart-label" x="${pts[i][0]-10}" y="170">${dayCount===7?date.toLocaleDateString('en-IN',{weekday:'short'}):date.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</text>`).join('');
  node.innerHTML=`<svg viewBox="0 0 560 185" preserveAspectRatio="none" role="img" aria-label="Sales chart for last seven days"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#95cda0" stop-opacity=".44"/><stop offset="100%" stop-color="#95cda0" stop-opacity="0"/></linearGradient></defs><line class="chart-grid" x1="28" y1="28" x2="545" y2="28"/><line class="chart-grid" x1="28" y1="68" x2="545" y2="68"/><line class="chart-grid" x1="28" y1="108" x2="545" y2="108"/><line class="chart-grid" x1="28" y1="145" x2="545" y2="145"/><text class="chart-label" x="0" y="31">${money(max)}</text><text class="chart-label" x="0" y="71">${money(max*.66)}</text><text class="chart-label" x="0" y="111">${money(max*.33)}</text><path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${pts.map(p=>`<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`).join('')}${labels}</svg>`;
}

function bindDashboard() {
  root.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>{activePage=button.dataset.page;searchTerm='';statusFilter='all';renderDashboard();window.scrollTo({top:0,behavior:'smooth'});}));
  root.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>handleAction(button)));
  root.querySelector('#table-search')?.addEventListener('input',event=>{searchTerm=event.target.value;updateProductRows();});
  root.querySelector('#status-filter')?.addEventListener('change',event=>{statusFilter=event.target.value;updateProductRows();});
  root.querySelector('#sales-search')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();root.querySelector('#sales-table').innerHTML=salesTable(state.sales.filter(s=>`${s.id} ${s.customer}`.toLowerCase().includes(q)));});
  root.querySelector('#purchase-search')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();root.querySelector('#purchase-rows').innerHTML=purchaseRows(state.purchases.filter(p=>`${p.id} ${p.supplier}`.toLowerCase().includes(q)));});
  root.querySelector('#customer-search')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();root.querySelector('#customer-rows').innerHTML=customerRows(state.customers.filter(c=>`${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q)));});
  root.querySelector('#supplier-search')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();root.querySelector('#supplier-rows').innerHTML=supplierRows(state.suppliers.filter(s=>`${s.name} ${s.phone} ${s.email}`.toLowerCase().includes(q)));});
  root.querySelector('#movement-search')?.addEventListener('input',event=>{const q=event.target.value.toLowerCase();root.querySelector('#movement-rows').innerHTML=movementRows(state.movements.filter(m=>`${m.product} ${m.sku} ${m.reference} ${m.type} ${m.note||''}`.toLowerCase().includes(q)));});
  root.querySelectorAll('form').forEach(form=>form.addEventListener('submit',handleForm));
  root.querySelector('[data-action="period"]')?.addEventListener('change',event=>{chartPeriod=Number(event.target.value);drawDashboardChart();toast(`Showing sales for ${event.target.selectedOptions[0].text.toLowerCase()}.`);});
}
function updateProductRows(){const body=root.querySelector('#product-rows');if(body)body.innerHTML=filteredProducts().map(productRow).join('')||'<tr><td class="table-empty" colspan="7">No products match this filter.</td></tr>';const count=root.querySelector('.table-bottom span');if(count)count.textContent=`Showing ${filteredProducts().length} of ${state.products.length} products`;}
function handleAction(button) {
  const action=button.dataset.action; const id=button.dataset.id;
  if(action==='toggle-theme'){
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next; localStorage.setItem('stocksetu-theme',next); renderDashboard(); return;
  }
  if(action==='add-product')openProductModal();
  if(action==='edit-product')openProductModal(state.products.find(p=>p.id===id));
  
if(action==='delete-product'){
  const product = state.products.find(p => p.id === id);

  if(product && confirm(`Are you sure you want to delete "${product.name}"?`)){
    (async () => {
      try {
        await apiRequest(`/products/${id}`, {
          method: 'DELETE'
        });

        state.products = state.products.filter(p => p.id !== id);
        saveStore('products');
        renderDashboard();
        toast('Product deleted successfully.');
      } catch(error) {
        toast(`Could not delete product: ${error.message}`);
      }
    })();
  }
}

  if(action==='new-return')openReturnModal();
  if(action==='new-purchase')openPurchaseModal();
  if(action==='stock-adjust')openAdjustmentModal();
  if(action==='add-customer')openContactModal('customer');
  if(action==='add-supplier')openContactModal('supplier');
  if(action==='view-invoice'){const sale=state.sales.find(s=>s.id===id);if(sale)openInvoice(sale);}
  if(action==='export-products')downloadCSV('stocksetu-products.csv',[['Product','SKU','Category','Quantity','Unit','Buy price','Sell price','Supplier','Status'],...state.products.map(p=>[p.name,p.sku,p.category,p.quantity,p.unit,p.cost,p.price,p.supplier,productStatus(p).text])]);
  if(action==='export-sales')downloadCSV('stocksetu-sales.csv',[['Invoice','Customer','Date','Amount','Payment'],...state.sales.map(s=>[s.id,s.customer,s.date,s.amount,s.payment])]);
  if(action==='export-purchases')downloadCSV('stocksetu-purchases.csv',[['Purchase','Supplier','Date','Items','Amount','Status'],...state.purchases.map(p=>[p.id,p.supplier,p.date,p.items,p.amount,p.status])]);
  if(action==='export-customers')downloadCSV('stocksetu-customers.csv',[['Name','Phone','Email','Balance due'],...state.customers.map(c=>[c.name,c.phone,c.email,c.due])]);
  if(action==='export-suppliers')downloadCSV('stocksetu-suppliers.csv',[['Name','Phone','Email'],...state.suppliers.map(s=>[s.name,s.phone,s.email])]);
  if(action==='export-report')downloadCSV('stocksetu-report.csv',[['Metric','Value'],['Sales total',state.sales.reduce((a,s)=>a+s.amount,0)],['Inventory value',state.products.reduce((a,p)=>a+p.cost*p.quantity,0)],['Products to restock',lowProducts().length]]);
  if(action==='export-movements')downloadCSV('stocksetu-stock-history.csv',[['Movement','Product','SKU','Type','Change','Unit','Reference','Date','Note'],...state.movements.map(m=>[m.id,m.product,m.sku,m.type,m.delta,m.unit,m.reference,m.date,m.note])]);
  if(action==='contact-customer'){const item=state.customers.find(c=>c.id===id);if(item?.phone)window.location.href=`tel:${item.phone.replace(/[^\d+]/g,'')}`;else toast('Add a phone number to this customer first.');}
  if(action==='contact-supplier'){const item=state.suppliers.find(s=>s.id===id);if(item?.email)window.location.href=`mailto:${item.email}`;else toast('Add an email address to this supplier first.');}
  if(action==='logout'){localStorage.removeItem('stocksetu-user');location.hash='#/login';}
  if(action==='help'||action==='settings-notice')toast('This section is ready to customise.');
  if(action==='notifications')openNotifications();
  if(action==='menu'){document.querySelector('.sidebar').classList.add('mobile-open');document.querySelector('.mobile-backdrop').classList.add('show');}
  if(action==='close-menu'){document.querySelector('.sidebar').classList.remove('mobile-open');document.querySelector('.mobile-backdrop').classList.remove('show');}
}
 
async function handleForm(event) {
  const form=event.currentTarget; const type=form.dataset.form; if(!type)return; event.preventDefault(); const data=Object.fromEntries(new FormData(form));
  if(type==='product'){
    const existing=state.products.find(p=>p.id===data.id); const sku=String(data.sku).trim();
    if(state.products.some(p=>p.sku.toLowerCase()===sku.toLowerCase()&&p.id!==data.id)){form.querySelector('.form-error').hidden=false;return;}
    const value={id:data.id||crypto.randomUUID(),name:String(data.name).trim(),sku,category:String(data.category).trim(),quantity:Number(data.quantity),unit:data.unit,cost:Number(data.cost),price:Number(data.price),supplier:String(data.supplier),reorder:Number(data.reorder)};
    
    if (!existing) {
      try {
        const result = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify({
            name: value.name,
            category: value.category,
            quantity: value.quantity,
            cost_price: value.cost,
            selling_price: value.price,
            min_stock: value.reorder
          })
        });


        value.id = String(result.product_id);
      } catch (error) {
        toast(`Could not save product: ${error.message}`);
        return;
      }
    }
    
    else {
      try {
        await apiRequest(`/products/${existing.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: value.name,
            category: value.category,
            quantity: value.quantity,
            cost_price: value.cost,
            selling_price: value.price,
            min_stock: value.reorder
          })
        });
      } catch (error) {
        toast(`Could not update product: ${error.message}`);
        return;
      }
    }



    const oldQuantity=existing?Number(existing.quantity):0;if(existing)Object.assign(existing,value);else state.products.unshift(value);
    const delta=value.quantity-oldQuantity;if(delta!==0){const reference=existing?`ADJ-${String(state.movements.length+24).padStart(4,'0')}`:`OPEN-${value.sku}`;state.movements.unshift({id:nextMovementId(),product:value.name,sku:value.sku,type:existing?'Stock adjustment':'Opening stock',delta,unit:value.unit,reference,date:daysAgo(0),note:existing?'Quantity corrected from product editor':'Initial quantity'});state.activity.unshift({text:existing?'Stock adjusted':'Product added',detail:`${value.name} · ${delta>0?'+':''}${delta} ${value.unit}`,time:'Just now',icon:'box'});}
    else if(!existing)state.activity.unshift({text:'Product added',detail:`${value.name} · ${value.quantity} ${value.unit}`,time:'Just now',icon:'box'});
    saveAll(['products','movements','activity']);closeModal();renderDashboard();toast(existing?'Product details updated.':'Product added to your inventory.');return;
  }
  if(type==='sale'){
    const rows=[...form.querySelectorAll('.sale-line-row')];const selected=rows.map(row=>({product:state.products.find(p=>p.id===row.querySelector('.sale-product').value),quantity:Number(row.querySelector('.sale-quantity').value)}));
    const requested=new Map();selected.forEach(line=>{if(line.product)requested.set(line.product.id,(requested.get(line.product.id)||0)+line.quantity);});
    const invalid=selected.some(line=>!line.product||!Number.isInteger(line.quantity)||line.quantity<1)||[...requested].some(([id,quantity])=>quantity>state.products.find(p=>p.id===id).quantity);
    if(invalid){form.querySelector('.form-error').hidden=false;return;}
    const lineItems=[...requested].map(([id,quantity])=>{const product=state.products.find(p=>p.id===id);return{product,quantity,price:Number(product.price),total:Number(product.price)*quantity};});
    const totalQuantity=lineItems.reduce((sum,line)=>sum+line.quantity,0),amount=lineItems.reduce((sum,line)=>sum+line.total,0),customer=String(data.customer).trim();
    if(!customer){form.querySelector('.form-error').hidden=false;return;}
    let existingCustomer=state.customers.find(c=>c.name.toLowerCase()===customer.toLowerCase());if(!existingCustomer){existingCustomer={id:crypto.randomUUID(),name:customer,phone: '',email: '',due:0};state.customers.unshift(existingCustomer);}if(data.payment==='Due')existingCustomer.due=Number(existingCustomer.due||0)+amount;
    const nextInvoice=Math.max(1080,...state.sales.map(s=>Number(String(s.id).split('-')[1])||0))+1;const sale={id:`INV-${nextInvoice}`,customer,date:daysAgo(0),amount,payment:data.payment,items:totalQuantity,lines:lineItems.map(({product,quantity,price,total})=>({name:product.name,sku:product.sku,quantity,unit:product.unit,price,total}))};state.sales.unshift(sale);
    lineItems.forEach(({product,quantity})=>{product.quantity-=quantity;state.movements.unshift({id:nextMovementId(),product:product.name,sku:product.sku,type:'Sale',delta:-quantity,unit:product.unit,reference:sale.id,date:daysAgo(0),note:'Invoice recorded'});});
    state.activity.unshift({text:'New invoice created',detail:`${sale.id} · ${customer}`,time:'Just now',icon:'receipt'});saveAll(['products','sales','customers','activity','movements']);closeModal();renderDashboard();toast(`${sale.id} created. Stock updated.`);return;
  }
  if(type==='purchase'){
    const rows=[...form.querySelectorAll('.purchase-line-row')];const selected=rows.map(row=>({product:state.products.find(p=>p.id===row.querySelector('.purchase-product').value),quantity:Number(row.querySelector('.purchase-quantity').value),cost:Number(row.querySelector('.purchase-cost').value)}));
    if(selected.some(line=>!line.product||!Number.isInteger(line.quantity)||line.quantity<1||!Number.isFinite(line.cost)||line.cost<0)){form.querySelector('.form-error').hidden=false;return;}
    const grouped=new Map();selected.forEach(line=>{const current=grouped.get(line.product.id)||{product:line.product,quantity:0,amount:0};current.quantity+=line.quantity;current.amount+=line.quantity*line.cost;grouped.set(line.product.id,current);});const lineItems=[...grouped.values()];const totalQuantity=lineItems.reduce((sum,line)=>sum+line.quantity,0),amount=lineItems.reduce((sum,line)=>sum+line.amount,0);const enteredSupplier=String(data.supplier).trim();const supplier=enteredSupplier||lineItems[0]?.product.supplier||'Direct purchase';
    const nextPurchase=Math.max(405,...state.purchases.map(p=>Number(String(p.id).split('-')[1])||0))+1;const purchaseId=`PUR-${String(nextPurchase).padStart(4,'0')}`;lineItems.forEach(line=>{const product=line.product,oldQuantity=Number(product.quantity),oldCost=Number(product.cost);product.quantity+=line.quantity;product.cost=((oldQuantity*oldCost)+line.amount)/product.quantity;if(enteredSupplier)product.supplier=enteredSupplier;state.movements.unshift({id:nextMovementId(),product:product.name,sku:product.sku,type:'Purchase received',delta:line.quantity,unit:product.unit,reference:purchaseId,date:daysAgo(0),note:`Supplier delivery · ${money(line.amount)}`});});state.purchases.unshift({id:purchaseId,supplier,date:daysAgo(0),amount,items:totalQuantity,status:'Received',lines:lineItems.map(({product,quantity,amount:lineAmount})=>({name:product.name,sku:product.sku,quantity,unit:product.unit,cost:lineAmount/quantity,total:lineAmount}))});if(enteredSupplier&&!state.suppliers.some(s=>s.name.toLowerCase()===enteredSupplier.toLowerCase()))state.suppliers.unshift({id:crypto.randomUUID(),name:enteredSupplier,phone: '',email: '',products:lineItems.length});state.activity.unshift({text:'Stock received',detail:`${totalQuantity} units · ${supplier}`,time:'Just now',icon:'truck'});saveAll(['products','purchases','activity','movements','suppliers']);closeModal();renderDashboard();toast('Purchase recorded. Stock updated.');return;
  }
  if(type==='adjustment'){
    const product=state.products.find(p=>p.id===data.productId),qty=Number(data.quantity),direction=data.direction==='increase'?1:-1;
    if(!product||qty<1||product.quantity+qty*direction<0){form.querySelector('.form-error').hidden=false;return;}
    product.quantity+=qty*direction;const movementId=`ADJ-${String(state.movements.length+24).padStart(4,'0')}`;state.movements.unshift({id:nextMovementId(),product:product.name,sku:product.sku,type:'Stock adjustment',delta:qty*direction,unit:product.unit,reference:movementId,date:daysAgo(0),note:String(data.note).trim()||'Manual stock count'});state.activity.unshift({text:'Stock adjusted',detail:`${product.name} · ${qty*direction>0?'+':''}${qty*direction} ${product.unit}`,time:'Just now',icon:'box'});saveAll(['products','movements','activity']);closeModal();renderDashboard();toast('Stock adjusted and movement recorded.');return;
  }
  if(type==='return'){
    const product=state.products.find(p=>p.id===data.productId),qty=Number(data.quantity);if(!product||qty<1){form.querySelector('.form-error').hidden=false;return;}
    product.quantity+=qty;const returnId=`RET-${String(state.returns.length+1).padStart(4,'0')}`;const customer=String(data.customer).trim()||'Walk-in customer';const note=String(data.note).trim()||'Customer return';state.returns.unshift({id:returnId,customer,product:product.name,sku:product.sku,quantity:qty,unit:product.unit,reference:String(data.reference).trim()||'—',date:daysAgo(0),note});state.movements.unshift({id:nextMovementId(),product:product.name,sku:product.sku,type:'Sales return',delta:qty,unit:product.unit,reference:returnId,date:daysAgo(0),note});state.activity.unshift({text:'Sales return recorded',detail:`${product.name} · ${qty} ${product.unit}`,time:'Just now',icon:'box'});saveAll(['products','returns','movements','activity']);closeModal();renderDashboard();toast('Return recorded. Available stock updated.');return;
  }
  if(type==='customer'||type==='supplier'){
    const list=type==='customer'?'customers':'suppliers';const item={id:crypto.randomUUID(),name:String(data.name).trim(),phone:String(data.phone).trim(),email:String(data.email).trim()};
    if(type==='customer')item.due=0;else item.products=0;state[list].unshift(item);saveStore(list);closeModal();renderDashboard();toast(`${type==='customer'?'Customer':'Supplier'} added.`);return;
  }
  if(type==='settings'){
    state.settings={...state.settings,businessName:String(data.businessName).trim(),owner:String(data.owner).trim(),phone:String(data.phone).trim(),email:String(data.email).trim(),address:String(data.address).trim(),currency:data.currency};saveStore('settings');renderDashboard();toast('Business profile saved.');
  }
}
function saveAll(keys){keys.forEach(saveStore);}
function showModal(title,subtitle,body) {
  document.querySelector('.modal-backdrop')?.remove();const overlay=document.createElement('div');overlay.className='modal-backdrop';overlay.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${escapeHTML(title)}</h2><p>${escapeHTML(subtitle)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>${body}</section>`;document.body.append(overlay);
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeModal();const addSale=event.target.closest('.sale-add-line');if(addSale){overlay.querySelector('.sale-lines').insertAdjacentHTML('beforeend',saleLineMarkup(overlay.dataset.saleOptions));updateSalePreview(overlay.querySelector('form'));}const addPurchase=event.target.closest('.purchase-add-line');if(addPurchase){overlay.querySelector('.purchase-lines').insertAdjacentHTML('beforeend',purchaseLineMarkup(overlay.dataset.purchaseOptions));updatePurchasePreview(overlay.querySelector('form'));}const remove=event.target.closest('.sale-remove');if(remove&&!remove.disabled){remove.closest('.sale-line-row').remove();updateSalePreview(overlay.querySelector('form'));}const removePurchase=event.target.closest('.purchase-remove');if(removePurchase&&!removePurchase.disabled){removePurchase.closest('.purchase-line-row').remove();updatePurchasePreview(overlay.querySelector('form'));}});overlay.addEventListener('input',event=>{if(event.target.matches('.sale-quantity'))updateSalePreview(overlay.querySelector('form'));if(event.target.matches('.purchase-quantity,.purchase-cost'))updatePurchasePreview(overlay.querySelector('form'));});overlay.addEventListener('change',event=>{if(event.target.matches('.sale-product'))updateSalePreview(overlay.querySelector('form'));if(event.target.matches('.purchase-product')){const row=event.target.closest('.purchase-line-row');row.querySelector('.purchase-cost').value=event.target.selectedOptions[0]?.dataset.cost||'0';updatePurchasePreview(overlay.querySelector('form'));}});overlay.querySelector('.modal-close').addEventListener('click',closeModal);overlay.querySelector('.modal-cancel')?.addEventListener('click',closeModal);overlay.querySelector('form')?.addEventListener('submit',handleForm);overlay.querySelector('input,select')?.focus();if(overlay.querySelector('[data-form="sale"]')){overlay.dataset.saleOptions=document.querySelector('.sale-lines select')?.innerHTML||'';updateSalePreview(overlay.querySelector('form'));}if(overlay.querySelector('[data-form="purchase"]')){overlay.dataset.purchaseOptions=overlay.querySelector('.purchase-lines select')?.innerHTML||'';updatePurchasePreview(overlay.querySelector('form'));}
}
function closeModal(){document.querySelector('.modal-backdrop')?.remove();}
function openProductModal(item={}) {
  const editing=Boolean(item.id);const val=(key,def='')=>escapeHTML(item[key]??def);
  showModal(editing?'Edit product':'Add a product',editing?'Update this item in your catalogue.':'Add a new item to your inventory.',`<form data-form="product"><input type="hidden" name="id" value="${val('id')}"><div class="modal-grid"><div class="field"><label>Product name</label><input name="name" value="${val('name')}" placeholder="e.g. Basmati rice" required></div><div class="field"><label>Product code / SKU</label><input name="sku" value="${val('sku')}" placeholder="e.g. GRC-021" required></div><div class="field"><label>Category</label><input name="category" value="${val('category')}" placeholder="e.g. Groceries" required></div><div class="field"><label>Quantity on hand</label><input name="quantity" type="number" min="0" value="${val('quantity','1')}" required></div><div class="field"><label>Unit</label><select name="unit">${['pieces','packs','boxes','bottles','bags','bundles'].map(unit=>`<option ${val('unit','pieces')===unit?'selected':''}>${unit}</option>`).join('')}</select></div><div class="field"><label>Reorder level</label><input name="reorder" type="number" min="0" value="${val('reorder','10')}" required></div><div class="field"><label>Buy price (₹)</label><input name="cost" type="number" min="0" step=".01" value="${val('cost','0')}" required></div><div class="field"><label>Sell price (₹)</label><input name="price" type="number" min="0" step=".01" value="${val('price','0')}" required></div><div class="field full-field"><label>Supplier</label><input name="supplier" value="${val('supplier')}" placeholder="Supplier name"></div></div><p class="form-error" hidden>This SKU is already in your catalogue.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">${editing?'Save changes':'Add product'} ${icon('check')}</button></div></form>`);
}
function openSaleModal(){
  const options=state.products.filter(p=>p.quantity>0).map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${money(p.price)} · ${p.quantity} ${escapeHTML(p.unit)} left</option>`).join('');
  if(!options){toast('Add stock to a product before recording a sale.');return;}
  showModal('Create a sale','Add products to one invoice. Stock updates as soon as it is recorded.',`<form data-form="sale"><div class="field"><label>Customer name</label><input name="customer" list="customer-options" placeholder="Choose or enter a customer" required><datalist id="customer-options">${state.customers.map(c=>`<option value="${escapeHTML(c.name)}">`).join('')}</datalist></div><div class="sale-lines-wrap"><div class="sale-lines-head"><b>Invoice items</b><span>PRODUCT · QTY</span></div><div class="sale-lines">${saleLineMarkup(options)}</div><button class="sale-add-line" type="button">${icon('plus')} Add another product</button></div><div class="modal-grid sale-footer-fields"><div class="field"><label>Payment status</label><select name="payment"><option>Paid</option><option>Due</option></select></div><div class="sale-total-card"><small>Invoice total</small><strong class="sale-total">₹0</strong></div></div><p class="form-error" hidden>Check the product quantities; they must be available in stock.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Create invoice ${icon('arrow')}</button></div></form>`);
}
function saleLineMarkup(options){return `<div class="sale-line-row"><div class="field"><label>Product</label><select class="sale-product" name="productId" required>${options}</select></div><div class="field"><label>Qty</label><input class="sale-quantity" name="quantity" type="number" min="1" value="1" required></div><button class="sale-remove" type="button" aria-label="Remove item" disabled>${icon('trash')}</button></div>`;}
function updateSalePreview(form){if(!form)return;const amount=[...form.querySelectorAll('.sale-line-row')].reduce((sum,row)=>{const product=state.products.find(p=>p.id===row.querySelector('.sale-product').value);return sum+(product?Number(product.price)*Math.max(0,Number(row.querySelector('.sale-quantity').value)||0):0);},0);const total=form.querySelector('.sale-total');if(total)total.textContent=money(amount);form.querySelectorAll('.sale-remove').forEach(button=>button.disabled=form.querySelectorAll('.sale-line-row').length===1);}
function openPurchaseModal(){
  const options=state.products.map(p=>`<option value="${escapeHTML(p.id)}" data-cost="${Number(p.cost)||0}">${escapeHTML(p.name)} · ${p.quantity} ${escapeHTML(p.unit)} on hand</option>`).join('');
  if(!options){toast('Add a product before recording a purchase.');return;}
  showModal('Record a purchase','Add items from your supplier. Each item updates stock and average buy cost.',`<form data-form="purchase"><div class="field"><label>Supplier</label><input name="supplier" list="supplier-options" placeholder="Choose or enter supplier"><datalist id="supplier-options">${state.suppliers.map(s=>`<option value="${escapeHTML(s.name)}">`).join('')}</datalist></div><div class="sale-lines-wrap"><div class="sale-lines-head"><b>Purchase items</b><span>PRODUCT · QTY · BUY PRICE</span></div><div class="purchase-lines">${purchaseLineMarkup(options)}</div><button class="purchase-add-line" type="button">${icon('plus')} Add another product</button></div><div class="purchase-total-card"><small>Purchase total</small><strong class="purchase-total">₹0</strong></div><p class="form-error" hidden>Check each product, quantity and buy price before recording this purchase.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Record purchase ${icon('check')}</button></div></form>`);
}
function purchaseLineMarkup(options){const first=state.products[0];return `<div class="sale-line-row purchase-line-row"><div class="field"><label>Product</label><select class="purchase-product" name="productId" required>${options}</select></div><div class="field"><label>Qty</label><input class="purchase-quantity" name="quantity" type="number" min="1" value="1" required></div><div class="field"><label>Buy ₹</label><input class="purchase-cost" name="cost" type="number" min="0" step=".01" value="${Number(first?.cost)||0}" required></div><button class="purchase-remove" type="button" aria-label="Remove item" disabled>${icon('trash')}</button></div>`;}
function updatePurchasePreview(form){if(!form)return;const rows=[...form.querySelectorAll('.purchase-line-row')];const amount=rows.reduce((sum,row)=>sum+(Math.max(0,Number(row.querySelector('.purchase-quantity').value)||0)*Math.max(0,Number(row.querySelector('.purchase-cost').value)||0)),0);const total=form.querySelector('.purchase-total');if(total)total.textContent=money(amount);form.querySelectorAll('.purchase-remove').forEach(button=>button.disabled=rows.length===1);}
function openAdjustmentModal(){
  const options=state.products.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${p.quantity} ${escapeHTML(p.unit)} now</option>`).join('');
  if(!options){toast('Add a product before adjusting stock.');return;}
  showModal('Adjust stock','Record a stock count correction or damaged item.',`<form data-form="adjustment"><div class="field"><label>Product</label><select name="productId" required>${options}</select></div><div class="modal-grid"><div class="field"><label>Adjustment</label><select name="direction"><option value="increase">Increase stock</option><option value="decrease">Decrease stock</option></select></div><div class="field"><label>Quantity</label><input name="quantity" type="number" min="1" value="1" required></div></div><div class="field"><label>Reason</label><input name="note" placeholder="e.g. Physical stock count or damaged item"></div><p class="form-error" hidden>This adjustment would make the stock quantity invalid.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Save adjustment ${icon('check')}</button></div></form>`);
}
function openReturnModal(){
  const options=state.products.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${p.quantity} ${escapeHTML(p.unit)} in stock</option>`).join('');
  if(!options){toast('Add a product before recording a return.');return;}
  showModal('Record a sales return','Returned items go back into available stock.',`<form data-form="return"><div class="field"><label>Product returned</label><select name="productId" required>${options}</select></div><div class="modal-grid"><div class="field"><label>Quantity returned</label><input name="quantity" type="number" min="1" value="1" required></div><div class="field"><label>Customer</label><input name="customer" list="customer-options" placeholder="Choose or enter a customer"><datalist id="customer-options">${state.customers.map(c=>`<option value="${escapeHTML(c.name)}">`).join('')}</datalist></div></div><div class="modal-grid"><div class="field"><label>Original invoice (optional)</label><input name="reference" list="invoice-options" placeholder="e.g. INV-1084"><datalist id="invoice-options">${state.sales.map(s=>`<option value="${escapeHTML(s.id)}">`).join('')}</datalist></div><div class="field"><label>Reason</label><input name="note" placeholder="e.g. Damaged packaging"></div></div><p class="form-error" hidden>Choose a product and enter a valid return quantity.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Record return ${icon('check')}</button></div></form>`);
}
function openContactModal(type){const customer=type==='customer';showModal(customer?'Add a customer':'Add a supplier',customer?'Save a customer contact for easier billing.':'Save a supplier contact for purchase records.',`<form data-form="${type}"><div class="field"><label>${customer?'Customer':'Supplier'} name</label><input name="name" placeholder="Business or contact name" required></div><div class="modal-grid"><div class="field"><label>Phone</label><input name="phone" type="tel" placeholder="+91 …"></div><div class="field"><label>Email</label><input name="email" type="email" placeholder="Business email"></div></div><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Save ${customer?'customer':'supplier'} ${icon('check')}</button></div></form>`);}
function openInvoice(sale){const lines=Array.isArray(sale.lines)&&sale.lines.length?sale.lines.map(line=>`<div class="invoice-line"><span>${escapeHTML(line.name)} <small>${line.quantity} ${escapeHTML(line.unit)} × ${money(line.price)}</small></span><b>${money(line.total)}</b></div>`).join(''):`<div class="invoice-line"><span>${sale.items} item${sale.items===1?'':'s'} sold</span><b>${money(sale.amount)}</b></div>`;showModal(`Invoice ${sale.id}`,`Created ${dateLabel(sale.date)} · ${sale.payment}`,`<div class="invoice-detail"><div class="invoice-brand">${brand()}<span>INVOICE</span></div><div class="invoice-to"><small>BILLED TO</small><b>${escapeHTML(sale.customer)}</b><small>${dateLabel(sale.date)}</small></div><div class="invoice-items">${lines}</div><div class="invoice-total"><span>Total</span><b>${money(sale.amount)}</b></div><span class="badge ${sale.payment==='Due'?'low':''}">${escapeHTML(sale.payment)}</span></div><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Close</button>${sale.payment==='Due'?`<button class="btn btn-light btn-sm" data-action="mark-paid">Mark as paid ${icon('check')}</button>`:''}<button class="btn btn-sm" data-action="print-invoice">${icon('download')} Print / save PDF</button></div>`);document.querySelector('[data-action="print-invoice"]')?.addEventListener('click',()=>window.print());document.querySelector('[data-action="mark-paid"]')?.addEventListener('click',()=>{sale.payment='Paid';const customer=state.customers.find(c=>c.name===sale.customer);if(customer)customer.due=Math.max(0,Number(customer.due||0)-sale.amount);saveAll(['sales','customers']);closeModal();renderDashboard();toast(`${sale.id} marked as paid.`);});}
function openNotifications(){const items=lowProducts();showModal('Stock reminders',items.length?`${items.length} product${items.length===1?'':'s'} could use a restock.`:'All products are above their reorder level.',items.length?`<div class="notice-list">${items.map(p=>`<div class="notice-item"><i>${icon('box')}</i><span><b>${escapeHTML(p.name)}</b><small>${p.quantity} ${escapeHTML(p.unit)} left · Reorder at ${p.reorder}</small></span></div>`).join('')}</div><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Got it</button></div>`:`<div class="empty-state compact-empty"><i>${icon('check')}</i><p>You’re in good shape for now.</p></div><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Got it</button></div>`);}
function downloadCSV(filename,rows){const csv='\ufeff'+rows.map(row=>row.map(value=>{const text=String(value??'');const safe=/^[\t\r=+\-@]/.test(text)?`'${text}`:text;return `"${safe.replaceAll('"','""')}"`;}).join(',')).join('\n');const link=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`${filename} downloaded.`);}

function route(){
  window.removeEventListener('scroll',updateScrollProgress);
  const routeHash=location.hash.replace(/^#/,'');
  if(routeHash && !routeHash.startsWith('/')){
    document.documentElement.dataset.theme='light';
    if(!document.querySelector('.site-header'))brandPageHome();
    requestAnimationFrame(()=>document.getElementById(decodeURIComponent(routeHash))?.scrollIntoView({behavior:'smooth',block:'start'}));
    return;
  }
  const path=routeHash||'/';
  document.documentElement.dataset.theme = path.startsWith('/dashboard') || path === '/login' || path === '/register' ? (localStorage.getItem('stocksetu-theme') === 'dark' ? 'dark' : 'light') : 'light';
  if(path==='/dashboard'){
    if(!localStorage.getItem('stocksetu-token')){location.hash='#/login';return;}
    activePage='Overview';renderDashboard();
  loadProductsFromBackend();  
  }else if(path==='/login')renderLogin();else if(path==='/register')renderRegister();else brandPageHome();
  window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('hashchange',route);
root.addEventListener('click',event=>{if(event.target.closest('[data-action="close-modal"]'))closeModal();});
route();
