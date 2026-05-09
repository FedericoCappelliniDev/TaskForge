import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * App root — minimal host component.
 * Routing takes care of which layout/page renders;
 * this component is simply a named router-outlet wrapper.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
