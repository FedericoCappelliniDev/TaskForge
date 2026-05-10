import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  // ── Public routes (no shell, no guard) ──────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Sign in · TaskForge',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Create account · TaskForge',
  },

  // ── Authenticated routes (inside shell, guarded) ─────────────────────
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard · TaskForge',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list/project-list.component').then(
            m => m.ProjectListComponent,
          ),
        title: 'Projects · TaskForge',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
        title: 'Tasks · TaskForge',
      },
    ],
  },

  // ── Catch-all ────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 · TaskForge',
  },
];
