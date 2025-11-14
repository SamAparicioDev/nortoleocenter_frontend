import { Component, OnInit } from '@angular/core';
import { RecepcionData, RecepcionDTO } from '../../models/Recepcion';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecepcionService } from '../../services/recepcion/recepcion.service';

@Component({
  selector: 'app-recepcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {

  recepciones: RecepcionData[] = [];
  recepcionesPaginadas: RecepcionData[] = [];
  cargando: boolean = false;

  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  formRecepcion!: FormGroup;
  editando: boolean = false;
  idEditando: number | null = null;

  constructor(
    private recepcionService: RecepcionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerRecepciones();
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
        this.totalPaginas = Math.ceil(this.recepciones.length / this.itemsPorPagina);
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error cargando recepciones:", err);
        this.cargando = false;
      }
    });
  }

  enviarFormulario() {
    if (this.formRecepcion.invalid) return;

    const dto: RecepcionDTO = this.formRecepcion.value;

    if (this.editando && this.idEditando !== null) {
      this.recepcionService.actualizarRecepcion(this.idEditando, dto).subscribe({
        next: () => {
          this.obtenerRecepciones();
          this.cancelarEdicion();
        }
      });
    } else {
      this.recepcionService.crearRecepcion(dto).subscribe({
        next: () => {
          this.obtenerRecepciones();
          this.formRecepcion.reset();
        }
      });
    }
  }

  editar(recepcion: RecepcionData) {
    this.editando = true;
    this.idEditando = recepcion.id;

    this.formRecepcion.setValue({
      envio_id: recepcion.envio_id,
      precio_kg: recepcion.precio_kg,
      peso_recibido_kg: recepcion.peso_recibido_kg
    });
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.formRecepcion.reset();
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro que deseas eliminar esta recepción?")) return;

    this.recepcionService.eliminarRecepcion(id).subscribe({
      next: () => {
        this.obtenerRecepciones();
      }
    });
  }
}
