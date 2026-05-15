# TaskForge — Backend

A **Spring Boot 4** REST API providing authentication, project management, and task tracking.

---

## Dependencies

| Dependency              | Version      | Purpose                                   |
|-------------------------|--------------|-------------------------------------------|
| Java                    | 25           | Runtime                                   |
| Spring Boot             | 4.0.0        | Framework (web, security, JPA, validation)|
| PostgreSQL              | 17           | Relational database                       |
| JJWT                    | 0.12.6       | JWT creation and validation               |
| Lombok                  | (managed)    | Boilerplate reduction                     |
| H2                      | (test scope) | In-memory DB for unit tests               |
| Maven                   | 3.9+         | Build tool                                |

---

## Project structure

```
src/main/java/com/federico/taskforge/
├── TaskforgeApplication.java   # entry point
├── config/                     # Jackson, CORS, and security bean config
├── controller/                 # REST controllers (auth, projects, tasks, users)
├── domain/
│   ├── entity/                 # JPA entities: User, Project, Task
│   └── enums/                  # ProjectStatus, TaskStatus, TaskPriority, Role
├── dto/                        # Request and response DTOs with Bean Validation
├── exception/                  # GlobalExceptionHandler + custom exceptions
├── repository/                 # Spring Data JPA repositories (custom JPQL)
├── security/                   # JwtService, JwtAuthenticationFilter, UserDetailsServiceImpl
└── service/                    # Business logic: AuthService, ProjectService, TaskService, UserService
```

### Key design decisions

- **JWT authentication** — stateless; every request carries a `Bearer` token validated by `JwtAuthenticationFilter` before reaching controllers.
- **Spring Security filter chain** — public routes (`/api/v1/auth/**`) are open; everything else requires a valid token.
- **JPA with `ddl-auto: update`** — schema is managed automatically by Hibernate; no migration tool is needed for development.
- **Bean Validation** — all incoming DTOs are validated via `@Valid`; errors are caught by `GlobalExceptionHandler` and returned as structured JSON.
- **CORS** — configured centrally via `application.yml`; the allowed origin is overridable through the `APPLICATION_CORS_ALLOWED_ORIGINS` environment variable.

---

## API overview

| Method | Path                              | Auth required | Description                  |
|--------|-----------------------------------|---------------|------------------------------|
| POST   | `/api/v1/auth/register`           | No            | Create account                |
| POST   | `/api/v1/auth/login`              | No            | Get JWT token                 |
| GET    | `/api/v1/projects`                | Yes           | List projects for current user|
| POST   | `/api/v1/projects`                | Yes           | Create project                |
| GET    | `/api/v1/projects/{id}/tasks`     | Yes           | List tasks for a project      |
| POST   | `/api/v1/projects/{id}/tasks`     | Yes           | Create task                   |
| PATCH  | `/api/v1/tasks/{id}/status`       | Yes           | Update task status            |
| GET    | `/api/v1/users/me`                | Yes           | Get current user profile      |

---

## Local setup

### Prerequisites

- JDK 25 — [download](https://jdk.java.net/25/)
- Maven 3.9+ — [download](https://maven.apache.org/download.cgi)  
  *(or use the included `mvnw.cmd` wrapper — no installation needed)*
- PostgreSQL 17 running locally

### 1. Create the database

```sql
CREATE DATABASE taskforge;
```

### 2. Configure (optional)

The defaults in `src/main/resources/application.yml` expect PostgreSQL on `localhost:5432` with user/password `postgres`.  
Override any value with environment variables or by editing the file:

```yaml
spring:
  datasource:
    url:      jdbc:postgresql://localhost:5432/taskforge
    username: postgres
    password: postgres
application:
  cors:
    allowed-origins: http://localhost:4200
  security:
    jwt:
      secret: <your-256-bit-base64-key>
      expiration: 86400000   # 24 h
```

### 3. Run

```bash
# with Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run          # macOS / Linux
mvnw.cmd spring-boot:run        # Windows

# or with system Maven
mvn spring-boot:run
```

The API is available at `http://localhost:8080`.

### 4. Run tests

```bash
./mvnw test
```

Tests use an **H2 in-memory database** — no PostgreSQL required for testing.

---

## Docker

The repository root contains a `.env` file that pre-selects the production compose files:

```
COMPOSE_FILE=docker-compose.yml;docker-compose.prod.yml
```

Build and run the backend only (postgres starts automatically as a dependency):

```bash
# from the repository root
docker compose up --build backend
```

Force a full rebuild without layer cache (useful when dependencies change):

```bash
docker compose build --no-cache backend
docker compose up backend
```

Other handy commands:

```bash
docker compose stop backend          # stop without removing
docker compose logs -f backend       # tail logs
docker compose exec backend sh       # shell into the container
```

For a full stack or dev setup, see the [root README](../README.md).
