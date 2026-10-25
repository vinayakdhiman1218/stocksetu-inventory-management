/* sales feature module. */
function salesTable(items, full = true) {
  const colspan=full?6:6;
  return `<div class="table-wrap"><table><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>PAYMENT</th><th></th></tr></thead><tbody>${items.map(item => `<tr><td><b>${escapeHTML(item.id)}</b></td><td>${escapeHTML(item.customer)}${item.phone?`<small class="reorder-sub">${escapeHTML(item.phone)}</small>`:''}</td><td>${dateLabel(item.date)}</td><td><b class="dark-value">${money(item.amount)}</b></td><td><span class="badge ${item.payment==='Due'?'low':''}">${escapeHTML(item.payment)}</span></td><td class="action-cell">${rowMenu(item.id,[['view-invoice','View invoice','eye'],['delete-invoice','Delete invoice','trash',true]],`Actions for ${item.id}`)}</td></tr>`).join('') || `<tr><td class="table-empty" colspan="${colspan}">No sales yet. Record your first sale to see it here.</td></tr>`}</tbody></table></div>`;
}

function salesPage() {
  const total = state.sales.reduce((sum,sale)=>sum+sale.amount,0); const due = state.sales.filter(sale=>sale.payment==='Due').reduce((sum,sale)=>sum+sale.amount,0);
  return `${pageHeader('Sales & invoices','Create a sale, record payment and keep every invoice close.',actionButton('Record a return','new-return','light','arrow')+actionButton('Export CSV','export-sales','light','download')+actionButton('New sale','new-sale'))}<div class="stat-grid compact-stats">${statCard('Total invoices',state.sales.length,'receipt','All recorded sales')}${statCard('Sales value',money(total),'coins','Across your invoices')}${statCard('Payments received',money(total-due),'check','Marked as paid')}${statCard('Returns recorded',state.returns.length,'arrow','Stock returned')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>All invoices <span class="soft-count">${state.sales.length}</span></h2><p>Sales records for your business.</p></div><label class="search">${icon('search')}<input type="search" id="sales-search" placeholder="Search invoice or customer" aria-label="Search sales"></label></div><div id="sales-table">${salesTable(state.sales)}</div></section><section class="panel table-panel"><div class="panel-header"><div><h2>Sales returns <span class="soft-count">${state.returns.length}</span></h2><p>Returned items are added back to inventory.</p></div><button class="text-btn" data-action="new-return">Record return ${icon('plus')}</button></div><div class="table-wrap"><table><thead><tr><th>RETURN</th><th>CUSTOMER</th><th>PRODUCT</th><th>QUANTITY</th><th>INVOICE</th><th>DATE</th><th></th></tr></thead><tbody>${returnRows(state.returns)}</tbody></table></div></section>`;
}

function returnRows(items){return items.map(item=>`<tr><td><b>${escapeHTML(item.id)}</b></td><td>${escapeHTML(item.customer)}</td><td>${escapeHTML(item.product)}<small class="reorder-sub">${escapeHTML(item.sku)}</small></td><td>+${item.quantity} ${escapeHTML(item.unit)}</td><td>${escapeHTML(item.reference)}</td><td>${dateLabel(item.date)}</td><td class="action-cell">${rowMenu(item.id,[['view-return','View details','eye'],['delete-return','Delete return','trash',true]],`Actions for ${item.id}`)}</td></tr>`).join('')||'<tr><td colspan="7" class="table-empty">No returns recorded yet.</td></tr>'; }

async function deleteInvoice(invoiceId) {
  const sale = state.sales.find(item => item.id === invoiceId);
  if (!sale) return;
  const lines = Array.isArray(sale.lines) ? sale.lines : [];
  const restockByProduct = new Map();
  const unavailableLines = [];
  for (const line of lines) {
    const sku = String(line.sku || '').trim();
    const name = String(line.name || '').trim().toLocaleLowerCase();
    const product = state.products.find(item => (sku && sku !== '—' && item.sku === sku) || (name && item.name.trim().toLocaleLowerCase() === name));
    const quantity = Number(line.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) { unavailableLines.push(line); continue; }
    const existing = restockByProduct.get(product.id) || { product, quantity: 0 };
    existing.quantity += quantity;
    restockByProduct.set(product.id, existing);
  }
  const restockText = restockByProduct.size
    ? `${[...restockByProduct.values()].reduce((sum, item) => sum + item.quantity, 0)} item(s) will be returned to stock.`
    : lines.length ? 'No matching inventory items were found to restock.' : 'This older invoice has no item details, so stock cannot be adjusted.';
  const unavailableText = unavailableLines.length ? ` ${unavailableLines.length} item(s) no longer match current inventory and cannot be restocked.` : '';
  if (!confirm(`Delete invoice ${sale.id}? ${restockText}${unavailableText} Any due balance will be reversed.`)) return;
  try {
    if (restockByProduct.size) {
      await persistProductChanges([...restockByProduct.values()].map(({ product, quantity }) => ({ product, changes: { quantity: Number(product.quantity) + quantity } })));
    }
  } catch (error) {
    toast(`Invoice was not deleted because stock could not be restored: ${error.message}`);
    return;
  }
  state.sales = state.sales.filter(item => item.id !== invoiceId);
  if (sale.payment === 'Due') {
    const customer = state.customers.find(item => item.name.toLocaleLowerCase() === String(sale.customer).toLocaleLowerCase());
    if (customer) customer.due = Math.max(0, Number(customer.due || 0) - Number(sale.amount || 0));
  }
  state.movements = state.movements.filter(item => !(item.reference === invoiceId && item.type === 'Sale'));
  state.activity.unshift({ text: 'Invoice deleted', detail: `${invoiceId} · ${sale.customer}`, time: 'Just now', icon: 'trash' });
  saveAll(['sales', 'customers', 'movements', 'activity']);
  closeModal();
  renderDashboard();
  toast(`${invoiceId} deleted.${restockByProduct.size ? ' Stock restored.' : ''}`);
}

function openSaleModal(){
  const options=state.products.filter(p=>p.quantity>0).map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${money(p.price)} · ${p.quantity} ${escapeHTML(p.unit)} left</option>`).join('');
  if(!options){toast('Add stock to a product before recording a sale.');return;}
  showModal('Create a sale','Add customer contact details and invoice items. Stock updates when the sale is recorded.',`<form data-form="sale"><div class="modal-grid"><div class="field"><label for="sale-customer-name">Customer name</label><input id="sale-customer-name" name="customer" list="customer-options" placeholder="Choose or enter a customer" autocomplete="name" required><datalist id="customer-options">${state.customers.map(c=>`<option value="${escapeHTML(c.name)}">`).join('')}</datalist></div><div class="field"><label for="sale-customer-phone">Customer mobile number</label><input id="sale-customer-phone" name="customerPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="98765 43210" pattern="(?:\\+?91[\\s-]?)?[6-9](?:[\\s-]?\\d){9}" title="Enter a valid 10-digit Indian mobile number" maxlength="15" required></div></div><div class="sale-lines-wrap"><div class="sale-lines-head"><b>Invoice items</b><span>PRODUCT · QTY</span></div><div class="sale-lines">${saleLineMarkup(options)}</div><button class="sale-add-line" type="button">${icon('plus')} Add another product</button></div><div class="modal-grid sale-footer-fields"><div class="field"><label>Payment status</label><select name="payment"><option>Paid</option><option>Due</option></select></div><div class="sale-total-card"><small>Invoice total</small><strong class="sale-total">₹0</strong></div></div><p class="form-error" hidden>Enter the customer’s name, a valid mobile number, and quantities available in stock.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Create invoice ${icon('arrow')}</button></div></form>`);
}

function saleLineMarkup(options){return `<div class="sale-line-row"><div class="field"><label>Product</label><select class="sale-product" name="productId" required>${options}</select></div><div class="field"><label>Qty</label><input class="sale-quantity" name="quantity" type="number" min="1" value="1" required></div><button class="sale-remove" type="button" aria-label="Remove item" disabled>${icon('trash')}</button></div>`;}

function updateSalePreview(form){if(!form)return;const amount=[...form.querySelectorAll('.sale-line-row')].reduce((sum,row)=>{const product=state.products.find(p=>p.id===row.querySelector('.sale-product').value);return sum+(product?Number(product.price)*Math.max(0,Number(row.querySelector('.sale-quantity').value)||0):0);},0);const total=form.querySelector('.sale-total');if(total)total.textContent=money(amount);form.querySelectorAll('.sale-remove').forEach(button=>button.disabled=form.querySelectorAll('.sale-line-row').length===1);}

function openReturnModal(){
  const options=state.products.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${p.quantity} ${escapeHTML(p.unit)} in stock</option>`).join('');
  if(!options){toast('Add a product before recording a return.');return;}
  showModal('Record a sales return','Returned items go back into available stock.',`<form data-form="return"><div class="field"><label>Product returned</label><select name="productId" required>${options}</select></div><div class="modal-grid"><div class="field"><label>Quantity returned</label><input name="quantity" type="number" min="1" value="1" required></div><div class="field"><label>Customer</label><input name="customer" list="customer-options" placeholder="Choose or enter a customer"><datalist id="customer-options">${state.customers.map(c=>`<option value="${escapeHTML(c.name)}">`).join('')}</datalist></div></div><div class="modal-grid"><div class="field"><label>Original invoice (optional)</label><input name="reference" list="invoice-options" placeholder="e.g. INV-1084"><datalist id="invoice-options">${state.sales.map(s=>`<option value="${escapeHTML(s.id)}">`).join('')}</datalist></div><div class="field"><label>Reason</label><input name="note" placeholder="e.g. Damaged packaging"></div></div><p class="form-error" hidden>Choose a product and enter a valid return quantity.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Record return ${icon('check')}</button></div></form>`);
}

function openInvoice(sale){const lines=Array.isArray(sale.lines)&&sale.lines.length?sale.lines.map(line=>`<div class="invoice-line"><span>${escapeHTML(line.name)} <small>${line.quantity} ${escapeHTML(line.unit)} × ${money(line.price)}</small></span><b>${money(line.total)}</b></div>`).join(''):`<div class="invoice-line"><span>${sale.items} item${sale.items===1?'':'s'} sold</span><b>${money(sale.amount)}</b></div>`;showModal(`Invoice ${sale.id}`,`Created ${dateLabel(sale.date)} · ${sale.payment}`,`<div class="invoice-detail"><div class="invoice-brand">${brand()}<span>INVOICE · ${escapeHTML(state.settings.businessName)}</span></div><div class="invoice-to"><small>BILLED TO</small><b>${escapeHTML(sale.customer)}</b>${sale.phone?`<small>Mobile: ${escapeHTML(sale.phone)}</small>`:''}<small>${dateLabel(sale.date)}</small></div><div class="invoice-items">${lines}</div><div class="invoice-total"><span>Total</span><b>${money(sale.amount)}</b></div><span class="badge ${sale.payment==='Due'?'low':''}">${escapeHTML(sale.payment)}</span></div><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Close</button><button class="btn btn-danger btn-sm" type="button" data-action="delete-invoice" data-id="${escapeHTML(sale.id)}">${icon('trash')} Delete invoice</button>${sale.payment==='Due'?`<button class="btn btn-light btn-sm" data-action="mark-paid">Mark as paid ${icon('check')}</button>`:''}<button class="btn btn-sm" data-action="print-invoice">${icon('download')} Print / save PDF</button></div>`);document.querySelector('[data-action="print-invoice"]')?.addEventListener('click',()=>window.print());document.querySelector('[data-action="delete-invoice"]')?.addEventListener('click',event=>deleteInvoice(event.currentTarget.dataset.id));document.querySelector('[data-action="mark-paid"]')?.addEventListener('click',()=>{sale.payment='Paid';const customer=state.customers.find(c=>c.name===sale.customer);if(customer)customer.due=Math.max(0,Number(customer.due||0)-sale.amount);saveAll(['sales','customers']);closeModal();renderDashboard();toast(`${sale.id} marked as paid.`);});}

async function handleSaleForm(form,data,type) {

    const rows=[...form.querySelectorAll('.sale-line-row')];const selected=rows.map(row=>({product:state.products.find(p=>p.id===row.querySelector('.sale-product').value),quantity:Number(row.querySelector('.sale-quantity').value)}));
    const requested=new Map();selected.forEach(line=>{if(line.product)requested.set(line.product.id,(requested.get(line.product.id)||0)+line.quantity);});
    const phoneDigits=String(data.customerPhone||'').replace(/\D/g,'');const customerPhone=phoneDigits.length===12&&phoneDigits.startsWith('91')?phoneDigits.slice(-10):phoneDigits.length===11&&phoneDigits.startsWith('0')?phoneDigits.slice(-10):phoneDigits;
    const invalid=selected.some(line=>!line.product||!Number.isInteger(line.quantity)||line.quantity<1)||[...requested].some(([id,quantity])=>quantity>state.products.find(p=>p.id===id).quantity)||! /^[6-9]\d{9}$/.test(customerPhone);
    if(invalid){form.querySelector('.form-error').hidden=false;return;}
    const lineItems=[...requested].map(([id,quantity])=>{const product=state.products.find(p=>p.id===id);return{product,quantity,price:Number(product.price),total:Number(product.price)*quantity};});
    const totalQuantity=lineItems.reduce((sum,line)=>sum+line.quantity,0),amount=lineItems.reduce((sum,line)=>sum+line.total,0),customer=String(data.customer).trim();
    if(!customer){form.querySelector('.form-error').hidden=false;return;}
    try { await persistProductChanges(lineItems.map(({product,quantity})=>({product,changes:{quantity:Number(product.quantity)-quantity}}))); } catch(error) { toast(`Could not record sale: ${error.message}`); return; }
    let existingCustomer=state.customers.find(c=>c.name.toLowerCase()===customer.toLowerCase());if(!existingCustomer){existingCustomer={id:crypto.randomUUID(),name:customer,phone:customerPhone,email:'',due:0};state.customers.unshift(existingCustomer);}else if(!existingCustomer.phone||existingCustomer.phone!==customerPhone)existingCustomer.phone=customerPhone;if(data.payment==='Due')existingCustomer.due=Number(existingCustomer.due||0)+amount;
    const invoicePrefs=readFeatureSettings().invoice;const prefix=String(invoicePrefs.prefix||'INV');const lastNumber=Math.max(0,...state.sales.map(item=>{const match=String(item.id).match(new RegExp('^'+prefix+'-(\\d+)$','i'));return match?Number(match[1]):0;}));const nextInvoice=Math.max(Number(invoicePrefs.nextNumber)||1,lastNumber+1);const sale={id:`${prefix}-${String(nextInvoice).padStart(4,'0')}`,customer,phone:customerPhone,date:daysAgo(0),amount,payment:data.payment,paymentTerms:invoicePrefs.paymentTerms,invoiceNote:invoicePrefs.footer,items:totalQuantity,lines:lineItems.map(({product,quantity,price,total})=>({productId:String(product.id),name:product.name,sku:product.sku,quantity,unit:product.unit,price,total}))};state.sales.unshift(sale);invoicePrefs.nextNumber=nextInvoice+1;const savedFeatureSettings=readFeatureSettings();savedFeatureSettings.invoice=invoicePrefs;writeFeatureSettings(savedFeatureSettings);
    lineItems.forEach(({product,quantity})=>{product.quantity-=quantity;state.movements.unshift({id:nextMovementId(),productId:String(product.id),product:product.name,sku:product.sku,type:'Sale',delta:-quantity,unit:product.unit,reference:sale.id,date:daysAgo(0),note:'Invoice recorded'});});
    state.activity.unshift({text:'New invoice created',detail:`${sale.id} · ${customer}`,time:'Just now',icon:'receipt'});saveAll(['products','sales','customers','activity','movements']);closeModal();renderDashboard();toast(`${sale.id} created. Stock updated.`);return;
}

async function handleReturnForm(form,data,type) {

    const product=state.products.find(p=>p.id===data.productId),qty=Number(data.quantity);if(!product||qty<1){form.querySelector('.form-error').hidden=false;return;}
    try { await persistProductChanges([{product,changes:{quantity:product.quantity+qty}}]); } catch(error) { toast(`Could not record return: ${error.message}`); return; }const returnId=`RET-${String(state.returns.length+1).padStart(4,'0')}`;const customer=String(data.customer).trim()||'Walk-in customer';const note=String(data.note).trim()||'Customer return';state.returns.unshift({id:returnId,productId:String(product.id),customer,product:product.name,sku:product.sku,quantity:qty,unit:product.unit,reference:String(data.reference).trim()||'—',date:daysAgo(0),note});state.movements.unshift({id:nextMovementId(),productId:String(product.id),product:product.name,sku:product.sku,type:'Sales return',delta:qty,unit:product.unit,reference:returnId,date:daysAgo(0),note});state.activity.unshift({text:'Sales return recorded',detail:`${product.name} · ${qty} ${product.unit}`,time:'Just now',icon:'box'});saveAll(['products','returns','movements','activity']);closeModal();renderDashboard();toast('Return recorded. Available stock updated.');return;
}


function openReturn(item){
  showModal(`Return ${item.id}`,`${dateLabel(item.date)} · ${item.reference||'No invoice reference'}`,`<div class="invoice-detail"><div class="invoice-to"><small>CUSTOMER</small><b>${escapeHTML(item.customer)}</b></div><div class="invoice-line"><span>${escapeHTML(item.product)} <small>${item.quantity} ${escapeHTML(item.unit)}</small></span><b>Returned to stock</b></div><div class="invoice-line"><span>Reason</span><b>${escapeHTML(item.note||'Customer return')}</b></div></div><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Close</button><button class="btn btn-danger btn-sm" type="button" data-action="delete-return" data-id="${escapeHTML(item.id)}">${icon('trash')} Delete return</button></div>`);
  document.querySelector('[data-action="delete-return"]')?.addEventListener('click',event=>deleteReturn(event.currentTarget.dataset.id));
}

async function deleteReturn(id){
  const item=state.returns.find(record=>String(record.id)===String(id));if(!item)return;
  if(!confirm(`Delete return ${item.id}? Its returned quantity will be removed from available stock.`))return;
  const product=state.products.find(record=>(item.productId&&String(record.id)===String(item.productId))||(item.sku&&record.sku===item.sku)||record.name.toLowerCase()===String(item.product||'').toLowerCase());
  if(product&&Number(product.quantity)<Number(item.quantity)){toast(`Cannot delete ${item.id}: available stock is lower than the returned quantity.`);return;}
  try{if(product)await persistProductChanges([{product,changes:{quantity:Number(product.quantity)-Number(item.quantity)}}]);}catch(error){toast(`Return was not deleted because stock could not be updated: ${error.message}`);return;}
  state.returns=state.returns.filter(record=>String(record.id)!==String(id));state.movements=state.movements.filter(m=>m.reference!==item.id);state.activity.unshift({text:'Sales return deleted',detail:`${item.id} · ${item.product}`,time:'Just now',icon:'trash'});saveAll(['returns','movements','activity']);closeModal();renderDashboard();toast(`${item.id} deleted. Returned stock reversed.`);
}

async function deleteMovement(id){
  const movement=state.movements.find(item=>String(item.id)===String(id));if(!movement)return;
  if(movement.type==='Sale'){const sale=state.sales.find(item=>item.id===movement.reference);if(sale)return deleteInvoice(sale.id);}
  if(movement.type==='Purchase received'){const purchase=state.purchases.find(item=>item.id===movement.reference);if(purchase)return deletePurchase(purchase.id);}
  if(movement.type==='Sales return'){const item=state.returns.find(record=>record.id===movement.reference);if(item)return deleteReturn(item.id);}
  if(!confirm(`Delete this ${movement.type.toLowerCase()} movement? Its ${movement.delta>0?'increase':'decrease'} of ${Math.abs(Number(movement.delta))} ${movement.unit} will be reversed from stock.`))return;
  const product=state.products.find(item=>(movement.productId&&String(item.id)===String(movement.productId))||(movement.sku&&item.sku===movement.sku)||item.name.toLowerCase()===String(movement.product||'').toLowerCase());
  if(product&&Number(product.quantity)-Number(movement.delta)<0){toast('This movement cannot be reversed because it would make stock negative.');return;}
  try{if(product)await persistProductChanges([{product,changes:{quantity:Number(product.quantity)-Number(movement.delta)}}]);}catch(error){toast(`Movement was not deleted because stock could not be updated: ${error.message}`);return;}
  state.movements=state.movements.filter(item=>String(item.id)!==String(id));state.activity.unshift({text:'Stock movement deleted',detail:`${movement.product} · ${movement.type}`,time:'Just now',icon:'trash'});saveAll(['movements','activity']);renderDashboard();toast('Movement deleted and stock corrected.');
}
