# TaskForge — Frontend

An **Angular 21** single-page application that consumes the TaskForge REST API.

---

## Dependencies

| Dependency       | Version  | Purpose                                  |
|------------------|----------|------------------------------------------|
| Node.js          | 22 LTS   | Runtime for the build toolchain          |
| npm              | 11       | Package manager                          |
| Angular          | 21.2     | UI framework (standalone components)     |
| TypeScript       | 5.9      | Type-safe JavaScript                     |
| RxJS             | 7.8      | Reactive HTTP and state streams          |
| Angular Router   | 21.2     | Client-side routing with lazy loading    |
| Angular Forms    | 21.2     | Reactive forms with typed controls       |
| SCSS             | (built-in)| Styling via a custom design system      |
| Vitest           | 4        | Unit test runner                         |
| Prettier         | 3        | Code formatter                           |

---

## Project structure

```
src/
├── index.html
├── main.ts                     # bootstrap
├── styles.scss                 # global entry point
├── environments/               # environment.ts / environment.prod.ts
├── styles/                     # SCSS design system (_variables, _mixins, _reset, _typography)
└── app/
    ├── app.config.ts           # root providers (router, HttpClient, interceptors)
    ├── app.routes.ts           # top-level lazy routes
    ├── core/
    │   ├── guards/             # authGuard (functional, signal-based)
    │   ├── interceptors/       # authInterceptor (attaches Bearer token to every request)
    │   └── services/           # ApiService, AuthService, ProjectService, TaskService
    ├── features/
    │   ├── auth/               # login and register pages (reactive forms)
    │   ├── dashboard/          # KPI stats + recent tasks
    │   ├── projects/           # project list with progress bars
    │   ├── tasks/              # task list with status/priority badges
    │   └── not-found/          # 404 page
    ├── layout/
    │   ├── shell/              # main authenticated layout wrapper
    │   ├── navbar/             # top navigation bar
    │   └── sidebar/            # collapsible side navigation
    └── shared/
        ├── components/button/  # reusable ButtonComponent (variants + loading state)
        └── models/             # TypeScript interfaces: User, Project, Task, ApiError
```

### Key design decisions

- **Standalone components** — no NgModules anywhere; every component declares its own imports.
- **Functional guards and interceptors** — `authGuard` and `authInterceptor` are plain functions registered in `app.config.ts`, following the Angular 17+ style.
- **Signal-based auth state** — `AuthService` exposes `currentUser` and `isAuthenticated` as signals so the UI reacts without manual subscriptions.
- **Lazy loading** — every feature route is lazy-loaded via `loadComponent()`, keeping the initial bundle small.
- **Typed HTTP** — `ApiService` wraps `HttpClient` with generic return types; all API models are defined in `shared/models/`.
- **SCSS design system** — tokens (colours, spacing, border-radius) are defined in `_variables.scss` and consumed through mixins, keeping component styles thin.

---

## Local setup

### Prerequisites

- Node.js 22 LTS — [download](https://nodejs.org/)
- npm 11 (bundled with Node 22, or upgrade with `npm install -g npm@11`)
- Angular CLI 21 — `npm install -g @angular/cli`
- The backend API running on `http://localhost:8080`

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure the API URL (optional)

The API base URL is set in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

Change `apiUrl` if your backend runs on a different port.

### 3. Start the dev server

```bash
npm start
# or
ng serve
```

The application is available at `http://localhost:4200` with **live reload** enabled.

### 4. Build for production

```bash
ng build --configuration production
```

Output goes to `dist/taskforge/browser/`. Serve the contents with any static file server (the included `nginx.conf` handles SPA routing).

### 5. Run tests

```bash
npm test
```

---

## Docker

The repository root contains a `.env` file that pre-selects the production compose files:

```
COMPOSE_FILE=docker-compose.yml;docker-compose.prod.yml
```

### Production (nginx)

Angular is built at image build time and served by nginx on port 80.

```bash
# from the repository root
docker compose up --build frontend
```

Force a full rebuild without layer cache:

```bash
docker compose build --no-cache frontend
docker compose up frontend
```

### Development (live reload)

Override `COMPOSE_FILE` for the current shell session to switch to the dev overlay:

```powershell
# PowerShell
$env:COMPOSE_FILE = "docker-compose.yml;docker-compose.dev.yml"
docker compose up frontend
```

```bash
# bash / macOS / Linux
COMPOSE_FILE="docker-compose.yml:docker-compose.dev.yml" docker compose up frontend
```

Source files in `src/` are bind-mounted so changes are reflected instantly — no rebuild required.

For the full stack, see the [root README](../README.md).
