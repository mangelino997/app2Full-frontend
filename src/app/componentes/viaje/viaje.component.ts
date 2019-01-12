import { Component, OnInit, Inject } from '@angular/core';
import { ViajePropioService } from '../../servicios/viaje-propio.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { VehiculoProveedorService } from '../../servicios/vehiculo-proveedor.service';
import { PersonalService } from '../../servicios/personal.service';
import { TramoService } from '../../servicios/tramo.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ViajeUnidadNegocioService } from '../../servicios/viaje-unidad-negocio.service';
import { ViajeTipoCargaService } from '../../servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from '../../servicios/viaje-tipo.service';
import { ViajeTarifaService } from '../../servicios/viaje-tarifa.service';
import { ViajePrecioService } from '../../servicios/viaje-precio.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { InsumoProductoService } from '../../servicios/insumo-producto.service';
import { RubroProductoService } from '../../servicios/rubro-producto.service';
import { ViajeRemitoService } from '../../servicios/viaje-remito.service';
import { ChoferProveedorService } from '../../servicios/chofer-proveedor.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViajePropio } from 'src/app/modelos/viajePropio';
import { ViajePropioTramo } from 'src/app/modelos/viajePropioTramo';
import { ViajePropioTramoCliente } from 'src/app/modelos/viajePropioTramoCliente';
import { ViajePropioCombustible } from 'src/app/modelos/viajePropioCombustible';
import { ViajePropioEfectivo } from 'src/app/modelos/viajePropioEfectivo';
import { ViajePropioInsumo } from 'src/app/modelos/viajePropioInsumo';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajePropioGasto } from 'src/app/modelos/viajePropioGasto';
import { ViajePropioPeaje } from 'src/app/modelos/viajePropioPeaje';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

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
  public formularioViajePropioTramo:FormGroup;
  //Define un formulario viaje propio tramo cliente para validaciones de campos
  public formularioViajePropioTramoCliente:FormGroup;
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
  //Define la lista de resultados de tramos
  public resultadosTramos:Array<any> = [];
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
  //Define la lista de insumos
  public insumos:Array<any> = [];
  //Define la lista de empresas
  public empresas:Array<any> = [];
  //Define la lista de unidades de negocios
  public unidadesNegocios:Array<any> = [];
  //Define la lista de viajes tipos cargas
  public viajesTiposCargas:Array<any> = [];
  //Define la lista de viajes tipos
  public viajesTipos:Array<any> = [];
  //Define la lista de viajes tarifas
  public viajesTarifas:Array<any> = [];
  //Define la lista de dedor-destinatario
  public listaDadorDestinatario:Array<any> = [];
  //Define la lista de tramos (tabla)
  public listaTramos:Array<any> = [];
  //Define la lista de combustibles (tabla)
  public listaCombustibles:Array<any> = [];
  //Define la fecha actual
  public fechaActual:string;
  //Constructor
  constructor(private servicio: ViajePropioService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService,
    private sucursalServicio: SucursalService, private vehiculoServicio: VehiculoService,
    private vehiculoProveedorServicio: VehiculoProveedorService, private personalServicio: PersonalService,
    private tramoServicio: TramoService, private empresaServicio: EmpresaService,
    private viajeUnidadNegocioServicio: ViajeUnidadNegocioService, private viajeTipoCargaServicio: ViajeTipoCargaService,
    private viajeTipoServicio: ViajeTipoService, private viajeTarifaServicio: ViajeTarifaService,
    private viajaPrecioServicio: ViajePrecioService, private clienteServicio: ClienteService,
    private proveedorServicio: ProveedorService, private insumoProductoServicio: InsumoProductoService,
    private rubroProductoServicio: RubroProductoService, private viajeRemitoServicio: ViajeRemitoService,
    private choferProveedorServicio: ChoferProveedorService, private viajePropioModelo: ViajePropio,
    private viajePropioTramoModelo: ViajePropioTramo, private viajePropioTramoClienteModelo: ViajePropioTramoCliente,
    private viajePropioCombustibleModelo: ViajePropioCombustible, private viajePropioEfectivoModelo: ViajePropioEfectivo,
    private viajePropioInsumoModelo: ViajePropioInsumo, private viajeRemitoModelo: ViajeRemito,
    private viajePropioGastoModelo: ViajePropioGasto, private viajePropioPeajeModelo: ViajePropioPeaje,
    public dialog: MatDialog) {
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
    //Establece la fecha actual
    this.fechaActual = new Date().toISOString().substring(0,10);
    //Establece el formulario viaje propio
    this.formularioViajePropio = this.viajePropioModelo.formulario;
    //Establece el formulario viaje propio tramo
    this.formularioViajePropioTramo = this.viajePropioTramoModelo.formulario;
    //Establece el formulario viaje propio tramo cliente
    this.formularioViajePropioTramoCliente = this.viajePropioTramoClienteModelo.formulario;
    //Establece el formulario viaje propio combustible
    this.formularioViajePropioCombustible = this.viajePropioCombustibleModelo.formulario;
    //Establece el formulario viaje propio efectivo
    this.formularioViajePropioEfectivo = this.viajePropioEfectivoModelo.formulario;
    //Establece el formulario viaje propio insumo
    this.formularioViajePropioInsumo = this.viajePropioInsumoModelo.formulario;
    //Establece el formulario viaje remito
    this.formularioViajeRemito = this.viajeRemitoModelo.formulario;
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
    //Obtiene la lista de insumos
    this.listarInsumos();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de unidades de negocios
    this.listarUnidadesNegocios();
    //Obtiene la lista de viajes tipos cargas
    this.listarViajesTiposCargas();
    //Obtiene la lista de viajes tipos
    this.listarViajesTipos();
    //Obtiene la lista de viajes tarifas
    this.listarViajesTarifas();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Establece los valores por defecto del formulario viaje tramo
    this.establecerValoresPorDefectoViajeTramo();
    //Establece los valores por defecto del formulario viaje combustible
    this.establecerValoresPorDefectoViajeCombustible(1);
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
    //Autocompletado Tramo - Buscar por alias
    this.formularioViajePropioTramo.get('tramo').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.tramoServicio.listarPorOrigen(data).subscribe(response => {
          this.resultadosTramos = response;
        })
      }
    })
    //Autocompletado Proveedor (Combustible) - Buscar por alias
    this.formularioViajePropioCombustible.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
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
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    let usuario = this.appComponent.getUsuario();
    this.formularioViajePropio.get('usuario').setValue(usuario);
    this.usuarioNombre.setValue(usuario.nombre);
    this.tipoViaje.setValue(true);
    this.formularioViajePropio.get('esRemolquePropio').setValue(true);
    this.formularioViajePropio.get('fecha').setValue(this.fechaActual);
  }
  //Establece los valores por defecto del formulario viaje tramo
  public establecerValoresPorDefectoViajeTramo(): void {
    let valor = 0;
    this.formularioViajePropioTramo.get('fechaTramo').setValue(this.fechaActual);
    this.formularioViajePropioTramo.get('cantidad').setValue(valor);
    this.formularioViajePropioTramo.get('precioUnitario').setValue(valor.toFixed(2));
    this.formularioViajePropioTramo.get('importe').setValue(valor.toFixed(2));
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefectoViajeCombustible(opcion): void {
    let valor = 0;
    this.formularioViajePropioCombustible.get('fecha').setValue(this.fechaActual);
    this.formularioViajePropioCombustible.get('cantidad').setValue(valor);
    this.formularioViajePropioCombustible.get('precioUnitario').setValue(valor.toFixed(2));
    this.formularioViajePropioCombustible.get('importe').setValue(valor.toFixed(2));
    if(opcion == 1) {
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(valor.toFixed(2));
      this.formularioViajePropioCombustible.get('totalUrea').setValue(valor.toFixed(2));
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
  //Obtiene el listado de insumos
  private listarInsumos() {
    this.insumoProductoServicio.listar().subscribe(
      res => {
        this.insumos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de unidades de negocio
  private listarUnidadesNegocios() {
    this.viajeUnidadNegocioServicio.listar().subscribe(
      res => {
        this.unidadesNegocios = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de viaje tipo carga
  private listarViajesTiposCargas() {
    this.viajeTipoCargaServicio.listar().subscribe(
      res => {
        this.viajesTiposCargas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de viajes tipos
  private listarViajesTipos() {
    this.viajeTipoServicio.listar().subscribe(
      res => {
        this.viajesTipos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de viajes tarifas
  private listarViajesTarifas() {
    this.viajeTarifaServicio.listar().subscribe(
      res => {
        this.viajesTarifas = res.json();
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if(estado) {
      
    } else {
      
    }
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
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idFecha');
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
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
    if(cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe.toFixed(2));
    }
  }
  //Abre un dialogo para agregar dadores y destinatarios
  public verDadorDestinatarioDialogo(): void {
    const dialogRef = this.dialog.open(DadorDestinatarioDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(listaViajePropioTramoCliente => {
      this.formularioViajePropioTramo.get('listaViajePropioTramoCliente').setValue(listaViajePropioTramoCliente);
    });
  }
  //Abre un dialogo para ver la lista de dadores y destinatarios
  public verDadorDestTablaDialogo(elemento): void {
    const dialogRef = this.dialog.open(DadorDestTablaDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      
    });
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(listaViajePropioTramoCliente => {
      this.formularioViajePropioTramo.get('listaViajePropioTramoCliente').setValue(listaViajePropioTramoCliente);
    });
  }
  //Agrega datos a la tabla de tramos
  public agregarTramo(): void {
    this.listaTramos.push(this.formularioViajePropioTramo.value);
    this.formularioViajePropioTramo.reset();
    this.establecerValoresPorDefectoViajeTramo();
    document.getElementById('idFechaTramo').focus();
  }
  //Elimina un tramo de la tabla por indice
  public eliminarTramo(indice): void {
    this.listaTramos.splice(indice, 1);
    document.getElementById('idTramoFecha').focus();
  }
  //Agrega datos a la tabla de combustibles
  public agregarCombustible(): void {
    this.formularioViajePropioCombustible.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioCombustible.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaCombustibles.push(this.formularioViajePropioCombustible.value);
    let insumo = this.formularioViajePropioCombustible.get('insumoProducto').value.id;
    let cantidad = this.formularioViajePropioCombustible.get('cantidad').value;
    let totalCombustible = this.formularioViajePropioCombustible.get('totalCombustible').value;
    let totalUrea = this.formularioViajePropioCombustible.get('totalUrea').value;
    let total = 0;
    this.formularioViajePropioCombustible.reset();
    if(insumo == 1) {
      total = parseFloat(totalCombustible) + parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(total.toFixed(2));
      this.formularioViajePropioCombustible.get('totalUrea').setValue(totalUrea);
    } else if(insumo == 3) {
      total = parseFloat(totalUrea) + parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalUrea').setValue(total.toFixed(2));
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(totalCombustible);
    }
    this.establecerValoresPorDefectoViajeCombustible(0);
    document.getElementById('idProveedorOC').focus();
  }
  //Elimina un combustible de la tabla por indice
  public eliminarCombustible(indice, elemento): void {
    this.listaCombustibles.splice(indice, 1);
    let insumo = elemento.insumoProducto.id;
    let cantidad = elemento.cantidad;
    let totalCombustible = this.formularioViajePropioCombustible.get('totalCombustible').value;
    let totalUrea = this.formularioViajePropioCombustible.get('totalUrea').value;
    let total = 0;
    if(insumo == 1) {
      total = parseFloat(totalCombustible) - parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(total.toFixed(2));
    } else if(insumo == 3) {
      total = parseFloat(totalUrea) - parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalUrea').setValue(total.toFixed(2));
    }
    document.getElementById('idProveedorOC').focus();
  }
  //Verifica el elemento seleccionado en Tarifa para determinar si coloca cantidad e importe en solo lectura
  public estadoTarifa(): boolean {
    try {
      let viajeTarifa = this.formularioViajePropioTramo.get('viajeTarifa').value.id;
      return viajeTarifa == 2 || viajeTarifa == 5;
    } catch(e) {
      return false;
    }
  }
  //EStablece el precio unitario en orden combustible
  public establecerPrecioUnitarioOC(): void {
    this.formularioViajePropioCombustible.get('precioUnitario').setValue((this.formularioViajePropioCombustible.get('insumoProducto').value.precioUnitarioVenta).toFixed(2));
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
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
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
      return elemento.alias ? elemento.alias : elemento;
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
//Componente DadorDestinatarioDialogo
@Component({
  selector: 'dador-destinatario-dialogo',
  templateUrl: 'dador-destinatario-dialogo.component.html'
})
export class DadorDestinatarioDialogo {
  //Define el tema
  public tema:string;
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista de dador-destinatario
  public listaDadorDestinatario:Array<any> = [];
  //Define la lista de clientes
  public resultadosClientes:Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestinatarioDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private viajePropioTramoClienteModelo: ViajePropioTramoCliente, private clienteServicio: ClienteService) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = this.viajePropioTramoClienteModelo.formulario;
    //Autocompletado Cliente Dador - Buscar por alias
    this.formulario.get('clienteDador').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
    //Autocompletado Cliente Destinatario - Buscar por alias
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Agrega el dador y el destinatario a la tabla
  public agregarDadorDestinatario(): void {
    this.listaDadorDestinatario.push(this.formulario.value);
    this.formulario.reset();
    document.getElementById('idTramoDadorCarga').focus();
  }
  //Elimina un dador-destinatario de la tabla
  public eliminarDadorDestinatario(indice): void {
    this.listaDadorDestinatario.splice(indice, 1);
    document.getElementById('idTramoDadorCarga').focus();
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}
//Componente DadorDestTablaDialogo
@Component({
  selector: 'dador-dest-tabla-dialogo',
  templateUrl: 'dador-dest-tabla-dialogo.component.html'
})
export class DadorDestTablaDialogo {
  //Define el tema
  public tema:string;
  //Define la observacion
  public listaDadorDestinatario:Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestTablaDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece la lista de dadores-destinatarios
    this.listaDadorDestinatario = this.data.elemento.listaViajePropioTramoCliente;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente ObservacionesDialogo
@Component({
  selector: 'observaciones-dialogo',
  templateUrl: 'observaciones-dialogo.component.html'
})
export class ObservacionesDialogo {
  //Define el tema
  public tema:string;
  //Define el formulario
  public formulario:FormGroup;
  //Define la observacion
  public observaciones:string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ObservacionesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = new FormGroup({
      observaciones: new FormControl()
    });
    //Establece las observaciones
    this.formulario.get('observaciones').setValue(this.data.elemento);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}