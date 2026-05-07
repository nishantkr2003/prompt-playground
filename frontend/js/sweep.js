import { sweepParameters } from "./api.js";
import { parseOutput } from "./output-parser.js";
import { showToast } from "./toast.js";
const sweepContainer = document.getElementById("sweepContainer");

export function initializeSweepUI() {
  sweepContainer.innerHTML = `
        <div class="card">
            <label>User Prompt</label>
            <textarea id="sweepPrompt" placeholder="Enter prompt for parameter sweep..."></textarea>

            <label>System Prompt (Optional)</label>
            <textarea id="sweepSystemPrompt"></textarea>

            <label>Temperatures (comma separated)</label>
            <input type="text" id="sweepTemperatures" value="0.3,0.7">

            <label>Top P Values (comma separated)</label>
            <input type="text" id="sweepTopPs" value="0.5,0.8">

            <label>Provider</label>
            <select id="sweepProvider">
                <option value="gemini">Gemini</option>
                <option value="groq">Groq</option>
            </select>

            <button id="runSweep">Run Parameter Sweep</button>
        </div>

        <div id="sweepResults" class="sweep-grid" style="margin-top:20px;"></div>
    `;

  document.getElementById("runSweep").addEventListener("click", runSweep);
}

function parseNumericList(value) {
  return value
    .split(",")
    .map((v) => parseFloat(v.trim()))
    .filter((v) => !isNaN(v));
}

/*run sweep*/
async function runSweep() {
  const userPrompt = document.getElementById("sweepPrompt").value.trim();

  if (!userPrompt) {
    showToast("Prompt is required", "warning");
    return;
  }

  const temperatures = parseNumericList(
    document.getElementById("sweepTemperatures").value,
  );

  const topPs = parseNumericList(document.getElementById("sweepTopPs").value);

  const resultsContainer = document.getElementById("sweepResults");

  resultsContainer.innerHTML = `<div class="loader"></div>`;

  const payload = {
    user_prompt: userPrompt,
    system_prompt: document.getElementById("sweepSystemPrompt").value,
    provider: document.getElementById("sweepProvider").value,
    temperatures,
    top_ps: topPs,
  };

  const response = await sweepParameters(payload);

  if (response.status !== "success") {
    resultsContainer.innerHTML = `<p>Parameter sweep failed.</p>`;
    return;
  }

  renderSweepResults(response.data);
}

/*render sweep results*/
function renderSweepResults(results) {
  const resultsContainer = document.getElementById("sweepResults");

  if (!results.length) {
    resultsContainer.innerHTML = `
            <div class="empty-state">
                No sweep results available
            </div>
        `;
    return;
  }

  resultsContainer.innerHTML = results
    .map(
      (item) => `
        <div class="sweep-card">
            <h3>Temp: ${item.temperature} | Top P: ${item.top_p}</h3>

            <div class="comparison-output">
                ${parseOutput(item.result.response)}
            </div>

            <div class="sweep-metrics">
                <p>Latency: ${item.result.latency}s</p>
                <p>Input Tokens: ${item.result.tokens.total_input_tokens}</p>
                <p>Output Tokens: ${item.result.tokens.output_tokens}</p>
            </div>
        </div>
    `,
    )
    .join("");
}
