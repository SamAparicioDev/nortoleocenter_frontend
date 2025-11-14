import { CiudadDTO } from './../../models/Ciudad';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';
import { CiudadResponse } from '../../models/Ciudad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  constructor(private HttpClient : HttpClient) { }


  obtenerCiudades() : Observable<CiudadResponse[]> {
    return this.HttpClient.get<CiudadResponse[]>(`${environment.apiUrl}/ciudades`);
  }

  obtenerCiudadPorId(id: number) : Observable<CiudadResponse> {
    return this.HttpClient.get<CiudadResponse>(`${environment.apiUrl}/ciudades/${id}`);
  }

  crearCiudad(ciudadDTO : CiudadDTO) : Observable<CiudadResponse> {
    return this.HttpClient.post<CiudadResponse>(`${environment.apiUrl}/ciudades`, ciudadDTO);
  }

  actualizarCiudadPorId(id: number, ciudadDTO : CiudadDTO) : Observable<CiudadResponse> {
    return this.HttpClient.put<CiudadResponse>(`${environment.apiUrl}/ciudades/${id}`, ciudadDTO);
  }

  eliminarCiudadPorId(id: number) : Observable<string> {
    return this.HttpClient.delete<string>(`${environment.apiUrl}/ciudades/${id}`);
  }


}
