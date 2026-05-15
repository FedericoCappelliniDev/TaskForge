# TaskForge — Frontend

Angular 21 single-page application for TaskForge, a full-stack task and project management platform.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Angular 21.2 — standalone components, no NgModules |
| Language | TypeScript (strict mode) |
| Styles | SCSS with Dart Sass `@use` module system |
| State | Angular Signals (`signal`, `computed`, `input`, `output`) |
| HTTP | `HttpClient` with `withFetch()` and functional interceptors |
| Routing | Lazy-loaded routes, functional guards, `withViewTransitions()` |
| Change detection | Zone.js (`provideZoneChangeDetection`) |
| Build | Angular CLI esbuild builder |

---

## Project Structure

```
frontend/
├── src/
│   ├── main.ts                        # Bootstrap entry point
│   ├── styles.scss                    # Global stylesheet entry
│   ├── styles/
│   │   ├── _variables.scss            # Design tokens (colors, spacing, typography…)
│   │   ├── _reset.scss                # CSS reset
│   │   ├── _typography.scss           # Base typography rules
│   │   └── _mixins.scss               # Reusable mixins (respond-to, card, flex…)
│   ├── environments/
│   │   ├── environment.ts             # Development config
│   │   └── environment.prod.ts        # Production config
│   └── app/
│       ├── app.ts                     # Root component (<router-outlet />)
│       ├── app.routes.ts              # Full route map (lazy, guarded)
│       ├── app.config.ts              # Application providers
│       ├── core/
│       │   ├── services/
│       │   │   ├── auth.service.ts    # JWT auth — signals, login/register/logout
│       │   │   └── api.service.ts     # Generic typed HTTP wrapper
│       │   ├── guards/
│       │   │   └── auth.guard.ts      # Functional CanActivateFn + returnUrl
│       │   └── interceptors/
│       │       └── auth.interceptor.ts # Bearer token attachment + 401 handling
│       ├── layout/
│       │   ├── shell/                 # Grid layout host, sidebar collapse signal
│       │   ├── navbar/                # Top bar with hamburger and user info
│       │   └── sidebar/               # Collapsible nav (Dashboard / Projects / Tasks)
│       ├── features/
│       │   ├── auth/
│       │   │   ├── login/             # Reactive form, signal loading/error state
│       │   │   └── register/          # Two-column name grid, reactive form
│       │   ├── dashboard/             # KPI cards and recent tasks overview
│       │   ├── projects/
│       │   │   └── project-list/      # Cards with progress bars and status badges
│       │   ├── tasks/
│       │   │   └── task-list/         # Table with priority and status badges
│       │   └── not-found/             # 404 page
│       └── shared/
│           ├── models/
│           │   ├── user.model.ts      # User, UserRole, AuthResponse, LoginRequest…
│           │   ├── project.model.ts   # Project, ProjectStatus, CreateProjectRequest
│           │   ├── task.model.ts      # Task, TaskStatus, TaskPriority, CreateTaskRequest
│           │   └── api.model.ts       # Page<T>, ApiError
│           └── components/
│               └── button/            # ButtonComponent — variants, sizes, loading state
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Angular CLI 21 (`npm install -g @angular/cli@21`)

### Install dependencies

```bash
cd frontend
npm install
```

### Run the development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app hot-reloads on file changes.

### Build for production

```bash
ng build --configuration production
```

Output is emitted to `frontend/dist/taskforge/`.

---

## Environment Configuration

| File | Purpose |
|---|---|
| `src/environments/environment.ts` | Development — API at `http://localhost:8080/api/v1` |
| `src/environments/environment.prod.ts` | Production — replace with your deployed API URL |

The Angular CLI swaps the environment file automatically during a production build via `fileReplacements` in `angular.json`.

---

## Key Design Decisions

### Standalone components
All components use `standalone: true`. There are no `NgModule` declarations anywhere in the project.

### Signals as primary state primitive
Local UI state (loading flags, error messages, sidebar collapsed state) all use `signal()`. The `AuthService` exposes `isAuthenticated` as a `computed()` derived from the current user signal.

### Functional patterns
Both the route guard (`authGuard`) and the HTTP interceptor (`authInterceptor`) are plain functions — no class-based `CanActivate` or `HttpInterceptor` interface.

### SCSS module system
All partials use `@use` (not the legacy `@import`). Design tokens live in `_variables.scss` and are consumed via `@use '../../styles/variables' as v`.

### JWT storage
The access token is stored in `localStorage` under the key `tf_access_token`. The interceptor reads this key and attaches the `Authorization: Bearer` header to every outgoing request automatically.

---

## Route Map

| Path | Component | Guard |
|---|---|---|
| `/login` | `LoginComponent` | — |
| `/register` | `RegisterComponent` | — |
| `/` (shell) | `ShellComponent` | `authGuard` |
| `/dashboard` | `DashboardComponent` | inherited |
| `/projects` | `ProjectListComponent` | inherited |
| `/tasks` | `TaskListComponent` | inherited |
| `**` | `NotFoundComponent` | — |

Unauthenticated users who try to access a guarded route are redirected to `/login?returnUrl=<intended-path>`.

---

## API Integration

The `ApiService` wraps `HttpClient` with typed convenience methods:

```typescript
get<T>(path: string): Observable<T>
getPaged<T>(path: string, params?: Record<string, string | number>): Observable<Page<T>>
post<T>(path: string, body: unknown): Observable<T>
put<T>(path: string, body: unknown): Observable<T>
patch<T>(path: string, body: unknown): Observable<T>
delete<void>(path: string): Observable<void>
```

All methods prepend `environment.apiBaseUrl` to `path`. The backend is expected at `http://localhost:8080/api/v1` during development.

> **Note:** Feature components currently use mock data. Real HTTP calls will be wired once the Spring Boot backend is running.

---

## Backend

The backend (Spring Boot + PostgreSQL) lives in the sibling `backend/` directory and is not yet implemented. See the root `README.md` for the full project roadmap.

---

## Scripts Reference

| Command | Description |
|---|---|
| `ng serve` | Start dev server at `localhost:4200` |
| `ng build` | Development build |
| `ng build --configuration production` | Production build with optimizations |
| `ng lint` | Run ESLint |
| `ng test` | Run unit tests via Karma |

---

## License

MIT — see [LICENSE](../LICENSE).
