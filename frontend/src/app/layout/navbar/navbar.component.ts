import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'tf-navbar',
  standalone: true,
  imports: [],
  template: `
    <header class="navbar">
      <button
        class="navbar__menu-btn"
        (click)="toggleSidebar.emit()"
        aria-label="Toggle sidebar"
      >
        <span class="navbar__hamburger"></span>
      </button>

      <span class="navbar__brand">TaskForge</span>

      <nav class="navbar__actions">
        @if (auth.currentUser(); as user) {
          <span class="navbar__user">{{ user.firstName }} {{ user.lastName }}</span>
          <button class="navbar__logout" (click)="auth.logout()">Sign out</button>
        }
      </nav>
    </header>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);

  /** Emits when the hamburger button is clicked */
  readonly toggleSidebar = output<void>();
}
