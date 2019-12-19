import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class OrdenVentaEscalaService {
  //Define la ruta al servicio web
  private ruta: string = "/ordenventaescala";
  //Define la url base
  private url: string = null;
  //Define la url para subcripcion a socket
  private topic: string = null;
  //Define el headers y token de autenticacion
  private options = null;
  //Define la subcripcion
  private subcripcion: Subscription;
  //Define el mensaje de respuesta a la subcripcion
  private mensaje: Observable<Message>;
  //Define la lista completa
  public listaCompleta: Subject<any> = new Subject<any>();
  //Define la subcripcion
  private subcripcionEscala: Subscription;
  //Define el mensaje de respuesta a la subcripcion
  private mensajeEscala: Observable<Message>;
  //Define la lista de escalas
  public listaEscalas: Subject<any> = new Subject<any>();
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
    //Subcribe al usuario a la lista de escalas
    this.mensajeEscala = this.stompService.subscribe(this.topic + this.ruta + '/listaEscalas');
    this.subcripcionEscala = this.mensajeEscala.subscribe(this.subscribirseEscala);
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Resfresca la lista de escalas si hay cambios
  public subscribirseEscala = (m: Message) => {
    this.listaEscalas.next(JSON.parse(m.body));
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene el precio flete por id
  // El valor puede ser: bultos, kg, m3
  public obtenerPrecioFlete(id, valor) {
    return this.http.get(this.url + '/obtenerPrecioFlete/' + id + '/' + valor, this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene una lista con escalas tarifas asignadas
  public listarConEscalaTarifa() {
    return this.http.get(this.url + '/listarConEscalaTarifa', this.options);
  }
  //Obtiene una lista por id de Orden Venta
  public listarPorOrdenVenta(id) {
    return this.http.get(this.url + '/listarPorOrdenVenta/' + id, this.options);
  }
  //Obtiene una lista por id de Orden Venta Tarifa
  public listarPorOrdenVentaTarifa(idOrdenVenta, idTipoTarifa) {
    return this.http.get(this.url + '/listarPorOrdenVentaTarifa/' + idOrdenVenta + "/" + idTipoTarifa, this.options);
  }
  //Obtiene una lista de las distintas fechas por id de Orden Venta
  public listarFechasPorOrdenVenta(id) {
    return this.http.get(this.url + '/listarFechasPorOrdenVenta/' + id, this.options);
  }
  //Obtiene una lista por id de Orden Venta y precio Desde (fecha)
  public listarPorOrdenVentaYPreciosDesde(idOrdenVta, precioDesde) {
    return this.http.get(this.url + '/listarPorOrdenVentaYPreciosDesde/' + idOrdenVta + '/' + precioDesde, this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url, elemento, this.options);
  }
  //Agrega una lista como registro
  public agregarLista(elemento) {
    return this.http.post(this.url + '/agregarLista', elemento, this.options);
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