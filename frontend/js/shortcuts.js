import { showToast } from "./toast.js";

export function initializeShortcuts() {
  document.addEventListener("keydown", handleShortcuts);
}

function handleShortcuts(event) {
  const activeTag = document.activeElement.tagName.toLowerCase();

  // Prevent accidental overrides in input unless intended
  const isTyping = activeTag === "input" || activeTag === "textarea";

  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();

    const runBtn = document.getElementById("runPrompt");

    if (runBtn) {
      runBtn.click();
      showToast("Running prompt...", "info");
    }
  }

  if (event.ctrlKey && event.key.toLowerCase() === "s") {
    event.preventDefault();

    const saveBtn = document.getElementById("savePrompt");

    if (saveBtn) {
      saveBtn.click();
      showToast("Saving prompt...", "info");
    }
  }

  if (!isTyping && event.key === "/") {
    event.preventDefault();

    const search = document.getElementById("librarySearch");

    if (search) {
      document.querySelector('[data-section="library"]')?.click();
      setTimeout(() => search.focus(), 100);

      showToast("Library search activated", "info");
    }
  }

  if (event.key === "Escape") {
    const toasts = document.querySelectorAll(".toast");

    if (toasts.length) {
      toasts[toasts.length - 1].remove();
    }
  }

  if (event.altKey) {
    const sectionMap = {
      1: "playground",
      2: "templates",
      3: "library",
      4: "comparison",
      5: "sweep",
      6: "history",
      7: "data-manager",
      8: "developer",
    };

    const targetSection = sectionMap[event.key];

    if (targetSection) {
      event.preventDefault();

      const targetButton = document.querySelector(
        `[data-section="${targetSection}"]`,
      );

      if (targetButton) {
        targetButton.click();

        showToast(`Switched to ${targetButton.textContent}`, "info");
      }
    }
  }
}
