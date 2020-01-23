import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { AppService } from 'src/app/servicios/app.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { Subscription } from 'rxjs';
import { VentaComprobanteItemNC } from 'src/app/modelos/ventaComprobanteItemNC';
import { LoaderService } from 'src/app/servicios/loader.service';
import { AfipCaeService } from 'src/app/servicios/afip-cae.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { LoaderState } from 'src/app/modelos/loader';
import { ErrorPuntoVentaComponent } from '../error-punto-venta/error-punto-venta.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emitir-nota-credito',
  templateUrl: './emitir-nota-credito.component.html',
  styleUrls: ['./emitir-nota-credito.component.css']
})
export class EmitirNotaCreditoComponent implements OnInit {
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define el id del tipoComprobante
  public idTipoCpte: number = null;
  //Define el elemento (comprobante) a saldar
  public elemento: FormControl = new FormControl();
  //Define el campo subtotalCIVA como un FormControl
  public subtotalCIVA: FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual: string = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define el formulario para mostrar los datos del cliente
  public formularioCliente: FormGroup;
  //Define el formulario para los Items de la tabla
  public formularioVtaCpteItemNC: FormGroup;
  //Define la lista de resultados de busqueda para Cliente
  public resultadosClientes = [];
  //Define la lista de Tipos de Comprobante
  public tiposComprobante = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];
  /* Define el estado de los checkbox 
  - false permite cancelar varios comprobantes 
  - true permite cancelar solo un cpte (cuando Tipo Cpte = MiPymes ) */
  public checkboxs: boolean = false;
  //Datos con los que se carga la tabla de Aplica a Comprobante
  public listaComprobantes = [];
  //Datos con lo que se carga la tabla de Aplica a la Cuenta
  public listaCuenta = [];
  //Define como un FormControl
  public tipoComprobante: FormControl = new FormControl();
  //Define como un FormControl
  public provincia: FormControl = new FormControl();
  //Define al campo puntoVenta (de solo lectura) como un FormControl
  public puntoVenta: FormControl = new FormControl();
  //Define el Comprobante seleccionado de la tabla Aplica a Comprobante
  public comprobanteSeleccionado = null;
  //Define la Cuenta seleccionada de la tabla Aplica a Cuenta
  public cuentaSeleccionada = null;
  //Define los datos de la Empresa
  public empresa: FormControl = new FormControl();
  //Define la lista de resultados para Provincias
  public resultadosProvincias = [];
  //Define la lista de items tipo
  public resultadosMotivos = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public resultadosAlicuotasIva = [];
  //Define el check
  public check: boolean = false;
  //Define las variables de la cabecera
  public letra: string;
  public codigoAfip: string;
  public numero: string;
  //prueba
  public listaNotaCdto: Array<any> = [];
  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla cuando aplica a comprobantes
  public columnasComprobante: string[] = ['CHECK', 'FECHA_EMISION', 'FECHA_VTO_PAGOS',
    'TIPO', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'IMPORTE', 'SALDO', 'MOTIVO',
    'SUBTOTAL_NC', 'ALIC_IVA', 'SUBTOTAL_IVA'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(
    private afipCaeService: AfipCaeService,
    private ventaComprobante: VentaComprobante,
    private ventaCpteItemNC: VentaComprobanteItemNC,
    private fechaService: FechaService,
    private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService,
    private puntoVentaService: PuntoVentaService,
    private clienteService: ClienteService,
    private appService: AppService, private route: Router,
    private toastr: ToastrService,
    private ventaComprobanteService: VentaComprobanteService,
    private ventaTipoItemervice: VentaTipoItemService,
    public dialog: MatDialog, private loaderService: LoaderService,
  ) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      })
    //inicializa el formulario de Nota de Cdto. y sus elementos
    this.formulario = this.ventaComprobante.formulario;
    //inicializa el formulario de Nota de Cdto. y sus elementos
    this.formularioVtaCpteItemNC = this.ventaCpteItemNC.formulario;
    //inicializa el formulario de Cliente y sus elementos
    this.formularioCliente = new FormGroup({
      domicilio: new FormControl(),
      localidad: new FormControl(),
      afipCondicionIva: new FormControl(),
      condicionVenta: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl()
    })
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getUsuario().sucursal.id);
    //Reestablece el Formularios
    this.reestablecerFormulario(true);
    //Autcompletado - Buscar por Remitente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteService.listarActivosPorAlias(data).subscribe(res => {
            this.resultadosClientes = res.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.ventaComprobanteService.inicializarNotaCredito(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();

        //Establece demas datos necesarios
        this.tiposComprobante = respuesta.tipoComprobantes;
        this.resultadosProvincias = respuesta.provincias;
        this.resultadosMotivos = respuesta.ventaTipoItems;
        this.afipAlicuotasIva = respuesta.afipAlicuotaIvas;
        this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
        this.cambioTipoComprobante();
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Obtiene una lista para el campo 'Motivo'
  public listarItemsTipo() {
    /* reestablece el Formulario y los controles de tipo boolean */
    this.formulario.get('cliente').value ? this.reestablecerFormulario(false) : '';
    this.checkboxs = false;
    this.idMod = null;
    /* se pasa como parámetro el 3 el cual hace referencia a las Notas de Cdto*/
    this.ventaTipoItemervice.listarItems(3).subscribe(
      res => {
        this.resultadosMotivos = res.json();
      }
    )
  }
  //Establece alicuota iva por defecto
  private establecerAlicuotaIva() {
    this.afipAlicuotasIva.forEach(elemento => {
      if (elemento.id == 5) {
        this.formularioVtaCpteItemNC.get('afipAlicuotaIva').setValue(elemento);
      }
    })
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntosVenta() {
    this.puntoVentaService.listarPorEmpresaYSucursalYTipoComprobante(
      this.appComponent.getEmpresa().id, this.appComponent.getUsuario().sucursal.id, this.idTipoCpte).subscribe(
        res => {
          this.resultadosPuntoVenta = res.json();
          if (this.resultadosPuntoVenta.length > 0) {
            this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0]);
            this.cambioPuntoVenta();
          } else {
            this.toastr.error("Punto de venta inexistente para el Tipo de comprobante.");
            // const dialogRef = this.dialog.open(ErrorPuntoVentaComponent, {
            //   width: '700px'
            // });
            // dialogRef.afterClosed().subscribe(resultado => {
            //   this.route.navigate(['/home']);
            // });
          }
        }
      )
  }
  //Establece la fecha emision y registracion
  private establecerFecha() {
    this.fechaService.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      this.formulario.get('fechaRegistracion').setValue(this.fechaActual);
      this.formulario.get('fechaVtoPago').setValue(this.fechaActual);

    })
  }
  //Controla el cambio en Tipo de cpte
  public cambioTipoComprobante() {
    this.idTipoCpte = this.formulario.value.tipoComprobante.id;
    this.listarPuntosVenta();
  }
  //Controla el cambio en el campo Fecha
  public cambioFecha() {
    this.formulario.get('fechaVtoPago').setValue(this.formulario.value.fechaEmision);
    this.formulario.value.puntoVenta ? this.validarFechaEmision() : '';
    this.formulario.value.fechaVtoPago ? this.validarFechaVtoPago() : '';
  }

  //Controla que fechaVtoPago no sea menor a fechaEmision
  private validarFechaVtoPago() {
    if (this.formulario.value.fechaVtoPago < this.formulario.value.fechaEmision) {
      this.formulario.get('fechaVtoPago').reset();
      this.toastr.warning("Fecha Vto. Pago no puede ser menor a Fecha Emisión. Se reseteó el Fecha Vto. Pago.");
    }
  }
  //Genera y retorna una fecha segun los parametros que recibe (dias - puede ser + ó -)
  private generarFecha(dias) {
    let today = new Date(this.fechaActual);
    today.setDate(today.getDate() + dias);
    let date = today.getDate() + dias;
    //Le cambio el simbolo '-' (negativo) para formatear bien la fecha
    date < 0 ? date = -(date) : '';
    //Al mes se le debe sumar 1
    let fechaGenerada = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + date;
    return fechaGenerada;
  }
  //Controla el campo fecha de emision dependiento el punto de venta seleccionado
  private validarFechaEmision() {
    this.formulario.value.puntoVenta.feCAEA ? this.verificarFechaFeCAEA() : this.verificarFechaNoFeCAEA();
  }
  //Controla el rango valido para la fecha de emision cuando el punto de venta es feCAEA
  private verificarFechaFeCAEA() {
    let fechaMenos15dias = new Date(this.generarFecha(-15));
    let fechaMas1dia = new Date(this.generarFecha(+1));
    let fechaEmision = new Date(this.formulario.value.fechaEmision);
    if (fechaEmision.getTime() >= fechaMenos15dias.getTime()) {
      if (fechaEmision.getTime() <= fechaMas1dia.getTime())
        document.getElementById('idCliente').focus();
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
        document.getElementById('idCliente').focus();
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
    }

    //Vacio formularios y listas
    this.vaciarListas();
    this.formulario.reset();
    this.puntoVenta.reset();
    this.subtotalCIVA.reset();
    this.subtotalCIVA.disable();
    this.formularioCliente.reset();
    this.formularioVtaCpteItemNC.reset();
    this.formularioVtaCpteItemNC.disable();

    /* habilita los campos de seleccion bloqueados */
    this.formulario.get('tipoComprobante').enable();
    this.formulario.get('puntoVenta').enable();

    //Reestablezco valores por defecto en el formulario
    this.establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante);

    //Establezco el foco
    puntoVenta && fechaEmision && tipoComprobante ? document.getElementById('idCliente').focus() :
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
  }
  //Limpia las listas
  private vaciarListas() {
    this.resultadosClientes = [];
    this.listaCompleta.data = [];
  }
  //Reestablece y limpia el formularioVtaCpteItemNC
  private reestablecerformularioVtaCpteItemNC() {
    this.idMod = null;
    this.elemento.reset();
    this.subtotalCIVA.reset();
    this.subtotalCIVA.disable();
    this.formularioVtaCpteItemNC.reset();
    this.formularioVtaCpteItemNC.disable();
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante) {
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
      this.cambioTipoComprobante();
      this.cambioFecha();
    }
    
    //Define el valor de los campos en el formulario
    this.formulario.get('pagoEnOrigen').setValue(false);
    this.provincia.setValue(this.resultadosProvincias[0]);
    this.formulario.get('ventaComprobanteItemCR').setValue([]);
    this.formulario.get('ventaComprobanteItemND').setValue([]);
    this.formulario.get('ventaComprobanteItemNC').setValue([]);
    this.formulario.get('ventaComprobanteItemFAs').setValue([]);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('usuarioAlta').setValue({ id: this.appService.getUsuario().id });
    this.formulario.get('importeSaldo').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeOtrosTributos').setValue(this.appService.establecerDecimales('0.00', 2));
  }

  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public cambioPuntoVenta() {
    //Establece el formControl puntoVenta
    this.puntoVenta.setValue(this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5));
    // this.validarFechaEmision();
    this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0 ?
      this.cargarNumero(this.formulario.get('codigoAfip').value) : '';
    //Establece el atributo 'CAE' 'esCAEA'
    this.formulario.get('esCAEA').setValue(this.formulario.get('puntoVenta').value.feCAEA)
    this.formulario.get('puntoVenta').value.feCAEA ? this.obtenerCAE() : this.formulario.get('CAE').setValue(0);
  }

  //Valida el tipo y numero documento, luego setea datos para mostrar y obtiene el listado de sucursales por Cliente
  public cambioCliente() {
    let cliente = this.formulario.value.cliente;
    let res = this.validarDocumento(cliente.tipoDocumento, cliente.numeroDocumento);
    if (res) {
      /* establece campos en formulario de cabecera */
      this.formulario.get('cobrador').setValue(cliente.cobrador);
      this.formulario.get('afipCondicionIva').setValue(cliente.afipCondicionIva);
      this.formulario.get('tipoDocumento').setValue(cliente.tipoDocumento);
      this.formulario.get('numeroDocumento').setValue(cliente.numeroDocumento);
      this.formulario.get('condicionVenta').setValue(cliente.condicionVenta);
      this.formulario.get('clienteRemitente').setValue(cliente);
      this.formulario.get('clienteDestinatario').setValue(cliente);

      /* establece campos de soloLectura en el formulario del Cliente*/
      this.formularioCliente.get('domicilio').setValue(cliente.domicilio);
      this.formularioCliente.get('localidad').setValue(cliente.localidad.nombre);
      this.formularioCliente.get('condicionVenta').setValue(cliente.condicionVenta.nombre);
      this.formularioCliente.get('afipCondicionIva').setValue(cliente.afipCondicionIva.nombre);
      this.formularioCliente.get('tipoDocumento').setValue(cliente.tipoDocumento.nombre);
      this.formularioCliente.get('numeroDocumento').setValue(cliente.numeroDocumento);
      this.controlCamposPorCliente();
    }
  }
  //Validad el numero de documento
  public validarDocumento(tipoDocumento, documento) {
    let respuesta;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err, 'idCliente', 'labelCliente');
          }
          break;
        case 2:
          respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err, 'idCliente', 'labelCliente');
          }
          break;
        case 8:
          respuesta = this.appService.validarDNI(documento.toString());
          if (!respuesta) {
            this.formulario.get('clienteRemitente').reset();
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err, 'idCliente', 'labelCliente');
          }
          break;
      }
    }
    return respuesta;
  }
  //Controla campos segun datos del Cliente  
  private controlCamposPorCliente() {
    // Controla el campo 'Letra' - Es A cuando el cliente es responsable inscripto (afipCondicionIva == 1) sino es B consumidor final
    this.formulario.value.cliente.afipCondicionIva.id == 1 ?
      this.formulario.get('letra').setValue('A') : this.formulario.get('letra').setValue('B');
    // Obtiene el codigo afip y el número
    this.cargarCodigoAfip(this.formulario.value.letra);
    // Obtiene las ventas comprobantes
    this.listarVentaComprobanteParaNotaCredito();
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
    this.loaderService.show();
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip,
      this.formulario.value.sucursal.id, this.formulario.value.empresa.id).subscribe(
        res => {
          let numero = res.text();
          this.formulario.get('numero').setValue(this.establecerCerosIzq(Number(numero), "0000000", -8));

          //se bloquean los campos de seleccion para tipo cpte y p. venta
          this.formulario.get('tipoComprobante').disable();
          this.formulario.get('puntoVenta').disable();
          this.loaderService.hide();
        },
        err => {
          this.formulario.get('numero').reset();
          this.toastr.error("Punto de venta inexistente para la condición de iva.");
          this.loaderService.hide();
        }
      )
  }
  //Obtiene la lista de Venta Comprobante NC (para Nota de Credito)
  private listarVentaComprobanteParaNotaCredito() {
    let idCliente = this.formulario.value.cliente.id;
    this.ventaComprobanteService.listarParaCreditosPorClienteYEmpresa(
      idCliente, this.appService.getEmpresa().id).subscribe(
        res => {
          this.listaCompleta.data = res.json();
          this.listaCompleta.data.length == 0 ?
            this.toastr.warning('El Cliente no tiene comprobantes pendientes.') : this.limpiarVtaCpteItemNC();
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
        }
      )
  }
  //Controla el cambio en el campo de selección 'Motivo'
  public cambioMotivo() {
    /* setea los valores por defecto del comprobante seleccionado*/
    this.activarActualizarElemento(this.elemento.value, this.idMod);
    /* controla cuando el motivo es 'Anulacion de cpte', establece los campos en solo lectura
      ya que salda el total del saldo del comprobante */
    if (this.formularioVtaCpteItemNC.value.ventaTipoItem.id == 9) {
      this.formularioVtaCpteItemNC.get('importeNetoGravado').disable();
      this.formularioVtaCpteItemNC.get('afipAlicuotaIva').disable();
      this.subtotalCIVA.disable();
    }
  }
  //Establece el elemento en el formularioVtaCpteItemNC para modificar
  public activarActualizarElemento(elemento, indice) {
    !this.idMod ? this.idMod = indice : '';
    !this.elemento.value ? this.elemento.setValue(elemento) : '';
    this.subtotalCIVA.enable();
    this.formularioVtaCpteItemNC.enable();
    this.formularioVtaCpteItemNC.patchValue(elemento);
    /* establece ventaComprobante y  ventaComprobanteAplicado*/
    this.establecerAlicuotaIva();

    /* establece los decimales para el importeSaldo */
    this.subtotalCIVA.setValue(elemento.importeSaldo);

    /* establece valores por defecto */
    this.formularioVtaCpteItemNC.get('ventaComprobanteAplicado').setValue({ id: elemento.id });
    this.formularioVtaCpteItemNC.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemNC.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    // this.formularioVtaCpteItemNC.get('importeNetoGravado').setValue(elemento.importeNetoGravado);
    this.calcularSubtotalNC();
  }
  //Cancela el actualizar elemento- limpia el formularioVtaCpteItemNC
  public cancelarModElemento() {
    this.formularioVtaCpteItemNC.reset();
    this.formularioVtaCpteItemNC.disable();
    this.idMod = null;
    this.elemento.reset();
    this.subtotalCIVA.reset();
    this.subtotalCIVA.disable();
  }
  //Actualiza el registro seleccionado de la tabla
  public actualizar() {
    this.listaCompleta.data[this.idMod] = this.formularioVtaCpteItemNC.value;
    this.listaCompleta.sort = this.sort;
    this.cancelarModElemento();
  }
  //Acepta el cambio en el comprobante seleccionado de la tabla
  public aceptarComprobante() {
    /* habilita el formulario para recuperar los campos de solo lectura y establece provincia*/
    this.formularioVtaCpteItemNC.enable();
    this.formularioVtaCpteItemNC.get('provincia').setValue(this.provincia.value);

    /* agrega el formulario vta cpte item NC al comprobante seleccionado */
    this.listaCompleta.data[this.idMod].ventaComprobanteItemNC.push(this.formularioVtaCpteItemNC.value);
    this.reestablecerformularioVtaCpteItemNC();

    /* llama a calcular importes totales*/
    this.calcularImportesTotales();

    //Si el tipo de cpte es FCE MiPymes cambia el estado del boolean 'checkbox'
    this.idTipoCpte == 28 ?
      this.checkboxs = true : this.checkboxs = false;
  }
  //Vacia los array de vtaCpteItemNC de cada comprobante
  private limpiarVtaCpteItemNC() {
    this.listaCompleta.data.forEach(
      item => {
        item.ventaComprobanteItemNC = [];
        item.checked = false;
      }
    )
  }
  //Calcula los importes totales para la lista de Items agregados
  private calcularImportesTotales() {
    let impNetoGravadoTotal = 0;
    let importeIvaTotal = 0;
    this.listaCompleta.data.forEach(
      elemento => {

        /* si el comprobante tiene vtaCpteItemNC que sume sus totales */
        if (elemento.ventaComprobanteItemNC.length > 0) {
          impNetoGravadoTotal += Number(elemento.ventaComprobanteItemNC[0].importeNetoGravado);
          importeIvaTotal += Number(elemento.ventaComprobanteItemNC[0].importeIva);
        }
      }
    )
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(
      impNetoGravadoTotal == 0 ? '0.00' : impNetoGravadoTotal, 2));
    this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(
      importeIvaTotal == 0 ? '0.00' : importeIvaTotal, 2));
    let importeTotal = Number(this.formulario.get('importeNetoGravado').value) + Number(this.formulario.get('importeIva').value);
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(
      importeTotal == 0 ? '0.00' : importeTotal, 2));
  }
  //Establece los importes totales en cero
  private limpiarImportesTotales() {
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeIva').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales('0.00', 2));
  }

  //Cancela la modificacion del comprobante seleccionado
  public cancelarComprobante() {
    this.listaCompleta.data[this.idMod].checked = false;
    this.reestablecerformularioVtaCpteItemNC();
    this.verificarCheckbox();
  }
  //Calcula el saldo para cada registro de la tabla 
  public calcularSaldoElemento(elemento) {
    let subtotalConIva = elemento.importeNetoGravado + elemento.importeIva;
    let saldo = subtotalConIva;
    return saldo;
  }
  //Calcula el subtotal con IVA para cada registro de la tabla 
  public calcularSubtotalConIvaElemento(elemento) {
    let subtotalConIva = Number(elemento.ventaComprobanteItemNC[0].importeNetoGravado) +
      Number(elemento.ventaComprobanteItemNC[0].importeIva);
    return subtotalConIva;
  }
  //Controla el cambio los check-box
  public cambioCheck(elemento, indice, $event) {
    if ($event.checked) {
      this.checkboxs = true;
      this.listaCompleta.data[indice].checked = true;
      this.activarActualizarElemento(elemento, indice);
      this.formularioVtaCpteItemNC.get('ventaTipoItem').setValue(this.resultadosMotivos[0]);
      this.formularioVtaCpteItemNC.get('estaRechazadaFCE').setValue(false);
      this.cambioMotivo();
    } else {

      /* elimina el formulario a saldar asignado a dicho comprobante */
      this.listaCompleta.data[indice].ventaComprobanteItemNC = [];
      this.listaCompleta.data[indice].checked = false;

      this.reestablecerformularioVtaCpteItemNC();
      /* llama a calcular importes totales*/

      this.listaCompleta.data.length > 0 ? this.calcularImportesTotales() : this.limpiarImportesTotales();
      //Llama a verificar lista para controlar el estado del boolean 'checkbox'
      this.idTipoCpte == 28 ? this.verificarCheckbox() : '';
    }
  }
  //Recorre la lista completa para verificar si algun registro tiene cancelado un cpte (atributo 'ventaComprobanteItemNC')
  private verificarCheckbox() {
    this.checkboxs = false;
    for (let i = 0; i < this.listaCompleta.data.length; i++) {
      if (this.listaCompleta.data[i].ventaComprobanteItemNC.length > 0) {
        this.checkboxs = true;
      }
    }
  }
  //Calcula 'SubtotalNC' de cada registro de la tabla 
  public calcularSubtotalNC() {

    /* subtotal = total del comprobante que se quiere saldar */
    this.subtotalCIVA.setValue(this.appService.establecerDecimales(this.subtotalCIVA.value, 2));
    let subtotalCIVA = Number(this.subtotalCIVA.value);

    /* subtotalCIVA debe ser siempre menor al importe a saldar */
    if (subtotalCIVA <= this.elemento.value.importeSaldo) {
      /* une la parte entera con los decimales */
      let alicuotaIva = String(this.formularioVtaCpteItemNC.value.afipAlicuotaIva.alicuota).split('.').join('');
      /* genera el nuevo valor de la alicuota iva para obtener el valor del subtotalNC, importeIva */
      let alicuotaGenerada = Number('1.' + String(alicuotaIva));
      let subtotalNC = subtotalCIVA / alicuotaGenerada;
      let importeIva = subtotalCIVA - subtotalNC;
      /* establece el subtotalNC, importeIva calculado */
      this.formularioVtaCpteItemNC.get('importeNetoGravado').
        setValue(this.appService.establecerDecimales(String(subtotalNC), 2));
      this.formularioVtaCpteItemNC.get('importeIva').
        setValue(this.appService.establecerDecimales(String(importeIva), 2));
    } else {
      this.toastr.error("Importe no coresponde.");
      this.subtotalCIVA.reset();
    }

  }
  //Asigna los comprobantes seleccionados de la tabla al campo 'ventaComprobanteItemNC' del formulario
  private establecerformularioVtaCpteItemNC() {
    for (let i = 0; i < this.listaCompleta.data.length; i++) {
      if (this.listaCompleta.data[i].ventaComprobanteItemNC.length > 0) {

        /* setea el campo afipConceptoVenta */
        !this.formulario.value.afipConceptoVenta ?
          this.formulario.value.afipConceptoVenta = this.listaCompleta.data[i].afipConceptoVenta : '';

        /* agrego las ventaComprobanteItemNC de la tabla, las cuales tienen un registro cargado a saldar */
        this.formulario.value.ventaComprobanteItemNC.push(this.listaCompleta.data[i].ventaComprobanteItemNC[0]);
      }
    }
  }
  //Emite la Nota de Crédito
  public agregarNotaCredito() {
    this.loaderService.show();
    /* habilita los campos de seleccion bloqueados */
    this.formulario.get('tipoComprobante').enable();
    this.formulario.get('puntoVenta').enable();

    /* limpia arrays de items */
    this.formulario.value.ventaComprobanteItemCR = null;
    this.formulario.value.ventaComprobanteItemFAs = null;
    this.formulario.value.ventaComprobanteItemND = null;
    this.checkboxs = false;

    /* guardo el punto de venta para luego reestablecerlo */
    let puntoVenta = this.formulario.value.puntoVenta;

    /* establece el array de items NC, el valor de puntoVenta */
    this.establecerformularioVtaCpteItemNC();
    this.formulario.value.puntoVenta = this.formulario.value.puntoVenta.puntoVenta;

    /* agrega el comprobante solo si existen notas de creditos agregadas*/
    if (this.formulario.value.ventaComprobanteItemNC.length > 0) {
      this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
        res => {
          let respuesta = res.json();
          this.toastr.success(respuesta.mensaje);
          this.formulario.get('puntoVenta').setValue(puntoVenta);
          this.reestablecerFormulario(false);
          this.loaderService.hide();
        },
        err => {
          let respuesta = err.json();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.toastr.error("Error: no hay comprobantes a saldar.");
      this.loaderService.hide();
    }
  }
  //Reinicia la Nota de Crédito
  public reiniciarNotaCredito() {
    this.ngOnInit();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err, idCampo, labelCampo) {
    this.formulario.get('numeroDocumento').setErrors({ 'incorrect': true });
    let respuesta = err;
    if (respuesta.codigo == 11010) {
      document.getElementById(labelCampo).classList.add('label-error');
      document.getElementById(idCampo).classList.add('is-invalid');
      document.getElementById(idCampo).focus();
    }
    this.toastr.error(respuesta.mensaje);
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
  public returnDecimales(valor, cantidad) {
    return Number(this.appService.setDecimales(valor, cantidad));
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
      this.formularioCliente.reset();
      this.formulario.get('cliente').reset();
    }
  }
}