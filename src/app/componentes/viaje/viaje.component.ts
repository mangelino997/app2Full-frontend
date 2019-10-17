import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajeTramoComponent } from './viaje-tramo/viaje-tramo.component';
import { ViajeGastoComponent } from './viaje-gasto/viaje-gasto.component';
import { ViajeInsumoComponent } from './viaje-insumo/viaje-insumo.component';
import { ViajePeajeComponent } from './viaje-peaje/viaje-peaje.component';
import { ViajeRemitoGSComponent } from './viaje-remito-gs/viaje-remito-gs.component';
import { AppService } from 'src/app/servicios/app.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { Viaje } from 'src/app/modelos/viaje';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { MatSort, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ViajeEfectivoComponent } from './viaje-efectivo/viaje-efectivo.component';
import { ViajeCombustibleComponent } from './viaje-combustible/viaje-combustible.component';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.css']
})
export class ViajeComponent implements OnInit {
  //Define los componentes hijos
  @ViewChild(ViajeTramoComponent, { static: false }) viajeTramoComponente;
  @ViewChild(ViajeCombustibleComponent, { static: false }) viajeCombustibleComponente;
  @ViewChild(ViajeEfectivoComponent, { static: false }) viajeEfectivoComponente;
  @ViewChild(ViajeGastoComponent, { static: false }) viajeGastoComponente;
  @ViewChild(ViajeInsumoComponent, { static: false }) viajeInsumoComponente;
  @ViewChild(ViajePeajeComponent, { static: false }) viajePeajeComponente;
  @ViewChild(ViajeRemitoGSComponent, { static: false }) viajeRemitoGSComponente;
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
  //Define el formulario para filtros
  public formularioFiltros: FormGroup;
  //Define un formulario viaje propio para validaciones de campos
  public formularioViaje: FormGroup;
  //Define un formulario viaje  tramo para validaciones de campos
  public formularioViajeTramo: FormGroup = new FormGroup({
    lista: new FormControl('', Validators.required)
  });
  //Define un formulario viaje  combustible para validaciones de campos
  public formularioViajeCombustible: FormGroup = new FormGroup({});
  //Define un formulario viaje  efectivo para validaciones de campos
  public formularioViajeEfectivo: FormGroup = new FormGroup({});
  //Define un formulario viaje  insumo para validaciones de campos
  public formularioViajeInsumo: FormGroup = new FormGroup({});
  //Define un formulario viaje remitos dadores de carga para validaciones de campos
  public formularioViajeRemitoDC: FormGroup = new FormGroup({});
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito: FormGroup = new FormGroup({});
  //Define un formulario viaje  gasto para validaciones de campos
  public formularioViajeGasto: FormGroup = new FormGroup({});
  //Define un formulario viaje  peaje para validaciones de campos
  public formularioViajePeaje: FormGroup = new FormGroup({});
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de vehiculos
  public resultadosVehiculos: Array<any> = [];
  //Define la lista de resultados de vehiculos remolques
  public resultadosVehiculosRemolques: Array<any> = [];
  //Define la lista de resultados de choferes
  public resultadosChoferes: Array<any> = [];
  //Define la lista de resultados de personales
  public resultadosPersonales: Array<any> = [];
  //Define la lista de resultados de proveedores
  public resultadosProveedores: Array<any> = [];
  //Define el tipo de viaje (Propio o Tercero)
  public tipoViaje: FormControl = new FormControl();
  //Define el nombre del usuario logueado
  public usuarioNombre: FormControl = new FormControl();
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define si la lista de tramos tiene registros
  public estadoFormulario: boolean = true;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el render de los componentes
  public render: boolean = false;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'EMPRESA_EMISION', 'SUCURSAL', 'FECHA', 'VEHICULO', 'CHOFER', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: ViajeService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService, private vehiculoProveedorService: VehiculoProveedorService,
    private personalServicio: PersonalService, private viajePropioModelo: Viaje, private dialog: MatDialog,
    private choferProveedorServicio: ChoferProveedorService, private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => { }
      );
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario para filtros
    this.formularioFiltros = new FormGroup({
      idViaje: new FormControl(),
      fechaDesde: new FormControl(),
      fechaHasta: new FormControl(),
      personal: new FormControl(),
      proveedor: new FormControl()
    });
    //Establece el formulario viaje propio
    this.formularioViaje = this.viajePropioModelo.formulario;
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(22, 0);
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece validaciones de formulario
    this.cambioTipoViaje();
    this.cambioTipoRemolque();
    //Autocompletado Vehiculo - Buscar por alias
    this.formularioViaje.get('vehiculo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoServicio.listarPorAliasYRemolqueFalse(data).subscribe(response => {
          this.resultadosVehiculos = response;
        })
      }
    })
    //Autocompletado Personal - Buscar por alias
    this.formularioViaje.get('vehiculoProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoProveedorService.listarPorAlias(data).subscribe(response => {
          this.resultadosVehiculos = response;
        })
      }
    })
    //Autocompletado Vehiculo Remolque - Buscar por alias
    this.formularioViaje.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoServicio.listarPorAliasYRemolqueTrue(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Vehiculo Remolque - Buscar por alias
    this.formularioViaje.get('vehiculoRemolqueProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoProveedorService.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Personal - Buscar por alias
    this.formularioViaje.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarChoferesPorDistanciaPorAlias(data, true).subscribe(res => {
          this.resultadosChoferes = res.json();
        })
      }
    })
    //Autocompletado Proveedor Chofer - Buscar por alias
    this.formularioViaje.get('choferProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        let vehiculoProveedor = this.formularioViaje.get('vehiculoProveedor').value;
        if (vehiculoProveedor) {
          this.choferProveedorServicio.listarPorAliasYProveedor(data, vehiculoProveedor.proveedor.id).subscribe(res => {
            this.resultadosChoferes = res.json();
          });
        }
      }
    })
    //Autocompletado Personal - Buscar por alias - Filtros
    this.formularioFiltros.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarChoferesPorDistanciaPorAlias(data, true).subscribe(res => {
          this.resultadosPersonales = res.json();
        })
      }
    })
    //Autocompletado Proveedor - Buscar por alias - Filtros
    this.formularioFiltros.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarPorAlias(data).subscribe(res => {
          this.resultadosProveedores = res.json();
        })
      }
    })
  }
  //Establece validaciones de formulario al cambiar tipo de viaje
  public cambioTipoViaje(): void {
    this.formularioViaje.get('vehiculo').reset();
    this.formularioViaje.get('personal').reset();
    this.formularioViaje.get('vehiculoProveedor').reset();
    this.formularioViaje.get('choferProveedor').reset();
    this.resultadosVehiculos = [];
    this.resultadosChoferes = [];
    let tipoViaje = this.formularioViaje.get('esViajePropio').value;
    if (tipoViaje) {
      this.formularioViaje.get('vehiculo').setValidators(Validators.required);
      this.formularioViaje.get('vehiculo').updateValueAndValidity();
      this.formularioViaje.get('personal').setValidators(Validators.required);
      this.formularioViaje.get('personal').updateValueAndValidity();
      this.formularioViaje.get('vehiculoProveedor').setValidators([]);
      this.formularioViaje.get('vehiculoProveedor').updateValueAndValidity();
      this.formularioViaje.get('choferProveedor').setValidators([]);
      this.formularioViaje.get('choferProveedor').updateValueAndValidity();
    } else {
      this.formularioViaje.get('vehiculo').setValidators([]);
      this.formularioViaje.get('vehiculo').updateValueAndValidity();
      this.formularioViaje.get('personal').setValidators([]);
      this.formularioViaje.get('personal').updateValueAndValidity();
      this.formularioViaje.get('vehiculoProveedor').setValidators(Validators.required);
      this.formularioViaje.get('vehiculoProveedor').updateValueAndValidity();
      this.formularioViaje.get('choferProveedor').setValidators(Validators.required);
      this.formularioViaje.get('choferProveedor').updateValueAndValidity();
    }
  }
  //Establece validaciones de formulario al cambiar tipo de remolque
  public cambioTipoRemolque(): void {
    this.formularioViaje.get('vehiculoRemolque').reset();
    this.formularioViaje.get('vehiculoRemolqueProveedor').reset();
    this.resultadosVehiculosRemolques = [];
    let tipoRemolque = this.formularioViaje.get('esRemolquePropio').value;
    if (tipoRemolque) {
      this.formularioViaje.get('vehiculoRemolque').setValidators(Validators.required);
      this.formularioViaje.get('vehiculoRemolque').updateValueAndValidity();
      this.formularioViaje.get('vehiculoRemolqueProveedor').setValidators([]);
      this.formularioViaje.get('vehiculoRemolqueProveedor').updateValueAndValidity();
    } else {
      this.formularioViaje.get('vehiculoRemolque').setValidators([]);
      this.formularioViaje.get('vehiculoRemolque').updateValueAndValidity();
      this.formularioViaje.get('vehiculoRemolqueProveedor').setValidators(Validators.required);
      this.formularioViaje.get('vehiculoRemolqueProveedor').updateValueAndValidity();
    }
  }
  //Establece el id viaje en componentes hijo
  public establecerIdViajeEnHijos(idViaje) {
    this.viajeCombustibleComponente.establecerIdViaje(idViaje);
    this.viajeEfectivoComponente.establecerIdViaje(idViaje);
    this.viajeInsumoComponente.establecerIdViaje(idViaje);
    this.viajeGastoComponente.establecerIdViaje(idViaje);
    this.viajePeajeComponente.establecerIdViaje(idViaje);
    this.viajeRemitoGSComponente.establecerIdViaje(idViaje);
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formularioViaje.reset();
    this.formularioViajeTramo.reset();
    this.formularioViajeCombustible.reset();
    this.formularioViajeEfectivo.reset();
    this.formularioViajeInsumo.reset();
    this.formularioViajeRemito.reset();
    this.formularioViajeGasto.reset();
    this.formularioViajePeaje.reset();
    this.formularioFiltros.reset();
    this.estadoFormulario = true;
  }
  //Obtiene la lista de viajes por filtros
  public listarViajesPorFiltros(): void {
    this.loaderService.show();
    this.servicio.listarPorFiltros(this.formularioFiltros.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.length == 0) {
          this.toastr.warning(MensajeExcepcion.SIN_REGISTROS);
          this.loaderService.hide();
        } else if(respuesta.length == 1) {
          this.loaderService.hide();
          this.establecerViaje(respuesta[0].id);
        } else {
          this.loaderService.hide();
          const dialogRef = this.dialog.open(ListarViajesDialogo, {
            width: '95%',
            maxWidth: '95%',
            data: {
              lista: respuesta
            }
          });
          dialogRef.afterClosed().subscribe(resultado => { 
            if(resultado) {
              this.establecerViaje(resultado);
            }
          });
        }
      },
      err => {

      }
    );
  }
  //Establece el formulario y listas al buscar por filtros
  public establecerViaje(id): void {
    this.loaderService.show();
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        let respuesta = res.json();
        this.formularioViaje.patchValue(respuesta);
        this.viajeTramoComponente.establecerLista(respuesta.viajeTramos, respuesta.id, this.indiceSeleccionado);
        this.viajeCombustibleComponente.establecerLista(respuesta.viajeCombustibles, respuesta.id, this.indiceSeleccionado);
        this.viajeEfectivoComponente.establecerLista(respuesta.viajeEfectivos, respuesta.id, this.indiceSeleccionado);
        this.viajeInsumoComponente.establecerLista(respuesta.viajeInsumos, respuesta.id, this.indiceSeleccionado);
        this.viajeGastoComponente.establecerLista(respuesta.viajeGastos, respuesta.id, this.indiceSeleccionado);
        this.viajePeajeComponente.establecerLista(respuesta.viajePeajes, respuesta.id, this.indiceSeleccionado);
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    let usuario = this.appService.getUsuario();
    let sucursal = this.appService.getUsuario().sucursal;
    let empresa = this.appService.getEmpresa();
    this.usuarioNombre.setValue(usuario.nombre);
    this.tipoViaje.setValue(true);
    this.formularioViaje.get('esViajePropio').setValue(true);
    this.formularioViaje.get('esRemolquePropio').setValue(true);
    this.formularioViaje.get('sucursal').setValue(sucursal);
    this.formularioViaje.get('empresaEmision').patchValue(empresa);
    this.formularioViaje.get('afipCondicionIva').setValue(empresa.afipCondicionIva);
    this.formularioViaje.get('usuarioAlta').setValue(usuario);
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViaje.get('fecha').setValue(res.json());
    });
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosVehiculos = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosChoferes = [];
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
        this.render = true;
        setTimeout(function() {
          document.getElementById('idFecha').focus();
        });
        this.establecerValoresPorDefecto();
      },
      err => {
      }
    );
  }
  //Establece los campos select en solo lectura
  private establecerCamposSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViaje.get('esViajePropio').disable();
      this.formularioViaje.get('esRemolquePropio').disable();
      this.formularioViaje.get('sucursal').disable();
    } else {
      this.formularioViaje.get('esViajePropio').enable();
      this.formularioViaje.get('esRemolquePropio').enable();
      this.formularioViaje.get('sucursal').enable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    //Ejecuta los siguientes metodos solo cuando el componente esta incializado
    if (this.viajeTramoComponente) {
      this.viajeTramoComponente.reestablecerFormulario();
      this.viajeTramoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if (this.viajeCombustibleComponente) {
      this.viajeCombustibleComponente.reestablecerFormulario();
      this.viajeCombustibleComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if (this.viajeEfectivoComponente) {
      this.viajeEfectivoComponente.reestablecerFormulario();
      this.viajeEfectivoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if (this.viajeInsumoComponente) {
      this.viajeInsumoComponente.reestablecerFormulario();
      this.viajeInsumoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if (this.viajeRemitoGSComponente) {
      this.viajeRemitoGSComponente.reestablecerFormularioGS(this.indiceSeleccionado);
    }
    if (this.viajeGastoComponente) {
      this.viajeGastoComponente.reestablecerFormulario();
      this.viajeGastoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if (this.viajePeajeComponente) {
      this.viajePeajeComponente.reestablecerFormulario();
      this.viajePeajeComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario();
    this.establecerValoresPorDefecto();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerCamposSoloLectura(false);
        this.estadoFormulario = true;
        this.establecerValoresPestania(nombre, false, false, true);
        break;
      case 2:
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, false);
        break;
      case 3:
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, false, true);
        break;
      case 4:
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true);
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch (opcion) {
      case 1:
        setTimeout(function () {
          document.getElementById('idFecha').focus();
        }, 20);
        break;
      case 2:
        setTimeout(function () {
          document.getElementById('idCondicionVenta').focus();
        }, 20);
        break;
      case 3:
        setTimeout(function () {
          document.getElementById('idEsSeguroPropio').focus();
        }, 20);
        break;
      case 4:
        setTimeout(function () {
          document.getElementById('idObservaciones').focus();
        }, 20);
        break;
      case 5:
        setTimeout(function () {
          document.getElementById('idEmitirComprobante').focus();
        }, 20);
        break;
    }
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formularioViaje.get('id').setValue(res.json());
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
  //Recibe la lista de tramos de Viaje Tramos
  public recibirTramos($event) {
    let lista = $event[0];
    let idViaje = $event[1];
    this.establecerIdViajeEnHijos(idViaje);
    this.formularioViajeTramo.get('lista').setValue(lista);
    this.estadoFormulario = lista.length > 0 ? false : true;
    this.viajeRemitoGSComponente.establecerTramos(lista);
  }
  //Finaliza un viaje
  public finalizar(): void {
    this.reestablecerFormulario();
    this.obtenerSiguienteId();
    this.establecerValoresPorDefecto();
    this.viajeTramoComponente.finalizar();
    this.viajeCombustibleComponente.finalizar();
    this.viajeEfectivoComponente.finalizar();
    this.viajeInsumoComponente.finalizar();
    this.viajeGastoComponente.finalizar();
    this.viajePeajeComponente.finalizar();
    this.indiceSeleccionado == 1 ? document.getElementById('idFecha').focus() : document.getElementById('idViaje').focus();
    switch (this.indiceSeleccionado) {
      case 1:
        this.toastr.success(MensajeExcepcion.AGREGADO);
        break;
      case 3:
        this.toastr.success(MensajeExcepcion.ACTUALIZADO);
        break;
      case 4:
        this.toastr.success(MensajeExcepcion.ELIMINADO);
        break;
    }
  }
  //Verifica el estado del formulario
  public obtenerEstadoFormulario(formulario, estado) {
    return formulario && estado ? false : true;
  }
  public onStepChange(event: any): void {
    switch (event.selectedIndex) {
      case 0:
        this.viajeTramoComponente.establecerFoco();
        break;
      case 1:
        this.viajeCombustibleComponente.establecerFoco();
        break;
      case 2:
        this.viajeEfectivoComponente.establecerFoco();
        break;
      case 3:
        this.viajeInsumoComponente.establecerFoco();
        break;
      case 4:
        break;
      case 5:
        // this.viajeRemitoGSComponente.establecerFoco();
        break;
      case 6:
        this.viajeGastoComponente.establecerFoco();
        break;
      case 7:
        this.viajePeajeComponente.establecerFoco();
        break;
    }
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formularioViaje.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'sitioWeb') {
          document.getElementById("labelSitioWeb").classList.add('label-error');
          document.getElementById("idSitioWeb").classList.add('is-invalid');
          this.toastr.error('Sitio Web Incorrecto');
        }
      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.formularioViaje.patchValue(elemento);
    this.establecerValoresPorDefecto();
    this.establecerViaje(elemento.id);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    // this.appService.setViajeCabecera(elemento);
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.formularioViaje.patchValue(elemento);
    this.establecerValoresPorDefecto();
    this.establecerViaje(elemento.id);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.dominio ? elemento.dominio : elemento;
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        empresa_emision: elemento.empresaEmision ? elemento.empresaEmision.razonSocial : '--',
        sucursal: elemento.sucursal ? elemento.sucursal.nombre : '--',
        fecha: elemento.fecha,
        vehiculo: elemento.vehiculo ? elemento.vehiculo.dominio : '--',
        chofer: elemento.personal ? elemento.personal.nombreCompleto : '--'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Guías de Servicio',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
// Componente ListarViajesDialogo
@Component({
  selector: 'listar-viajes-dialogo',
  templateUrl: './listar-viajes-dialogo.component.html',
  styleUrls: ['./viaje.component.css']
})
export class ListarViajesDialogo {
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'empresa', 'sucursal', 'fecha', 'vehiculo', 'remolque', 'chofer', 'seleccionar'];
  //Define la lista de dadores-destinatarios
  public listaCompleta = new MatTableDataSource([]);
  //Define el ordenador
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  //Define el paginador
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ListarViajesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    this.listaCompleta = new MatTableDataSource(this.data.lista);
    this.listaCompleta.sort = this.sort;
    this.listaCompleta.paginator = this.paginator;
  }
  public cerrar(): void {
    this.dialogRef.close();
  }
}