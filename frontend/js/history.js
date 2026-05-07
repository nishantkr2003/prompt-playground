import { getHistory } from "./api.js";


const historyContainer = document.getElementById("historyContainer");

export async function initializeHistoryUI() {
  historyContainer.innerHTML = `
        <div class="section-header">
            <input 
                type="text" 
                id="historySearch" 
                class="search-bar" 
                placeholder="Search history..."
            />

            <select id="historyProviderFilter">
                <option value="">All Providers</option>
                <option value="gemini">Gemini</option>
                <option value="groq">Groq</option>
            </select>
        </div>

        <div id="historyResults" class="card-grid">
            <div class="loader"></div>
        </div>
    `;

  document
    .getElementById("historySearch")
    .addEventListener("input", filterHistory);

  document
    .getElementById("historyProviderFilter")
    .addEventListener("change", applyProviderFilter);

  await loadHistory();
}

/*data*/
let allHistory = [];
let filteredHistory = [];

/* load history */
async function loadHistory(provider = "") {
  const response = await getHistory(provider ? { provider } : {});

  const results = document.getElementById("historyResults");

  if (response.status !== "success") {
    results.innerHTML = `
            <div class="empty-state">
                Failed to load execution history
            </div>
        `;
    return;
  }

  allHistory = response.data;
  filteredHistory = [...allHistory];

  renderHistory(filteredHistory);
}

/* render */
function renderHistory(historyItems) {
  const results = document.getElementById("historyResults");

  if (!historyItems.length) {
    results.innerHTML = `
            <div class="empty-state">
                No execution history found
            </div>
        `;
    return;
  }

  results.innerHTML = historyItems
    .map(
      (item) => `
        <div class="history-card">
            <span class="badge">${item.provider}</span>

            <h3>Execution #${item.id}</h3>

            <p><strong>Input Tokens:</strong> ${item.tokens_input || 0}</p>
            <p><strong>Output Tokens:</strong> ${item.tokens_output || 0}</p>
            <p><strong>Latency:</strong> ${item.latency || 0}s</p>

            <p><strong>Temperature:</strong> ${item.temperature ?? "-"}</p>
            <p><strong>Top P:</strong> ${item.top_p ?? "-"}</p>

            <p><strong>Date:</strong> ${formatDate(item.created_at)}</p>

            <div class="comparison-output">
                ${truncate(item.response, 300)}
            </div>

            <div class="card-actions">
                <button onclick="window.reRunHistoryPrompt(${item.id})">
                    Re-run
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

/*search filter*/
function filterHistory(event) {
  const query = event.target.value.toLowerCase();

  filteredHistory = allHistory.filter(
    (item) =>
      item.response.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query),
  );

  renderHistory(filteredHistory);
}

/*provider filter*/
async function applyProviderFilter(event) {
  const provider = event.target.value;

  await loadHistory(provider);
}

/*utils*/
function truncate(text, maxLength) {
  if (!text) return "";

  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString();
}

/* re-run history prompt */
window.reRunHistoryPrompt = function (historyId) {
  const item = allHistory.find((entry) => entry.id === historyId);

  if (!item) return;

  document.querySelector('[data-section="playground"]').click();

  document.getElementById("provider").value = item.provider || "gemini";

  alert(
    "History response loaded contextually. Re-run source prompt linkage can be expanded by storing original prompts in future versions.",
  );
};
