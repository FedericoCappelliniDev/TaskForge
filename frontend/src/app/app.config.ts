import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Use zone-based change detection with event coalescing for performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Router with input binding (for @Input() from route params) and view transitions
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    // HTTP client with the fetch API backend and the auth Bearer-token interceptor
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
