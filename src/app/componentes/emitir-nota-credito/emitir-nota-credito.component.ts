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
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ErrorPuntoVentaComponent } from '../error-punto-venta/error-punto-venta.component';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { Subscription } from 'rxjs';
import { VentaComprobanteItemNC } from 'src/app/modelos/ventaComprobanteItemNC';
import { LoaderService } from 'src/app/servicios/loader.service';

@Component({
  selector: 'app-emitir-nota-credito',
  templateUrl: './emitir-nota-credito.component.html',
  styleUrls: ['./emitir-nota-credito.component.css']
})
export class EmitirNotaCreditoComponent implements OnInit {

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
  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['FECHA_EMISION', 'FECHA_VTO_PAGOS', 'TIPO', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'IMPORTE', 'SALDO', 'TIPO_ITEM',
    'CONCEPTO', 'SUBTOTAL', 'ALIC_IVA', 'SUBTOTAL_IVA'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;


  public checkboxComp: boolean = null;
  public checkboxCuenta: boolean = null;
  public tablaVisible: boolean = null;
  public formularioComprobante: FormGroup;
  public formularioCuenta: FormGroup;
  //Datos con los que se carga la tabla de Aplica a Comprobante
  public listaComprobantes = [];
  //Datos con lo que se carga la tabla de Aplica a la Cuenta
  public listaCuenta = [];
  //Define como un FormControl
  public tipoComprobante: FormControl = new FormControl();
  //Define al campo puntoVenta (de solo lectura) como un FormControl
  public puntoVenta: FormControl = new FormControl();
  //Define la opcion elegida como un formControl
  public opcionCheck: FormControl = new FormControl();
  //Define el Comprobante seleccionado de la tabla Aplica a Comprobante
  public comprobanteSeleccionado = null;
  //Define la Cuenta seleccionada de la tabla Aplica a Cuenta
  public cuentaSeleccionada = null;
  //Define los datos de la Empresa
  public empresa: FormControl = new FormControl();
  //Define la lista de resultados para Provincias
  public resultadosProvincias = [];
  //Define la lista de items tipo
  public resultadosItems = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public resultadosAlicuotasIva = [];
  //Define el check
  public check: boolean = false;
  //Define el subtotal c/iva del comprobante seleccionado
  public subtotalCIVA = 0;
  //Define las variables de la cabecera
  public letra: string;
  public codigoAfip: string;
  public numero: string;
  //Constructor
  constructor(private ventaComprobante: VentaComprobante, private ventaCpteItemNC: VentaComprobanteItemNC, private fechaService: FechaService, private tipoComprobanteService: TipoComprobanteService, private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService, private puntoVentaService: PuntoVentaService, private clienteService: ClienteService,
    private appService: AppService, private provinciaService: ProvinciaService, private toastr: ToastrService, private ventaComprobanteService: VentaComprobanteService,
    private ventaTipoItemervice: VentaTipoItemService, private alicuotasIvaService: AfipAlicuotaIvaService, private route: Router, public dialog: MatDialog,
    private loaderService: LoaderService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible = true;
    this.checkboxComp = true;
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
    });
    //Reestablece el Formularios
    this.reestablecerFormulario(true);
    //Obtiene la lista de tipos de comprobante
    this.listarTiposComprobante();
    //Obtiene la lista de puntos de venta 
    this.listarPuntosVenta();
    //Obtiene las Provincias - origen de la carga 
    this.listarProvincias();
    //Obtiene los Motivos por el cual se desea modificar el comprobante
    this.listarItemsTipo();
    //Lista las alicuotas afip iva
    this.listarAlicuotaIva();
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
    });
  }
  //Obtiene la lista de Puntos de Venta
  private listarPuntosVenta() {
    this.puntoVentaService.listarHabilitadosPorSucursalEmpresaYFe(this.formulario.value.empresa.id, this.formulario.value.sucursal.id).subscribe(
      res => {
        this.resultadosPuntoVenta = res.json();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene la lista de tipos de comprobante
  private listarTiposComprobante() {
    this.tipoComprobanteService.listarParaNotaCredito().subscribe(
      res => {
        this.tiposComprobante = res.json();
      }, err => { this.toastr.error(err.json().mensaje); }
    )
  }
  //Obtiene una lista de las Provincias 
  public listarProvincias() {
    this.provinciaService.listar().subscribe(
      res => {
        this.resultadosProvincias = res.json();
      },
      err => {
        this.toastr.error("Error al obtener las Provincias");
      }
    );
  }
  //Obtiene una lista de Conceptos Varios
  public listarItemsTipo() {
    this.ventaTipoItemervice.listarItems(3).subscribe(
      res => {
        this.resultadosItems = res.json();
      }
    );
  }
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva() {
    this.alicuotasIvaService.listarActivas().subscribe(
      res => {
        this.afipAlicuotasIva = res.json();
      }
    );
  }
  //Establece alicuota iva por defecto
  private establecerAlicuotaIva() {
    this.afipAlicuotasIva.forEach(elemento => {
      if (elemento.id == 5) {
        this.formularioVtaCpteItemNC.get('afipAlicuotaIva').setValue(elemento);
      }
    })
  }
  //Limpia las listas
  private vaciarListas() {
    this.resultadosClientes = [];
    this.listaCompleta = new MatTableDataSource([]);
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
    if (this.formulario.value.fechaEmision >= this.generarFecha(-15) && this.formulario.value.fechaEmision <= this.generarFecha(+1)) {
      document.getElementById('idItem').focus();
    } else {
      this.toastr.error("Fecha para FeCAEA no es válido. Se establece fecha actual.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }
  //Controla el rango valido para la fecha de emision cuando el punto de venta no es feCAEA
  private verificarFechaNoFeCAEA() {
    if (this.formulario.value.fechaEmision >= this.generarFecha(-5) && this.formulario.value.fechaEmision <= this.generarFecha(+1)) {
      document.getElementById('idItem').focus();
    } else {
      this.toastr.error("Fecha para no es válido. Se establece fecha actual.");
      this.formulario.get('fechaEmision').setValue(this.fechaActual);
      document.getElementById('idFechaEmision').focus();
    }
  }  //Genera y retorna una fecha segun los parametros que recibe (dias - puede ser + ó -)
  private generarFecha(dias) {
    let fechaActual = new Date();
    let date = fechaActual.getDate() + dias;
    let fechaGenerada = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + (date < '10' ? '0' + date : date); //Al mes se le debe sumar 1
    return fechaGenerada;
  }
  //Reestablece el formulario cuando cambia el item a facturar
  private reestablecerFormulario(limpiarTodo) {
    let puntoVenta;
    let fechaEmision;
    let tipoComprobante;
    //Guardo por si existen datos ya cargados
    !limpiarTodo ? [
      puntoVenta = this.formulario.value.puntoVenta,
      fechaEmision = this.formulario.value.fechaEmision,
      tipoComprobante = this.formulario.value.tipoComprobante] : '';
    //Vacio formularios y listas
    this.vaciarListas();
    this.formulario.reset();
    this.puntoVenta.reset();
    this.formularioCliente.reset();
    this.formularioVtaCpteItemNC.reset();
    this.establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante);
    this.reestablecerformularioVtaCpteItemFA();
    //Establezco el foco
    puntoVenta && fechaEmision && tipoComprobante ? document.getElementById('idRemitente').focus() :
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
  }
  //Reestablece y limpia el formularioVtaCpteItemFA
  public reestablecerformularioVtaCpteItemFA() {
    this.formularioVtaCpteItemNC.reset();
    this.establecerValoresPorDefectoItemNC();
  }
  //Establece valores por defecto para el formulario items
  private establecerValoresPorDefectoItemNC() {
    this.establecerAlicuotaIva();
    this.formularioVtaCpteItemNC.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formularioVtaCpteItemNC.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(fechaEmision, puntoVenta, tipoComprobante) {
    this.formulario.get('pagoEnOrigen').setValue(true);
    this.formulario.get('importeNoGravado').setValue(0);
    this.formulario.get('importeOtrosTributos').setValue(0);
    this.formulario.get('ventaComprobanteItemCR').setValue([]);
    this.formulario.get('ventaComprobanteItemND').setValue([]);
    this.formulario.get('ventaComprobanteItemNC').setValue([]);
    this.formulario.get('ventaComprobanteItemFAs').setValue([]);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobante[0]);
    this.formulario.get('usuarioAlta').setValue({ id: this.appService.getUsuario().id });
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    fechaEmision ?
      [this.formulario.get('fechaEmision').setValue(fechaEmision), this.formulario.get('fechaRegistracion').setValue(fechaEmision)] : this.establecerFecha();
    puntoVenta ?
      [this.formulario.get('puntoVenta').setValue(puntoVenta), this.cambioPuntoVenta()] : this.formulario.get('puntoVenta').setValue(this.puntoVenta[0]);;
    tipoComprobante ?
      [this.formulario.get('tipoComprobante').setValue(tipoComprobante), this.cambioFecha()] : '';
  }
  //Establece la fecha emision y registracion
  private establecerFecha() {
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaEmision').setValue(res.json());
      this.formulario.get('fechaRegistracion').setValue(res.json());
      this.fechaActual = res.json();
    });
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public cambioPuntoVenta() {
    //Establece el formControl puntoVenta
    this.puntoVenta.setValue(this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5));
    this.validarFechaEmision();
    //Establece el campo 'Numero'
    this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0 ?
      this.cargarNumero(this.formulario.get('codigoAfip').value) : '';
  }
  //Setea el numero por el punto de venta y el codigo de Afip
  public cargarNumero(codigoAfip) {
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip,
      this.formulario.value.sucursal.id, this.formulario.value.empresa.id).subscribe(
        res => {
          this.formulario.get('numero').setValue(res.text());
        },
        err => {
          this.formulario.get('numero').reset();
          this.toastr.error("Error al obtener el número.");
        }
      );
  }
  //Valida el tipo y numero documento, luego setea datos para mostrar y obtiene el listado de sucursales por Remitente
  public cambioCliente() {
    let cliente = this.formulario.value.cliente;
    let res = this.validarDocumento(cliente.tipoDocumento, cliente.numeroDocumento, 'Remitente');
    if (res) {
      this.formularioCliente.get('domicilio').setValue(cliente.domicilio);
      this.formularioCliente.get('localidad').setValue(cliente.localidad.nombre);
      this.formularioCliente.get('condicionVenta').setValue(cliente.condicionVenta.nombre);
      this.formularioCliente.get('afipCondicionIva').setValue(cliente.afipCondicionIva.nombre);
      this.formularioCliente.get('tipoDocumento').setValue(cliente.tipoDocumento.nombre);
      this.formularioCliente.get('numeroDocumento').setValue(cliente.numeroDocumento);
    }
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }









  public cambioTabla(opcion) {
    switch (opcion) {
      case 1:
        this.tablaVisible = true;
        this.limpiarClienteYTabla();
        break;

      case 2:
        this.tablaVisible = false;
        this.limpiarClienteYTabla();
        break;
    }
  }
  //Limpia los campos correspondientes al Cliente
  private limpiarClienteYTabla() {
    this.formulario.get('cli').reset();
    this.formulario.get('cliente').reset();
    this.formulario.get('letra').reset();
    this.formulario.get('codigoAfip').reset();
    this.formulario.get('numero').reset();
    this.resultadosClientes = [];
    this.listaComprobantes = [];
    this.listaCuenta = [];
    this.reestablecerFormularioComprobante();
    this.reestablecerFormularioCuenta();
    setTimeout(function () {
      document.getElementById('idCliente').focus();
    }, 20);
  }
  //Carga datos (filas) en la tabla correspondiente
  private cargarTabla() {
    this.ventaComprobanteService.listarPorClienteYEmpresa(this.formulario.get('cliente').value.id, this.empresa.value.id).subscribe(
      res => {
        let respuesta = res.json();
        this.listaComprobantes = respuesta; //Filtramos por comprobanteItemFAs -> respuesta.comprobanteItemFAs
      }
    );
  }
  //Reestablece el formulario completo
  // public reestablecerFormulario() {
  //   this.formulario.reset();
  //   this.reestablecerFormularioComprobante();
  //   this.reestablecerFormularioCuenta();
  //   let valorDefecto = '0';
  //   this.formulario.get('importeIva').setValue(this.appService.setDecimales(valorDefecto, 2));
  //   this.formulario.get('importeNoGravado').setValue(this.appService.setDecimales(valorDefecto, 2));
  //   this.formulario.get('importeExento').setValue(this.appService.setDecimales(valorDefecto, 2));
  //   this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(valorDefecto, 2));
  //   this.formulario.get('importeTotal').setValue(this.appService.setDecimales(valorDefecto, 2));
  //   this.resultadosClientes = [];
  //   this.empresa.setValue(this.appComponent.getEmpresa());
  //   this.opcionCheck.setValue('1');
  //   //Establece la fecha actual
  //   this.fechaService.obtenerFecha().subscribe(res => {
  //     this.formulario.get('fechaEmision').setValue(res.json());
  //   });
  //   //Establece el Tipo de Comprobante
  //   this.tipoComprobanteService.obtenerPorId(3).subscribe(
  //     res => {
  //       let respuesta = res.json();
  //       this.formulario.get('tipoComprobante').setValue(res.json());
  //       this.tipoComprobante.setValue(respuesta.nombre);
  //     },
  //     err => {
  //       this.toastr.error('Error al obtener el Tipo de Comprobante');
  //     }
  //   );
  //   this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
  //   this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
  //   this.formulario.get('provincia').setValue(this.appComponent.getUsuario().sucursal['localidad']['provincia']);
  //   this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
  //   document.getElementById('idFecha').focus();
  // }

  //Establece los datos del cliente seleccionado
  public cargarDatosCliente() {
    if (this.formulario.get('puntoVenta').value != null || this.formulario.get('puntoVenta').value > 0) {
      this.formulario.get('cli.domicilio').setValue(this.formulario.get('cliente').value.domicilio);
      this.formulario.get('cli.localidad').setValue(this.formulario.get('cliente').value.localidad.nombre);
      this.formulario.get('cli.condicionVenta').setValue(this.formulario.get('cliente').value.condicionVenta.nombre);
      this.formulario.get('cli.afipCondicionIva').setValue(this.formulario.get('cliente').value.afipCondicionIva.nombre);
      this.formulario.get('cli.tipoDocumento').setValue(this.formulario.get('cliente').value.tipoDocumento.abreviatura);
      this.formulario.get('cli.numeroDocumento').setValue(this.formulario.get('cliente').value.numeroDocumento);
      this.establecerCabecera();
    }
    else {
      this.formulario.get('cliente').setValue(null);
      this.resultadosClientes = [];
      this.toastr.error('Debe seleccionar un PUNTO DE VENTA');
      document.getElementById('idPuntoVenta').focus();
    }

    if (this.formulario.get('numero').value > 0) {
      this.cambioTabla(1);
    }
  }
  //Establece Letra
  public establecerCabecera() {
    this.afipComprobanteService.obtenerLetra(3, this.formulario.get('cliente').value.condicionVenta.id).subscribe(
      res => {
        this.formulario.get('letra').setValue(res.text());
        this.establecerCodAfip(res.text());
      }
    );
  }
  //Establece Numero
  public establecerCodAfip(letra) {
    this.afipComprobanteService.obtenerCodigoAfip(3, letra).subscribe(
      res => {
        this.formulario.get('codigoAfip').setValue(res.text());
        this.comprobarCodAfip();
      }
    );
  }
  //Establece Codigo Afip
  public establecerNumero(codigoAfip) {
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res => {
        this.formulario.get('numero').setValue(res.text());
        this.cargarTabla();
      }
    );
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public comprobarCodAfip() {
    let puntoVentaCeros = this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5);
    this.puntoVenta.setValue(puntoVentaCeros);
    if (this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0)
      this.establecerNumero(this.formulario.get('codigoAfip').value);
  }
  //Controla el cambio de estilos al seleccionar un Comprobante de la tabla
  public seleccionarComprobante(indice, comprobante) {
    this.comprobanteSeleccionado = indice;
    this.formularioComprobante.patchValue(comprobante);
    this.subtotalCIVA = this.formularioComprobante.get('importeTotal').value;
    document.getElementById('idMotivo').focus();
  }
  //Controla el cambio de estilos al seleccionar un Comprobante de la tabla
  public seleccionarCuenta(indice, comprobante) {
    this.cuentaSeleccionada = indice;
    this.formularioCuenta.patchValue(comprobante);
    this.subtotalCIVA = this.formularioCuenta.get('importeTotal').value;
    document.getElementById('idMotivo').focus();
  }
  //Elimina una cuenta de la lista (tabla)
  public eliminarCuenta(indice) {
    this.listaCuenta.splice(indice, 1);
    this.calcularImportesCuenta(indice);
  }
  //Agrega el cambio a la lista de Comprobantes
  public modificarComprobante() {
    this.formularioComprobante.get('checked').setValue(true);
    let indice = this.comprobanteSeleccionado;
    var id = "mat-checkbox-" + indice;
    document.getElementById(id).className = "checkBoxSelected";
    this.listaComprobantes[this.comprobanteSeleccionado] = this.formularioComprobante.value;
    this.calcularImportesComprobante(indice);
    this.reestablecerFormularioComprobante();
  }
  //Agrega un item a la Nota de Credito (aplica a la cuenta)
  public modificarCuenta() {
    if (this.cuentaSeleccionada != null) {
      this.listaCuenta[this.cuentaSeleccionada] = this.formularioCuenta.value;
      this.calcularImportesCuenta(this.listaCuenta.length - 1);
      this.reestablecerFormularioCuenta();
    } else {
      this.listaCuenta.push(this.formularioCuenta.value);
      this.calcularImportesCuenta(this.listaCuenta.length - 1);
      this.reestablecerFormularioCuenta();
    }
  }
  //METODO PRINCIPAL - EMITIR NOTA DE CREDITO
  public emitir() {
    this.formulario.get('puntoVenta').setValue(this.formulario.get('puntoVenta').value.puntoVenta);
    if (this.listaComprobantes.length > 0) {
      let listaCompCheckeados = [];
      for (let i = 0; i < this.listaComprobantes.length; i++) {
        if (this.listaComprobantes[i]['checked'] == true)
          listaCompCheckeados.push(this.listaComprobantes[i]);
      }
      this.formulario.get('ventaComprobanteItemNC').setValue(listaCompCheckeados);
      this.formulario.get('afipConcepto').setValue({ id: listaCompCheckeados[0]['itemTipo']['afipConcepto']['id'] });//guardamos el id de afipConcepto del primer item de la tabla
    }
    if (this.listaCuenta.length > 0) {
      this.formulario.get('ventaComprobanteItemNC').setValue(this.listaCuenta);
      this.formulario.get('afipConcepto').setValue({ id: this.listaCuenta[0].itemTipo.afipConcepto.id });//guardamos el id de afipConcepto del primer item de la tabla
    }
    this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.reestablecerFormulario(true);
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
  //Calcula los Importes del pie de la transaccion
  private calcularImportesComprobante(indice) {
    let importeNetoGravado = 0;
    let importeIvaTotal = 0;
    let importeTotal = 0;
    for (let i = 0; i < this.listaComprobantes.length; i++) {
      importeNetoGravado = this.returnDecimales(importeNetoGravado + this.listaComprobantes[i]['subtotalNC'], 2);
    }
    for (let i = 0; i < this.listaComprobantes.length; i++) {
      importeIvaTotal = this.returnDecimales(importeIvaTotal + this.listaComprobantes[i]['importeIva'], 2);
    }
    for (let i = 0; i < this.listaComprobantes.length; i++) {
      importeTotal = this.returnDecimales(importeTotal + this.listaComprobantes[i]['importeTotal'], 2);
    }
    this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(importeNetoGravado, 2));
    this.formulario.get('importeIva').setValue(this.appService.setDecimales(importeIvaTotal, 2));
    this.formulario.get('importeTotal').setValue(this.appService.setDecimales(importeTotal, 2));
  }
  //Calcula los Importes Totales
  private calcularImportesCuenta(indice) {
    let importeNetoGravado = 0;
    let importeIvaTotal = 0;
    let importeTotal = 0;
    for (let i = 0; i < this.listaCuenta.length; i++) {
      importeNetoGravado = this.returnDecimales((importeNetoGravado + this.listaCuenta[i]['subtotalNC']), 2);
    }
    for (let i = 0; i < this.listaCuenta.length; i++) {
      importeIvaTotal = this.returnDecimales((importeIvaTotal + this.listaCuenta[i]['importeIva']), 2);
    }
    for (let i = 0; i < this.listaCuenta.length; i++) {
      importeTotal = this.returnDecimales((importeTotal + this.listaCuenta[i]['importeTotal']), 2);
    }
    this.formulario.get('importeNetoGravado').setValue(this.returnDecimales(importeNetoGravado, 2));
    this.formulario.get('importeIva').setValue(this.returnDecimales(importeIvaTotal, 2));
    this.formulario.get('importeTotal').setValue(this.returnDecimales(importeTotal, 2));
  }
  //Controla los checkbox
  public controlCheckbox($event, comprobante, indice) {
    var id = "mat-checkbox-" + indice;
    if ($event.checked == true) {
      document.getElementById(id).className = "checkBoxSelected";
      this.listaComprobantes[indice]['checked'] = true;
      this.calcularImportesComprobante(indice);
    } else {
      document.getElementById(id).className = "checkBoxNotSelected";
      this.listaComprobantes[indice]['checked'] = false;
      //Resta los Importes, de la Nota de Credito, el valor correspondiente al comprobante descheckeado
      let subtotal = this.listaComprobantes[indice]['subtotalNC'];
      let importeIva = this.listaComprobantes[indice]['importeIva'];
      let importeTotal = this.listaComprobantes[indice]['importeTotal'];
      this.formulario.get('importeIva').setValue(this.formulario.get('importeIva').value - importeIva);
      this.formulario.get('importeTotal').setValue(this.formulario.get('importeTotal').value - importeTotal);
      this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value - subtotal);
    }
  }
  //Calcula el campo SubtotalNC del comprobante que se modifica
  public calcularSubtotalNC() {
    if (this.subtotalCIVA < this.formularioComprobante.get('importeTotal').value) {
      document.getElementById('idSubtotalCIVA').focus();
      this.toastr.error("El SUBTOTAL C/IVA ingresado debe ser MENOR");
    }
    let iva = String(this.formularioComprobante.get('alicuotaIva').value).split('.');
    let ivaDisvisor = "1.";
    for (let i = 0; i < iva.length; i++) {
      ivaDisvisor = ivaDisvisor + iva[i];
    }
    let subtotal = this.returnDecimales(this.formularioComprobante.get('importeTotal').value / Number(ivaDisvisor), 2);
    this.formularioComprobante.get('subtotalNC').setValue(subtotal);
    let importeIva = this.returnDecimales(subtotal * (this.formularioComprobante.get('alicuotaIva').value / 100), 2);
    this.formularioComprobante.get('importeIva').setValue(importeIva);
  }
  //Calcula el campo SubtotalNC del comprobante que se modifica
  public calcularSubtotalNCC() {
    let iva = String(this.formularioCuenta.get('alicuotaIva').value).split('.');
    let ivaDisvisor = "1.";
    for (let i = 0; i < iva.length; i++) {
      ivaDisvisor = ivaDisvisor + iva[i];
    }
    let subtotal = this.returnDecimales(this.formularioCuenta.get('importeTotal').value / Number(ivaDisvisor), 2);
    this.formularioCuenta.get('subtotalNC').setValue(subtotal);
    let importeIva = this.returnDecimales(subtotal * (this.formularioCuenta.get('alicuotaIva').value / 100), 2);
    this.formularioCuenta.get('importeIva').setValue(importeIva);
  }
  //Reestablece el formulario de aplica a Comprobante
  private reestablecerFormularioComprobante() {
    this.comprobanteSeleccionado = null;
    this.formularioComprobante.reset();
    this.listarItemsTipo();
    this.listarAlicuotaIva();
  }
  //Reestablece el formulario de aplica a la Cuenta
  private reestablecerFormularioCuenta() {
    this.cuentaSeleccionada = null;
    this.formularioCuenta.reset();
    this.listarItemsTipo();
    this.listarAlicuotaIva();
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
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
}