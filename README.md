# 🎓 Alumni Network – Monorepo

This monorepo contains the **Alumni Network** platform:

- 🧠 **Backend** – FastAPI + PostgreSQL + Alembic (inside Docker)
- 🎨 **Frontend** – React + TypeScript SPA

The goal is to provide a clean, modern alumni dashboard, authentication, and alumni directory.

---

## 📁 Project Structure

```text
alumni-network/
│
│── backend/          # FastAPI app, DB models, services, migrations
│   └── README.md     # Backend-specific setup and docs
│
│── frontend/         # React + TypeScript SPA
│   └── README.md     # Frontend-specific setup and docs
│
│── docker-compose.yml
└── README.md         # (this file)
```

## Architecture

```mermaid
flowchart LR
    subgraph Client
        U[User Browser]
    end

    subgraph Frontend [Frontend (React + TS)]
        FE[SPA - Alumni Network UI]
    end

    subgraph Backend [Backend (FastAPI)]
        APIRouters[Routers (auth, dashboard, alumni)]
        Services[Services / Business Logic]
        Schemas[Pydantic Schemas (request/response)]
        Models[ORM Models]
    end

    subgraph Infra [Infrastructure]
        Docker[Docker Compose]
        DB[(PostgreSQL)]
        Alembic[Alembic Migrations]
        pgAdmin[pgAdmin (DB GUI)]
    end

    U -->|HTTP (HTTPS)| FE
    FE -->|REST API calls<br/>GET /login<br/>POST /register<br/>GET /me<br/>GET /alumni...| APIRouters
    APIRouters --> Schemas
    APIRouters --> Services
    Services --> Models
    Models --> DB

    Docker --> Backend
    Docker --> DB

    Alembic --> DB
    pgAdmin <-->|Inspect / Query| DB

```
