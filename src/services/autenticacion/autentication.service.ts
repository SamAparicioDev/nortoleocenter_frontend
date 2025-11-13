import { UserLogin, UserRegister } from './../../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/dev';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  private http;

  constructor(http : HttpClient)
  {
    this.http = http;
  }

  login(userLogin : UserLogin){
    return this.http.post(`${environment.apiUrl}/login`, userLogin);
  }

  register(user: UserRegister){
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  logout(){
    return this.http.post(`${environment.apiUrl}/logout`,{});
  }
}
