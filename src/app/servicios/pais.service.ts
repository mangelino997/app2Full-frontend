import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class PaisService {
  URL:string = 'http://localhost:8080/jit/auth';
  constructor(private http: Http){}
  //Obtiene la lista de registros
  public listar() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    const options = new RequestOptions({headers: headers});
    return this.http.get(this.URL + '/pais', options);
  }
  //Agrega un registro
  public agregar(elemento) {
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(this.URL + '/pais', elemento, {headers: headers});
  }
}
