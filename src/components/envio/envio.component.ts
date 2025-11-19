import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { EnvioService } from '../../services/envio/envio.service';
import { EnvioDTO } from '../../models/Envio';
import { FincaService } from '../../services/finca/finca.service';
import { FincaResponse } from '../../models/Finca';
import { LoteService } from '../../services/lote/lote.service';
import { LoteResponse } from '../../models/Lote';
import { NotificacionService } from '../../services/notificacion/notificacion.service'; // <-- IMPORTANTE
import { EnvioData } from '../../models/Recepcion';

@Component({
  selector: 'app-envio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css'],
})
export class EnvioComponent implements OnInit {
  envios: EnvioData[] = [];
  enviosPaginados: EnvioData[] = [];
  cargando = false;

  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 0;

  formEnvio!: FormGroup;
  editando = false;
  idEditando: number | null = null;

  fincas: FincaResponse[] = [];
  lotes: LoteResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private envioService: EnvioService,
    private fincaService: FincaService,
    private loteService: LoteService,
    private notificacion: NotificacionService // <-- INYECTAR SERVICIO
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerEnvios();
    this.obtenerMisFincas();
  }

  crearFormulario() {
    this.formEnvio = this.fb.group({
      finca_id: ['', Validators.required],
      lote_id: [''],
      peso_kg: ['', Validators.required],
      observaciones: ['', [Validators.required, Validators.maxLength(255)]],
    });

    this.formEnvio.get('finca_id')?.valueChanges.subscribe((fincaId) => {
      if (fincaId) this.obtenerLotesPorFinca(fincaId);
      else this.lotes = [];
      this.formEnvio.patchValue({ lote_id: '' });
    });
  }

  obtenerMisFincas() {
    this.fincaService.obtenerMisFincas().subscribe({
      next: (resp) => (this.fincas = resp),
      error: () => {
        this.notificacion.error('Error cargando fincas');
      }
    });
  }

  obtenerLotesPorFinca(fincaId: number) {
    this.loteService.obtenerLotesPorFincaId(fincaId).subscribe({
      next: (resp) => (this.lotes = resp),
      error: () => {
        this.notificacion.error('Error cargando lotes');
      },
    });
  }

  obtenerEnvios() {
    this.cargando = true;
    this.envioService.obtenerEnvios().subscribe({
      next: (resp: EnvioData[]) => {
        this.envios = resp;
        this.totalPaginas = Math.ceil(this.envios.length / this.itemsPorPagina);
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.notificacion.error('Error cargando envíos');
      }
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.enviosPaginados = this.envios.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  enviarFormulario() {
    if (this.formEnvio.invalid) {
      this.notificacion.warning('Completa todos los campos obligatorios');
      return;
    }

    const dto: EnvioDTO = this.formEnvio.value;

    if (this.editando && this.idEditando !== null) {
      this.envioService.actualizarEnvioPorId(this.idEditando, dto).subscribe({
        next: () => {
          this.obtenerEnvios();
          this.cancelarEdicion();
          this.notificacion.success('Envío actualizado correctamente');
        },
        error: (err) => {
          console.error(err);
          this.notificacion.error('Error al actualizar el envío');
        },
      });
    } else {
      this.envioService.guardarEnvio(dto).subscribe({
        next: () => {
          this.obtenerEnvios();
          this.formEnvio.reset();
          this.lotes = [];
          this.notificacion.success('Envío registrado correctamente');
        },
        error: (err) => {
          console.error(err);
          this.notificacion.error('Error al guardar el envío');
        },
      });
    }
  }

  editar(envio: EnvioData) {
    this.editando = true;
    this.idEditando = envio.id;

    this.formEnvio.patchValue({
      finca_id: envio.finca_id,
      lote_id: envio.lote_id,
      peso_kg: envio.peso_kg,
      observaciones: envio.observaciones,
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.formEnvio.reset();
    this.lotes = [];
    this.notificacion.warning('Edición cancelada');
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este envío?')) return;

    this.envioService.eliminarEnvioPorId(id).subscribe({
      next: () => {
        this.obtenerEnvios();
        this.notificacion.success('Envío eliminado correctamente');
      },
      error: () => {
        this.notificacion.error('Error al eliminar el envío');
      }
    });
  }

  marcarComoEnviado(envioId: number) {
    if (!confirm('¿Deseas marcar este envío como enviado?')) return;

    this.envioService.cambiarEstadoEnvio(envioId, 'enviado').subscribe({
      next: () => {
        this.obtenerEnvios();
        this.notificacion.success('Envío marcado como enviado');
      },
      error: () => {
        this.notificacion.error('Error al cambiar el estado');
      }
    });
  }
}
