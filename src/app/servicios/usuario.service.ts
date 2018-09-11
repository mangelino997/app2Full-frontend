import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class UsuarioService {
  private options = null;
  constructor(private appService: AppService, private http: Http) {
    //Inicializa el header con el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene un registro por username
  public obtenerPorUsername(username) {
    return this.http.get(this.appService.getUrlBase() + '/usuario/obtenerPorUsername/' + username, this.options);
  }
  //Obtiene una lista de registros
  public listar() {
    return this.http.get(this.appService.getUrlBase() + '/usuario', this.options);
  }
  //Obtiene un lista de registros por nombre
  public listarPorNombre(nombre) {
    return this.http.get(this.appService.getUrlBase() + '/usuario/listarPorNombre/' + nombre, this.options);
  }
}
