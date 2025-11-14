import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { Departamento, DepartamentoDTO, DepartamentoListResponse, DepartamentoResponse } from '../../models/Departamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(private HttpClient : HttpClient) { }

  obtenerDepartamentos() : Observable<DepartamentoListResponse[]> {
    return this.HttpClient.get<DepartamentoListResponse[]>(`${environment.apiUrl}/departamentos`);
  }

  obtenerDepartamentoPorId(id: number) : Observable<Departamento> {
    return this.HttpClient.get<Departamento>(`${environment.apiUrl}/departamentos/${id}`);
  }

  crearDepartamento(departamentoDTO : DepartamentoDTO) : Observable<DepartamentoResponse> {
    return this.HttpClient.post<DepartamentoResponse>(`${environment.apiUrl}/departamentos`, departamentoDTO);
  }

  actualizarDepartamentoPorId(id: number, departamentoDTO : DepartamentoDTO) : Observable<DepartamentoResponse> {
    return this.HttpClient.put<DepartamentoResponse>(`${environment.apiUrl}/departamentos/${id}`, departamentoDTO);
  }

  eliminarDepartamentoPorId(id: number): Observable<string> {
    return this.HttpClient.delete<string>(`${environment.apiUrl}/departamentos/${id}`);
  }

}
