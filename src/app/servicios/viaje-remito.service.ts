import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class ViajeRemitoService {
  //Define la ruta al servicio web
  private ruta: string = "/viajeremito";
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
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene un registro por puntoventa letra y numero
  public obtener(puntoVenta, letra, numero) {
    return this.http.get(this.url + '/obtener/' + puntoVenta + '/' + letra + '/' + numero, this.options);
  }
  //Obtiene un registro por puntoventa letra y numero
  public obtenerParaReparto(puntoVenta, letra, numero) {
    return this.http.get(this.url + '/obtenerParaReparto/' + puntoVenta + '/' + letra + '/' + numero, this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene la lista de letras
  public listarLetras() {
    return this.http.get(this.url + '/listarLetras', this.options);
  }
  //Obtiene la lista de Remito por idTramo y Item
  public listarRemitos(idTramo, idItem) {
    return this.http.get(this.url + '/listarRemitos/' + idTramo + '/' + idItem, this.options);
  }
  //Obtiene una lista por alias
  public listarPorAlias(alias) {
    return this.http.get(this.url + '/listarPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por numero
  public listarPorNumero(numero) {
    return this.http.get(this.url + '/listarPorNumero/' + numero, this.options);
  }
  
  
  //Obtiene una lista de remitos pendientes por sucursal
  public listarPendientesPorSucursal(idSucursal) {
    return this.http.get(this.url + '/listarPendientesPorSucursal/' + idSucursal, this.options);
  }
  //Obtiene una lista de remitos pendientes por sucursal, sucursal destino y numero de camion
  public listarPendientesPorFiltro(idSucursal, idSucursalDestino, numeroCamion) {
    return this.http.get(this.url + '/listarPendientesPorFiltro/' + idSucursal
      + '/' + idSucursalDestino + '/' + numeroCamion, this.options);
  }
  //Obtiene una lista de remitos asignados por viaje tramo
  public listarAsignadosPorViajeTramo(idViajeTramo) {
    return this.http.get(this.url + '/listarAsignadosPorViajeTramo/' + idViajeTramo, this.options);
  }
  //Asigna remitos
  public asignar(elemento, idViajeTramo) {
    let obj = Object.assign([], elemento);
    const formData = new FormData();
    formData.append('elementos', JSON.stringify(obj));
    formData.append('viajeTramo', idViajeTramo);
    return fetch(this.url + '/asignar', {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: formData
    });
  }
  //Quita remitos
  public quitar(elemento, idViajeTramo) {
    let obj = Object.assign([], elemento);
    const formData = new FormData();
    formData.append('elementos', JSON.stringify(obj));
    formData.append('viajeTramo', idViajeTramo);
    return fetch(this.url + '/quitar', {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: formData
    });
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url, elemento, this.options);
  }
  //Obtiene una lista de registros por filtros
  public listarPorFiltros(elemento) {
    return this.http.post(this.url + '/listarPorFiltros', elemento, this.options);
  }
  //Actualiza un registro
  public actualizar(elemento) {
    return this.http.put(this.url, elemento, this.options);
  }
  //Obtiene un listado por numero
  public listarPorViajeYEstado(elemento) {
    return this.http.put(this.url + '/listarPorViajeYEstado', elemento, this.options);
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}