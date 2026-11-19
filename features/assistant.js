/* StockSathi — dukaan ka AI chatbot. Records se baat karta hai. */

const ASSISTANT_QUICK = [
  "Is mahine kharido?",
  "Kitne din chalega?",
  "Koi galti dikhi?",
  "Margin kitna hai?",
];

function assistantSelectedId() {
  const found = state.products.find(product => String(product.id) === String(state.assistantProductId));
  return found ? String(found.id) : (state.products[0] ? String(state.products[0].id) : "");
}

function assistantChat() {
  if (!state.assistantChat || !state.assistantChat.length) {
    state.assistantChat = [{ role: "bot", text: "Namaste! Main StockSathi hoon. Koi product chuno aur sawaal poochho — stock, kharid, bikri ya galti, main tumhare records se jawab dunga." }];
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
    return `${pageHeader('StockSathi', 'Dukaan ka AI chatbot — stock, kharid aur galtiyan ek jagah.')}<section class="panel assistant-panel"><div class="table-empty">Pehle koi product add karo. Phir StockSathi uske records se salah de payega.</div></section>`;
  }

  const messages = assistantChat().map(message => `
    <div class="assistant-msg ${message.role === "user" ? "user" : "bot"}">
      <div class="assistant-avatar">${message.role === "user" ? escapeHTML(initials(getUser())) : icon("spark")}</div>
      <div class="assistant-bubble">${escapeHTML(message.text).replaceAll("\n", "<br>")}</div>
    </div>`).join("");

  return `${pageHeader('StockSathi', 'Dukaan ka AI chatbot — kis bhi product ka naam likh kar poochho.')}
    <section class="panel assistant-panel">
      <div class="assistant-head">
        <i class="assistant-mark">${icon('spark')}</i>
        <div><h2>StockSathi</h2><p>Chatbot · sirf tumhare records se</p></div>
        <span class="assistant-status"><i></i> ${aiSettings().enabled ? "AI mode" : "rule mode"}</span>
      </div>
      <details class="assistant-settings">
        <summary>⚙ AI mode settings</summary>
        <div class="assistant-settings-body">
          <label class="assistant-toggle"><input type="checkbox" id="ai-mode-toggle" ${aiSettings().enabled ? "checked" : ""}> Use AI (LLM) for answers</label>
          <div class="assistant-settings-row">
            <select id="ai-provider">
              <option value="pollinations" ${aiSettings().provider === "pollinations" ? "selected" : ""}>Pollinations (free, no key)</option>
              <option value="ollama" ${aiSettings().provider === "ollama" ? "selected" : ""}>Ollama (local, qwen2.5:0.5b)</option>
              <option value="groq" ${aiSettings().provider === "groq" ? "selected" : ""}>Groq (Llama 3.1 8B, free)</option>
              <option value="grok" ${aiSettings().provider === "grok" ? "selected" : ""}>Grok (xAI, grok-2)</option>
              <option value="openai" ${aiSettings().provider === "openai" ? "selected" : ""}>OpenAI (gpt-4o-mini)</option>
            </select>
            <input id="ai-key" type="password" placeholder="Paste API key" value="${escapeHTML(aiSettings().key)}" autocomplete="off">
            <button type="button" class="btn btn-sm" data-action="save-ai-settings">${icon('check')} Save</button>
          </div>
          <p class="assistant-settings-note">Key sirf browser mein save hota hai. Rule-based fallback always available.</p>
        </div>
      </details>
      <div class="assistant-quick-row">${ASSISTANT_QUICK.map(q => `<button type="button" class="assistant-chip" data-action="assistant-quick" data-q="${escapeHTML(q)}">${escapeHTML(q)}</button>`).join("")}</div>
      <div class="assistant-chat" id="assistant-chat">${messages}</div>
      <form class="assistant-form" data-form="assistant">
        <input id="assistant-question" name="question" type="text" maxlength="500" placeholder="e.g. Cotton Shirt ke baare me btao" autocomplete="off" aria-label="Apna sawaal likho">
        <button class="btn btn-sm" type="submit">${icon('arrow')} Bhejo</button>
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
  const settings = aiSettings();
  const useLlm = settings.enabled && settings.key;
  const endpoint = useLlm ? "/assistant/llm" : "/assistant/ask";
  const body = useLlm
    ? { question: text, api_key: settings.key, provider: settings.provider }
    : { question: text };
  try {
    const data = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
    removeAssistantThinking();
    const answer = data && data.answer ? data.answer : "Jawab nahi mila.";
    const a = data && data.analysis ? data.analysis : null;
    let reply = answer;
    if (a) {
      const metrics = `Stock: ${Number(a.quantity).toLocaleString("en-IN")} ${a.unit} · Sold 30 din: ${a.sold_30d} ${a.unit} · Maag ~${a.daily_rate > 0 ? a.daily_rate : "—"} ${a.unit}/din · Stock chalega ~${a.stock_days_left ? a.stock_days_left : "—"} din`;
      reply = `${answer}\n\n${metrics}`;
      if (Array.isArray(a.warnings) && a.warnings.length) reply += `\n\nDhyaan: ${a.warnings.join(" ")}`;
    }
    appendAssistantMessage("bot", reply);
  } catch (error) {
    removeAssistantThinking();
    appendAssistantMessage("bot", `Nahi ho paya: ${error.message || "server se jawab nahi aaya."} Dobara try karo.`);
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
  if (product) askStockSathi(`${product.name} ke baare me btao`);
}
