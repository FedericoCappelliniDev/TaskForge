import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize    = 'sm' | 'md' | 'lg';

/**
 * Reusable presentational button.
 * Keeps variant, size, loading state, and disabled handling in one place.
 */
@Component({
  selector: 'tf-button',
  standalone: true,
  template: `
    <button
      class="btn btn--{{ variant() }} btn--{{ size() }}"
      [class.btn--loading]="loading()"
      [class.btn--full]="fullWidth()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      [attr.type]="type()"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <span class="btn__spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant   = input<ButtonVariant>('primary');
  readonly size      = input<ButtonSize>('md');
  readonly loading   = input(false);
  readonly disabled  = input(false);
  readonly fullWidth = input(false);
  readonly type      = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();
}
