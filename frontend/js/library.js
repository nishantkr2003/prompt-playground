import { getPrompts, deletePrompt } from "./api.js";
import { showToast } from "./toast.js";

const libraryContainer = document.getElementById("libraryContainer");


export async function initializeLibraryUI() {
  libraryContainer.innerHTML = `
        <input 
            type="text" 
            id="librarySearch" 
            class="search-bar" 
            placeholder="Search prompts..."
        />

        <div id="libraryResults" class="card-grid">
            <div class="loader"></div>
        </div>
    `;

  document
    .getElementById("librarySearch")
    .addEventListener("input", filterLibrary);

  await loadLibrary();
}

/*load library*/
let allPrompts = [];

async function loadLibrary() {
  const response = await getPrompts();

  const results = document.getElementById("libraryResults");

  if (response.status !== "success") {
    results.innerHTML = `
            <div class="empty-state">
                Failed to load prompt library
            </div>
        `;
    return;
  }

  allPrompts = response.data;

  renderLibrary(allPrompts);
}

/*render*/
function renderLibrary(prompts) {
  const results = document.getElementById("libraryResults");

  if (!prompts.length) {
    results.innerHTML = `
            <div class="empty-state">
                No prompts found
            </div>
        `;
    return;
  }

  results.innerHTML = prompts
    .map(
      (prompt) => `
        <div class="library-card">
            <span class="badge">${prompt.technique}</span>

            <h3>${prompt.title}</h3>

            <p><strong>Provider:</strong> ${prompt.provider}</p>

            <p>${truncate(prompt.user_prompt, 140)}</p>

            <div class="card-actions">
                <button onclick="window.loadPromptToPlayground(${prompt.id})">
                    Load
                </button>

                <button onclick="window.removePrompt(${prompt.id})">
                    Delete
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

/*search filter*/
function filterLibrary(event) {
  const query = event.target.value.toLowerCase();

  const filtered = allPrompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.user_prompt.toLowerCase().includes(query) ||
      prompt.technique.toLowerCase().includes(query),
  );

  renderLibrary(filtered);
}

/*utils*/
function truncate(text, maxLength) {
  if (!text) return "";

  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

/*load prompt to playground*/
window.loadPromptToPlayground = async function (promptId) {
  const prompt = allPrompts.find((p) => p.id === promptId);

  if (!prompt) return;

  document.querySelector('[data-section="playground"]').click();

  document.getElementById("systemPrompt").value = prompt.system_prompt || "";
  document.getElementById("userPrompt").value = prompt.user_prompt || "";
  document.getElementById("provider").value = prompt.provider || "gemini";
  document.getElementById("technique").value = prompt.technique || "zero-shot";
};

/*Delete prompt*/
window.removePrompt = async function (promptId) {
  const confirmed = confirm("Delete this prompt?");

  if (!confirmed) return;

  const response = await deletePrompt(promptId);

  if (response.status === "success") {
    allPrompts = allPrompts.filter((p) => p.id !== promptId);

    renderLibrary(allPrompts);
  } else {
    showToast("Failed to delete prompt", "error");
  }
};
