import { Routes } from '@angular/router';
import { AutenticacionComponent } from '../components/autenticacion/autenticacion.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AutenticacionComponent,
    pathMatch: 'full',

  },
   {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
