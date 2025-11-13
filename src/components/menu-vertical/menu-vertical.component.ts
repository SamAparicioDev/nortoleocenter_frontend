import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutenticationService } from '../../services/autenticacion/autentication.service';

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

  constructor(private autenticacionService: AutenticationService) {}

  ngOnInit() {
    this.checkScreenSize();
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

  cerrarSesion() {
    this.autenticacionService.logout();
    sessionStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
}
