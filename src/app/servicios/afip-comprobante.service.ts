import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class AfipComprobanteService {
  //Define la ruta al servicio web
  private ruta:string = "/afipcomprobante";
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
  //Obtiene letra por id de quien paga
  public obtenerLetra(condicionIva, idTipoComprobante) {
    return this.http.get(this.url + '/obtenerLetra/' + condicionIva + "/" + idTipoComprobante, this.options);
  }
  //Obtiene letra por codigo de afip
  public obtenerLetraPorCodigoAfip(codigoAfip) {
    return this.http.get(this.url + '/obtenerLetraPorCodigoAfip/' + codigoAfip, this.options);
  }
  //Obtiene CodigoAfip por id de tipoComprobante y letra
  public obtenerCodigoAfip(idTipoComprobante, letra) {
    return this.http.get(this.url + '/obtenerCodigoAfip/' + idTipoComprobante + '/' + letra , this.options);
  }
  //Obtiene Por CodigoAfip por codigo de Afip
  public obtenerPorCodigoAfip(codigoAfip) {
    return this.http.get(this.url + '/obtenerPorCodigoAfip/' + codigoAfip , this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene la lista de todas las letras
  public listarLetras(idTipoComprobante) {
    return this.http.get(this.url + '/listarLetras/' + idTipoComprobante, this.options);
  }
  //Obtiene la lista de registros
  public listarPorTipoComprobante(idTipoComprobante) {
    return this.http.get(this.url + '/listarPorTipoComprobante/' + idTipoComprobante, this.options);
  }
  //Obtiene un listado por nombre
  public listarPorNombre(nombre) {
    return this.http.get(this.url + '/listarPorNombre/' + nombre, this.options).map(res => {
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
