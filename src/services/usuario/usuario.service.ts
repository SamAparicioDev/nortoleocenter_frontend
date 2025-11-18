import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserById } from '../../models/User';
import { environment } from '../../environments/dev';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient : HttpClient) { }

  obtenerUsuarioPorId(id : number) : Observable<UserById>{
    return this.httpClient.get<UserById>(`${environment.apiUrl}/usuarios/${id}`);
  }
}
