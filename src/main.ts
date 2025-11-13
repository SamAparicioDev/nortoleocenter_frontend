import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';

// Registrar locale español
registerLocaleData(localeEs, 'es');

bootstrapApplication(AppComponent, {
  ...appConfig, // <-- trae todos tus providers de appConfig
  providers: [
    ...(appConfig.providers || []), // todos tus providers existentes
    { provide: LOCALE_ID, useValue: 'es' } // <-- agrega LOCALE_ID para español
  ]
})
.catch(err => console.error(err));
