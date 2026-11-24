# Agent Operating Instructions: SproutWFS HR

This document defines the operating rules, coding standards, and architectural conventions for Antigravity and automated development agents working in this repository.

---

## 1. Prime Directives & Guardrails

1. **Ask for Approval Before Major or Destructive Actions:**
   * Always ask for user confirmation before deleting files, dropping database schemas, running destructive migrations, or altering core architecture.
2. **Do Not Modify External Repositories:**
   * Limit all modifications strictly to this workspace (`sprout-wfs`). Never attempt to modify or push to other repositories without explicit instruction.
3. **Never Commit Secrets or Real PII:**
   * Never store real candidate credentials, PAN/Aadhaar numbers, salaries, or API tokens.
   * Verify `.gitignore` rules before staging files.
4. **Decoupled Frontend and Backend:**
   * Keep frontend (`frontend/`) and backend (`backend/`) strictly separated. Never mix build tools, dependencies, or source files across the boundary.
5. **Preserve Marketing Website Files:**
   * Root-level static marketing website files (`index.html`, `admin.html`, `about.html`, `services.html`, `jobs.html`, `contact.html`, `assets/`, `css/`, `js/`) belong to the public web presence and must remain intact.

---

## 2. Backend Conventions (Python + FastAPI)

* **Runtime:** Python 3.12+
* **Framework:** FastAPI with asynchronous handlers (`async def`).
* **Validation:** Pydantic v2 schemas (`model_config = ConfigDict(from_attributes=True)`).
* **Database ORM:** SQLAlchemy 2.0 async syntax (`select()`, `AsyncSession`).
* **Module Layout:**
  Each module in `backend/app/modules/<module_name>/` must follow:
  ```text
  modules/<module_name>/
  ├── __init__.py
  ├── models.py       # SQLAlchemy ORM entity definitions
  ├── schemas.py      # Pydantic request/response models
  ├── service.py      # Business logic and domain calculations
  └── router.py       # FastAPI APIRouter endpoints
  ```
* **Error Handling:** Use custom domain exceptions mapped via exception handlers in `app/core/exceptions.py`. Return standard JSON:
  ```json
  {
    "detail": "Descriptive error message",
    "code": "ERROR_CODE"
  }
  ```

---

## 3. Frontend Conventions (React + TypeScript + Tailwind)

* **Build Tool:** Vite with TypeScript strict mode enabled (`noImplicitAny`, `strictNullChecks`).
* **Styling:** Tailwind CSS utility classes; avoid inline styles.
* **Component Architecture:**
  * Shared UI primitives live in `frontend/src/components/ui/`.
  * Feature-specific screens and logic live in `frontend/src/features/<feature_name>/`.
  * State management: TanStack Query (React Query) for server state; Zustand or React Context for local client state.
* **API Communication:** Centralized API client in `frontend/src/lib/api.ts` with request/response interceptors for JWT tokens.

---

## 4. Module Extension Playbook

When adding a new feature or domain (e.g. `interviews` or `onboarding`):
1. **Backend:**
   * Create `backend/app/modules/<name>/` with `models.py`, `schemas.py`, `service.py`, and `router.py`.
   * Register the new router in `backend/app/api.py`.
   * Create an Alembic migration (`alembic revision --autogenerate -m "add <name> module"`).
2. **Frontend:**
   * Create `frontend/src/features/<name>/` with subfolders for components, hooks, and types.
   * Register routes in `frontend/src/routes/`.
3. **Verification:**
   * Run backend syntax and test checks.
   * Run frontend typecheck (`tsc --noEmit`) and build checks.

---

## 5. Local Commands Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Start Database** | `docker compose up -d db` |
| **Backend Run** | `cd backend && uvicorn app.main:app --reload --port 8000` |
| **Backend Lint/Type** | `cd backend && ruff check .` |
| **Database Migrate** | `cd backend && alembic upgrade head` |
| **Frontend Install** | `cd frontend && npm install` |
| **Frontend Run** | `cd frontend && npm run dev` |
| **Frontend Typecheck**| `cd frontend && npx tsc --noEmit` |
