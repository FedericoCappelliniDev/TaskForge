import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-card__title">Welcome back</h1>
        <p class="auth-card__subtitle">Sign in to your TaskForge account</p>

        @if (errorMessage()) {
          <div class="auth-card__error" role="alert">{{ errorMessage() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              type="email"
              class="form-input"
              formControlName="email"
              autocomplete="email"
              placeholder="you@example.com"
            />
            @if (showError('email')) {
              <span class="form-error">Please enter a valid email address.</span>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              type="password"
              class="form-input"
              formControlName="password"
              autocomplete="current-password"
              placeholder="••••••••"
            />
            @if (showError('password')) {
              <span class="form-error">Password is required.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn--primary btn--full"
            [disabled]="loading()"
          >
            {{ loading() ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="auth-card__footer">
          Don't have an account?
          <a routerLink="/register" class="auth-card__link">Create one</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading      = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected showError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.errorMessage.set('Invalid email or password. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
