import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AutenticationService } from '../../services/autenticacion/autentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isCollapsed = false;
  fechaHoy: Date = new Date();
  nombreUsuario: string = 'Usuario';
  emailUsuario: string = '';

  constructor(private usuarioLoginService: AutenticationService) {}

  ngOnInit() {
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        this.nombreUsuario = userData.name || 'Usuario';
        this.emailUsuario = userData.email || '';
        console.log('Usuario cargado:', this.nombreUsuario, this.emailUsuario);
      } else {
        console.warn('No se encontró userData en localStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el userData:', error);
      this.nombreUsuario = 'Usuario';
      this.emailUsuario = '';
    }
  }

  public getNombreUsuario(): string {
    return this.nombreUsuario;
  }

  public getEmailUsuario(): string {
    return this.emailUsuario;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
