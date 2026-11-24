# System Architecture & Design: SproutWFS HR

## 1. Architectural Style: Modular Monolith
SproutWFS HR uses a **Modular Monolith** pattern. All modules reside in a unified codebase and share deployment orchestration, but remain cleanly decoupled through strict directory, schema, and interface boundaries.

### Advantages for SproutWFS HR:
* **Single Deployment Unit:** Low operational overhead during early and growth stages.
* **Strict Domain Isolation:** High cohesion within modules (Recruitment, Employees, Payroll, Leave) without microservice network latency or distributed transaction complexities.
* **Extraction Path:** Any module can be separated into an independent service if organizational scaling requires it.

---

## 2. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client_Layer ["Client Layer"]
        SPA["React 19 + TypeScript SPA"]
        Router["React Router v6"]
        Query["TanStack Query (Cache)"]
        UI["Tailwind CSS UI Components"]
        SPA --> Router --> UI
        UI --> Query
    end

    subgraph API_Layer ["API Layer (FastAPI)"]
        Gateway["FastAPI Gateway / Root Router"]
        AuthMiddleware["JWT Authentication & RBAC Middleware"]
        Gateway --> AuthMiddleware
    end

    subgraph Modules ["Domain Modules (Modular Monolith)"]
        M_Auth["Identity & RBAC"]
        M_Recruit["Recruitment (ATS)"]
        M_CoreHR["Core HR & Directory"]
        M_Leave["Leave & Attendance"]
        M_Payroll["Payroll & Compliance"]
    end

    subgraph Core_Kernel ["Core Kernel"]
        DB["Async Session Manager"]
        Config["Pydantic Settings"]
        Security["Bcrypt / Token Manager"]
    end

    subgraph Data_Layer ["Data Persistence"]
        Postgres[("PostgreSQL 16")]
    end

    Query -- "HTTPS / JSON" --> Gateway
    AuthMiddleware --> M_Auth
    AuthMiddleware --> M_Recruit
    AuthMiddleware --> M_CoreHR
    AuthMiddleware --> M_Leave
    AuthMiddleware --> M_Payroll

    M_Auth --> Core_Kernel
    M_Recruit --> Core_Kernel
    M_CoreHR --> Core_Kernel
    M_Leave --> Core_Kernel
    M_Payroll --> Core_Kernel

    Core_Kernel --> Postgres
```

---

## 3. Module Boundaries & Communication Rules

### Internal Module Layout
Every module inside `backend/app/modules/<module_name>/` adheres to the following structure:
* **`models.py`:** SQLAlchemy ORM models inheriting from `app.core.database.Base`.
* **`schemas.py`:** Pydantic models for incoming requests and outgoing responses.
* **`service.py`:** Domain business logic, calculations, and persistence transactions.
* **`router.py`:** HTTP route declarations with dependency injection for authentication and database sessions.

### Boundary Rules
1. **No Cross-Module Database Queries:** Module A must never directly query Module B's SQLAlchemy tables.
2. **Service Interface Calls:** If Recruitment needs employee data, it queries the `EmployeeService` public interface.
3. **Database Transactions:** The database connection is injected via FastAPI's `Depends(get_db)`. Each HTTP request operates within its own transactional boundary.

---

## 4. Security & Data Protection Architecture

* **Authentication:** OAuth2 Password Bearer flow issuing signed JSON Web Tokens (JWT).
* **Password Hashing:** Passlib with Bcrypt (cost factor 12).
* **Role-Based Access Control (RBAC):**
  * Route-level permission guards using FastAPI dependencies (`require_role(["HR_MANAGER", "SUPER_ADMIN"])`).
* **Cross-Origin Resource Sharing (CORS):** Strict origin whitelisting in `app.core.config.Settings`.
* **Input Validation:** Strict type enforcement via Pydantic v2 prevents SQL injection, type coercion bugs, and parameter tampering.
