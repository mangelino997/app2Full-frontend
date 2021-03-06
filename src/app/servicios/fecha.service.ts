import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class FechaService {
  //Define la ruta al servicio web
  private ruta:string = "/fecha";
  //Define la url base
  private url:string = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Constructor
  constructor(private http: Http, private appService: AppService) {
    //Establece la url base
    this.url = this.appService.getUrlBase() + this.ruta;
    //Establece los headers y el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene la fecha actual
  public obtenerFecha() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene la fecha actual
  public obtenerHora() {
    return this.http.get(this.url + '/obtenerHora', this.options);
  }
  //Obtiene una lista de Años (+15)
  public listarAnios(){
    return this.http.get(this.url + '/listarAnios', this.options);
  }
  //Obtiene fecha y hora actual
  public obtenerFechaYHora(){
    return this.http.get(this.url + '/obtenerFechaYHora', this.options);
  }
  //Obtiene lista de anios mas menos uno
  public listarAniosMasMenosUno(){
    return this.http.get(this.url + '/listarAniosMasMenosUno', this.options);
  }
  //Obtiene una lista de Años Ficales
  public listarAnioFiscal(){
    return this.http.get(this.url + '/listarAnioFiscal', this.options);
  }
}
