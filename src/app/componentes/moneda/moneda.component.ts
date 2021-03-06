import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { Moneda } from 'src/app/modelos/moneda';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.css']
})
export class MonedaComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
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
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'ESTA_ACTIVO', 'MONEDA_PRINCIPAL', 'CODIGO_AFIP', 'SIMBOLO', 'EDITAR'];
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
  constructor(private moneda: Moneda, private servicio: MonedaService,
    private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService,
    private toastr: ToastrService, public dialog: MatDialog, private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorNombre(data).subscribe(res => {
            this.resultados = res.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    });
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.moneda.formulario;
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    /* Limpia el formulario para no mostrar valores en campos cuando 
      la pestaña es != 1 */
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
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
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('nombre').enable();
      this.formulario.get('estaActivo').enable();
      this.formulario.get('porDefecto').enable();
    } else {
      this.formulario.get('nombre').disable();
      this.formulario.get('estaActivo').disable();
      this.formulario.get('porDefecto').disable();
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.verificarPrincipal(1); //agregar
        break;
      case 3:
        this.verificarPrincipal(3); //actualizar
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
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
  //Agrega un registro
  private verificarPrincipal(opcionPestania) {
    let elemento = this.formulario.value;
    if (elemento.porDefecto && this.listaCompleta.data.length > 0) {
      this.servicio.obtenerPorDefecto().subscribe(
        res => {
          //obtiene la moneda porDefecto=true (monedaPrincipal)
          let respuesta = res.json();

          // Si el cobrador principal es el mismo que se quiere actualizar saltea el modal 'cambiarPrincipal'
          elemento.id == respuesta.id ? this.controlaAccionPestania(opcionPestania) : this.cambiarPrincipal(respuesta, elemento, opcionPestania);
        },
        err => {
          this.toastr.warning("No hay Moneda por defecto.");
          this.controlaAccionPestania(opcionPestania);
        }
      );
    }
    else {
      this.controlaAccionPestania(opcionPestania);
    }
  }
  //Controlar acción pestaña - Si el usuario está en la pestaña 'Agregar' o en 'Actualizar' llama a su método correspondiente.
  private controlaAccionPestania(opcionPestania) {
    if (opcionPestania == 1) {
      this.agregar(this.formulario.value);
    }
    if (opcionPestania == 3) {
      this.actualizar(this.formulario.value);
    }
  }
  //Metodo Agregar Moneda
  private agregar(moneda) {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(moneda).subscribe(
      res => {
        let respuesta = res.json();
        this.ultimoId = respuesta.id;
        this.reestablecerFormulario(respuesta.id);
        document.getElementById('idNombre').focus();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar(moneda) {
    this.loaderService.show();
    this.servicio.actualizar(moneda).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          this.servicio.obtenerPorDefecto().subscribe(
            res => {
              /*Si el usuario modificó el campo porDefecto a false pero el service no modificó el atributo 
              porque no puede quedar sin moneda principal el sistema */
              moneda.id == res.json().id && moneda.porDefecto == 'false' && res.json().porDefecto ?
                this.toastr.error("No se modificó el atributo moneda pricipal. No puede quedar sin moneda principal.") :
                this.toastr.success("Registro actualizado con éxito.");
            })
          document.getElementById('idAutocompletado').focus();
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    let formulario = this.formulario.value;
    this.servicio.eliminar(formulario.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        if (error.codigo == 500) {
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
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let error = err.json();
    if (error.codigo == 11002) {
      document.getElementById("labelNombre").classList.add('label-error');
      document.getElementById("idNombre").classList.add('is-invalid');
      document.getElementById("idNombre").focus();
    }
    this.toastr.error(error.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.vaciarListas();
    this.formulario.reset();
    this.autocompletado.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
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
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
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
  /*Abre ventana Dialog nueva Moneda Principal
    *opcion define la accion a ejecutar (agregar==1/actualizar==3)
  */
  public cambiarPrincipal(monedaPrincipal, monedaAgregar, opcion): void {
    const dialogRef = this.dialog.open(CambiarMonedaPrincipalDialogo, {
      width: '750px',
      data: {
        monedaPrincipal: monedaPrincipal,
        monedaAgregar: monedaAgregar
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.formulario.get('porDefecto').setValue(result);
      if (opcion == 1) {
        this.agregar(this.formulario.value);
      }
      if (opcion == 3) {
        this.actualizar(this.formulario.value);
      }
    });
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
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
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
        esta_activo: elemento.estaActivo ? 'Si' : 'No',
        moneda_principal: elemento.porDefecto ? 'Si' : 'No',
        codigo_afip: elemento.codigoAfip,
        simbolo: elemento.simbolo
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Monedas',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
//Componente Cambiar Moneda Principal Dialogo
@Component({
  selector: 'cambiar-principal-dialogo',
  templateUrl: 'cambiar-principal-dialogo.html',
})
export class CambiarMonedaPrincipalDialogo {
  //Define la moneda que se desea agregar
  public monedaAgregar: string;
  //Define el resultado devuelto
  public result: any;
  //Define la moneda principal actual
  public monedaPrincipal: string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<CambiarMonedaPrincipalDialogo>, @Inject(MAT_DIALOG_DATA) public data, private servicio: MonedaService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.monedaAgregar = this.data.monedaAgregar;
    this.monedaPrincipal = this.data.monedaPrincipal;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }

}