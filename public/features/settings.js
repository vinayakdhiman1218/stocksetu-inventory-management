/* Settings: business profile, invoice preferences, notifications, and team status. */
function readFeatureSettings() {
  const defaults = {
    invoice: { prefix: 'INV', nextNumber: 1001, paymentTerms: 'Due on receipt', footer: '' },
    notifications: { lowStock: true, unpaidInvoices: true },
  };
  try {
    const saved = JSON.parse(localStorage.getItem(`stocksetu-account:${accountId()}:feature-settings`) || '{}');
    return { invoice: { ...defaults.invoice, ...(saved.invoice || {}) }, notifications: { ...defaults.notifications, ...(saved.notifications || {}) } };
  } catch {
    return defaults;
  }
}
function writeFeatureSettings(values) {
  localStorage.setItem(`stocksetu-account:${accountId()}:feature-settings`, JSON.stringify(values));
}
function settingsPage() {
  const s = state.settings;
  const extras = readFeatureSettings();
  const tabs = [
    ['profile', 'grid', 'Business profile'],
    ['team', 'users', 'Team & access'],
    ['invoice', 'receipt', 'Invoice preferences'],
    ['notifications', 'bell', 'Notifications'],
  ];
  let panel = '';
  if (activeSettingsTab === 'profile') {
    panel = `<div class="panel-header"><div><h2>Business profile</h2><p>These details personalise your workspace.</p></div><i class="settings-emblem">${icon('settings')}</i></div><form id="settings-form" class="settings-form"><div class="settings-logo-row"><i>${initials(s.businessName)}</i><span><b>Business name</b><small>This name appears in your workspace.</small></span><button type="button" class="btn btn-light btn-sm" data-action="focus-business-name">Update</button></div><div class="modal-grid"><div class="field"><label for="business-name">Business name</label><input id="business-name" name="businessName" maxlength="120" value="${escapeHTML(s.businessName)}" required></div><div class="field"><label for="owner-name">Owner name</label><input id="owner-name" name="owner" maxlength="120" value="${escapeHTML(s.owner)}" required></div><div class="field"><label for="business-phone">Phone</label><input id="business-phone" name="phone" type="tel" maxlength="40" placeholder="Add a business phone" value="${escapeHTML(s.phone)}"></div><div class="field"><label for="business-email">Email</label><input id="business-email" name="email" type="email" maxlength="254" placeholder="Add a business email" value="${escapeHTML(s.email)}"></div><div class="field"><label for="currency">Currency</label><select id="currency" name="currency"><option value="INR" selected>INR — Indian Rupee (₹)</option></select></div><div class="field"><label for="business-address">Business address</label><input id="business-address" name="address" maxlength="500" placeholder="Add a business address" value="${escapeHTML(s.address)}"></div></div><div class="form-footer"><span>Changes are saved to your account.</span><button class="btn btn-sm" type="submit">Save changes ${icon('check')}</button></div></form>`;
  } else if (activeSettingsTab === 'team') {
    panel = teamAccessPage();
  } else if (activeSettingsTab === 'invoice') {
    panel = `<div class="panel-header"><div><h2>Invoice preferences</h2><p>Choose the reference format and payment terms for new invoices.</p></div><i class="settings-emblem">${icon('receipt')}</i></div><form id="invoice-settings-form" class="settings-form"><div class="modal-grid"><div class="field"><label for="invoice-prefix">Invoice prefix</label><input id="invoice-prefix" name="prefix" maxlength="12" value="${escapeHTML(extras.invoice.prefix)}" required></div><div class="field"><label for="invoice-number">Next invoice number</label><input id="invoice-number" name="nextNumber" type="number" min="1" max="999999999" value="${Number(extras.invoice.nextNumber)}" required></div><div class="field"><label for="payment-terms">Default payment terms</label><select id="payment-terms" name="paymentTerms">${['Due on receipt', '7 days', '15 days', '30 days', '45 days'].map(term => `<option ${extras.invoice.paymentTerms === term ? 'selected' : ''}>${term}</option>`).join('')}</select></div><div class="field"><label for="invoice-footer">Invoice note</label><input id="invoice-footer" name="footer" maxlength="240" placeholder="A short note shown on invoices" value="${escapeHTML(extras.invoice.footer)}"></div></div><div class="form-footer"><span>Applied to future invoices on this device.</span><button class="btn btn-sm" type="submit">Save preferences ${icon('check')}</button></div></form>`;
  } else {
    panel = `<div class="panel-header"><div><h2>Notifications</h2><p>Choose which in-app reminders appear in your workspace.</p></div><i class="settings-emblem">${icon('bell')}</i></div><form id="notification-settings-form" class="settings-form"><label class="preference-row"><span><b>Low-stock reminders</b><small>Show products at or below their reorder level.</small></span><input type="checkbox" name="lowStock" ${extras.notifications.lowStock ? 'checked' : ''}></label><label class="preference-row"><span><b>Unpaid invoice reminders</b><small>Include unpaid invoices when you open Notifications.</small></span><input type="checkbox" name="unpaidInvoices" ${extras.notifications.unpaidInvoices ? 'checked' : ''}></label><div class="form-footer"><span>These are in-app reminders.</span><button class="btn btn-sm" type="submit">Save preferences ${icon('check')}</button></div></form>`;
  }
  return `${pageHeader('Settings', 'Manage your business and workspace preferences.', '')}<div class="settings-layout"><nav class="settings-tabs" aria-label="Settings sections">${tabs.map(([key, glyph, label]) => `<button class="${activeSettingsTab === key ? 'active' : ''}" data-settings-tab="${key}" aria-current="${activeSettingsTab === key ? 'page' : 'false'}">${icon(glyph)} ${label}</button>`).join('')}</nav><section class="panel settings-panel">${panel}</section></div>`;
}
async function saveBusinessSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const values = Object.fromEntries(new FormData(form));
  const nextSettings = {
    business_name: String(values.businessName || '').trim(), owner_name: String(values.owner || '').trim(),
    phone: String(values.phone || '').trim(), email: String(values.email || '').trim(),
    address: String(values.address || '').trim(), currency: String(values.currency || 'INR')
  };
  submit.disabled = true;
  try {
    const savedSettings = await apiRequest('/settings', { method: 'PUT', body: JSON.stringify(nextSettings) });
    applySettingsFromApi(savedSettings);
    renderDashboard();
    toast('Business profile saved to your account.');
  } catch (error) {
    toast(`Could not save business settings: ${error.message}`);
    submit.disabled = false;
  }
}
function saveInvoicePreferences(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  const extras = readFeatureSettings();
  extras.invoice = { prefix: String(values.prefix).trim().replace(/[^A-Za-z0-9-]/g, '').slice(0, 12) || 'INV', nextNumber: Math.max(1, Number(values.nextNumber) || 1), paymentTerms: String(values.paymentTerms), footer: String(values.footer || '').trim() };
  writeFeatureSettings(extras);
  toast('Invoice preferences saved on this device.');
}
function saveNotificationPreferences(event) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const extras = readFeatureSettings();
  extras.notifications = { lowStock: values.has('lowStock'), unpaidInvoices: values.has('unpaidInvoices') };
  writeFeatureSettings(extras);
  toast('Notification preferences saved on this device.');
}
function openNotifications() {
  const preferences = readFeatureSettings().notifications;
  const low = preferences.lowStock ? lowProducts() : [];
  const due = preferences.unpaidInvoices ? state.sales.filter(sale => sale.payment === 'Due') : [];
  const content = [
    ...low.map(product => `<div class="notice-item"><i>${icon('box')}</i><span><b>${escapeHTML(product.name)}</b><small>${product.quantity} ${escapeHTML(product.unit)} left · Reorder at ${product.reorder}</small></span></div>`),
    ...due.map(sale => `<div class="notice-item"><i>${icon('receipt')}</i><span><b>${escapeHTML(sale.id)} · ${escapeHTML(sale.customer)}</b><small>${money(sale.amount)} pending · ${dateLabel(sale.date)}</small></span></div>`),
  ];
  showModal('Notifications', content.length ? `${content.length} reminder${content.length === 1 ? '' : 's'} for your workspace.` : 'No reminders right now. You can choose reminders in Settings.', content.length ? `<div class="notice-list">${content.join('')}</div><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Done</button></div>` : `<div class="empty-state compact-empty"><i>${icon('check')}</i><p>You’re in good shape for now.</p></div><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Done</button></div>`);
}
function openHelpModal() {
  showModal('StockSetu help', 'A quick guide to the workspace.', `<div class="help-list"><p><b>Inventory:</b> Add products, set a reorder level, and adjust counted stock.</p><p><b>Sales & invoices:</b> Create an invoice from available stock, record payment status, and print or save a PDF.</p><p><b>Purchases:</b> Record incoming quantities and supplier details.</p><p><b>Reports:</b> Review totals and export a CSV from each section.</p><p><b>Settings:</b> Save your business profile and set invoice and in-app reminder preferences.</p></div><div class="modal-actions"><button class="btn btn-sm modal-cancel" type="button">Close</button></div>`);
}
