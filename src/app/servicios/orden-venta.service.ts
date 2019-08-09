import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class OrdenVentaService {
  //Define la ruta al servicio web
  private ruta:string = "/ordenventa";
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
  //Obtiene un listado por nombre
  public listarPorNombre(nombre) {
    return this.http.get(this.url + '/listarPorNombre/' + nombre, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene el listado por Empresa
  public listarPorEmpresa(id) {
    return this.http.get(this.url + '/listarPorEmpresa/' + id, this.options);
  }
  //Obtiene el listado por Cliente
  public listarPorCliente(id) {
    return this.http.get(this.url + '/listarPorCliente/' + id, this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    console.log(elemento);
    let obj = Object.assign({}, elemento);
    let ordenVentaForm = obj.ordenVenta;
    let clienteOrdenVenta = obj.clienteOrdenVenta;
    let empresaOrdenVenta = obj.empresaOrdenVenta;
    let blob = new Blob([null], {type : 'application/pdf'});
    const formData = new FormData(); 

    formData.append('ordenVenta', blob, ordenVentaForm);
    formData.append('clienteOrdenVenta', blob, clienteOrdenVenta);
    formData.append('empresaOrdenVenta', blob, empresaOrdenVenta);
    formData.append('personal', JSON.stringify(obj));
    console.log(obj);
		return fetch(this.url, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: formData
    });
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
