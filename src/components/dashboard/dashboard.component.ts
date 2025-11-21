import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { EnvioService } from '../../services/envio/envio.service';
import { RecepcionService } from '../../services/recepcion/recepcion.service';

import { EnvioData, RecepcionData } from '../../models/Recepcion';

import { Chart, registerables } from 'chart.js';
import { NgIf } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('enviosCanvas') enviosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('recepcionesCanvas') recepcionesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('estadosCanvas') estadosCanvas!: ElementRef<HTMLCanvasElement>;

  rol = '';
  userId = 0;

  envios: EnvioData[] = [];
  recepciones: RecepcionData[] = [];

  cargando = true;

  private enviosChart?: Chart;
  private recepcionesChart?: Chart;
  private estadosChart?: Chart;

  constructor(
    private envioService: EnvioService,
    private recepcionService: RecepcionService
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('userData');
    const user = raw ? JSON.parse(raw) : null;
    this.rol = user?.rol ?? '';
    this.userId = user?.id ?? 0;

    this.cargarDatosSegunRol();
  }

  ngAfterViewInit(): void {
    // Intenta renderizar cuando los canvas ya existen
    const interval = setInterval(() => {
      if (this.enviosCanvas && this.recepcionesCanvas && this.estadosCanvas) {
        this.renderCharts();
        clearInterval(interval);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private cargarDatosSegunRol() {
    this.cargando = true;

    if (this.rol === 'admin') {
      this.envioService.obtenerEnvios().subscribe(envs => {
        this.envios = envs;

        this.recepcionService.obtenerRecepciones().subscribe(recs => {
          this.recepciones = recs;
          this.cargando = false;
        });
      });
      return;
    }

    if (this.rol === 'empleado') {
      this.envioService.obtenerEnvios().subscribe(envs => {
        this.envios = envs;

        this.recepcionService.obtenerMisRecepciones().subscribe(recs => {
          this.recepciones = recs.filter(r => r.empleado_id === this.userId);
          this.cargando = false;
        });
      });
      return;
    }

    if (this.rol === 'productor') {
      this.envioService.obtenerMisEnvios().subscribe(envs => {
        const propios = envs.filter(e => e.productor_id === this.userId);
        this.envios = propios;

        this.recepciones = propios
          .filter(e => e.estado === 'recibido')
          .map(e => this.crearRecepcionDummyDesdeEnvio(e));

        this.cargando = false;
      });
      return;
    }

    this.envios = [];
    this.recepciones = [];
    this.cargando = false;
  }

  private crearRecepcionDummyDesdeEnvio(envio: EnvioData): RecepcionData {
    return {
      id: envio.id,
      created_at: envio.created_at,
      updated_at: envio.updated_at,
      empleado_id: 0,
      fecha_recepcion: envio.updated_at ?? envio.fecha_envio,
      precio_kg: 0,
      total: 0,
      envio_id: envio.id,
      peso_recibido_kg: envio.peso_kg,
      total_kg_perdidos: '0',
      empleado: {
        id: 0,
        name: '',
        email: '',
        email_verified_at: null,
        rol: 'empleado',
        created_at: '',
        updated_at: ''
      },
      envio: envio
    };
  }

  private destroyCharts() {
    this.enviosChart?.destroy();
    this.recepcionesChart?.destroy();
    this.estadosChart?.destroy();
  }

  // ---------------- CHART RENDER ----------------

  private renderCharts() {
    if (!this.enviosCanvas || !this.recepcionesCanvas || !this.estadosCanvas) return;

    this.destroyCharts();

    const envAgr = this.agruparPorFecha(this.envios, 'fecha_envio');
    const recAgr = this.agruparPorFecha(this.recepciones, 'fecha_recepcion');
    const estAgr = this.agruparEstados(this.envios);

    this.renderEnviosChart(Object.keys(envAgr), Object.values(envAgr));
    this.renderRecepcionesChart(Object.keys(recAgr), Object.values(recAgr));
    this.renderEstadosChart(Object.keys(estAgr), Object.values(estAgr));
  }

  private renderEnviosChart(labels: string[], values: number[]) {
    const ctx = this.enviosCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.enviosChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Envíos', data: values, borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.08)', fill: true, tension: 0.3 }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private renderRecepcionesChart(labels: string[], values: number[]) {
    const ctx = this.recepcionesCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.recepcionesChart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Recepciones', data: values, backgroundColor: '#4caf50' }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private renderEstadosChart(labels: string[], values: number[]) {
    const ctx = this.estadosCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.estadosChart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private agruparPorFecha(list: any[], field: string): Record<string, number> {
    const map: Record<string, number> = {};
    list.forEach(item => {
      const f = item[field]?.split('T')[0];
      if (f) map[f] = (map[f] || 0) + 1;
    });
    return map;
  }

  private agruparEstados(envios: EnvioData[]): Record<string, number> {
    const map: Record<string, number> = {};
    envios.forEach(e => {
      map[e.estado] = (map[e.estado] || 0) + 1;
    });
    return map;
  }
}
