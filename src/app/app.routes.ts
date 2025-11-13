import { Routes } from '@angular/router';
import { AutenticacionComponent } from '../components/autenticacion/autenticacion.component';
import { ContenidoComponent } from '../components/contenido/contenido.component';
import { authGuard } from '../guards/guards.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

export const routes: Routes = [
  {path: '',
    component: AutenticacionComponent
  },
  {
    path: 'inicio',
    component: ContenidoComponent,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  {path: '**', redirectTo: ''}
];
