import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../servicios/login.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { UsuarioEmpresaService } from '../../servicios/usuario-empresa.service';
import { AppComponent } from '../../app.component';
import { LoaderService } from 'src/app/servicios/loader.service';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/modelos/loader';
import { ToastrService } from 'ngx-toastr';

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
  //Constructor
  constructor(private loginService: LoginService, private usuarioService: UsuarioService,
    private usuarioEmpresaService: UsuarioEmpresaService,
    private router: Router, private loaderService: LoaderService,
    private appComponent: AppComponent, private toast: ToastrService) {
  }
  //Al inicializarse el componente
  ngOnInit() {
    this.formulario = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      empresa: new FormControl()
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
          let token = res.headers.get('authorization');
          //Establece logueado en true
          this.loginService.setLogueado(true);
          this.estaAutenticado = true;
          //Obtiene el usuario por username
          this.usuarioService.obtenerPorUsername(username, token).subscribe(
            res => {
              let usuario = res.json();
              this.appComponent.setUsuario(usuario);
              //Obtiene el menu
              this.appComponent.obtenerMenu(usuario.rol.id, token);
              //Obtiene el listado de empresas activas por usuario
              this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(res.json().id, token).subscribe(
                res => {
                  this.empresas = res.json();
                  setTimeout(function () {
                    document.getElementById('idEmpresa').focus();
                  }, 20);
                  this.loaderService.hide();
                },
                err => {
                  this.loaderService.hide();
                }
              );
            },
            err => {
              this.loaderService.hide();
            }
          );
        } else {
          this.loginService.setLogueado(false);
          this.loaderService.hide();
        }
      },
      err => {
        this.loginService.setLogueado(false);
        this.toast.error('Usuario o contraseña incorrecto');
        this.loaderService.hide();
      });
  }
  //Define un metodo para ingreso una vez logueado el usuario y seleccionado una empresa
  public ingresar() {
    if (this.estaAutenticado === true) {
      //Establece la empresa
      let empresa = this.formulario.get('empresa').value;
      //Establece la empresa
      this.appComponent.setEmpresa(empresa);
      //Establece el tema
      this.appComponent.setTema(this.establecerTema(empresa));
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
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
}