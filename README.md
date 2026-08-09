<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bot.svg" alt="SalesPilot AI Logo" width="120" height="120">

  # 🚀 SalesPilot AI
  **Your 24/7 Autonomous AI Sales Employee**

  <p align="center">
    Automate your entire sales pipeline with intelligent voice calling, smart conversations, and seamless calendar booking.
  </p>

  <!-- Badges -->
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" alt="React"></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"></a>
  </p>
</div>

---

## ✨ Features

SalesPilot AI acts as a complete replacement or augmentation for your SDR team.

| Feature | Description |
| :--- | :--- |
| 📞 **AI Voice Calling** | Human-like conversational AI that dials leads, handles objections gracefully, and logs calls automatically. |
| 🧠 **Smart Conversations** | LLM-powered context awareness. Understands intent and sentiment to answer complex questions naturally. |
| 📅 **Auto Booking** | Seamlessly connects with Google Calendar & Outlook to schedule meetings and generate Zoom links. |
| 📧 **Email Automation** | Automatically sends tailored follow-ups, proposals, and thank-you notes after calls. |
| 📈 **Lead Qualification** | Intelligently scores leads based on BANT (Budget, Authority, Need, Timeline) parameters. |
| 📊 **Premium Analytics** | Visualizes conversion funnels, agent performance, and provides exportable reports. |

---

## 🛠️ Technology Stack

Our modern monorepo is built for scalability and performance.

<details>
<summary><b>Frontend (Web App)</b></summary>
<br>

- **React 18** (Vite for fast builds)
- **Tailwind CSS v4** (Utility-first styling)
- **Framer Motion** (Fluid micro-animations and transitions)
- **React Router v6** (Client-side routing)
- **React Flow** (Visual workflow builder)

</details>

<details>
<summary><b>Backend (API Services)</b></summary>
<br>

- **FastAPI** (High-performance asynchronous Python web framework)
- **Uvicorn** (ASGI Server)
- **Alembic** (Database migrations)
- **Celery / Redis** (Background task workers)
- **PostgreSQL** (Primary relational database)

</details>

---

## 🚀 Quick Start (Local Development)

Follow these steps to get a local development environment up and running.

### 1. Clone the repository
```bash
git clone https://github.com/jeyajothi08/SalesPilot.git
cd SalesPilot
```

### 2. Start the Backend (FastAPI)
```bash
# Navigate to the backend directory (or root if using virtualenv)
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r backend/requirements.txt
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Start the Frontend (Vite)
Open a new terminal window:
```bash
cd apps/web
npm install
npm run dev
```

Your frontend should now be running at `http://localhost:5173`.

---

## 💻 Architecture Overview

The repository is structured as a scalable monorepo:

```text
SalesPilot/
├── apps/
│   └── web/                 # React frontend application
├── backend/                 # Python FastAPI backend
├── infrastructure/          # Docker, Kubernetes, and monitoring configs
├── packages/                # Shared internal packages (UI components, config)
├── services/                # Microservices architecture definitions
└── scripts/                 # Deployment and utility scripts
```

---

## 📸 Dashboard Preview

> **Note:** The OS dashboard mimics a full operating system within the browser, providing a highly immersive workspace for managing sales workflows.

*(Insert application screenshots here)*

---

<div align="center">
  <p>Built with ❤️ for modern sales teams.</p>
</div>
