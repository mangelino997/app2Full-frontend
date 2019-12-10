import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class PuntoVentaService {
  //Define la ruta al servicio web
  private ruta: string = "/puntoventa";
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
  //Obtiene el Numero por PuntoVenta y codigoAfip
  public obtenerNumero(punto, codigo, sucursal, empresa) {
    return this.http.get(this.url + '/obtenerNumero/' + punto + '/' + codigo + '/'
      + sucursal + '/' + empresa, this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene una lista por sucursal
  public listarPorSucursal(id) {
    return this.http.get(this.url + '/listarPorSucursal/' + id, this.options);
  }
  //Obtiene una lista de habilitados por Sucursal, Empresa y fe
  public listarHabilitadosPorSucursalEmpresaYFe(idSucursal, idEmpresa) {
    return this.http.get(this.url + '/listarHabilitadosPorSucursalEmpresaYFe/' + idSucursal + '/' + idEmpresa, this.options);
  }
  //Obtiene una lista por sucursal y empresa
  public listarPorSucursalYEmpresa(idSucursal, idEmpresa) {
    return this.http.get(this.url + '/listarPorSucursalYEmpresa/' + idSucursal + '/' + idEmpresa, this.options);
  }
  //Obtiene una lista por sucursal y empresa y letra asignada
  public listarPorSucursalYEmpresaLetra(idSucursal, idEmpresa) {
    return this.http.get(this.url + '/listarPorSucursalYEmpresaLetra/' + idSucursal + '/' + idEmpresa, this.options);
  }
  //Obtiene una lista por empresa, sucursal y tipo de comprobante
  public listarPorEmpresaYSucursalYTipoComprobante(idEmpresa, idSucursal, idTipoComprobante) {
    return this.http.get(this.url + '/listarPorEmpresaYSucursalYTipoComprobante/'
      + idEmpresa + '/' + idSucursal + '/' + idTipoComprobante, this.options);
  }
  //Obtiene todos los listados
  public inicializar(idRol, idSubopcion) {
    return this.http.get(this.url + '/inicializar/' + idRol + '/' + idSubopcion, this.options);
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