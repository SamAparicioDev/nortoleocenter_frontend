import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteDTO, LoteResponse } from '../../models/Lote';
import { FincaResponse } from '../../models/Finca';
import { LoteService } from '../../services/lote/lote.service';
import { FincaService } from '../../services/finca/finca.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit {

  lotes: LoteResponse[] = [];
  lotesPaginados: LoteResponse[] = [];
  cargando: boolean = false;

  fincas: FincaResponse[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  formLote!: FormGroup;
  editando: boolean = false;
  idEditando: number | null = null;

  constructor(
    private loteService: LoteService,
    private fincaService: FincaService,
    private fb: FormBuilder,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerLotes();
    this.obtenerFincas();
  }

  crearFormulario() {
    this.formLote = this.fb.group({
      finca_id: ['', Validators.required],
      nombre: ['', Validators.required],
      area_m2: ['', Validators.required],
    });
  }

  obtenerFincas() {
    this.fincaService.obtenerMisFincas().subscribe({
      next: (resp) => {
        this.fincas = resp;
      },
      error: () => {
        this.notificacion.error('Error cargando fincas');
      }
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.lotesPaginados = this.lotes.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  obtenerLotes(): void {
    this.cargando = true;

    this.loteService.obtenerLotes().subscribe({
      next: (resp: LoteResponse[]) => {
        this.lotes = resp;
        this.totalPaginas = Math.ceil(this.lotes.length / this.itemsPorPagina);
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.notificacion.error('Error cargando lotes');
        this.cargando = false;
      }
    });
  }

  enviarFormulario() {
    if (this.formLote.invalid) {
      this.notificacion.error('Todos los campos son obligatorios');
      return;
    }

    const dto: LoteDTO = this.formLote.value;

    if (this.editando && this.idEditando !== null) {

      this.loteService.actualizarLotePorId(this.idEditando, dto).subscribe({
        next: () => {
          this.notificacion.success('Lote actualizado correctamente');
          this.obtenerLotes();
          this.cancelarEdicion();
        },
        error: () => this.notificacion.error('Error actualizando lote'),
      });

    } else {

      this.loteService.crearLote(dto).subscribe({
        next: () => {
          this.notificacion.success('Lote creado correctamente');
          this.obtenerLotes();
          this.formLote.reset();
        },
        error: () => this.notificacion.error('Error creando lote'),
      });

    }
  }

  editar(lote: LoteResponse) {
    this.editando = true;
    this.idEditando = lote.id;

    this.formLote.setValue({
      finca_id: lote.finca_id,
      nombre: lote.nombre,
      area_m2: lote.area_m2
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.formLote.reset();
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro que deseas eliminar este lote?")) return;

    this.loteService.eliminarLotePorId(id).subscribe({
      next: () => {
        this.notificacion.warning('Lote eliminado');
        this.obtenerLotes();
      },
      error: () => this.notificacion.error('Error eliminando el lote'),
    });
  }
}
