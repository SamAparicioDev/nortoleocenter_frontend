import { Component, OnInit } from '@angular/core';
import { RecepcionData, RecepcionDTO } from '../../models/Recepcion';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecepcionService } from '../../services/recepcion/recepcion.service';
import { EnvioService } from '../../services/envio/envio.service';
import { EnvioData } from '../../models/Envio';
import { NotificacionService } from '../../services/notificacion/notificacion.service'; // <-- IMPORTANTE

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
  cargando: boolean = false;
  envios: EnvioData[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  formRecepcion!: FormGroup;
  editando: boolean = false;
  idEditando: number | null = null;

  constructor(
    private recepcionService: RecepcionService,
    private envioService: EnvioService,
    private fb: FormBuilder,
    private notificacion: NotificacionService // <-- SERVICIO
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerRecepciones();
    this.obtenerEnvios();
  }

  obtenerEnvios() {
    this.envioService.obtenerMisEnvios().subscribe({
      next: (response) => {
        this.envios = response.filter((e) => e.estado === 'enviado');
      },
      error: () => {
        this.notificacion.error('Error cargando envíos disponibles');
      },
    });
  }

  crearFormulario() {
    this.formRecepcion = this.fb.group({
      envio_id: ['', Validators.required],
      precio_kg: ['', Validators.required],
      peso_recibido_kg: ['', Validators.required],
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

  obtenerRecepciones(): void {
    this.cargando = true;

    this.recepcionService.obtenerRecepciones().subscribe({
      next: (resp: RecepcionData[]) => {
        this.recepciones = resp;
        this.totalPaginas = Math.ceil(
          this.recepciones.length / this.itemsPorPagina
        );
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: (err) => {
        this.notificacion.error('Error cargando recepciones');
        this.cargando = false;
      },
    });
  }

  enviarFormulario() {
    if (this.formRecepcion.invalid) {
      this.notificacion.warning('Completa todos los campos obligatorios');
      return;
    }

    const dto: RecepcionDTO = this.formRecepcion.value;

    if (this.editando && this.idEditando !== null) {
      // 🔥 ACTUALIZAR RECEPCIÓN
      this.recepcionService.actualizarRecepcion(this.idEditando, dto).subscribe({
        next: () => {
          this.obtenerRecepciones();
          this.cancelarEdicion();
          this.notificacion.success('Recepción actualizada correctamente');
        },
        error: () => {
          this.notificacion.error('Error actualizando la recepción');
        },
      });
    } else {
      // 🔥 CREAR RECEPCIÓN + actualizar estado del envío
      this.recepcionService.crearRecepcion(dto).subscribe({
        next: () => {
          this.envioService.cambiarEstadoEnvio(dto.envio_id, 'recibido').subscribe({
            next: () => {
              this.obtenerRecepciones();
              this.formRecepcion.reset();
              this.notificacion.success('Recepción registrada correctamente');
            },
            error: () => {
              this.notificacion.error('Recepción creada, pero falló actualizar el estado del envío');
            },
          });
        },
        error: () => {
          this.notificacion.error('Error creando la recepción');
        },
      });
    }
  }

  editar(recepcion: RecepcionData) {
    this.editando = true;
    this.idEditando = recepcion.id;

    this.formRecepcion.setValue({
      envio_id: recepcion.envio_id,
      precio_kg: recepcion.precio_kg,
      peso_recibido_kg: recepcion.peso_recibido_kg,
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.formRecepcion.reset();
    this.notificacion.warning('Edición cancelada');
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta recepción?')) return;

    this.recepcionService.eliminarRecepcion(id).subscribe({
      next: () => {
        this.obtenerRecepciones();
        this.notificacion.success('Recepción eliminada correctamente');
      },
      error: () => {
        this.notificacion.error('Error eliminando la recepción');
      },
    });
  }
}
