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
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { PagoAnticiposComponent } from './pago-anticipos/pago-anticipos.component';
import { PagoEfectivoComponent } from './pago-efectivo/pago-efectivo.component';
import { PagoChequesCarteraComponent } from './pago-cheques-cartera/pago-cheques-cartera.component';
import { PagoChequesElectronicosComponent } from './pago-cheques-electronicos/pago-cheques-electronicos.component';
import { PagoChequesPropiosComponent } from './pago-cheques-propios/pago-cheques-propios.component';
import { PagoTransferenciaBancariaComponent } from './pago-transferencia-bancaria/pago-transferencia-bancaria.component';
import { PagoDocumentosComponent } from './pago-documentos/pago-documentos.component';
import { PagoOtrasCuentasComponent } from './pago-otras-cuentas/pago-otras-cuentas.component';
import { PagoOtrasMonedasComponent } from './pago-otras-monedas/pago-otras-monedas.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { ContactoCliente } from 'src/app/modelos/contactoCliente';

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
  //Define la lista de resultados de busqueda de barrio
  public resultadosProveedores: Array<any> = [];
  //Define el formulario
  public formulario:FormGroup;
  //Define el formulario de totales
  public formularioTotales:FormGroup;
  //Define el formulario de integrar
  public formularioIntegrar:FormGroup;
  //Define el formulario de medios de pagos
  public formularioMedioPago:FormGroup;
  //Define un formulario para guardar el contenido que se establece en cada dialogo
  public formularioDialogo:FormGroup;
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
  public comprasComprobantes= new MatTableDataSource ([]);
  //Define la lista de compras comprobantes seleccionados
  public comprasComprobantesSeleccionados = new SelectionModel<any>(true, []);
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
    //Establece el formulario de los medios pago seleccionados
    this.formularioMedioPago = this.modelo.formularioMedioPago;
    //Establece el formulario dialogo que contiene los datos de cada dialogo
    this.formularioDialogo = this.modelo.formularioDialogo;
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
  //El numero de elemento seleccionados es igual al numero total de filas (Tabla de Compras Comprobantes)
  public estanTodosSeleccionados(): boolean {
    let numSeleccionado = this.comprasComprobantesSeleccionados.selected.length;
    let numFilas = this.comprasComprobantes.data.length;
    return numSeleccionado === numFilas;
  }
  //Selecciona todos los elementos si no hay ninguno seleccionado, caso contrario, limpia todas las selecciones
  public alternarSeleccion(): void {
    this.estanTodosSeleccionados() ?
        this.comprasComprobantesSeleccionados.clear() :
        this.comprasComprobantes.data.forEach(row => this.comprasComprobantesSeleccionados.select(row));
    //Establece el total de items seleccionados e importe total seleccionado
    this.calcularTotalItemsEImporteTotalSeleccionado();
    //Calcula importe Pendiente de Integrar
    this.formularioIntegrar.get('pendienteIntegrar').setValue(this.calcularPendienteIntegrar());
  }
  //Retorna la etiqueta de seleccionada o no
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.estanTodosSeleccionados() ? 'select' : 'deselect'} all`;
    }
    return `${this.comprasComprobantesSeleccionados.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  //Al seleccionar un checkbox
  public seleccionarCheckbox(row): void {
    this.comprasComprobantesSeleccionados.toggle(row);
    //Establece el total de items seleccionados e importe total seleccionado
    this.calcularTotalItemsEImporteTotalSeleccionado();
    //Calcula importe Pendiente de Integrar
    this.formularioIntegrar.get('pendienteIntegrar').setValue(this.calcularPendienteIntegrar());;
  }
  //Obtiene una lista de compras comprobantes por empresa y proveedor
  public listarComprasPorEmpresaYProveedor(): void {
    this.loaderService.show();
    let proveedor = this.formulario.get('proveedor').value;
    let empresa = this.appService.getEmpresa();
    this.compraComprobanteService.listarPorEmpresaYProveedor(empresa.id, proveedor.id).subscribe(
      res => {
        this.comprasComprobantes = new MatTableDataSource(res.json());
        this.comprasComprobantes.sort = this.sort;
        this.comprasComprobantes.data.length == 0 ? this.toastr.warning("El proveedor no tiene contactos asignados.") : '';
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
    this.formularioTotales.get('totalItems').setValue(this.comprasComprobantes.data.length);
    let deuda = 0;
    this.comprasComprobantes.data.forEach((elemento) => {
      if(elemento.tipoComprobante.id == 3 || elemento.tipoComprobante.id == 28) {
        deuda -= elemento.importeSaldo;
      } else {
        deuda += elemento.importeSaldo;
      }
    });
    this.formularioTotales.get('deuda').setValue(this.establecerCeros(deuda));
  }
  //Calcula el importe total seleccionado
  public calcularTotalItemsEImporteTotalSeleccionado(): void {
    this.formularioTotales.get('itemsImporte').setValue(this.comprasComprobantesSeleccionados.selected.length);
    let deuda = 0;
    this.comprasComprobantesSeleccionados.selected.forEach((elemento) => {
      if(elemento.tipoComprobante.id == 3 || elemento.tipoComprobante.id == 28) {
        deuda -= elemento.importeSaldo;
      } else {
        deuda += elemento.importeSaldo;
      }
    });
    this.formularioTotales.get('importe').setValue(this.establecerCeros(deuda == 0 ? '0' : deuda));
  }
  //Abre el dialogo correspondientes al seleccionar una opcion del campo 'Ingregracion en'
  public determinarIntegracion(elemento): void {
    elemento = elemento.toLowerCase();
    elemento = elemento.replace(new RegExp(/\s/g), "");
    elemento = elemento.replace(new RegExp(/[òó]/g), "o");
    switch(elemento) {
      case 'anticipos':
        if(this.formulario.get('proveedor').value) {
          this.abrirDialogo(PagoAnticiposComponent, this.formularioDialogo.get('anticipos'));
        } else {
          this.medioPago.reset();
          this.toastr.error(MensajeExcepcion.SELECCIONAR_PROVEEDOR);
        }
        break;
      case 'efectivo':
        this.abrirDialogo(PagoEfectivoComponent, this.formularioDialogo.get('efectivo'));
        break;
      case 'cheques':
        this.abrirDialogo(PagoChequesCarteraComponent, 2);
        break;
      case 'chequeselectronicos':
        this.abrirDialogo(PagoChequesElectronicosComponent, 2);
        break;
      case 'chequespropios':
        this.abrirDialogo(PagoChequesPropiosComponent, 2);
        break;
      case 'transferenciabancaria':
        this.abrirDialogo(PagoTransferenciaBancariaComponent, 2);
        break;
      case 'documentos':
        this.abrirDialogo(PagoDocumentosComponent, 2);
        break;
      case 'otrascuentas':
        this.abrirDialogo(PagoOtrasCuentasComponent, 2);
        break;
      case 'otrasmonedas':
        this.abrirDialogo(PagoOtrasMonedasComponent, 2);
        break;
    }
  }
  //Abre el dialogo para agregar un cliente eventual
  private abrirDialogo(componente, formularioDialogo): void {
    this.medioPago.reset();
    const dialogRef = this.dialog.open(componente, {
      width: '60%',
      maxWidth: '95%',
      data: { 
        idProveedor: this.formulario.get('proveedor').value.id,
        elemento: formularioDialogo
      }
    });
    dialogRef.afterClosed().subscribe(elemento => {
      //Si el importe establecido en el dialogo es diferente de cero, agrega el medio de pago a la lista
      if(elemento.formulario.importe != 0 && elemento.formulario.importe != '0.00') {
        //Verifica si en la lista de medios de pagos seleccionados ya esta cargado el medio de pago actual
        let objeto = elemento.indice != -1 ? this.mediosPagosSeleccionados[elemento.indice] : null;
        if(objeto) {
          //El medio de pago ya existe, entonces hay que reemplazar por los nuevos valores
          this.mediosPagosSeleccionados[elemento.indice] = elemento.formulario;
        } else {
          //Se crea el nuevo medio de pago en la lista
          this.mediosPagosSeleccionados.push(elemento.formulario);
          let indice = this.mediosPagosSeleccionados.indexOf(elemento.formulario);
          //Establece el indice para proximas aperturas del dialogo
          elemento.indice = indice;
          //Almacena los datos establecidos en el dialogo actual
          formularioDialogo.setValue(elemento);
        }
        //Calcula importe Pendiente de Integrar
        this.formularioIntegrar.get('pendienteIntegrar').setValue(this.calcularPendienteIntegrar());
      } else {
        if(elemento.indice != null && elemento.total == 0) {
          this.eliminarItemLista(elemento.indice);
        }
      }
    });
  }
  //Calcula el importe total de la lista de medios de pago
  private calcularImporteMediosPagos(): number {
    let importe = 0;
    this.mediosPagosSeleccionados.forEach((elemento) => {
      importe += Number(elemento.importe);
    });
    return importe;
  }
  //Calcula importe Pendiente de Integrar
  private calcularPendienteIntegrar(): number {
    let importeTotal = this.calcularImporteMediosPagos();
    return this.establecerCeros(this.formularioTotales.get('importe').value - importeTotal);
  }
  //Elimina un item de la lista de medios de pagos
  public eliminarItemLista(indice): void {
    this.mediosPagosSeleccionados.splice(indice, 1);
    //Calcula importe Pendiente de Integrar
    this.formularioIntegrar.get('pendienteIntegrar').setValue(this.calcularPendienteIntegrar());
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
  public mascararImporte(limite, decimalLimite) {
    return this.appService.mascararImporte(limite, decimalLimite);
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