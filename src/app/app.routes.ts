import { DashboardComponent } from './../components/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { AutenticacionComponent } from '../components/autenticacion/autenticacion.component';
import { ContenidoComponent } from '../components/contenido/contenido.component';
import { EnvioComponent } from '../components/envio/envio.component';
import { RecepcionComponent } from '../components/recepcion/recepcion.component';
import { ConfiguracionComponent } from '../components/configuracion/configuracion.component';
import { FincaComponent } from '../components/finca/finca.component';
import { UsuarioComponent } from '../components/usuario/usuario.component';
import { authGuard } from '../guards/guards.guard';
import { noAuthGuard } from '../guards/login.guard';
import { LoteComponent } from '../components/lote/lote.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AutenticacionComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: ContenidoComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component : DashboardComponent},
      { path: 'usuario', component: UsuarioComponent },
      { path: 'envio', component: EnvioComponent },
      { path: 'recepcion', component: RecepcionComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'finca', component: FincaComponent },
      { path: 'lote', component: LoteComponent}
    ]
  },
  { path: '**', redirectTo: 'login' }
];
