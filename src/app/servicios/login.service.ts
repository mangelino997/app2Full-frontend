import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class LoginService {
  private URL:string;
  public logueado:boolean = false;
  constructor(private http: Http, private appServicio: AppService){
    this.URL = this.appServicio.getIP();
  }
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
