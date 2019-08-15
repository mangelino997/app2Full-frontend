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
  public agregar(elemento, usuarioAlta, empresa, cliente) {
    console.log(elemento);
    let obj = Object.assign({}, elemento);
    console.log(cliente);
    let clienteOrdenVenta;
    let empresaOrdenVenta;
    if(cliente){
      clienteOrdenVenta = {
        cliente: cliente,
        usuarioAlta: {id: usuarioAlta.id}
      };
      empresaOrdenVenta = null;
    }else{
      empresaOrdenVenta = {
        empresa: empresa,
        usuarioAlta: {id: usuarioAlta.id}
      };
      clienteOrdenVenta = null
    }
    let ordenVentaTarifa = obj.ordenesVentasTarifas;
    // let ordenesVentasEscalas = obj.ordenVentaTarifa.listaOrdenVentaEscala;
    // let ordenesVentasTramos = obj.ordenVentaTarifa.listaOrdenVentaTramo;

    // let blob = new Blob([null], {type : 'application/pdf'});
    let noBlobPdf = new Blob([null], {});
    const formData = new FormData(); 
    let objNull= null;
    if(clienteOrdenVenta)
      formData.append('clienteOrdenVenta', JSON.stringify(clienteOrdenVenta));
      else{
        formData.append('clienteOrdenVenta', null);
      }
      
    if(empresaOrdenVenta)
      formData.append('empresaOrdenVenta', JSON.stringify(empresaOrdenVenta));
      else{
        formData.append('empresaOrdenVenta',null);
      }

    if(ordenVentaTarifa)
      formData.append('ordenVentaTarifa', JSON.stringify(ordenVentaTarifa));
      else{
        formData.append('ordenVentaTarifa', JSON.stringify(''));
      }

    // if(ordenesVentasEscalas)
    //   formData.append('ordenesVentasEscalas', JSON.stringify(ordenesVentasEscalas));
    //   else{
    //     formData.append('ordenesVentasEscalas', JSON.stringify(''));
    //   }

    // if(ordenesVentasTramos)
    //   formData.append('ordenesVentasTramos', JSON.stringify(ordenesVentasTramos));
    //   else{
    //     formData.append('ordenesVentasTramos', JSON.stringify(''));
    //   }
    
    // if(clienteOrdenVenta.cliente)
    //   obj.clientes = [clienteOrdenVenta.cliente];
    //   else
    //   obj.clientes = [];

    // if(empresaOrdenVenta.empresa)
    //   obj.empresas = [empresaOrdenVenta.empresa];
    //   else
    //   obj.empresas = [];

    // obj.clienteOrdenVenta = {id: null};
    // obj.empresaOrdenVenta = {id: null};
    // obj.ordenVentaTarifa.listaOrdenVentaEscala = null;
    // obj.ordenVentaTarifa.listaOrdenVentaTramo = null;
    // obj.ordenesVentasTarifas = [];
    formData.append('ordenVenta', JSON.stringify(obj));
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
