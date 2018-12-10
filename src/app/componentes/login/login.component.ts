import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../servicios/login.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { UsuarioEmpresaService } from '../../servicios/usuario-empresa.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  elemento:any = {};
  formulario = null;
  //Define si esta autenticado
  estaAutenticado:boolean = false;
  //Define el listado de empresas
  empresas = null;
  //Constructor
  constructor(private loginService: LoginService, private usuarioService: UsuarioService,
    private appComponent: AppComponent, private usuarioEmpresaService: UsuarioEmpresaService, private router: Router) {
      this.formulario = new FormGroup({
        username: new FormControl(),
        password: new FormControl(),
        empresa: new FormControl()
      });
  }
  //Loguea un usuario
  public login() {
    this.loginService.login(this.elemento.username, this.elemento.password)
    .subscribe(res => {
      if(res.headers.get('authorization')) {
        //Obtiene el menu
        this.appComponent.obtenerMenu();
        //Almacena el token en el local storage
        localStorage.setItem('token', res.headers.get('authorization'));
        //Establece logueado en true
        this.loginService.setLogueado(true);
        this.estaAutenticado = true;
        //Obtiene el usuario por username
        this.usuarioService.obtenerPorUsername(this.elemento.username).subscribe(
          res => {
            this.appComponent.setUsuario(res.json());
            //Obtiene el listado de empresas activas por usuario
            this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(res.json().id).subscribe(
              res => {
                this.empresas = res.json();
                setTimeout(function() {
                  document.getElementById('idEmpresa').focus();
                }, 20);
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.loginService.setLogueado(false);
      }
    });
  }
  //Define un metodo para ingreso una vez logueado el usuario y seleccionado una empresa
  public ingresar() {
    if(this.estaAutenticado === true) {
      //Establece la empresa
      this.appComponent.setEmpresa(this.elemento.empresa);
      //Establece el tema
      this.appComponent.setTema(this.establecerTema(this.elemento.empresa));
      //Navega a la pagina principal (home)
      this.router.navigate(['/home']);
    }
  }
  private establecerTema(empresa):string {
    switch(empresa.id) {
      case 1:
        return 'blue-theme';
      case 2:
        return 'red-theme';
      case 3:
        return 'orange-theme';
      case 4:
        return 'purple-theme';
      case 5:
        return 'green-theme';
    }
  }
}
