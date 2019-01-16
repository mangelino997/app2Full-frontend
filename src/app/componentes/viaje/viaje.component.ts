import { Component, OnInit, Inject } from '@angular/core';
import { ViajePropioService } from '../../servicios/viaje-propio.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { VehiculoProveedorService } from '../../servicios/vehiculo-proveedor.service';
import { PersonalService } from '../../servicios/personal.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { InsumoProductoService } from '../../servicios/insumo-producto.service';
import { RubroProductoService } from '../../servicios/rubro-producto.service';
import { ViajeRemitoService } from '../../servicios/viaje-remito.service';
import { ChoferProveedorService } from '../../servicios/chofer-proveedor.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajePropio } from 'src/app/modelos/viajePropio';
import { ViajePropioTramo } from 'src/app/modelos/viajePropioTramo';
import { ViajePropioCombustible } from 'src/app/modelos/viajePropioCombustible';
import { ViajePropioEfectivo } from 'src/app/modelos/viajePropioEfectivo';
import { ViajePropioInsumo } from 'src/app/modelos/viajePropioInsumo';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajePropioGasto } from 'src/app/modelos/viajePropioGasto';
import { ViajePropioPeaje } from 'src/app/modelos/viajePropioPeaje';

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
  //Define un formulario viaje propio combustible para validaciones de campos
  public formularioViajePropioCombustible:FormGroup;
  //Define un formulario viaje propio efectivo para validaciones de campos
  public formularioViajePropioEfectivo:FormGroup;
  //Define un formulario viaje propio insumo para validaciones de campos
  public formularioViajePropioInsumo:FormGroup;
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito:FormGroup;
  //Define un formulario viaje propio gasto para validaciones de campos
  public formularioViajePropioGasto:FormGroup;
  //Define un formulario viaje propio peaje para validaciones de campos
  public formularioViajePropioPeaje:FormGroup;
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
  //Define la lista de resultados de clientes
  public resultadosClientes:Array<any> = [];
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores:Array<any> = [];
  //Define la lista de resultados rubro producto de busqueda
  public resultadosRubrosProductos:Array<any> = [];
  //Define el tipo de viaje (Propio o Tercero)
  public tipoViaje:FormControl = new FormControl();
  //Define el nombre del usuario logueado
  public usuarioNombre:FormControl = new FormControl();
  //Define la lista de sucursales
  public sucursales:Array<any> = [];
  //Define la lista de adelantos de efectivo (tabla)
  public listaAdelantosEfectivos:Array<any> = [];
  //Define la lista de ordenes de insumos (tabla)
  public listaOrdenesInsumos:Array<any> = [];
  //Define la lista de ordenes de gastos (tabla)
  public listaGastos:Array<any> = [];
  //Define la lista de ordenes de peajes (tabla)
  public listaPeajes:Array<any> = [];
  //Define la lista de remitos pendientes
  public listaRemitosPendientes:Array<any> = [];
  //Define una lista de remitos
  public remitos:FormArray;
  //Define la fecha actual
  public fechaActual:string;
  //Constructor
  constructor(private servicio: ViajePropioService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService,
    private vehiculoProveedorServicio: VehiculoProveedorService, private personalServicio: PersonalService,
    private proveedorServicio: ProveedorService, private insumoProductoServicio: InsumoProductoService,
    private rubroProductoServicio: RubroProductoService, private viajeRemitoServicio: ViajeRemitoService,
    private choferProveedorServicio: ChoferProveedorService, private viajePropioModelo: ViajePropio,
    private viajePropioTramoModelo: ViajePropioTramo,
    private viajePropioCombustibleModelo: ViajePropioCombustible, private viajePropioEfectivoModelo: ViajePropioEfectivo,
    private viajePropioInsumoModelo: ViajePropioInsumo, private viajeRemitoModelo: ViajeRemito,
    private viajePropioGastoModelo: ViajePropioGasto, private viajePropioPeajeModelo: ViajePropioPeaje, private fb: FormBuilder) {
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
    //Establece el formulario viaje propio efectivo
    this.formularioViajePropioEfectivo = this.viajePropioEfectivoModelo.formulario;
    //Establece el formulario viaje propio insumo
    this.formularioViajePropioInsumo = this.viajePropioInsumoModelo.formulario;
    //Establece el formulario viaje remito
    this.formularioViajeRemito = this.fb.group({
      tipoRemito: new FormControl,
      tramo: new FormControl(),
      numeroCamion: new FormControl(),
      sucursalDestino: new FormControl(),
      remitos: this.fb.array([])
    })
    //Establece el formulario viaje propio gasto
    this.formularioViajePropioGasto = this.viajePropioGastoModelo.formulario;
    //Establece el formulario viaje propio peaje
    this.formularioViajePropioPeaje = this.viajePropioPeajeModelo.formulario;
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
    //Establece los valores por defecto del formulario viaje efectivo
    this.establecerValoresPorDefectoViajeEfectivo(1);
    //Establece los valores por defecto del formulario viaje insumo
    this.establecerValoresPorDefectoViajeInsumo(1);
    //Establece los valores por defecto del formulario viaje gasto
    this.establecerValoresPorDefectoViajeGasto(1);
    //Establece los valores por defecto del formulario viaje peaje
    this.establecerValoresPorDefectoViajePeaje(1);
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
    //Autocompletado Proveedor (Insumo) - Buscar por alias
    this.formularioViajePropioInsumo.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
        })
      }
    })
    //Autocompletado Rubro Producto - Buscar por nombre
    this.formularioViajePropioGasto.get('rubroProducto').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.rubroProductoServicio.listarPorNombre(data).subscribe(response =>{
          this.resultadosRubrosProductos = response;
        })
      }
    })
    //Autocompletado Proveedor (Peaje) - Buscar por alias
    this.formularioViajePropioPeaje.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
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
  //Establece los valores por defecto del formulario viaje adelanto efectivo
  public establecerValoresPorDefectoViajeEfectivo(opcion): void {
    let valor = 0;
    this.formularioViajePropioEfectivo.get('fechaCaja').setValue(this.fechaActual);
    this.formularioViajePropioEfectivo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Establece los valores por defecto del formulario viaje insumo
  public establecerValoresPorDefectoViajeInsumo(opcion): void {
    let valor = 0;
    this.formularioViajePropioInsumo.get('fecha').setValue(this.fechaActual);
    this.formularioViajePropioInsumo.get('cantidad').setValue(valor);
    this.formularioViajePropioInsumo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioInsumo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefectoViajeGasto(opcion): void {
    let valor = 0;
    this.formularioViajePropioGasto.get('fecha').setValue(this.fechaActual);
    this.formularioViajePropioGasto.get('cantidad').setValue(valor);
    this.formularioViajePropioGasto.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioGasto.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefectoViajePeaje(opcion): void {
    let valor = 0;
    this.formularioViajePropioPeaje.get('fecha').setValue(this.fechaActual);
    this.formularioViajePropioPeaje.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
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
  //Agrega un registro
  private agregar() {
    this.servicio.agregar(this.formularioViajePropio.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function() {
            document.getElementById('idRazonSocial').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.servicio.actualizar(this.formularioViajePropio.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function() {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Recibe la lista de tramos de Viaje Tramos
  public recibirTramos($event) {
    this.formularioViajePropio.get('listaViajePropioTramo').setValue($event);
    console.log(this.formularioViajePropio.value);
  }
  //Recibe la lista de combustibles de Viaje Combustible
  public recibirCombustibles($event) {
    console.log($event);
  }
  //Agrega datos a la tabla de adelanto efectivo
  public agregarAdelantoEfectivo(): void {
    this.formularioViajePropioEfectivo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioEfectivo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaAdelantosEfectivos.push(this.formularioViajePropioEfectivo.value);
    let importeTotal = this.formularioViajePropioEfectivo.get('importeTotal').value;
    let importe = this.formularioViajePropioEfectivo.get('importe').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioEfectivo.reset();
    this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefectoViajeEfectivo(0);
    document.getElementById('idFechaCajaAE').focus();
  }
  //Elimina un adelanto efectivo de la tabla por indice
  public eliminarAdelantoEfectivo(indice, elemento): void {
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioEfectivo.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.listaAdelantosEfectivos.splice(indice, 1);
    document.getElementById('idFechaCajaAE').focus();
  }
  //Agrega datos a la tabla de orden insumo
  public agregarOrdenInsumo(): void {
    this.formularioViajePropioInsumo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioInsumo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaOrdenesInsumos.push(this.formularioViajePropioInsumo.value);
    let importe = this.formularioViajePropioInsumo.get('importe').value;
    let importeTotal = this.formularioViajePropioInsumo.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioInsumo.reset();
    this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefectoViajeInsumo(0);
    document.getElementById('idProveedor').focus();
  }
  //Elimina una orden insumo de la tabla por indice
  public eliminarOrdenInsumo(indice, elemento): void {
    this.listaOrdenesInsumos.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioInsumo.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idProveedor').focus();
  }
  //Agrega datos a la tabla de gastos
  public agregarGasto(): void {
    this.listaGastos.push(this.formularioViajePropioGasto.value);
    let importe = this.formularioViajePropioGasto.get('importe').value;
    let importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioGasto.reset();
    this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefectoViajeGasto(0);
    document.getElementById('idFechaG').focus();
  }
  //Elimina un gasto de la tabla por indice
  public eliminarGasto(indice, elemento): void {
    this.listaGastos.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idFechaG').focus();
  }
  //Agrega datos a la tabla de peajes
  public agregarPeaje(): void {
    this.listaPeajes.push(this.formularioViajePropioPeaje.value);
    let importe = this.formularioViajePropioPeaje.get('importe').value;
    let importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioPeaje.reset();
    this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefectoViajePeaje(0);
    document.getElementById('idProveedorP').focus();
  }
  //Elimina un peaje de la tabla por indice
  public eliminarPeaje(indice, elemento): void {
    this.listaPeajes.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idProveedorP').focus();
  }
  //Crea el array de remitos
  private crearRemitos(elemento): FormGroup {
    return this.fb.group({
      id: elemento.id,
      version: elemento.version,
      sucursalEmision: elemento.sucursalEmision,
      empresaEmision: elemento.empresaEmision,
      usuario: elemento.usuario,
      fecha: elemento.fecha,
      numeroCamion: elemento.numeroCamion,
      sucursalDestino: elemento.sucursalDestino,
      tipoComprobante: elemento.tipoComprobante,
      puntoVenta: elemento.puntoVenta,
      letra: elemento.letra,
      numero: elemento.numero,
      clienteRemitente: elemento.clienteRemitente,
      clienteDestinatario: elemento.clienteDestinatario,
      clienteDestinatarioSuc: elemento.clienteDestinatarioSuc,
      bultos: elemento.bultos,
      kilosEfectivo: elemento.kilosEfectivo,
      kilosAforado: elemento.kilosAforado,
      m3: elemento.m3,
      valorDeclarado: elemento.valorDeclarado,
      importeRetiro: elemento.importeRetiro,
      importeEntrega: elemento.importeEntrega,
      estaPendiente: elemento.estaPendiente,
      viajePropioTramo: elemento.viajePropioTramo,
      viajeTerceroTramo: elemento.viajeTerceroTramo,
      observaciones: elemento.observacion,
      estaFacturado: elemento.estaFacturado,
      seguimiento: elemento.seguimiento,
      estaEnReparto: elemento.estaEnReparto,
      alias: elemento.alias
    })
  }
  //Obtiene la lista de remitos pendiente por filtro (sucursal, sucursal destino y numero de camion)
  public listarRemitosPorFiltro(): void {
    let tipo = this.formularioViajeRemito.get('tipoRemito').value;
    let sucursal = this.appComponent.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    if(tipo) {

    } else {
      this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(res => {
        let listaRemitosPendientes = res.json();
        for (var i = 0; i < listaRemitosPendientes.length; i++) {
          this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
          this.remitos.push(this.crearRemitos(listaRemitosPendientes[i]));
        }
      });
    }
  }
  //Asigna los remitos a un tramo
  public asignarRemitos(): void {
    console.log(this.formularioViajeRemito.value.remitos);
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
  public displayF(elemento) {
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
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre +
        ' ---> ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre + ' (' + elemento.km + 'km)' : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayCeros(elemento, string, cantidad) {
    if(elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
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