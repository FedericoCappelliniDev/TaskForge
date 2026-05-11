import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

/**
 * App Shell — wraps all authenticated routes.
 * Provides the top navbar, collapsible sidebar, and main content area.
 * The shell is activated via the router; auth pages bypass it entirely.
 */
@Component({
  selector: 'tf-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="shell" [class.shell--collapsed]="sidebarCollapsed()">
      <tf-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())"
      />
      <div class="shell__body">
        <tf-navbar (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
        <main class="shell__content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly sidebarCollapsed = signal(false);
}
