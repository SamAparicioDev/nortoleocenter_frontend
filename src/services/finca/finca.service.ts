import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { FincaDTO, FincaResponse } from '../../models/Finca';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  constructor(private httpClient: HttpClient) { }

  obtenerFincas(): Observable<FincaResponse[]> {
    return this.httpClient.get<FincaResponse[]>(`${environment.apiUrl}/fincas`);
  }

  obtenerFincaPorId(id: number): Observable<FincaResponse> {
    return this.httpClient.get<FincaResponse>(`${environment.apiUrl}/fincas/${id}`);
  }

  obtenerMisFincas(): Observable<FincaResponse[]> {
    return this.httpClient.get<FincaResponse[]>(`${environment.apiUrl}/mis-fincas`);
  }

  crearFinca(fincaDTO : FincaDTO) : Observable<FincaResponse>{
    return this.httpClient.post<FincaResponse>(`${environment.apiUrl}/fincas`, fincaDTO)
  }

  actualizarFincaPorId(id: number, fincaDTO: FincaDTO): Observable<FincaResponse> {
    return this.httpClient.put<FincaResponse>(`${environment.apiUrl}/fincas/${id}`, fincaDTO);
  }

  eliminarFincaPorId(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/fincas/${id}`);
  }
}
