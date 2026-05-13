import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tf-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <span class="not-found__code">404</span>
      <h1 class="not-found__title">Page not found</h1>
      <p class="not-found__text">
        The page you were looking for doesn't exist or has been moved.
      </p>
      <a routerLink="/dashboard" class="btn btn--primary">Back to dashboard</a>
    </div>
  `,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
