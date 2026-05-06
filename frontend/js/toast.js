let toastContainer = null;

function initializeToastContainer() {
  if (toastContainer) return;

  toastContainer = document.createElement("div");
  toastContainer.id = "toastContainer";

  document.body.appendChild(toastContainer);
}

/* main tost function */
export function showToast(message, type = "info", duration = 3000) {
  initializeToastContainer();

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Auto remove
  const autoRemove = setTimeout(() => {
    removeToast(toast);
  }, duration);

  // Manual close
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(autoRemove);
    removeToast(toast);
  });
}

/*remove toast*/
function removeToast(toast) {
  toast.classList.remove("show");

  setTimeout(() => {
    toast.remove();
  }, 300);
}
