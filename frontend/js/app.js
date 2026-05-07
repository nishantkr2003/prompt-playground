import { checkHealth, generatePrompt, createPrompt } from "./api.js";
import { initializeComparisonUI } from "./comparison.js";
import { initializeSweepUI } from "./sweep.js";
import { initializeLibraryUI } from "./library.js";
import { initializeHistoryUI } from "./history.js";
import { initializeTemplatesUI } from "./templates.js";
import { initializeDataManagerUI } from "./data-manager.js";
import { initializeShortcuts } from "./shortcuts.js";
import { initializeShortcutHelp } from "./shortcut-help.js";
import { initializeDeveloperUI } from "./developer.js";
import { parseOutput } from "./output-parser.js";
import { showToast } from "./toast.js";

/* helpers */

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

/* elements */

const navButtons = $$(".nav-btn");
const sections = $$(".content-section");

const sectionTitle = $("sectionTitle");
const apiStatus = $("apiStatus");

const themeToggle = $("themeToggle");

const runPromptBtn = $("runPrompt");
const savePromptBtn = $("savePrompt");

const systemPrompt = $("systemPrompt");
const userPrompt = $("userPrompt");

const provider = $("provider");
const technique = $("technique");

const temperature = $("temperature");
const tempValue = $("tempValue");

const topP = $("topP");
const topPValue = $("topPValue");

const maxTokens = $("maxTokens");

const outputBox = $("outputBox");

const inputTokens = $("inputTokens");
const outputTokens = $("outputTokens");
const latency = $("latency");

/* navigation */

function initializeNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.dataset.section;

      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      sections.forEach((section) => {
        section.classList.toggle("active", section.id === targetSection);
      });

      sectionTitle.textContent = button.textContent;
    });
  });
}

/* theme */

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-theme") ? "light" : "dark",
    );
  });
}

/* sliders */

function initializeSliders() {
  temperature.addEventListener("input", () => {
    tempValue.textContent = temperature.value;
  });

  topP.addEventListener("input", () => {
    topPValue.textContent = topP.value;
  });
}

/* api health */

async function initializeAPI() {
  const health = await checkHealth();

  if (health.status === "success") {
    apiStatus.textContent = "API: Online";
    apiStatus.classList.add("status-online");
  } else {
    apiStatus.textContent = "API: Offline";
    apiStatus.classList.add("status-offline");
  }
}

/* generate */

async function runPrompt() {
  const promptText = userPrompt.value.trim();

  if (!promptText) {
    showToast("User prompt is required", "warning");
    return;
  }

  outputBox.innerHTML = `<div class="loader"></div>`;

  const payload = {
    system_prompt: systemPrompt.value,
    user_prompt: promptText,
    provider: provider.value,
    technique: technique.value,
    temperature: Number(temperature.value),
    top_p: Number(topP.value),
    max_tokens: parseInt(maxTokens.value),
  };

  const response = await generatePrompt(payload);

  if (response.status !== "success") {
    outputBox.textContent = "Generation failed.";
    showToast(response.message || "Generation failed", "error");
    return;
  }

  const data = response.data;

  outputBox.innerHTML = parseOutput(data.response);

  inputTokens.textContent = data.tokens.total_input_tokens;
  outputTokens.textContent = data.tokens.output_tokens;
  latency.textContent = `${data.latency}s`;

  showToast("Prompt generated successfully", "success");
}

/* save */

async function savePrompt() {
  const title = prompt("Enter prompt title:");

  if (!title) return;

  const payload = {
    title,
    system_prompt: systemPrompt.value,
    user_prompt: userPrompt.value,
    technique: technique.value,
    provider: provider.value,
  };

  const response = await createPrompt(payload);

  if (response.status === "success") {
    showToast("Prompt saved successfully", "success");
  } else {
    showToast(response.message || "Save failed", "error");
  }
}

/* buttons */

function initializeActions() {
  runPromptBtn.addEventListener("click", runPrompt);
  savePromptBtn.addEventListener("click", savePrompt);
}

function initializeModules() {
  initializeComparisonUI();
  initializeSweepUI();
  initializeLibraryUI();
  initializeHistoryUI();
  initializeTemplatesUI();
  initializeDataManagerUI();
  initializeDeveloperUI();
  initializeShortcuts();
  initializeShortcutHelp();
}

/* init app */

function initializeApp() {
  initializeNavigation();
  initializeTheme();
  initializeSliders();
  initializeActions();
  initializeModules();
  initializeAPI();
}

initializeApp();