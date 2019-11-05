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
import { ErrorPuntoVentaComponent } from '../error-punto-venta/error-punto-venta.component';
import { DecimalPipe } from '@angular/common';
import { isNumber } from 'util';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { VentaComprobanteItemFA } from 'src/app/modelos/ventaComprobanteItemFA';
import { FceMiPymesDialogoComponent } from '../fce-mi-pymes-dialogo/fce-mi-pymes-dialogo.component';
import { EmpresaOrdenVentaService } from 'src/app/servicios/empresa-orden-venta.service';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { element } from 'protractor';
import { ListaRemitoDialogoComponent } from './lista-remito-dialogo/lista-remito-dialogo.component';
import { ConfirmarDialogo } from '../actualizacion-precios/actualizacion-precios.component';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';

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
  //Define un formulario para el contrareembolso
  public formularioCR: FormGroup;
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
  //Define si el boton FCE MiPyMEs se habilita o no
  public btnFCE: boolean = null;
  //Define el combo de items a facturar como un formControl
  public itemFactura: FormControl = new FormControl();
  //Define a Orden de Venta como un formControl
  public ordenVenta: FormControl = new FormControl();
  //Define la lista de Ordenes de Venta
  public ordenesVenta: Array<any> = [];
  //Define la lista de Tarifas de Orden Vta.
  public tarifasOrdenVta: Array<any> = [];
  //Define el array de los items agregados. Impacta en la tabla
  public listaItemAgregados: Array<any> = [];
  //Define el contador para la lista de items agregados
  public contador: FormControl = new FormControl();
  //Define la lista completa de registros - tabla de items agregados
  public listaCompletaItems = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnasItems: string[] = ['NUMERO_VIAJE', 'NUMERO_REMITO', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO', 'FLETE', 'SUBTOTAL', 'ALIC_IVA',
    'SUBTOTAL_IVA', 'QUITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  //Define el siguiente id
  public siguienteId: number = null;
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente: FormControl = new FormControl();

  //Define el form control para los combos de Sucursales Remitente y Destinatario
  public sucursalDestinatario: FormControl = new FormControl();
  public sucursalRemitente: FormControl = new FormControl();
  //Define el form control para tipo de comprobante
  public tipoComprobante: FormControl = new FormControl();


  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];

  //Define la lista de Remitos
  public resultadosRemitos = [];
  //Define la lista de Remitos pero con otro formato
  public listaRemitos = new MatTableDataSource([]);
  //Define la lista de Tarifas O. Vta.
  public resultadosTarifas = [];
  //Define la lista de Conceptos Varios
  public resultadosConceptosVarios = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  public resultadosAlicuotasIvaCR = [];
  //Define el campo puntoVenta (el de solo lectura) como un formControl
  public puntoVenta: FormControl = new FormControl();
  //Define el campo viajeRemito (el de solo lectura) como un formControl
  public viajeRemito: FormControl = new FormControl();


  //Define el array del Contra Reembolso
  public listaCR: Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura: boolean = true;
  //Define si los campos para el formulario de Contra reembolso son visibles
  public soloLecturaCR: boolean = true;
  //Define el importeTotal como la suma de cada subtotal de cada item
  public subtotalSuma: FormControl = new FormControl();

  //Define la mascara de porcentaje
  public porcentajeMascara: any;
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  //Valor de prueba para calcular el subtotal con coma
  public flete: number = 0;
  //Define las columnas de la tabla
  public columnasRemitos: string[] = ['tramo', 'id', 'bultos', 'fecha', 'numeroViaje', 'remitente', 'destinatario', 'sucursalDestino', 'observaciones'];
  constructor(
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService, private ventaComprobanteService: VentaComprobanteService,
    public clienteService: ClienteService, private toastr: ToastrService, private tipoComprobanteService: TipoComprobanteService,
    private ventaComprobante: VentaComprobante, private appService: AppService, private empresaOrdenVtaService: EmpresaOrdenVentaService,
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService, private ventaCpteItemFA: VentaComprobanteItemFA,
    private afipComprobanteService: AfipComprobanteService, private ventaTipoItemService: VentaTipoItemService, private viajeRemitoServicio: ViajeRemitoService,
    private ordenVentaServicio: OrdenVentaService, private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ventaItemConceptoService: VentaItemConceptoService,
    private ordenVentaTarifaService: OrdenVentaTarifaService, private alicuotasIvaService: AfipAlicuotaIvaService, private route: Router) { }
  ngOnInit() {
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
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Obtiene la lista de Puntos de Venta
  private listarPuntosVenta() {
    this.puntoVentaService.listarHabilitadosPorSucursalEmpresaYFe(this.formulario.value.empresa.id, this.formulario.value.sucursal.id).subscribe(
      res => {
        this.puntosDeVenta = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Obtiene la lista de Items
  private listarItems() {
    this.ventaTipoItemService.listarItems(1).subscribe(
      res => {
        this.itemsAFacturar = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    );
  }
  //Obtiene la lista de Ordenes de Venta de empresaOrdenVentaService
  private listarOrdenVentaEmpresa() {
    this.empresaOrdenVtaService.listar().subscribe(
      res => {
        console.log(res.json());
        this.ordenesVenta = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Obtiene la lista de Tarifas de Orden Venta
  private listarTarifasOrdenVta() {
    this.formularioVtaCpteItemFA.get('ordenVentaTarifa').enable();
    this.ordenVentaTarifaService.listarPorOrdenVenta(this.ordenVenta.value.id).subscribe(
      res => {
        console.log(res.json());
        this.tarifasOrdenVta = res.json();
        this.formularioVtaCpteItemFA.get('ordenVentaTarifa').setValue(this.tarifasOrdenVta[0]);
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
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
        // this.formularioCR.get('alicuotaIva').setValue(elemento);
      }
    })
  }
  //Limpia las listas
  private vaciarListas() {
    this.remitentes = [];
    this.destinatarios = [];
    this.listaItemAgregados = [];
    this.sucursalesRemitente = [];
    this.sucursalesDestinatario = [];
    this.resultadosRemitos = [];
    this.listaCompletaItems = new MatTableDataSource([]);
    this.listaRemitos = new MatTableDataSource([]);
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto() {
    this.btnFCE = false;
    this.establecerAlicuotaIva();
    this.formulario.get('pagoEnOrigen').setValue(true);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
    this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0]);
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaEmision').setValue(res.json());
      this.formulario.get('fechaRegistracion').setValue(res.json());
      this.fechaActual = res.json();
    });
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public cambioPuntoVenta() {
    this.puntoVenta.setValue(this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5));
    this.validarFechaEmision();
    this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0 ?
      this.cargarNumero(this.formulario.get('codigoAfip').value) : '';
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
    this.formulario.value.afipConcepto ? this.abrirConfirmarDialogo() : this.manejoCambioItem();
  }
  //Operaciones a aplicar con el cambio de item a facturar
  private manejoCambioItem() {
    //Guardo el item a facturar seleccionado
    let itemFactura = this.itemFactura.value;
    //Reuso el reestablecerFormulario
    this.reestablecerFormulario();
    //Si el item a facturar es un Remito (general/dador de carga) se establecen campos a solo lectura
    this.itemFactura.setValue(itemFactura);
    itemFactura.id == 1 || itemFactura.id == 2 ? this.soloLectura = true : this.soloLectura = false;
    this.formulario.get('afipConcepto').setValue(itemFactura.afipConcepto);
    this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(itemFactura);
  }
  //Abre modal para confirmar cambios en campos de seleccion (item, tipoCpt, )
  public abrirConfirmarDialogo() {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '50%',
      maxWidth: '50%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {
      resultado ? this.manejoCambioItem() : document.getElementById('idRemitente').focus();
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
      this.cambioPagoEn();
    }
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
        this.cambioPagoEn();
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
  public cambioRemito() {
    this.formularioVtaCpteItemFA.get('viajeRemito').setValue({ id: this.viajeRemito.value });
  }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada 
  public cambioOrdenVta() {
    console.log(this.ordenVenta.value, this.formulario.value.cliente.esSeguroPropio);
    //Controla el campo 'Seguro'. El ordenVenta == false corresponde a 'Libre'
    if (this.ordenVenta.value == 'false') {
      this.formulario.value.cliente.esSeguroPropio ? this.formularioVtaCpteItemFA.get('importeSeguro').disable() :
        this.formularioVtaCpteItemFA.get('importeSeguro').enable();
      this.formularioVtaCpteItemFA.get('ordenVentaTarifa').disable();
    } else {
      console.log(this.ordenVenta.value.ordenVenta.seguro, this.formulario.value.cliente.esSeguroPropio);
      this.formulario.value.cliente.esSeguroPropio ? this.formularioVtaCpteItemFA.get('pSeguro').disable() :
        this.formularioVtaCpteItemFA.get('pSeguro').setValue(this.appService.establecerDecimales(this.ordenVenta.value.ordenVenta.seguro, 2));
      this.listarTarifasOrdenVta();
    }
    // this.obtenerPrecioFlete();
  }
  //Maneja el cambio en el campo 'Tarifa de Orden Vta.'
  public cambioTipoTarifa() {
    if (this.formularioVtaCpteItemFA.value.ordenVentaTarifa.tipoTarifa.id == 3) {
      let valorFlete;
      this.formularioVtaCpteItemFA.value.kilosEfectivo ?
        valorFlete = (this.formularioVtaCpteItemFA.value.kilosEfectivo / 1000) :
        valorFlete = (this.formularioVtaCpteItemFA.value.kilosAforadoCampo / 1000);
      this.ordenVentaEscalaServicio.obtenerPrecioFlete(this.ordenVenta.value.id, valorFlete).subscribe(
        res => {
          console.log(res.json(), valorFlete);
          this.formularioVtaCpteItemFA.get('flete').setValue(this.appService.establecerDecimales(res.json(), 2));
          // this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
        }
      );
    }
  }
  //Maneja el cambio en el campo 'Alicuota Iva'
  public cambioAfipAlicuotaIva() {
    let elemento = this.formularioVtaCpteItemFA.value.afipAlicuotaIva;
    this.formularioVtaCpteItemFA.get('alicuotaIva').setValue(elemento.alicuota);
    this.calcularImporteIva();
    console.log(this.formularioVtaCpteItemFA.value);
  }
  //Obtiene el listado de sucursales para el remitente y destinatario
  private listarSucursales(tipoCliente, idCliente) {
    this.sucursalService.listarPorCliente(idCliente).subscribe(
      res => {
        if (tipoCliente == 'remitente') {
          this.sucursalesRemitente = res.json();
          this.sucursalesRemitente.length > 0 ? this.formulario.get('sucursalClienteRem').setValue(this.sucursalesRemitente[0]) : '';
        } else {
          this.sucursalDestinatario = res.json();
          this.sucursalesDestinatario.length > 0 ? this.formulario.get('sucursalClienteDes').setValue(this.sucursalDestinatario[0]) : '';
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
  public cambioPagoEn() {
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
  }
  //Controla campos segun datos del Cliente que paga - Sale del metodo 'cambioPagoEn'
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
      console.log(resultado);
      if (resultado) {
        tipoCliente == 'Remitente' ? this.formulario.get('clienteRemitente').setValue(resultado) : this.formulario.get('clienteDestinatario').setValue(resultado);
        tipoCliente == 'Remitente' ? this.cambioRemitente() : this.cambioDestinatario();
      }
      // this.clienteService.obtenerPorId(resultado).subscribe(res => {
      //   console.log(res.json());

      //   // this.formulario.get('cliente').setValue(res.json());
      // })
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
    //itemFactura.value.id == 1 es Remito Gral. GS
    this.itemFactura.value.id == 1 ? esRemitoGeneral = true : esRemitoGeneral = false;
    const dialogRef = this.dialog.open(ListaRemitoDialogoComponent, {
      width: '1200px',
      data: {
        esRemitoGeneral: esRemitoGeneral
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {

    });
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
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      resultado ? [
        this.formularioVtaCpteItemFA.get('ventaItemConcepto').setValue(resultado.concepto),
        this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').setValue(resultado.importe)
      ] : '';
    })

  }
  //Calcular el Subtotal del item agregado
  public calcularSubtotal() {
    let retiro = Number(this.formularioVtaCpteItemFA.get('importeRetiro').value);
    let entrega = Number(this.formularioVtaCpteItemFA.get('importeEntrega').value);
    let descuento = Number(this.formularioVtaCpteItemFA.get('descuentoFlete').value);
    let valorDeclarado = Number(this.formularioVtaCpteItemFA.get('valorDeclarado').value);
    let pSeguro = Number(this.formularioVtaCpteItemFA.get('pSeguro').value);
    let importeSeguro;
    let flete;
    //valor del importeSeguro
    this.formularioVtaCpteItemFA.get('pSeguro').value ?
      importeSeguro = valorDeclarado * (pSeguro / 100) : importeSeguro = 0;
    this.formularioVtaCpteItemFA.get('importeSeguro').setValue(importeSeguro);
    this.formularioVtaCpteItemFA.get('flete').value ?
      flete = Number(this.formularioVtaCpteItemFA.get('flete').value) : flete = 0;
    //valor neto del flete (con/sin descuento)
    let fleteNeto;
    if (descuento > 0) {
      fleteNeto = flete - flete * (descuento / 100);
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(flete);
    } else {
      fleteNeto = flete;
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(flete);
    }
    this.calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega);
  }
  //Calcula el 'Subtotal' de cada item 
  private calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega) {
    let subtotal = importeSeguro + fleteNeto + retiro + entrega;
    this.formularioVtaCpteItemFA.get('importeNetoGravado').setValue(this.appService.establecerDecimales(subtotal, 2));
    this.calcularImporteIva();
    console.log(this.formularioVtaCpteItemFA.value);
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
    // if (!this.formularioVtaCpteItemFA.get('m3').value)
    //   this.formularioVtaCpteItemFA.get('m3').setValue(0);
    // if (!this.formularioVtaCpteItemFA.get('importeNoGravado').value)
    //   this.formularioVtaCpteItemFA.get('importeNoGravado').setValue(0);
    //Guarda el idProvincia del Remitente
    this.formularioVtaCpteItemFA.get('provincia').setValue(this.formulario.get('cliente').value.localidad.provincia);
    this.listaItemAgregados.push(this.formularioVtaCpteItemFA.value);
    this.listaCompletaItems = new MatTableDataSource(this.listaItemAgregados);
    this.listaCompletaItems.sort = this.sort;
    this.contador.setValue(this.contador.value + 1);
    this.calcularImportesTotales();
    this.reestablecerformularioVtaCpteItemFA();
  }
  //Calcula los importes totales para la lista de Items agregados
  private calcularImportesTotales() {
    let impNtoGravadoTotal = 0;
    let importeIvaTotal = 0;
    this.listaItemAgregados.forEach(
      elemento => {
        impNtoGravadoTotal += Number(elemento.importeNetoGravado);
        importeIvaTotal += Number(elemento.importeIva);
      }
    )
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(impNtoGravadoTotal, 2));
    this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIvaTotal, 2));
    let importeTotal = Number(this.formulario.get('importeNetoGravado').value) + Number(this.formulario.get('importeIva').value);
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(importeTotal, 2));
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
      console.log(resultado);
      resultado ? this.quitarItem(indice) : '';
    })
  }
  //Elimina un item de los agregados a la lista
  private quitarItem(indice) {
    this.listaItemAgregados.splice(indice, 1);
    this.listaCompletaItems = new MatTableDataSource(this.listaItemAgregados);
    this.listaCompletaItems.sort = this.sort;
    this.contador.setValue(this.contador.value - 1);
    this.formulario.get('importeNetoGravado').reset();
    this.formulario.get('importeIva').reset();
    this.formulario.get('importeTotal').reset();
    this.itemFactura.enable();
    //Si Item a facturar es remito carga general - Viaje G.S.
    if (this.listaItemAgregados.length == 0 && this.itemFactura.value.id == 1) {
      this.reestablecerformularioVtaCpteItemFA();
      this.abrirListaRemitoDialogo();
    } else if (this.listaItemAgregados.length == 0) {
      this.reestablecerformularioVtaCpteItemFA();
      document.getElementById('idItem').focus();
    } else {
      this.itemFactura.disable();
      this.calcularImportesTotales();
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
        this.formularioRemitente.reset();
        document.getElementById('Remitente').className = "border has-float-label";
        this.sucursalesRemitente = [];
      } else {
        this.formularioDestinatario.reset();
        document.getElementById('Destinatario').className = "border has-float-label";
        this.sucursalesDestinatario = [];
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
    //Reestablezco valores y controlo campos precargados
    fechaEmision ? this.formulario.get('fechaEmision').setValue(fechaEmision) : '';
    puntoVenta ? [this.formulario.get('puntoVenta').setValue(puntoVenta), this.cambioPuntoVenta()] : '';
    tipoComprobante ? [this.formulario.get('tipoComprobante').setValue(tipoComprobante), this.cambioFecha()] : '';
    this.establecerValoresPorDefecto();
    //Establezco el foco
    puntoVenta && fechaEmision && tipoComprobante ? document.getElementById('idRemitente').focus() :
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
  }
  //Reestablecer formulario item-viaje
  public reestablecerformularioVtaCpteItemFA() {
    // if (this.listaItemAgregados.length > 0) {
    //   this.itemFactura.disable();
    // } else {
    //   this.itemFactura.enable();
    //   this.itemFactura.reset();
    //   // this.formulario.get('clienteRemitente').reset();
    //   // this.formulario.get('clienteDestinatario').reset();
    //   // this.formulario.get('pagoEnOrigen').reset();
    // }
    let numeroViaje = this.formularioVtaCpteItemFA.get('viajeRemito').value;
    let numeroRemito = this.formularioVtaCpteItemFA.get('numeroRemito').value;
    this.formularioVtaCpteItemFA.reset();

    this.formularioVtaCpteItemFA.get('viajeRemito').setValue(numeroViaje);
    this.formularioVtaCpteItemFA.get('numeroRemito').setValue(numeroRemito);
    this.ordenVenta.reset();
    this.establecerAlicuotaIva();
    this.soloLectura = false;
    document.getElementById('idBultos').focus();
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










  //Maneja los cambios cuando el item seleccionado es Contrareembolso
  // private manejarContrareembolso() {
  //   this.soloLecturaCR = false;
  //   this.soloLectura = true;
  //   this.formularioVtaCpteItemFA.get('viajeRemito').disable();
  //   this.formularioVtaCpteItemFA.get('ordenVenta').disable();
  //   this.formularioVtaCpteItemFA.get('conceptosVarios').disable();
  //   this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').disable();
  //   this.formularioVtaCpteItemFA.get('alicuotaIva').disable();
  //   this.formularioCR.get('ordenVenta').enable();
  //   this.formularioCR.get('alicuotaIva').enable();
  //   this.formularioCR.get('item').setValue(this.formularioVtaCpteItemFA.get('ventaTipoItem').value);
  //   this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(null); //reestablece
  //   setTimeout(function () {
  //     document.getElementById('idContraReembolso').focus();
  //   }, 20);
  // }
  //Maneja los cambios cuando el item seleccionado es diferente de Contrareembolso
  private manejarItems() {
    this.soloLecturaCR = true;
    this.soloLectura = false;
    this.formularioVtaCpteItemFA.get('viajeRemito').enable();
    this.formularioVtaCpteItemFA.get('ordenVenta').enable();
    this.formularioVtaCpteItemFA.get('conceptosVarios').enable();
    this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').enable();
    this.formularioVtaCpteItemFA.get('alicuotaIva').enable();
    this.listarConceptos();
  }
  //Abre el dialogo para seleccionar un Tramo
  public abrirDialogoTramo(): void {
    const dialogRef = this.dialog.open(ViajeDialogo, {
      width: '1200px',
      data: {
        tipoItem: this.itemFactura.value.id //le pasa 1 si es propio, 2 si es de tercero
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado.viaje != "" && resultado.remito != "") {
        //Deshabilita el combo "Item"
        this.itemFactura.disable();
        //setea los valores en cliente remitente
        this.formulario.get('clienteRemitente').setValue(resultado.remito.clienteRemitente);
        this.cambioRemitente();
        this.formulario.get('rem.sucursal').setValue(resultado.remito.clienteRemitente.sucursalLugarPago);
        //setea los valores en cliente destinatario
        this.formulario.get('clienteDestinatario').setValue(resultado.remito.clienteDestinatario);
        this.cambioDestinatario();
        this.formulario.get('des.sucursal').setValue(resultado.remito.clienteDestinatario.sucursalLugarPago);
        //Setea los valores en el formulario item
        this.formularioVtaCpteItemFA.get('viajeRemito').setValue(resultado.remito);
        this.formularioVtaCpteItemFA.get('bultos').setValue(resultado.remito.bultos);
        this.formularioVtaCpteItemFA.get('kilosEfectivo').setValue(resultado.remito.kilosEfectivo);
        this.setDecimales(this.formularioVtaCpteItemFA.get('kilosEfectivo'), 2);
        this.formularioVtaCpteItemFA.get('kilosAforado').setValue(resultado.remito.kilosAforado);
        this.setDecimales(this.formularioVtaCpteItemFA.get('kilosAforado'), 2);
        this.formularioVtaCpteItemFA.get('m3').setValue(resultado.remito.m3);
        if (resultado.remito.valorDeclarado)
          this.formularioVtaCpteItemFA.get('valorDeclarado').setValue(resultado.remito.valorDeclarado);
        if (resultado.remito.importeRetiro)
          this.formularioVtaCpteItemFA.get('importeRetiro').setValue(resultado.remito.importeRetiro);
        if (resultado.remito.importeEntrega)
          this.formularioVtaCpteItemFA.get('importeEntrega').setValue(resultado.remito.importeEntrega);

        this.formularioVtaCpteItemFA.get('numeroViaje').setValue(resultado.viaje);
        this.formularioVtaCpteItemFA.get('viajeRemito').setValue({ id: resultado.remito.id });
        this.viajeRemito.setValue(resultado.remito.id);
        document.getElementById('idPagoOrigen').focus();
      } else { //if(!resultado)
        this.itemFactura.reset();
        this.itemFactura.enable();
        document.getElementById('idItem').focus();
      }
    });
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
  }





  //Reestablecer formulario ContraReembolso
  public reestablecerFormularioCR() {
    this.soloLecturaCR = false;
    document.getElementById('idItem').focus();
  }
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



  //Agrega un Contra Reembolso
  public agregarCR() {
    if (this.formularioCR.get('importeContraReembolso').value > 0 || this.formularioCR.get('importeContraReembolso').value != null) {
      this.listaCR.push(this.formularioCR.value);
      this.reestablecerFormularioCR();
      let importeContraReembolso = parseFloat(this.formularioCR.get('importeContraReembolso').value);
      let alicuotaIva = this.formularioCR.get('alicuotaIva').value.alicuota;
      let importeIva = importeContraReembolso * (alicuotaIva / 100);

      this.formularioCR.get('importeIva').setValue(importeIva); //guardo en cada item el importe extra (iva)
      this.setDecimales(this.formularioCR.get('importeIva'), 2);
      let importeIvaTotal = parseFloat(this.formulario.get('importeIva').value) + importeIva;
      this.formulario.get('importeIva').setValue(importeIvaTotal); //sumo en el formulario general (cabecera de la factura)
      this.setDecimales(this.formulario.get('importeIva'), 2);

      if (!this.formulario.get('importeNetoGravado').value) {
        this.formulario.get('importeNetoGravado').setValue("0");
        this.setDecimales(this.formulario.get('importeNetoGravado'), 2);
      } else {
        this.setDecimales(this.formulario.get('importeNetoGravado'), 2);
      }
      let sumaImporteNetoGravado = parseFloat(this.formulario.get('importeNetoGravado').value) + parseFloat(this.formularioCR.get('importeContraReembolso').value);
      this.formulario.get('importeNetoGravado').setValue(sumaImporteNetoGravado);
      this.setDecimales(this.formulario.get('importeNetoGravado'), 2);

      let importeTotal = parseFloat(this.formulario.get('importeNetoGravado').value) + parseFloat(this.formulario.get('importeIva').value);
      this.formulario.get('importeTotal').setValue(importeTotal);
      this.setDecimales(this.formulario.get('importeTotal'), 2);
    }
  }
  //Elimina un Contra Reembolso
  public eliminarCR() {
    this.soloLecturaCR = false;
    let subtotal = parseFloat(this.formularioCR.get('importeContraReembolso').value);
    let subtotalIva = parseFloat(this.formularioCR.get('importeIva').value);
    this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value - subtotal);
    this.setDecimales(this.formulario.get('importeNetoGravado'), 2);

    this.formulario.get('importeIva').setValue(this.formulario.get('importeIva').value - subtotalIva);
    this.setDecimales(this.formulario.get('importeIva'), 2);

    let importeTotal = subtotal + subtotalIva;
    this.formulario.get('importeTotal').setValue(this.formulario.get('importeTotal').value - importeTotal);
    this.setDecimales(this.formulario.get('importeTotal'), 2);

    this.formularioCR.reset();
    this.listaCR.splice(0, 1);
  }
  //Habilita y carga los campos una vez que se selecciono el item
  public habilitarCamposItem() {
    if (this.formularioVtaCpteItemFA.get('ventaTipoItem').value.id == 4) { //el item con id=4 es Contrareembolso
      this.soloLecturaCR = false;
      this.soloLectura = true;
      this.formularioVtaCpteItemFA.get('viajeRemito').disable();
      this.formularioVtaCpteItemFA.get('ordenVenta').disable();
      this.formularioVtaCpteItemFA.get('conceptosVarios').disable();
      this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').disable();
      this.formularioVtaCpteItemFA.get('alicuotaIva').disable();
      this.formularioCR.get('ordenVenta').enable();
      this.formularioCR.get('alicuotaIva').enable();
      this.formularioCR.get('item').setValue(this.formularioVtaCpteItemFA.get('ventaTipoItem').value);
      this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(null); //reestablece
      setTimeout(function () {
        document.getElementById('idContraReembolso').focus();
      }, 20);
    } else {
      this.soloLecturaCR = true;
      this.soloLectura = false;
      this.formularioVtaCpteItemFA.get('viajeRemito').enable();
      this.formularioVtaCpteItemFA.get('ordenVenta').enable();
      this.formularioVtaCpteItemFA.get('conceptosVarios').enable();
      this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').enable();
      this.formularioVtaCpteItemFA.get('alicuotaIva').enable();
      this.formularioCR.get('ordenVenta').disable();
      this.formularioCR.get('alicuotaIva').disable();
      this.listarConceptos();
      setTimeout(function () {
        document.getElementById('idViaje').focus();
      }, 20);
    }
  }
  // Habilita el campo Precio de Concepto Venta
  public habilitarPrecioCV() {
    this.formularioVtaCpteItemFA.get('importeVentaItemConcepto').enable();
  }
  //Obtiene la lista de Tarifas Orden Venta por Cliente para cuando el item != 4 (contra reembolso)
  private listarTarifaOVenta() {
    if (this.formulario.get('pagoEnOrigen').value == true) //si paga el remitente
    {
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('clienteRemitente').value.id).subscribe(
        res => {
          this.resultadosTarifas = res.json();
          if (this.resultadosTarifas.length == 0)
            this.listarTarifasOVentaEmpresa();
        }
      );
    }
    else { //si paga el destinatario
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('clienteDestinatario').value.id).subscribe(
        res => {
          this.resultadosTarifas = res.json();
          if (this.resultadosTarifas.length == 0)
            this.listarTarifasOVentaEmpresa();
        }
      )
    }
  }
  //Obtiene una lista de Conceptos Varios
  public listarConceptos() {
    this.ventaItemConceptoService.listarPorTipoComprobante(1).subscribe(
      res => {
        this.resultadosConceptosVarios = res.json();
      }
    );
  }

  //Obtiene la lista de Tarifas Orden Venta por Empresa cuando en el Cliente no tiene asignada una lista de Orden Venta
  public listarTarifasOVentaEmpresa() {
    this.ordenVentaServicio.listar().subscribe(
      res => {
        this.resultadosTarifas = res.json();
      }
    )
  }
  //Obtiene la Lista de Remitos por el id del tramo seleccionado
  public listarRemitos() {
    this.viajeRemitoServicio.listarRemitos(this.formularioVtaCpteItemFA.get('idTramo').value.id, this.formularioVtaCpteItemFA.get('ventaTipoItem').value.id).subscribe(
      res => {
        this.resultadosRemitos = res.json();
        if (this.resultadosRemitos.length == 0) {
          this.toastr.error("No existen Remitos para el Tramo seleccionado.");
          this.formularioVtaCpteItemFA.get('idTramo').setValue(null);
          this.formularioVtaCpteItemFA.get('numeroViaje').setValue(null);
          setTimeout(function () {
            document.getElementById('idViaje').focus();
          }, 20);
        } else {
          this.formularioVtaCpteItemFA.get('idTramo').setValue(this.resultadosRemitos[0].id);
        }
      },
      err => {
        this.formularioVtaCpteItemFA.get('idTramo').setValue(null);
        this.formularioVtaCpteItemFA.get('numeroViaje').setValue(null);
        setTimeout(function () {
          document.getElementById('idViaje').focus();
        }, 20);
      }
    );
  }

  //Completa el campo "porcentaje" y "Comison" segun la Orden Venta seleccionada en Contra Reembolso
  public cambioOVtaCR() {
    this.formularioCR.get('porcentajeCC').setValue(this.formularioCR.get('ordenVenta').value.comisionCR);
    this.setDecimales(this.formularioCR.get('porcentajeCC'), 2);
    let comision = (this.formularioCR.get('porcentajeCC').value / 100) * this.formularioCR.get('importeContraReembolso').value;
    this.formularioCR.get('pComision').setValue(comision);
    this.setDecimales(this.formularioCR.get('pComision'), 2);
  }
  //Completa el campo "porcentaje" y "Comison" cuando NO se elige una Orden Venta en ContraReembolso
  public calcularComision() {
    this.setDecimales(this.formularioCR.get('porcentajeCC'), 2);
    let comision = (this.formularioCR.get('porcentajeCC').value / 100) * this.formularioCR.get('importeContraReembolso').value;
    this.formularioCR.get('pComision').setValue(comision);
    this.setDecimales(this.formularioCR.get('pComision'), 2);
  }
  //Obtiene el Precio del Flete seleccionado
  public obtenerPrecioFlete() {
    let tipoTarifa = this.formularioVtaCpteItemFA.get('ordenVenta').value.tipoTarifa.id;
    let idOrdenVta = this.formularioVtaCpteItemFA.get('ordenVenta').value.id;
    let respuesta;
    switch (tipoTarifa) {
      case 1:
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioVtaCpteItemFA.get('bultos').value).subscribe(
          res => {
            respuesta = res.json();
            this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
            this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
          }
        );
        break;
      case 2:
        let kgMayor;
        if (this.formularioVtaCpteItemFA.get('kilosEfectivo').value > this.formularioVtaCpteItemFA.get('kilosAforado').value)
          kgMayor = this.formularioVtaCpteItemFA.get('kilosEfectivo').value;
        else
          kgMayor = this.formularioVtaCpteItemFA.get('kilosAforado').value;
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, kgMayor).subscribe(
          res => {
            respuesta = res.json();
            this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
            this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
          }
        );
        break;
      case 3:
        let toneladas;
        if (this.formularioVtaCpteItemFA.get('kilosEfectivo').value > this.formularioVtaCpteItemFA.get('kilosAforado').value)
          toneladas = this.formularioVtaCpteItemFA.get('kilosEfectivo').value;
        else
          toneladas = this.formularioVtaCpteItemFA.get('kilosAforado').value;
        toneladas = toneladas / 1000;
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, toneladas).subscribe(
          res => {
            respuesta = res.json();
            this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
            this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);

          }
        );
        break;
      case 4:
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioVtaCpteItemFA.get('m3').value).subscribe(
          res => {
            respuesta = res.json();
            this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
            this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
          }
        );
        break;
    }
  }



  //Abre un modal ver la nota Impresion Comprobante del cliente que paga
  public abrirObervacion(): void {
    let nota; //guarad la nota de impresion comprobante
    if (this.formulario.get('pagoEnOrigen').value == true) {
      nota = this.formulario.get('clienteRemitente').value.notaImpresionComprobante;
    }
    else {
      nota = this.formulario.get('clienteDestinatario').value.notaImpresionComprobante;
    }
    const dialogRef = this.dialog.open(ObservacionDialogo, {
      width: '1200px',
      data: { nota: nota }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalCarga(): void {
    const dialogRef = this.dialog.open(TotalCargaDialogo, {
      width: '1200px',
      data: { items: this.listaItemAgregados }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalConcepto(): void {
    const dialogRef = this.dialog.open(TotalConceptoDialogo, {
      width: '1200px',
      data: { items: this.listaItemAgregados }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //METODO PRINCIPAL - EMITE LA FACTURA
  public emitirFactura() {
    let afipConcepto = this.listaItemAgregados[0].ventaTipoItem.afipConcepto.id; //guardamos el id de afipConcepto del primer item de la tabla
    this.formulario.get('afipConcepto').setValue({
      id: afipConcepto
    });
    this.formulario.get('importeSaldo').setValue(this.formulario.get('importeTotal').value);
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('esCAEA').setValue(this.appComponent.getEmpresa().feCAEA);
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.formulario.get('ventaComprobanteItemFAs').setValue(this.listaItemAgregados);
    this.formulario.get('ventaComprobanteItemCR').setValue(this.listaCR);
    //A PuntoVenta debo enviarle solo el valor, pero antes utilizo sus otros datos
    this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0].puntoVenta);
    this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        //Mantengo los datos en PuntoVenta
        this.formulario.get('puntoVenta').setValue(this.puntosDeVenta[0]);
        let puntoVentaCeros = this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5);
        this.puntoVenta.setValue(puntoVentaCeros);
        //Limpia todo menos los datos de cabecera
        this.limpiarCuerpoFactura();
        this.abrirDialogoTramo();
        this.toastr.success(respuesta.mensaje);
      },
      err => {
        var respuesta = err.json();
        document.getElementById("idFecha").classList.add('label-error');
        document.getElementById("idFecha").classList.add('is-invalid');
        document.getElementById("idFecha").focus();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Limpia los datos y mantiene los de cabecera
  private limpiarCuerpoFactura() {
    this.listaItemAgregados = [];
    this.listaCR = [];
    this.contador.reset();
    this.formularioCR.reset();
    this.formularioVtaCpteItemFA.reset();
    this.formulario.get('importeNetoGravado').reset();
    this.formulario.get('importeIva').reset();
    this.formulario.get('importeTotal').reset();
    this.formulario.get('cobrador').reset();
    //Cargo los datos de AlicuotasIva
    this.establecerAlicuotaIva();
  }

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
      err => {
        this.toastr.error(err.json().mensaje);
      }
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
  constructor(public dialogRef: MatDialogRef<TotalConceptoDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
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
})
export class ObservacionDialogo {
  //Define la notaImpresionComprobante
  public observacion: string;
  //Define el check
  public check: boolean = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  constructor(public dialogRef: MatDialogRef<ObservacionDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    this.formulario = new FormGroup({});
    this.observacion = this.data.observacion;
  }
  //Controla los checkbox
  public agregarObs($event) {
    if ($event.checked == true) {
      this.check = true;
      document.getElementById('check').className = "checkBoxSelected";
    }
    else {
      this.check = false;
      document.getElementById('check').className = "checkBoxNotSelected";
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'total-carga-dialogo',
  templateUrl: 'total-carga-dialogo.html',
})
export class TotalCargaDialogo {
  //Define el check
  public check: boolean = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  constructor(public dialogRef: MatDialogRef<TotalCargaDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private servicio: ClienteService) { }
  ngOnInit() {
    this.formulario = new FormGroup({});
    this.listaCompleta = this.data.items;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Total Concepto Dialogo
@Component({
  selector: 'total-concepto-dialogo',
  templateUrl: 'total-concepto-dialogo.html',
})
export class TotalConceptoDialogo {
  //Define el check
  public check: boolean = false;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  constructor(public dialogRef: MatDialogRef<TotalConceptoDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    this.formulario = new FormGroup({});
    this.listaCompleta = this.data.items;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
