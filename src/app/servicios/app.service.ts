import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AppService {
  //Define la url base
  private URL_BASE = 'http://localhost:8080/jit/auth';
  //Define la url de subcripcion a socket
  private URL_TOPIC = '/jit/auth/topic';
  //Define el headers y token de autenticacion
  private options = null;
  //Constructor
  constructor(private http: Http) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene el menu
  public obtenerMenu() {
    return this.http.get(this.URL_BASE + '/menu/1', this.options);
  }
  //Obtiene la url base
  public getUrlBase() {
    return this.URL_BASE;
  }
  //Obtiene la url de subcripcion a socket
  public getTopic() {
    return this.URL_TOPIC;
  }
  //Formatear numero a x decimales
  public setDecimales(valor, cantidad) {
    return Number(valor).toFixed(cantidad);
  }
}
