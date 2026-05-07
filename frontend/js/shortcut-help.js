export function initializeShortcutHelp() {
  const helpBtn = document.getElementById("shortcutHelpBtn");
  const modal = document.getElementById("shortcutModal");
  const closeBtn = document.getElementById("closeShortcutModal");

  if (!helpBtn || !modal || !closeBtn) return;

  
  helpBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  closeBtn.addEventListener("click", () => {
    closeModal(modal);
  });


  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal(modal);
    }
  });
}

function closeModal(modal) {
  modal.classList.add("hidden");
}
