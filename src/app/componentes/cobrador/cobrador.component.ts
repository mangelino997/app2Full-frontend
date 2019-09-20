import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CobradorService } from '../../servicios/cobrador.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { Cobrador } from 'src/app/modelos/cobrador';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-cobrador',
  templateUrl: './cobrador.component.html',
  styleUrls: ['./cobrador.component.css']
})
export class CobradorComponent implements OnInit {
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
  //Define una lista
  public lista: Array<any> = [];
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
  //Define el nombre original del cobrador que se quiere actualizar
  public nombreOriginal: string = null;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'ESTA HABILITADA', 'CORREO ELECTRONICO', 'POR DEFECTO EN CLIENTE EVENTUAL', 'VER', 'EDITAR'];
  public columnasSeleccionadas: string[] = this.columnas.filter((item, i) => true);
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: CobradorService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService, private cobrador: Cobrador,
    public dialog: MatDialog, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
        })
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
    //Define el formulario y validaciones
    this.formulario = this.cobrador.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.nombreOriginal = this.formulario.value.nombre;
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('estaActivo').enable();
      this.formulario.get('porDefectoClienteEventual').enable();
    } else {
      this.formulario.get('estaActivo').disable();
      this.formulario.get('porDefectoClienteEventual').disable();
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.nombreOriginal = null;
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
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
        this.verificarPrincipal(1); //parametro 1 = agregar
        break;
      case 3:
        this.verificarPrincipal(3); //parametro 3 = actualizar
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Agrega/Actualiza un registro
  private verificarPrincipal(opcionPestania) {
    let elemento = this.formulario.value;
    this.listar();
    if (elemento.porDefectoClienteEventual && this.listaCompleta.data.length>0) {
      this.servicio.obtenerPorDefecto().subscribe(
        res => {
          let respuesta = res.json(); //objeto con porDefectoClienteEventual=true (cobradorPrincipal)
          if(elemento.id == respuesta.id) // Si el cobrador principal es el mismo que se quiere actualizar saltea el modal 'cambiarPrincipal'
            this.controlaAccionPestania(opcionPestania);
            else
              this.cambiarPrincipal(respuesta, elemento, opcionPestania);
        },
        err => {
          this.toastr.warning("Ningún cobrador es por defecto en Cliente Eventual.");
          this.controlaAccionPestania(opcionPestania);
        }
      );
    }
    else {
      this.controlaAccionPestania(opcionPestania);
    }
  }
  //Abre ventana Dialog para cambiar por defecto ClienteEventual
  public cambiarPrincipal(cobradorPrincipal, cobradorAgregar, opcionPestania): void {
    const dialogRef = this.dialog.open(CambiarCobradorPrincipalDialogo, {
      width: '750px',
      data: {
        cobradorPrincipal: cobradorPrincipal,
        cobradorAgregar: cobradorAgregar
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.formulario.get('porDefectoClienteEventual').setValue(result);
      this.controlaAccionPestania(opcionPestania);
    });
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
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
      }
    );
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
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar(cobrador) {
    this.loaderService.show();
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(cobrador).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idNombre').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
      }
    );
  }
  //Actualiza un registro
  private actualizar(cobrador) {
    this.loaderService.show();
    this.servicio.actualizar(cobrador).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario(undefined);
        this.toastr.success(respuesta.mensaje);
        setTimeout(function () {
          document.getElementById('idAutocompletado').focus();
        }, 20);
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        setTimeout(function () {
          document.getElementById('idAutocompletado').focus();
        }, 20);
      }
    )
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.nombreOriginal = elemento.nombre;
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
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
        estahabilitada: elemento.estahabilitada ? 'Si' : 'No',
        correoelectronico: elemento.correoElectronico ? elemento.correoElectronico : '-',
        pordefectoclienteeventual: elemento.porDefectoClienteEventual ? 'Si' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Cobradores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnasSeleccionadas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}

//Componente Cambiar Moneda Principal Dialogo
@Component({
  selector: 'cobrador-principal-dialogo',
  templateUrl: 'cobrador-principal-dialogo.html',
})
export class CambiarCobradorPrincipalDialogo {
  //Define la moneda que se desea agregar
  public cobradorAgregar: string;
  //Define el resultado devuelto
  public result: any;
  //Define la moneda principal actual
  public cobradorPrincipal: string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<CambiarCobradorPrincipalDialogo>, @Inject(MAT_DIALOG_DATA) public data, private servicio: CobradorService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.cobradorAgregar = this.data.cobradorAgregar;
    this.cobradorPrincipal = this.data.cobradorPrincipal;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }

}