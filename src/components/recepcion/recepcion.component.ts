import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecepcionService } from '../../services/recepcion/recepcion.service';
import { EnvioService } from '../../services/envio/envio.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { RecepcionData, RecepcionDTO, EnvioData } from '../../models/Recepcion';

@Component({
  selector: 'app-recepcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css'],
})
export class RecepcionComponent implements OnInit {
  recepciones: RecepcionData[] = [];
  recepcionesPaginadas: RecepcionData[] = [];
  cargando = false;
  usuarioAutenticado!: { rol: string }; // solo necesitamos el rol
  envios: EnvioData[] = [];
  envioSeleccionado!: EnvioData | null;

  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  formRecepcion!: FormGroup;
  editando = false;
  idEditando: number | null = null;

  constructor(
    private fb: FormBuilder,
    private recepcionService: RecepcionService,
    private envioService: EnvioService,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.crearFormulario();
    this.obtenerEnvios();
    this.obtenerRecepciones();
  }

  crearFormulario() {
    this.formRecepcion = this.fb.group({
      envio: [null],
      precio_kg: ['', [Validators.required, Validators.min(1)]],
      peso_recibido_kg: ['', [Validators.required, Validators.min(0.01)]],
    });
  }
  private obtenerUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.usuarioAutenticado = JSON.parse(userData);
    } else {
      this.usuarioAutenticado = { rol: 'invitado' }; // rol por defecto si no hay user
    }
  }
  obtenerEnvios() {
    this.envioService.obtenerMisEnvios().subscribe({
      next: (resp) =>
        (this.envios = resp.filter((e) => e.estado === 'enviado')),
      error: () => this.notificacion.error('Error cargando envíos'),
    });
  }

  obtenerRecepciones() {
    this.cargando = true;
    this.recepcionService.obtenerRecepciones().subscribe({
      next: (resp) => {
        this.recepciones = resp;
        this.totalPaginas = Math.ceil(
          this.recepciones.length / this.itemsPorPagina
        );
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.notificacion.error('Error cargando recepciones');
      },
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.recepcionesPaginadas = this.recepciones.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  enviarFormulario() {
    if (this.formRecepcion.invalid) {
      this.notificacion.warning('Completa todos los campos');
      return;
    }

    const dto: RecepcionDTO = this.formRecepcion.value;

    if (this.editando && this.idEditando) {
      this.actualizarRecepcion(dto);
    } else {
      this.crearRecepcion(dto);
    }
  }

  private crearRecepcion(dto: RecepcionDTO) {
    this.recepcionService.crearRecepcion(dto).subscribe({
      next: () => {
        this.envioService
          .cambiarEstadoEnvio(dto.envio_id, 'recibido')
          .subscribe({
            next: () => {
              this.obtenerRecepciones();
              this.formRecepcion.reset();
              this.envioSeleccionado = null;
              this.notificacion.success('Recepción registrada');
            },
            error: () =>
              this.notificacion.error(
                'Recepción creada, pero no se actualizó el envío'
              ),
          });
      },
      error: () => this.notificacion.error('Error creando la recepción'),
    });
  }

  private actualizarRecepcion(dto: RecepcionDTO) {
    if (!this.idEditando) return;
    this.recepcionService.actualizarRecepcion(this.idEditando, dto).subscribe({
      next: () => {
        this.obtenerRecepciones();
        this.editando = false;
        this.idEditando = null;
        this.envioSeleccionado = null;
        this.formRecepcion.reset();
        this.notificacion.success('Recepción actualizada');
      },
      error: () => this.notificacion.error('Error actualizando la recepción'),
    });
  }

  editar(recepcion: RecepcionData) {
    this.editando = true;
    this.idEditando = recepcion.id;

    // Guardamos el envio actual para mostrarlo
    this.envioSeleccionado = recepcion.envio;

    // Solo llenamos los campos que se pueden editar
    this.formRecepcion.patchValue({
      precio_kg: recepcion.precio_kg,
      peso_recibido_kg: parseFloat(recepcion.peso_recibido_kg),
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.envioSeleccionado = null;
    this.formRecepcion.reset();
    this.notificacion.warning('Edición cancelada');
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta recepción?')) return;
    this.recepcionService.eliminarRecepcion(id).subscribe({
      next: () => {
        this.obtenerRecepciones();
        this.notificacion.success('Recepción eliminada');
      },
      error: () => this.notificacion.error('Error eliminando la recepción'),
    });
  }
}
