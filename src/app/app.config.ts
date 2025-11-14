import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { interceptorsInterceptor } from '../interceptors/interceptors.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 🟢 AQUI SE AGREGA CORRECTAMENTE EL INTERCEPTOR
    provideHttpClient(
      withInterceptors([interceptorsInterceptor])
    ),

    provideAnimations(),
    importProvidersFrom(
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        progressBar: true,
        progressAnimation: 'increasing',
        closeButton: true,
        easing: 'ease-in',
        easeTime: 400,
      })
    ),
  ],
};
