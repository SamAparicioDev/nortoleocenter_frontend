import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { RecepcionDTO, RecepcionData, RecepcionResponse } from '../../models/Recepcion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  private baseUrl = `${environment.apiUrl}/recepciones`;

  constructor(private httpClient: HttpClient) {}

  obtenerRecepciones(): Observable<RecepcionData[]> {
    return this.httpClient.get<RecepcionData[]>(this.baseUrl);
  }

  obtenerRecepcionPorId(id: number): Observable<RecepcionData> {
    return this.httpClient.get<RecepcionData>(`${this.baseUrl}/${id}`);
  }

  crearRecepcion(recepcionDTO: RecepcionDTO): Observable<RecepcionResponse> {
    return this.httpClient.post<RecepcionResponse>(this.baseUrl, recepcionDTO);
  }

  actualizarRecepcion(id: number, recepcionDTO: RecepcionDTO): Observable<RecepcionResponse> {
    return this.httpClient.put<RecepcionResponse>(`${this.baseUrl}/${id}`, recepcionDTO);
  }

  eliminarRecepcion(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  obtenerMisRecepciones(): Observable<RecepcionData[]> {
    return this.httpClient.get<RecepcionData[]>(`${this.baseUrl}/mis-recepciones`);
  }
}
