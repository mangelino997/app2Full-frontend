import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class EmpresaService {
  private options = null;
  //Constructor
  constructor(private http: Http, private appService: AppService) {
    //Inicializa el header con el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene un listado de empresas activas del usuario
  public listarEmpresasActivasDeUsuario(idUsuario) {
    return this.http.get(this.appService.getUrlBase() + '/usuarioempresa/listarEmpresasActivasDeUsuario/' + idUsuario, this.options);
  }
}
