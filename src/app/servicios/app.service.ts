import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Injectable()
export class AppService {
  //Define la IP
  private IP = 'http://192.168.0.99:8080'; //http://localhost:8080 -------http://192.168.0.99:8080
  //Define la url base
  private URL_BASE = this.IP + '/jitws/auth';
  //Define la url de subcripcion a socket
  private URL_TOPIC = '/jitws/auth/topic';
  //Define el headers y token de autenticacion
  private options = null;
  //Define la subcripcion
  private subcripcion: Subscription;
  //Define el mensaje de respuesta a la subcripcion
  private mensaje: Observable<Message>;
  //Define la lista completa
  public listaCompleta:Subject<any> = new Subject<any>();
  //Constructor
  constructor(private http: Http, private stompService: StompService) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({headers: headers});
    //Subcribe al usuario a la lista completa
    this.mensaje = this.stompService.subscribe(this.URL_TOPIC + '/rolsubopcion/listarMenu');
    this.subcripcion = this.mensaje.subscribe(this.subscribirse);
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Obtiene el menu
  public obtenerMenu(id) {
    return this.http.get(this.URL_BASE + '/menu/' + id, this.options);
  }
  //Obtiene la IP
  public getIP() {
    return this.IP;
  }
  //Obtiene la url base
  public getUrlBase() {
    return this.URL_BASE;
  }
  //Obtiene la url de subcripcion a socket
  public getTopic() {
    return this.URL_TOPIC;
  }
  //Formatear numero a x decimales
  public setDecimales(valor, cantidad) {
    return Number(valor).toFixed(cantidad);
  }
}