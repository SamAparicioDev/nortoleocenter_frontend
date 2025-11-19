import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { EnvioService } from '../../services/envio/envio.service';
import { EnvioDTO } from '../../models/Envio';
import { FincaService } from '../../services/finca/finca.service';
import { FincaResponse } from '../../models/Finca';
import { LoteService } from '../../services/lote/lote.service';
import { LoteResponse } from '../../models/Lote';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
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
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerEnvios();
    this.obtenerMisFincas();
  }

  crearFormulario() {
    this.formEnvio = this.fb.group({
      finca: [null, Validators.required],  // objeto completo
      lote_id: [''],
      peso_kg: ['', Validators.required],
      observaciones: ['', [Validators.required, Validators.maxLength(255)]],
    });

    this.formEnvio.get('finca')?.valueChanges.subscribe((finca: FincaResponse | null) => {
      if (finca) {
        this.obtenerLotesPorFinca(finca.id);
        this.formEnvio.patchValue({ lote_id: '' });
      } else {
        this.lotes = [];
        this.formEnvio.patchValue({ lote_id: '' });
      }
    });
  }

  obtenerMisFincas() {
    this.fincaService.obtenerMisFincas().subscribe({
      next: (resp) => (this.fincas = resp),
      error: () => this.notificacion.error('Error cargando fincas'),
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
      },
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
        error: () => this.notificacion.error('Error al actualizar el envío'),
      });
    } else {
      this.envioService.guardarEnvio(dto).subscribe({
        next: () => {
          this.obtenerEnvios();
          this.formEnvio.reset();
          this.lotes = [];
          this.notificacion.success('Envío registrado correctamente');
        },
        error: () => this.notificacion.error('Error al guardar el envío'),
      });
    }
  }

  editar(envio: EnvioData) {
    this.editando = true;
    this.idEditando = envio.id;

    // Cargar lotes de la finca antes de setear el formulario
    if (envio.finca) {
      this.obtenerLotesPorFinca(envio.finca.id, () => {
        this.formEnvio.setValue({
          finca: envio.finca,
          lote_id: envio.lote_id || '',
          peso_kg: envio.peso_kg,
          observaciones: envio.observaciones,
        });
      });
    } else {
      this.lotes = [];
      this.formEnvio.setValue({
        finca: null,
        lote_id: '',
        peso_kg: envio.peso_kg,
        observaciones: envio.observaciones,
      });
    }
  }

  obtenerLotesPorFinca(fincaId: number, callback?: () => void) {
    this.loteService.obtenerLotesPorFincaId(fincaId).subscribe({
      next: (resp) => {
        this.lotes = resp;
        if (callback) callback();
      },
      error: () => this.notificacion.error('Error cargando lotes'),
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
      error: () => this.notificacion.error('Error al eliminar el envío'),
    });
  }
}
