import { getTemplates } from "./api.js";
import { showToast } from "./toast.js";

const templatesContainer = document.getElementById("templatesContainer");


export async function initializeTemplatesUI() {
  templatesContainer.innerHTML = `
        <input 
            type="text" 
            id="templateSearch" 
            class="search-bar" 
            placeholder="Search templates..."
        />

        <div id="templateResults" class="card-grid">
            <div class="loader"></div>
        </div>
    `;

  document
    .getElementById("templateSearch")
    .addEventListener("input", filterTemplates);

  await loadTemplates();
}

// data
let allTemplates = [];

// load
async function loadTemplates() {
  const response = await getTemplates();

  const results = document.getElementById("templateResults");

  if (response.status !== "success") {
    results.innerHTML = `
            <div class="empty-state">
                Failed to load templates
            </div>
        `;
    return;
  }

  allTemplates = response.data;

  renderTemplates(allTemplates);
}

// RENDER
function renderTemplates(templates) {
  const results = document.getElementById("templateResults");

  if (!templates.length) {
    results.innerHTML = `
            <div class="empty-state">
                No templates found
            </div>
        `;
    return;
  }

  results.innerHTML = templates
    .map(
      (template) => `
        <div class="template-card">
            <span class="badge">${template.category}</span>

            <h3>${template.title}</h3>

            <p>${template.description}</p>

            <div class="comparison-output">
                ${truncate(template.user_prompt, 180)}
            </div>

            <div class="card-actions">
                <button onclick="window.loadTemplateToPlayground(${template.id})">
                    Use Template
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}


// SEARCH

function filterTemplates(event) {
  const query = event.target.value.toLowerCase();

  const filtered = allTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query),
  );

  renderTemplates(filtered);
}

// UTIL
function truncate(text, maxLength) {
  if (!text) return "";

  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Load templates on page load
window.loadTemplateToPlayground = function (templateId) {
  const template = allTemplates.find((t) => t.id === templateId);

  if (!template) return;

  document.querySelector('[data-section="playground"]').click();

  document.getElementById("systemPrompt").value = template.system_prompt || "";

  document.getElementById("userPrompt").value = template.user_prompt || "";

  showToast("Template loaded successfully", "success");
};
