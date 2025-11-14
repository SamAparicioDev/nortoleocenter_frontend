import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { RecepcionDTO, RecepcionData } from '../../models/Recepcion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  constructor(private httpClient: HttpClient) {}

  // Obtener todas las recepciones
  obtenerRecepciones(): Observable<RecepcionData[]> {
    return this.httpClient.get<RecepcionData[]>(`${environment.apiUrl}/recepciones`);
  }

  // Obtener recepción por ID
  obtenerRecepcionPorId(id: number): Observable<RecepcionData> {
    return this.httpClient.get<RecepcionData>(`${environment.apiUrl}/recepciones/${id}`);
  }

  // Crear nueva recepción
  crearRecepcion(recepcionDTO: RecepcionDTO): Observable<RecepcionData> {
    return this.httpClient.post<RecepcionData>(`${environment.apiUrl}/recepciones`, recepcionDTO);
  }

  // Actualizar recepción
  actualizarRecepcion(id: number, recepcionDTO: RecepcionDTO): Observable<RecepcionData> {
    return this.httpClient.put<RecepcionData>(`${environment.apiUrl}/recepciones/${id}`, recepcionDTO);
  }

  // Eliminar recepción
  eliminarRecepcion(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/recepciones/${id}`);
  }

  // Mis recepciones (si tu API lo usa)
  obtenerMisRecepciones(): Observable<RecepcionData[]> {
    return this.httpClient.get<RecepcionData[]>(`${environment.apiUrl}/mis-recepciones`);
  }
}
