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
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-1.99 1.83l-.11 1.28a7.97 7.97 0 0 0-1.43.83l-1.22-.43a2 2 0 0 0-2.44.91l-.22.38a2 2 0 0 0 .45 2.56l1 .85a8.03 8.03 0 0 0 0 1.65l-1 .85a2 2 0 0 0-.45 2.56l.22.38a2 2 0 0 0 2.44.91l1.22-.43c.43.34.91.62 1.43.83l.11 1.28A2 2 0 0 0 11.78 22h.44a2 2 0 0 0 1.99-1.83l.11-1.28c.52-.21 1-.49 1.43-.83l1.22.43a2 2 0 0 0 2.44-.91l.22-.38a2 2 0 0 0-.45-2.56l-1-.85a8.03 8.03 0 0 0 0-1.65l1-.85a2 2 0 0 0 .45-2.56l-.22-.38a2 2 0 0 0-2.44-.91l-1.22.43a7.97 7.97 0 0 0-1.43-.83l-.11-1.28A2 2 0 0 0 12.22 2z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  more: '<circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
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
const seed = { products: [], sales: [], purchases: [], customers: [], suppliers: [], activity: [], movements: [], returns: [], settings: { businessName: 'Store Workspace', owner: 'Workspace Owner', phone: '', email: '', address: '', currency: 'INR' } };
const state = Object.fromEntries(Object.entries(seed).map(([key, fallback]) => [key, readStore(key, fallback)]));
let activePage = 'Overview';
let activeSettingsTab = 'profile';
let searchTerm = '';
let statusFilter = 'all';
let chartPeriod = 7;
let toastTimer;
let revealObserver;
let landingCameraController;

function daysAgo(days) {
  const date = new Date(); date.setDate(date.getDate() - days); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function readStore(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(`stocksetu-account:${accountId()}:${key}`)); return value ?? structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function accountId() { try { const token=getAuthToken(); const part=token?.split('.')[1]; if(part){const payload=JSON.parse(atob(part.replace(/-/g,'+').replace(/_/g,'/')));if(payload.sub)return String(payload.sub);} } catch {} return String(localStorage.getItem('stocksetu-user') || 'guest').trim().toLowerCase(); }
function getAuthToken() { return localStorage.getItem('stocksetu-token') || sessionStorage.getItem('stocksetu-token'); }
function saveStore(key) { localStorage.setItem(`stocksetu-account:${accountId()}:${key}`, JSON.stringify(state[key])); }
function hydrateAccountData() { for (const [key, fallback] of Object.entries(seed)) state[key] = readStore(key, fallback); }
function nextMovementId() { const latest=Math.max(0,...state.movements.map(m=>Number(String(m.id).match(/(\d+)$/)?.[1])||0)); return `MOV-${String(latest+1).padStart(4,'0')}`; }
function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
function money(value) { return `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`; }
function dateLabel(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function initials(name = 'Business owner') { return name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase(); }
function getUser() { return String(state.settings.owner || '').trim() || localStorage.getItem('stocksetu-user') || 'Workspace Owner'; }

const isLocalPreview = ['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname)
  || location.hostname.endsWith('.localhost');
const API_BASE_URL = isLocalPreview && location.port !== '8000'
  ? 'http://127.0.0.1:8000'
  : '';

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


function applySettingsFromApi(settings) {
  state.settings = {
    businessName: settings.business_name || 'Store Workspace',
    owner: settings.owner_name || 'Workspace Owner',
    phone: settings.phone || '',
    email: settings.email || '',
    address: settings.address || '',
    currency: settings.currency || 'INR'
  };
  saveStore('settings');
}

async function loadSettingsFromBackend() {
  try {
    const settings = await apiRequest('/settings');
    applySettingsFromApi(settings);
    if (location.hash === '#/dashboard') renderDashboard();
  } catch (error) {
    toast(`Could not load business settings: ${error.message}`);
  }
}



const API_BASE = API_BASE_URL;

async function apiRequest(path, options = {}) {
  const token = getAuthToken();

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

async function persistProductChanges(entries) {
  const applied = [];
  const payload = product => ({ name: product.name, sku: product.sku, category: product.category, quantity: product.quantity, unit: product.unit, cost_price: product.cost, selling_price: product.price, supplier: product.supplier || '', min_stock: product.reorder });
  try {
    for (const { product, changes } of entries) {
      const previous = { quantity: product.quantity, cost: product.cost, supplier: product.supplier };
      const updated = { ...product, ...changes };
      await apiRequest(`/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload(updated)) });
      Object.assign(product, changes);
      applied.push({ product, previous });
    }
  } catch (error) {
    for (const { product, previous } of applied.reverse()) {
      try { await apiRequest(`/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload({ ...product, ...previous })) }); } catch {}
      Object.assign(product, previous);
    }
    throw error;
  }
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
function productStatus(item) {
  if (Number(item.quantity) <= 0) return { text: 'Out of stock', className: 'out' };
  if (Number(item.quantity) <= Number(item.reorder || 15)) return { text: 'Low stock', className: 'low' };
  return { text: 'In stock', className: '' };
}
function topbar(title) {
  const dark = document.documentElement.dataset.theme === 'dark';
  const preferences = readFeatureSettings().notifications;
  const reminderCount = (preferences.lowStock ? lowProducts().length : 0) + (preferences.unpaidInvoices ? state.sales.filter(sale => sale.payment === 'Due').length : 0);
  return `<header class="topbar"><div class="topbar-left"><button class="icon-btn mobile-menu" data-action="menu" aria-label="Open menu">${icon('menu')}</button><span class="breadcrumbs">${escapeHTML(state.settings.businessName || 'Workspace')} ${icon('chevron')} <b>${escapeHTML(title)}</b></span></div><div class="top-actions"><span class="today-chip">${icon('calendar')} ${new Date().toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short'})}</span><button class="icon-btn theme-toggle" data-action="toggle-theme" aria-label="${dark?'Switch to light mode':'Switch to dark mode'}" title="${dark?'Switch to light mode':'Switch to dark mode'}" aria-pressed="${dark}">${icon(dark?'sun':'moon')}</button><button class="icon-btn" data-action="help" aria-label="Help">${icon('spark')}</button><button class="icon-btn notification-button" data-action="notifications" aria-label="${reminderCount ? `Notifications, ${reminderCount} reminders` : 'Notifications'}">${icon('bell')}${reminderCount ? '<i aria-hidden="true"></i>' : ''}</button></div></header>`;
}
function renderDashboard() {
  window.removeEventListener('scroll', updateScrollProgress);
  const title = activePage;
  const nav = navGroups.map(group => `<div class="workspace-label">${group.label}</div><div class="side-links">${group.items.map(([name, glyph]) => `<button class="side-link ${name === activePage ? 'active' : ''}" data-page="${escapeHTML(name)}">${icon(glyph)}<span>${escapeHTML(name)}</span>${name === 'Inventory' && lowProducts().length ? `<i class="nav-count">${lowProducts().length}</i>` : ''}</button>`).join('')}</div>`).join('');
  root.innerHTML = `<div class="dashboard"><aside class="sidebar" id="sidebar">${brand()}<button type="button" class="workspace-select" data-page="Overview" aria-label="Go to Overview"><i>${icon('grid')}</i><span><small>YOUR WORKSPACE</small><b>${escapeHTML(state.settings.businessName)}</b></span>${icon('chevron')}</button>${nav}<div class="workspace-label">Preferences</div><div class="side-links"><button class="side-link ${activePage === 'Settings' ? 'active' : ''}" data-page="Settings">${icon('settings')}<span>Settings</span></button></div><div class="side-bottom"><div class="plan-card"><i>${icon('spark')}</i><b>Everything in one place.</b><p>Your workspace is ready. Add items or record today’s first sale.</p><button data-action="add-product">+ Add a product</button></div><div class="profile"><i class="profile-avatar">${initials(getUser())}</i><span class="profile-info"><b>${escapeHTML(getUser())}</b><small>Workspace owner</small></span><button class="logout-btn" data-action="logout" aria-label="Log out">${icon('logout')}</button></div></div></aside><section class="dash-main">${topbar(title)}<main class="main-content" id="main-content">${renderPage(activePage)}</main></section><div class="mobile-backdrop" data-action="close-menu"></div></div>`;
  bindDashboard();
  document.querySelector('#settings-form')?.addEventListener('submit', saveBusinessSettings);
  document.querySelector('#invoice-settings-form')?.addEventListener('submit', saveInvoicePreferences);
  document.querySelector('#notification-settings-form')?.addEventListener('submit', saveNotificationPreferences);
  if (activePage === 'Overview' || activePage === 'Reports') drawDashboardChart();
}
function pageHeader(title, subtitle, actions = '') { const today=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase(); return `<div class="page-heading"><div><div class="eyebrow">${escapeHTML(title === 'Overview' ? today : 'YOUR BUSINESS')}</div><h1>${title === 'Overview' ? `Good morning, ${escapeHTML(getUser())} 👋` : escapeHTML(title)}</h1><p>${escapeHTML(subtitle)}</p></div><div class="heading-actions">${actions}</div></div>`; }
function actionButton(text, action, kind = 'primary', glyph = 'plus') { return `<button class="btn ${kind === 'light' ? 'btn-light' : ''} btn-sm" data-action="${action}">${icon(glyph)} ${escapeHTML(text)}</button>`; }
function rowMenu(id, items, label = 'More actions') {
  const safeId = escapeHTML(id);
  return `<div class="row-menu"><button type="button" class="icon-btn row-action row-menu-trigger" data-action="toggle-row-menu" aria-label="${escapeHTML(label)}" aria-haspopup="menu" aria-expanded="false">${icon('more')}</button><div class="row-menu-popover" role="menu" hidden>${items.map(([action, title, glyph, danger]) => `<button type="button" role="menuitem" class="row-menu-item ${danger ? 'danger' : ''}" data-action="${escapeHTML(action)}" data-id="${safeId}">${icon(glyph)}<span>${escapeHTML(title)}</span></button>`).join('')}</div></div>`;
}
function closeRowMenus() {
  document.querySelectorAll('.row-menu-popover:not([hidden])').forEach(menu => {
    menu.hidden = true;
    menu._rowMenuTrigger?.setAttribute('aria-expanded', 'false');
    if (menu._rowMenuOrigin) menu._rowMenuOrigin.appendChild(menu);
    menu._rowMenuTrigger = null;
    menu._rowMenuOrigin = null;
  });
}
document.addEventListener('click', event => {
  const menuItem = event.target.closest('.row-menu-item');
  if (menuItem) { event.preventDefault(); handleAction(menuItem); return; }
  if (!event.target.closest('.row-menu-trigger, .row-menu-popover')) closeRowMenus();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeRowMenus(); });
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
function drawDashboardChart() {
  const node=document.querySelector('#dashboard-chart, #report-chart'); if(!node)return;
  const period=node.id==='report-chart'?7:chartPeriod;const today=new Date();const rangeStart=period===30?new Date(today.getFullYear(),today.getMonth(),1):new Date(today.getFullYear(),today.getMonth(),today.getDate()-period+1);const dayCount=period===30?today.getDate():period;const starts=Array.from({length:7},(_,i)=>{const date=new Date(rangeStart);date.setDate(date.getDate()+Math.floor(i*dayCount/7));return date;});const ends=starts.map((date,i)=>i===6?new Date(today.getFullYear(),today.getMonth(),today.getDate()+1):starts[i+1]);const amounts=starts.map((start,i)=>state.sales.filter(s=>{const date=new Date(`${s.date}T00:00:00`);return date>=start&&date<ends[i];}).reduce((sum,s)=>sum+s.amount,0));
  const max=Math.max(...amounts,1000); const pts=amounts.map((amount,i)=>[28+i*82,125-(amount/max)*95]);
  const line=pts.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '); const area=`${line} L520 145 L28 145 Z`;
  const labels=starts.map((date,i)=>`<text class="chart-label" x="${pts[i][0]-10}" y="170">${dayCount===7?date.toLocaleDateString('en-IN',{weekday:'short'}):date.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</text>`).join('');
  node.innerHTML=`<svg viewBox="0 0 560 185" preserveAspectRatio="none" role="img" aria-label="Sales chart for last seven days"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#95cda0" stop-opacity=".44"/><stop offset="100%" stop-color="#95cda0" stop-opacity="0"/></linearGradient></defs><line class="chart-grid" x1="28" y1="28" x2="545" y2="28"/><line class="chart-grid" x1="28" y1="68" x2="545" y2="68"/><line class="chart-grid" x1="28" y1="108" x2="545" y2="108"/><line class="chart-grid" x1="28" y1="145" x2="545" y2="145"/><text class="chart-label" x="0" y="31">${money(max)}</text><text class="chart-label" x="0" y="71">${money(max*.66)}</text><text class="chart-label" x="0" y="111">${money(max*.33)}</text><path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${pts.map(p=>`<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`).join('')}${labels}</svg>`;
}

function bindDashboard() {
  root.onclick = event => {
    const tab = event.target.closest('[data-settings-tab]');
    if (tab) { activeSettingsTab = tab.dataset.settingsTab; renderDashboard(); return; }
    const page = event.target.closest('[data-page]');
    if (page) { activePage = page.dataset.page; searchTerm = ''; statusFilter = 'all'; renderDashboard(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const action = event.target.closest('[data-action]');
    if (action) handleAction(action);
  };
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
  if (action === 'toggle-row-menu') {
    const menu = button.parentElement?.querySelector('.row-menu-popover');
    const shouldOpen = Boolean(menu?.hidden); closeRowMenus();
    if (menu && shouldOpen) {
      menu._rowMenuOrigin = menu.parentElement;
      menu._rowMenuTrigger = button;
      document.body.appendChild(menu);
      menu.hidden = false; button.setAttribute('aria-expanded', 'true');
      const rect = button.getBoundingClientRect(); const height = menu.offsetHeight;
      menu.style.top = `${rect.bottom + height + 8 > innerHeight ? Math.max(8, rect.top - height - 8) : rect.bottom + 6}px`;
      menu.style.left = `${Math.max(8, Math.min(innerWidth - menu.offsetWidth - 8, rect.right - menu.offsetWidth))}px`;
    }
    return;
  }
  closeRowMenus();
  if(action==='toggle-theme'){
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next; localStorage.setItem('stocksetu-theme',next); renderDashboard(); return;
  }
  if(action==='add-product')openProductModal();
  if(action==='new-sale')openSaleModal();
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
  if(action==='delete-invoice')deleteInvoice(id);
  if(action==='delete-purchase')deletePurchase(id);
  if(action==='view-purchase'){const item=state.purchases.find(p=>p.id===id);if(item)openPurchase(item);}
  if(action==='delete-movement')deleteMovement(id);
  if(action==='view-return'){const item=state.returns.find(r=>r.id===id);if(item)openReturn(item);}
  if(action==='delete-return')deleteReturn(id);
  if(action==='edit-customer')openContactModal('customer',state.customers.find(c=>c.id===id));
  if(action==='edit-supplier')openContactModal('supplier',state.suppliers.find(s=>s.id===id));
  if(action==='delete-customer')deleteContact('customer',id);
  if(action==='delete-supplier')deleteContact('supplier',id);
  if(action==='export-products')downloadCSV('stocksetu-products.csv',[['Product','SKU','Category','Quantity','Unit','Buy price','Sell price','Supplier','Status'],...state.products.map(p=>[p.name,p.sku,p.category,p.quantity,p.unit,p.cost,p.price,p.supplier,productStatus(p).text])]);
  if(action==='export-sales')downloadCSV('stocksetu-sales.csv',[['Invoice','Customer','Mobile','Date','Amount','Payment'],...state.sales.map(s=>[s.id,s.customer,s.phone||'',s.date,s.amount,s.payment])]);
  if(action==='export-purchases')downloadCSV('stocksetu-purchases.csv',[['Purchase','Supplier','Date','Items','Amount','Status'],...state.purchases.map(p=>[p.id,p.supplier,p.date,p.items,p.amount,p.status])]);
  if(action==='export-customers')downloadCSV('stocksetu-customers.csv',[['Name','Phone','Email','Balance due'],...state.customers.map(c=>[c.name,c.phone,c.email,c.due])]);
  if(action==='export-suppliers')downloadCSV('stocksetu-suppliers.csv',[['Name','Phone','Email'],...state.suppliers.map(s=>[s.name,s.phone,s.email])]);
  if(action==='export-report')downloadCSV('stocksetu-report.csv',[['Metric','Value'],['Sales total',state.sales.reduce((a,s)=>a+s.amount,0)],['Inventory value',state.products.reduce((a,p)=>a+p.cost*p.quantity,0)],['Products to restock',lowProducts().length]]);
  if(action==='export-movements')downloadCSV('stocksetu-stock-history.csv',[['Movement','Product','SKU','Type','Change','Unit','Reference','Date','Note'],...state.movements.map(m=>[m.id,m.product,m.sku,m.type,m.delta,m.unit,m.reference,m.date,m.note])]);
  if(action==='contact-customer'){const item=state.customers.find(c=>c.id===id);if(item?.phone)window.location.href=`tel:${item.phone.replace(/[^\d+]/g,'')}`;else toast('Add a phone number to this customer first.');}
  if(action==='contact-supplier'){const item=state.suppliers.find(s=>s.id===id);if(item?.email)window.location.href=`mailto:${item.email}`;else toast('Add an email address to this supplier first.');}
  if(action==='logout'){localStorage.removeItem('stocksetu-token');sessionStorage.removeItem('stocksetu-token');localStorage.removeItem('stocksetu-user');state.settings={...seed.settings};location.hash='#/login';}
  if(action==='help')openHelpModal();
  if(action==='focus-business-name')document.querySelector('#business-name')?.focus();
  if(action==='notifications')openNotifications();
  if(action==='menu'){document.querySelector('.sidebar').classList.add('mobile-open');document.querySelector('.mobile-backdrop').classList.add('show');}
  if(action==='close-menu'){document.querySelector('.sidebar').classList.remove('mobile-open');document.querySelector('.mobile-backdrop').classList.remove('show');}
}
 
async function handleForm(event) {
  const form=event.currentTarget;
  const type=form.dataset.form;
  if(!type)return;
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form));
  if(type==='product')return handleProductForm(form,data,type);
  if(type==='sale')return handleSaleForm(form,data,type);
  if(type==='purchase')return handlePurchaseForm(form,data,type);
  if(type==='adjustment')return handleAdjustmentForm(form,data,type);
  if(type==='return')return handleReturnForm(form,data,type);
  if(type==='customer'||type==='supplier')return handleContactForm(form,data,type);
}

function saveAll(keys){keys.forEach(saveStore);}
function showModal(title,subtitle,body) {
  document.querySelector('.modal-backdrop')?.remove();const overlay=document.createElement('div');overlay.className='modal-backdrop';overlay.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${escapeHTML(title)}</h2><p>${escapeHTML(subtitle)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>${body}</section>`;document.body.append(overlay);
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeModal();const addSale=event.target.closest('.sale-add-line');if(addSale){overlay.querySelector('.sale-lines').insertAdjacentHTML('beforeend',saleLineMarkup(overlay.dataset.saleOptions));updateSalePreview(overlay.querySelector('form'));}const addPurchase=event.target.closest('.purchase-add-line');if(addPurchase){overlay.querySelector('.purchase-lines').insertAdjacentHTML('beforeend',purchaseLineMarkup(overlay.dataset.purchaseOptions));updatePurchasePreview(overlay.querySelector('form'));}const remove=event.target.closest('.sale-remove');if(remove&&!remove.disabled){remove.closest('.sale-line-row').remove();updateSalePreview(overlay.querySelector('form'));}const removePurchase=event.target.closest('.purchase-remove');if(removePurchase&&!removePurchase.disabled){removePurchase.closest('.purchase-line-row').remove();updatePurchasePreview(overlay.querySelector('form'));}});overlay.addEventListener('input',event=>{if(event.target.matches('.sale-quantity'))updateSalePreview(overlay.querySelector('form'));if(event.target.matches('.purchase-quantity,.purchase-cost'))updatePurchasePreview(overlay.querySelector('form'));if(event.target.matches('[name="customer"]')){const existing=state.customers.find(customer=>customer.name.toLowerCase()===event.target.value.trim().toLowerCase());if(existing)overlay.querySelector('[name="customerPhone"]').value=existing.phone||'';}});overlay.addEventListener('change',event=>{if(event.target.matches('.sale-product'))updateSalePreview(overlay.querySelector('form'));if(event.target.matches('.purchase-product')){const row=event.target.closest('.purchase-line-row');row.querySelector('.purchase-cost').value=event.target.selectedOptions[0]?.dataset.cost||'0';updatePurchasePreview(overlay.querySelector('form'));}if(event.target.matches('[name="customer"]')){const existing=state.customers.find(customer=>customer.name.toLowerCase()===event.target.value.trim().toLowerCase());if(existing)overlay.querySelector('[name="customerPhone"]').value=existing.phone||'';}});overlay.querySelector('.modal-close').addEventListener('click',closeModal);overlay.querySelector('.modal-cancel')?.addEventListener('click',closeModal);overlay.querySelector('form')?.addEventListener('submit',handleForm);overlay.querySelector('input,select')?.focus();if(overlay.querySelector('[data-form="sale"]')){overlay.dataset.saleOptions=document.querySelector('.sale-lines select')?.innerHTML||'';updateSalePreview(overlay.querySelector('form'));}if(overlay.querySelector('[data-form="purchase"]')){overlay.dataset.purchaseOptions=overlay.querySelector('.purchase-lines select')?.innerHTML||'';updatePurchasePreview(overlay.querySelector('form'));}
}
function closeModal(){document.querySelector('.modal-backdrop')?.remove();}
function downloadCSV(filename,rows){const csv='\ufeff'+rows.map(row=>row.map(value=>{const text=String(value??'');const safe=/^[\t\r=+\-@]/.test(text)?`'${text}`:text;return `"${safe.replaceAll('"','""')}"`;}).join(',')).join('\n');const link=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`${filename} downloaded.`);}

function route(){
  window.removeEventListener('scroll',updateScrollProgress);
  const routeHash=location.hash.replace(/^#/,'');
  if(routeHash && !routeHash.startsWith('/')){
    document.documentElement.dataset.theme = localStorage.getItem('stocksetu-theme') === 'dark' ? 'dark' : 'light';
    if(!document.querySelector('.launch-nav'))brandPageHome();
    else window.addEventListener('scroll', updateScrollProgress, { passive: true });
    requestAnimationFrame(()=>document.getElementById(decodeURIComponent(routeHash))?.scrollIntoView({behavior:'smooth',block:'start'}));
    return;
  }
  const path=routeHash||'/';
  document.documentElement.dataset.theme = localStorage.getItem('stocksetu-theme') === 'dark' ? 'dark' : 'light';
  if(path==='/dashboard'){
    if(!getAuthToken()){location.hash='#/login';return;}
    activePage='Overview';renderDashboard();
    loadSettingsFromBackend();
    loadProductsFromBackend();
  }else if(path==='/login')renderLogin();else if(path==='/register')renderRegister();else brandPageHome();
  window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('hashchange',route);
root.addEventListener('click',event=>{if(event.target.closest('[data-action="close-modal"]'))closeModal();});
route();
