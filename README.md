# TaskForge

A full-stack project and task management application built with **Spring Boot 4** and **Angular 21**.  
Users can register, log in, create projects, invite members, and manage tasks with priorities, statuses, and assignees.

---

## Repository structure

```
TaskForge/
├── backend/          # Spring Boot REST API  →  see backend/README.md
├── frontend/         # Angular SPA           →  see frontend/README.md
├── docker-compose.yml            # shared base (postgres + service stubs)
├── docker-compose.dev.yml        # dev overrides  (ng serve + dev DB)
└── docker-compose.prod.yml       # prod overrides (nginx  + prod DB)
```

---

## Tech stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Java 25, Spring Boot 4, Spring Security, JPA    |
| Frontend  | Angular 21, TypeScript 5.9, SCSS                |
| Database  | PostgreSQL 17                                   |
| Auth      | JWT (JJWT 0.12)                                 |
| Container | Docker + Docker Compose                         |

---

## Quick start with Docker (recommended — no local dependencies needed)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

A `.env` file at the repository root pre-selects the **production** compose files so you don't need to type `-f` flags every time:

```
COMPOSE_FILE=docker-compose.yml;docker-compose.prod.yml
```

### Production

Builds optimised images and serves the Angular app through nginx on port 80.

```bash
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost            |
| API      | http://localhost:8080       |

### Development

Runs the backend with `SPRING_PROFILES_ACTIVE=dev` and the frontend with `ng serve` (live reload).  
Override `COMPOSE_FILE` for the current shell session to switch to the dev overlay:

```powershell
# PowerShell
$env:COMPOSE_FILE = "docker-compose.yml;docker-compose.dev.yml"
docker compose up
```

```bash
# bash / macOS / Linux
COMPOSE_FILE="docker-compose.yml:docker-compose.dev.yml" docker compose up
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:4200       |
| API      | http://localhost:8080       |

> The dev environment uses a **separate** Docker volume (`postgres_data_dev`) so development data never touches the production database.

---

## Useful Docker commands

```bash
# Start a single service (postgres starts automatically as a dependency)
docker compose up --build backend
docker compose up --build frontend

# Force a full rebuild ignoring the layer cache (fixes stale-cache bugs)
docker compose build --no-cache backend
docker compose up backend

# Stop a running service without removing the container
docker compose stop backend

# Stop and remove containers (volumes are kept)
docker compose down

# Stop and remove containers AND volumes (wipes the database)
docker compose down -v

# Tail logs for a service
docker compose logs -f backend

# Open a shell inside a running container
docker compose exec backend sh
docker compose exec postgres psql -U postgres -d taskforge
```

---

## Local setup (without Docker)

See the individual READMEs for full local setup instructions:

- [`backend/README.md`](backend/README.md) — Java / Maven setup
- [`frontend/README.md`](frontend/README.md) — Node / Angular setup

You will also need a local PostgreSQL 17 instance with a database named `taskforge`.

```sql
CREATE DATABASE taskforge;
```

---

## Environment variables

Key variables you can override at runtime (relevant for production deployments):

| Variable                              | Default                        | Description                         |
|---------------------------------------|--------------------------------|-------------------------------------|
| `SPRING_DATASOURCE_URL`               | `jdbc:postgresql://...`        | JDBC connection string              |
| `SPRING_DATASOURCE_USERNAME`          | `postgres`                     | DB user                             |
| `SPRING_DATASOURCE_PASSWORD`          | `postgres`                     | DB password                         |
| `APPLICATION_SECURITY_JWT_SECRET`     | (dev key in config)            | 256-bit Base64 JWT signing secret   |
| `APPLICATION_CORS_ALLOWED_ORIGINS`    | `http://localhost:4200`        | Comma-separated allowed origins     |

