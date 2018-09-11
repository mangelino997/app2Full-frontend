import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class PestaniaService {
  private options = null;
  //Constructor
  constructor(private http: Http, private appService: AppService) {
    //Inicializa el header con el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene las pestania por rol y subopcion
  public listarPorRolSubopcion(idRol, idSubopcion) {
    return this.http.get(this.appService.getUrlBase() + '/subopcionpestania/listarPorRolSubopcion/'
      + idRol + '/' + idSubopcion, this.options);
  }
}
