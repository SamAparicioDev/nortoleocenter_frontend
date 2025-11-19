import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  envios: EnvioData[] = [];

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
    this.crearFormulario();
    this.obtenerEnvios();
    this.obtenerRecepciones();
  }

  crearFormulario() {
    this.formRecepcion = this.fb.group({
      envio_id: [null, Validators.required],
      precio_kg: ['', [Validators.required, Validators.min(1)]],
      peso_recibido_kg: ['', [Validators.required, Validators.min(1)]],
    });
  }
obtenerEnvios() {
  this.envioService.obtenerMisEnvios().subscribe({
    next: (resp) => {
      this.envios = resp
        .filter(e => e.estado === 'enviado')
        .map(e => ({
          ...e,
          peso_kg: String(e.peso_kg), 
          productor: e.productor,
          finca: e.finca ?? null,
          lote: e.lote ?? null
        }));
    },
    error: () => {
      this.notificacion.error('Error cargando envíos disponibles');
    },
  });
}



  obtenerRecepciones() {
    this.cargando = true;
    this.recepcionService.obtenerRecepciones().subscribe({
      next: (resp: RecepcionData[]) => {
        this.recepciones = resp;
        this.totalPaginas = Math.ceil(this.recepciones.length / this.itemsPorPagina);
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
      this.notificacion.warning('Completa todos los campos del formulario');
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
        this.envioService.cambiarEstadoEnvio(dto.envio_id, 'recibido').subscribe({
          next: () => {
            this.obtenerRecepciones();
            this.formRecepcion.reset();
            this.notificacion.success('Recepción registrada correctamente');
          },
          error: () => {
            this.notificacion.error('Recepción creada, pero no se actualizó el envío');
          },
        });
      },
      error: () => {
        this.notificacion.error('Error creando la recepción');
      },
    });
  }

  private actualizarRecepcion(dto: RecepcionDTO) {
    if (!this.idEditando) return;
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
  }

  editar(recepcion: RecepcionData) {
    this.editando = true;
    this.idEditando = recepcion.id;

    this.formRecepcion.patchValue({
      envio_id: recepcion.envio_id,
      precio_kg: recepcion.precio_kg,
      peso_recibido_kg: parseFloat(recepcion.peso_recibido_kg),
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
