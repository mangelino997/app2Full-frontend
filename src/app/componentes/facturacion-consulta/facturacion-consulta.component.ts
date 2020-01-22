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
    'IMPORTE', 'SALDO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
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
    this.formulario = this.formularioFiltroGeneral;
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    // this.seleccionarPestania(1, 'Agregar', true);
    //Establece la empresa 
    this.empresa.setValue(this.appService.getEmpresa());
    //Establece el formControl 
    this.filtroPor.setValue(0);
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
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.ventaComprobanteService.inicializarFacturacionConsulta(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.tiposComprobantes = respuesta.tipoComprobantes;
        this.puntosVenta = respuesta.puntoVentas;
        this.sucursales = respuesta.sucursales;
        this.FECHA_ACTUAL.setValue(respuesta.fechaActual);
        this.render = false;
        this.cambioFiltro();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Controla el cambio en el campo 'Importe Hasta'
  public cambioImporteHasta() {
    if (this.formulario.value.importeDesde) {
      this.setDecimales(this.formulario.get('importeHasta'), 2);
      let importeDesde = Number(this.formulario.value.importeDesde);
      let importeHasta = Number(this.formulario.value.importeHasta);
      if (importeHasta < importeDesde) {
        this.formulario.get('importeHasta').reset();
        this.toastr.warning("Importe hasta debe ser mayor a importe desde.");
        document.getElementById('idImporteHasta').focus();
      }
    } else {
      this.formulario.get('importeHasta').reset();
      this.toastr.warning("Complete el campo importe desde.");
      document.getElementById('idImporteDesde').focus();
    }
  }
  //Controla el cambio en el campo 'Letra'
  public cambioLetra() {
    let letra = this.formulario.get('letra').value;
    this.formulario.get('letra').setValue(letra.toUpperCase());
  }
  //Controla el cambio en el campo de seleccion Tipo de Filtro
  public cambioFiltro() {
    this.listaCompleta.data = [];
    this.formulario.reset();
    switch (this.filtroPor.value) {
      case 0:
        this.formulario = this.formularioFiltroGeneral;
        this.formulario.get('fechaTipo').setValue(1);
        this.formulario.get('cliente').setValue(0);
        this.formulario.get('idTipoComprobante').setValue(0);
        this.formulario.get('idSucursal').setValue(this.sucursales[0].id);
        this.formulario.get('fechaDesde').setValue(this.FECHA_ACTUAL.value);
        this.formulario.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
        break;
      case 1:
        this.formulario = this.formularioFiltroCpte;
        this.formulario.get('idTipoComprobante').setValue(0);
        this.formulario.get('puntoVenta').setValue(this.puntosVenta[0]);
        this.establecerCerosIzq(this.puntosVenta[0], '0000', -5);
        break;
      case 2:
        this.formulario = this.formularioFiltroRangoCptes;
        this.formulario.get('idTipoComprobante').setValue(0);
        this.formulario.get('puntoVenta').setValue(this.puntosVenta[0]);
        this.establecerCerosIzq(this.puntosVenta[0], '0000', -5);
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
    //Establezco los parametros faltantes
    if (this.filtroPor.value == 0) {
      this.formulario.value.cliente != 0 ?
        this.formulario.value.idCliente = this.formulario.value.idCliente.id : this.formulario.value.idCliente = 0;
    }
    //establezco el tipo de filtro para determinar la query en el backend
    this.formulario.value.tipoFiltro = this.filtroPor.value;
    this.ventaComprobanteService.listarPorFiltros(this.formulario.value).subscribe(
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
    if (this.formulario.value.cliente != 0) {
      this.formulario.get('idCliente').setValidators(Validators.required);
      this.formulario.get('idCliente').updateValueAndValidity();//Actualiza la validacion
    } else {
      this.formulario.get('idCliente').setValidators([]);
      this.formulario.get('idCliente').updateValueAndValidity();//Actualiza la validacion
      this.formulario.value.idCliente = null;
    }
  }
  //Controla el campo 'Fecha Hasta' en pestaña Listar
  public controlarFechaHasta() {
    if (this.formulario.value.fechaHasta == null || this.formulario.value.fechaHasta == undefined) {
      this.toastr.error("Debe ingresar una fecha desde.");
      document.getElementById('idFechaDesde').focus();
    } else if (this.formulario.value.fechaHasta < this.formulario.value.fechaDesde) {
      this.toastr.error("Fecha hasta debe ser igual o mayor a fecha desde.");
      this.formulario.get('fechaDesde').setValue(null);
      this.formulario.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
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
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
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
