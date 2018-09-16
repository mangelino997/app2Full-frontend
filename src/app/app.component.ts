import { Component } from '@angular/core';
import { AppService } from './servicios/app.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private visible:boolean = false;
  private modulos = null;
  private usuario = {rol:{id:null}};
  private empresa = {};
  private subopcion = null;
  private rol:number = null;
  constructor(private appService: AppService, private router: Router) {}
  public setVisible(valor) {
    this.visible = valor;
  }
  //Obtiene el usuario
  public getUsuario() {
    return this.usuario;
  }
  //Establece el usuario
  public setUsuario(usuario) {
    this.usuario = usuario;
  }
  //Obtiene el rol del usuario actual
  public getRol() {
    return this.usuario.rol.id;
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
  //Obtiene la lista de modulos para armar el menu
  public obtenerMenu() {
    this.appService.obtenerMenu().subscribe(
      res => {
        this.modulos = res.json().modulos;
      },
      err => {
        console.log(err);
      }
    )
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
    this.router.navigate([pagina]);
  }
}
