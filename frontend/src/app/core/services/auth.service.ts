import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'tf_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http     = inject(HttpClient);
  private readonly router   = inject(Router);
  // ── Signals ────────────────────────────────────────────────────────────────
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser          = this._currentUser.asReadonly();
  readonly isAuthenticated      = computed(() => this._currentUser() !== null);

  // ── Endpoints ───────────────────────────────────────────────────────────────
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  // ── Bootstrap ───────────────────────────────────────────────────────────────
  /** Call once in app initializer — restores session from stored token */
  init(): void {
    const token = this.getToken();
    if (token) {
      // TODO: call /auth/me to validate token and restore user
      // this.fetchCurrentUser().subscribe();
    }
  }

  // ── Auth actions ────────────────────────────────────────────────────────────
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => this.handleAuthResponse(response)),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      tap(response => this.handleAuthResponse(response)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ── Token helpers ────────────────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    this._currentUser.set(response.user);
  }
}
