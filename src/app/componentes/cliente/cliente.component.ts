import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ClienteService } from '../../servicios/cliente.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CobradorService } from '../../servicios/cobrador.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { ZonaService } from '../../servicios/zona.service';
import { RubroService } from '../../servicios/rubro.service';
import { AfipCondicionIvaService } from '../../servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { ResumenClienteService } from '../../servicios/resumen-cliente.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { SituacionClienteService } from '../../servicios/situacion-cliente.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { CondicionVentaService } from '../../servicios/condicion-venta.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/modelos/cliente';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ClienteOrdenVentaService } from 'src/app/servicios/cliente-orden-venta.service';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { CuentaBancariaDialogoComponent } from '../cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
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
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
  //Define la lista de condiciones de iva
  public condicionesIva:Array<any> = [];
  //Define la lista de condiciones de venta
  public condicionesVentas:Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos:Array<any> = [];
  //Define la lista de resumenes de clientes
  public resumenesClientes:Array<any> = [];
  //Define la lista de situaciones de clientes
  public situacionesClientes:Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo:boolean = null;
  //Define el form control para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  public resultadosBarrios:Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  public resultadosLocalidades:Array<any> = [];
  //Define la lista de resultados de busqueda de cobrador
  public cobradores:Array<any> = [];
  //Define la lista de resultados de busqueda de vendedor
  public vendedores:Array<any> = [];
  //Define la lista de resultados de busqueda de zona
  public zonas:Array<any> = [];
  //Define la lista de resultados de busqueda de rubro
  public rubros:Array<any> = [];
  //Define la lista de resultados de busqueda de orden venta
  public resultadosOrdenesVentas:Array<any> = [];
  //Define la lista de resultados de busqueda de cuenta principal
  public resultadosCuentasGrupos:Array<any> = [];
  //Define la lista de resultados de busqueda de sucursal lugar pago
  public resultadosSucursalesPago:Array<any> = [];
  //Define la lista de resultados de busqueda de compania seguro
  public resultadosCompaniasSeguros:Array<any> = [];
  //Define la lista de cuentas bancarias
  public cuentasBancarias = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas:string[] = ['id', 'razonSocial', 'tipoDocumento', 'numeroDocumento', 'telefono', 'domicilio', 'localidad', 'ver', 'mod'];
  //Define las columnas de la tabla cuenta bancaria
  public columnasCuentaBancaria: string[] = ['eliminar', 'empresa', 'cuentaBancaria', 'banco', 'sucursal', 'numCuenta', 'cbu', 'aliasCbu'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render:boolean = false;
  //Constructor
  constructor(private servicio: ClienteService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private cobradorServicio: CobradorService,
    private vendedorServicio: VendedorService, private zonaServicio: ZonaService,
    private rubroServicio: RubroService, private afipCondicionIvaServicio: AfipCondicionIvaService,
    private tipoDocumentoServicio: TipoDocumentoService, private resumenClienteServicio: ResumenClienteService,
    private sucursalServicio: SucursalService, private situacionClienteServicio: SituacionClienteService,
    private companiaSeguroServicio: CompaniaSeguroService, public dialog: MatDialog,
    private condicionVentaServicio: CondicionVentaService, private clienteModelo: Cliente,
    private loaderService: LoaderService, private usuarioEmpresaService: UsuarioEmpresaService) {
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
    //Obtiene la lista de opciones por rol y subopcion
    this.rolOpcionServicio.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
    .subscribe(
      res => {
        this.opciones = res.json();
        this.render = true;
      },
      err => {
        console.log(err);
        this.render = true;
      }
    );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.servicio.listarPorAlias(data).subscribe(response =>{
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
    //Define los campos para validaciones
    this.formulario = this.clienteModelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(1, 0);
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Cuenta Grupo - Buscar por nombre
    this.formulario.get('cuentaGrupo').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultadosCuentasGrupos = response;
        })
      }
    })
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCompaniasSeguros = response;
        })
      }
    })
    //Obtiene la lista completa de registros
    // this.listar();
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de resumenes de clientes
    this.listarResumenesClientes();
    //Obtiene la lista de situaciones de clientes
    this.listarSituacionesClientes();
    //Obtiene la lista de condiciones de venta
    this.listarCondicionesVentas();
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene la lista de cobradores
    this.listarCobradores();
    //Obtiene la lista de vendedores
    this.listarVendedores();
    //Obtiene la lista de zonas
    this.listarZonas();
    //Obtiene la lista de rubros
    this.listarRubros();
  }
  //Crea la lista de planes de cuenta
  public crearCuentasBancarias(): void {
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    let token = localStorage.getItem('token');
    this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(usuario.id, token).subscribe(
      res => {
        let cuentasBancarias = [];
        let empresas = res.json();
        let formulario = null;
        for(let i = 0 ; i < empresas.length ; i++) {
          formulario = {
            empresa: empresas[i],
            cliente: null,
            cuentaBancaria: null
          }
          cuentasBancarias.push(formulario);
        }
        this.cuentasBancarias = new MatTableDataSource(cuentasBancarias);
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Abre el dialogo Cuenta Bancarias
  public seleccionarCuentaBancaria(elemento) {
    const dialogRef = this.dialog.open(CuentaBancariaDialogoComponent, {
      width: '90%',
      height: '50%',
      data: {
        empresa: elemento.empresa
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        let formulario = {
          id: null,
          version: null,
          sucursalBanco: null,
          numeroCuenta: null,
          cbu: null,
          aliasCBU: null
        }
        elemento.cuentaBancaria = formulario;
        elemento.cuentaBancaria.id = resultado.id;
        elemento.cuentaBancaria.version = resultado.version;
        elemento.cuentaBancaria.sucursalBanco = resultado.sucursalBanco;
        elemento.cuentaBancaria.numeroCuenta = resultado.numeroCuenta;
        elemento.cuentaBancaria.cbu = resultado.cbu;
        elemento.cuentaBancaria.aliasCBU = resultado.aliasCBU;
      }
    });
  }
  //Obtiene el listado de cobradores
  private listarCobradores() {
    this.cobradorServicio.listar().subscribe(
      res => {
        this.cobradores = res.json();
        this.establecerCobrador();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece cobrador por defecto
  private establecerCobrador(): void {
    this.formulario.get('cobrador').setValue(this.cobradores[0]);
  }
  //Obtiene el listado de vendedores
  private listarVendedores() {
    this.vendedorServicio.listar().subscribe(
      res => {
        this.vendedores = res.json();
        this.establecerVendedor();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece vendedor por defecto
  private establecerVendedor(): void {
    this.formulario.get('vendedor').setValue(this.vendedores[0]);
  }
  //Obtiene el listado de Zonas
  private listarZonas() {
    this.zonaServicio.listar().subscribe(
      res => {
        this.zonas = res.json();
        this.establecerZona();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece zona por defecto
  private establecerZona(): void {
    this.formulario.get('zona').setValue(this.zonas[0]);
  }
  //Obtiene el listado de Rubros
  private listarRubros() {
    this.rubroServicio.listar().subscribe(
      res => {
        this.rubros = res.json();
        this.establecerRubro();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece rubro por defecto
  private establecerRubro(): void {
    this.formulario.get('rubro').setValue(this.rubros[0]);
  }
  //Establece el formulario
  public establecerFormulario(): void {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.formulario.get('creditoLimite').setValue(elemento.creditoLimite ? this.appService.establecerDecimales(elemento.creditoLimite, 2) : null);
    this.formulario.get('descuentoFlete').setValue(elemento.descuentoFlete ? this.appService.desenmascararPorcentaje(elemento.descuentoFlete.toString(), 2) : null);
    this.formulario.get('descuentoSubtotal').setValue(elemento.descuentoSubtotal ? this.appService.establecerDecimales(elemento.descuentoSubtotal, 2) : null);
    this.cuentasBancarias = new MatTableDataSource(elemento.clienteCuentasBancarias);
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('estaActiva').setValue(true);
    this.formulario.get('esSeguroPropio').setValue(false);
    this.formulario.get('imprimirControlDeuda').setValue(false);
    this.formulario.get('companiaSeguro').disable();
    this.formulario.get('numeroPolizaSeguro').disable();
    this.formulario.get('vencimientoPolizaSeguro').disable();
    this.formulario.get('resumenCliente').disable();
    this.formulario.get('creditoLimite').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('descuentoFlete').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('descuentoSubtotal').setValue(this.appService.establecerDecimales('0.00', 2));
    this.crearCuentasBancarias();
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosOrdenesVentas = [];
    this.resultadosCuentasGrupos = [];
    this.resultadosCompaniasSeguros = [];
    this.cuentasBancarias = new MatTableDataSource([]);
  }
  //Obtiene la lista de sucursales
  private listarSucursales(): void {
    this.sucursalServicio.listar().subscribe(res => {
      this.resultadosSucursalesPago = res.json();
    });
  }
  //Obtiene el listado de condiciones de iva
  private listarCondicionesIva() {
    this.afipCondicionIvaServicio.listar().subscribe(
      res => {
        this.condicionesIva = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de resumenes de clientes
  private listarResumenesClientes() {
    this.resumenClienteServicio.listar().subscribe(
      res => {
        this.resumenesClientes = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de situaciones de clientes
  private listarSituacionesClientes() {
    this.situacionClienteServicio.listar().subscribe(
      res => {
        this.situacionesClientes = res.json();
        this.establecerSituacionCliente();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece la situacion cliente por defecto
  private establecerSituacionCliente(): void {
    this.formulario.get('situacionCliente').setValue(this.situacionesClientes[0]);
  }
  //Obtiene el listado de condiciones de ventas
  private listarCondicionesVentas() {
    this.condicionVentaServicio.listar().subscribe(
      res => {
        this.condicionesVentas = res.json();
        this.establecerCondicionVenta();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece la condicion de venta por defecto
  private establecerCondicionVenta(): void {
    this.formulario.get('condicionVenta').setValue(this.condicionesVentas[0]);
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
      this.formulario.get('sucursalLugarPago').enable();
      this.formulario.get('afipCondicionIva').enable();
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('condicionVenta').enable();
      this.formulario.get('resumenCliente').enable();
      this.formulario.get('situacionCliente').enable();
      this.formulario.get('esSeguroPropio').enable();
      this.formulario.get('cobrador').enable();
      this.formulario.get('vendedor').enable();
      this.formulario.get('zona').enable();
      this.formulario.get('rubro').enable();
      this.formulario.get('imprimirControlDeuda').enable();
      this.formulario.get('estaActiva').enable();
    } else {
      this.formulario.get('sucursalLugarPago').disable();
      this.formulario.get('afipCondicionIva').disable();
      this.formulario.get('tipoDocumento').disable();
      this.formulario.get('condicionVenta').disable();
      this.formulario.get('resumenCliente').disable();
      this.formulario.get('situacionCliente').disable();
      this.formulario.get('esSeguroPropio').disable();
      this.formulario.get('cobrador').disable();
      this.formulario.get('vendedor').disable();
      this.formulario.get('zona').disable();
      this.formulario.get('rubro').disable();
      this.formulario.get('imprimirControlDeuda').disable();
      this.formulario.get('estaActiva').disable();
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
        this.establecerValoresPestania(nombre, false, false, true, 'idRazonSocial');
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
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch(opcion) {
      case 1:
        setTimeout(function () {
          document.getElementById('idRazonSocial').focus();
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
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('esCuentaCorriente').setValue(true);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formulario.get('clienteCuentasBancarias').setValue(this.cuentasBancarias.data);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerValoresPorDefecto();
          this.establecerSituacionCliente();
          this.establecerCondicionVenta();
          setTimeout(function() {
            document.getElementById('idRazonSocial').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('esCuentaCorriente').setValue(true);
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function() {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err;
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
    let valor = this.formulario.get(campo).value;
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
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if(documento) {
      switch(tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if(!respuesta) {
            let err = {codigo: 11010, mensaje: 'CUIT Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if(!respuesta2) {
            let err = {codigo: 11010, mensaje: 'CUIL Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if(!respuesta8) {
            let err = {codigo: 11010, mensaje: 'DNI Incorrecto!'};
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    console.log(elemento);
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.formulario.get('creditoLimite').setValue(elemento.creditoLimite ? this.appService.establecerDecimales(elemento.creditoLimite, 2) : null);
    this.formulario.get('descuentoFlete').setValue(elemento.descuentoFlete ? this.appService.desenmascararPorcentaje(elemento.descuentoFlete.toString(), 2) : null);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.formulario.get('creditoLimite').setValue(elemento.creditoLimite ? this.appService.establecerDecimales(elemento.creditoLimite, 2) : null);
    this.formulario.get('descuentoFlete').setValue(elemento.descuentoFlete ? this.appService.desenmascararPorcentaje(elemento.descuentoFlete.toString(), 2) : null);
  }
  //Cambio de elemento seleccionado en condicion venta
  public cambioCondicionVenta() {
    if(this.formulario.get('condicionVenta').value.nombre == "CONTADO") {
      this.formulario.get('resumenCliente').disable();
      this.formulario.get('resumenCliente').clearValidators();
    } else {
      // this.formulario.controls['resumenCliente'].setValidators(Validators.required);
      this.formulario.get('resumenCliente').setValidators(Validators.required);
      this.formulario.get('resumenCliente').enable();
    }
  }
  //Cambio de elemento seleccionado en tipo de seguro
  public cambioTipoSeguro() {
    if(this.formulario.get('esSeguroPropio').value) {
      this.formulario.get('companiaSeguro').setValidators(Validators.required);
      this.formulario.get('companiaSeguro').enable();
      this.formulario.get('numeroPolizaSeguro').setValidators(Validators.required);
      this.formulario.get('numeroPolizaSeguro').enable();
      this.formulario.get('vencimientoPolizaSeguro').setValidators(Validators.required);
      this.formulario.get('vencimientoPolizaSeguro').enable();
    } else {
      this.formulario.get('companiaSeguro').disable();
      this.formulario.get('companiaSeguro').clearValidators();
      this.formulario.get('numeroPolizaSeguro').disable();
      this.formulario.get('numeroPolizaSeguro').clearValidators();
      this.formulario.get('vencimientoPolizaSeguro').disable();
      this.formulario.get('vencimientoPolizaSeguro').clearValidators();
    }
  }
  //Abre el Modal para Listas de Precios
  public abrirListasPrecios(){
    let cliente;
    if(this.indiceSeleccionado==3){
      cliente= this.formulario.value.id;
    }
    if(this.indiceSeleccionado != 3){
      cliente = null;
    }
    const dialogRef = this.dialog.open(ListasDePreciosDialog, {
      width: '1200px',
      data: {
        soloLectura: this.soloLectura,
        listaPrecios: this.formulario.get('clienteOrdenesVentas').value,
        indiceSeleccionado: this.indiceSeleccionado,
        cliente: cliente
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      if(resultado){
        this.formulario.get('clienteOrdenesVentas').setValue(resultado);
        this.controlListaPrecios(resultado);
      }
    });
  }
  //Controla que al menos una lista de precio tenga una orden venta por defecto = true
  private controlListaPrecios(listaPrecios){
    let bandera= false; //cambia a true cuando un registro es porDefecto=true
    if(listaPrecios.length > 0){
      listaPrecios.forEach(item => {
        if(item.esOrdenVentaPorDefecto)
          bandera = true;
      });
      if(!bandera){
        this.abrirListasPrecios();
        this.toastr.warning("Un registro debe tener a Orden de Venta por defecto igual a SI");
      }
    }
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Obtiene la mascara de importe
  public obtenerMascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de importe
  public obtenerMascaraPorcentaje() {
    return this.appService.mascararPorcentajeDosEnteros();
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if(valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Establece los decimales de porcentaje
  public desenmascararPorcentaje(formulario, cantidad): void {

    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
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
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFd(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Cuenta Corriente' : 'Contado';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado e
  public displayFe(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Con Seguro Propio' : 'Sin Seguro Propio';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado f
  public displayFf(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Si' : 'No';
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
//
//Componente 
@Component({
  selector: 'lista-precios-dialogo',
  templateUrl: './lista-precios-dialog.html',
  styleUrls: ['./cliente.component.css']

})
export class ListasDePreciosDialog {
  //Define la pestaña en la que se encuentra el usuario
  public indiceSeleccionado: number = null;
  //Define el id Cliente cuando la pestaña es Actualizar
  public idCliente: number = null;
  //Define si los campos son soloLectura
  public soloLectura: boolean = null;
  //Define el formulario
  public formulario: FormGroup;
  //Define la observacion
  public observaciones: string;
  //Define si muestra el boton Modificar
  public btnMod:boolean = false;
  //Define el indice a modificar
  public indice:number = null;
  //Define el form control para el combo ordenes de venta
  public ordenventa: FormControl = new FormControl();
  //Define la lista de ordenes de ventas
  public ordenesVentas: Array<any> = [];
  //Define la lista de Precios
  public listaPrecios: Array<any> = [];
  //Define la lista para las tarifas 
  public tarifas: Array<any> = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define el form control para Empresa
  public empresa:FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define las columnas de las tablas
  public columnasEscala: string[] = [ 'mod', 'eliminar', 'descripcion', 'esOrdenVentaPorDefecto', 'tarifaDefecto', 'seguro', 'comisionCR', 'esContado', 'estaActiva', 'observaciones'];
  //Constructor
  constructor( private appService: AppService, public dialogRef: MatDialogRef<ListasDePreciosDialog>, @Inject(MAT_DIALOG_DATA) public data,
    private loaderService: LoaderService, private ordenVentaService: OrdenVentaService, private clienteServicio: ClienteService,
    private clienteOrdenVtaService: ClienteOrdenVentaService, private toastr: ToastrService, private ovTarifaService: OrdenVentaTarifaService,
    public dialog: MatDialog) {
      dialogRef.disableClose = true;
   }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
    });
    //Establece el formulario
    this.formulario = new FormGroup({
      id: new FormControl(),
      tipoOrdenVenta: new FormControl(),
      empresa: new FormControl(),
      cliente: new FormControl(),
      usuarioMod: new FormControl(),
      usuarioAlta: new FormControl(),
      ordenVenta: new FormControl('', Validators.required),
      esOrdenVentaPorDefecto: new FormControl('', Validators.required),      
      ordenVentaTarifaPorDefecto: new FormControl('', Validators.required),
      estaActiva: new FormControl('', Validators.required),
      fechaAlta: new FormControl(),
      fechaUltimaMod: new FormControl(),

    });
    //Establece si es soloLectura
    this.soloLectura = this.data.soloLectura;
    if(this.soloLectura)
      this.formulario.disable();
    //Establece la lista si la hay
    if(this.data.listaPrecios!= null){
      this.listaPrecios= this.data.listaPrecios;
      this.listar();
    }
    //Establece la pestaña
    this.indiceSeleccionado = this.data.indiceSeleccionado;
    //Establece el idCliente
    this.idCliente = this.data.cliente;
    console.log(this.indiceSeleccionado, this.idCliente);
    //Establecer empresa
    this.establecerEmpresa();
    //Autocompletado - Buscar por nombre cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAliasListaPrecio(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    });
  }
  //Establece la empresa
  private establecerEmpresa(){
    let empresa = this.appService.getEmpresa();
    this.formulario.get('empresa').setValue(empresa);
    this.empresa.setValue(empresa.razonSocial);
  }
  //Establece el tipo (empresa o cliente)
  public establecerTipo(): void {
    let tipoOrdenVenta = this.formulario.get('tipoOrdenVenta').value;
    this.limpiarCampos(tipoOrdenVenta);
    if (!tipoOrdenVenta) {
      this.listarOrdenesVentas('empresa');
      }
  }
  //Listar ordenes de ventas por Empresa/Cliente
  public listarOrdenesVentas(tipo) {
    this.loaderService.show();
    switch (tipo) {
      case 'empresa':
        this.establecerEmpresa();
        this.formulario.get('cliente').setValue(null);
        this.ordenVentaService.listarPorEmpresa(this.formulario.get('empresa').value.id).subscribe(
          res => {
            console.log(res.json());
            this.ordenesVentas = res.json();
            if(this.ordenesVentas.length == 0){
              this.toastr.warning("Órdenes de venta inexistente");
            }
            this.loaderService.hide();
          },
          err=>{
            let error = err.mensaje;
            this.toastr.error("Error al obtener la lista por empresa");
            this.loaderService.hide();
          }
        );
      break;
      case 'cliente':
        this.formulario.get('empresa').setValue({id: null});
        this.ordenVentaService.listarPorCliente(this.formulario.get('cliente').value.id).subscribe(
          res => {
            console.log(res.json());
            this.ordenesVentas = res.json();
            if(this.ordenesVentas.length == 0){
              this.toastr.warning("Órdenes de venta inexistente");
            }
            this.loaderService.hide();
          },
          err=>{
            let error = err.mensaje;
            this.toastr.error("Error al obtener la lista por cliente");
            this.loaderService.hide();
          }
        );
      break;
    }
  }
  //Limpia los campos seteados (si los hay) cuando se cambia el 'Tipo'
  private limpiarCampos(tipoOrdenVenta){
    this.formulario.reset();
    this.resultadosClientes = [];
    this.btnMod = false;
    this.indice = null;
    if(tipoOrdenVenta!=null)
      this.formulario.get('tipoOrdenVenta').setValue(tipoOrdenVenta);
  }
  //Controla el cambio en el campo 'Orden Vta'
  public cambioOrdenVenta(){
    this.formulario.get('estaActiva').setValue(this.formulario.value.ordenVenta.estaActiva);
    this.listarTarifasPorOV();
  }
  //Obtiene una lista de Tarifas por Orden Venta
  private listarTarifasPorOV(){
    console.log(this.formulario.value.ordenVenta.id);
    this.ovTarifaService.listarPorOrdenVenta(this.formulario.value.ordenVenta.id).subscribe(
      res=>{
        console.log(res.json());
        this.tarifas = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de Tarifas para la Orden de Venta seleccionada");
      }
    )
  }
  //Abre modal para cambiar Orden de Venta por defecto
  private cambiarPorDefecto(item, formulario){
    console.log(item);
    const dialogRef = this.dialog.open(CambiarOVporDefectoDialogo, {
      width: '750px',
      data: {  },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result == true && this.indiceSeleccionado == 1){
        item.esOrdenVentaPorDefecto= false;
        let indice = this.listaPrecios.indexOf(item);
        console.log(this.listaPrecios);
        this.limpiarCampos(null);
        this.listar();
        this.loaderService.hide();
      }
      if(result == true && this.indiceSeleccionado == 3){
        item.esOrdenVentaPorDefecto= false;
        this.modificarListaPrecio(); //Me borra el registro que anteriormente tenia esPorDefecto=true. Me lo deberia dejar y cambiar el campo a false
      }
      if(result == false && this.indiceSeleccionado!=1){
        this.listaPrecios.push(formulario.value);
        this.limpiarCampos(null);
        this.listar();
        this.loaderService.hide();
      }
    });
  }
  //Controla si ya existe alguna Orden de venta por defecto asignada al mismo Cliente
  private controlarOVPorDefecto(formulario){
    console.log(this.listaPrecios, formulario.value);
    if(this.listaPrecios.length>0){
      this.listaPrecios.forEach(item => {
        if(item.esOrdenVentaPorDefecto== true){
          console.log(this.listaPrecios);
          this.cambiarPorDefecto(item, formulario);
        }
          else{
            this.agregar(formulario);
        }       
      })
    }else{
      this.agregar(formulario);
    }
  }
  //Agrega directamente una lista de precio
  private agregar(formulario){
    this.clienteOrdenVtaService.agregar(formulario.value).subscribe(
      res=>{
        if(res.status == 201){
          this.toastr.success("Registro agregado con éxito");
          this.formulario.reset();
          this.clienteOrdenVtaService.listarPorCliente(this.idCliente).subscribe(
            res=>{
              this.listaPrecios = res.json();
              this.listar();
            },
            err=>{
              this.toastr.error("Error al obtener la Lista de Precios");
            }
          );
          this.loaderService.hide();
        }
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Carga a la Lista de Precios un nuevo elemento
  public agregarListaPrecio(){
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    if(this.indiceSeleccionado == 3){
      this.formulario.get('usuarioAlta').setValue(usuario);
      this.formulario.get('cliente').setValue({id: this.idCliente});
      // this.formulario.get('ordenVentaTarifaPorDefecto').setValue();
      if(this.formulario.value.esOrdenVentaPorDefecto == true){
        this.controlarOVPorDefecto(this.formulario);
      }
        else{
          this.agregar(this.formulario);
        }
    } 
    if(this.indiceSeleccionado != 3){ //Controlo desde el front que SOLO UNA  lista de precio sea porDefecto=true (OV) 
      // this.formulario.value.tipoTarifaPorDefecto = {id: null};
      if(this.formulario.value.esOrdenVentaPorDefecto == true){
        this.controlarOVPorDefecto(this.formulario);
      }
        else{
          this.listaPrecios.push(this.formulario.value);
          this.limpiarCampos(null);
          this.listar();
          this.loaderService.hide();
        }
    }
  }
  //Modifica un registro de la tabla
  public modificarListaPrecio(){
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    if(this.indiceSeleccionado == 3){
      this.formulario.get('usuarioMod').setValue(usuario);
      this.formulario.get('cliente').setValue({id: this.idCliente});
      // this.formulario.get('ordenVentaTarifaPorDefecto').setValue({id: null});
      this.clienteOrdenVtaService.actualizar(this.formulario.value).subscribe(
        res=>{
            this.formulario.reset();
            this.toastr.success("Registro actualizado con éxito");
            this.clienteOrdenVtaService.listarPorCliente(this.idCliente).subscribe(
              res=>{
                this.listaPrecios = res.json();
                this.listar();
              },
              err=>{
                this.toastr.error("Error al obtener la Lista de Precios");
              }
            );
            this.loaderService.hide();
      
        },
        err=>{
          let error = err.json();
          this.toastr.error("Error al actualizar el registro");
          this.loaderService.hide();
        }
      );
    }
    if(this.indiceSeleccionado != 3){
      this.formulario.value.ordenVenta.estaActiva = this.formulario.get('estaActiva').value;
      this.formulario.value.ordenVenta.usuarioMod = usuario;
      this.listaPrecios[this.indice] = this.formulario.value;
      this.limpiarCampos(null);
      this.listar();
      this.loaderService.hide();
    }
  }
  //Controla el boton 'mod' de la tabla
  public activarModPrecio(elemento, indice){
    console.log(elemento);
      this.formulario.patchValue(elemento);
      if(this.indiceSeleccionado==3){
        if(this.formulario.value.ordenVenta.cliente){
          this.formulario.get('tipoOrdenVenta').setValue(true);
          this.formulario.get('cliente').setValue(this.formulario.value.ordenVenta.cliente);
          this.listarOrdenesVentas('cliente');
          this.cambioOrdenVenta();
        }
          else{
            this.formulario.get('tipoOrdenVenta').setValue(false);
            this.formulario.get('empresa').setValue(this.formulario.value.ordenVenta.empresa);
            this.listarOrdenesVentas('empresa');
            this.cambioOrdenVenta();
          }
      }
        else{

        }
      this.indice = indice;
      this.btnMod = true;
      this.loaderService.hide();
  }
  //Controla el boton 'eliminar' de la tabla
  public activarEliminarPrecio(indice){
    this.loaderService.show();
    if(this.indiceSeleccionado == 3){
      console.log(this.listaPrecios[indice].id);
      this.clienteOrdenVtaService.eliminar(this.listaPrecios[indice].id).subscribe(
        res=>{
          this.toastr.success("Registro eliminado con éxito");
            this.clienteOrdenVtaService.listarPorCliente(this.idCliente).subscribe(
              res=>{
                console.log(res.json());
                this.listaPrecios = res.json();
                this.listar();
              },
              err=>{
                this.toastr.error("Error al obtener la Lista de Precios");
              }
            );
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.success("Error al eliminar el registro");
          this.loaderService.hide();
        }
      );
    }
    if(this.indiceSeleccionado != 3){
      this.listaPrecios.splice(indice, 1);
      this.limpiarCampos(null);
      this.listar();
      this.loaderService.hide();
    }
  }
  //Obtiene la Lista de Precios
  private listar(){
    this.listaCompleta = new MatTableDataSource(this.listaPrecios);
    this.listaCompleta.sort = this.sort;
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }  
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Compara las ordenes de venta
  public compareFo = this.compararFo.bind(this);
  private compararFo(a, b) {
    if (a.id != null && b.id != null) {
      return a.id === b.id;
    }
  }
  //Funcion para comparar y mostrar elemento del campo 'Tipo' 
  public compareT = this.compararT.bind(this);
  private compararT(a, b) {
    if (a != null && b != null) {
      return a === b;
    }
  }
  //Muestra el valor en los autocompletados
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  // onNoClick(): void {
  //     this.dialogRef.close();
  // }
}
//Componente Cambiar Moneda Principal Dialogo
@Component({
  selector: 'cambiar-pordefecto-dialogo',
  templateUrl: 'cambiar-pordefecto-dialogo.html',
})
export class CambiarOVporDefectoDialogo {
  //Constructor
  constructor(public dialogRef: MatDialogRef<CambiarOVporDefectoDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
   
}