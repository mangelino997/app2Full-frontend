import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class FotoService {
  //Define la ruta al servicio web
  private ruta:string = "/foto";
  //Define la url base
  private url:string = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Constructor
  constructor(private http: Http, private appService: AppService, private stompService: StompService) {
    //Establece la url base
    this.url = this.appService.getUrlBase() + this.ruta;
    //Establece los headers y el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene por id (NO FUNCIONAL)
  public obtenerFotoPorId(idFoto) {
    return this.http.get(this.url + '/obtenerFotoPorId/' + idFoto, this.options);
  }
  //Obtiene por id (FUNCIONAL)
  public obtenerPorId(idFoto) {
    return this.http.get(this.url + '/obtenerPorId/' + idFoto, this.options);
  }
  //Obtiene una lista
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url, elemento, this.options);
  }
  //Actualiza un registro
  public actualizar(elemento) {
    return this.http.put(this.url, elemento, this.options);
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}
