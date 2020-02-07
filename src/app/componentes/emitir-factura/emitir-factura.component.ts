import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { AppService } from 'src/app/servicios/app.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ViajeTerceroTramoService } from 'src/app/servicios/viaje-tercero-tramo.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { TipoConceptoVentaService } from 'src/app/servicios/tipo-concepto-venta.service';
import { AforoComponent } from '../aforo/aforo.component';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { VentaComprobanteItemFA } from 'src/app/modelos/ventaComprobanteItemFA';
import { FceMiPymesDialogoComponent } from '../fce-mi-pymes-dialogo/fce-mi-pymes-dialogo.component';
import { EmpresaOrdenVentaService } from 'src/app/servicios/empresa-orden-venta.service';
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
import { TipoTarifaService } from 'src/app/servicios/tipo-tarifa.service';
import { ObservacionesDialogo } from '../observaciones-dialogo/observaciones-dialogo.component';

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
  //Define el id del tipoComprobante
  public idTipoCpte: number = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la tabla de ventas comprobantes items FA 
  public formularioVtaCpteItemFA: FormGroup;
  //Define los formularios para mostrar los datos del cliente remitente y destinatario
  public formularioRemitente: FormGroup;
  public formularioDestinatario: FormGroup;
  //Define la lista de Tipos de Comprobante
  public tiposComprobante = [];
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];
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
  public btnFCE: boolean = true;
  //Define el boton 'G.S' para habilitarlo o no
  public btnGS: boolean = null;
  //Define el boton 'Agregar Otro Remito' para habilitarlo o no
  // public btnRemito: boolean = null;
  /*
  ************** REVISAR ITEMFACTURA - TAL VEZ NO SEA UN FORMCONTROL ***************
  */
  //Define el combo de items a facturar como un formControl
  public itemFactura: FormControl = new FormControl();
  //Define un item, lo guarda para volver atras en caso de que se arrepienta de cambiar de item
  public itemReserva: FormControl = new FormControl();
  //Define a Orden de Venta como un formControl
  public ordenVenta: FormControl = new FormControl();
  //Define a Tarifa Orden de Venta como un formControl
  public tarifaOrdenVenta: FormControl = new FormControl();
  //Define el campo puntoVenta (el de solo lectura) como un formControl
  public puntoVenta: FormControl = new FormControl();
  //Define los datos de configuracion para el modal de listar Remitos
  public configuracionModalRemitos: FormControl;
  //Define la lista de Ordenes de Venta
  public ordenesVenta: Array<any> = [];
  //Define la lista de Tarifas de Orden Vta.
  public tiposTarifa: Array<any> = [];
  //Define la lista de alicuotas iva CR
  public resultadosAlicuotasIvaCR = [];
  //Define el campo viajeRemito (el de solo lectura) como un formControl
  public viajeRemito: FormControl = new FormControl();
  //Define si los campos son de solo lectura
  public soloLectura: boolean = true;
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  //Define el contador para la lista de items agregados
  public contador: FormControl = new FormControl();
  //Define la lista completa de registros - tabla de items agregados
  public listaCompletaItems = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnasItems: string[] = ['NUMERO_VIAJE', 'NUMERO_REMITO', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO', 'FLETE', 'SUBTOTAL', 'ALIC_IVA',
    'SUBTOTAL_IVA', 'QUITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(
    // public dialogRef: MatDialogRef<ClienteEventualComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService,
    private ventaComprobanteService: VentaComprobanteService, private tipoTarifaService: TipoTarifaService,
    public clienteService: ClienteService, private toastr: ToastrService,
    private ventaComprobante: VentaComprobante, private appService: AppService,
    private empresaOrdenVtaService: EmpresaOrdenVentaService,
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService,
    private ventaCpteItemFA: VentaComprobanteItemFA, private ventaConfigService: VentaConfigService,
    private afipComprobanteService: AfipComprobanteService,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private afipCaeService: AfipCaeService,
    private monedaService: MonedaService, private monedaCotizacionService: MonedaCotizacionService,
    private loaderService: LoaderService) {
    // this.dialogRef.disableClose = true;
  }
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
    })
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getUsuario().sucursal.id);
    //Reestablece el formulario ('true' para limpiar todo, 'false' para mantener campos generales)
    this.reestablecerFormulario(true);
    //Completa los datos de ventaComprobante enviados desde el componente consultarFacturas
    //Autcompletado - Buscar por Remitente
    this.formulario.get('clienteRemitente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteService.listarActivosPorAlias(data).subscribe(res => {
            this.remitentes = res.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    });
    //Autcompletado - Buscar por Destinatario
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteService.listarActivosPorAlias(data).subscribe(res => {
            this.destinatarios = res.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    });
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.ventaComprobanteService.inicializarFactura(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece demas datos necesarios
        this.tiposComprobante = respuesta.tipoComprobantes;
        this.itemsAFacturar = respuesta.ventaTipoItems;
        this.afipAlicuotasIva = respuesta.afipAlicuotaIvas;
        this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
        this.cambioTipoComprobante(true);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Controla el cambio en Tipo de cpte / recibe como parametro una bandera que le indica
  //si debe listar los puntos de venta 
  public cambioTipoComprobante(bandera) {
    this.idTipoCpte = this.formulario.value.tipoComprobante.id;
    bandera ? this.listarPuntosVenta() : '';
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntosVenta() {
    if (this.resultadosPuntoVenta.length == 0) {
      this.puntoVentaService.listarPorEmpresaYSucursalYTipoComprobante(
        this.appComponent.getEmpresa().id, this.appComponent.getUsuario().sucursal.id, this.idTipoCpte).subscribe(
          res => {
            this.resultadosPuntoVenta = res.json();
            if (this.resultadosPuntoVenta.length > 0) {
              this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0]);
              this.cambioPuntoVenta();
            } else {
              this.toastr.error("Punto de venta inexistente para el Tipo de comprobante.");
            }
          }
        )
    }
  }
  //Obtiene la lista de Ordenes de Venta de empresaOrdenVentaService
  private listarOrdenVentaEmpresa() {
    this.empresaOrdenVtaService.listar().subscribe(
      res => {
        if (res.json().length == 0) {
          this.obtenerImpCpteGral();
        } else {
          this.ordenesVenta = res.json();
          this.ordenVenta.setValue(this.ordenesVenta[0]);
          this.cambioOrdenVta();
        }
      }, err => { this.toastr.error(err.json().message); }
    )
  }
  //Establece alicuota iva por defecto
  private establecerAlicuotaIva() {
    this.afipAlicuotasIva.forEach(elemento => {
      if (elemento.porDefecto) {
        this.formularioVtaCpteItemFA.get('afipAlicuotaIva').setValue(elemento);
      }
    })
  }
  //Limpia las listas
  private vaciarListas() {
    this.remitentes = [];
    this.destinatarios = [];
    this.sucursalesRemitente = [];
    this.sucursalesDestinatario = [];
    this.listaCompletaItems = new MatTableDataSource([]);
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
    this.formulario.get('fechaVtoPago').setValue(this.formulario.value.fechaEmision);
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
    let fechaMenos15dias = new Date(this.generarFecha(-15));
    let fechaMas1dia = new Date(this.generarFecha(+1));
    let fechaEmision = new Date(this.formulario.value.fechaEmision);
    if (fechaEmision.getTime() >= fechaMenos15dias.getTime()) {
      if (fechaEmision.getTime() <= fechaMas1dia.getTime())
        document.getElementById('idItem').focus();
      else {
        this.toastr.error("Fecha Emisión debe ser menor/igual a: " + this.generarFecha(+1) + ".Se establece fecha actual.");
        this.formulario.get('fechaEmision').setValue(this.fechaActual);
        document.getElementById('idFechaEmision').focus();
      }
    } else {
      this.toastr.error("Fecha Emisión debe ser mayor a: " + this.generarFecha(-15) + ".Se establece fecha actual.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }
  //Controla el rango valido para la fecha de emision cuando el punto de venta no es feCAEA
  private verificarFechaNoFeCAEA() {
    let fechaMenos5dias = new Date(this.generarFecha(-5));
    let fechaMas1dia = new Date(this.generarFecha(+1));
    let fechaEmision = new Date(this.formulario.value.fechaEmision);
    if (fechaEmision.getTime() >= fechaMenos5dias.getTime()) {
      if (fechaEmision.getTime() <= fechaMas1dia.getTime())
        document.getElementById('idItem').focus();
      else {
        this.toastr.error("Fecha Emisión debe ser menor/igual a: " + this.generarFecha(+1) + ".Se establece fecha actual.");
        this.formulario.get('fechaEmision').setValue(this.fechaActual);
        document.getElementById('idFechaEmision').focus();
      }
    } else {
      this.toastr.error("Fecha Emisión debe ser mayor a: " + this.generarFecha(-5) + ".Se establece fecha actual.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }
  //Genera y retorna una fecha segun los parametros que recibe (dias - puede ser + ó -)
  private generarFecha(dias) {
    let fechaActual = new Date(this.fechaActual);
    fechaActual.setDate(fechaActual.getDate() + dias);
    let date = fechaActual.getDate() + dias;
    //Le cambio el simbolo '-' (negativo) para formatear bien la fecha
    date < 0 ? date = -(date) : '';
    let fechaGenerada = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + date; //Al mes se le debe sumar 1
    return fechaGenerada;
  }

  //Setea el codigo de Afip por el tipo de comprobante y la letra
  public cargarCodigoAfip(letra) {
    this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('tipoComprobante').value.id, letra).subscribe(
      res => {
        this.formulario.get('codigoAfip').setValue(res.text());
        this.cargarNumero(res.text());
      },
      err => {
        this.formulario.get('codigoAfip').reset();
        this.toastr.error("Error al obtener el código de afip.");
      }
    );
  }
  //Setea el numero por el punto de venta y el codigo de Afip
  public cargarNumero(codigoAfip) {
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip,
      this.formulario.value.sucursal.id, this.formulario.value.empresa.id).subscribe(
        res => {
          let numero = res.text();
          this.formulario.get('numero').setValue(this.establecerCerosIzq(Number(numero), "0000000", -8));

          //se bloquean los campos de seleccion para tipo cpte, p. venta, item a factuar
          this.formulario.get('tipoComprobante').disable();
          this.formulario.get('puntoVenta').disable();
          this.itemFactura.disable();
        },
        err => {
          this.formulario.get('numero').reset();
          this.toastr.error("Error al obtener el número.");
        }
      );
  }
  //Maneja el cambio en el combo Items
  public cambioItem() {
    //Controlo si ya habia un item seleccionado y abro el modal de ser así
    this.formulario.value.afipConceptoVenta ? this.abrirConfirmarDialogo("¿Está seguro de cambiar el Item?") : this.manejoCambioItem();
  }
  //Operaciones a aplicar con el cambio de item a facturar
  private manejoCambioItem() {
    this.itemFactura.enable();
    this.reestablecerFormulario(false); //Reuso el reestablecerFormulario
    this.itemReserva.setValue(this.itemFactura.value); //Guardo el item a facturar seleccionado
    this.itemFactura.setValue(this.itemReserva.value);//Si el item a facturar es un Remito (general/dador de carga) se establecen campos a solo lectura
    this.formulario.get('afipConceptoVenta').setValue(this.itemFactura.value.afipConceptoVenta);
    this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(this.itemFactura.value);
    if (this.itemFactura.value.id == 1 || this.itemFactura.value.id == 2) {
      this.soloLectura = true;
      if (this.itemFactura.value.id == 1) {
        this.btnGS = false;
        this.abrirListaRemitoDialogo(); //Abre dialogo G.S 
      } else {
        this.btnGS = true;
      }
    } else {
      this.soloLectura = false;
    }
    document.getElementById('idRemitente').focus();
  }
  //Operaciones que aplica al arrepentirse de cambiar el item
  private manejoNoCambioItem() {
    this.itemFactura.enable();
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
  /*Abre modal para confirmar cambios */
  public abrirAgregarOtroItemDialogo() {
    const dialogRef = this.dialog.open(OtroItemDialogo, {
      width: '50%',
      maxWidth: '50%',
      data: {
        mensaje: '¿Qué ítem desea agregar?',
        labelBtn: this.itemFactura.value.nombre
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        switch (resultado) {
          case 'libre':
            this.formularioVtaCpteItemFA.enable();
            this.reestablecerformularioVtaCpteItemFA();
            this.ordenVenta.enable();
            this.tarifaOrdenVenta.enable();
            this.soloLectura = false;
            break;

          case 'remito':
            this.abrirListaRemitoDialogo()
            break;

          case 'cancelar':
            this.manejoNoCambioItem();
            break;
        }
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
      this.formulario.get('clienteRemitente').value && this.formulario.get('clienteDestinatario').value ?
        this.cambioPagoEnOrigen() : '';
    }
  }
  /*Valida que el Destinatario no sea el mismo que el Remitente, luego valida el tipo y numero documento, 
  luego setea datos para mostrar y obtiene el listado de sucursales por Destinatario */
  public cambioDestinatario() {
    let clienteDestinatario = this.formulario.value.clienteDestinatario;
    let clienteRemitente = this.formulario.value.clienteRemitente;
    if (clienteRemitente) {
      let res = this.validarDocumento(clienteDestinatario.tipoDocumento, clienteDestinatario.numeroDocumento, 'Destinatario');
      if (res) {
        this.formularioDestinatario.get('domicilio').setValue(clienteDestinatario.domicilio);
        this.formularioDestinatario.get('localidad').setValue(clienteDestinatario.localidad.nombre);
        this.formularioDestinatario.get('condicionVenta').setValue(clienteDestinatario.condicionVenta.nombre);
        this.formularioDestinatario.get('afipCondicionIva').setValue(clienteDestinatario.afipCondicionIva.nombre);
        this.formularioDestinatario.get('tipoYNumeroDocumento').setValue(
          clienteDestinatario.tipoDocumento.nombre + ' - ' + clienteDestinatario.numeroDocumento);
        this.listarSucursales('destinatario', clienteDestinatario.id);
        this.formulario.get('clienteRemitente').value && this.formulario.get('clienteDestinatario').value ?
          this.cambioPagoEnOrigen() : '';
      }
    } else {
      this.toastr.warning("Seleccione un Remitente.");
      this.formulario.get('clienteDestinatario').reset();
      this.formularioDestinatario.reset();
      document.getElementById('idRemitente').focus();
    }
  }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada 
  public cambioOrdenVta() {
    this.formularioVtaCpteItemFA.get('flete').reset();
    //Con cada cambio limpia los campos 'Tarifa' - 'pSeguro'
    // this.formularioVtaCpteItemFA.get('pSeguro').reset();
    this.tarifaOrdenVenta.reset();

    /*La prioridad es si el cliente tiene seguro propio.
    * si tiene, pSeguro se bloquea pero ordenVta y Tarifa quedan disponibles para
    * calcular el flete. */
    if (this.formulario.value.cliente.esSeguroPropio && !this.ordenVenta.value) {
      if (this.formulario.value.cliente.vencimientoPolizaSeguro < this.formulario.value.fechaEmision) {
        this.formularioVtaCpteItemFA.get('pSeguro').enable();
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
      }
      else {
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.formularioVtaCpteItemFA.get('pSeguro').disable();
      }
    }
    /* Si tiene seguro propio y además selecciona una orden de venta */
    else if (this.formulario.value.cliente.esSeguroPropio && this.ordenVenta.value) {
      //Controla el campo 'Seguro'. El ordenVenta == false corresponde a 'Libre'
      if (this.ordenVenta.value == 'false') {
        this.tarifaOrdenVenta.reset();
        this.tarifaOrdenVenta.disable();
        this.formularioVtaCpteItemFA.get('flete').reset();
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.formularioVtaCpteItemFA.get('descuentoFlete').reset();
        this.calcularSubtotal();
      } else {
        //Controla si la orden de venta seleccionada estaActiva
        this.verificarOrdenVtaActiva();
      }
    }
    else {
      //Controla el campo 'Seguro'. El ordenVenta == false corresponde a 'Libre'
      if (this.ordenVenta.value == 'false') {
        this.obtenerImpCpteGral();
      } else {
        //Controla si la orden de venta seleccionada estaActiva
        this.verificarOrdenVtaActiva();
      }
    }
  }
  //Verifica si la orden de venta seleccionada estaActiva para listar las tarifas
  private verificarOrdenVtaActiva() {
    //Controla si la orden de venta seleccionada estaActiva
    if (this.ordenVenta.value.ordenVenta.estaActiva) {
      this.tarifaOrdenVenta.enable();
      this.listarTarifasPorOrdenVenta(this.ordenVenta.value.ordenVenta.id);
      let pSeguro = this.ordenVenta.value.ordenVenta.seguro;
      if (this.formulario.value.cliente.esSeguroPropio) {
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.formularioVtaCpteItemFA.get('pSeguro').disable();
      } else {
        this.formularioVtaCpteItemFA.get('pSeguro').enable();
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.formularioVtaCpteItemFA.get('pSeguro').setValue(this.appService.establecerDecimales(pSeguro, 2));
      }
      this.calcularSubtotal();
    } else {
      this.toastr.error("Orden de venta inactiva - verifique.");
      this.ordenVenta.reset();
      document.getElementById('idOrdenVta').focus();
    }
  }
  //Obtiene el listado de tarifas para una orden de venta
  private listarTarifasPorOrdenVenta(idOrdenVenta) {
    this.tipoTarifaService.listarPorOrdenVenta(idOrdenVenta).subscribe(
      res => {
        this.tiposTarifa = res.json();
        this.tarifaOrdenVenta.setValue(this.tiposTarifa[0]);
        this.cambioTipoTarifa();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Maneja el cambio en el campo 'Tarifa de Orden Vta.' y obtiene el precio del Flete
  public cambioTipoTarifa() {
    this.formularioVtaCpteItemFA.get('flete').reset();
    /* habilita el formulario para poder obtener bultos, kg, m3 */
    this.formularioVtaCpteItemFA.enable();
    let kgMayor;
    let tipoTarifa = this.tarifaOrdenVenta.value.id;

    /* controla Orden Venta */
    // !this.ordenVenta.value? this.ordenVenta.setValue(this.ordenesVenta[0]) : '';

    //let idOrdenVta = this.ordenVenta.value.ordenVenta.id;
    this.ordenVenta.setValue(this.ordenesVenta[0]);
    let idOrdenVta = this.ordenesVenta[0].ordenVenta.id;

    let idTipoTarifa = this.tarifaOrdenVenta.value.id;
    this.formularioVtaCpteItemFA.get('kilosEfectivo').value > this.formularioVtaCpteItemFA.get('kilosAforado').value ?
      kgMayor = this.formularioVtaCpteItemFA.get('kilosEfectivo').value : kgMayor = this.formularioVtaCpteItemFA.get('kilosAforado').value;
    switch (tipoTarifa) {
      case 1:
        this.obtenerPrecioFlete(idOrdenVta, idTipoTarifa, this.formularioVtaCpteItemFA.get('bultos').value);
        break;
      case 2:
        this.obtenerPrecioFlete(idOrdenVta, idTipoTarifa, kgMayor);
        break;
      case 3:
        kgMayor = kgMayor / 1000;
        this.obtenerPrecioFlete(idOrdenVta, idTipoTarifa, kgMayor);
        break;
      case 4:
        this.obtenerPrecioFlete(idOrdenVta, idTipoTarifa, this.formularioVtaCpteItemFA.get('m3').value);
        break;
    }
  }
  //Obtiene el precio del campo 'Flete'
  private obtenerPrecioFlete(idOrdenVenta, idTipoTarifa, valor) {
    this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVenta, idTipoTarifa, valor).subscribe(
      res => {
        let respuesta = res.json();
        this.formularioVtaCpteItemFA.get('flete').setValue(respuesta);
        this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
        this.calcularSubtotal();
      }, err => { this.toastr.warning("No existe escala tarifa para obtener el precio flete."); }
    );
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
      }, err => { this.toastr.error(err.json().mensaje); }
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
      document.getElementById('idRemitente').className = "form-control form-control-sm input-pagaSeleccionado";
      document.getElementById('idDestinatario').className = "form-control form-control-sm";
      this.formulario.get('cliente').setValue(this.formulario.get('clienteRemitente').value);
      this.formulario.get('condicionVenta').setValue({ id: this.formulario.get('clienteRemitente').value.condicionVenta.id });
      this.formulario.get('tipoDocumento').setValue(this.formulario.get('clienteRemitente').value.tipoDocumento);
      this.formulario.get('numeroDocumento').setValue(this.formulario.get('clienteRemitente').value.numeroDocumento);
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteRemitente').value.afipCondicionIva);
      this.formulario.get('cobrador').setValue(this.formulario.get('clienteRemitente').value.cobrador);
    }
    else {
      document.getElementById('idRemitente').className = "form-control form-control-sm";
      document.getElementById('idDestinatario').className = "form-control form-control-sm input-pagaSeleccionado";
      this.formulario.get('cliente').setValue(this.formulario.get('clienteDestinatario').value);
      this.formulario.get('condicionVenta').setValue({ id: this.formulario.get('clienteDestinatario').value.condicionVenta.id });
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteDestinatario').value.afipCondicionIva);
      this.formulario.get('tipoDocumento').setValue(this.formulario.get('clienteDestinatario').value.tipoDocumento);
      this.formulario.get('numeroDocumento').setValue(this.formulario.get('clienteDestinatario').value.numeroDocumento);
      this.formulario.get('cobrador').setValue(this.formulario.get('clienteDestinatario').value.cobrador);
    }
    this.controlCamposPorCliente();
    this.itemFactura.value.id != 1 ?
      [this.formularioVtaCpteItemFA.enable(), this.ordenVenta.enable(),
      this.reestablecerformularioVtaCpteItemFA(), document.getElementById('idViaje').focus()] :
      document.getElementById('idDescripcionCarga').focus();
  }
  //Controla campos segun datos del Cliente que paga - Sale del metodo 'cambioPagoEnOrigen'
  private controlCamposPorCliente() {
    let cliente= this.formulario.value.cliente;
    // Controla el campo 'Letra' - Es A cuando el cliente es responsable inscripto (afipCondicionIva == 1) sino es B consumidor final
    cliente.afipCondicionIva.id == 1 ?
      this.formulario.get('letra').setValue('A') : this.formulario.get('letra').setValue('B');
    // Obtiene el codigo afip y el número
    this.cargarCodigoAfip(this.formulario.value.letra);
    /* establece valores a formularioVtaCpteItemFA obtenidos del cliente */
    this.formularioVtaCpteItemFA.get('descuentoFlete').setValue(this.appService.establecerDecimales(
      cliente.descuentoFlete ? cliente.descuentoFlete.toString() : '0.00', 2));

    //Controla la lista para el campo 'Orden Venta', 'pSeguro'
    if (cliente.esSeguroPropio) {
      if (cliente.vencimientoPolizaSeguro < this.formulario.value.fechaEmision) {
        this.formularioVtaCpteItemFA.get('pSeguro').enable();
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.toastr.warning("Póliza de seguro vencida.");
      } else {
        //abre modal con datos de la poliza de seguro
        this.formularioVtaCpteItemFA.get('pSeguro').reset();
        this.formularioVtaCpteItemFA.get('pSeguro').disable();
        let observacion = 'Cliente con seguro propio. Vencimiento: ' +
          cliente.vencimientoPolizaSeguro;
        this.obervacionDialogo(observacion);
      }
      this.listarOrdenVentaCliente();
    } else {
      this.formularioVtaCpteItemFA.get('pSeguro').enable();
      this.formularioVtaCpteItemFA.get('pSeguro').reset();
      this.listarOrdenVentaCliente();
    }

    //Controla si habilita el boton FCE MiPyMEs para abrir modal
    this.idTipoCpte == 26 && cliente.esReceptorFCE ? this.btnFCE = false : this.btnFCE = true;
    /* abre dialogo observaciones */
    cliente.notaEmisionComprobante ?
      this.obervacionDialogo(cliente.notaEmisionComprobante) : '';
  }
  //Carga las ordenes de venta del Cliente
  private listarOrdenVentaCliente() {
    if (this.formulario.value.cliente.clienteOrdenesVentas.length > 0) {
      this.ordenesVenta = this.formulario.value.cliente.clienteOrdenesVentas;
      this.ordenVenta.setValue(this.ordenesVenta[0]);
      this.cambioOrdenVta();
    } else {
      this.toastr.warning("Cliente sin orden de venta.");
      this.listarOrdenVentaEmpresa();
    }
  }
  //Obtiene el importe de seguro general
  private obtenerImpCpteGral() {
    this.ventaConfigService.obtenerPorId(1).subscribe(
      res => {
        this.ordenVenta.setValue(false);
        this.tarifaOrdenVenta.reset();
        this.tarifaOrdenVenta.disable();
        this.formularioVtaCpteItemFA.get('pSeguro').setValue(res.json().seguro);
        this.calcularSubtotal();
      }, err => { this.toastr.error(err.json().message); }
    )
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
        tipoCliente == 'Remitente' ?
          [this.formulario.get('clienteRemitente').setValue(resultado), this.cambioRemitente()] :
          [this.formulario.get('clienteDestinatario').setValue(resultado), this.cambioDestinatario()];
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
      resultado ? this.formulario.get('fechaVtoPago').setValue(resultado) : '';
    });
  }
  //Abre un modal para listar Remitos
  public abrirListaRemitoDialogo(): void {
    let esRemitoGeneral;
    /* itemFactura.value.id == 1 es Remito Gral. GS */
    this.itemFactura.value.id == 1 ? esRemitoGeneral = true : esRemitoGeneral = false;
    const dialogRef = this.dialog.open(ListaRemitoDialogoComponent, {
      width: '1280px',
      height: '450px',
      data: {
        esRemitoGeneral: esRemitoGeneral,
        listaItemsAsignados: this.listaCompletaItems.data,
        configuracionModalRemitos: this.configuracionModalRemitos.value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      resultado ? this.controlarRemitoSeleccionado(resultado) : '';
    });
  }
  //Controla los campos cuando se selecciona un Remito del modal abrirListaRemitoDialogo
  private controlarRemitoSeleccionado(resultado) {
    if (resultado.configuracionModalRemitos.formularioFiltro) {
      //Establece el idViaje dependiendo si esRemitoGeneral 
      let idViaje = resultado.esRemitoGeneral ?
        resultado.remitoSeleccionado.viajeTramo.viaje.id :
        resultado.remitoSeleccionado.viajeRemito.viajeTramoCliente.id;
      let idRemito = resultado.remitoSeleccionado.viajeRemito.numero;
      this.establecerValoresRemitoSeleccionado(resultado.remitoSeleccionado, idViaje, idRemito);
      this.configuracionModalRemitos.setValue(resultado.configuracionModalRemitos);
    }
  }
  /* Establece los valores del remito seleccionado en modal
   a los campos correspondientes del formulario vta cpte item FA */
  private establecerValoresRemitoSeleccionado(remitoSeleccionado, idViaje, idRemito) {

    this.ordenVenta.enable();
    this.formularioVtaCpteItemFA.enable();
    this.viajeRemito.setValue(idViaje);
    this.formularioVtaCpteItemFA.get('id').setValue(remitoSeleccionado.id); //con ello controlo los remitos asignados
    this.formularioVtaCpteItemFA.get('viajeRemito').setValue(remitoSeleccionado);
    this.formularioVtaCpteItemFA.get('numeroRemito').setValue(idRemito);
    this.formularioVtaCpteItemFA.get('bultos').setValue(remitoSeleccionado.viajeRemito.bultos);

    /* como los valores pueden ser null, pregunto antes de establecer los decimales */
    this.formularioVtaCpteItemFA.get('kilosEfectivo').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.kilosEfectivo ? remitoSeleccionado.viajeRemito.kilosEfectivo.toString() : '0.00', 2));
    this.formularioVtaCpteItemFA.get('kilosAforado').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.kilosAforado ? remitoSeleccionado.viajeRemito.kilosAforado.toString() : '0.00', 2));
    this.formularioVtaCpteItemFA.get('m3').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.m3 ? remitoSeleccionado.viajeRemito.m3.toString() : '0.00', 2));
    this.formularioVtaCpteItemFA.get('valorDeclarado').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.valorDeclarado ? remitoSeleccionado.viajeRemito.valorDeclarado.toString() : '0.00', 2));
    this.formularioVtaCpteItemFA.get('importeRetiro').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.importeRetiro ? remitoSeleccionado.viajeRemito.importeRetiro.toString() : '0.00', 2));
    this.formularioVtaCpteItemFA.get('importeEntrega').setValue(this.appService.establecerDecimales(
      remitoSeleccionado.viajeRemito.importeEntrega ? remitoSeleccionado.viajeRemito.importeEntrega.toString() : '0.00', 2));
    
    /* calcula el subtotal*/
    this.calcularSubtotal();

    /* Pregunta si el item es Remito Carga Gral. y si no hay items cargados en la lista de items */
    if (this.itemFactura.value.id == 1 && this.listaCompletaItems.data.length == 0) {
      this.formulario.get('clienteRemitente').setValue(remitoSeleccionado.viajeRemito.clienteRemitente);
      this.cambioRemitente();
      this.formulario.get('clienteDestinatario').setValue(remitoSeleccionado.viajeRemito.clienteDestinatario);
      this.cambioDestinatario();
    } else {
      /* controla el cambio en la orden de venta */
      this.cambioOrdenVta();
    }
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
    let tipoConceptoVenta = this.formularioVtaCpteItemFA.value.tipoConceptoVenta ?
      this.formularioVtaCpteItemFA.value.tipoConceptoVenta : null;
    let importeTipoConceptoVenta = this.formularioVtaCpteItemFA.value.importeTipoConceptoVenta ?
      this.formularioVtaCpteItemFA.value.importeTipoConceptoVenta : null;
    const dialogRef = this.dialog.open(ConceptosVariosDialogo, {
      width: '1200px',
      data: {
        tipoConceptoVenta: tipoConceptoVenta,
        importeTipoConceptoVenta: importeTipoConceptoVenta,
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.formularioVtaCpteItemFA.get('tipoConceptoVenta').setValue(resultado.concepto);
        this.formularioVtaCpteItemFA.get('importeTipoConceptoVenta').setValue(this.appService.establecerDecimales(resultado.importe, 2));
        this.calcularSubtotal();
      } else {
        this.formularioVtaCpteItemFA.get('importeTipoConceptoVenta').setValue(this.appService.establecerDecimales('0.00', 2));
      }
    })
  }
  //Abre dialogo de Contrareembolso
  public abrirCRDialogo() {
    if(this.formulario.get('clienteRemitente').value){
      const dialogRef = this.dialog.open(ContrareembolsoDialogoComponent, {
        width: '1200px',
        data: { 
          ventaComprobanteItemCR: this.formulario.value.ventaComprobanteItemCR,
          idProvincia: this.formulario.get('clienteRemitente').value.localidad.provincia.id,
         }
      });
      dialogRef.afterClosed().subscribe(resultado => {
        if(resultado == null){
          this.formulario.get('ventaComprobanteItemCR').setValue([]);
        }else{
          this.formulario.get('ventaComprobanteItemCR').setValue([resultado]);
        }
      })
    }else{
      this.toastr.error("Debe seleccionar un cliente remitente.");
    }
    
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
  // public abrirObervacionDialogo(): void {
  //   let notaImpCpteCliente = this.formulario.value.cliente.notaImpresionComprobante;
  //   const dialogRef = this.dialog.open(ObservacionDialogo, {
  //     width: '70%',
  //     maxWidth: '70%',
  //     data: { notaImpCpteCliente: notaImpCpteCliente }
  //   });
  //   dialogRef.afterClosed().subscribe(resultado => {
  //     // resultado ? this.formulario.value.cliente.notaImpresionComprobante = resultado : ''; ?? CONSULTAR DONDE SE GUARDA
  //   });
  // }
  //Abre un modal - Observaciones del cliente que paga
  public obervacionDialogo(observacion): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '70%',
      maxWidth: '70%',
      data: { elemento: observacion, soloLectura: true }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //Calcular el Subtotal del item agregado
  public calcularSubtotal() {
    /* establece el campo 'valorDeclarado' en decimales */
    this.setDecimales(this.formularioVtaCpteItemFA.get('valorDeclarado'), 2);
    this.setDecimales(this.formularioVtaCpteItemFA.get('pSeguro'), 2);
    this.setDecimales(this.formularioVtaCpteItemFA.get('flete'), 2);
    this.setDecimales(this.formularioVtaCpteItemFA.get('descuentoFlete'), 2);
    this.setDecimales(this.formularioVtaCpteItemFA.get('importeRetiro'), 2);
    this.setDecimales(this.formularioVtaCpteItemFA.get('importeEntrega'), 2);

    /* convierte a number los campos ya que estan en string. Para las operaciones. */
    let valorDeclarado = this.formularioVtaCpteItemFA.value.valorDeclarado ?
      Number(this.formularioVtaCpteItemFA.get('valorDeclarado').value) : 0;
    let pSeguro = Number(this.formularioVtaCpteItemFA.get('pSeguro').value);

    let flete = this.formularioVtaCpteItemFA.value.flete ?
      Number(this.formularioVtaCpteItemFA.value.flete) : 0;
    let descuento = Number(this.formularioVtaCpteItemFA.get('descuentoFlete').value);

    let retiro = Number(this.formularioVtaCpteItemFA.get('importeRetiro').value);
    let entrega = Number(this.formularioVtaCpteItemFA.get('importeEntrega').value);


    /* valor del importeSeguro */
    let importeSeguro = this.formularioVtaCpteItemFA.value.pSeguro ?
      (valorDeclarado * (pSeguro / 1000)) : 0;
    this.formularioVtaCpteItemFA.get('importeSeguro').setValue(this.appService.establecerDecimales(importeSeguro.toString(), 2));

    /* valor neto del flete (con/sin descuento) */
    let fleteNeto;
    if (descuento && descuento > 0) {
      fleteNeto = flete - flete * (descuento / 100);
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(this.appService.establecerDecimales(fleteNeto.toString(), 2));
    } else {
      fleteNeto = flete;
      this.formularioVtaCpteItemFA.get('importeFlete').setValue(this.appService.establecerDecimales(fleteNeto.toString(), 2));
    }

    /* valor del item concepto */
    if (!this.formularioVtaCpteItemFA.value.importeTipoConceptoVenta) {
      this.formularioVtaCpteItemFA.get('importeTipoConceptoVenta').setValue(this.appService.establecerDecimales('0.00', 2));
    }
    let concepto = Number(this.formularioVtaCpteItemFA.value.importeTipoConceptoVenta);

    /* calcula el subtotal del item */
    this.calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega, concepto);
  }
  //Calcula el 'Subtotal' de cada item 
  private calcularSubtotalItem(importeSeguro, fleteNeto, retiro, entrega, concepto) {
    let subtotal = importeSeguro + fleteNeto + retiro + entrega + concepto;
    this.formularioVtaCpteItemFA.get('importeNetoGravado').setValue(this.appService.establecerDecimales(subtotal.toString(), 2));
    this.calcularImporteIva();
  }
  //Calcula el 'Importe Iva' de cada item
  public calcularImporteIva() {
    let subtotal = this.formularioVtaCpteItemFA.get('importeNetoGravado').value;
    let alicuotaIva = this.formularioVtaCpteItemFA.value.afipAlicuotaIva.alicuota
    let importeIva = subtotal * (alicuotaIva / 100);
    this.formularioVtaCpteItemFA.get('importeIva').setValue(this.appService.establecerDecimales(importeIva, 2));
  }
  //Agrega a un Array el item e impacta en la tabla
  public agregarItem() {
    this.formularioVtaCpteItemFA.enable();
    /* Guarda el idProvincia del Remitente */
    this.formularioVtaCpteItemFA.get('provincia').setValue(this.formulario.get('clienteRemitente').value.localidad.provincia);

    /* Establece la orden de vta. tarifa*/
    this.ordenVenta.value ? [this.formularioVtaCpteItemFA.value.ordenVentaTarifa = null, this.actualizarTabla()] :
      [this.formularioVtaCpteItemFA.value.ordenVentaTarifa = null, this.actualizarTabla()];
  }
  /* Controla el cambio en la tabla */
  private actualizarTabla() {
    this.listaCompletaItems.data.push(this.formularioVtaCpteItemFA.value);
    this.listaCompletaItems.sort = this.sort;
    this.calcularImportesTotales();
    this.reestablecerformularioVtaCpteItemFA();
    this.contador.setValue(this.contador.value + 1);
    //Controla por item a facturar
    // this.itemFactura.value.id == 2 ? (this.listaCompletaItems.data.length > 0 ? this.btnGS = false : this.btnGS = true) : this.btnGS = false;
    this.itemReserva.value.id == 2 ? (this.listaCompletaItems.data.length > 0 ? this.btnGS = false : this.btnGS = true) : this.btnGS = false;

    //establece a solo lectura los campos de seleccion: pago en origen, formulario Remitente y formulario Destinatario
    if (this.listaCompletaItems.data.length > 0) {
      this.formularioRemitente.disable();
      this.formularioDestinatario.disable();
      this.formulario.get('pagoEnOrigen').disable();
      this.formulario.get('clienteRemitente').disable();
      this.formulario.get('clienteDestinatario').disable();
    } else {
      this.formularioRemitente.enable();
      this.formularioDestinatario.enable();
      this.formulario.get('pagoEnOrigen').enable();
      this.formulario.get('clienteRemitente').enable();
      this.formulario.get('clienteDestinatario').enable();
    }
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
    } else if (this.listaCompletaItems.data.length > 0) {
      this.itemFactura.disable();
      this.calcularImportesTotales();
      document.getElementById('idViaje').focus();
    }
    this.itemFactura.value.id == 2 ?
      (this.listaCompletaItems.data.length > 0 ? this.btnGS = false : this.btnGS = true) : this.btnGS = false;
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
  private reestablecerFormulario(limpiarTodo) {
    let puntoVenta;
    let fechaEmision;
    let tipoComprobante;

    //Guardo por si existen datos ya cargados
    if (!limpiarTodo) {
      puntoVenta = this.formulario.value.puntoVenta;
      fechaEmision = this.formulario.value.fechaEmision;
      tipoComprobante = this.formulario.value.tipoComprobante;
      //Limpia listaCompletaRemitos para actualizar la lista 
      this.configuracionModalRemitos.value.listaCompletaRemitos = null;
    } else {
      this.itemFactura.enable();
      this.itemFactura.reset();
      //Reestablezco valores y controlo campos precargados
      this.configuracionModalRemitos = new FormControl({
        formularioFiltro: null,
        listaCompletaRemitos: null
      })
    }
    //Habilita el formulario
    this.formulario.enable();
    //Vacio formularios y listas
    this.vaciarListas();
    this.contador.reset();
    this.formulario.reset();
    this.puntoVenta.reset();
    this.ordenVenta.reset();
    this.formularioRemitente.reset();
    this.formularioDestinatario.reset();
    this.formularioVtaCpteItemFA.reset();

    //Reestablece las clases de Remitente y Destinatario
    document.getElementById('idRemitente').className = "form-control form-control-sm";
    document.getElementById('idDestinatario').className = "form-control form-control-sm";

    /* habilita los campos de seleccion bloqueados */
    this.formulario.get('tipoComprobante').enable();
    this.formulario.get('puntoVenta').enable();

    this.establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante);
    this.reestablecerformularioVtaCpteItemFA();

    //Establezco el foco
    puntoVenta && fechaEmision && tipoComprobante ? document.getElementById('idRemitente').focus() :
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante) {
    // tipoComprobante ?
    //   [this.formulario.get('tipoComprobante').setValue(tipoComprobante), this.cambioFecha()] : '';
    //Contorla los parametros
    if (fechaEmision) {
      this.formulario.get('fechaEmision').setValue(fechaEmision);
      this.formulario.get('fechaRegistracion').setValue(fechaEmision);
    } else {
      this.establecerFecha();
    }
    if (puntoVenta) {
      this.formulario.get('puntoVenta').setValue(puntoVenta);
      this.cambioPuntoVenta();
    }
    if (tipoComprobante) {
      this.formulario.get('tipoComprobante').setValue(tipoComprobante);
      this.cambioTipoComprobante(false);
      this.cambioFecha();
    }

    //Define el valor de los campos en el formulario
    this.btnFCE = true; //deshabilita
    // this.btnRemito = false;
    this.btnGS = false;
    this.formulario.get('pagoEnOrigen').setValue(false);
    this.formulario.get('importeSaldo').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeOtrosTributos').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('ventaComprobanteItemCR').setValue([]);
    this.formulario.get('ventaComprobanteItemND').setValue([]);
    this.formulario.get('ventaComprobanteItemNC').setValue([]);
    this.formulario.get('ventaComprobanteItemFAs').setValue([]);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
    this.formulario.get('usuarioAlta').setValue({ id: this.appService.getUsuario().id });
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);

    //Obtiene - establece moneda y  monedaCotizacion
    this.obtenerMoneda();
    //Establece/limpia las clases de ClienteRemitente y ClienteDestinatario
    document.getElementById('Remitente').className = "border has-float-label";
    document.getElementById('Destinatario').className = "border has-float-label";
  }
  //Establece la fecha emision y registracion
  private establecerFecha() {
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaEmision').setValue(res.json());
      this.formulario.get('fechaRegistracion').setValue(res.json());
      this.fechaActual = res.json();
    });
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
    this.ordenVenta.reset();
    this.viajeRemito.reset();
    this.tarifaOrdenVenta.reset();
    this.establecerValoresPorDefectoItemFA();
  }
  //Establece valores por defecto para el formulario
  private establecerValoresPorDefectoItemFA() {
    this.formularioVtaCpteItemFA.reset();
    this.establecerAlicuotaIva();
    this.formularioVtaCpteItemFA.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeRetiro').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('importeEntrega').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('flete').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('descuentoFlete').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemFA.get('ventaTipoItem').setValue(this.itemReserva.value);
    /* deshabilita el campo Seguro si el cliente tiene seguro propio */
    this.formulario.value.cliente ?
      this.formulario.value.cliente.esSeguroPropio ?
        this.formularioVtaCpteItemFA.get('pSeguro').disable() : this.formularioVtaCpteItemFA.get('pSeguro').enable() : '';
    // if (this.itemReserva.value)
    //   this.itemReserva.value.id == 1 || this.itemReserva.value.id == 2 ?
    //     [this.soloLectura = true, this.formularioVtaCpteItemFA.disable(), this.ordenVenta.disable()] : this.soloLectura = false;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFnp = this.compararFnp.bind(this);
  private compararFnp(a, b) {
    if (a != null && b != null) {
      return a.puntoVenta === b.puntoVenta;
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
    if (this.controlarFactura()) {
      /* guarda el objeto puntoVenta para reestablecer */
      let puntoVenta = this.formulario.get('puntoVenta').value;
      /* habilita los campos de seleccion bloqueados */
      this.formulario.get('tipoComprobante').enable();
      this.formulario.get('puntoVenta').enable();
      this.formulario.get('pagoEnOrigen').enable();
      this.formulario.get('clienteRemitente').enable();
      this.formulario.get('clienteDestinatario').enable();
      this.formulario.get('cliente').setValue({ id: this.formulario.value.cliente.id });
      this.formulario.get('clienteDestinatario').setValue({ id: this.formulario.value.clienteDestinatario.id });
      this.formulario.get('clienteRemitente').setValue({ id: this.formulario.value.clienteRemitente.id });
      this.formulario.get('cobrador').setValue({ id: this.formulario.value.cobrador.id });
      this.formulario.get('empresa').setValue({ id: this.formulario.value.empresa.id });
      this.formulario.get('puntoVenta').setValue(this.puntoVenta.value);

      /* Elimina todos los id en el array de ventaComprobanteItemFAs*/
      this.eliminarIDsVtaCpteItemFA();
      this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
        res => {
          let respuesta = res.json();
          if (res.status == 201) {
            this.toastr.success(respuesta.mensaje);
            /* reestablece el objeto puntoVenta al formulario*/
            this.formulario.get('puntoVenta').setValue(puntoVenta);
            this.reestablecerFormulario(false);
            //Limpia listaCompletaRemitos para actualizar la lista 
            this.configuracionModalRemitos.value.listaCompletaRemitos = null;
            this.abrirAgregarOtroItemDialogo();
          }
          this.loaderService.hide();
        },
        err => {
          var respuesta = err.json();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
      );
    } else {
      this.loaderService.hide();
    }
  }
  //Reinicia la Venta Comprobante
  public reiniciarVtaCpte() {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '500px',
      data: {
        mensaje: "¿Está seguro de reiniciar la factura?"
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      resultado ? this.ngOnInit() : '';
    })
  }
  /* Elimina los id de cada item del array de ventaComprobanteItemFAs. Los id los usaba para controlar los remitos ya asignados
       en el dialogo de seleccion de Remitos*/
  private eliminarIDsVtaCpteItemFA() {
    this.listaCompletaItems.data.forEach(
      item => {
        item.id = null;
      }
    )
    this.formulario.get('ventaComprobanteItemFAs').setValue(this.listaCompletaItems.data);
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
    private tipoConceptoVentaService: TipoConceptoVentaService, private toastr: ToastrService) {

  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = new FormGroup({
      concepto: new FormControl(),
      importe: new FormControl()
    })
    //establece concepto e importe si los tiene
    this.formulario.get('concepto').setValue(this.data.tipoConceptoVenta);
    this.formulario.get('importe').setValue(this.data.importeTipoConceptoVenta);
    //Obtiene la lista de conceptos
    this.listarConceptos();
  }
  //Carga la lista de conceptos
  private listarConceptos() {
    this.tipoConceptoVentaService.listar().subscribe(
      res => {
        this.conceptos = res.json();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de enteros CON decimales
  public mascararEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Selecciona todo el texto del campo al posicionar el puntero sobre el campo
  public onTextClick($event) {
    $event.target.select();
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
        this.formulario.patchValue(res.json());
      }, err => { this.toastr.error(err.json().message); }
    )
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Otro Item Dialogo
@Component({
  selector: 'otro-item-dialogo',
  templateUrl: 'otro-item-dialogo.html',
})
export class OtroItemDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  constructor(public dialogRef: MatDialogRef<OtroItemDialogo>, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog,
    private ventaConfigService: VentaConfigService, private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

