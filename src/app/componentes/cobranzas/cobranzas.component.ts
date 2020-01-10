import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { AppService } from 'src/app/servicios/app.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { CobranzaService } from 'src/app/servicios/cobranza.service';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnticiposComponent } from '../tesoreria/anticipos/anticipos.component';
import { EfectivoComponent } from '../tesoreria/efectivo/efectivo.component';
import { ChequesCarteraComponent } from '../tesoreria/cheques-cartera/cheques-cartera.component';
import { ChequesElectronicosComponent } from '../tesoreria/cheques-electronicos/cheques-electronicos.component';
import { ChequesPropiosComponent } from '../tesoreria/cheques-propios/cheques-propios.component';
import { TransferenciaBancariaComponent } from '../tesoreria/transferencia-bancaria/transferencia-bancaria.component';
import { DocumentosComponent } from '../tesoreria/documentos/documentos.component';
import { OtrasCuentasComponent } from '../tesoreria/otras-cuentas/otras-cuentas.component';
import { OtrasMonedasComponent } from '../tesoreria/otras-monedas/otras-monedas.component';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/modelos/loader';
import { Cobranza } from 'src/app/modelos/cobranza';
import { CobranzaMedioPago } from 'src/app/modelos/cobranzaMedioPago';
import { CobranzaItem } from 'src/app/modelos/cobranzaItem';
import { CobranzaMedioPagoService } from 'src/app/servicios/cobranza-medio-pago.service';
import { CobranzaItemComponent } from './cobranza-item/cobranza-item.component';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {
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
  //Define el formulario
  public formulario: FormGroup;
  //Define el formulario de cada venta cpte checkeado de la lista
  public formularioCobranzaItem: FormGroup;
  //Define el select de medios de pagos
  public medioPago: FormControl = new FormControl();
  //Define totalesItems como un formControl
  public totalesItems: FormControl = new FormControl();
  //Define totalDeuda como un formControl
  public totalDeuda: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define los medios de pago
  public mediosPagos: Array<any> = [];
  //Define la lista de medios de pagos seleccionados
  public mediosPagosSeleccionados: Array<any> = [];
  //Define la lista de resultados de busqueda de cliente
  public resultadosClientes: Array<any> = [];
  public columnas: string[] = ['CHECK', 'FECHA_EMISION', 'FECHA_VTO_PAGO', 'TIPO', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'SALDO', 'IMPORTE', 'IMPORTE_COBRO'];
  //Define la lista completa de registro
  public ventasComprobantes = new MatTableDataSource([]);
  //Defiene el render
  public render: boolean = false;
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private toastr: ToastrService, private loaderService: LoaderService,
    private appService: AppService,
    private cobranza: Cobranza, private cobranzaMedioPago: CobranzaMedioPago,
    private cobranzaItem: CobranzaItem,
    private clienteServicio: ClienteService,
    private ventaComprobanteService: VentaComprobanteService, private servicio: CobranzaService,
    private cobranzaMedioPagoService: CobranzaMedioPagoService,
    private dialog: MatDialog) {
    // this.formulario = new FormGroup({
    //   cliente: new FormControl(),
    //   integracion: new FormControl,
    //   pendienteDeIntegrar: new FormControl,
    //   retenciones: new FormControl,
    //   items: new FormControl,
    //   totalImporteSeleccionado: new FormControl,
    //   items2: new FormControl,
    //   totalDeuda: new FormControl,
    //   totalIntegrado: new FormControl
    // })
  }
  //AL inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //inicializa el formulario de Cobranza y sus elementos
    this.formulario = this.cobranza.formulario;
    //inicializa el formulario de Cobranza y sus elementos
    this.formularioCobranzaItem = this.cobranzaItem.formulario;
    //Obtiene los datos de inicializacion desde servicio web
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado Cliente - Buscar por nombre
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteServicio.listarActivosPorAlias(data).subscribe(response => {
            this.resultadosClientes = response.json();
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
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        console.log(respuesta);
        //Establece los datos de inicializacion
        this.pestanias = respuesta.pestanias;
        this.mediosPagos = respuesta.mediosPagos;
        this.establecerValoresPorDefecto();
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    );
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
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idCliente');
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
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err;
    if (respuesta.codigo == 11002) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Controla el cambio en el autocompletado 'Cliente'
  public cambioCliente() {
    this.loaderService.show();
    this.ventasComprobantes.data = [];
    let elemento = this.formulario.value.cliente;
    let empresa = this.appService.getEmpresa();
    console.log(elemento);
    if (!elemento.cuentaGrupo) {
      this.ventaComprobanteService.listarParaCobranza(elemento.id, empresa.id).subscribe(
        res => {
          console.log(res.json());
          this.establecerListaCompleta(res.json());
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.ventaComprobanteService.listarParaCobranza(elemento.cuentaGrupo.id, empresa.id).subscribe(
        res => {
          console.log(res.json());
          this.establecerListaCompleta(res.json());
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Establece los comprobantes a listaCompleta
  private establecerListaCompleta(resultado) {
    this.ventasComprobantes = new MatTableDataSource(resultado);
    this.ventasComprobantes.sort = this.sort;
    if (this.ventasComprobantes.data.length > 0) {
      this.calcularTotalItemsYTotalDeuda();
      this.establecerAtributoChecked();
    } else {
      this.toastr.warning("El Cliente no tiene comprobantes asignados.")
    }
    this.loaderService.hide();
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.resultadosClientes = [];
    // id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Establece valores por defecto al formulario
  private establecerValoresPorDefecto() {
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));

  }
  //Controla el cambio los check-box
  public cambioCheck(elemento, indice, $event) {
    //Si el check esta en 'true' crea una variable boolean para controlarlo en el front
    if ($event.checked) {
      elemento.checked = true;
    }else{
      elemento.checked = false;
      this.abrirDialogo(CobranzaItemComponent);
    }
    // if ($event.checked) {
    //   this.activarActualizarElemento(elemento, indice);
    //   this.formularioVtaCpteItemNC.get('ventaTipoItem').setValue(this.resultadosMotivos[0]);
    //   this.cambioMotivo();
    // } else {
    //   /* elimina el formulario a saldar asignado a dicho comprobante */
    //   this.listaCompleta.data[indice].ventaComprobanteItemNC = [];
    //   this.reestablecerformularioVtaCpteItemNC();
    //   /* llama a calcular importes totales*/
    //   this.listaCompleta.data.length > 0 ? this.calcularImportesTotales() : this.limpiarImportesTotales();
    // }
  }
  //Obtiene la lista de registros
  public listar(): void {

  }
  //Abre el dialogo correspondientes al seleccionar una opcion del campo 'Ingregracion en'
  public determinarIntegracion(): void {
    let elemento = this.medioPago.value.nombre;
    elemento = elemento.toLowerCase();
    elemento = elemento.replace(new RegExp(/\s/g), "");
    elemento = elemento.replace(new RegExp(/[òó]/g), "o");
    switch (elemento) {
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
      width: '95%',
      maxWidth: '95%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {

    });
  }
  //Abre un modal ver los Totales de Carga
  public abrirClienteGrupoDialogo(): void {
    const dialogRef = this.dialog.open(ClienteGrupoDialogo, {
      width: '1200px',
      data: {
        cliente: this.formulario.value.cliente
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Obtiene una lista de compras comprobantes por empresa y cliente
  // public listarComprasPorEmpresaYCliente(): void {
  //   this.loaderService.show();
  //   let cliente = this.formulario.get('cliente').value;
  //   let empresa = this.appService.getEmpresa();
  //   this.ventaComprobanteService.listarParaCobranza(cliente.id, empresa.id).subscribe(
  //     res => {
  //       this.ventasComprobantes = new MatTableDataSource(res.json());
  //       this.ventasComprobantes.sort = this.sort;
  //       this.ventasComprobantes.data.length == 0 ? this.toastr.warning("El Cliente no tiene contactos asignados.") : '';
  //       this.calcularTotalItemsYTotalDeuda();
  //       this.loaderService.hide();
  //     },
  //     err => {
  //       this.loaderService.hide();
  //     }
  //   );
  // }
  //Determina la cantidad de elementos de la tabla y el total de deuda
  private calcularTotalItemsYTotalDeuda(): void {
    let deuda = 0;
    this.ventasComprobantes.data.forEach((elemento) => {
      if (elemento.tipoComprobante.id == 3 || elemento.tipoComprobante.id == 28) {
        deuda -= elemento.importeSaldo;
      } else {
        deuda += elemento.importeSaldo;
      }
    });
    // this.formulario.get('items2').setValue(this.ventasComprobantes.data.length);
    // this.formulario.get('totalDeuda').setValue(this.establecerCeros(deuda));
    this.totalesItems.setValue(this.ventasComprobantes.data.length);
    this.totalDeuda.setValue(this.appService.establecerDecimales(deuda, 2));
  }
  //Establece atributo 'checked' a cada registro de la lista
  private establecerAtributoChecked(){
    for(let i = 0; i < this.ventasComprobantes.data.length; i++){
      this.ventasComprobantes.data[i].checked = false;
    }
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
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCeros(elemento) {
    return this.appService.establecerDecimales(elemento, 2);
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appService.establecerDecimales(elemento, 2);
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Define como se muestra los datos con ceros a la izquierda
  public completarCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
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
  // Maneja los evento al presionar una tecla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        // this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        // this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
}

@Component({
  selector: 'cliente-grupo-dialogo',
  templateUrl: 'cliente-grupo-dialogo.html',
})
export class ClienteGrupoDialogo implements OnInit {

  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Tramos
  public listaTramos: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'BULTOS', 'KILOS_EFECTIVO', 'KILOS_AFORADO', 'M3', 'VALOR_DECLARADO'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<ClienteGrupoDialogo>, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.listaCompleta.data = this.data.items;
    this.listaCompleta.sort = this.sort;

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}