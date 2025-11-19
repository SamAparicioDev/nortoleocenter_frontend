import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { EnvioDTO } from '../../models/Envio';
import { Observable } from 'rxjs';
import { EnvioData } from '../../models/Recepcion';

@Injectable({
  providedIn: 'root',
})
export class EnvioService {
  constructor(private httpClient: HttpClient) {}

  obtenerEnvios(): Observable<EnvioData[]> {
    return this.httpClient.get<EnvioData[]>(`${environment.apiUrl}/envios`);
  }

  obtenerEnvioPorId(id: number): Observable<EnvioData> {
    return this.httpClient.get<EnvioData>(`${environment.apiUrl}/envios/${id}`);
  }

  obtenerMisEnvios(): Observable<EnvioData[]> {
    return this.httpClient.get<EnvioData[]>(`${environment.apiUrl}/mis-envios`);
  }

  guardarEnvio(envio: EnvioDTO): Observable<EnvioData> {
    return this.httpClient.post<EnvioData>(
      `${environment.apiUrl}/envios`,
      envio
    );
  }

  actualizarEnvioPorId(id: number, envio: EnvioDTO): Observable<EnvioData> {
    return this.httpClient.put<EnvioData>(
      `${environment.apiUrl}/envios/${id}`,
      envio
    );
  }

  cambiarEstadoEnvio(id: number, estado: string): Observable<any> {
    return this.httpClient.patch(`${environment.apiUrl}/cambiar-estado-envio/${id}/${estado}`, {
    });
  }

  eliminarEnvioPorId(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/envios/${id}`);
  }
}
