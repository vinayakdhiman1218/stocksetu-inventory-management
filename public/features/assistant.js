/* StockSathi — dukaan ka AI saathi. Reads the shop's own records and answers
   questions about restocking, demand and mistakes. */

const ASSISTANT_SUGGESTIONS = [
  ["Is mahine kharido?", "is mahine kharido"],
  ["Kitne din chalega?", "kitne din chalega"],
  ["Koi galti dikhi?", "koi galti dikhi"],
  ["Margin kitna hai?", "margin kitna hai"],
];

function assistantSelectedId() {
  const found = state.products.find(product => String(product.id) === String(state.assistantProductId));
  return found ? String(found.id) : (state.products[0] ? String(state.products[0].id) : "");
}

function assistantPage() {
  if (!state.products.length) {
    return `${pageHeader('StockSathi', 'Dukaan ka AI saathi — stock, kharid aur galtiyan ek jagah.')}<section class="panel assistant-panel"><div class="table-empty">Pehle koi product add karo. Phir StockSathi uske records se salah de payega.</div></section>`;
  }

  const selected = assistantSelectedId();
  const options = state.products.map(product =>
    `<option value="${escapeHTML(product.id)}" ${selected === String(product.id) ? "selected" : ""}>${escapeHTML(product.name)}${product.sku ? ` · ${escapeHTML(product.sku)}` : ""}</option>`
  ).join("");

  return `${pageHeader('StockSathi', 'Dukaan ka AI saathi — poochho, aur records se jawab aayega.')}
    <section class="panel assistant-panel">
      <div class="assistant-head">
        <i class="assistant-mark">${icon('spark')}</i>
        <div><h2>StockSathi</h2><p>Sale, purchase aur stock records par bani smart salah.</p></div>
      </div>
      <div class="assistant-grid">
        <div class="field"><label for="assistant-product">Product</label><select id="assistant-product">${options}</select></div>
        <div class="assistant-chips">${ASSISTANT_SUGGESTIONS.map(([label, q]) => `<button type="button" class="assistant-chip" data-action="assistant-quick" data-q="${escapeHTML(q)}">${escapeHTML(label)}</button>`).join("")}</div>
        <form class="assistant-form" data-form="assistant">
          <input id="assistant-question" name="question" type="text" maxlength="500" placeholder="e.g. Is product ko is mahine kharido ya nahi?" aria-label="Apna sawaal likho">
          <button class="btn btn-sm" type="submit">${icon('spark')} Puchho</button>
        </form>
      </div>
      <div id="assistant-result"><div class="assistant-welcome"><b>StockSathi ready hai.</b><span>Upar koi product chuno, ya apna sawaal likh kar Puchho dabao.</span></div></div>
    </section>`;
}

function renderAssistantResult(data) {
  const node = document.querySelector("#assistant-result");
  if (!node || !data || !data.analysis) return;
  const a = data.analysis;
  const warnings = Array.isArray(a.warnings) ? a.warnings : [];
  const answerLines = String(data.answer || "").split("\n").filter(Boolean);
  node.innerHTML = `
    <div class="assistant-result-head">
      <div><h3>${escapeHTML(a.name)}</h3><p>${escapeHTML(a.summary)}</p></div>
      <span class="badge ${a.verdict_tone === "low" ? "low" : ""}">${escapeHTML(a.verdict_label)}</span>
    </div>
    <div class="assistant-metrics">
      ${statCard("Stock", `${Number(a.quantity).toLocaleString("en-IN")} ${escapeHTML(a.unit)}`, "box", `Reorder at ${a.min_stock}`)}
      ${statCard("Sold · 30 din", `${a.sold_30d} ${escapeHTML(a.unit)}`, "receipt", a.dates_available ? "Itne pieces biki" : "Ab tak total bikri")}
      ${statCard("Maag / roz", a.daily_rate > 0 ? `${a.daily_rate} ${escapeHTML(a.unit)}` : "—", "chart", a.stock_days_left ? `~${a.stock_days_left} din stock` : "Demand abhi clear nahi")}
      ${statCard("Suggest order", a.suggested_order ? `${a.suggested_order} ${escapeHTML(a.unit)}` : "—", "truck", "45-din target")}
    </div>
    <div class="assistant-answer">${answerLines.map(line => `<p>${escapeHTML(line)}</p>`).join("")}</div>
    ${warnings.length ? `<div class="assistant-warnings"><b>Dhyaan dein</b>${warnings.map(line => `<span>${escapeHTML(line)}</span>`).join("")}</div>` : ""}`;
}

function assistantThinking(message = "StockSathi records padh raha hai…") {
  const node = document.querySelector("#assistant-result");
  if (node) node.innerHTML = `<div class="assistant-thinking"><i>${icon("spark")}</i><span>${escapeHTML(message)}</span></div>`;
}

async function askStockSathi(question) {
  const select = document.querySelector("#assistant-product");
  const input = document.querySelector("#assistant-question");
  const productId = select ? select.value : state.assistantProductId;
  if (!productId) { toast("Pehle koi product add karo."); return; }
  const text = (typeof question === "string" ? question : input ? input.value : "").trim();
  assistantThinking();
  try {
    const data = await apiRequest("/assistant/ask", {
      method: "POST",
      body: JSON.stringify({ question: text, product_id: Number(productId) }),
    });
    renderAssistantResult(data);
  } catch (error) {
    const node = document.querySelector("#assistant-result");
    if (node) node.innerHTML = `<div class="assistant-warnings"><b>Nahi ho paya</b><span>${escapeHTML(error.message || "Server se jawab nahi aaya. Dobara try karo.")}</span></div>`;
    toast(`StockSathi: ${error.message}`);
  }
}

async function openAssistant(productId) {
  state.assistantProductId = productId ? String(productId) : "";
  activePage = "StockSathi";
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
  askStockSathi("");
}
