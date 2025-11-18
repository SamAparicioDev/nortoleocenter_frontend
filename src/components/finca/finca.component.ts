import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FincaService } from '../../services/finca/finca.service';
import { FincaDTO, FincaResponse } from '../../models/Finca';
import { CiudadResponse, CiudadResponseList } from '../../models/Ciudad';
import { CiudadService } from '../../services/ciudad/ciudad.service';

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
  cargando = false;
  ciudades : CiudadResponseList[] = [];

  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 0;

  formFinca!: FormGroup;
  editando = false;
  idEditando: number | null = null;

  constructor(private fb: FormBuilder, private fincaService: FincaService, private ciudadService : CiudadService) {}

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

  obtenerCiudades(){
    this.cargando = true;
    this.ciudadService.obtenerCiudades().subscribe({
      next: (resp : CiudadResponseList[]) => {
        this.ciudades = resp;
        console.log(resp);
        this.cargando = false;
      },
      error: () => {
        console.log("error al cargar ciudades");
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
      error: () => (this.cargando = false),
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
  if (this.formFinca.invalid) return;

  const dto: FincaDTO = this.formFinca.value;

  if (this.editando && this.idEditando !== null) {
    // 🔥 ACTUALIZAR
    this.fincaService.actualizarFincaPorId(this.idEditando, dto).subscribe({
      next: () => {
        this.obtenerFincas();
        this.cancelarEdicion();
      }
    });
  } else {
    // 🔥 CREAR
    this.fincaService.crearFinca(dto).subscribe({
      next: () => {
        this.obtenerFincas();
        this.formFinca.reset();
      }
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
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta finca?')) return;

    this.fincaService.eliminarFincaPorId(id).subscribe({
      next: () => {
        this.obtenerFincas();
      },
    });
  }
}
