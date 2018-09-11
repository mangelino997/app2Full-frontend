import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';

@Injectable()
export class PaisService {
  //Define la url base
  private url = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Define la lista obtenida por nombre
  private listaPorNombre = null;
  //Constructor
  constructor(private http: Http, private appService: AppService) {
    //Establece la url base
    this.url = this.appService.getUrlBase();
    //Establece los headers y el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/pais/obtenerSiguienteId', this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url + '/pais', this.options);
  }
  //Obtiene un listado por nombre
  public listarPorNombre(nombre) {
    this.http.get(this.url + '/pais/listarPorNombre/' + nombre, this.options).subscribe(
      res => {
        this.listaPorNombre = res.json();
      },
      err => {
        console.log(err);
      }
    );
    return this.listaPorNombre;
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url + '/pais', elemento, this.options);
  }
  //Actualiza un registro
  public actualizar(elemento) {
    return this.http.put(this.url + '/pais', elemento, this.options);
  }
}
