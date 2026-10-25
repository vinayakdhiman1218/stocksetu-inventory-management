/* inventory feature module. */
function inventoryPage() {
  const inStock = state.products.filter(product => productStatus(product).className === '').length;
  const stockValue = state.products.reduce((sum,p) => sum + p.quantity * p.cost,0);
  return `${pageHeader('Inventory','Keep every item, quantity and reorder level in one place.',actionButton('Adjust stock','stock-adjust','light','filter')+actionButton('Add product','add-product'))}
    <div class="stat-grid compact-stats">${statCard('Total products',state.products.length,'box','In your catalogue')}${statCard('Healthy products',inStock,'check','Above reorder level')}${statCard('Stock value',money(stockValue),'coins','At purchase cost')}${statCard('Needs a restock',lowProducts().length,'bell','Low or out of stock',lowProducts().length?'down':'')}</div>
    <section class="panel table-panel"><div class="table-toolbar"><div><h2>All products <span class="soft-count">${state.products.length}</span></h2><p>Search or filter to find what you need.</p></div><div class="table-tools"><label class="search">${icon('search')}<input type="search" id="table-search" placeholder="Search name, SKU…" value="${escapeHTML(searchTerm)}" aria-label="Search products"></label><select class="select-mini" id="status-filter"><option value="all" ${statusFilter==='all'?'selected':''}>All status</option><option value="low" ${statusFilter==='low'?'selected':''}>Low stock</option><option value="out" ${statusFilter==='out'?'selected':''}>Out of stock</option></select></div></div><div class="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>STOCK</th><th>BUY PRICE</th><th>SELL PRICE</th><th>STATUS</th><th></th></tr></thead><tbody id="product-rows">${filteredProducts().map(productRow).join('') || '<tr><td class="table-empty" colspan="7">No products match this filter.</td></tr>'}</tbody></table></div><div class="table-bottom"><span>Showing ${filteredProducts().length} of ${state.products.length} products</span><span>Stock changes update automatically with each sale or purchase</span></div></section>`;
}

function stockHistoryPage() {
  return `${pageHeader('Stock history','A clear record of stock coming in, going out and being adjusted.',actionButton('Export CSV','export-movements','light','download')+actionButton('Adjust stock','stock-adjust'))}<div class="stat-grid compact-stats">${statCard('Movements recorded',state.movements.length,'clock','Every stock change')}${statCard('Stock increases',state.movements.filter(m=>m.delta>0).length,'truck','Purchases, returns and adjustments')}${statCard('Stock decreases',state.movements.filter(m=>m.delta<0).length,'receipt','Sales and adjustments')}${statCard('Products to restock',lowProducts().length,'bell','Based on reorder levels',lowProducts().length?'down':'')}</div><section class="panel table-panel"><div class="table-toolbar"><div><h2>Movement ledger <span class="soft-count">${state.movements.length}</span></h2><p>Each entry shows the quantity change and its reference.</p></div><label class="search">${icon('search')}<input type="search" id="movement-search" placeholder="Search product, reference or note" aria-label="Search stock history"></label></div><div class="table-wrap"><table><thead><tr><th>PRODUCT</th><th>TYPE</th><th>CHANGE</th><th>REFERENCE</th><th>DATE</th><th>NOTE</th><th></th></tr></thead><tbody id="movement-rows">${movementRows(state.movements)}</tbody></table></div></section>`;
}

function movementRows(items) { return items.map(m=>`<tr><td><span class="table-product"><i class="stock-icon">${icon('box')}</i><span>${escapeHTML(m.product)}<small>${escapeHTML(m.sku)}</small></span></span></td><td><span class="movement-type ${m.delta>0?'in':'out'}">${m.delta>0?'↙':'↗'} ${escapeHTML(m.type)}</span></td><td><b class="${m.delta>0?'movement-positive':'movement-negative'}">${m.delta>0?'+':''}${m.delta} ${escapeHTML(m.unit)}</b></td><td><span class="sku-tag">${escapeHTML(m.reference)}</span></td><td>${dateLabel(m.date)}</td><td>${escapeHTML(m.note||'—')}</td><td class="action-cell">${rowMenu(m.id,[['delete-movement','Delete movement','trash',true]],`Actions for ${m.product}`)}</td></tr>`).join('')||'<tr><td colspan="7" class="table-empty">No stock movements recorded yet.</td></tr>'; }

function filteredProducts() {
  return state.products.filter(item => {
    const q = searchTerm.toLowerCase(); const match = `${item.name} ${item.sku} ${item.category} ${item.supplier}`.toLowerCase().includes(q);
    const status = productStatus(item).className;
    return match && (statusFilter === 'all' || (statusFilter === 'low' && status === 'low') || (statusFilter === 'out' && status === 'out'));
  });
}

function productRow(item) {
  const status = productStatus(item);
  return `<tr><td><span class="table-product"><i class="stock-icon">${icon('box')}</i><span>${escapeHTML(item.name)}<small>${escapeHTML(item.category)}</small></span></span></td><td><span class="sku-tag">${escapeHTML(item.sku)}</span></td><td><b class="qty-value">${Number(item.quantity).toLocaleString('en-IN')}</b> <span class="muted-small">${escapeHTML(item.unit)}</span><small class="reorder-sub">Reorder at ${item.reorder}</small></td><td>${money(item.cost)}</td><td><b class="dark-value">${money(item.price)}</b></td><td><span class="badge ${status.className}">${status.text}</span></td><td class="action-cell">${rowMenu(item.id,[['edit-product','Edit product','pencil'],['delete-product','Delete product','trash',true]],`Actions for ${item.name}`)}</td></tr>`;
}

function openAdjustmentModal(){
  const options=state.products.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} · ${p.quantity} ${escapeHTML(p.unit)} now</option>`).join('');
  if(!options){toast('Add a product before adjusting stock.');return;}
  showModal('Adjust stock','Record a stock count correction or damaged item.',`<form data-form="adjustment"><div class="field"><label>Product</label><select name="productId" required>${options}</select></div><div class="modal-grid"><div class="field"><label>Adjustment</label><select name="direction"><option value="increase">Increase stock</option><option value="decrease">Decrease stock</option></select></div><div class="field"><label>Quantity</label><input name="quantity" type="number" min="1" value="1" required></div></div><div class="field"><label>Reason</label><input name="note" placeholder="e.g. Physical stock count or damaged item"></div><p class="form-error" hidden>This adjustment would make the stock quantity invalid.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">Save adjustment ${icon('check')}</button></div></form>`);
}

function openProductModal(item={}) {
  const editing=Boolean(item.id);const val=(key,def='')=>escapeHTML(item[key]??def);
  showModal(editing?'Edit product':'Add a product',editing?'Update this item in your catalogue.':'Add a new item to your inventory.',`<form data-form="product"><input type="hidden" name="id" value="${val('id')}"><div class="modal-grid"><div class="field"><label>Product name</label><input name="name" value="${val('name')}" placeholder="e.g. Basmati rice" required></div><div class="field"><label>Product code / SKU</label><input name="sku" value="${val('sku')}" placeholder="e.g. GRC-021" required></div><div class="field"><label>Category</label><input name="category" value="${val('category')}" placeholder="e.g. Groceries" required></div><div class="field"><label>Quantity on hand</label><input name="quantity" type="number" min="0" value="${val('quantity','1')}" required></div><div class="field"><label>Unit</label><select name="unit">${['pieces','packs','boxes','bottles','bags','bundles'].map(unit=>`<option ${val('unit','pieces')===unit?'selected':''}>${unit}</option>`).join('')}</select></div><div class="field"><label>Reorder level</label><input name="reorder" type="number" min="0" value="${val('reorder','10')}" required></div><div class="field"><label>Buy price (₹)</label><input name="cost" type="number" min="0" step=".01" value="${val('cost','0')}" required></div><div class="field"><label>Sell price (₹)</label><input name="price" type="number" min="0" step=".01" value="${val('price','0')}" required></div><div class="field full-field"><label>Supplier</label><input name="supplier" value="${val('supplier')}" placeholder="Supplier name"></div></div><p class="form-error" hidden>This SKU is already in your catalogue.</p><div class="modal-actions"><button class="btn btn-light btn-sm modal-cancel" type="button">Cancel</button><button class="btn btn-sm" type="submit">${editing?'Save changes':'Add product'} ${icon('check')}</button></div></form>`);
}

async function handleProductForm(form,data,type) {

    const existing=state.products.find(p=>p.id===data.id); const sku=String(data.sku).trim();
    if(state.products.some(p=>p.sku.toLowerCase()===sku.toLowerCase()&&p.id!==data.id)){form.querySelector('.form-error').hidden=false;return;}
    const value={id:data.id||crypto.randomUUID(),name:String(data.name).trim(),sku,category:String(data.category).trim(),quantity:Number(data.quantity),unit:data.unit,cost:Number(data.cost),price:Number(data.price),supplier:String(data.supplier),reorder:Number(data.reorder)};
    
    if (!existing) {
      try {
        const result = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify({
            name: value.name,
            sku: value.sku,
            category: value.category,
            unit: value.unit,
            quantity: value.quantity,
            cost_price: value.cost,
            selling_price: value.price,
            supplier: value.supplier,
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
            sku: value.sku,
            category: value.category,
            unit: value.unit,
            quantity: value.quantity,
            cost_price: value.cost,
            selling_price: value.price,
            supplier: value.supplier,
            min_stock: value.reorder
          })
        });
      } catch (error) {
        toast(`Could not update product: ${error.message}`);
        return;
      }
    }



    const oldQuantity=existing?Number(existing.quantity):0;if(existing)Object.assign(existing,value);else state.products.unshift(value);
    const delta=value.quantity-oldQuantity;if(delta!==0){const reference=existing?`ADJ-${String(state.movements.length+1).padStart(4,'0')}`:`OPEN-${value.sku}`;state.movements.unshift({id:nextMovementId(),productId:String(value.id),product:value.name,sku:value.sku,type:existing?'Stock adjustment':'Opening stock',delta,unit:value.unit,reference,date:daysAgo(0),note:existing?'Quantity corrected from product editor':'Initial quantity'});state.activity.unshift({text:existing?'Stock adjusted':'Product added',detail:`${value.name} · ${delta>0?'+':''}${delta} ${value.unit}`,time:'Just now',icon:'box'});}
    else if(!existing)state.activity.unshift({text:'Product added',detail:`${value.name} · ${value.quantity} ${value.unit}`,time:'Just now',icon:'box'});
    saveAll(['products','movements','activity']);closeModal();renderDashboard();toast(existing?'Product details updated.':'Product added to your inventory.');return;
}

async function handleAdjustmentForm(form,data,type) {

    const product=state.products.find(p=>p.id===data.productId),qty=Number(data.quantity),direction=data.direction==='increase'?1:-1;
    if(!product||qty<1||product.quantity+qty*direction<0){form.querySelector('.form-error').hidden=false;return;}
    try { await persistProductChanges([{product,changes:{quantity:product.quantity+qty*direction}}]); } catch(error) { toast(`Could not adjust stock: ${error.message}`); return; }const movementId=`ADJ-${String(state.movements.length+1).padStart(4,'0')}`;state.movements.unshift({id:nextMovementId(),productId:String(product.id),product:product.name,sku:product.sku,type:'Stock adjustment',delta:qty*direction,unit:product.unit,reference:movementId,date:daysAgo(0),note:String(data.note).trim()||'Manual stock count'});state.activity.unshift({text:'Stock adjusted',detail:`${product.name} · ${qty*direction>0?'+':''}${qty*direction} ${product.unit}`,time:'Just now',icon:'box'});saveAll(['products','movements','activity']);closeModal();renderDashboard();toast('Stock adjusted and movement recorded.');return;
}
