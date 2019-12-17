import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MonedaCuentaContable } from 'src/app/modelos/moneda-cuenta-contable';
import { MonedaCuentaContableService } from 'src/app/servicios/moneda-cuenta-contable.service';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { PlanCuentaDialogo } from '../plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';

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
  nivel: number;
  hijos: Arbol[];
}

export class Nodo {
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
  nivel: number;
  hijos: Arbol[];
  level: number;
  expandable: boolean;
  editable: boolean;
  mostrarBotones: boolean;
}

@Component({
  selector: 'app-moneda-cuenta-contable',
  templateUrl: './moneda-cuenta-contable.component.html',
  styleUrls: ['./moneda-cuenta-contable.component.css']
})
export class MonedaCuentaContableComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
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
  //Define la lista de Monedas
  public listaMonedas: Array<any> = [];
  //Define la lista de Empresas
  public listaEmpresas: Array<any> = [];
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la  empresa del Login
  public empresa: FormControl = new FormControl();
  //Define las columnas de la tabla
  public columnas: string[] = ['MONEDA', 'EMPRESA', 'CUENTA_CONTABLE', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: MonedaCuentaContableService, private monedaCuentaContable: MonedaCuentaContable,
    private loaderService: LoaderService, private appService: AppService,
    public dialog: MatDialog, private toastr: ToastrService, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por nombre cliente
    let empresa = this.appService.getEmpresa();
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorNombreMoneda(data, empresa.id).subscribe(response => {
            this.resultados = response.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    });
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.monedaCuentaContable.formulario;
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getUsuario().id, this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idUsuario, idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idUsuario, idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        console.log(respuesta);
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.listaMonedas = respuesta.monedas;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
    this.servicio.listarPorEmpresa(empresa.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
        this.listaCompleta.data.length == 0 ? this.toastr.warning("Sin registros para mostrar.") : '';
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Controla el cambio en Moneda Cuenta Contable
  public cambioMonedaCuentaContable() {
    if (this.indiceSeleccionado > 1) {
      this.servicio.obtenerPorMonedaYEmpresa(this.formulario.value.moneda.id, this.formulario.value.empresa.id).subscribe(
        res => {
          if (res.text()) {
            let respuesta = res.json();
            this.formulario.get('planCuenta').setValue(respuesta.planCuenta);
          } else {
            this.formulario.get('planCuenta').reset();
          }
        },
        err => {
        }
      )
    }
  }
  //Obtiene el listado de registros
  private obtenerEmpresa() {
    let empresa = this.appService.getEmpresa();
    this.empresa.setValue(empresa.razonSocial);
    this.formulario.get('empresa').setValue(empresa);
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    soloLectura ? this.formulario.get('moneda').disable() : this.formulario.get('moneda').enable();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no
    * cuando se hace click en ver o mod de la pestania listar
    */
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idMoneda');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Funcion para determinar que accion se requiere (Agregar, Actualizar, Eliminar)
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
  //Agrega un registro
  private agregar(): void {
    this.loaderService.show();
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          document.getElementById('idMoneda').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar(): void {
    this.loaderService.show();
    this.formulario.get('moneda').enable();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.formulario.get('moneda').disable();
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
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
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Reestablece los campos formularios
  private reestablecerFormulario() {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    this.obtenerEmpresa();
  }
  //Establece el formulario
  public establecerFormulario(): void {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.formulario.value.moneda = elemento.moneda;
    this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4 ? this.formulario.get('moneda').disable() : this.formulario.get('moneda').enable();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.formulario.patchValue(elemento);
    this.autocompletado.setValue(elemento);
    this.empresa.setValue(this.formulario.get('empresa').value.razonSocial);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.formulario.patchValue(elemento);
    this.autocompletado.setValue(elemento);
    this.empresa.setValue(this.formulario.get('empresa').value.razonSocial);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.moneda ? elemento.moneda.nombre + ' - ' + elemento.empresa.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.planCuenta ? elemento.planCuenta.nombre + elemento.planCuenta.grupoCuentaContable ? ' - ' + elemento.planCuenta.grupoCuentaContable : '' : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado
  public displayFp(elemento) {
    if (elemento != undefined) {
      return elemento ? elemento.nombre + elemento.tipoCuentaContable ? elemento.nombre + ' - ' + elemento.tipoCuentaContable.nombre : '' : elemento;
    } else {
      return elemento;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
      this.formulario.reset();
      this.formulario.get('moneda').disable();
    }
  }
  //Abre el dialogo Plan de Cuenta
  public abrirPlanCuentaDialogo() {
    const dialogRef = this.dialog.open(PlanCuentaDialogo, {
      width: '70%',
      height: '70%',
      data: {
        empresa: this.formulario.get('empresa').value,
        grupoCuentaContable: 1
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.formulario.get('planCuenta').setValue(resultado);
      }
    });
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        moneda: elemento.moneda.nombre,
        empresa: elemento.empresa.razonSocial,
        cuenta_contable: elemento.planCuenta.nombre
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Monedas Cuentas Contables',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}