import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tf-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-card__title">Create your account</h1>
        <p class="auth-card__subtitle">Start managing projects and tasks today</p>

        @if (errorMessage()) {
          <div class="auth-card__error" role="alert">{{ errorMessage() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First name</label>
              <input id="firstName" type="text" class="form-input"
                formControlName="firstName" autocomplete="given-name" />
              @if (showError('firstName')) {
                <span class="form-error">First name is required.</span>
              }
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">Last name</label>
              <input id="lastName" type="text" class="form-input"
                formControlName="lastName" autocomplete="family-name" />
              @if (showError('lastName')) {
                <span class="form-error">Last name is required.</span>
              }
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input id="email" type="email" class="form-input"
              formControlName="email" autocomplete="email"
              placeholder="you@example.com" />
            @if (showError('email')) {
              <span class="form-error">Please enter a valid email address.</span>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-input"
              formControlName="password" autocomplete="new-password"
              placeholder="Min. 8 characters" />
            @if (showError('password')) {
              <span class="form-error">Password must be at least 8 characters.</span>
            }
          </div>

          <button type="submit" class="btn btn--primary btn--full" [disabled]="loading()">
            {{ loading() ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="auth-card__footer">
          Already have an account?
          <a routerLink="/login" class="auth-card__link">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading      = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(8)]],
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

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.errorMessage.set('Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
