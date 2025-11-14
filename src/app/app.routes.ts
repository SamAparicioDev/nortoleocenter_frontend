import { Routes } from '@angular/router';
import { AutenticacionComponent } from '../components/autenticacion/autenticacion.component';
import { ContenidoComponent } from '../components/contenido/contenido.component';
import { authGuard } from '../guards/guards.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { EnvioComponent } from '../components/envio/envio.component';
import { RecepcionComponent } from '../components/recepcion/recepcion.component';
import { ConfiguracionComponent } from '../components/configuracion/configuracion.component';
import { FincaComponent } from '../components/finca/finca.component';

export const routes: Routes = [
  {path: '',
    component: AutenticacionComponent
  },
  {
    path: 'inicio',
    component: ContenidoComponent,
    canActivate: [authGuard],
    children: [
      {path: 'inicio', component: DashboardComponent},
      {path: 'envio', component: EnvioComponent},
      {path: 'recepcion', component: RecepcionComponent},
      {path: 'configuracion', component: ConfiguracionComponent},
      {path: 'finca', component: FincaComponent},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  {path: '**', redirectTo: ''}
];
