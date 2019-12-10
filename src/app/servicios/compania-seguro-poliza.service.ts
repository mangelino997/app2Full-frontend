import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class CompaniaSeguroPolizaService {
  //Define la ruta al servicio web
  private ruta: string = "/companiaseguropoliza";
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
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene la poliza por id
  public obtenerPorId(id) {
    return this.http.get(this.url + '/obtenerPorId/' + id, this.options);
  }
  //Obtiene un listado por empresa
  public listarPorEmpresa(id) {
    return this.http.get(this.url + '/listarPorEmpresa/' + id, this.options);
  }
  //Obtiene un listado por compania de seguro
  public listarPorCompaniaSeguro(id) {
    return this.http.get(this.url + '/listarPorCompaniaSeguro/' + id, this.options);
  }
  //Obtiene por compania de seguro y empresa
  public listarPorCompaniaSeguroYEmpresa(idCompaniaSeguro, idEmpresa) {
    return this.http.get(this.url + '/listarPorCompaniaSeguroYEmpresa/' + idCompaniaSeguro + '/' + idEmpresa, this.options);
  }
  //Obtiene por nombre de compania de seguro
  public listarPorCompaniaSeguroNombre(nombre) {
    return this.http.get(this.url + '/listarPorCompaniaSeguroNombre/' + nombre, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene todos los listados
  public inicializar(idRol, idSubopcion) {
    return this.http.get(this.url + '/inicializar/' + idRol + '/' + idSubopcion, this.options);
  }
  //Agrega un registro
  public agregar(formulario) {
    let obj = Object.assign({}, formulario);
    let pdf = obj.pdf;
    const formData = new FormData();
    if (pdf.nombre == null) {
      let blob = new Blob([null], { type: 'application/pdf' });
      formData.append('archivo', blob, '');
    } else {
      let blob = new Blob([pdf.datos], { type: 'application/pdf' });
      formData.append('archivo', blob, pdf.nombre);
    }
    obj.pdf = null;
    formData.append('formulario', JSON.stringify(obj));
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
    let obj = Object.assign({}, elemento);
    let pdf = obj.pdf;
    const formData = new FormData();
    if (pdf.nombre == null) {
      let blob = new Blob([null], { type: 'application/pdf' });
      formData.append('archivo', blob, '');
    } else {
      let blob = new Blob([pdf.datos], { type: 'application/pdf' });
      formData.append('archivo', blob, pdf.nombre);
    }
    obj.pdf.datos = null;
    formData.append('formulario', JSON.stringify(obj));
    return fetch(this.url, {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: formData
    });
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}