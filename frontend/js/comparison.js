import { comparePrompts } from "./api.js";
import { parseOutput } from "./output-parser.js";
import { showToast } from "./toast.js";


const comparisonContainer = document.getElementById("comparisonContainer");

export function initializeComparisonUI() {
  comparisonContainer.innerHTML = `
        <div class="card">
            <label>Prompt A</label>
            <textarea id="promptA" placeholder="Enter first prompt..."></textarea>

            <label>Prompt B</label>
            <textarea id="promptB" placeholder="Enter second prompt..."></textarea>

            <label>System Prompt (Optional)</label>
            <textarea id="compareSystemPrompt"></textarea>

            <label>Provider</label>
            <select id="compareProvider">
                <option value="gemini">Gemini</option>
                <option value="groq">Groq</option>
            </select>

            <label>Temperature</label>
            <input type="range" id="compareTemperature" min="0" max="2" step="0.1" value="0.7">
            <span id="compareTempValue">0.7</span>

            <label>Top P</label>
            <input type="range" id="compareTopP" min="0" max="1" step="0.1" value="1.0">
            <span id="compareTopPValue">1.0</span>

            <button id="runComparison">Compare Prompts</button>
        </div>

        <div class="comparison-grid" style="margin-top:20px;">
            <div class="compare-card">
                <h3>Prompt A Output</h3>
                <div id="compareOutputA" class="comparison-output"></div>
                <div id="compareMetricsA"></div>
            </div>

            <div class="compare-card">
                <h3>Prompt B Output</h3>
                <div id="compareOutputB" class="comparison-output"></div>
                <div id="compareMetricsB"></div>
            </div>
        </div>
    `;

  attachComparisonEvents();
}

/*events*/ 

function attachComparisonEvents() {
  const runBtn = document.getElementById("runComparison");

  const compareTemperature = document.getElementById("compareTemperature");
  const compareTempValue = document.getElementById("compareTempValue");

  const compareTopP = document.getElementById("compareTopP");
  const compareTopPValue = document.getElementById("compareTopPValue");

  compareTemperature.addEventListener("input", () => {
    compareTempValue.textContent = compareTemperature.value;
  });

  compareTopP.addEventListener("input", () => {
    compareTopPValue.textContent = compareTopP.value;
  });

  runBtn.addEventListener("click", runComparison);
}

/* comparison logic */
async function runComparison() {
  const promptA = document.getElementById("promptA").value.trim();
  const promptB = document.getElementById("promptB").value.trim();

  if (!promptA || !promptB) {
    showToast("Both prompts are required", "warning");
    return;
  }

  const outputA = document.getElementById("compareOutputA");
  const outputB = document.getElementById("compareOutputB");

  outputA.innerHTML = `<div class="loader"></div>`;
  outputB.innerHTML = `<div class="loader"></div>`;

  const payload = {
    prompt_a: promptA,
    prompt_b: promptB,
    system_prompt: document.getElementById("compareSystemPrompt").value,
    provider: document.getElementById("compareProvider").value,
    temperature: parseFloat(
      document.getElementById("compareTemperature").value,
    ),
    top_p: parseFloat(document.getElementById("compareTopP").value),
  };

  const response = await comparePrompts(payload);

  if (response.status !== "success") {
    showToast("Comparison failed", "error");
    outputB.textContent = "Comparison failed";
    return;
  }

  const resultA = response.data.prompt_a;
  const resultB = response.data.prompt_b;

  outputA.innerHTML = parseOutput(resultA.response);
  outputB.innerHTML = parseOutput(resultB.response);

  document.getElementById("compareMetricsA").innerHTML = `
        <p>Latency: ${resultA.latency}s</p>
        <p>Input Tokens: ${resultA.tokens.total_input_tokens}</p>
        <p>Output Tokens: ${resultA.tokens.output_tokens}</p>
    `;

  document.getElementById("compareMetricsB").innerHTML = `
        <p>Latency: ${resultB.latency}s</p>
        <p>Input Tokens: ${resultB.tokens.total_input_tokens}</p>
        <p>Output Tokens: ${resultB.tokens.output_tokens}</p>
    `;
}
