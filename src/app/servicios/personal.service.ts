import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class PersonalService {
  //Define la ruta al servicio web
  private ruta: string = "/personal";
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
  //Define la lista completa
  public tipos: any[] = ['png', 'jpeg', 'jpg'];
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
  //Obtiene un registro por id
  public obtenerPorId(id) {
    return this.http.get(this.url + '/obtenerPorId/' + id, this.options);
  }
  //Obtiene la lista de choferes por distancia (corta/larga) y por alias
  public listarChoferesPorDistanciaPorAlias(alias, distancia) {
    return this.http.get(this.url + '/listarChoferesPorDistanciaPorAlias/' + alias + '/' + distancia, this.options);
  }
  //Obtiene la lista de choferes por empresa
  public listarChoferesPorEmpresa(idEmpresa) {
    return this.http.get(this.url + '/listarChoferesPorEmpresa/' + idEmpresa, this.options);
  }
  //Obtiene un listado de choferes corta distancia por alias
  public listarChoferesCortaDistanciaPorAlias(alias) {
    return this.http.get(this.url + '/listarChoferesPorDistanciaPorAlias/' + alias + '/' + false, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene la lista de acompaniantes
  public listarAcompaniantes() {
    return this.http.get(this.url + '/listarAcompaniantes', this.options);
  }
  //Obtiene un listado por alias
  public listarChoferesPorAliasYEmpresa(alias, idEmpresa) {
    return this.http.get(this.url + '/listarChoferesPorAliasYEmpresa/' + alias + '/' + idEmpresa, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por alias
  public listarPorAlias(alias) {
    return this.http.get(this.url + '/listarPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por alias de los personales activos
  public listarActivosPorAlias(alias) {
    return this.http.get(this.url + '/listarActivosPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por Empresa y Alias
  public listarPorAliasYEmpresa(idEmpresa, alias) {
    return this.http.get(this.url + '/listarPorAliasYEmpresa/' + idEmpresa + '/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por Empresa y Alias (activo)
  public listarPorActivosAliasYEmpresa(idEmpresa, alias) {
    return this.http.get(this.url + '/listarPorActivosAliasYEmpresa/' + idEmpresa + '/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado por Empresa, Alias y Sucursal
  public listarActivosPorAliasEmpresaYSucursal(alias, idEmpresa, idSucursal) {
    return this.http.get(this.url + '/listarActivosPorAliasEmpresaYSucursal/' + alias + '/' + idEmpresa + '/' + idSucursal, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado de choferes por alias
  public listarChoferActivoPorAlias(alias) {
    return this.http.get(this.url + '/listarChoferActivoPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene un listado de acompañantes por alias
  public listarAcompaniantesPorAlias(alias) {
    return this.http.get(this.url + '/listarAcompaniantesPorAlias/' + alias, this.options).map(res => {
      return res.json().map(data => {
        return data;
      })
    })
  }
  //Obtiene todos los listados
  public inicializar(idUsuario, idRol, idSubopcion) {
    return this.http.get(this.url + '/inicializar/' + idUsuario + '/' + idRol + '/' + idSubopcion, this.options);
  }
  //Obtiene un listado de acompañantes por alias
  public listarPorFiltros(formularioFiltro) {
    return this.http.post(this.url + '/listarPorFiltros', formularioFiltro, this.options);
  }
  //Obtiene un listado de acompañantes por alias
  public listarChoferesPorFiltros(formularioFiltro) {
    return this.http.post(this.url + '/listarChoferesPorFiltros', formularioFiltro, this.options);
  }
  //Agrega un registro
  public agregar(elemento) {
    let obj = Object.assign({}, elemento);
    let foto = obj.foto;
    let licConducir = obj.pdfLicConducir;
    let libSanidad = obj.pdfLibSanidad;
    let linti = obj.pdfLinti;
    let dni = obj.pdfDni;
    let altaTemprana = obj.pdfAltaTemprana;
    let noBlobPdf = new Blob([null], { type: 'application/pdf' });
    const formData = new FormData();
    if (foto.nombre != null) {
      let blob = new Blob([foto.datos], { type: 'image/jpeg' });
      formData.append('foto', blob, foto.nombre);
    } else {
      let blob = new Blob([null], { type: 'image/jpeg' });
      formData.append('foto', blob, '');
    }
    if (licConducir.nombre != null) {
      let blobPdf = new Blob([licConducir.datos], { type: 'application/pdf' });
      formData.append('licConducir', blobPdf, licConducir.nombre);
    } else {
      formData.append('licConducir', noBlobPdf, '');
    }
    if (libSanidad.nombre != null) {
      let blobPdf = new Blob([libSanidad.datos], { type: 'application/pdf' });
      formData.append('libSanidad', blobPdf, libSanidad.nombre);
    } else {
      formData.append('libSanidad', noBlobPdf, '');
    }
    if (linti.nombre != null) {
      let blobPdf = new Blob([linti.datos], { type: 'application/pdf' });
      formData.append('linti', blobPdf, linti.nombre);
    } else {
      formData.append('linti', noBlobPdf, '');
    }
    if (dni.nombre != null) {
      let tipo = dni.nombre.split(".", 2);
      if (this.tipos.includes(tipo[1])) {
        let blobPdf = new Blob([dni.datos], { type: 'image/jpeg' });
        formData.append('dni', blobPdf, dni.nombre);
      } else if (tipo[1] == 'pdf') {
        let blobPdf = new Blob([dni.datos], { type: 'application/pdf' });
        formData.append('dni', blobPdf, dni.nombre);
      }
    } else {
      formData.append('dni', noBlobPdf, '');
    }
    if (altaTemprana.nombre != null) {
      let blobPdf = new Blob([altaTemprana.datos], { type: 'application/pdf' });
      formData.append('altaTemprana', blobPdf, altaTemprana.nombre);
    } else {
      formData.append('altaTemprana', noBlobPdf, '');
    }
    obj.foto = null;
    obj.pdfLicConducir = null;
    obj.pdfLibSanidad = null;
    obj.pdfLinti = null;
    obj.pdfDni = null;
    obj.pdfAltaTemprana = null;
    formData.append('personal', JSON.stringify(obj));
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
    elemento.foto = null;
    elemento.pdfDni = null;
    elemento.pdfLicConducir = null;
    elemento.pdfLinti = null;
    elemento.pdfLibSanidad = null;
    elemento.pdfAltaTemprana = null;
    return this.http.put(this.url, elemento, this.options);
  }
  //Actualiza un pdf
  public actualizarPDF(idPersonal, tipoPdf, elemento) {
    const formData = new FormData();
    let blob = new Blob([elemento.datos], { type: 'application/pdf' });
    formData.append('idPersonal', JSON.stringify(idPersonal));
    formData.append('idPdf', JSON.stringify(elemento.id));
    formData.append('tipoPdf', tipoPdf);
    formData.append('archivo', blob, elemento.nombre);
    return fetch(this.url + '/actualizarPdf', {
      method: "PUT",
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: formData
    });
  }
  //Elimina un pdf
  public eliminarPdf(idPersonal, idPdf, tipoPdf) {
    return this.http.delete(this.url + '/eliminarPdf/' + idPersonal + '/' + idPdf + '/' + tipoPdf, this.options);
  }
  //Elimina un registro
  public eliminar(id) {
    return this.http.delete(this.url + '/' + id, this.options);
  }
}
