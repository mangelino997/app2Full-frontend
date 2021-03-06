import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class RepartoService {
  //Define la ruta al servicio web
  private ruta: string = "/reparto";
  //Define la url base
  private url: string = null;
  //Define la url para subcripcion a socket
  private topic: string = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Define la lista obtenida por nombre
  private listaPorNombre = null;
  //Define la subcripcion
  private subcripcion: Subscription;
  //Define el mensaje de respuesta a la subcripcion
  private mensaje: Observable<Message>;
  //Define la lista completa
  public listaCompleta: Subject<any> = new Subject<any>();
  //Define la lista completa para la segunda tabla (comprobantes)
  public listaCompletaComp: Subject<any> = new Subject<any>();
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
    this.options = new RequestOptions({ headers: headers });
    //Subcribe al usuario a la lista completa
    this.mensaje = this.stompService.subscribe(this.topic + this.ruta + '/lista');
    this.subcripcion = this.mensaje.subscribe(this.subscribirse);
    //Subcribe al usuario a la lista completa de Planillas
    this.mensaje = this.stompService.subscribe(this.topic + this.ruta + '/listarComprobantes');
    this.subcripcion = this.mensaje.subscribe(this.subscribirseComp);
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Resfresca la lista completa si hay cambios
  public subscribirseComp = (m: Message) => {
    this.listaCompletaComp.next(JSON.parse(m.body));
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene lista si esta Cerrada = 0
  public listarPorEstaCerrada(valor) {
    return this.http.get(this.url + '/listarPorEstaCerrada/' + valor, this.options);
  }
  //Obtiene lista si esta cerrada y empresa
  public listarPorEstaCerradaYEmpresa(estado, idEmpresa) {
    return this.http.get(this.url + '/listarPorEstaCerradaYEmpresa/' + estado + '/' + idEmpresa, this.options);
  }
  //Obtiene la lista de registros
  public listarPorFiltros(filtro) {
    return this.http.put(this.url + '/listarPorFiltros', filtro, this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene registro por idReparto
  public obtenerPorId(idReparto) {
    return this.http.get(this.url + '/obtenerPorId/' + idReparto, this.options);
  }
  //Obtiene la lista de registros
  public listarAbiertosPropios() {
    return this.http.get(this.url + '/listarAbiertosPropios', this.options);
  }
  //Obtiene la lista de registros
  public listarAbiertosTerceros() {
    return this.http.get(this.url + '/listarAbiertosTerceros', this.options);
  }
  //Obtiene la lista de registros
  public listarCerradosPropios() {
    return this.http.get(this.url + '/listarCerradosPropios', this.options);
  }
  //Obtiene la lista de registros
  public listarCerradosTerceros() {
    return this.http.get(this.url + '/listarCerradosTerceros', this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url, elemento, this.options);
  }
  //Actualiza un registro 
  public actualizar(elemento) {
    return this.http.put(this.url, elemento, this.options);
  }
  //Actualiza un registro - cierra un reparto
  public cerrarReparto(reparto) {
    return this.http.put(this.url + '/cerrarReparto', reparto, this.options);
  }
  //Actualiza un registro - recibe un reparto
  public recibirReparto(reparto) {
    return this.http.put(this.url + '/recibirReparto', reparto, this.options);
  }
  //Actualiza un registro
  public abrirReparto(idReparto) {
    return this.http.get(this.url + '/abrirReparto/' + idReparto, this.options);
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}