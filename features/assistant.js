/* StockSathi — the shop's AI chatbot. Answers from your own records. */

const ASSISTANT_QUICK = [
  "Should I buy this month?",
  "How many days will it last?",
  "Any mistakes?",
  "What is the margin?",
];

function assistantSelectedId() {
  const found = state.products.find(product => String(product.id) === String(state.assistantProductId));
  return found ? String(found.id) : (state.products[0] ? String(state.products[0].id) : "");
}

function assistantChat() {
  if (!state.assistantChat || !state.assistantChat.length) {
    state.assistantChat = [{ role: "bot", text: "Hi! I am StockSathi. Pick a product and ask a question — stock, purchases, sales or mistakes. I answer from your own records." }];
  }
  return state.assistantChat;
}

function aiSettings() {
  return {
    enabled: localStorage.getItem("stocksetu-ai-mode") === "1",
    provider: localStorage.getItem("stocksetu-ai-provider") || "groq",
    key: localStorage.getItem("stocksetu-ai-key") || "",
  };
}

function assistantPage() {
  if (!state.products.length) {
    return `${pageHeader('StockSathi', 'Your shop AI chatbot — stock, purchases and mistakes in one place.')}<section class="panel assistant-panel"><div class="table-empty">Add a product first. StockSathi will then give advice from its records.</div></section>`;
  }

  const messages = assistantChat().map(message => `
    <div class="assistant-msg ${message.role === "user" ? "user" : "bot"}">
      <div class="assistant-avatar">${message.role === "user" ? escapeHTML(initials(getUser())) : icon("spark")}</div>
      <div class="assistant-bubble">${escapeHTML(message.text).replaceAll("\n", "<br>")}</div>
    </div>`).join("");

  return `${pageHeader('StockSathi', 'Your shop AI chatbot — type any product name and ask.')}
    <section class="panel assistant-panel">
      <div class="assistant-head">
        <i class="assistant-mark">${icon('spark')}</i>
        <div><h2>StockSathi</h2><p>Chatbot · answers only from your records</p></div>
        <span class="assistant-status"><i></i> online</span>
      </div>
      <div class="assistant-quick-row">${ASSISTANT_QUICK.map(q => `<button type="button" class="assistant-chip" data-action="assistant-quick" data-q="${escapeHTML(q)}">${escapeHTML(q)}</button>`).join("")}</div>
      <div class="assistant-chat" id="assistant-chat">${messages}</div>
      <form class="assistant-form" data-form="assistant">
        <input id="assistant-question" name="question" type="text" maxlength="500" placeholder="e.g. Tell me about the Cotton Shirt" autocomplete="off" aria-label="Type your question">
        <button class="btn btn-sm" type="submit">${icon('arrow')} Send</button>
      </form>
    </section>`;
}

function scrollAssistantChat() {
  const node = document.querySelector("#assistant-chat");
  if (node) node.scrollTop = node.scrollHeight;
}

function assistantThinking() {
  const chat = document.querySelector("#assistant-chat");
  if (!chat) return;
  const bubble = document.createElement("div");
  bubble.className = "assistant-msg bot";
  bubble.id = "assistant-thinking";
  bubble.innerHTML = `<div class="assistant-avatar">${icon("spark")}</div><div class="assistant-bubble assistant-typing"><span></span><span></span><span></span></div>`;
  chat.appendChild(bubble);
  scrollAssistantChat();
}

function removeAssistantThinking() {
  document.querySelector("#assistant-thinking")?.remove();
}

function appendAssistantMessage(role, text) {
  assistantChat().push({ role, text });
  const chat = document.querySelector("#assistant-chat");
  if (!chat) return;
  const bubble = document.createElement("div");
  bubble.className = `assistant-msg ${role === "user" ? "user" : "bot"}`;
  bubble.innerHTML = `<div class="assistant-avatar">${role === "user" ? escapeHTML(initials(getUser())) : icon("spark")}</div><div class="assistant-bubble">${escapeHTML(text).replaceAll("\n", "<br>")}</div>`;
  chat.appendChild(bubble);
  scrollAssistantChat();
}

async function askStockSathi(question) {
  const input = document.querySelector("#assistant-question");
  const text = (typeof question === "string" ? question : (input ? input.value : "")).trim();
  if (!text) return;
  appendAssistantMessage("user", text);
  if (input) input.value = "";
  assistantThinking();
  // Simple rule-based StockSathi (local, no external LLM).
  const endpoint = "/assistant/ask";
  const body = { question: text };
  try {
    const data = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
    removeAssistantThinking();
    const answer = data && data.answer ? data.answer : "No answer found.";
    const a = data && data.analysis ? data.analysis : null;
    let reply = answer;
    if (a) {
      const metrics = `Stock: ${Number(a.quantity).toLocaleString("en-IN")} ${a.unit} · Sold (30 days): ${a.sold_30d} ${a.unit} · Demand ~${a.daily_rate > 0 ? a.daily_rate : "—"} ${a.unit}/day · Stock lasts ~${a.stock_days_left ? a.stock_days_left : "—"} days`;
      reply = `${answer}\n\n${metrics}`;
      if (Array.isArray(a.warnings) && a.warnings.length) reply += `\n\nWatch out: ${a.warnings.join(" ")}`;
    }
    appendAssistantMessage("bot", reply);
  } catch (error) {
    removeAssistantThinking();
    appendAssistantMessage("bot", `Could not answer: ${error.message || "no response from the server."} Please try again.`);
    toast(`StockSathi: ${error.message}`);
  }
}

async function openAssistant(productId) {
  const product = state.products.find(item => String(item.id) === String(productId));
  state.assistantProductId = productId ? String(productId) : "";
  state.assistantChat = null;
  activePage = "StockSathi";
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (product) askStockSathi(`Tell me about ${product.name}`);
}
