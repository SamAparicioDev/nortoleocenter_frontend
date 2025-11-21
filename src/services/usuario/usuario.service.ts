import { UserDTO, UserUpdateDTO } from './../../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserById, UserList, UserUpdate } from '../../models/User';
import { environment } from '../../environments/prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient : HttpClient) { }

  obtenerUsuarioPorId(id : number) : Observable<UserById>{
    return this.httpClient.get<UserById>(`${environment.apiUrl}/usuarios/${id}`);
  }

  crearUsuario(userDTO : UserDTO) : Observable<UserUpdate>{
    return this.httpClient.post<UserUpdate>(`${environment.apiUrl}/usuarios`, {userDTO} );
  }

  obtenerUsuarios() : Observable<UserList[]>{
    return this.httpClient.get<UserList[]>(`${environment.apiUrl}/usuarios`);
  }

  actualizarUsuario(id : number, userDTO : UserUpdateDTO) : Observable<UserUpdate>{
    return this.httpClient.put<UserUpdate>(`${environment.apiUrl}/usuarios/${id}`, {userDTO});
  }

  eliminarUsuario(id : number): Observable<String>{
    return this.httpClient.delete<String>(`${environment.apiUrl}/usuarios/${id}`);
  }
}
