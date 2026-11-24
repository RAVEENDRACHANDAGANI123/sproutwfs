# SproutWFS HR

> Enterprise Human Resources & Recruitment Management Platform for Sprout Workforce Solutions.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2D8.svg?logo=tailwindcss)](https://tailwindcss.com/)

---

## Architecture Overview

SproutWFS HR is designed as a **Modular Monolith**:
* **Frontend (`/frontend`)**: React 19 single-page application built with TypeScript, Vite, and Tailwind CSS.
* **Backend (`/backend`)**: High-performance asynchronous REST API built with Python, FastAPI, and SQLAlchemy 2.0.
* **Database**: PostgreSQL 16 relational database with Alembic schema migrations.

For in-depth architectural decisions, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Quickstart (Local Development)

### 1. Prerequisites
* **Docker & Docker Compose** (for PostgreSQL)
* **Python 3.12+**
* **Node.js 20+** and **npm**

### 2. Start PostgreSQL
```bash
docker compose up -d db
```

### 3. Start Backend
```bash
cd backend
cp .env.example .env
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Start Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Client application will be live at: [http://localhost:5173](http://localhost:5173)

---

## Repository Structure

```text
├── backend/            # FastAPI Python application (Modular Monolith)
│   ├── app/            # Application source (core + domain modules)
│   ├── alembic/        # Database migrations
│   └── requirements.txt
├── frontend/           # React + TypeScript + Vite + Tailwind CSS SPA
│   ├── src/            # Features, UI components, hooks, and types
│   └── package.json
├── docs/               # System architecture and developer documentation
├── docker-compose.yml  # Local database service
├── PROJECT_CONTEXT.md  # Business domains, context & roadmap
├── AGENTS.md           # Instructions for AI development agents
└── README.md           # Master documentation
```

---

## Development Guidelines
* Refer to [`AGENTS.md`](AGENTS.md) for architectural guidelines, module creation instructions, and code standards.
* Refer to [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for full developer onboarding instructions.
