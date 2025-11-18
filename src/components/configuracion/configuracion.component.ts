import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgIf, NgForOf } from '@angular/common';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { DepartamentoService } from '../../services/departamento/departamento.service';
import { CiudadService } from '../../services/ciudad/ciudad.service';

import { UserList } from '../../models/User';
import { DepartamentoDTO, DepartamentoListResponse } from '../../models/Departamento';
import { CiudadDTO, CiudadResponseList } from '../../models/Ciudad';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {

  // ==========================================
  // PESTAÑAS
  // ==========================================
  activeTab: 'usuarios' | 'departamentos' | 'ciudades' = 'usuarios';
  cambiarTab(tab: any) { this.activeTab = tab; }

  // ==========================================
  // USUARIOS
  // ==========================================
  usuarios: UserList[] = [];
  usuariosPaginados: UserList[] = [];
  paginaUsuarios = 1;
  tamPaginaUsuarios = 5;
  totalPagUsuarios = 1;

  formUsuario!: FormGroup;
  editandoUsuario = false;
  idEditandoUsuario: number | null = null;

  // ==========================================
  // DEPARTAMENTOS
  // ==========================================
  departamentos: DepartamentoListResponse[] = [];
  departamentosPaginados: DepartamentoListResponse[] = [];
  paginaDepartamentos = 1;
  tamPaginaDepartamentos = 5;
  totalPagDepartamentos = 1;

  formDepartamento!: FormGroup;
  editandoDepartamento = false;
  idEditandoDepartamento: number | null = null;

  // ==========================================
  // CIUDADES
  // ==========================================
  ciudades: CiudadResponseList[] = [];
  ciudadesPaginadas: CiudadResponseList[] = [];
  paginaCiudades = 1;
  tamPaginaCiudades = 5;
  totalPagCiudades = 1;

  formCiudad!: FormGroup;
  editandoCiudad = false;
  idEditandoCiudad: number | null = null;

  roles = [
    ['Administrador', 'admin'],
    ['Empleado', 'empleado'],
    ['Productor', 'productor'],
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private departamentoService: DepartamentoService,
    private ciudadService: CiudadService,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.crearFormularios();
    this.obtenerUsuarios();
    this.obtenerDepartamentos();
    this.obtenerCiudades();
  }

  // ==========================================
  // FORMULARIOS
  // ==========================================
  crearFormularios() {
    this.formUsuario = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password_confirmation: [''],
      rol: ['', Validators.required],
    });

    this.formDepartamento = this.fb.group({
      nombre: ['', Validators.required],
    });

    this.formCiudad = this.fb.group({
      nombre: ['', Validators.required],
      departamento_id: ['', Validators.required],
    });
  }

  // ==========================================
  // USUARIOS
  // ==========================================
  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (resp) => {
        this.usuarios = resp;
        this.actualizarPaginacionUsuarios();
      },
      error: () => this.notificacion.error('Error al cargar usuarios'),
    });
  }

  actualizarPaginacionUsuarios() {
    this.totalPagUsuarios = Math.ceil(this.usuarios.length / this.tamPaginaUsuarios);
    this.paginaUsuarios = Math.min(this.paginaUsuarios, this.totalPagUsuarios || 1);
    const inicio = (this.paginaUsuarios - 1) * this.tamPaginaUsuarios;
    this.usuariosPaginados = this.usuarios.slice(inicio, inicio + this.tamPaginaUsuarios);
  }

  enviarUsuario() {
    // Validadores dinámicos
    if (this.editandoUsuario) {
      this.formUsuario.get('password')?.clearValidators();
      this.formUsuario.get('password_confirmation')?.clearValidators();
    } else {
      this.formUsuario.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.formUsuario.get('password_confirmation')?.setValidators([Validators.required]);
    }

    this.formUsuario.get('password')?.updateValueAndValidity();
    this.formUsuario.get('password_confirmation')?.updateValueAndValidity();

    if (this.formUsuario.invalid) {
      this.notificacion.warning('Debes completar todos los campos obligatorios');
      return;
    }

    let dto = { ...this.formUsuario.value };

    if (this.editandoUsuario && !dto.password) {
      delete dto.password;
      delete dto.password_confirmation;
    }

    // EDITAR
    if (this.editandoUsuario && this.idEditandoUsuario !== null) {
      this.usuarioService.actualizarUsuario(this.idEditandoUsuario, dto).subscribe({
        next: () => {
          this.notificacion.success('Usuario actualizado correctamente');
          this.obtenerUsuarios();
          this.cancelarEdicionUsuario();
        },
        error: (err) => {
          this.notificacion.error(err.error?.message || 'Error al actualizar usuario');
        }
      });
      return;
    }

    // CREAR
    this.usuarioService.crearUsuario(dto).subscribe({
      next: () => {
        this.notificacion.success('Usuario creado correctamente');
        this.obtenerUsuarios();
        this.formUsuario.reset();
      },
      error: (err) => {
        this.notificacion.error(err.error?.message || 'Error al crear usuario');
      }
    });
  }

  editarUsuario(u: UserList) {
    this.editandoUsuario = true;
    this.idEditandoUsuario = u.id;

    this.formUsuario.patchValue({
      name: u.name,
      email: u.email,
      password: '',
      password_confirmation: '',
      rol: u.rol,
    });
  }

  cancelarEdicionUsuario() {
    this.editandoUsuario = false;
    this.idEditandoUsuario = null;
    this.formUsuario.reset();
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.notificacion.success('Usuario eliminado correctamente');
        this.obtenerUsuarios();
      },
      error: () => this.notificacion.error('Error al eliminar usuario')
    });
  }

  // ==========================================
  // DEPARTAMENTOS
  // ==========================================
  obtenerDepartamentos() {
    this.departamentoService.obtenerDepartamentos().subscribe({
      next: (resp) => {
        this.departamentos = resp;
        this.actualizarPaginacionDepartamentos();
      },
      error: () => this.notificacion.error('Error al cargar departamentos'),
    });
  }

  actualizarPaginacionDepartamentos() {
    this.totalPagDepartamentos = Math.ceil(this.departamentos.length / this.tamPaginaDepartamentos);
    this.paginaDepartamentos = Math.min(this.paginaDepartamentos, this.totalPagDepartamentos || 1);
    const inicio = (this.paginaDepartamentos - 1) * this.tamPaginaDepartamentos;
    this.departamentosPaginados = this.departamentos.slice(inicio, inicio + this.tamPaginaDepartamentos);
  }

  enviarDepartamento() {
    if (this.formDepartamento.invalid) {
      this.notificacion.warning('El nombre del departamento es obligatorio');
      return;
    }

    const dto: DepartamentoDTO = this.formDepartamento.value;

    // EDITAR
    if (this.editandoDepartamento && this.idEditandoDepartamento !== null) {
      this.departamentoService.actualizarDepartamentoPorId(this.idEditandoDepartamento, dto).subscribe({
        next: () => {
          this.notificacion.success('Departamento actualizado');
          this.obtenerDepartamentos();
          this.cancelarEdicionDepartamento();
        },
        error: () => this.notificacion.error('Error al actualizar departamento')
      });
      return;
    }

    // CREAR
    this.departamentoService.crearDepartamento(dto).subscribe({
      next: () => {
        this.notificacion.success('Departamento creado');
        this.obtenerDepartamentos();
        this.formDepartamento.reset();
      },
      error: () => this.notificacion.error('Error al crear departamento'),
    });
  }

  editarDepartamento(d: DepartamentoListResponse) {
    this.editandoDepartamento = true;
    this.idEditandoDepartamento = d.id;
    this.formDepartamento.patchValue({ nombre: d.nombre });
  }

  cancelarEdicionDepartamento() {
    this.editandoDepartamento = false;
    this.idEditandoDepartamento = null;
    this.formDepartamento.reset();
  }

  eliminarDepartamento(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este departamento?')) return;

    this.departamentoService.eliminarDepartamentoPorId(id).subscribe({
      next: () => {
        this.notificacion.success('Departamento eliminado');
        this.obtenerDepartamentos();
      },
      error: () => this.notificacion.error('Error al eliminar departamento'),
    });
  }

  // ==========================================
  // CIUDADES
  // ==========================================
  obtenerCiudades() {
    this.ciudadService.obtenerCiudades().subscribe({
      next: (resp) => {
        this.ciudades = resp;
        this.actualizarPaginacionCiudades();
      },
      error: () => this.notificacion.error('Error al cargar ciudades'),
    });
  }

  actualizarPaginacionCiudades() {
    this.totalPagCiudades = Math.ceil(this.ciudades.length / this.tamPaginaCiudades);
    this.paginaCiudades = Math.min(this.paginaCiudades, this.totalPagCiudades || 1);
    const inicio = (this.paginaCiudades - 1) * this.tamPaginaCiudades;
    this.ciudadesPaginadas = this.ciudades.slice(inicio, inicio + this.tamPaginaCiudades);
  }

  enviarCiudad() {
    if (this.formCiudad.invalid) {
      this.notificacion.warning('Todos los campos de ciudad son obligatorios');
      return;
    }

    const dto: CiudadDTO = this.formCiudad.value;

    // EDITAR
    if (this.editandoCiudad && this.idEditandoCiudad !== null) {
      this.ciudadService.actualizarCiudadPorId(this.idEditandoCiudad, dto).subscribe({
        next: () => {
          this.notificacion.success('Ciudad actualizada');
          this.obtenerCiudades();
          this.cancelarEdicionCiudad();
        },
        error: () => this.notificacion.error('Error al actualizar ciudad'),
      });
      return;
    }

    // CREAR
    this.ciudadService.crearCiudad(dto).subscribe({
      next: () => {
        this.notificacion.success('Ciudad creada');
        this.obtenerCiudades();
        this.formCiudad.reset();
      },
      error: () => this.notificacion.error('Error al crear ciudad'),
    });
  }

  editarCiudad(c: CiudadResponseList) {
    this.editandoCiudad = true;
    this.idEditandoCiudad = c.id;
    this.formCiudad.patchValue({
      nombre: c.nombre,
      departamento_id: c.departamento_id,
    });
  }

  cancelarEdicionCiudad() {
    this.editandoCiudad = false;
    this.idEditandoCiudad = null;
    this.formCiudad.reset();
  }

  eliminarCiudad(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta ciudad?')) return;

    this.ciudadService.eliminarCiudadPorId(id).subscribe({
      next: () => {
        this.notificacion.success('Ciudad eliminada');
        this.obtenerCiudades();
      },
      error: () => this.notificacion.error('Error al eliminar ciudad'),
    });
  }

  // ==========================================
  // CAMBIAR PÁGINA
  // ==========================================
  cambiarPagina(tab: string, pagina: number) {
    if (pagina < 1) return;

    if (tab === 'usuarios') {
      if (pagina > this.totalPagUsuarios) return;
      this.paginaUsuarios = pagina;
      this.actualizarPaginacionUsuarios();
    }

    if (tab === 'departamentos') {
      if (pagina > this.totalPagDepartamentos) return;
      this.paginaDepartamentos = pagina;
      this.actualizarPaginacionDepartamentos();
    }

    if (tab === 'ciudades') {
      if (pagina > this.totalPagCiudades) return;
      this.paginaCiudades = pagina;
      this.actualizarPaginacionCiudades();
    }
  }
}
