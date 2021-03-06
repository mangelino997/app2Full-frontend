import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class PersonalAdelantoService {
  //Define la ruta al servicio web
  private ruta:string = "/personaladelanto";
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
  public listar(){
    return this.http.get(this.url, this.options);
  }
  //Obtiene la lista de registros por Lote
  public listarLotes(fechaDesde, fechaHasta, idEmpresa){
    return this.http.get(this.url + '/listarLotes/' + fechaDesde + '/' + fechaHasta + '/' + idEmpresa, this.options);
  }
  //Obtiene todos los listados
  public inicializar(idRol, idSubopcion) {
    return this.http.get(this.url + '/inicializar/' + idRol + '/' + idSubopcion, this.options);
  }
  //Obtiene la lista de registros por filtros
  public listarPorFiltros(elemento){
    return this.http.post(this.url + '/listarPorFiltros', elemento , this.options);
  }
  // public listarPorFiltros(idEmpresa, idSucursal, fechaDesde, fechaHasta, adelanto, estado, alias){
  //   return this.http.get(this.url + '/listarPorFiltros/'+idEmpresa+'/'+idSucursal+'/'+fechaDesde+'/'+fechaHasta+'/'+adelanto+'/'+estado+
  //   '/'+alias , this.options);
  // }
  //Obtiene la lista de registros
  public listarCuotas(elemento) {
    return this.http.post(this.url + '/listarCuotas', elemento, this.options);
  }
  //Obtiene la lista diferencia real entre el Total Prestamo que recibe el personal y el total de la suma de importes de las cuotas.
  public obtenerDiferenciaImportes(listaCuotas) {
    return this.http.put(this.url + '/obtenerDiferenciaImportes', listaCuotas, this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    return this.http.post(this.url, elemento, this.options);
  }
  //Agrega un prestamo
  public agregarPrestamo(elemento) {
    return this.http.post(this.url + '/agregarPrestamo', elemento, this.options);
  }
  //Agrega un registro (Lote)
  public agregarLote(elemento) {
    return this.http.post(this.url + '/agregarLote', elemento, this.options);
  }
  //Actualiza un registro
  public actualizar(elemento) {
    return this.http.put(this.url, elemento, this.options);
  }
  //Actualiza un registro
  public anularLote(elemento) {
    return this.http.put(this.url + '/anularLote', elemento, this.options);
  }
  //Anula un registro - un adelanto personal
  public anular(elemento) {
    return this.http.put(this.url + '/anular', elemento, this.options);
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}
