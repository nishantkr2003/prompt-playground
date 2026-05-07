export function initializeDeveloperUI() {
  const developerContainer = document.getElementById("developerContainer");

  if (!developerContainer) return;

  developerContainer.innerHTML = `
    <div class="card about-card">

      <div class="about-header">
        <div class="about-title">
          <h2>Nishant Kumar</h2>
          <p>Aspiring Software Developer | AI Engineer | Full Stack Builder</p>
        </div>
        <div class="about-badge">
          Final Year Student • Open to Opportunities
        </div>
      </div>

      <div class="about-grid">

        <div class="about-section">
          <h3>🚀 Who I Am</h3>
          <p>
            Passionate about building real-world software products using
            AI, Full Stack Development, and Cloud technologies.
            I focus on solving practical problems through innovation,
            scalable systems, and impactful user experiences.
          </p>
        </div>

        <div class="about-section">
          <h3>💻 Core Skills</h3>
          <ul>
            <li>Frontend: HTML, CSS, JavaScript, React.js, Tailwind CSS</li>
            <li>Backend: Node.js, Express.js, Flask</li>
            <li>Database: MongoDB, PostgreSQL, SQLite</li>
            <li>AI: Gemini API, RAG, Prompt Engineering, AI & ML, Deep Learning, Generative AI, NLP</li>
            <li>Programming: Java</li>
            <li>Tools: Git, GitHub, OAuth, REST APIs</li>
          </ul>
        </div>

        <div class="about-section">
          <h3>📌 Featured Projects</h3>
          <ul>
            <li>NovaCode AI – AI coding assistant</li>
            <li>ResumeForge – Smart AI resume builder</li>
            <li>Prompt Playground – Prompt optimization platform</li>
            <li>Aim Achiever – Productivity ecosystem</li>
            <li>Loan Management System – Secure MERN platform</li>
          </ul>
        </div>

        <div class="about-section">
          <h3>🏆 Achievements</h3>
          <ul>
            <li>Smart India Hackathon 2024 Finalist</li>
            <li>AI-based Medical Recommendation System</li>
            <li>Gate Qualified</li>
            <li>Focused on top-tier Software Engineering roles</li>
          </ul>
        </div>

        <div class="about-section">
          <h3>🎯 Career Vision</h3>
          <p>
            My goal is to become a highly skilled Software Engineer,
            contribute to innovative products, and grow deeply in
            AI systems, scalable architecture, and next-generation development.
          </p>
        </div>

        <div class="about-section">
          <h3>🔥 Current Focus</h3>
          <p>
            Building advanced AI-integrated products, mastering
            system design, strengthening DSA, and preparing for
            high-impact tech opportunities.
          </p>
        </div>

      </div>

      <div class="about-links">
        <a href="https://kumarnishant.netlify.app/" target="_blank">Portfolio</a>
        <a href="https://github.com/nishantkr2003" target="_blank">GitHub</a>
        <a href="https://www.linkedin.com/in/nishant-kumar-749279260/" target="_blank">LinkedIn</a>
        <a href="https://drive.google.com/file/d/1E1ZmnczkrmaxEqvFSGMdAx7D60nx0lmF/view?usp=sharing" target="_blank">Resume</a>
      </div>

    </div>
  `;
}
