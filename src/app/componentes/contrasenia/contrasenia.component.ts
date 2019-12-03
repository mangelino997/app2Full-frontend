import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from 'src/app/modelos/usuario';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AppService } from 'src/app/servicios/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contrasenia',
  templateUrl: './contrasenia.component.html',
  styleUrls: ['./contrasenia.component.css']
})
export class ContraseniaComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define los datos del usuario del autocompletado
  public user: any;
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl('', Validators.required);
  //Define el estado del autocompletado
  public estadoAutocompletado: boolean = true;
  //Define la lista de resultados del autocompletado
  public resultados: Array<any> = [];
  //Define campo de control de repetir contraseña
  public passwordRepeat: FormControl = new FormControl('', Validators.required);
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el estado de contraseña y repetir contraseña
  public estadoContrasenia: boolean = false;
  //Constructor
  constructor(private servicio: UsuarioService, private usuario: Usuario, private toastr: ToastrService,
    private loaderService: LoaderService, private appService: AppService,
    private router: Router) {
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorNombre(data).subscribe(res => {
            this.resultados = res;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    });
  }
  //Al inicializar el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Crea el formulario
    this.formulario = this.usuario.formulario;
    this.formulario.reset();
    //Establece el usuario actual
    let usuario = this.appService.getUsuario();
    this.user = usuario;
    if (usuario.rol.id > 2) {
      this.formulario.patchValue(usuario);
      this.formulario.get('password').reset();
      this.autocompletado.setValue(usuario);
      this.estadoAutocompletado = true;
      setTimeout(function () {
        document.getElementById('idPassword').focus();
      }, 20);
    } else {
      this.estadoAutocompletado = false;
      setTimeout(function () {
        document.getElementById('idAutocompletado').focus();
      }, 20);
    }

  }
  //Establece el formulario al seleccionar un elemento de autocompletado
  public establecerFormulario(): void {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.formulario.get('password').reset();
  }
  //Actualiza un registro
  public actualizarContrasenia() {
    this.loaderService.show();
    this.servicio.actualizarContrasenia(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          if (this.user.rol.id > 2) {
            localStorage.removeItem('token');
            this.router.navigate(['login'], { replaceUrl: true });
          } else {
            this.reestablecerFormulario();
            document.getElementById('idAutocompletado').focus();
          }
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Cambio en campo repetir contraseña
  public cambioRepetirContrasenia(): void {
    let contrasenia = this.formulario.get('password').value;
    let contraseniaRepetida = this.passwordRepeat.value;
    if (contrasenia && contraseniaRepetida) {
      if (contrasenia == contraseniaRepetida) {
        this.estadoContrasenia = true;
      } else {
        this.estadoContrasenia = false;
        document.getElementById('idPasswordRepeat').classList.remove('is-invalid');
        document.getElementById('labelPasswordRepeat').classList.remove('label-error');
      }
    }
  }
  //Verifica la contraseña ingresada
  public verificarContrasenia(): void {
    let contrasenia = this.formulario.get('password').value;
    let contraseniaRepetida = this.passwordRepeat.value;
    if (contrasenia && contraseniaRepetida) {
      if (contrasenia != contraseniaRepetida) {
        this.estadoContrasenia = false;
        document.getElementById('labelPasswordRepeat').classList.add('label-error');
        document.getElementById('idPasswordRepeat').classList.add('is-invalid');
        document.getElementById('idPasswordRepeat').focus();
        this.toastr.error('Las contraseñas ingresadas NO coinciden');
      } else {
        this.estadoContrasenia = true;
      }
    }
  }
  //Habilita el boton agregar si el formulario es valido
  public habilitarBoton(): boolean {
    return !this.formulario.get('password').valid || !this.passwordRepeat.valid || !this.estadoContrasenia || !this.autocompletado.valid;
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.autocompletado.reset();
    this.passwordRepeat.reset();
    this.resultados = [];
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
}