import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { AnticiposComponent } from './anticipos/anticipos.component';
import { EfectivoComponent } from './efectivo/efectivo.component';
import { ChequesPropiosComponent } from './cheques-propios/cheques-propios.component';
import { ChequesCarteraComponent } from './cheques-cartera/cheques-cartera.component';
import { ChequesElectronicosComponent } from './cheques-electronicos/cheques-electronicos.component';
import { TransferenciaBancariaComponent } from './transferencia-bancaria/transferencia-bancaria.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { OtrasCuentasComponent } from './otras-cuentas/otras-cuentas.component';
import { OtrasMonedasComponent } from './otras-monedas/otras-monedas.component';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';

@Component({
  selector: 'app-orden-pago',
  templateUrl: './orden-pago.component.html',
  styleUrls: ['./orden-pago.component.css']
})
export class OrdenPagoComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de resultados de busqueda de barrio
  public resultadosProveedores: Array<any> = [];
  //Define el formulario
  public formulario:FormGroup;
  //Define el formulario de totales
  public formularioTotales:FormGroup;
  //Define el formulario de integrar
  public formularioIntegrar:FormGroup;
  //Defiene el render
  public render: boolean = false;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el select de medios de pagos
  public medioPago:FormControl = new FormControl();
  //Define los medios de pago
  public mediosPagos:Array<any> = [];
  //Define la lista de medios de pagos seleccionados
  public mediosPagosSeleccionados:Array<any> = [];
  //Define la lista de compras comprobantes
  public comprasComprobantes:Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['CHECK', 'FECHA_EMISION', 'FECHA_VTO_PAGO', 'TIPO', 'PUNTO_VENTA', 
    'LETRA', 'NUMERO', 'SALDO', 'IMPORTE', 'IMPORTE_COBRO'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el constructor de la clase
  constructor(private servicio: OrdenPagoService, private toastr: ToastrService, 
    private loaderService: LoaderService, private appService: AppService, 
    private proveedorServicio: ProveedorService, private modelo: OrdenPago,
    private dialog: MatDialog, private compraComprobanteService: CompraComprobanteService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    //Establece el formulario de totales
    this.formularioTotales = this.modelo.formularioTotales;
    //Establece el formulario integrar
    this.formularioIntegrar = this.modelo.formularioIntegrar;
    //Obtiene los datos de inicializacion desde servicio web
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.proveedorServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosProveedores = response;
            this.loaderService.hide();
          },
          err => {
            this.loaderService.hide();
          });
        }
      }
    });
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece los datos de inicializacion
        this.pestanias = respuesta.pestanias;
        this.mediosPagos = respuesta.mediosPagos;
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    );
  }
  //Obtiene una lista de compras comprobantes por empresa y proveedor
  public listarComprasPorEmpresaYProveedor(): void {
    this.loaderService.show();
    let proveedor = this.formulario.get('proveedor').value;
    let empresa = this.appService.getEmpresa();
    this.compraComprobanteService.listarPorEmpresaYProveedor(empresa.id, proveedor.id).subscribe(
      res => {
        this.comprasComprobantes = res.json();
        this.calcularTotalItemsYTotalDeuda();
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Determina la cantidad de elementos de la tabla y el total de deuda
  private calcularTotalItemsYTotalDeuda(): void {
    this.formularioTotales.get('totalItems').setValue(this.comprasComprobantes.length);
    let deuda = 0;
    this.comprasComprobantes.forEach((elemento) => {
      if(elemento.tipoComprobante.id == 3 || elemento.tipoComprobante.id == 28) {
        deuda -= elemento.importeSaldo;
      } else {
        deuda += elemento.importeSaldo;
      }
    });
    this.formularioTotales.get('deuda').setValue(this.establecerCeros(deuda));
  }
  //Abre el dialogo correspondientes al seleccionar una opcion del campo 'Ingregracion en'
  public determinarIntegracion(): void {
    let elemento = this.medioPago.value.nombre;
    elemento = elemento.toLowerCase();
    elemento = elemento.replace(new RegExp(/\s/g), "");
    elemento = elemento.replace(new RegExp(/[òó]/g), "o");
    switch(elemento) {
      case 'anticipos':
        this.abrirDialogo(AnticiposComponent);
        break;
      case 'efectivo':
        this.abrirDialogo(EfectivoComponent);
        break;
      case 'cheques':
        this.abrirDialogo(ChequesCarteraComponent);
        break;
      case 'chequeselectronicos':
        this.abrirDialogo(ChequesElectronicosComponent);
        break;
      case 'chequespropios':
        this.abrirDialogo(ChequesPropiosComponent);
        break;
      case 'transferenciabancaria':
        this.abrirDialogo(TransferenciaBancariaComponent);
        break;
      case 'documentos':
        this.abrirDialogo(DocumentosComponent);
        break;
      case 'otrascuentas':
        this.abrirDialogo(OtrasCuentasComponent);
        break;
      case 'otrasmonedas':
        this.abrirDialogo(OtrasMonedasComponent);
        break;
    }
  }
  //Abre el dialogo para agregar un cliente eventual
  private abrirDialogo(componente): void {
    this.medioPago.reset();
    const dialogRef = this.dialog.open(componente, {
      width: '50%',
      maxWidth: '95%',
      data: { }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      
    });
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
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Obtiene la lista de registros
  public listar(): void {

  }
  //Agrega un registro
  public agregar(): void {

  }
  //Actualizar un registro
  public actualizar(): void {

  }
  //Elimina un registro
  public eliminar(): void {

  }
  //Mascara un importe decimal
  public mascararImporte(limit, decimalLimite) {
    return this.appService.mascararImporte(limit, decimalLimite);
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCeros(elemento) {
    return this.appService.establecerDecimales(elemento, 2);
  }
  //Define como se muestra los datos con ceros a la izquierda
  public completarCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
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
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
}