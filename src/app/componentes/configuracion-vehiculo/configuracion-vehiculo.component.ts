import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionVehiculoService } from '../../servicios/configuracion-vehiculo.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { configuracionVehiculo } from 'src/app/modelos/configuracionVehiculo';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-configuracion-vehiculo',
  templateUrl: './configuracion-vehiculo.component.html',
  styleUrls: ['./configuracion-vehiculo.component.css']
})
export class ConfiguracionVehiculoComponent implements OnInit {
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
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de configuraciones de vehiculo
  public configuraciones: Array<any> = [];
  //Define la lista de tipos de vehiculos
  public tiposVehiculos: Array<any> = [];
  //Define la lista de marcas de vehiculos
  public marcasVehiculos: Array<any> = [];
   //Define las columnas de la tabla
   public columnas: string[] = ['ID', 'TIPO VEHICULO', 'MARCA VEHICULO', 'MODELO', 'CANTIDAD EJES', 'CAPACIDAD CARGA', 'VER', 'EDITAR'];
   public columnasSeleccionadas:string[] = this.columnas.filter((item, i) => true);
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la marca de vehiculo
  public marcaVehiculo:FormControl = new FormControl();
  //Constructor
  constructor(private servicio: ConfiguracionVehiculoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private appService: AppService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private loaderService: LoaderService, private configuracionVehiculo: configuracionVehiculo, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
          console.log(err);
        }
      );
    //Se subscribe al servicio de lista de registros
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.configuracionVehiculo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista completa de registros
    //this.listar();
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
  }
  //Establece el formulario al seleccionar elemento de lista de configuraciones
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
    this.formulario.get('capacidadCarga').setValue(elemento.capacidadCarga != 0 ? this.appService.establecerDecimales(elemento.capacidadCarga, 2) : null);
    this.formulario.get('tara').setValue(elemento.tara ? this.appService.establecerDecimales(elemento.tara, 2) : null);
    this.formulario.get('altura').setValue(elemento.altura ? this.appService.establecerDecimales(elemento.altura, 2) : null);
    this.formulario.get('largo').setValue(elemento.largo ? this.appService.establecerDecimales(elemento.largo, 2) : null);
    this.formulario.get('ancho').setValue(elemento.ancho ? this.appService.establecerDecimales(elemento.ancho, 2) : null);
    this.formulario.get('m3').setValue(elemento.m3 != 0 ? this.appService.establecerDecimales(elemento.m3, 2) : null);
  }
  //Obtiene la lista de tipos de vehiculos
  private listarTiposVehiculos() {
    this.tipoVehiculoServicio.listar().subscribe(
      res => {
        this.tiposVehiculos = res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  private listarMarcasVehiculos() {
    this.marcaVehiculoServicio.listar().subscribe(
      res => {
        this.marcasVehiculos = res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('cantidadEjes').enable();
    } else {
      this.formulario.get('cantidadEjes').disable();
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
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoVehiculo');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoVehiculo');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoVehiculo');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoVehiculo');
        break;
      case 5:
        this.marcaVehiculo.reset();
        setTimeout(function() {
          document.getElementById('idMarcaVehiculo').focus();
        }, 20);
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
      err => {
        console.log(err);
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
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Obtiene la lista de configuracion de vehiculos por tipo y marca
  public listarPorTipoVehiculoMarcaVehiculo() {
    let tipoVehiculo = this.formulario.get('tipoVehiculo').value;
    let marcaVehiculo = this.formulario.get('marcaVehiculo').value;
    if (tipoVehiculo && marcaVehiculo && this.mostrarAutocompletado) {
      this.servicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id).subscribe(
        res => {
          this.configuraciones = res.json();
        },
        err => {
          console.log(err);
        }
      )
    }
  }
  //Obtiene una lista por marca de vehiculo
  public listarPorMarcaVehiculo(): void {
    this.loaderService.show();
    let marcaVehiculo = this.marcaVehiculo.value;
    this.servicio.listarPorMarcaVehiculo(marcaVehiculo.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
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
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje, 'No se puede eliminar');
        this.loaderService.hide();
      }
    );
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.configuraciones = [];
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
    this.listarPorTipoVehiculoMarcaVehiculo();
    this.autocompletado.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
    this.listarPorTipoVehiculoMarcaVehiculo();
    this.autocompletado.setValue(elemento);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if(valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el numero a x decimales
  public desenmascararEnteros(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerEnteros(valor));
    }
  }
  //Formatea el numero a x decimales
  public establecerEnteros(valor, cantidad) {
    if (valor != '') {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: '
        + elemento.cantidadEjes + ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
    } else {
      return elemento;
    }
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
        let f = {
          id: elemento.id,
          tipovehiculo: elemento.tipoVehiculo.nombre,
          marcavehiculo: elemento.marcaVehiculo.nombre,
          modelo: elemento.modelo,
          cantidadejes: elemento.cantidadEjes,
          capacidadcarga: elemento.capacidadCarga
        }
        datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Configuraciones Vehiculos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnasSeleccionadas
    }
    this.reporteServicio.abrirDialogo(datos);
  } 
}