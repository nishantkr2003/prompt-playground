import { exportData, importData } from "./api.js";

import { showToast } from "./toast.js";

/* Container*/
const dataManagerContainer = document.getElementById("dataManagerContainer");


export function initializeDataManagerUI() {
  dataManagerContainer.innerHTML = `
        <div class="card">
            <h3>Export Data</h3>
            <p>Download prompts and history as JSON backup.</p>

            <button id="exportDataBtn">
                Export JSON
            </button>
        </div>

        <div class="card" style="margin-top:20px;">
            <h3>Import Data</h3>
            <p>Upload previously exported JSON.</p>

            <input 
                type="file" 
                id="importFileInput" 
                accept=".json"
            />

            <button id="importDataBtn">
                Import JSON
            </button>
        </div>
    `;

  attachDataManagerEvents();
}

/*Events*/
function attachDataManagerEvents() {
  document
    .getElementById("exportDataBtn")
    .addEventListener("click", handleExport);

  document
    .getElementById("importDataBtn")
    .addEventListener("click", handleImport);
}

/*Exports*/
async function handleExport() {
  const response = await exportData();

  if (response.status !== "success") {
    showToast("Export failed", "error");
    return;
  }

  /*Binary Large Object */
  const blob = new Blob([JSON.stringify(response.data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = `prompt_playground_backup_${Date.now()}.json`;

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);

  showToast("Export completed successfully", "success");
}

/*Imports*/
async function handleImport() {
  const fileInput = document.getElementById("importFileInput");

  const file = fileInput.files[0];

  if (!file) {
    showToast("Please select a JSON file", "warning");
    return;
  }

  try {
    const text = await file.text();

    const jsonData = JSON.parse(text);

    const response = await importData(jsonData);

    if (response.status === "success") {
      showToast("Import completed successfully", "success");

      fileInput.value = "";
    } else {
      showToast(response.message || "Import failed", "error");
    }
  } catch (error) {
    showToast("Invalid JSON file", "error");
  }
}
