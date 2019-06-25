import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class VehiculoService {
  //Define la ruta al servicio web
  private ruta:string = "/vehiculo";
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
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene un listado por alias
  public listarPorAlias(alias) {
    return this.http.get(this.url + '/listarPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por alias filtrado por vehiculos no remolque
  public listarPorAliasYRemolqueFalse(alias) {
    return this.http.get(this.url + '/listarPorAliasYRemolqueFalse/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por alias filtrado por vehiculos remolque
  public listarPorAliasYRemolqueTrue(alias) {
    return this.http.get(this.url + '/listarPorAliasYRemolqueTrue/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por empresa, tipo de vehiculo y marca de vehiculo
  public listarFiltro(idEmpresa, idTipo, idMarca) {
    return this.http.get(this.url + '/listarFiltro/' + idEmpresa + '/' + idTipo + '/' + idMarca,
      this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    let obj = Object.assign({}, elemento);
    let tituloFile = obj.pdfTitulo;
    let cedulaIdentFile = obj.pdfCedulaIdent;
    let vtoRutaFile = obj.pdfVtoRuta;
    let vtoInspTecnicaFile = obj.pdfVtoInspTecnica;
    let vtoSenasaFile = obj.pdfVtoSenasa;
    let habBromatFile = obj.pdfHabBromat;
    
    let blob = new Blob([tituloFile.datos], {type : 'image/jpeg'});
    const formData = new FormData(); 
    formData.append('titulo', blob, tituloFile.nombre);
    blob = new Blob([cedulaIdentFile.datos], {type : 'image/jpeg'});
    formData.append('cedulaIdent', blob, cedulaIdentFile.nombre);
    blob = new Blob([vtoRutaFile.datos], {type : 'image/jpeg'});
    formData.append('vtoRuta', blob, vtoRutaFile.nombre);
    blob = new Blob([vtoInspTecnicaFile.datos], {type : 'image/jpeg'});
    formData.append('vtoInspTecnica', blob, vtoInspTecnicaFile.nombre);
    blob = new Blob([vtoSenasaFile.datos], {type : 'image/jpeg'});
    formData.append('vtoSenasa', blob, vtoSenasaFile.nombre);
    blob = new Blob([habBromatFile.datos], {type : 'image/jpeg'});
    formData.append('habBromat', blob, habBromatFile.nombre);
    obj.tituloFile = null;
    obj.cedulaIdentFile = null;
    obj.cedulaIdentFile = null;
    obj.vtoRutaFile = null;
    obj.vtoInspTecnicaFile = null;
    obj.habBromatFile = null;

    formData.append('vehiculo', JSON.stringify(obj));
		return fetch(this.url, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem('tokenLesion')
      },
      body: formData
    });
  }
  //Actualiza un registro
  public actualizar(elemento) {
    let obj = Object.assign({}, elemento);
    let idFoto = elemento.bugImagen.id;
    let foto = obj.bugImagen;
    let blob = new Blob([foto.datos], {type : 'image/jpeg'});
    const formData = new FormData(); 
    formData.append('archivo', blob, foto.nombre);
    obj.bugImagen = {};
    obj.bugImagen.id = idFoto;
    formData.append('vehiculo', JSON.stringify(obj));
		return fetch(this.url, {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('tokenLesion')
      },
      body: formData
    });
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
  
}
