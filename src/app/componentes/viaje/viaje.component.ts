import { Component, OnInit, ViewChild } from '@angular/core';
import { ViajePropioService } from '../../servicios/viaje-propio.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajePropio } from 'src/app/modelos/viajePropio';
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
  //Define la lista de opciones
  // public opciones: Array<any> = [];
  //Define un formulario viaje propio para validaciones de campos
  public formularioViajePropio: FormGroup;
  //Define un formulario viaje propio tramo para validaciones de campos
  public formularioViajePropioTramo: FormGroup = new FormGroup({});
  //Define un formulario viaje propio combustible para validaciones de campos
  public formularioViajePropioCombustible: FormGroup = new FormGroup({});
  //Define un formulario viaje propio efectivo para validaciones de campos
  public formularioViajePropioEfectivo: FormGroup = new FormGroup({});
  //Define un formulario viaje propio insumo para validaciones de campos
  public formularioViajePropioInsumo: FormGroup = new FormGroup({});
  //Define un formulario viaje remitos dadores de carga para validaciones de campos
  public formularioViajeRemitoDC: FormGroup = new FormGroup({});
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito: FormGroup = new FormGroup({});
  //Define un formulario viaje propio gasto para validaciones de campos
  public formularioViajePropioGasto: FormGroup = new FormGroup({});
  //Define un formulario viaje propio peaje para validaciones de campos
  public formularioViajePropioPeaje: FormGroup = new FormGroup({});
  //Define la lista completa de registros
  public listaCompleta: Array<any> = [];
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
  //Constructor
  constructor(private servicio: ViajePropioService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService,
    private personalServicio: PersonalService, private viajePropioModelo: ViajePropio,
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
    //Obtiene la lista de opciones por rol y subopcion
    // this.rolOpcionServicio.listarPorRolSubopcion(this.appService.getRol(), this.appService.getSubopcion())
    //   .subscribe(
    //     res => {
    //       this.opciones = res.json();
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
    //Se subscribe al servicio de lista de registros
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
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
    this.formularioViajePropio = this.viajePropioModelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(22, 0);
    //Obtiene la lista completa de registros
    // this.listar();
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Autocompletado Vehiculo - Buscar por alias
    this.formularioViajePropio.get('vehiculo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoServicio.listarPorAliasYRemolqueFalse(data).subscribe(response => {
          this.resultadosVehiculos = response;
        })
      }
    })
    //Autocompletado Vehiculo Remolque - Buscar por alias
    this.formularioViajePropio.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoServicio.listarPorAliasYRemolqueTrue(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Personal - Buscar por alias
    this.formularioViajePropio.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarChoferesLargaDistanciaPorAlias(data).subscribe(res => {
          this.resultadosChoferes = res.json();
        })
      }
    })
    //Autocompletado Proveedor Chofer - Buscar por alias
    // this.formularioViajePropio.get('choferProveedor').valueChanges.subscribe(data => {
    //   if (typeof data == 'string' && data.length > 2) {
    //     let vehiculoProveedor = this.formularioViajePropio.get('vehiculoProveedor').value;
    //     if(vehiculoProveedor) {
    //       this.choferProveedorServicio.listarPorAliasYProveedor(data, vehiculoProveedor.proveedor.id).subscribe(res => {
    //         this.resultadosChoferes = res.json();
    //       });
    //     }
    //   }
    // })
  }
  //Establece el formulario y listas al seleccionar un elemento del autocompletado
  public cambioAutocompletado(): void {
    let viaje = this.autocompletado.value;
    this.servicio.obtenerPorId(viaje.id).subscribe(res => {
      let viajePropio = res.json();
      this.formularioViajePropio.setValue(viajePropio);
      this.viajeTramoComponente.establecerLista(viajePropio.viajePropioTramos, viaje);
      this.viajeCombustibleComponente.establecerLista(viajePropio.viajePropioCombustibles, viaje);
      this.viajeEfectivoComponente.establecerLista(viajePropio.viajePropioEfectivos, viaje);
      this.viajeInsumoComponente.establecerLista(viajePropio.viajePropioInsumos, viaje);
      this.viajeGastoComponente.establecerLista(viajePropio.viajePropioGastos, viaje);
      this.viajePeajeComponente.establecerLista(viajePropio.viajePropioPeajes, viaje);
    });
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    let usuario = this.appService.getUsuario();
    this.formularioViajePropio.get('usuario').setValue(usuario);
    this.usuarioNombre.setValue(usuario.nombre);
    this.tipoViaje.setValue(true);
    this.formularioViajePropio.get('esRemolquePropio').setValue(true);
    let sucursal = this.appService.getUsuario().sucursal;
    this.formularioViajePropio.get('sucursal').setValue(sucursal);
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropio.get('fecha').setValue(res.json());
    })
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
    this.viajeTramoComponente.vaciarListas();
  }
  //Establece el tipo de viaje
  public establecerTipoViaje(): void {
    this.viajeTramoComponente.establecerTipoViaje(this.tipoViaje.value);
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
        this.render = true;
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece los campos select en solo lectura
  private establecerCamposSoloLectura(opcion): void {
    if (opcion) {
      this.tipoViaje.disable();
      this.formularioViajePropio.get('esRemolquePropio').disable();
      this.formularioViajePropio.get('sucursal').disable();
    } else {
      this.tipoViaje.enable();
      this.formularioViajePropio.get('esRemolquePropio').enable();
      this.formularioViajePropio.get('sucursal').enable();
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
    this.establecerValoresPorDefecto();
    if (this.banderaSoloLectura) {
      this.viajeTramoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajeTramoComponente.reestablecerFormularioYLista();
      this.viajeCombustibleComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajeCombustibleComponente.reestablecerFormularioYLista();
      this.viajeEfectivoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajeEfectivoComponente.reestablecerFormularioYLista();
      this.viajeInsumoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajeInsumoComponente.reestablecerFormularioYLista();
      this.viajeGastoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajeGastoComponente.reestablecerFormularioYLista();
      this.viajePeajeComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
      this.viajePeajeComponente.reestablecerFormularioYLista();
    }
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
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
        this.banderaSoloLectura = true;
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.banderaSoloLectura = true;
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.banderaSoloLectura = true;
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
        this.formularioViajePropio.get('id').setValue(res.json());
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
        this.listaCompleta = res.json();
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
    if(!this.estadoFormulario) {
      this.formularioViajePropio.get('viajePropioTramos').reset();
    } else {
      this.formularioViajePropio.get('viajePropioTramos').setValue($event);
    }
    this.viajeRemitoGSComponente.establecerListaTramos($event);
  }
  //Recibe la lista de combustibles de Viaje Combustible
  public recibirCombustibles($event) {
    this.formularioViajePropio.get('viajePropioCombustibles').setValue($event);
  }
  //Recibe la lista de adelantos de efectivo de Viaje Efectivo
  public recibirEfectivos($event) {
    this.formularioViajePropio.get('viajePropioEfectivos').setValue($event);
  }
  //Recibe la lista de ordenes de insumo de Viaje Insumo
  public recibirInsumos($event) {
    this.formularioViajePropio.get('viajePropioInsumos').setValue($event);
  }
  //Recibe la lista de gastos de Viaje Gasto
  public recibirGastos($event) {
    this.formularioViajePropio.get('viajePropioGastos').setValue($event);
  }
  //Recibe la lista de peajes de Viaje Peaje
  public recibirPeajes($event) {
    this.formularioViajePropio.get('viajePropioPeajes').setValue($event);
  }
  //Recibe la lista de remitos de Viaje Remito
  public recibirRemitos($event) {
    console.log($event);
  }
  //Dependiendo en que pestaña esta, es la acción que realiza
  public accion(): void {
    switch (this.indiceSeleccionado) {
      case 1:
        this.agregar();
        break;
      case 2:
        break;
      case 3:
        this.actualizar();
        break;
      case 4:
        break;
    }
  }
  //Agregar el viaje propio
  private agregar(): void {
    this.loaderService.show();
    this.tipoViaje.enable();
    let vehiculo = this.formularioViajePropio.get('vehiculo').value;
    this.formularioViajePropio.get('empresa').setValue(vehiculo.empresa);
    this.formularioViajePropio.get('empresaEmision').setValue(this.appService.getEmpresa());
    let empresa = this.formularioViajePropio.get('empresa').value;
    this.formularioViajePropio.get('afipCondicionIva').setValue(empresa.afipCondicionIva);
    this.servicio.agregar(this.formularioViajePropio.value).subscribe(
      res => {
        let resultado = res.json();
        if (resultado.codigo == 201) {
          this.reestablecerFormulario(resultado.id);
          this.vaciarListasHijos();
          this.establecerValoresPorDefecto();
          document.getElementById('idFecha').focus();
          this.toastr.success(resultado.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza el viaje propio
  private actualizar(): void {
    this.loaderService.show();
    this.tipoViaje.enable();
    this.establecerCamposSoloLectura(false);
    this.servicio.actualizar(this.formularioViajePropio.value).subscribe(
      res => {
        let resultado = res.json();
        if (resultado.codigo == 200) {
          this.establecerCamposSoloLectura(true);
          this.reestablecerFormulario(resultado.id);
          this.vaciarListasHijos();
          this.establecerValoresPorDefecto();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(resultado.mensaje);
        }
        this.loaderService.hide();
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
    this.formularioViajePropio.reset();
    this.formularioViajePropio.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
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
    let valor = this.formularioViajePropio.get(campo).value;
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
    this.formularioViajePropio.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formularioViajePropio.patchValue(elemento);
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