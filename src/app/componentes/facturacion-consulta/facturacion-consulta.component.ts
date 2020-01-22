import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { LoaderState } from 'src/app/modelos/loader';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';

@Component({
  selector: 'app-facturacion-consulta',
  templateUrl: './facturacion-consulta.component.html',
  styleUrls: ['./facturacion-consulta.component.css']
})
export class FacturacionConsultaComponent implements OnInit {

  //Define la fecha actual
  public FECHA_ACTUAL: FormControl = new FormControl();
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario 
  public formulario: FormGroup;
  //Define un formularioFiltroGeneral 
  public formularioFiltroGeneral: FormGroup;
  //Define un formulario para filtrar por comprobante
  public formularioFiltroCpte: FormGroup;
  //Define un formulario para filtrar por rango de comprobantes
  public formularioFiltroRangoCptes: FormGroup;
  //Define un formulario para filtrar por importes
  public formularioFiltroImportes: FormGroup;
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de puntos de venta
  public puntosVenta: Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Defien la empresa 
  public empresa: FormControl = new FormControl();
  //Defien el tipo de filtro 
  public filtroPor: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla para la pestaña Listar
  public columnas: string[] = ['EMPRESA', 'SUCURSAL', 'CLIENTE', 'TIPO_CPTE', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'FECHA_EMISION',
    'FECHA_VTO_PAGO', 'FECHA_REGISTRACION', 'IMPORTE', 'SALDO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private fechaService: FechaService, private appService: AppService,
    private toastr: ToastrService, private loaderService: LoaderService,
    private tipoComprobanteService: TipoComprobanteService, private clienteService: ClienteService,
    private ventaComprobanteService: VentaComprobanteService, public dialog: MatDialog,
    private reporteServicio: ReporteService, private sucursalService: SucursalService,
    private puntoVentaService: PuntoVentaService) {
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formularioFiltroGeneral y validaciones
    this.formularioFiltroGeneral = new FormGroup({
      idSucursal: new FormControl('', Validators.required),
      cliente: new FormControl('', Validators.required),
      idCliente: new FormControl(),
      fechaTipo: new FormControl('', Validators.required),
      fechaDesde: new FormControl('', Validators.required),
      fechaHasta: new FormControl('', Validators.required),
      idTipoComprobante: new FormControl('', Validators.required),
    })
    //Define el formularioFiltroComprobante
    this.formularioFiltroCpte = new FormGroup({
      idTipoComprobante: new FormControl('', Validators.required),
      puntoVenta: new FormControl('', Validators.required),
      letra: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
    })
    //Define el formularioFiltroComprobante
    this.formularioFiltroRangoCptes = new FormGroup({
      idTipoComprobante: new FormControl('', Validators.required),
      puntoVenta: new FormControl('', Validators.required),
      letra: new FormControl('', Validators.required),
      numeroDesde: new FormControl('', Validators.required),
      numeroHasta: new FormControl('', Validators.required),
    })
    //Define el formularioFiltroComprobante
    this.formularioFiltroImportes = new FormGroup({
      fechaDesde: new FormControl('', Validators.required),
      fechaHasta: new FormControl('', Validators.required),
      importeDesde: new FormControl('', Validators.required),
      importeHasta: new FormControl('', Validators.required),
    })
    //Establece los valores de la primera pestania activa
    // this.seleccionarPestania(1, 'Agregar', true);
    //Obtiene la lista de tipos de comprobantes
    this.listarTipoComprobante();
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Obtiene la lista de puntos de venta
    this.listarPuntosVenta();
    //Establece valores por defecto
    this.incializarFormulario();
    //Autocompletado Proveedor- Buscar por alias
    this.formularioFiltroGeneral.get('idCliente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteService.listarPorAlias(data).subscribe(response => {
            this.resultados = response.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Establece valores por defecto
  public incializarFormulario() {
    //Establece el formControl 
    this.filtroPor.setValue(0);
    //Establece las validaciones del formulario
    this.formulario = this.formularioFiltroGeneral;
    //Establece el tipo de fecha
    this.formulario.get('fechaTipo').setValue(1);
    //Establece el campos de selección Cliente
    this.formulario.get('cliente').setValue(0);
    //Establece el tipo de comprobante
    this.formulario.get('idTipoComprobante').setValue(0);
    //Obtiene la Fecha Actual
    this.obtenerFecha();
    //Establece la empresa 
    this.empresa.setValue(this.appService.getEmpresa());
  }
  //Carga la Fecha Actual en el campo "Fecha Contable"
  private obtenerFecha() {
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.FECHA_ACTUAL.setValue(res.json());
        this.formulario.get('fechaDesde').setValue(this.FECHA_ACTUAL.value);
        this.formulario.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
      },
      err => {
        this.toastr.error("Error al obtener la Fecha Actual.");
      }
    )
  }
  //Carga la lista de sucursales
  private listarSucursales() {
    this.sucursalService.listar().subscribe(
      res => {
        console.log(res.json());
        this.sucursales = res.json();
        this.formulario.get('idSucursal').setValue(this.sucursales[0].id);
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Carga la lista de puntos de venta
  private listarPuntosVenta() {
    this.puntoVentaService.listarPorEmpresa(this.appService.getEmpresa().id).subscribe(
      res => {
        console.log(res.json());
        this.puntosVenta = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Carga la lista de tipos de comprobantes
  private listarTipoComprobante() {
    this.tipoComprobanteService.listarEstaActivoVentaCargaTrue().subscribe(
      res => {
        this.tiposComprobantes = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Tipos de Comprobantes.");
      }
    )
  }
  //Controla el cambio en el campo de seleccion Tipo de Filtro
  public cambioFiltro() {
    switch (this.filtroPor.value) {
      case 0:
        this.formulario = this.formularioFiltroGeneral;
        this.formulario.get('fechaDesde').setValue(this.FECHA_ACTUAL.value);
        this.formulario.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
        break;
      case 1:
        this.formulario = this.formularioFiltroCpte;
        break;
      case 2:
        this.formulario = this.formularioFiltroRangoCptes;
        break;
      case 3:
        this.formulario = this.formularioFiltroImportes;
        this.formulario.get('fechaDesde').setValue(this.FECHA_ACTUAL.value);
        this.formulario.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
        break;
      default:
        this.formulario = this.formularioFiltroGeneral;
        break;
    }
  }
  //Carga la tabla de la pestaña listar con registros de acuerdo a la lista que tiene que cargar --> listaCompleta / listaCompletaModal
  public listar() {
    this.loaderService.show();
    //Establezco los parametros
    this.formularioFiltroGeneral.value.cliente != 0 ?
      this.formularioFiltroGeneral.value.idCliente = this.formularioFiltroGeneral.value.idCliente.id : this.formularioFiltroGeneral.value.idCliente = 0;
    this.ventaComprobanteService.listarPorFiltros(this.formularioFiltroGeneral.value).subscribe(
      res => {
        let resultado = res.json();
        this.listaCompleta = new MatTableDataSource(resultado);
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        resultado.length == 0 ? this.toastr.warning("Sin datos para mostrar.") : '';
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }

  //Controla el cambio en el campo de selección 'Cliente'
  public cambioCliente() {
    if (this.formularioFiltroGeneral.value.cliente != 0) {
      this.formularioFiltroGeneral.get('idCliente').setValidators(Validators.required);
      this.formularioFiltroGeneral.get('idCliente').updateValueAndValidity();//Actualiza la validacion
    } else {
      this.formularioFiltroGeneral.get('idCliente').setValidators([]);
      this.formularioFiltroGeneral.get('idCliente').updateValueAndValidity();//Actualiza la validacion
      this.formularioFiltroGeneral.value.idCliente = null;
    }
  }
  //Controla el campo 'Fecha Hasta' en pestaña Listar
  public controlarFechaHasta() {
    if (this.formularioFiltroGeneral.value.fechaHasta == null || this.formularioFiltroGeneral.value.fechaHasta == undefined) {
      this.toastr.error("Debe ingresar una fecha desde.");
      document.getElementById('idFechaDesde').focus();
    } else if (this.formularioFiltroGeneral.value.fechaHasta < this.formularioFiltroGeneral.value.fechaDesde) {
      this.toastr.error("Fecha hasta debe ser igual o mayor a fecha desde.");
      this.formularioFiltroGeneral.get('fechaDesde').setValue(null);
      this.formularioFiltroGeneral.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
      document.getElementById('idFechaDesde').focus();
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Imprime la cantidad de ceros correspondientes a la izquierda del numero 
  public establecerCerosIzqEnVista(elemento, string, cantidad) {
    if (elemento) { return elemento = ((string + elemento).slice(cantidad)); }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a === b;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento.nombre;
    } else {
      return elemento;
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    ['EMPRESA', 'SUCURSAL', 'CLIENTE', 'TIPO_CPTE', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'FECHA_EMISION',
      'FECHA_VTO_PAGO', 'FECHA_REGISTRACION', 'IMPORTE', 'SALDO', 'EDITAR'];
    lista.forEach(elemento => {
      let f = {
        empresa: elemento.empresa.razonSocial,
        sucursal: elemento.sucursal.nombre,
        cliente: elemento.cliente.alias,
        tipo_cpte: elemento.tipoComprobante.nombre,
        punto_venta: this.establecerCerosIzqEnVista(elemento.puntoVenta, '0000', -5),
        letra: elemento.letra,
        numero: this.establecerCerosIzqEnVista(elemento.numero, '0000000', -8),
        fecha_emision: elemento.fechaEmision,
        fecha_vto_pago: elemento.fechaVtoPago,
        fecha_registracion: elemento.fechaRegistracion,
        importe: '$' + elemento.importeTotal,
        saldo: '$' + elemento.importeSaldo
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Comprobantes de Ventas',
      empresa: this.empresa.value.razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  // public manejarEvento(keycode) {
  //   var indice = this.indiceSeleccionado;
  //   if (keycode == 113) {
  //     if (indice < this.pestanias.length) {
  //       this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, true);
  //     } else {
  //       this.seleccionarPestania(1, this.pestanias[0].nombre, true);
  //     }
  //   }
  // }
}
