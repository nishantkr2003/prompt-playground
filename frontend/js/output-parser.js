export function parseOutput(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return `
            <div class="empty-state">
                No output generated.
            </div>
        `;
  }

  let html = escapeHTML(rawText);

  // Code blocks ``` ```
  html = parseCodeBlocks(html);

  // Headings
  html = parseHeadings(html);

  // Bullet lists
  html = parseLists(html);

  // Inline code
  html = parseInlineCode(html);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return `
        <div class="parsed-output">
            ${html}
        </div>
    `;
}


function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/*code blocks*/
function parseCodeBlocks(text) {
  return text.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `
            <div class="code-block-wrapper">
                <button class="copy-btn" onclick="window.copyCodeBlock(this)">
                    Copy
                </button>
                <pre class="code-block"><code>${code.trim()}</code></pre>
            </div>
        `;
  });
}

/*headings*/
function parseHeadings(text) {
  return text
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");
}

/*lists*/
function parseLists(text) {
  return text
    .replace(/(?:^|\n)- (.*?)(?=\n|$)/g, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
}

/*inline code*/
function parseInlineCode(text) {
  return text.replace(/`(.*?)`/g, "<code class='inline-code'>$1</code>");
}


window.copyCodeBlock = function (button) {
  const code = button.parentElement.querySelector("code").innerText;

  navigator.clipboard.writeText(code);

  const originalText = button.innerText;

  button.innerText = "Copied!";

  setTimeout(() => {
    button.innerText = originalText;
  }, 1500);
};
