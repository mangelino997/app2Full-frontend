import { Component, OnInit, Inject, Pipe, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';
import { AppService } from 'src/app/servicios/app.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ViajeTerceroTramoService } from 'src/app/servicios/viaje-tercero-tramo.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { AforoComponent } from '../aforo/aforo.component';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { Router } from '@angular/router';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { VentaComprobanteItemFA } from 'src/app/modelos/ventaComprobanteItemFA';
import { FceMiPymesDialogoComponent } from '../fce-mi-pymes-dialogo/fce-mi-pymes-dialogo.component';
import { EmpresaOrdenVentaService } from 'src/app/servicios/empresa-orden-venta.service';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { ListaRemitoDialogoComponent } from './lista-remito-dialogo/lista-remito-dialogo.component';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';
import { ContrareembolsoDialogoComponent } from './contrareembolso-dialogo/contrareembolso-dialogo.component';
import { TotalesCargaDialogoComponent } from './totales-carga-dialogo/totales-carga-dialogo.component';
import { TotalesConceptoDialogoComponent } from './totales-concepto-dialogo/totales-concepto-dialogo.component';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';
import { AfipCaeService } from 'src/app/servicios/afip-cae.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/modelos/loader';

@Component({
  selector: 'app-emitir-factura',
  templateUrl: './emitir-factura.component.html',
  styleUrls: ['./emitir-factura.component.css']
})
export class EmitirFacturaComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la tabla de ventas comprobantes items FA 
  public formularioVtaCpteItemFA: FormGroup;
  //Define los formularios para mostrar los datos del cliente remitente y destinatario
  public formularioRemitente: FormGroup;
  public formularioDestinatario: FormGroup;
  //Define la lista de Tipos de Comprobante
  public tiposComprobante = [];
  //Define la lista para Puntos de Venta
  public puntosDeVenta = [];
  //Define la lista de items a facturar
  public itemsAFacturar = [];
  //Define la lista de resultados de busqueda para Reminentes y Destinatarios
  public remitentes = [];
  public destinatarios = [];
  //Define la lista de resultados de sucursales para el Remitente y Destinatario
  public sucursalesRemitente = [];
  public sucursalesDestinatario = [];
  //Define la fecha actual
  public fechaActual: string = null;
  //Define el boton FCE MiPyMEs para habilitarlo o no
  public btnFCE: boolean = null;
  //Define el boton 'G.S' para habilitarlo o no
  public btnGS: boolean = null;
  //Define el boton 'Agregar Otro Remito' para habilitarlo o no
  public btnRemito: boolean = null;
  //Define el combo de items a facturar como un formControl
  public itemFactura: FormControl = new FormControl();
  //Define un item, lo guarda para volver atras en caso de que se arrepienta de cambiar de item
  public itemReserva: FormControl = new FormControl();
  //Define a Orden de Venta como un formControl
  public ordenVenta: FormControl = new FormControl();
  //Define el campo puntoVenta (el de solo lectura) como un formControl
  public puntoVenta: FormControl = new FormControl();
  //Define los datos de configuracion para el modal de listar Remitos
  public configuracionModalRemitos: FormControl;
  //Define la lista de Ordenes de Venta
  public ordenesVenta: Array<any> = [];
  //Define la lista de Tarifas de Orden Vta.
  public tarifasOrdenVta: Array<any> = [];
  //Define la lista de alicuotas iva CR
  public resultadosAlicuotasIvaCR = [];
  //Define el campo viajeRemito (el de solo lectura) como un formControl
  public viajeRemito: FormControl = new FormControl();
  //Define si los campos son de solo lectura
  public soloLectura: boolean = true;
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  //Define la lista de Remitos
  public resultadosRemitos = [];
  //Define el contador para la lista de items agregados
  public contador: FormControl = new FormControl();
  //Define la lista completa de registros - tabla de items agregados
  public listaCompletaItems = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnasItems: string[] = ['NUMERO_VIAJE', 'NUMERO_REMITO', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO', 'FLETE', 'SUBTOTAL', 'ALIC_IVA',
    'SUBTOTAL_IVA', 'QUITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la lista de Remitos pero con otro formato
  public listaRemitos = new MatTableDataSource([]);
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService, private ventaComprobanteService: VentaComprobanteService,
    public clienteService: ClienteService, private toastr: ToastrService, private tipoComprobanteService: TipoComprobanteService,
    private ventaComprobante: VentaComprobante, private appService: AppService, private empresaOrdenVtaService: EmpresaOrdenVentaService,
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService, private ventaCpteItemFA: VentaComprobanteItemFA,
    private afipComprobanteService: AfipComprobanteService, private ventaTipoItemService: VentaTipoItemService, private viajeRemitoServicio: ViajeRemitoService,
    private ordenVentaServicio: OrdenVentaService, private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ventaItemConceptoService: VentaItemConceptoService,
    private ordenVentaTarifaService: OrdenVentaTarifaService, private alicuotasIvaService: AfipAlicuotaIvaService, private route: Router,
    private afipCaeService: AfipCaeService, private monedaService: MonedaService, private monedaCotizacionService: MonedaCotizacionService,
    private loaderService: LoaderService) { }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los formularios y sus validaciones
    this.formulario = this.ventaComprobante.formulario; // formulario general (engloba los demás)
    this.formularioVtaCpteItemFA = this.ventaCpteItemFA.formulario; // formulario para los itemsFA
    this.formularioRemitente = new FormGroup({
      domicilio: new FormControl(),
      localidad: new FormControl(),
      afipCondicionIva: new FormControl(),
      condicionVenta: new FormControl(),
      tipoYNumeroDocumento: new FormControl()
    });
    this.formularioDestinatario = new FormGroup({
      domicilio: new FormControl(),
      localidad: new FormControl(),
      afipCondicionIva: new FormControl(),
      condicionVenta: new FormControl(),
      tipoYNumeroDocumento: new FormControl()
    });
    //Inicializa el formControl para la confoguracion del modal listarRemitos
    // this.configuracionModalRemitos = new FormControl({
    //   formularioFiltro: null,
    //   listaCompletaRemitos: null
    // });
    // this.formularioCR = this.factura.formularioContraReembolso; // formulario para contrareembolso
    this.reestablecerFormulario();
    //Obtiene la lista de tipos de comprobante
    this.listarTiposComprobante();
    //Obtiene la lista de puntos de venta 
    this.listarPuntosVenta();
    //Obtiene la lista de items
    this.listarItems();
    //Obtiene la lista de las alicuotas afip iva
    this.listarAlicuotaIva();
    //Autcompletado - Buscar por Remitente
    this.formulario.get('clienteRemitente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteService.listarActivosPorAlias(data).subscribe(res => {
          this.remitentes = res.json();
        })
      }
    });
    //Autcompletado - Buscar por Destinatario
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteService.listarActivosPorAlias(data).subscribe(res => {
          this.destinatarios = res.json();
        })
      }
    });
  }
  //Obtiene la lista de tipos de comprobante
  private listarTiposComprobante() {
    this.tipoComprobanteService.listarParaEmisionFactura().subscribe(
      res => {
        this.tiposComprobante = res.json();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene la lista de Puntos de Venta
  private listarPuntosVenta() {
    this.puntoVentaService.listarHabilitadosPorSucursalEmpresaYFe(this.formulario.value.empresa.id, this.formulario.value.sucursal.id).subscribe(
      res => {
        this.puntosDeVenta = res.json();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene la lista de Items
  private listarItems() {
    this.ventaTipoItemService.listarItems(1).subscribe(
      res => {
        this.itemsAFacturar = res.json();
      }, err => { this.toastr.error(err.json().message); }
    );
  }
  //Obtiene la lista de Ordenes de Venta de empresaOrdenVentaService
  private listarOrdenVentaEmpresa() {
    this.empresaOrdenVtaService.listar().subscribe(
      res => {
        this.ordenesVenta = res.json();
      }, err => { this.toastr.error(err.json().message); }
    )
  }
  //Obtiene la lista de Tarifas de Orden Venta
  private listarTarifasOrdenVta() {
    this.formularioVtaCpteItemFA.get('ordenVentaTarifa').enable();
    this.ordenVentaTarifaService.listarPorOrdenVenta(this.ordenVenta.value.id).subscribe(
      res => {
        this.tarifasOrdenVta = res.json();
        this.formularioVtaCpteItemFA.get('ordenVentaTarifa').setValue(this.tarifasOrdenVta[0]);
        this.cambioTipoTarifa();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva() {
    this.alicuotasIvaService.listarActivas().subscribe(
      res => {
        this.afipAlicuotasIva = res.json();
        this.resultadosAlicuotasIvaCR = res.json();
      }
    );
  }
  //Establece alicuota iva por defecto
  private establecerAlicuotaIva() {
    this.afipAlicuotasIva.forEach(elemento => {
      if (elemento.id == 5) {
        this.formularioVtaCpteItemFA.get('afipAlicuotaIva').setValue(elemento);
        this.formularioVtaCpteItemFA.get('alicuotaIva').setValue(elemento.alicuota);
      }
    })
  }
  //Limpia las listas
  private vaciarListas() {
    this.remitentes = [];
    this.destinatarios = [];
    this.sucursalesRemitente = [];
    this.sucursalesDestinatario = [];
    this.resultadosRemitos = [];
    this.listaCompletaItems = new MatTableDataSource([]);
    this.listaRemitos = new MatTableDataSource([]);
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public cambioPuntoVenta() {
    //Establece el formControl puntoVenta
    this.puntoVenta.setValue(this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5));
    this.validarFechaEmision();
    //Establece el campo 'Numero'
    this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0 ?
      this.cargarNumero(this.formulario.get('codigoAfip').value) : '';
    //Establece el atributo 'CAE' 'esCAEA'
    this.formulario.get('esCAEA').setValue(this.formulario.get('puntoVenta').value.feCAEA)
    this.formulario.get('puntoVenta').value.feCAEA ? this.obtenerCAE() : this.formulario.get('CAE').setValue(0);
  }
  //Obtiene el elemento CAE
  private obtenerCAE() {
    let fechaFactura = new Date(this.formulario.value.fechaEmision);
    let quincena;
    (fechaFactura.getDate() + 1) > 15 ? quincena = 2 : quincena = 1;
    this.afipCaeService.obtenerPorEmpresaYPeriodoOrden(this.appService.getEmpresa().id, fechaFactura.getFullYear(),
      (fechaFactura.getMonth() + 1), quincena).subscribe(
        res => {
          if (res.text() != '') {
            let respuesta = res.json();
            this.formulario.get('CAE').setValue(respuesta);
            this.formulario.get('CAEVencimiento').setValue(respuesta.fechaHasta)
          } else {
            this.toastr.warning("El elemento CAE obtenido es nulo.");
          }
        },
        err => {
          this.toastr.error(err.json().message);
        }
      )
  }
  //Controla el cambio en el campo Fecha
  public cambioFecha() {
    this.formulario.value.puntoVenta ? this.validarFechaEmision() : '';
    this.formulario.value.fechaVtoPago ? this.validarFechaVtoPago() : '';
  }
  //Controla el campo fecha de emision dependiento el punto de venta seleccionado
  private validarFechaEmision() {
    this.formulario.value.puntoVenta.feCAEA ? this.verificarFechaFeCAEA() : this.verificarFechaNoFeCAEA();
  }
  //Controla que fechaVtoPago no sea menor a fechaEmision
  private validarFechaVtoPago() {
    if (this.formulario.value.fechaVtoPago < this.formulario.value.fechaEmision) {
      this.formulario.get('fechaVtoPago').reset();
      this.toastr.warning("Fecha Vto. Pago no puede ser menor a Fecha Emisión. Se reseteó el Fecha Vto. Pago.");
    }
  }
  //Controla el rango valido para la fecha de emision cuando el punto de venta es feCAEA
  private verificarFechaFeCAEA() {
    if (this.formulario.value.fechaEmision >= this.generarFecha(-15) && this.formulario.value.fechaEmision <= this.generarFecha(+1)) {
      this.toastr.success("Fecha válida.");
    } else {
      this.toastr.error("El campo Fecha no es válido. Se establece la fecha actual.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }
  //Controla el rango valido para la fecha de emision cuando el punto de venta no es feCAEA
  private verificarFechaNoFeCAEA() {
    if (this.formulario.value.fechaEmision >= this.generarFecha(-5) && this.formulario.value.fechaEmision <= this.generarFecha(+1)) {
      this.toastr.success("Fecha válida.");
    } else {
      this.toastr.error("El campo Fecha no es válido.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }  //Genera y retorna una fecha segun los parametros que recibe (dias - puede ser + ó -)
  private generarFecha(dias) {
    let fechaActual = new Date();
    let fechaGenerada = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + (fechaActual.getDate() + dias); //Al mes se le debe sumar 1
    return fechaGenerada;
  }

  //Setea el codigo de Afip por el tipo de comprobante y la letra
  public cargarCodigoAfip(letra) {
    this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('tipoComprobante').value.id, letra).subscribe(
      res => {
        this.formulario.get('codigoAfip').setValue(res.text());
        this.cargarNumero(res.text());
      }
    );
  }
  //Setea el numero por el punto de venta y el codigo de Afip
  public cargarNumero(codigoAfip) {
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip,
      this.formulario.value.sucursal.id, this.formulario.value.empresa.id).subscribe(
        res => {
          this.formulario.get('numero').setValue(res.text());
        }
      );
  }
  //Maneja el cambio en el combo Items
  public cambioItem() {
    //Controlo si ya habia un item seleccionado y abro el modal de ser así
    this.formulario.value.afipConcepto ? this.abrirConfirmarDialogo("¿Está seguro de cambiar el Item?") : this.manejoCambioItem();
  }
  //Operaciones a aplicar con el cambio de item a facturar
  private manejoCambioItem() {
    this.reestablecerFormulario(); //Reuso el reestablecerFormulario
    this.itemReserva.setValue(this.itemFactura.value); //Guardo el item a facturar seleccionado
    this.itemFactura.setValue(this.itemReserva.value);//Si el item a facturar es un Remito (general/dador de carga) se establecen campos a solo lectura
    this.itemFactura.value.id == 1 || this.itemFactura.value.id == 2 ?
      [this.soloLectura = true, this.itemFactura.value.id == 2 ? this.btnGS = true : this.btnGS = false] : this.soloLectura = false;
    this.formulario.get('afipConcepto').setValue(this.itemFactura.value.afipConcepto);
    this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(this.itemFactura.value);
    this.itemFactura.value.id != 1 ? this.btnRemito = true : this.btnRemito = false; /*Controla si habilita el boton 'Agregar Otro Remito' deshabilita cuando es diferente de 'remito carga gral*/
    this.itemFactura.value.id == 1 ? this.abrirListaRemitoDialogo() : '';//Abre dialogo G.S cuando item.id == 1 (corresponde a 'Remito General G.S')
  }
  //Operaciones que aplica al arrepentirse de cambiar el item
  private manejoNoCambioItem() {
    this.itemFactura.setValue(this.itemReserva.value);
    document.getElementById('idRemitente').focus()
  }
  /*Abre modal para confirmar cambios  
    Si el cambio es en item: parametro idQuestion = 2
    Si el cambio es en boton 'Agregar otro remito': parametro idQuestion = 3
  */
  public abrirConfirmarDialogo(mensaje) {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '50%',
      maxWidth: '50%',
      data: {
        mensaje: mensaje
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (mensaje == '¿Está seguro de cambiar el Item?') {
        resultado ? this.manejoCambioItem() : this.manejoNoCambioItem();
      } else {
        resultado ? this.abrirListaRemitoDialogo() : '';
      }
    })
  }
  //Valida el tipo y numero documento, luego setea datos para mostrar y obtiene el listado de sucursales por Remitente
  public cambioRemitente() {
    let clienteRemitente = this.formulario.value.clienteRemitente;
    let res = this.validarDocumento(clienteRemitente.tipoDocumento, clienteRemitente.numeroDocumento, 'Remitente');
    if (res) {
      this.formularioRemitente.get('domicilio').setValue(clienteRemitente.domicilio);
      this.formularioRemitente.get('localidad').setValue(clienteRemitente.localidad.nombre);
      this.formularioRemitente.get('condicionVenta').setValue(clienteRemitente.condicionVenta.nombre);
      this.formularioRemitente.get('afipCondicionIva').setValue(clienteRemitente.afipCondicionIva.nombre);
      this.formularioRemitente.get('tipoYNumeroDocumento').setValue(
        clienteRemitente.tipoDocumento.nombre + ' - ' + clienteRemitente.numeroDocumento);
      this.listarSucursales('remitente', clienteRemitente.id);
      this.cambioPagoEnOrigen();
    }
    console.log(this.formularioVtaCpteItemFA.value);
  }
  /*Valida que el Destinatario no sea el mismo que el Remitente, luego valida el tipo y numero documento, 
  luego setea datos para mostrar y obtiene el listado de sucursales por Destinatario */
  public cambioDestinatario() {
    let clienteDestinatario = this.formulario.value.clienteDestinatario;
    let clienteRemitente = this.formulario.value.clienteRemitente;
    if (clienteRemitente && clienteDestinatario.id != clienteRemitente.id) {
      let res = this.validarDocumento(clienteDestinatario.tipoDocumento, clienteDestinatario.numeroDocumento, 'Destinatario');
      if (res) {
        this.formularioDestinatario.get('domicilio').setValue(clienteDestinatario.domicilio);
        this.formularioDestinatario.get('localidad').setValue(clienteDestinatario.localidad.nombre);
        this.formularioDestinatario.get('condicionVenta').setValue(clienteDestinatario.condicionVenta.nombre);
        this.formularioDestinatario.get('afipCondicionIva').setValue(clienteDestinatario.afipCondicionIva.nombre);
        this.formularioDestinatario.get('tipoYNumeroDocumento').setValue(
          clienteDestinatario.tipoDocumento.nombre + ' - ' + clienteDestinatario.numeroDocumento);
        this.listarSucursales('destinatario', clienteDestinatario.id);
        this.cambioPagoEnOrigen();
      }
    } else {
      clienteRemitente ? this.toastr.error("El Destinatario no puede ser el mismo que el Remitente.") :
        this.toastr.warning("Seleccione un Remitente.");
      this.formulario.get('clienteDestinatario').reset();
      this.formularioDestinatario.reset();
      document.getElementById('idDestinatario').focus();
    }
  }
  //Maneja el cambio en el campo Remito del item a agregar
  // public cambioRemito() {
  //   this.formularioVtaCpteItemFA.get('viajeRemito').setValue({ id: this.viajeRemito.value });
  // }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada 
  public cambioOrdenVta() {
    //Con cada cambio limpia los campos 'Tarifa' - 'pSeguro'
    this.formularioVtaCpteItemFA.get('pSeguro').reset();
    this.formularioVtaCpteItemFA.get('ordenVentaTarifa').reset()
    //Controla el campo 'Seguro'. El ordenVenta == false corresponde a 'Libre'
    if (this.ordenVenta.value == 'false') {
      this.formulario.value.cliente.esSeguroPropio ? this.formularioVtaCpteItemFA.get('importeSeguro').disable() :
        this.formularioVtaCpteItemFA.get('importeSeguro').enable();
      this.formularioVtaCpteItemFA.get('ordenVentaTarifa').disable();
    } else {
      this.formulario.value.cliente.esSeguroPropio ? this.formularioVtaCpteItemFA.get('pSeguro').disable() :
        this.formularioVtaCpteItemFA.get('pSeguro').setValue(this.appService.establecerDecimales(this.ordenVenta.value.ordenVenta.seguro, 2));
      this.listarTarifasOrdenVta();
    }
  }
  //Maneja el cambio en el campo 'Tarifa de Orden Vta.' y obtiene el precio del Flete
  public cambioTipoTarifa() {
    let kgMayor;
    let tipoTarifa = this.formularioVtaCpteItemFA.value.ordenVentaTarifa.id;
    let idOrdenVta = this.ordenVenta.value.ordenVenta.id;
    this.formularioVtaCpteItemFA.get('kilosEfectivo').value > this.formularioVtaCpteItemFA.get('kilosAforado').value ?
      kgMayor = this.formularioVtaCpteItemFA.get('kilosEfectivo').value : kgMayor = this.formularioVtaCpteItemFA.get('kilosAforado').value;
    switch (tipoTarifa) {
      case 1:
        this.obtenerPrecioFlete(idOrdenVta, this.formularioVtaCpteItemFA.get('bultos').value);
        break;
      case 2:
        this.obtenerPrecioFlete(idOrdenVta, kgMayor);
        break;
      case 3:
        kgMayor = kgMayor / 1000;
        this.obtenerPrecioFlete(idOrdenVta, kgMayor);
        break;
      case 4:
        this.obtenerPrecioFlete(idOrdenVta, this.formularioVtaCpteItemFA.get('m3').value);
        break;
    }
  }
  //Obtiene el precio del campo 'Flete'
  private obtenerPrecioFlete(idOrdenVenta, valor) {
    this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVenta, valor).subscribe(
      res => {
        let respuesta = res.json();
        this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
        this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
      },
      err => { this.toastr.warning("No existe escala tarifa para obtener el precio flete."); }
    );
  }
  //Maneja el cambio en el campo 'Alicuota Iva'
  public cambioAfipAlicuotaIva() {
    let elemento = this.formularioVtaCpteItemFA.value.afipAlicuotaIva;
    this.formularioVtaCpteItemFA.get('alicuotaIva').setValue(elemento.alicuota);
    this.calcularImporteIva();
  }
  //Obtiene el listado de sucursales para el remitente y destinatario
  private listarSucursales(tipoCliente, idCliente) {
    this.sucursalService.listarPorCliente(idCliente).subscribe(
      res => {
        if (tipoCliente == 'remitente') {
          this.sucursalesRemitente = res.json();
          this.sucursalesRemitente.length > 0 ? this.formulario.get('sucursalClienteRem').setValue(this.sucursalesRemitente[0]) : '';
        } else {
          this.sucursalesDestinatario = res.json();
          this.sucursalesDestinatario.length > 0 ? this.formulario.get('sucursalClienteDes').setValue(this.sucursalesDestinatario[0]) : '';
        }
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    );
  }
  //Validad el numero de documento
  public validarDocumento(tipoDocumento, documento, tipoCliente) {
    let respuesta;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err, 'id' + tipoCliente, 'label' + tipoCliente);
          }
          break;
        case 2:
          respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err, 'id' + tipoCliente, 'label' + tipoCliente);
          }
          break;
        case 8:
          respuesta = this.appService.validarDNI(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err, 'id' + tipoCliente, 'label' + tipoCliente);
          }
          break;
      }
    }
    return respuesta;
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err, idCampo, labelCampo) {
    this.formulario.get('numeroDocumento').setErrors({ 'incorrect': true });
    var respuesta = err;
    if (respuesta.codigo == 11010) {
      document.getElementById(labelCampo).classList.add('label-error');
      document.getElementById(idCampo).classList.add('is-invalid');
      document.getElementById(idCampo).focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Establece el punto de venta, letra, numero, codigoAfip
  public cambioPagoEnOrigen() {
    if (this.formulario.value.pagoEnOrigen == true) {
      document.getElementById('Remitente').className = "border has-float-label pagaSeleccionado";
      document.getElementById('Destinatario').className = "border has-float-label";
      this.formulario.get('cliente').setValue(this.formulario.get('clienteRemitente').value);
      this.formulario.get('condicionVenta').setValue({ id: this.formulario.get('clienteRemitente').value.condicionVenta.id });
      this.formulario.get('tipoDocumento').setValue(this.formulario.get('clienteRemitente').value.tipoDocumento);
      this.formulario.get('numeroDocumento').setValue(this.formulario.get('clienteRemitente').value.numeroDocumento);
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteRemitente').value.afipCondicionIva);
      this.formulario.get('cobrador').setValue(this.formulario.get('clienteRemitente').value.cobrador);
    }
    else {
      document.getElementById('Remitente').className = "border has-float-label";
      document.getElementById('Destinatario').className = "border has-float-label pagaSeleccionado";
      this.formulario.get('condicionVenta').setValue({ id: this.formulario.get('clienteDestinatario').value.condicionVenta.id });
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteDestinatario').value.afipCondicionIva);
      this.formulario.get('tipoDocumento').setValue(this.formulario.get('clienteDestinatario').value.tipoDocumento);
      this.formulario.get('numeroDocumento').setValue(this.formulario.get('clienteDestinatario').value.numeroDocumento);
      this.formulario.get('cobrador').setValue(this.formulario.get('clienteDestinatario').value.cobrador);
      this.formulario.get('cliente').setValue(this.formulario.get('clienteDestinatario').value);
    }
    this.controlCamposPorCliente();
    this.itemFactura.value.id != 1 ? [this.formularioVtaCpteItemFA.enable(), this.ordenVenta.enable(), this.reestablecerformularioVtaCpteItemFA()] : '';

  }
  //Controla campos segun datos del Cliente que paga - Sale del metodo 'cambioPagoEnOrigen'
  private controlCamposPorCliente() {
    //Controla el campo 'Letra' y obtiene el codigo afip
    this.formulario.value.condicionVenta.id == 1 ? this.formulario.get('letra').setValue('A') : this.formulario.get('letra').setValue('B');
    this.cargarCodigoAfip(this.formulario.value.letra);
    //Controla la lista para el campo 'Orden Venta'
    this.formulario.value.cliente.clienteOrdenesVentas.length > 0 ? this.ordenesVenta = this.formulario.value.cliente.clienteOrdenesVentas : this.listarOrdenVentaEmpresa();
    //Controla el campo 'Seguro'
    !this.formulario.value.cliente.esSeguroPropio ||
      (this.formulario.value.cliente.vencimientoPolizaSeguro ?
        this.formulario.value.cliente.vencimientoPolizaSeguro < this.formulario.value.fechaEmision : '') ?
      this.formularioVtaCpteItemFA.get('importeSeguro').enable() : this.formularioVtaCpteItemFA.get('importeSeguro').disable();
    //Controla si habilita el boton FCE MiPyMEs para abrir modal
    this.formulario.value.tipoComprobante.id == 26 && this.formulario.value.cliente.esReceptorFCE ? this.btnFCE = true : this.btnFCE = false;
  }
  //Abre dialogo para agregar un cliente eventual
  public agregarClienteEventual(tipoCliente): void {
    const dialogRef = this.dialog.open(ClienteEventualComponent, {
      width: '1200px',
      data: {
        formulario: null,
        usuario: this.appComponent.getUsuario()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        tipoCliente == 'Remitente' ? this.formulario.get('clienteRemitente').setValue(resultado) : this.formulario.get('clienteDestinatario').setValue(resultado);
        tipoCliente == 'Remitente' ? this.cambioRemitente() : this.cambioDestinatario();
      }
    });
  }
  //Abre dialogo de FCE MiPyMEs
  public abrirFCEMiPyMEs(): void {
    const dialogRef = this.dialog.open(FceMiPymesDialogoComponent, {
      width: '1200px',
      data: {
        cliente: this.formulario.get('cliente').value,
        fechaFactura: this.formulario.get('fechaEmision').value,
        fechaVtoPago: this.formulario.get('fechaVtoPago').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      resultado ? this.formulario.get('fechaVtoPago').setValue(resultado) : '';
    });
  }
  //Abre un modal para listar Remitos
  public abrirListaRemitoDialogo(): void {
    let esRemitoGeneral;
    this.itemFactura.value.id == 1 ? esRemitoGeneral = true : esRemitoGeneral = false;//itemFactura.value.id == 1 es Remito Gral. GS
    const dialogRef = this.dialog.open(ListaRemitoDialogoComponent, {
      width: '1200px',
      data: {
        esRemitoGeneral: esRemitoGeneral,
        listaItemsAsignados: this.listaCompletaItems.data,
        configuracionModalRemitos: this.configuracionModalRemitos.value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        let numeroViaje = resultado.configuracionModalRemitos.formularioFiltro.numeroViaje;
        let numeroRemito = resultado.configuracionModalRemitos.formularioFiltro.numeroRemito;
        this.establecerValoresRemitoSeleccionado(resultado.remitoSeleccionado, numeroViaje, numeroRemito);
        this.configuracionModalRemitos.setValue(resultado.configuracionModalRemitos);
      }
    });
  }
  /* Establece los valores del remito seleccionado en modal
   a los campos correspondientes del formulario vta cpte item FA */
  private establecerValoresRemitoSeleccionado(remitoSeleccionado, numeroViaje, numeroRemito) {
    this.ordenVenta.enable();
    this.formularioVtaCpteItemFA.enable();
    this.viajeRemito.setValue(numeroViaje);
    this.formularioVtaCpteItemFA.get('id').setValue(remitoSeleccionado.id); //con ello controlo los remitos asignados
    this.formularioVtaCpteItemFA.get('viajeRemito').setValue(remitoSeleccionado);
    this.formularioVtaCpteItemFA.get('numeroRemito').setValue(numeroRemito);
    this.formularioVtaCpteItemFA.get('bultos').setValue(remitoSeleccionado.viajeRemito.bultos);
    this.formularioVtaCpteItemFA.get('kilosEfectivo').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.kilosEfectivo.toString(), 2));
    this.formularioVtaCpteItemFA.get('kilosAforado').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.kilosAforado.toString(), 2));
    this.formularioVtaCpteItemFA.get('m3').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.m3.toString(), 2));
    this.formularioVtaCpteItemFA.get('valorDeclarado').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.valorDeclarado.toString(), 2));
    this.formularioVtaCpteItemFA.get('importeRetiro').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.importeRetiro.toString(), 2));
    this.formularioVtaCpteItemFA.get('importeEntrega').setValue(this.appService.establecerDecimales(remitoSeleccionado.viajeRemito.importeEntrega.toString(), 2));
  }
  //Abre un modal para agregar un aforo
  public abrirAforoDialogo(): void {
    const dialogRef = this.dialog.open(AforoComponent, {
      width: '1200px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {
      this.formularioVtaCpteItemFA.get('kilosAforado').setValue(resultado);
    });
  }
  //Abre dialogo de FCE MiPyMEs
  public abrirConceptosVarios(): void {
    const dialogRef = this.dialog.open(ConceptosVariosDialogo, {
      width: '1200px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      resultado ?
        [this.formularioVtaCpteItemFA.get('ventaItemConcepto').setValue(resultado.concepto),
        this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').setValue(resultado.importe)] : '';
      console.log(this.formularioVtaCpteItemFA.value);
    })
  }
  //Abre dialogo de Contrareembolso
  public abrirCRDialogo() {
    const dialogRef = this.dialog.open(ContrareembolsoDialogoComponent, {
      width: '1200px',
      data: { ventaComprobanteItemCR: this.formulario.value.ventaComprobanteItemCR }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      resultado ?
        this.formulario.get('ventaComprobanteItemCR').setValue([resultado]) : this.formulario.get('ventaComprobanteItemCR').setValue([]);
    })
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalCargaDialogo(): void {
    const dialogRef = this.dialog.open(TotalesCargaDialogoComponent, {
      width: '1200px',
      data: { items: this.listaCompletaItems.data }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalConceptoDialogo(): void {
    const dialogRef = this.dialog.open(TotalesConceptoDialogoComponent, {
      width: '1200px',
      data: { items: this.listaCompletaItems.data }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre un modal - Observaciones- para seleccionar la Nota de Impresion del Comprobante 
  public abrirObervacionDialogo(): void {
    let notaImpCpteCliente = this.formulario.value.cliente.notaImpresionComprobante;
    const dialogRef = this.dialog.open(ObservacionDialogo, {
      width: '70%',
      maxWidth: '70%',
      data: { notaImpCpteCliente: notaImpCpteCliente }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      // resultado ? this.formulario.value.cliente.notaImpresionComprobante = resultado : ''; ?? CONSULTAR DONDE SE GUARDA
    });
  }
  //Calcular el Subtotal del item agregado
  public calcularSubtotal() {
    //Establece el campo 'valorDeclarado' en decimales
    this.setDecimales(this.formularioVtaCpteItemFA.get('valorDeclarado'), 2)
    //Convierte a number los campos ya que estan en string. Para las operaciones.
    let retiro = Number(this.formularioVtaCpteItemFA.get('importeRetiro').value);
    let entrega = Number(this.formularioVtaCpteItemFA.get('importeEntrega').value);
    let descuento = Number(this.formularioVtaCpteItemFA.get('descuentoFlete').value);
    let valorDeclarado = Number(this.formularioVtaCpteItemFA.get('valorDeclarado').value);
    let pSeguro = Number(this.formularioVtaCpteItemFA.get('pSeguro').value);
    //valor del importeSeguro
    let importeSeguro;
    let flete;
    this.formularioVtaCpteItemFA.get('pSeguro').value ?
      importeSeguro = valorDeclarado * (pSeguro / 100) : importeSeguro = 0;
    this.formularioVtaCpteItemFA.get('importeSeguro').setValue(this.appService.establecerDecimales(importeSeguro, 2));
    this.formularioVtaCpteItemFA.get('flete').value ?
      flete = Number(this.formularioVtaCpteItemFA.get('flete').value) : flete = 0;
    //valor neto del flete (con/sin descuento)
    let fleteNeto;
    if (descuento > 0) {
      fleteNeto = flete - flete * (descuento / 100);
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(this.appService.establecerDecimales(flete, 2));
    } else {
      fleteNeto = flete;
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(this.appService.establecerDecimales(flete, 2));
    }
    this.calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega);
  }
  //Calcula el 'Subtotal' de cada item 
  private calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega) {
    let subtotal = importeSeguro + fleteNeto + retiro + entrega;
    this.formularioVtaCpteItemFA.get('importeNetoGravado').setValue(this.appService.establecerDecimales(subtotal, 2));
    this.calcularImporteIva();
  }
  //Calcula el 'Importe Iva' de cada item
  private calcularImporteIva() {
    let subtotal = this.formularioVtaCpteItemFA.get('importeNetoGravado').value;
    let alicuotaIva = this.formularioVtaCpteItemFA.get('alicuotaIva').value;
    let importeIva = subtotal * (alicuotaIva / 100);
    this.formularioVtaCpteItemFA.get('importeIva').setValue(this.appService.establecerDecimales(importeIva, 2));
  }
  //Convierte todos los campos necesarios para calcular el SubTotal a decimales y numericos
  // private convertirDecimalSubtotal() {
  //   if (this.formularioVtaCpteItemFA.get('valorDeclarado').value != null)
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('valorDeclarado'), 2);
  //   if (this.formularioVtaCpteItemFA.get('flete').value != null)
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
  //   if (this.formularioVtaCpteItemFA.get('importeRetiro').value != null)
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeRetiro'), 2);
  //   else {
  //     this.formularioVtaCpteItemFA.get('importeRetiro').setValue("0");
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeRetiro'), 2);
  //   }
  //   if (this.formularioVtaCpteItemFA.get('importeEntrega').value != null)
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeEntrega'), 2);
  //   else {
  //     this.formularioVtaCpteItemFA.get('importeEntrega').setValue("0");
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeEntrega'), 2);
  //   }
  //   if (this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').value != null)
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeVentaItemConcepto'), 2);
  //   else {
  //     this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').setValue("0");
  //     this.setDecimales(this.formularioVtaCpteItemFA.get('importeVentaItemConcepto'), 2);
  //   }
  //   // this.capturarDecimalSubtotal()
  // }
  //Captura los valores decimales y asigna a las variables
  // private capturarDecimalSubtotal() {
  //   //Asigno los valores sin la mascara
  //   if (this.formularioVtaCpteItemFA.get('valorDeclarado').value && this.formularioVtaCpteItemFA.get('flete').value) {
  //     let valorDeclarado = this.formularioVtaCpteItemFA.get('valorDeclarado').value;
  //     let importeSeguro = this.formularioVtaCpteItemFA.get('importeSeguro').value;
  //     let descuento = this.formularioVtaCpteItemFA.get('descuento').value;
  //     let flete = this.formularioVtaCpteItemFA.get('flete').value;
  //     let retiro = this.formularioVtaCpteItemFA.get('importeRetiro').value;
  //     let entrega = this.formularioVtaCpteItemFA.get('importeEntrega').value;
  //     let concepto = this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').value;
  //     let vdeclaradoNeto = valorDeclarado * (importeSeguro / 1000);
  //     this.calcularSubtotalItem(vdeclaradoNeto, flete, descuento, retiro, entrega, concepto);
  //   }
  // }
  //Agrega a un Array el item e impacta en la tabla
  public agregarItem() {
    console.log(this.formularioVtaCpteItemFA.value);
    this.formularioVtaCpteItemFA.get('ordenVentaTarifa').setValue({id: this.formularioVtaCpteItemFA.value.ordenVentaTarifa.id});
    this.formularioVtaCpteItemFA.get('provincia').setValue(this.formulario.get('cliente').value.localidad.provincia); //Guarda el idProvincia del Remitente
    this.listaCompletaItems.data.push(this.formularioVtaCpteItemFA.value);
    this.listaCompletaItems.sort = this.sort;
    this.contador.setValue(this.contador.value + 1);
    this.calcularImportesTotales();
    this.reestablecerformularioVtaCpteItemFA();
  }
  //Calcula los importes totales para la lista de Items agregados
  private calcularImportesTotales() {
    let impNtoGravadoTotal = 0;
    let importeIvaTotal = 0;
    this.listaCompletaItems.data.forEach(
      elemento => {
        impNtoGravadoTotal += Number(elemento.importeNetoGravado);
        importeIvaTotal += Number(elemento.importeIva);
      }
    )
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(impNtoGravadoTotal, 2));
    this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIvaTotal, 2));
    let importeTotal = Number(this.formulario.get('importeNetoGravado').value) + Number(this.formulario.get('importeIva').value);
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(importeTotal, 2));
    this.formulario.get('importeSaldo').setValue(this.appService.establecerDecimales(importeTotal, 2));

  }
  //Abre un dialogo para quitar item
  public quitarItemDialogo(indice) {
    const dialogRef = this.dialog.open(QuitarItemDialogo, {
      width: '50%',
      maxWidth: '50%',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      resultado ? this.quitarItem(indice) : '';
    })
  }
  //Elimina un item de los agregados a la lista
  private quitarItem(indice) {
    this.listaCompletaItems.data.splice(indice, 1);
    this.listaCompletaItems.sort = this.sort;
    this.contador.setValue(this.contador.value - 1);
    this.formulario.get('importeNetoGravado').reset();
    this.formulario.get('importeIva').reset();
    this.formulario.get('importeTotal').reset();
    this.itemFactura.enable();
    //Si Item a facturar es remito carga general - Viaje G.S.
    if (this.listaCompletaItems.data.length == 0 && this.itemFactura.value.id == 1) {
      this.reestablecerformularioVtaCpteItemFA();
      this.abrirListaRemitoDialogo();
    } else if (this.listaCompletaItems.data.length == 0 && (this.itemFactura.value.id != 1 && this.itemFactura.value.id != 2)) {
      this.reestablecerformularioVtaCpteItemFA();
      document.getElementById('idItem').focus();
    } else {
      this.itemFactura.disable();
      this.calcularImportesTotales();
      document.getElementById('idViaje').focus();
    }
  }
  //Calcula el subtotal con IVA para cada registro de la tabla items
  public calcularSubtotalConIvaElemento(elemento) {
    let importe = Number(elemento.importeNetoGravado);
    let iva = Number(elemento.importeIva);
    let subtotalConIva = importe + iva;
    return subtotalConIva;
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor, tipoCliente): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
      if (tipoCliente == 'remitente') {
        this.sucursalesRemitente = [];
        this.formularioRemitente.reset();
        this.formulario.get('cliente').reset();
        this.formulario.get('clienteRemitente').reset();
        document.getElementById('Remitente').className = "border has-float-label";
      } else {
        this.sucursalesDestinatario = [];
        this.formularioDestinatario.reset();
        this.formulario.get('cliente').reset();
        this.formulario.get('clienteDestinatario').reset();
        document.getElementById('Destinatario').className = "border has-float-label";
      }
    }
  }
  //Reestablece el formulario cuando cambia el item a facturar
  private reestablecerFormulario() {
    //Guardo por si existen datos ya cargados
    let puntoVenta = this.formulario.value.puntoVenta;
    let fechaEmision = this.formulario.value.fechaEmision;
    let tipoComprobante = this.formulario.value.tipoComprobante;
    //Vacio formularios y listas
    this.vaciarListas();
    this.contador.reset();
    this.formulario.reset();
    this.puntoVenta.reset();
    this.ordenVenta.reset();
    this.formularioRemitente.reset();
    this.formularioDestinatario.reset();
    this.formularioVtaCpteItemFA.reset();
    // this.formularioVtaCpteItemFA.disable();
    // this.ordenVenta.disable();
    //Reestablezco valores y controlo campos precargados
    this.configuracionModalRemitos = new FormControl({
      formularioFiltro: null,
      listaCompletaRemitos: null
    });
    fechaEmision ? this.formulario.get('fechaEmision').setValue(fechaEmision) : '';
    puntoVenta ? [this.formulario.get('puntoVenta').setValue(puntoVenta), this.cambioPuntoVenta()] : '';
    tipoComprobante ? [this.formulario.get('tipoComprobante').setValue(tipoComprobante), this.cambioFecha()] : '';
    this.establecerValoresPorDefecto();
    this.reestablecerformularioVtaCpteItemFA();
    //Establezco el foco
    puntoVenta && fechaEmision && tipoComprobante ? document.getElementById('idRemitente').focus() :
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto() {
    this.btnFCE = false;
    this.btnRemito = false;
    this.btnGS = false;
    this.formulario.get('pagoEnOrigen').setValue(true);
    this.formulario.get('importeNoGravado').setValue(0);
    this.formulario.get('importeOtrosTributos').setValue(0);
    this.formulario.get('ventaComprobanteItemCR').setValue([]);
    this.formulario.get('ventaComprobanteItemND').setValue([]);
    this.formulario.get('ventaComprobanteItemNC').setValue([]);
    this.formulario.get('ventaComprobanteItemFAs').setValue([]);
    this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0]);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
    this.formulario.get('usuarioAlta').setValue({id: this.appService.getUsuario().id});
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    //Obtiene - establece fechaEmision
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaEmision').setValue(res.json());
      this.formulario.get('fechaRegistracion').setValue(res.json());
      this.fechaActual = res.json();
    });
    //Obtiene - establece moneda y  monedaCotizacion
    this.obtenerMoneda();
  }
  //Obtiene - establece moneda 
  private obtenerMoneda() {
    this.monedaService.obtenerPorDefecto().subscribe(
      res => {
        if (res.text() != '') {
          let respuesta = res.json();
          this.formulario.get('moneda').setValue(respuesta);
          this.obtenerMonedaCotizacion(respuesta.id);
        }
      },
      err => { this.toastr.error(err.json().message); }
    )
  }
  //Obtiene - establece  monedaCotizacion
  private obtenerMonedaCotizacion(idMoneda) {
    this.monedaCotizacionService.obtenerRecientePorMoneda(idMoneda).subscribe(
      res => {
        if (res.text() != '') {
          this.formulario.get('monedaCotizacion').setValue(res.json());
        }
      },
      err => { this.toastr.error(err.json().message); }
    )
  }
  //Reestablece y limpia el formularioVtaCpteItemFA
  public reestablecerformularioVtaCpteItemFA() {
    this.formularioVtaCpteItemFA.reset();
    this.ordenVenta.reset();
    this.viajeRemito.reset();
    this.establecerValoresPorDefectoItemFA();
  }
  //Establece valores por defecto para el formulario
  private establecerValoresPorDefectoItemFA() {
    this.ordenVenta.reset();
    this.formularioVtaCpteItemFA.reset();
    this.establecerAlicuotaIva();
    this.formularioVtaCpteItemFA.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeRetiro').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeEntrega').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('flete').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('descuentoFlete').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(this.itemReserva.value);
    if (this.itemReserva.value)
      this.itemReserva.value.id == 1 || this.itemReserva.value.id == 2 ?
        [this.soloLectura = true, this.formularioVtaCpteItemFA.disable(), this.ordenVenta.disable()] : this.soloLectura = false;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
    } else {
      return '';
    }
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de enteros SIN decimales
  public mascararEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de enteros CON decimales
  public mascararEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.desenmascararPorcentaje(valor, cantidad)) : '';
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.setDecimales(valor, cantidad);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
  }

  public agregarVentaComprobante() {
    this.loaderService.show();
    console.log(this.controlarFactura());

    if (this.controlarFactura()) {
      console.log("entra");
      this.formulario.get('cliente').setValue({id: this.formulario.value.cliente.id});
      this.formulario.get('clienteDestinatario').setValue({id: this.formulario.value.clienteDestinatario.id});
      this.formulario.get('clienteRemitente').setValue({id: this.formulario.value.clienteRemitente.id});
      this.formulario.get('cobrador').setValue({id: this.formulario.value.cobrador.id});
      this.formulario.get('empresa').setValue({id: this.formulario.value.empresa.id});

      this.formulario.get('ventaComprobanteItemFAs').setValue(this.listaCompletaItems.data);
      this.formulario.get('puntoVenta').setValue(this.puntoVenta.value);
      console.log(this.formulario.value);
      this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
        res => {
          console.log(res);
          let respuesta = res.json();
          if (res.status == 201) {
            this.toastr.success(respuesta.mensaje);
            this.reestablecerFormulario();
          }
          this.loaderService.hide();
        },
        err => {
          var respuesta = err.json();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
      );
    }
  }
  //Controla campos antes de grabar la factura
  private controlarFactura() {
    let importeTotal = this.formulario.value.importeTotal;
    if (importeTotal == '0' || importeTotal == null) {
      this.toastr.error("Error: El importe total debe ser mayor a 0 para grabar factura.");
      return false;
    }
    else if (this.appService.getEmpresa().razonSocial == this.formulario.value.cliente.razonSocial) {
      this.toastr.error("El cliente que paga no puede ser igual al emisor de la factura");
      return false;
    }
    else {
      return true;
    }
  }





  // metodos que siguen no son aplicados / revision

  //Abre el dialogo para seleccionar un Tramo
  // public abrirDialogoTramo(): void {
  //   const dialogRef = this.dialog.open(ViajeDialogo, {
  //     width: '1200px',
  //     data: {
  //       tipoItem: this.itemFactura.value.id //le pasa 1 si es propio, 2 si es de tercero
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(resultado => {
  //     if (resultado.viaje != "" && resultado.remito != "") {
  //       //Deshabilita el combo "Item"
  //       this.itemFactura.disable();
  //       //setea los valores en cliente remitente
  //       this.formulario.get('clienteRemitente').setValue(resultado.remito.clienteRemitente);
  //       this.cambioRemitente();
  //       this.formulario.get('rem.sucursal').setValue(resultado.remito.clienteRemitente.sucursalLugarPago);
  //       //setea los valores en cliente destinatario
  //       this.formulario.get('clienteDestinatario').setValue(resultado.remito.clienteDestinatario);
  //       this.cambioDestinatario();
  //       this.formulario.get('des.sucursal').setValue(resultado.remito.clienteDestinatario.sucursalLugarPago);
  //       //Setea los valores en el formulario item
  //       this.formularioVtaCpteItemFA.get('viajeRemito').setValue(resultado.remito);
  //       this.formularioVtaCpteItemFA.get('bultos').setValue(resultado.remito.bultos);
  //       this.formularioVtaCpteItemFA.get('kilosEfectivo').setValue(resultado.remito.kilosEfectivo);
  //       this.setDecimales(this.formularioVtaCpteItemFA.get('kilosEfectivo'), 2);
  //       this.formularioVtaCpteItemFA.get('kilosAforado').setValue(resultado.remito.kilosAforado);
  //       this.setDecimales(this.formularioVtaCpteItemFA.get('kilosAforado'), 2);
  //       this.formularioVtaCpteItemFA.get('m3').setValue(resultado.remito.m3);
  //       if (resultado.remito.valorDeclarado)
  //         this.formularioVtaCpteItemFA.get('valorDeclarado').setValue(resultado.remito.valorDeclarado);
  //       if (resultado.remito.importeRetiro)
  //         this.formularioVtaCpteItemFA.get('importeRetiro').setValue(resultado.remito.importeRetiro);
  //       if (resultado.remito.importeEntrega)
  //         this.formularioVtaCpteItemFA.get('importeEntrega').setValue(resultado.remito.importeEntrega);

  //       this.formularioVtaCpteItemFA.get('numeroViaje').setValue(resultado.viaje);
  //       this.formularioVtaCpteItemFA.get('viajeRemito').setValue({ id: resultado.remito.id });
  //       this.viajeRemito.setValue(resultado.remito.id);
  //       document.getElementById('idPagoOrigen').focus();
  //     } else { //if(!resultado)
  //       this.itemFactura.reset();
  //       this.itemFactura.enable();
  //       document.getElementById('idItem').focus();
  //     }
  //   });
  //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
  // this.viajePropioTramoService.listarTramos(this.formularioVtaCpteItemFA.get('numeroViaje').value).subscribe(
  //   res=>{
  //     const dialogRef = this.dialog.open(ViajeDialogo, {
  //       width: '1200px',
  //       data: {
  //         tipoItem: this.formularioVtaCpteItemFA.get('ventaTipoItem').value.id, //le pasa 1 si es propio, 2 si es de tercero
  //         idViaje: this.formularioVtaCpteItemFA.get('numeroViaje').value
  //       }
  //     });
  //     dialogRef.afterClosed().subscribe(resultado => {
  //       this.formularioVtaCpteItemFA.get('idTramo').setValue(resultado);
  //       setTimeout(function() {
  //         document.getElementById('idRemito').focus();
  //       }, 20);
  //       this.listarRemitos();
  //     });
  //   },
  // err=>{
  //   this.toastr.error("No existen Tramos para el N° de viaje ingresado.");
  // }
  // );
  //Controla que un item CR agregado no se pueda volver a seleccionar (solo puede haber un contra reembolso)
  // public itemsDisponibles(opcion, item) {
  //   //opcion = 1 (saca de la lista de Remitos) opcion = 2 (agrega a la lista de Remitos) 
  //   switch (opcion) {
  //     case 1:
  //       for (let i = 0; i < this.resultadosItems.length; i++) {
  //         if (item.id == this.resultadosItems[i].id) {
  //           this.resultadosItems.splice(i, 1);
  //         }
  //       }
  //       break;
  //     case 2:
  //       this.resultadosItems.push(item);
  //       break;
  //   }
  // }




  //Obtiene la Lista de Remitos por el id del tramo seleccionado
  // public listarRemitos() {
  //   this.viajeRemitoServicio.listarRemitos(this.formularioVtaCpteItemFA.get('idTramo').value.id, this.formularioVtaCpteItemFA.get('ventaTipoItem').value.id).subscribe(
  //     res => {
  //       this.resultadosRemitos = res.json();
  //       if (this.resultadosRemitos.length == 0) {
  //         this.toastr.error("No existen Remitos para el Tramo seleccionado.");
  //         this.formularioVtaCpteItemFA.get('idTramo').setValue(null);
  //         this.formularioVtaCpteItemFA.get('numeroViaje').setValue(null);
  //         setTimeout(function () {
  //           document.getElementById('idViaje').focus();
  //         }, 20);
  //       } else {
  //         this.formularioVtaCpteItemFA.get('idTramo').setValue(this.resultadosRemitos[0].id);
  //       }
  //     },
  //     err => {
  //       this.formularioVtaCpteItemFA.get('idTramo').setValue(null);
  //       this.formularioVtaCpteItemFA.get('numeroViaje').setValue(null);
  //       setTimeout(function () {
  //         document.getElementById('idViaje').focus();
  //       }, 20);
  //     }
  //   );
  // }


  //METODO PRINCIPAL - EMITE LA FACTURA
  // public emitirFactura() {
  //   let afipConcepto = this.listaItemAgregados[0].ventaTipoItem.afipConcepto.id; //guardamos el id de afipConcepto del primer item de la tabla
  //   this.formulario.get('afipConcepto').setValue({
  //     id: afipConcepto
  //   });
  //   this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
  //   this.formulario.get('esCAEA').setValue(this.appComponent.getEmpresa().feCAEA);
  //   this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
  //   this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
  //   this.formulario.get('ventaComprobanteItemFAss').setValue(this.listaItemAgregados);
  //   //A PuntoVenta debo enviarle solo el valor, pero antes utilizo sus otros datos
  //   this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0].puntoVenta);
  //   this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
  //     res => {
  //       let respuesta = res.json();
  //       //Mantengo los datos en PuntoVenta
  //       this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0]);
  //       let puntoVentaCeros = this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5);
  //       this.puntoVenta.setValue(puntoVentaCeros);
  //       //Limpia todo menos los datos de cabecera
  //       // this.limpiarCuerpoFactura();
  //       this.abrirDialogoTramo();
  //       this.toastr.success(respuesta.mensaje);
  //     },
  //     err => {
  //       var respuesta = err.json();
  //       document.getElementById("idFecha").classList.add('label-error');
  //       document.getElementById("idFecha").classList.add('is-invalid');
  //       document.getElementById("idFecha").focus();
  //       this.toastr.error(respuesta.mensaje);
  //     }
  //   );
  // }
}


//Componente Conceptos Varios
@Component({
  selector: 'conceptos-varios-dialogo',
  templateUrl: 'conceptos-varios-dialogo.html',
})
export class ConceptosVariosDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de conceptos
  public conceptos: Array<any> = [];
  constructor(public dialogRef: MatDialogRef<ConceptosVariosDialogo>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService,
    private ventaItemConceptoService: VentaItemConceptoService, private toastr: ToastrService) {

  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = new FormGroup({
      concepto: new FormControl(),
      importe: new FormControl()
    })
    //Obtiene la lista de conceptos
    this.listarConceptos();
  }
  //Carga la lista de conceptos
  private listarConceptos() {
    this.ventaItemConceptoService.listar().subscribe(
      res => {
        console.log(res.json());
        this.conceptos = res.json();
      },
      err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Quitar Item Dialogo
@Component({
  selector: 'quitar-item-dialogo',
  templateUrl: 'quitar-item-dialogo.html',
})
export class QuitarItemDialogo {
  //Define el check
  public check: boolean = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  constructor(public dialogRef: MatDialogRef<QuitarItemDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    this.formulario = new FormGroup({});
    this.listaCompleta = this.data.items;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Viaje Dialogo
@Component({
  selector: 'viaje-dialogo',
  templateUrl: 'viaje-dialogo.html',
  styleUrls: ['./emitir-factura.component.css']

})
export class ViajeDialogo {
  //Define la empresa 
  public empresa: string;
  //Define el Tram y Remito
  public tramo: any;
  public remito: any;
  //Define la lista de remitos
  public resultadosRemitos = [];
  //Define la lista de tramos
  public resultadosTramos = [];
  //Define la lista de Remitos/Tramos pero con otro formato
  public listaTramos = new MatTableDataSource([]);
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define las columnas de la tabla
  public columnasRemitos: string[] = ['tramo', 'id', 'bultos', 'fecha', 'numeroViaje', 'remitente', 'destinatario', 'sucursalDestino', 'observaciones'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<ViajeDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private viajeTramoService: ViajeTramoService, private viajeTerceroTramoServicio: ViajeTerceroTramoService,
    public dialog: MatDialog) { }
  ngOnInit() {
    this.formulario = new FormGroup({
      viaje: new FormControl('', Validators.required),
      remito: new FormControl('', Validators.required),
      tramo: new FormControl('', Validators.required)
    });
  }
  //obtiene la lista de tramos por tipo y por el idViaje 
  public listarTramos() {
    let item = this.data.tipoItem;
    if (item == 1) {
      this.viajeTramoService.listarTramos(this.formulario.get('viaje').value).subscribe(
        res => {
          let respuesta = res.json();
          this.resultadosTramos = respuesta[0].viajeRemitos;
          this.listaTramos = new MatTableDataSource(res.json());
          this.listaTramos.sort = this.sort;
          this.formulario.get('tramo').setValue(respuesta[0].tramo);
          this.tramo = respuesta[0].tramo;
        }
      );
    }
    if (item == 2) {
      this.viajeTerceroTramoServicio.listarTramos(this.formulario.get('viaje').value).subscribe(
        res => {
          let respuesta = res.json();
          this.resultadosTramos = respuesta[0].viajeRemitos;
          this.listaTramos = new MatTableDataSource(res.json());
          this.listaTramos.sort = this.sort;
          this.formulario.get('tramo').setValue(respuesta[0].tramo);
          this.tramo = respuesta[0].tramo;
        }
      );
    }
  }
  //Controla la seleccion en tabla
  public cambioRemito(idFila, remito) {
    let fila = 'fila' + idFila;
    let filaSeleccionada = document.getElementsByClassName('planilla-seleccionada');
    for (let i = 0; i < filaSeleccionada.length; i++) {
      filaSeleccionada[i].className = "planilla-no-seleccionada";
    }
    document.getElementById(fila).className = "planilla-seleccionada";
    this.formulario.get('remito').setValue(remito);
  }
  //Abre un modal para mostrar las Observaciones
  public verObservaciones(observacion): void {
    const dialogRef = this.dialog.open(ObservacionDialogo, {
      width: '1200px',
      data: { observacion: observacion }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Observaciones Dialogo
@Component({
  selector: 'observacion-dialogo',
  templateUrl: 'observacion-dialogo.html',
  styleUrls: ['./emitir-factura.component.css']
})
export class ObservacionDialogo {
  //Define la notaImpresionComprobante seleccionada
  public notaImpCpteSeleccionada: FormControl = new FormControl();
  //Define el check
  // public check: boolean = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  constructor(public dialogRef: MatDialogRef<ObservacionDialogo>, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog,
    private ventaConfigService: VentaConfigService, private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = new FormGroup({
      notaImpresionComprobanteCliente: new FormControl(this.data.notaImpCpteCliente),
      notaImpresionComprobanteGral1: new FormControl(),
      notaImpresionComprobanteGral2: new FormControl()
    })
    //Obtiene la observaciones para notaImpresionComprobanteGral1 - notaImpresionComprobanteGral2
    this.obtenerNotaImpCpteGral();
  }
  //Establece las observaciones generales
  private obtenerNotaImpCpteGral() {
    this.ventaConfigService.obtenerPorId(1).subscribe(
      res => {
        console.log(res.json());
        this.formulario.patchValue(res.json());
        console.log(this.formulario.value);
      },
      err => { this.toastr.error(err.json().message); }
    )
  }
  //Controla los checkbox
  // public agregarObs($event) {
  //   if ($event.checked == true) {
  //     this.check = true;
  //     document.getElementById('check').className = "checkBoxSelected";
  //   }
  //   else {
  //     this.check = false;
  //     document.getElementById('check').className = "checkBoxNotSelected";
  //   }
  // }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

