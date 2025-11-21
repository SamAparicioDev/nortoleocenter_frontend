import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FincaService } from '../../services/finca/finca.service';
import { FincaDTO, FincaResponse } from '../../models/Finca';
import { CiudadResponseList } from '../../models/Ciudad';
import { CiudadService } from '../../services/ciudad/ciudad.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-finca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './finca.component.html',
  styleUrls: ['./finca.component.css'],
})
export class FincaComponent implements OnInit {
  fincas: FincaResponse[] = [];
  fincasPaginadas: FincaResponse[] = [];
  ciudades: CiudadResponseList[] = [];
  cargando = false;
  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 0;
  formFinca!: FormGroup;
  editando = false;
  idEditando: number | null = null;

  constructor(
    private fb: FormBuilder,
    private fincaService: FincaService,
    private ciudadService: CiudadService,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerFincas();
    this.obtenerCiudades();
  }

  crearFormulario() {
    this.formFinca = this.fb.group({
      nombre: ['', Validators.required],
      ciudad_id: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  obtenerCiudades() {
    this.cargando = true;
    this.ciudadService.obtenerCiudades().subscribe({
      next: (resp) => {
        this.ciudades = resp;
        this.cargando = false;
      },
      error: () => {
        this.notificacion.error('Error al cargar ciudades');
        this.cargando = false;
      },
    });
  }

  obtenerFincas() {
    this.cargando = true;
    this.fincaService.obtenerMisFincas().subscribe({
      next: (resp: FincaResponse[]) => {
        this.fincas = resp;
        this.totalPaginas = Math.ceil(this.fincas.length / this.itemsPorPagina);
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.notificacion.error('Error al cargar fincas');
        this.cargando = false;
      },
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.fincasPaginadas = this.fincas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  enviarFormulario() {
    if (this.formFinca.invalid) {
      this.notificacion.warning('Completa todos los campos del formulario');
      return;
    }

    const dto: FincaDTO = this.formFinca.value;
    this.cargando = true;

    if (this.editando && this.idEditando !== null) {
      this.fincaService.actualizarFincaPorId(this.idEditando, dto).subscribe({
        next: () => {
          this.obtenerFincas();
          this.cancelarEdicion();
          this.notificacion.success('Finca actualizada correctamente');
          this.cargando = false;
        },
        error: () => {
          this.notificacion.error('Error al actualizar la finca');
          this.cargando = false;
        },
      });
    } else {
      this.fincaService.crearFinca(dto).subscribe({
        next: () => {
          this.obtenerFincas();
          this.formFinca.reset();
          this.notificacion.success('Finca registrada correctamente');
          this.cargando = false;
        },
        error: () => {
          this.notificacion.error('Error al registrar la finca');
          this.cargando = false;
        },
      });
    }
  }

  editar(finca: FincaResponse) {
    this.editando = true;
    this.idEditando = finca.id;

    this.formFinca.patchValue({
      nombre: finca.nombre,
      ciudad_id: finca.ciudad_id,
      direccion: finca.direccion,
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.formFinca.reset();
    this.notificacion.warning('Edición cancelada');
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta finca?')) return;

    this.cargando = true;
    this.fincaService.eliminarFincaPorId(id).subscribe({
      next: () => {
        this.obtenerFincas();
        this.notificacion.success('Finca eliminada correctamente');
        this.cargando = false;
      },
      error: () => {
        this.notificacion.error('Error al eliminar la finca');
        this.cargando = false;
      },
    });
  }
}
