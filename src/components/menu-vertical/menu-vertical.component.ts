import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutenticationService } from '../../services/autenticacion/autentication.service';
import { UserById } from '../../models/User';

@Component({
  selector: 'app-menu-vertical',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-vertical.component.html',
  styleUrls: ['./menu-vertical.component.css']
})
export class MenuVerticalComponent implements OnInit {

  isCollapsed = false;
  isMobileMenuOpen = false;

  // Para almacenar el usuario logueado
  userDataUser!: UserById | null;

  constructor(private autenticacionService: AutenticationService) {}

  ngOnInit() {
    this.loadUser();
    this.checkScreenSize();
  }

  /** Cargar el usuario del localStorage */
  loadUser() {
    const stored = localStorage.getItem('userData');

    if (stored) {
      this.userDataUser = JSON.parse(stored) as UserById;
    } else {
      this.userDataUser = null;
      console.warn('No se encontró userData en localStorage');
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const isMobile = window.innerWidth < 768;
    this.isCollapsed = isMobile;
    this.isMobileMenuOpen = false;
  }

  toggleSidebar() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.isCollapsed = !this.isMobileMenuOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  cerrarMenu() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.isMobileMenuOpen = false;
      this.isCollapsed = true;
    }
  }

  /** Comprobaciones de roles */
  isAdmin(): boolean {
    return this.userDataUser?.rol === 'admin';
  }

  isProductor(): boolean {
    return this.userDataUser?.rol === 'productor';
  }

  isEmpleado(): boolean {
    return this.userDataUser?.rol === 'empleado';
  }

  /** Cerrar sesión */
  cerrarSesion() {
    this.autenticacionService.logout();
    sessionStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  }
}
