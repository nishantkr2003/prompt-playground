// const BASE_URL = "http://127.0.0.1:5000/api";
const BASE_URL = "https://prompt-playground-backend.onrender.com/api";
/* core request handler */

async function request(endpoint, method = "GET", payload = null) {
  try {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (payload) {
      config.body = JSON.stringify(payload);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]`, error.message);

    return {
      status: "error",
      message: error.message || "Something went wrong",
    };
  }
}

/* health */

export const checkHealth = () => request("/health");

/* generate */

export const generatePrompt = (payload) =>
  request("/generate", "POST", payload);

/* prompts */

export const getPrompts = () => request("/prompts");

export const getPromptById = (id) => request(`/prompts/${id}`);

export const createPrompt = (payload) => request("/prompts", "POST", payload);

export const updatePrompt = (id, payload) =>
  request(`/prompts/${id}`, "PUT", payload);

export const deletePrompt = (id) => request(`/prompts/${id}`, "DELETE");

/* templates */

export const getTemplates = () => request("/templates");

export const getTemplateById = (id) => request(`/templates/${id}`);

/* history */

export function getHistory(filters = {}) {
  const query = new URLSearchParams(filters).toString();

  return request(`/history${query ? `?${query}` : ""}`);
}

export const getHistoryById = (id) => request(`/history/${id}`);

/* compare */

export const comparePrompts = (payload) => request("/compare", "POST", payload);

/* sweep */

export const sweepParameters = (payload) => request("/sweep", "POST", payload);

/* data manager */

export const exportData = () => request("/export", "POST");

export const importData = (payload) => request("/import", "POST", payload);
