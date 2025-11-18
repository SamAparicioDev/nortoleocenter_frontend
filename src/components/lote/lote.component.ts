import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteDTO, LoteResponse } from '../../models/Lote';
import { FincaResponse } from '../../models/Finca';
import { LoteService } from '../../services/lote/lote.service';
import { FincaService } from '../../services/finca/finca.service';

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

  fincas: FincaResponse[] = []; // <--- AQUÍ GUARDAMOS LAS FINCAS

  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  formLote!: FormGroup;
  editando: boolean = false;
  idEditando: number | null = null;

  constructor(
    private loteService: LoteService,
    private fincaService: FincaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerLotes();
    this.obtenerFincas();  // <--- Cargar fincas
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
      error: (err) => console.error("Error cargando fincas:", err)
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
      error: (err) => {
        console.error("Error cargando lotes:", err);
        this.cargando = false;
      }
    });
  }

  enviarFormulario() {
    if (this.formLote.invalid) return;

    const dto: LoteDTO = this.formLote.value;

    if (this.editando && this.idEditando !== null) {
      this.loteService.actualizarLotePorId(this.idEditando, dto).subscribe({
        next: () => {
          this.obtenerLotes();
          this.cancelarEdicion();
        }
      });
    } else {
      this.loteService.crearLote(dto).subscribe({
        next: () => {
          this.obtenerLotes();
          this.formLote.reset();
        }
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
        this.obtenerLotes();
      }
    });
  }
}
