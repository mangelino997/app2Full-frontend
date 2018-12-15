import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class SubopcionPestaniaService {
  //Define la ruta al servicio web
  private ruta:string = "/subopcionpestania";
  //Define la url base
  private url:string = null;
  //Define los valores de la cabecera
  private options = null;
  //Constructor
  constructor(private http: Http, private appService: AppService) {
    //Establece la url base
    this.url = this.appService.getUrlBase() + this.ruta;
    //Inicializa el header con el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({ headers: headers });
  }
  //Obtiene las pestania por rol y subopcion
  public listarPorRolSubopcion(idRol, idSubopcion) {
    return this.http.get(this.url + '/listarPorRolSubopcion/' + idRol + '/' + idSubopcion, this.options);
  }
  //Obtiene las pestanias por rol y subopcion para actualizar estado mostrar
  public obtenerPestaniasPorRolYSubopcion(idRol, idSubopcion) {
    return this.http.get(this.url + '/obtenerPestaniasPorRolYSubopcion/' + idRol + '/' + idSubopcion, this.options);
  }
  //Actualiza un registro
  public actualizar(elemento) {
    return this.http.put(this.url, elemento, this.options);
  }
  /*
  * Asigna todas las pestanias a cada una de las subopciones, eliminando todo los
  * datos y reestableciendo desde cero
  */
  public reestablecerTablaDesdeCero() {
    return this.http.get(this.url + '/reestablecerTablaDesdeCero', this.options);
  }
}
