import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

@Component({
  selector: 'tf-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed()">
      <div class="sidebar__logo">
        @if (!collapsed()) {
          <span class="sidebar__logo-text">TaskForge</span>
        } @else {
          <span class="sidebar__logo-icon">TF</span>
        }
      </div>

      <nav class="sidebar__nav" aria-label="Main navigation">
        @for (item of navItems; track item.path) {
          <a
            class="sidebar__link"
            [routerLink]="item.path"
            routerLinkActive="sidebar__link--active"
            [title]="collapsed() ? item.label : ''"
          >
            <span class="sidebar__icon" aria-hidden="true">{{ item.icon }}</span>
            @if (!collapsed()) {
              <span class="sidebar__label">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <button
        class="sidebar__toggle"
        (click)="toggleCollapse.emit()"
        [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        {{ collapsed() ? '→' : '←' }}
      </button>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly collapsed      = input.required<boolean>();
  readonly toggleCollapse = output<void>();

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
    { label: 'Projects',  path: '/projects',  icon: '◫' },
    { label: 'Tasks',     path: '/tasks',      icon: '✓' },
  ];
}
