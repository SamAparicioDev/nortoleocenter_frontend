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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerRecepciones();
    this.obtenerEnvios();
  }

  obtenerEnvios() {
    this.envioService.obtenerMisEnvios().subscribe((response) => {
        this.envios = response;
        this.envios = this.envios.filter((e) => e.estado === "pendiente");
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
        console.error('Error cargando recepciones:', err);
        this.cargando = false;
      },
    });
  }

  enviarFormulario() {
    if (this.formRecepcion.invalid) return;

    const dto: RecepcionDTO = this.formRecepcion.value;

    if (this.editando && this.idEditando !== null) {
      // Actualización normal
      this.recepcionService
        .actualizarRecepcion(this.idEditando, dto)
        .subscribe({
          next: () => {
            this.obtenerRecepciones();
            this.cancelarEdicion();
          },
        });
    } else {
      // CREACIÓN: cambiamos el estado del envío a "recibido"
      this.recepcionService.crearRecepcion(dto).subscribe({
        next: () => {
          this.envioService
            .cambiarEstadoEnvio(dto.envio_id, 'recibido')
            .subscribe({
              next: () => {
                console.log('Estado del envío actualizado a recibido');
                this.obtenerRecepciones(); // Solo aquí refrescamos la lista
                this.formRecepcion.reset();
              },
              error: (err) =>
                console.error('Error actualizando estado del envío', err),
            });
        },
        error: (err) => console.error('Error creando la recepción', err),
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
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta recepción?')) return;

    this.recepcionService.eliminarRecepcion(id).subscribe({
      next: () => {
        this.obtenerRecepciones();
      },
      error: (err) => console.error('Error eliminando la recepción', err),
    });
  }
}
