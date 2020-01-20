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
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { LoaderState } from 'src/app/modelos/loader';

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
  //Define un formulario para la pestaña Listar y  sus validaciones de campos
  public formularioFiltro: FormGroup;
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Defien la empresa 
  public empresa: FormControl = new FormControl();
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
    private compraComprobanteService: CompraComprobanteService, public dialog: MatDialog,
    private condicionCompraService: CondicionCompraService, private reporteServicio: ReporteService) {
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formularioFiltro y validaciones
    this.formularioFiltro = new FormGroup({
      empresa: new FormControl('', Validators.required),
      cliente: new FormControl('', Validators.required),
      nombre: new FormControl(),
      fechaTipo: new FormControl('', Validators.required),
      fechaDesde: new FormControl('', Validators.required),
      fechaHasta: new FormControl('', Validators.required),
      tipoComprobante: new FormControl('', Validators.required)
    });
    //Establece la empresa
    this.empresa.setValue(this.appService.getEmpresa());
    //Establece los valores de la primera pestania activa
    // this.seleccionarPestania(1, 'Agregar', true);
    //Obtiene la fecha Actual
    this.obtenerFecha();
    //Obtiene la lista de tipos de comprobantes
    this.listarTipoComprobante();
    //Autocompletado Proveedor- Buscar por alias
    this.formularioFiltro.get('nombre').valueChanges.subscribe(data => {
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
  //Carga la Fecha Actual en el campo "Fecha Contable"
  private obtenerFecha() {
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.FECHA_ACTUAL.setValue(res.json());
      },
      err => {
        this.toastr.error("Error al obtener la Fecha Actual.");
      }
    )
  }
  //Carga la lista de tipos de comprobantes
  private listarTipoComprobante() {
    this.tipoComprobanteService.listarEstaActivoVentaCargaTrue().subscribe(
      res => {
        console.log(res.json());
        this.tiposComprobantes = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Tipos de Comprobantes.");
      }
    )
  }
  //Carga la tabla de la pestaña listar con registros de acuerdo a la lista que tiene que cargar --> listaCompleta / listaCompletaModal
  public listar() {
    this.loaderService.show();
    //Establezco los parametros
    let idProveedor = null;
    this.formularioFiltro.value.proveedor != 0 ?
      idProveedor = this.formularioFiltro.value.nombre.id : idProveedor = 0;
    this.compraComprobanteService.listarPorFiltros(this.formularioFiltro.value.empresa, idProveedor, this.formularioFiltro.value.fechaTipo,
      this.formularioFiltro.value.fechaDesde, this.formularioFiltro.value.fechaHasta, this.formularioFiltro.value.tipoComprobante).subscribe(
        res => {
          let resultado = res.json();
          if (resultado.length != 0) {
            this.listaCompleta = new MatTableDataSource(resultado);
            this.listaCompleta.sort = this.sort;
            this.listaCompleta.paginator = this.paginator;
          } else {
            this.toastr.warning("Sin datos para mostrar.");
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
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
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }

}
