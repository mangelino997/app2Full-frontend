import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppService } from './app.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Nodo } from '../componentes/plan-cuenta/plan-cuenta.component';

export class Arbol {
  id: number;
  version: number;
  empresa: {};
  padre: Arbol;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  usuarioAlta: {};
  usuarioMod: {};
  tipoCuentaContable: {};
  grupoCuentaContable: {};
  nivel: number;
  hijos: Arbol[];
}

@Injectable({
    providedIn: 'root'
  })
export class PlanCuentaService {
  //Define la ruta al servicio web
  private ruta:string = "/plancuenta";
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
  public listaCompleta = new BehaviorSubject<Arbol[]>([]);
  //Define el plan de cuenta
  public planCuenta:any;
  //Constructor
  constructor(private http: Http, private appService: AppService, private stompService: StompService) {
    //Establece la empresa
    let idEmpresa = this.appService.getEmpresa().id;
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
    //Obtiene el plan de cuentas
    this.obtenerPlanCuenta(idEmpresa).subscribe(res => {
      this.inicializar(res.json());
    });
  }
  //Resfresca la lista completa si hay cambios
  public subscribirse = (m: Message) => {
    this.listaCompleta.next(JSON.parse(m.body));
  }
  //Obtiene el arbol
  get data(): Arbol[] { return this.listaCompleta.value; }
  //Inicializa el arbol
  private inicializar(planCuenta) {
    // const d = this.buildFileTree(TREE_DATA, 0);
    const data = this.crearArbol(planCuenta);
    let arbol = [];
    arbol.push(data);
    this.listaCompleta.next(arbol);
  }
  //Crea el arbol
  private crearArbol(elemento): Arbol {
    let arbol = new Arbol();
    arbol.id = elemento.id;
    arbol.version = elemento.version;
    arbol.empresa = elemento.empresa;
    arbol.padre = elemento.padre;
    arbol.nombre = elemento.nombre;
    arbol.esImputable = elemento.esImputable;
    arbol.estaActivo = elemento.estaActivo;
    arbol.usuarioAlta = elemento.usuarioAlta;
    arbol.usuarioMod = elemento.usuarioMod;
    arbol.tipoCuentaContable = elemento.tipoCuentaContable;
    arbol.grupoCuentaContable = elemento.grupoCuentaContable;
    arbol.nivel = elemento.nivel;
    arbol.hijos = elemento.hijos;
    for (const i in arbol.hijos) {
      arbol.hijos[i] = this.crearArbol(arbol.hijos[i]);
    }
    return arbol;
  }
  //Obtiene el siguiente id
  public obtenerSiguienteId() {
    return this.http.get(this.url + '/obtenerSiguienteId', this.options);
  }
  //Obtiene la lista de registros
  public listar() {
    return this.http.get(this.url, this.options);
  }
  //Obtiene un registros por nombre
  public listarPorNombre(nombre) {
    return this.http.get(this.url + '/listarPorNombre/' + nombre, this.options);
  }
  //Obtiene un registros por Grupo Activo
  public listarGrupoActivo(idGrupo) {
    return this.http.get(this.url + '/listarGrupoActivo/' + idGrupo, this.options);
  }
  //Obtiene el plan de cuenta
  public obtenerPlanCuenta(idEmpresa) {
    return this.http.get(this.url + '/obtenerPlanCuentaPorEmpresa/' + idEmpresa, this.options);
  }
  //Lista por empresa y grupo cuenta contable
  public listarPorEmpresaYGrupoCuentaContable(idEmpresa, idGrupoCuentaContable) {
    return this.http.get(this.url + '/listarPorEmpresaYGrupoCuentaContable/' + idEmpresa + '/' + idGrupoCuentaContable, this.options);
  }
  //Obtiene por empresa y grupo cuenta contable
  public obtenerPorEmpresaYGrupoCuentaContable(idEmpresa, idGrupoCuentaContable) {
    return this.http.get(this.url + '/obtenerPorEmpresaYGrupoCuentaContable/' + idEmpresa + '/' + idGrupoCuentaContable, this.options);
  }
  public agregarElemento(padre: Arbol, nombre: string) {
    if (padre.hijos) {
      let p = new Arbol();
      p.id = padre.id;
      padre.hijos.push({ nombre: nombre, padre: p } as Arbol);
      this.listaCompleta.next(this.data);
    }
  }
  public eliminarElemento(padre: Arbol, nodo: Nodo) {
    let indice = padre.hijos.indexOf(nodo);
    padre.hijos.splice(indice, 1);
    this.listaCompleta.next(this.data);
  }
  //Agrega un registro
  public agregar(elemento) {
    this.http.post(this.url, elemento, this.options).subscribe(
      res => {
        if(res.status == 201) {
          let respuesta = res.json();
          elemento.id = respuesta.id;
          this.listaCompleta.next(this.data);
        }
      },
      err => {
        console.log('ERROR');
      }
    );
  }
  //Actualiza un registro
  public actualizar(elemento, nodo) {
    this.http.put(this.url, elemento, this.options).subscribe(
      res => {
        let respuesta = res.json();
        if(res.status == 200) {
          nodo.version = respuesta.version;
          nodo.nombre = respuesta.nombre;
          nodo.esImputable = respuesta.esImputable;
          nodo.estaActivo = respuesta.estaActivo;
          this.listaCompleta.next(this.data);
        }
      },
      err => {
        console.log('ERROR');
      }
    );
  }
  //Elimina un registro
  public eliminar(id, nodoPadre) {
    return this.http.delete(this.url + '/' + id, this.options).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 200) {
          for(let i in nodoPadre.hijos) {
            if(nodoPadre.hijos[i].id == id) {
              nodoPadre.hijos.splice(i, 1);
              this.listaCompleta.next(this.data);
            }
          }
        }
      },
      err => {
        console.log('ERROR');
      }
    );
  }
}