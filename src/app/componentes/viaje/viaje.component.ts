import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajeTramoComponent } from './viaje-tramo/viaje-tramo.component';
import { ViajeCombustibleComponent } from './viaje-combustible/viaje-combustible.component';
import { ViajeEfectivoComponent } from './viaje-efectivo/viaje-efectivo.component';
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
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.css']
})
export class ViajeComponent implements OnInit {
  //Define los componentes hijos
  @ViewChild(ViajeTramoComponent) viajeTramoComponente;
  @ViewChild(ViajeCombustibleComponent) viajeCombustibleComponente;
  @ViewChild(ViajeEfectivoComponent) viajeEfectivoComponente;
  @ViewChild(ViajeGastoComponent) viajeGastoComponente;
  @ViewChild(ViajeInsumoComponent) viajeInsumoComponente;
  @ViewChild(ViajePeajeComponent) viajePeajeComponente;
  @ViewChild(ViajeRemitoGSComponent) viajeRemitoGSComponente;
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si los campos de la cebecera son de solo lectura
  public soloLecturaCabecera: boolean = false;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el id del Viaje que se quiere modificar
  public idMod: number = null;
  //Define la lista de opciones
  // public opciones: Array<any> = [];
  //Define un formulario viaje propio para validaciones de campos
  public formularioViaje: FormGroup;
  //Define un formulario viaje  tramo para validaciones de campos
  public formularioViajeTramo: FormGroup = new FormGroup({});
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
  public listaCompleta= new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de vehiculos
  public resultadosVehiculos: Array<any> = [];
  //Define la lista de resultados de vehiculos remolques
  public resultadosVehiculosRemolques: Array<any> = [];
  //Define la lista de resultados de choferes
  public resultadosChoferes: Array<any> = [];
  //Define el tipo de viaje (Propio o Tercero)
  public tipoViaje: FormControl = new FormControl();
  //Define el nombre del usuario logueado
  public usuarioNombre: FormControl = new FormControl();
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define una bandera para campos solo lectura de componentes hijos
  public banderaSoloLectura: boolean = false;
  //Define si la lista de tramos tiene registros
  public estadoFormulario: boolean = false;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el render de los componentes
  public render:boolean = false;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'empresaEmision', 'sucursal', 'fecha', 'vehiculo', 'chofer', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: ViajeService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService, private vehiculoProveedorService: VehiculoProveedorService,
    private personalServicio: PersonalService, private viajePropioModelo: Viaje,
    private choferProveedorServicio: ChoferProveedorService, private loaderService: LoaderService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {}
      );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
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
    //Establece el formulario viaje propio
    this.formularioViaje = this.viajePropioModelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(22, 0);
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
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
        this.personalServicio.listarChoferesLargaDistanciaPorAlias(data).subscribe(res => {
          this.resultadosChoferes = res.json();
        })
      }
    })
    //Autocompletado Proveedor Chofer - Buscar por alias
    this.formularioViaje.get('choferProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        let vehiculoProveedor = this.formularioViaje.get('vehiculoProveedor').value;
        if(vehiculoProveedor) {
          this.choferProveedorServicio.listarPorAliasYProveedor(data, vehiculoProveedor.proveedor.id).subscribe(res => {
            this.resultadosChoferes = res.json();
          });
        }
      }
    })
    
  }
  //Establece el formulario y listas al seleccionar un elemento del autocompletado
  public cambioAutocompletado(): void {
    let viaje = this.autocompletado.value;
    this.idMod = this.autocompletado.value.id;
    this.servicio.obtenerPorId(viaje.id).subscribe(res => {
      let viajeRes = res.json();
      console.log(this.autocompletado.value);
      this.formularioViaje.patchValue(viajeRes);
       // Le paso el IndiceSeleccionado
      this.viajeTramoComponente.establecerLista(viaje.viajeTramos, viaje, this.indiceSeleccionado);
      this.viajeCombustibleComponente.establecerLista(viaje.viajeCombustibles, viaje, this.indiceSeleccionado);
      this.viajeEfectivoComponente.establecerLista(viaje.viajeEfectivos, viaje, this.indiceSeleccionado);
      this.viajeInsumoComponente.establecerLista(viaje.viajeInsumos, viaje, this.indiceSeleccionado);
      this.viajeGastoComponente.establecerLista(viaje.viajeGastos, viaje, this.indiceSeleccionado);
      this.viajePeajeComponente.establecerLista(viaje.viajePeajes, viaje, this.indiceSeleccionado);
    });
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    let usuario = this.appService.getUsuario();
    let sucursal = this.appService.getUsuario().sucursal;
    let empresa = this.appService.getEmpresa();
    this.usuarioNombre.setValue(usuario.nombre);
    console.log("entra a val def");
    this.tipoViaje.setValue(true);
    console.log(this.formularioViaje.value, this.indiceSeleccionado, empresa);
    this.formularioViaje.get('esViajePropio').setValue(true);
    this.formularioViaje.get('esRemolquePropio').setValue(true);
    this.formularioViaje.get('sucursal').setValue(sucursal);
    this.formularioViaje.get('empresaEmision').patchValue(empresa);
    this.formularioViaje.get('afipCondicionIva').setValue(empresa.afipCondicionIva);
    this.formularioViaje.get('usuarioAlta').setValue(usuario);
    this.fechaServicio.obtenerFecha().subscribe(res => {     //Establece la fecha actual
      this.formularioViaje.get('fecha').setValue(res.json());
    })
    console.log(this.formularioViaje.value, this.indiceSeleccionado);

  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosVehiculos = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosChoferes = [];
  }
  //Vacia la lista de componentes hijos
  private vaciarListasHijos() {
    this.viajeCombustibleComponente.vaciarListas();
    this.viajeEfectivoComponente.vaciarListas();
    this.viajeGastoComponente.vaciarListas();
    this.viajeInsumoComponente.vaciarListas();
    this.viajePeajeComponente.vaciarListas();
    // this.viajeTramoComponente.vaciarListas();
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.sucursales = res.json();
        this.render = true;
        this.establecerValoresPorDefecto();

      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece los campos select en solo lectura
  private establecerCamposSoloLectura(opcion): void {
    console.log(opcion);
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
  private establecerValoresPestania(nombrePestania, autocompletado, soloLecturaCabecera, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLecturaCabecera = soloLecturaCabecera;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    // this.establecerValoresPorDefecto();
    //Ejecuta los siguientes metodos solo cuando el componente esta incializado
    if(this.viajeTramoComponente){
      this.viajeTramoComponente.reestablecerFormulario();
      this.viajeTramoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if(this.viajeCombustibleComponente){
      this.viajeCombustibleComponente.reestablecerFormulario();
      this.viajeCombustibleComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if(this.viajeEfectivoComponente){
      this.viajeEfectivoComponente.reestablecerFormulario();
      this.viajeEfectivoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if(this.viajeInsumoComponente){
      this.viajeInsumoComponente.reestablecerFormulario();
      this.viajeInsumoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    // if(this.viajeRemitoGSComponente){
    //   this.viajeRemitoGSComponente.reestablecerFormulario();
    //   // this.viajeRemitoGSComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    // }
    if(this.viajeGastoComponente){
      this.viajeGastoComponente.reestablecerFormulario();
      this.viajeGastoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    if(this.viajePeajeComponente){
      this.viajePeajeComponente.reestablecerFormulario();
      this.viajePeajeComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    }
    // if (this.banderaSoloLectura) {
    //   console.log(this.indiceSeleccionado);
    //   this.viajeTramoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajeTramoComponente.vaciarListas();
    //   this.viajeCombustibleComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajeCombustibleComponente.reestablecerFormularioYLista();
    //   this.viajeEfectivoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajeEfectivoComponente.reestablecerFormularioYLista();
    //   this.viajeInsumoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajeInsumoComponente.reestablecerFormularioYLista();
    //   this.viajeGastoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajeGastoComponente.reestablecerFormularioYLista();
    //   this.viajePeajeComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
    //   this.viajePeajeComponente.reestablecerFormularioYLista();
    // }
    // setTimeout(function () {
    //   document.getElementById(componente).focus();
    // }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    // this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.banderaSoloLectura = false;
        this.establecerCamposSoloLectura(false);
        this.estadoFormulario = false;
        this.establecerValoresPestania(nombre, false, false, false, true, 'idFecha');
        break;
      case 2:
        this.banderaSoloLectura = true;
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.banderaSoloLectura = false;
        this.establecerCamposSoloLectura(false);
        this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.banderaSoloLectura = true;
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.banderaSoloLectura = true;
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
        // this.viajeRemitoGSComponente.listarTramos(res.json());

      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de registros
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = res.json();
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
      },
      err => {
        console.log(err);
      }
    );
  }
  //Recibe la lista de tramos de Viaje Tramos
  public recibirTramos($event) {
    this.estadoFormulario = false;
    this.tipoViaje.enable();
    for (const key in $event) {
      if ($event[key].id > 0 || $event[key].id == null) {
        this.estadoFormulario = true;
        this.tipoViaje.disable();
      }
    }
    // if(!this.estadoFormulario) {
    //   this.formularioViaje.get('viajeTramos').reset();
    // } else {
    //   this.formularioViaje.get('viajeTramos').setValue($event);
    // }
    // this.viajeRemitoGSComponente.establecerListaTramos($event);
  }
  //Recibe la lista de combustibles de Viaje Combustible
  public recibirCombustibles($event) {
    // this.formularioViaje.get('viajeCombustibles').setValue($event);
  }
  //Recibe la lista de adelantos de efectivo de Viaje Efectivo
  public recibirEfectivos($event) {
    // this.formularioViaje.get('viajeEfectivos').setValue($event);
  }
  //Recibe la lista de ordenes de insumo de Viaje Insumo
  public recibirInsumos($event) {
    // this.formularioViaje.get('viajeInsumos').setValue($event);
  }
  //Recibe la lista de gastos de Viaje Gasto
  public recibirGastos($event) {
    // this.formularioViaje.get('viajeGastos').setValue($event);
  }
  //Recibe la lista de peajes de Viaje Peaje
  public recibirPeajes($event) {
    // this.formularioViaje.get('viajePeajes').setValue($event);
  }
  //Recibe la lista de remitos de Viaje Remito
  public recibirRemitos($event) {
    console.log($event);
  }
  //Dependiendo en que pestaña esta, es la acción que realiza
  public accion(): void {
    switch (this.indiceSeleccionado) {
      case 1:
        // this.agregar();
        break;
      case 2:
        break;
      case 3:
        // this.actualizar();
        break;
      case 4:
        break;
    }
  }
  //Agrega el viaje (CABECERA)
  public agregarViaje(){
    this.loaderService.show();
    this.idMod = null;
    // this.tipoViaje.enable();
    // let empresa = this.appService.getEmpresa();
    // let vehiculo = this.formularioViaje.get('vehiculo').value;
    // this.formularioViaje.get('empresa').setValue(vehiculo.empresa);
    // this.formularioViaje.get('empresaEmision').setValue(empresa);
    // this.formularioViaje.get('afipCondicionIva').setValue(empresa.afipCondicionIva);
    // let usuario = this.appService.getUsuario();
    // this.formularioViaje.get('usuarioAlta').setValue(usuario);
    console.log(this.formularioViaje.value);
    this.servicio.agregar(this.formularioViaje.value).subscribe(
      res => {
        let resultado = res.json();
        if (res.status == 201) {
          this.formularioViaje.patchValue(resultado);
          // this.viajeTramoComponente.establecerViaje(this.formularioViaje.value.id);
          this.idMod = resultado.id;
          this.toastr.success("Registro agregado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza el viaje (CABECERA)
  public actualizarViaje(){
    this.loaderService.show();
    // this.tipoViaje.enable();
    this.establecerCamposSoloLectura(false);
    this.servicio.actualizar(this.formularioViaje.value).subscribe(
      res => {
        let resultado = res.json();
        if (res.status == 200) {
          this.formularioViaje.patchValue(resultado);
          this.idMod = resultado.id;
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
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
        this.viajeRemitoGSComponente.establecerFoco();
        break;
      case 6:
        this.viajeGastoComponente.establecerFoco();
        break;
      case 7:
        this.viajePeajeComponente.establecerFoco();
        break;
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    // this.formularioViaje.reset();
    this.formularioViaje.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.idMod = null;
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11006) {
      document.getElementById("labelRazonSocial").classList.add('label-error');
      document.getElementById("idRazonSocial").classList.add('is-invalid');
      document.getElementById("idRazonSocial").focus();
    } else if (respuesta.codigo == 11009) {
      document.getElementById("labelTelefono").classList.add('label-error');
      document.getElementById("idTelefono").classList.add('is-invalid');
      document.getElementById("idTelefono").focus();
    } else if (respuesta.codigo == 11008) {
      document.getElementById("labelSitioWeb").classList.add('label-error');
      document.getElementById("idSitioWeb").classList.add('is-invalid');
      document.getElementById("idSitioWeb").focus();
    } else if (respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    }
    this.toastr.error(respuesta.mensaje);
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
    this.autocompletado.setValue(elemento);
    this.formularioViaje.patchValue(elemento);
    this.establecerValoresPorDefecto();
    this.cambioAutocompletado();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    console.log(elemento);
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formularioViaje.patchValue(elemento);
    this.establecerValoresPorDefecto();
    this.cambioAutocompletado();
  }
  //Establece los valores del viaje en viajeCabecera del appService
  public establecerViajeCabecera(){
    this.appService.setViajeCabecera(this.formularioViaje.value);
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
    // var opcion = this.opcionSeleccionada;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    } 
    // else if (keycode == 115) {
    //   if (opcion < this.opciones.length) {
    //     this.seleccionarOpcion(opcion + 1, opcion);
    //   } else {
    //     this.seleccionarOpcion(1, 0);
    //   }
    // }
  }
}