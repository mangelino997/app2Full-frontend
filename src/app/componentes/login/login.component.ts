import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../servicios/login.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { AppComponent } from '../../app.component';
import { LoaderService } from 'src/app/servicios/loader.service';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/modelos/loader';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  //Define el formulario
  public formulario = null;
  //Define si esta autenticado
  public estaAutenticado: boolean = false;
  //Define el listado de empresas
  public empresas = null;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el token
  private token: any;
  //Define si tiene rol secundario
  public rolSecundario: boolean = false;
  //Define la lista de roles
  public roles: Array<any> = [];
  //Define el LoginDTO
  public loginDTO:any = {};
  //Constructor
  constructor(private loginService: LoginService, private usuarioService: UsuarioService,
    private appService: AppService, private router: Router, private loaderService: LoaderService,
    private appComponent: AppComponent, private toast: ToastrService) {
  }
  //Al inicializarse el componente
  ngOnInit() {
    this.formulario = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      empresa: new FormControl(),
      rol: new FormControl()
    });
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }
  //Loguea un usuario
  public login() {
    this.loaderService.show();
    let username = this.formulario.get('username').value;
    let password = this.formulario.get('password').value;
    this.loginService.login(username, password)
      .subscribe(res => {
        if (res.headers.get('authorization')) {
          //Almacena el token en el local storage
          localStorage.setItem('token', res.headers.get('authorization'));
          this.token = res.headers.get('authorization');
          //Establece logueado en true
          this.loginService.setLogueado(true);
          this.estaAutenticado = true;
          this.loaderService.hide();
          //Obtiene el usuario y sus datos
          this.obtenerUsuario(username, this.token);
        } else {
          this.loginService.setLogueado(false);
          this.loaderService.hide();
        }
      },
        err => {
          this.loginService.setLogueado(false);
          this.toast.error('o cuenta no habilitada', 'Usuario o contraseña incorrecto');
          this.loaderService.hide();
        });
  }
  //Obtiene el usuario, sus empresas y su menu
  private obtenerUsuario(username, token): void {
    this.loaderService.show();
    this.usuarioService.obtenerUsuario(username, token).subscribe(
      res => {
        let respuesta = res.json();
        this.loginDTO = respuesta;
        let usuario = respuesta.usuario;
        this.appService.setUsuario(usuario);
        if (!usuario.rolSecundario) {
          this.rolSecundario = false;
          //Establece el rol actual
          this.appService.setRol(usuario.rol);
          //Obtiene el menu del rol principal
          this.appComponent.establecerMenu(respuesta.menuPrincipalDTO.modulos);
        } else {
          this.rolSecundario = true;
          this.roles.push(usuario.rol);
          this.roles.push(usuario.rolSecundario);
        }
        this.empresas = respuesta.empresas;
        setTimeout(function () {
          document.getElementById('idEmpresa').focus();
        }, 20);
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Define un metodo para ingreso una vez logueado el usuario y seleccionado una empresa
  public ingresar() {
    if (this.estaAutenticado === true) {
      this.loaderService.show();
      //Obtiene el rol seleccionado
      let rol = this.formulario.get('rol').value;
      if (rol) {
        //Establece el rol
        this.appService.setRol(rol);
        //Establece el menu
      }
      //Establece la empresa
      let empresa = this.formulario.get('empresa').value;
      //Establece la empresa
      this.appComponent.setEmpresa(empresa);
      //Establece el tema
      this.appComponent.setTema(this.establecerTema(empresa));
      this.loaderService.hide();
      //Navega a la pagina principal (home)
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }
  private establecerTema(empresa): string {
    switch (empresa.id) {
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
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}