import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class LoginService {
  URL:string = 'http://localhost:8080';
  logueado:boolean = false;
  constructor(private http: Http){}
  public getLogueado(): boolean {
    return this.logueado;
  }
  public setLogueado(logueado) {
    this.logueado = logueado;
  }
  public login(username, password) {
    const headers = new Headers({'Content-Type': 'application/json'});
    this.setLogueado(true);
    return this.http.post(this.URL + '/login', {'username': username, 'password': password}, {headers: headers});
  }
}
