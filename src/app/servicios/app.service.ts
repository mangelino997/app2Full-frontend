import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Injectable()
export class AppService {
  //Deifne la URL origen
  // private URL_ORIGEN = 'https://jit-gestion.appspot.com';
  private URL_ORIGEN = 'http://192.168.0.123:4200'; //192.168.0.123
  //Define la IP
  // private IP = 'https://gestionws.appspot.com';
  private IP = 'http://192.168.0.123:8080'; //192.168.0.156:8080
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
  public listaCompleta: Subject<any> = new Subject<any>();
  //Define la empresa
  public empresa:any;
  //Define el usuario
  public usuario:any;
  //Define la subopcion
  public subopcion:any;
  //Define el tema
  public tema:any;
  //Define el rol del usuario actual
  public rol:any;
  //Constructor
  constructor(private http: Http, private stompService: StompService) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({ headers: headers });
    //Subcribe al usuario a la lista completa
    this.mensaje = this.stompService.subscribe(this.URL_TOPIC + '/rolsubopcion/listarMenu');
    this.subcripcion = this.mensaje.subscribe(this.subscribirse);
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Obtiene el menu
  public obtenerMenu(id, token) {
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.URL_BASE + '/menu/' + id, options);
  }
  //Obtiene la URL ORIGEN
  public getUrlOrigen() {
    return this.URL_ORIGEN;
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
  //Obtiene el usuario
  public getUsuario() {
    return this.usuario;
  }
  //Establece el usuario
  public setUsuario(usuario) {
    this.usuario = usuario;
  }
  //Establece el rol del usuario actual
  public setRol(rol): void {
    this.rol = rol;
  }
  //Obtiene el rol del usuario actual
  public getRol() {
    return this.rol;
  }
  //Obtiene la empresa
  public getEmpresa() {
    return this.empresa;
  }
  //Establece la empresa
  public setEmpresa(empresa) {
    this.empresa = empresa;
  }
  //Obtiene la subopcion
  public getSubopcion() {
    return this.subopcion;
  }
  //Establece la subopcion
  public setSubopcion(subopcion) {
    this.subopcion = subopcion;
  }
  //Obtiene el tema
  public getTema() {
    return this.tema;
  }
  //Establece el tema
  public setTema(tema) {
    this.tema = tema;
  }
  //Formatear numero a x decimales
  public setDecimales(valor, cantidad) {
    if(valor) {
      return parseFloat(valor).toFixed(cantidad);
    }
  }
  //Formatear los enteros (quita las comas en los 'miles')
  public establecerEnteros(valor) {
    if(valor) {
      valor = valor + '';
      valor = valor.replace(/\,/g, '');
    }
    return valor;
  }
  //Formatear numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if(valor) {
      valor = valor + '';
      valor = valor.replace('$ ', '');
      valor = valor.replace(' km', '');
      valor = valor.replace(/\,/g, '');
      // valor = parseFloat(valor).toFixed(cantidad);
    }
    return parseFloat(valor).toFixed(cantidad);
  }
  //Valida el CUIT/CUIL
  public validarCUIT(cuit) {
    if (cuit.length != 11) {
      return false;
    }
    var acumulado = 0;
    var digitos = cuit.split('');
    var digito = digitos.pop();
    for (var i = 0; i < digitos.length; i++) {
      acumulado += digitos[9 - i] * (2 + (i % 6));
    }
    var verif = 11 - (acumulado % 11);
    if (verif == 11) {
      verif = 0;
    }
    return digito == verif;
  }
  //Valida el dni
  public validarDNI(dni) {
    if (dni.length != 8) {
      return false
    }
    return true;
  }
  //Valida el dni
  public validarCBU(dni) {
    if (dni.length != 22) {
      return false
    }
    return true;
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '$ ',
        suffix: '',
        thousandsSeparatorSymbol: ',',
        integerLimit: intLimite,
        requireDecimal: true,
        allowDecimal: true,
        decimalLimit: decimalLimite,
        decimalSymbol: '.',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Obtiene la mascara de altura, ancho, largo, m3, kg CON decimales
  public mascararEnterosConDecimales(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: '',
        thousandsSeparatorSymbol: ',',
        integerLimit: intLimite,
        requireDecimal: true,
        allowDecimal: true,
        decimalLimit: 2,
        decimalSymbol: '.',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Obtiene la mascara de altura, ancho, largo, m3, kg CON decimales
  public mascararEnterosCon4Decimales(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: '',
        thousandsSeparatorSymbol:'',
        integerLimit: intLimite,
        requireDecimal: true,
        allowDecimal: true,
        decimalLimit: 4,
        decimalSymbol: '.',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Obtiene la mascara de enteros SIN decimales
  public mascararEnterosSinDecimales(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: '',
        thousandsSeparatorSymbol: ',',
        integerLimit: intLimite,
        requireDecimal: false,
        allowDecimal: false,
        decimalSymbol: '',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: '',
        thousandsSeparatorSymbol: '',
        integerLimit: intLimite,
        requireDecimal: true,
        allowDecimal: true,
        decimalSymbol: '',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    let mascara = {
      mask: createNumberMask({
        prefix: '% ',
        suffix: '',
        thousandsSeparatorSymbol: ',',
        integerLimit: 2,
        requireDecimal: true,
        allowDecimal: true,
        decimalLimit: 2,
        decimalSymbol: '.',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Desenmascara el porcentaje
  public desenmascararPorcentaje(valor, cantidad) {
    if(valor) {
      valor = valor.replace('% ', '');
      valor = valor.replace(/\,/g, '');
      valor = parseFloat(valor).toFixed(cantidad);
    }
    return valor;
  }
  //Obtiene la mascara de km
  public mascararKm(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: ' km',
        thousandsSeparatorSymbol: ',',
        integerLimit: intLimite,
        requireDecimal: false,
        allowDecimal: false,
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Desenmascara el km
  public desenmascararKm(valor) {
    if(valor) {
      valor = valor + "";
      valor = valor.replace(' km', '');
      valor = valor.replace(/\,/g, '');
    }
    return valor;
  }
  //Obtiene la mascara de litros
  public mascararLitros(intLimite) {
    let mascara = {
      mask: createNumberMask({
        prefix: '',
        suffix: ' lt',
        thousandsSeparatorSymbol: ',',
        integerLimit: intLimite,
        requireDecimal: true,
        allowDecimal: true,
        decimalLimit: 2,
        decimalSymbol: '.',
        allowLeadingZeroes: true,
      }),
      guide: false,
      keepCharPositions: true
    };
    return mascara;
  }
  //Desenmascara el km
  public desenmascararLitros(valor) {
    if(valor) {
      valor = valor + "";
      valor = valor.replace(' lt.', '');
      valor = valor.replace(/\,/g, '');
    }
    return valor;
  }
  //Obtiene la mascara de hora-minuto
  public mascararHora() {
    return [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ' hs'];
  }
}