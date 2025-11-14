import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { LoteDTO, LoteResponse } from '../../models/Lote';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  constructor(private httpClient: HttpClient) { }

  obtenerLotes(): Observable<LoteResponse[]> {
    return this.httpClient.get<LoteResponse[]>(`${environment.apiUrl}/lotes`);
  }

  obtenerLotePorId(id: number): Observable<LoteResponse> {
    return this.httpClient.get<LoteResponse>(`${environment.apiUrl}/lotes/${id}`);
  }

  obtenerLotesPorFincaId(fincaId: number): Observable<LoteResponse[]> {
    return this.httpClient.get<LoteResponse[]>(`${environment.apiUrl}/lotes-finca/${fincaId}`);
  }

  crearLote(loteDTO: LoteDTO): Observable<LoteResponse> {
    return this.httpClient.post<LoteResponse>(`${environment.apiUrl}/lotes`, loteDTO);
  }

  actualizarLotePorId(id: number, loteDTO: LoteDTO): Observable<LoteResponse> {
    return this.httpClient.put<LoteResponse>(`${environment.apiUrl}/lotes/${id}`, loteDTO);
  }

  eliminarLotePorId(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/lotes/${id}`);
  }
}
