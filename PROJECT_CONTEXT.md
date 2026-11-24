# Project Context: SproutWFS HR

## 1. Overview & Business Vision
**SproutWFS HR** is an enterprise-grade Human Resources Management System (HRMS) and Applicant Tracking System (ATS) tailored for **Sprout Workforce Solutions** ([sproutwfs.com](https://sproutwfs.com)).

The platform bridges client recruitment services with internal workforce operations:
* Transforming external candidate sourcing into a structured talent acquisition pipeline.
* Managing employee lifecycles from onboarding through payroll, performance, and compliance.
* Delivering unified role-based portals for Candidates, Recruiters, Hiring Managers, and Executives.

---

## 2. Core Functional Domains

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SproutWFS HR Ecosystem                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌─────────────────┬─────────────┴───────┬──────────────────┐
    ▼                 ▼                     ▼                  ▼
┌──────────────┐ ┌──────────────┐   ┌──────────────┐    ┌──────────────┐
│  Auth & RBAC │ │  Recruitment │   │   Core HR    │    │  Payroll &   │
│              │ │    (ATS)     │   │ & Employees  │    │  Compliance  │
│ • JWT Tokens │ │ • Job Req.   │   │ • Directory  │    │ • PF/ESI/TDS │
│ • Multi-role │ │ • Pipelines  │   │ • Org Chart  │    │ • Pay Slips  │
│ • Audit Logs │ │ • Candidate  │   │ • Documents  │    │ • Leaves/Att │
└──────────────┘ └──────────────┘   └──────────────┘    └──────────────┘
```

1. **Identity & Access Management (IAM):**
   * Role-based access control (`SUPER_ADMIN`, `HR_MANAGER`, `RECRUITER`, `HIRING_MANAGER`, `EMPLOYEE`).
   * JWT-based stateless authentication with secure refresh mechanics.
2. **Talent Acquisition (ATS):**
   * Job requisitions, automated candidate stages (Applied, Screened, Interview, Offer, Hired, Rejected).
   * Interview scheduling, structured feedback scorecards, and offer letter generation.
3. **Core HR & Personnel:**
   * Employee central directory, reporting hierarchy, department/designation structures.
   * Secure document repository (contracts, identity proofs, certifications).
4. **Time & Attendance:**
   * Leave requests, multi-level approvals, statutory holiday calendars, attendance logs.
5. **Payroll & Statutory Compliance (India):**
   * Compensation structures (Basic, HRA, Special Allowance).
   * Statutory deductions: Provident Fund (PF), Employee State Insurance (ESI), Professional Tax (PT), and Tax Deducted at Source (TDS).

---

## 3. Architecture Blueprint

* **Architecture Pattern:** Modular Monolith.
* **Separation of Concerns:**
  * `frontend/`: React 19 + TypeScript + Vite + Tailwind CSS (SPA).
  * `backend/`: Python 3.12+ + FastAPI + Pydantic v2 + SQLAlchemy 2.0 (async ORM) + Alembic.
  * `database`: PostgreSQL 16 relational database.
* **Module Boundary Isolation:**
  * Each domain in `backend/app/modules/<module>/` strictly encapsulates its own models, schemas, services, and endpoints.
  * Cross-module communication occurs via explicit service interfaces or domain events, preventing tangled direct queries across module tables.

---

## 4. Engineering & Data Policies

1. **Synthetic Data Only:** Under no circumstances should real candidate resumes, identity numbers (PAN/Aadhaar), or production credentials be stored or committed. Use randomized seed data (e.g., Faker).
2. **Environment Isolation:** Secrets are injected strictly through environment variables. `.env` files are ignored by git; `.env.example` provides non-sensitive defaults.
3. **API Standards:** RESTful conventions under `/api/v1/`, uniform JSON response envelopes, and comprehensive OpenAPI (`/docs`) schemas.
4. **Preservation of Existing Assets:** The static marketing website files (`index.html`, `admin.html`, `assets/`, `css/`, `js/`) remain functional alongside this application workspace.
