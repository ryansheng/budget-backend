import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient , withFetch} from '@angular/common/http';

import { routes } from './app.routes';
import { API_URL } from '../tokens/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(),
    {provide: API_URL, useValue:'https://budget-backend-c188.onrender.com/api'}

  ]
};
