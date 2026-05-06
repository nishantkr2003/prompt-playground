export function initializeDeveloperUI() {
  const developerContainer = document.getElementById("developerContainer");

  if (!developerContainer) return;

  developerContainer.innerHTML = `
    <div class="card about-card">

      <div class="about-header">
        <h2>About Me</h2>
        <p>Aspiring Software Developer | AI & Full Stack Enthusiast</p>
      </div>

      <div class="about-section">
        <h3>Who I Am</h3>
        <p>
          Hi, I'm Nishant Kumar, a final-year student passionate about building
          impactful software products using AI, Full Stack Development, and Cloud technologies.
          I enjoy solving real-world problems through practical projects and innovation.
        </p>
      </div>

      <div class="about-section">
        <h3>Core Skills</h3>
        <ul>
          <li>Frontend: HTML, CSS, JavaScript, React.js, Tailwind CSS</li>
          <li>Backend: Node.js, Express.js, Flask</li>
          <li>Database: MongoDB, PostgreSQL, SQLite</li>
          <li>AI Integration: Gemini API, Prompt Engineering, RAG</li>
          <li>Other: Git, GitHub, OAuth, REST APIs</li>
        </ul>
      </div>

      <div class="about-section">
        <h3>Projects</h3>
        <ul>
          <li>NovaCode AI – AI-powered coding assistant</li>
          <li>ResumeForge – AI resume builder</li>
          <li>Prompt Playground – Prompt testing & optimization platform</li>
          <li>Aim Achiever – Productivity & accountability system</li>
          <li>Loan Management System – MERN based secure platform</li>
        </ul>
      </div>

      <div class="about-section">
        <h3>Achievements</h3>
        <ul>
          <li>Smart India Hackathon 2024 Finalist</li>
          <li>Built AI-based medical recommendation system</li>
          <li>Google Generative AI Certified</li>
          <li>Actively preparing for top tech roles</li>
        </ul>
      </div>

      <div class="about-section">
        <h3>Career Goal</h3>
        <p>
          My goal is to become a highly skilled Software Engineer, contribute to
          innovative products, and continuously grow in AI, system design, and scalable development.
        </p>
      </div>

    </div>
  `;
}
