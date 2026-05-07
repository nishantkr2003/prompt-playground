# 🧠 Prompt Engineering Playground

> A production-ready full-stack GenAI web application for experimenting with prompt engineering techniques, comparing outputs, optimizing prompts, managing templates, and tracking execution history.

---

## 📌 Overview

**Prompt Engineering Playground** is an interactive, portfolio-quality project built using **Flask**, **Vanilla JavaScript**, **HTML5**, and **CSS3**. It enables users to:

- Test multiple prompt engineering strategies
- Compare prompt outputs side-by-side
- Perform parameter sweeps
- Manage prompt libraries
- Analyze token usage

Built to meet **internship-to-industry standards** with modular architecture, responsive UI, REST APIs, database abstraction, and PostgreSQL/Neon migration readiness.

---

## ✨ Core Features

### 🎛️ Prompt Playground
- System Prompt + User Prompt editor
- Prompt technique selector: **Zero-shot**, **Few-shot**, **Chain-of-thought**, **Role-based**, **Output formatting**
- Real-time token counter
- Parameter controls: Temperature, Top-p, Max Tokens, Frequency Penalty, Presence Penalty
- Markdown + code rendering with syntax highlighting via **Prism.js**

### ⚖️ Comparison Mode
- Side-by-side Prompt A vs Prompt B
- Metrics: Latency, Token usage, Provider used, Parameters

### 🔁 Parameter Sweep
- Run the same prompt across multiple temperature/top-p combinations
- Grid-based output display for comparative experimentation

### 📚 Prompt Library
- Save, edit, delete prompts
- Search & filter
- Version history
- 15+ built-in templates across: Content Creation, Coding, Analysis, Summarization, Language Tasks

### 📋 Execution History
- View previous runs and re-run prompts
- Timestamp logs, provider history, and metrics dashboard

### 📤 Import / Export
- JSON import and export support

### 🌗 Additional
- Dark / Light mode toggle
- Responsive dashboard with sidebar navigation
- Toast notifications
- Local storage backup
- Keyboard shortcuts: `Ctrl + Enter` → Run, `Ctrl + S` → Save

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.10+, Flask, Flask-CORS, SQLAlchemy ORM, SQLite, tiktoken, jsonschema |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6 Modules), Prism.js, Marked.js |
| **LLM Providers** | Gemini API (Primary), Groq API (Fallback), OpenRouter (Bonus-ready) |
| **Database** | SQLite (default), Neon/PostgreSQL-ready |

---

## 📁 Project Structure

```
prompt-playground/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── generate.py
│   │   ├── templates.py
│   │   ├── prompts.py
│   │   ├── history.py
│   │   ├── output_parser.py
│   │   ├── compare.py
│   │   ├── sweep.py
│   │   └── export_import.py
│   ├── services/
│   │   ├── llm_service.py
│   │   └── token_counter.py
│   ├── models/
│   │   └── database.py
│   ├── data/
│   │   └── templates.json
│   ├── instance/
│   │   └── prompt_playground.db
│   └── utils/
│       └── validators.py
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── dashboard.css
│   │   ├── components.css
│   │   ├── data-manager.css
│   │   ├── developer.css
│   │   ├── output-parser.css
│   │   ├── shortcuts.css
│   │   ├── responsive.css
│   │   └── toast.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── comparison.js
│       ├── data-manager.js
│       ├── developer.js
│       ├── history.js
│       ├── library.js
│       ├── output-parser.js
│       ├── shortcut-help.js
│       ├── shortcuts.js
│       ├── sweep.js
│       ├── tost.js
│       └── templates.js
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/nishantkr2003/prompt-playground.git
cd prompt-playground
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///prompt_playground.db
SECRET_KEY=your_secret_key
FLASK_ENV=development
```

### 4. Run Backend

```bash
python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### 5. Run Frontend

Open `frontend/index.html` directly, or use Live Server:

```
http://127.0.0.1:5500
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/generate` | Generate LLM output |
| `POST` | `/api/compare` | Compare two prompts |
| `POST` | `/api/sweep` | Parameter sweep |
| `GET` | `/api/templates` | List all templates |
| `GET` | `/api/templates/{id}` | Get template by ID |
| `POST` | `/api/prompts` | Save a prompt |
| `GET` | `/api/prompts` | List saved prompts |
| `PUT` | `/api/prompts/{id}` | Update a prompt |
| `DELETE` | `/api/prompts/{id}` | Delete a prompt |
| `GET` | `/api/history` | Get execution history |
| `POST` | `/api/import` | Import prompts (JSON) |
| `POST` | `/api/export` | Export prompts (JSON) |

### Example Request

```json
{
  "user_prompt": "Explain prompt engineering",
  "provider": "gemini",
  "temperature": 0.5,
  "top_p": 0.8,
  "max_tokens": 200
}
```

---

## 🗄️ Database Models

| Model | Purpose |
|---|---|
| `PromptLibrary` | Stores saved prompts |
| `PromptVersions` | Tracks edits and version history |
| `PromptHistory` | Stores execution history |
| `TemplateLibrary` | Stores built-in and custom templates |

---

## 🔐 Security Best Practices

- API keys stored in backend only (never exposed to frontend)
- `.env.example` included for safe onboarding
- Input sanitization and JSON schema validation
- Error boundaries and rate-limit-safe fallback
- Secure provider abstraction layer

---

## 🗃️ SQLite → PostgreSQL Migration

Because SQLAlchemy ORM is used, migration requires only an environment variable change and schema sync.

**Development (SQLite):**
```env
DATABASE_URL=sqlite:///prompt_playground.db
```

**Production (PostgreSQL/Neon):**
```env
DATABASE_URL=postgresql://username:password@host/dbname
```

---

## 🚢 Deployment

| Layer | Options |
|---|---|
| **Frontend** | Netlify, Vercel, GitHub Pages |
| **Backend** | Render, Railway, Fly.io |
| **Database** | Neon PostgreSQL, Supabase PostgreSQL |

---

## 🔭 Future Improvements

- [ ] OpenRouter integration
- [ ] User authentication & role-based access
- [ ] Cloud deployment pipeline
- [ ] Prompt sharing marketplace
- [ ] Advanced analytics dashboard
- [ ] A/B testing reports
- [ ] Team collaboration features

---

## 🧪 Testing

Use the **Postman collection** to test all endpoints:

- Health check
- Templates CRUD
- Prompt CRUD
- Generate, Compare, Sweep
- Import / Export

---

## 👨‍💻 Author

**Nishant Kumar**  
Final Year Student | Full-Stack + GenAI Developer

[![GitHub](https://img.shields.io/badge/GitHub-nishantkr2003-181717?style=flat&logo=github)](https://github.com/nishantkr2003)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

