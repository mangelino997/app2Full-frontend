import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class SoporteService {
  //Define la ruta al servicio web
  private ruta:string = "/soporte";
  //Define la url base
  private url:string = null;
  //Define la url para subcripcion a socket
  private topic:string = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Define la lista obtenida por nombre
  private listaPorNombre = null;
  //Define la subcripcion
  private subcripcion: Subscription;
  //Define el mensaje de respuesta a la subcripcion
  private mensaje: Observable<Message>;
  //Define la lista completa
  public listaCompleta:Subject<any> = new Subject<any>();
  //Constructor
  constructor(private http: Http, private appService: AppService, private stompService: StompService) {
    //Establece la url base
    this.url = this.appService.getUrlBase() + this.ruta;
    //Establece la url de subcripcion a socket
    this.topic = this.appService.getTopic();
    //Establece los headers y el token
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
    //Subcribe al usuario a la lista completa
    this.mensaje = this.stompService.subscribe(this.topic + this.ruta + '/lista');
    this.subcripcion = this.mensaje.subscribe(this.subscribirse);
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene un listado por usuario
  public listarPorUsuario(idUsuario) {
    return this.http.get(this.url + '/listarPorUsuario/' + idUsuario, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por usuario
  public listarPorAliasYUsuario(alias, idUsuario) {
    return this.http.get(this.url + '/listarPorAliasYUsuario/' + alias + '/' + idUsuario, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene el listado de submodulos por modulo
  public listarPorModulo(idModulo) {
    return this.http.get(this.url + '/listarPorModulo/' + idModulo, this.options);
  }
  //Agrega un registro
  public agregar(soporte) {
    let obj = Object.assign({}, soporte);
    let foto = obj.bugImagen;
    let blob = new Blob([foto.datos], {type : 'image/jpeg'});
    const formData = new FormData(); 
    formData.append('archivo', blob, foto.nombre);
    obj.bugImagen = null;
    formData.append('soporte', JSON.stringify(obj));
		return fetch(this.url, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem('tokenLesion')
      },
      body: formData
    });

  }
  //Actualiza un registro
  public actualizar(soporte) {
    let obj = Object.assign({}, soporte);
    let idFoto = soporte.bugImagen.id;
    let foto = obj.bugImagen;
    let blob = new Blob([foto.datos], {type : 'image/jpeg'});
    const formData = new FormData(); 
    formData.append('archivo', blob, foto.nombre);
    obj.bugImagen = {};
    obj.bugImagen.id = idFoto;
    formData.append('soporte', JSON.stringify(obj));
		return fetch(this.url, {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('tokenLesion')
      },
      body: formData
    });
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}
