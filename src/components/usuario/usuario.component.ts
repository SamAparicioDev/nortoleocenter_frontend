import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { UserById } from '../../models/User';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [NgIf],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuario!: UserById;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {

    // 1. Obtener el userData guardado en localStorage
    const storedUser = localStorage.getItem('userData');

    if (!storedUser) {
      console.error('No se encontró userData en localStorage');
      return;
    }

    // 2. Convertirlo en objeto
    const parsedUser = JSON.parse(storedUser) as UserById;

    const userId = parsedUser.id;  // ← El ID del usuario logueado

    // 3. Llamar al servicio para obtener datos completos por ID
    this.usuarioService.obtenerUsuarioPorId(userId).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
      }
    });
  }
}
