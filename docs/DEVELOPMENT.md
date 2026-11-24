# Local Development Guide: SproutWFS HR

This guide walks through setting up your local environment, running the application stack, executing tests, and applying migrations.

---

## 1. Prerequisites

Ensure the following tools are installed on your machine:
* **Docker & Docker Compose** (for PostgreSQL database)
* **Python 3.12+**
* **Node.js 20+** and **npm**

---

## 2. Environment Configuration

### Backend Configuration
```bash
cd backend
cp .env.example .env
```
Inspect `.env` and verify database parameters match your local Docker setup.

### Frontend Configuration
```bash
cd ../frontend
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to `http://localhost:8000/api/v1`.

---

## 3. Starting the Database

Launch the local PostgreSQL 16 container:
```bash
docker compose up -d db
```
Verify the container is healthy:
```bash
docker compose ps
```

---

## 4. Running the Backend Service

1. Create and activate a Python virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   
   # Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1

   # Linux/macOS:
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. Run database migrations:
   ```bash
   alembic upgrade head
   ```

4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

* **API Healthcheck:** [http://localhost:8000/health](http://localhost:8000/health)
* **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 5. Running the Frontend Application

1. In a separate terminal, navigate to the frontend folder and install packages:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

* **Frontend Application:** [http://localhost:5173](http://localhost:5173)

---

## 6. Code Quality & Testing

### Backend Checks
```bash
cd backend
# Linting & Formatting
ruff check .
ruff format --check .

# Running Unit & Integration Tests
pytest
```

### Frontend Checks
```bash
cd frontend
# TypeScript static typecheck
npm run typecheck

# Production build test
npm run build
```
