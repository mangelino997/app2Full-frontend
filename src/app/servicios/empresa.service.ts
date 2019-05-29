import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class EmpresaService {
  //Define la ruta al servicio web
  private ruta:string = "/empresa";
  //Define la url base
  private url:string = null;
  //Define la url para subcripcion a socket
  private topic:string = null;
  //Define el headers y token de autenticacion
  private options = null;
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
  //Obtiene la lista de registros
  public listarPorRazonSocialYCAEAHabilitado(empresa) {
    return this.http.get(this.url + '/listarPorRazonSocialYCAEAHabilitado/' + empresa, this.options);
  }
  //Obtiene la lista de registros
  public listarPorRazonSocialYActiva(empresa) {
    return this.http.get(this.url + '/listarPorRazonSocialYActiva/' + empresa, this.options);
  }
  //Obtiene la lista de registros - empresas activas
  public listarActivas() {
    return this.http.get(this.url + '/listarActivas', this.options);
  }
  //Obtiene la lista de registros
  public listarPorRazonSocialYActivaYFe(empresa) {
    return this.http.get(this.url + '/listarPorRazonSocialYActivaYFe/' + empresa, this.options);
  }
  //Obtiene la lista de registros
  public listarEmpresasPorUsuario(usuario) {
    return this.http.get(this.url + '/listarEmpresasPorUsuario/' + usuario, this.options);
  }
  //Obtiene una lista por razon social
  public listarPorRazonSocial(razonSocial) {
    return this.http.get(this.url + '/listarPorRazonSocial/' + razonSocial, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
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
