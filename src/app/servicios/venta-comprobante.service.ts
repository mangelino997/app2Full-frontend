import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class VentaComprobanteService {
  //Define la ruta al servicio web
  private ruta: string = "/ventacomprobante";
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
  //inicializa el componente
  public inicializarFactura(idEmpresa, idSucursal) {
    return this.http.get(this.url + '/inicializarFactura/' + idEmpresa + '/' + idSucursal, this.options);
  }
  //inicializa el componente
  public inicializarNotaCredito(idEmpresa, idSucursal) {
    return this.http.get(this.url + '/inicializarNotaCredito/' + idEmpresa + '/' + idSucursal, this.options);
  }
  //inicializa el componente
  public inicializarFacturacionConsulta(idEmpresa, idSucursal) {
    return this.http.get(this.url + '/inicializarFacturacionConsulta/' + idEmpresa + '/' + idSucursal, this.options);
  }
  //Obtiene por tipo Comprobante, puntoVenta, letra, numero, 
  public obtener(punto, letra, numero, idTipoComprobante) {
    return this.http.get(this.url + '/obtener/' + punto + '/' + letra + '/' + numero + '/' + idTipoComprobante, this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene la lista de letras
  public listarLetras() {
    return this.http.get(this.url + '/listarLetras', this.options);
  }
  //Obtiene una lista de registros por filtros
  public listarPorFiltros(elemento) {
    return this.http.post(this.url + '/listarPorFiltros', elemento, this.options);
  }
  //Obtiene la lista de registros
  public listarPorClienteYEmpresa(idCliente, idEmpresa) {
    return this.http.get(this.url + '/listarPorClienteYEmpresa/' + idCliente + '/' + idEmpresa, this.options);
  }
  //Obtiene la lista de registros para nota de credito
  public listarParaCreditosPorClienteYEmpresa(idCliente, idEmpresa) {
    return this.http.get(this.url + '/listarParaCreditosPorClienteYEmpresa/' + idCliente + '/' + idEmpresa, this.options);
  }
  //Obtiene un listado por alias
  public listarPorAlias(alias) {
    return this.http.get(this.url + '/listarPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obitene lista por empresa y cliente
  public listarParaCobranza(idCliente, idEmpresa) {
    return this.http.get(this.url + '/listarParaCobranza/' + idCliente + '/' + idEmpresa, this.options);
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
