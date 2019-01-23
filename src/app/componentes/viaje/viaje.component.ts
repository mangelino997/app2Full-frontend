import { Component, OnInit } from '@angular/core';
import { ViajePropioService } from '../../servicios/viaje-propio.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajePropio } from 'src/app/modelos/viajePropio';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.css']
})
export class ViajeComponent implements OnInit {
  //Define la pestania activa
  public activeLink:any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define la lista de opciones
  public opciones:Array<any> = [];
  //Define un formulario viaje propio para validaciones de campos
  public formularioViajePropio:FormGroup;
  //Define un formulario viaje propio tramo para validaciones de campos
  public formularioViajePropioTramo: FormGroup = new FormGroup({});
  //Define un formulario viaje propio combustible para validaciones de campos
  public formularioViajePropioCombustible:FormGroup = new FormGroup({});
  //Define un formulario viaje propio efectivo para validaciones de campos
  public formularioViajePropioEfectivo:FormGroup = new FormGroup({});
  //Define un formulario viaje propio insumo para validaciones de campos
  public formularioViajePropioInsumo:FormGroup = new FormGroup({});
  //Define un formulario viaje remitos dadores de carga para validaciones de campos
  public formularioViajeRemitoDC:FormGroup = new FormGroup({});
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito:FormGroup = new FormGroup({});
  //Define un formulario viaje propio gasto para validaciones de campos
  public formularioViajePropioGasto:FormGroup = new FormGroup({});
  //Define un formulario viaje propio peaje para validaciones de campos
  public formularioViajePropioPeaje:FormGroup = new FormGroup({});
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
  //Define la opcion activa
  public botonOpcionActivo:boolean = null;
  //Define el form control para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de vehiculos
  public resultadosVehiculos:Array<any> = [];
  //Define la lista de resultados de vehiculos remolques
  public resultadosVehiculosRemolques:Array<any> = [];
  //Define la lista de resultados de choferes
  public resultadosChoferes:Array<any> = [];
  //Define el tipo de viaje (Propio o Tercero)
  public tipoViaje:FormControl = new FormControl();
  //Define el nombre del usuario logueado
  public usuarioNombre:FormControl = new FormControl();
  //Define la lista de sucursales
  public sucursales:Array<any> = [];
  //Constructor
  constructor(private servicio: ViajePropioService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService,
    private personalServicio: PersonalService, private viajePropioModelo: ViajePropio) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
      },
      err => {
        console.log(err);
      }
    );
    //Obtiene la lista de opciones por rol y subopcion
    this.rolOpcionServicio.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.opciones = res.json();
      },
      err => {
        console.log(err);
      }
    );
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    // this.autocompletado.valueChanges.subscribe(data => {
    //   if(typeof data == 'string') {
    //     this.servicio.listarPorAlias(data).subscribe(response =>{
    //       this.resultados = response;
    //     })
    //   }
    // })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio
    this.formularioViajePropio = this.viajePropioModelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(22, 0);
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Autocompletado Vehiculo - Buscar por alias
    this.formularioViajePropio.get('vehiculo').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.vehiculoServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosVehiculos = response;
        })
      }
    })
    //Autocompletado Vehiculo Remolque - Buscar por alias
    this.formularioViajePropio.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.vehiculoServicio.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Personal - Buscar por alias
    this.formularioViajePropio.get('personal').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.personalServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosChoferes = response;
        })
      }
    })
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    let usuario = this.appComponent.getUsuario();
    this.formularioViajePropio.get('usuario').setValue(usuario);
    this.usuarioNombre.setValue(usuario.nombre);
    this.tipoViaje.setValue(true);
    this.formularioViajePropio.get('esRemolquePropio').setValue(true);
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropio.get('fecha').setValue(res.json());
    })
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    this.establecerValoresPorDefecto();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idFecha');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      default:
        break;
    }
  }
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch(opcion) {
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
    this.formularioViajePropio.get('viajePropioTramos').setValue($event);
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
  //Agregar el viaje propio
  public agregar(): void {
    let vehiculo = this.formularioViajePropio.get('vehiculo').value;
    this.formularioViajePropio.get('empresa').setValue(vehiculo.empresa);
    this.formularioViajePropio.get('empresaEmision').setValue(this.appComponent.getEmpresa());
    let empresa = this.formularioViajePropio.get('empresa').value;
    this.formularioViajePropio.get('condicionIva').setValue(empresa.afipCondicionIva);
    console.log(this.formularioViajePropio.value);
    // this.servicio.agregar(this.formularioViajePropio.value).subscribe(
    //   res => {
    //     let resultado = res.json();
    //     if(resultado.codigo == 201) {
    //       this.toastr.success(resultado.mensaje);
    //     }
    //   },
    //   err => {
    //     let resultado = err.json();
    //     this.toastr.error(resultado.mensaje);
    //   }
    // );
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
    if(respuesta.codigo == 11006) {
      document.getElementById("labelRazonSocial").classList.add('label-error');
      document.getElementById("idRazonSocial").classList.add('is-invalid');
      document.getElementById("idRazonSocial").focus();
    } else if(respuesta.codigo == 11009) {
      document.getElementById("labelTelefono").classList.add('label-error');
      document.getElementById("idTelefono").classList.add('is-invalid');
      document.getElementById("idTelefono").focus();
    } else if(respuesta.codigo == 11008) {
      document.getElementById("labelSitioWeb").classList.add('label-error');
      document.getElementById("idSitioWeb").classList.add('is-invalid');
      document.getElementById("idSitioWeb").focus();
    } else if(respuesta.codigo == 11010) {
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
    if(valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if(campo == 'sitioWeb') {
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
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.dominio ? elemento.dominio : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    var opcion = this.opcionSeleccionada;
    if(keycode == 113) {
      if(indice < this.pestanias.length) {
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    } else if(keycode == 115) {
      if(opcion < this.opciones.length) {
        this.seleccionarOpcion(opcion+1, opcion);
      } else {
        this.seleccionarOpcion(1, 0);
      }
    }
  }
}