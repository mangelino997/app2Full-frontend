import { Component, OnInit } from '@angular/core';
import { AppService } from './servicios/app.service';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import 'rxjs/Rx';
import { ReporteService } from './servicios/reporte.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public visible:boolean = false;
  public modulos = null;
  public usuario = {rol:{id:null}, sucursal:{id:null}, nombre:null};
  public empresa = {id: null, feCAEA: null};
  public subopcion = null;
  public rol:number = null;
  public tema:string;
  //Muestra o no botones de reportes
  public mostrarBtnReportes:boolean = true;
  //Define la lista de botones para dialogos de reportes
  public datosDialogos:Array<any> = [];
  //Define barra de progreso de carga de modulos
  public loadingRouteConfig: boolean;
  //Constructor
  constructor(private appService: AppService, private router: Router, 
    private reporteServicio: ReporteService) {
    //Se subscribe al servicio de lista de registros
    // this.appService.listaCompleta.subscribe(res => {
    //   this.obtenerMenu(this.getRol());
    // });
    this.reporteServicio.obtenerDatosDialogo().subscribe(
      res => {
        let i = -1;
        this.datosDialogos.forEach((elemento, indice, objecto) => {
          if(elemento == res) {
            i = indice;
          }
        });
        if(i != -1) {
          this.datosDialogos.splice(i, 1);
        }
        this.datosDialogos.push(res);
      }
    );
  }
  //Al inicializarse el componente
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
    });
    this.router.navigate(['login'], { replaceUrl: true });
  }
  public setVisible(valor) {
    this.visible = valor;
  }
  //Obtiene el usuario
  public getUsuario() {
    return this.appService.getUsuario();
  }
  //Establece el usuario
  public setUsuario(usuario) {
    this.usuario = usuario;
    this.appService.setUsuario(usuario);
  }
  //Obtiene la empresa
  public getEmpresa() {
    return this.empresa;
  }
  //Establece la empresa
  public setEmpresa(empresa) {
    this.empresa = empresa;
    this.appService.setEmpresa(empresa);
  }
  //Obtiene la subopcion
  public getSubopcion() {
    return this.subopcion;
  }
  //Establece la subopcion
  public setSubopcion(subopcion) {
    this.subopcion = subopcion;
    this.appService.setSubopcion(subopcion);
  }
  //Obtiene el tema
  public getTema() {
    return this.tema;
  }
  //Establece el tema
  public setTema(tema) {
    this.tema = tema;
    this.appService.setTema(tema);
  }
  //Obtiene la lista de modulos para armar el menu
  public obtenerMenu(id, token) {
    this.appService.obtenerMenu(id, token).subscribe(
      res => {
        this.modulos = res.json().modulos;
      },
      err => {
        console.log(err);
      }
    )
  }
  //Cambiar contraseña
  public cambiarContrasenia(): void {
    this.router.navigate(['usuarioscontrasenas'], {replaceUrl: true});
  }
  //Soporte
  public soporte(): void {
    this.router.navigate(['soporte'], {replaceUrl: true});
  }
  //Nuevo Ingreso
  public nuevoIngreso(): void {
    window.open(this.appService.getUrlOrigen() + '/login', '_blank');
  }
  //Logout
  public logout(): void {
    localStorage.removeItem('token');
    window.location.reload();
  }
  public navegar(submodulo, subopcion, idSubopcion) {
    this.setSubopcion(idSubopcion);
    var pag = submodulo + subopcion;
    var pagina = pag.toLowerCase();
    pagina = pagina.replace(new RegExp(/\s/g), "");
    pagina = pagina.replace(new RegExp(/[àá]/g), "a");
    pagina = pagina.replace(new RegExp(/[èé]/g), "e");
    pagina = pagina.replace(new RegExp(/[ìí]/g), "i");
    pagina = pagina.replace(new RegExp(/ñ/g), "n");
    pagina = pagina.replace(new RegExp(/[òó]/g), "o");
    pagina = pagina.replace(new RegExp(/[ùú]/g), "u");
    pagina = pagina.replace(new RegExp(/ /g), "");
    pagina = pagina.replace(new RegExp(/[-]/g), "");
    pagina = pagina.replace(new RegExp(/[,]/g), "");
    pagina = pagina.replace(new RegExp(/[.]/g), "");
    pagina = pagina.replace(new RegExp(/[/]/g), "");
    this.router.navigate([pagina], { replaceUrl: true });
  }
  //Establece los ceros en los numero flotantes
  public establecerCeros(valor) {
    return parseFloat(valor).toFixed(2);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Abre el dialogo de reporte
  public abrirDialogo(datos, indice): void {
    if(indice != -1) {
      this.datosDialogos.splice(indice, 1);
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}