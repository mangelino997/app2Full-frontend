import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolService } from '../../servicios/rol.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Usuario } from 'src/app/modelos/usuario';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados del autocompletado
  public resultados: Array<any> = [];
  //Define campo de control de repetir contraseña
  public passwordRepeat: FormControl = new FormControl('', Validators.required);
  //Define la lista de resultados de autocompletado roles
  public resultadosRoles: Array<any> = [];
  //Define la lista de resultados de autocompletado sucursales
  public resultadosSucursales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'USERNAME', 'ROL', 'ROL_SECUNDARIO', 'SUCURSAL', 'CUENTA_HABILITADA', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el estado de contraseña y repetir contraseña
  public estadoContrasenia: boolean = false;
  //Constructor
  constructor(private servicio: UsuarioService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService,
    private rolServicio: RolService, private sucursalServicio: SucursalService, private usuario: Usuario,
    private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        }, err => { err.json().mensaje }
      );
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
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.usuario.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de roles
    this.listarRoles();
    //Obtiene la lista de sucursales
    this.listarSucursales();
  }
  //Obtiene la lista de roles
  private listarRoles() {
    this.rolServicio.listar().subscribe(res => {
      this.resultadosRoles = res.json();
    })
  }
  //Obtiene la lista de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(res => {
      this.resultadosSucursales = res.json();
    })
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('rol').enable();
      this.formulario.get('sucursal').enable();
      this.formulario.get('cuentaHabilitada').enable();
      this.formulario.get('rolSecundario').enable();
    } else {
      this.formulario.get('rol').disable();
      this.formulario.get('sucursal').disable();
      this.formulario.get('cuentaHabilitada').disable();
      this.formulario.get('rolSecundario').disable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(undefined);
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregar();
        break;
      case 3:
        this.actualizar();
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => { this.toastr.error(err.json().mensaje); }
    );
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let rolSecundario = this.formulario.get('rolSecundario').value;
    rolSecundario == '0' ? this.formulario.get('rolSecundario').setValue(null) : '';
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.passwordRepeat.reset();
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        if (error.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(error.mensaje);
        } else {
          this.toastr.error(error.mensaje);
        }
        this.loaderService.hide();
      });
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    let rolSecundario = this.formulario.get('rolSecundario').value;
    rolSecundario == '0' ? this.formulario.get('rolSecundario').setValue(null) : '';
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        if (error.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(error.mensaje);
        } else {
          this.toastr.error(error.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      }, err => {
        this.toastr.error(err.json().mensaje);
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
    if (this.indiceSeleccionado == 1) {
      return !this.formulario.valid || !this.passwordRepeat.valid || !this.estadoContrasenia;
    } else {
      return !this.formulario.valid;
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.vaciarListas();
    this.formulario.reset();
    this.autocompletado.reset();
    this.formulario.get('id').setValue(id);
  }
  //Vacía las listas
  private vaciarListas() {
    this.resultados = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre,
        username: elemento.username,
        rol: elemento.rol.nombre,
        rol_secundario: elemento.rolSecundario ? elemento.rolSecundario.nombre : null,
        sucursal: elemento.sucursal.nombre,
        cuenta_habilitada: elemento.cuentaHabilitada ? 'Sí' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Usuarios',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}