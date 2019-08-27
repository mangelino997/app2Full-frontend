import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { FacturaDebitoCredito } from 'src/app/modelos/facturaDebitoCredito';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { LoaderState } from 'src/app/modelos/loader';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { CompraComprobanteItem } from 'src/app/modelos/compra-comprobante-item';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { DepositoInsumoProductoService } from 'src/app/servicios/deposito-insumo-producto.service';

@Component({
  selector: 'app-factura-debito-credito',
  templateUrl: './factura-debito-credito.component.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class FacturaDebitoCreditoComponent implements OnInit {
//Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define una de las condiciones para el boton de la pestaña (cuando "importe"/"deduccionGeneral" no es nulos)
  public condicion: boolean = false;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la pestaña Listar y  sus validaciones de campos
  public formularioListar: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define los formControl para los datos del cliente
  public domicilio: FormControl = new FormControl();
  public localidad: FormControl = new FormControl();
  public condicionIVA: FormControl = new FormControl();
  public tipoProveedor: FormControl = new FormControl();
  //Define la fecha actual
  public FECHA_ACTUAL: FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Define la lista de Años Fiscales
  public anioFiscal: Array<any> = [];
  //Define la lista de Meses
  public meses: Array<any> = [];
  //Define la lista de Deduccion General
  public alicuotasGanancia: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'producto', 'deposito', 'cantidad', 'precioUnitario', 'importeNetoGravado', 'alicuotaIva', 'IVA',
   'importeNoGravado', 'importeExento', 'impuestoInterno', 'importeITC', 'cuentaContable', 'eliminar'];

  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private fechaService: FechaService, private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService, 
    private servicio: CondicionCompraService, private modelo: FacturaDebitoCredito, private subopcionPestaniaService: SubopcionPestaniaService,
    private tipoComprobanteService: TipoComprobanteService, private afipComprobanteService: AfipComprobanteService, 
    private proveedorService: ProveedorService, private compraComprobanteService: CompraComprobanteService, public dialog: MatDialog) {
      //Obtiene la lista de pestanias
      this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
          console.log(err);
        }
      );
     }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la fecha Actual
    this.obtenerFecha();
    //Obtiene la lista de tipos de comprobantes
    this.listarTipoComprobante();
    //Autocompletado Proveedor- Buscar por alias
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorService.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
        })
      }
    })
  }
  //Carga la Fecha Actual en el campo "Fecha Contable"
  private obtenerFecha(){
    this.fechaService.obtenerFecha().subscribe(
      res=>{
        this.FECHA_ACTUAL.setValue(res.json());
        this.formulario.get('fechaContable').setValue(res.json());
      },
      err=>{
        this.toastr.error("Error al obtener la Fecha Actual");
      }
    )
  }
  //Carga la lista de tipos de comprobantes
  private listarTipoComprobante(){
    this.tipoComprobanteService.listar().subscribe(
      res=>{
        this.tiposComprobantes = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de Tipos de Comprobantes");
      }
    )
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.formulario.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.resultados = [];
    if (opcion == 0) {
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idAutocompletado');
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
        break;
      case 4:
        break;
      default:
        this.listar();
        break;
    }
  }
  //Carga la tabla
  public listar(){
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Metodo Agregar 
  public agregar() {
    this.loaderService.show();    
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.resultados = [];
    this.obtenerFecha();
    setTimeout(function () {
      document.getElementById('idProveedor').focus();
    }, 20);
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11002) {
      document.getElementById("labelProveedor").classList.add('label-error');
      document.getElementById("idProveedor").classList.add('is-invalid');
      document.getElementById("idProveedor").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Establece los valores segun el proveedor seleccionado
  public establecerValores(elemento){
    let localidad = elemento.localidad.nombre + ',' + elemento.localidad.provincia.nombre
    this.domicilio.setValue(elemento.domicilio);
    this.localidad.setValue(localidad);
    this.condicionIVA.setValue(elemento.afipCondicionIva.nombre);
    this.tipoProveedor.setValue(elemento.tipoProveedor.nombre);

  } 
  //Controla el cambio en el campo "Codigo Afip"
  public cambioCodigoAfip(){
    let codigoAfip = this.formulario.get('codigoAfip').value;
    if(codigoAfip && codigoAfip.length == 3){
      this.afipComprobanteService.obtenerPorCodigoAfip(codigoAfip).subscribe(
        res=>{
          let respuesta = res.json();
          this.formulario.get('tipoComprobante').setValue(respuesta.tipoComprobante);
          this.formulario.get('letra').setValue(respuesta.letra);
        },
        err=>{
          let error = err.json();
          this.formulario.get('codigoAfip').setValue(null);
          this.formulario.get('tipoComprobante').setValue(null);
          this.formulario.get('letra').setValue(null);
          this.toastr.error(error.mensaje);
        }
      )
    }
    if(codigoAfip == null || codigoAfip == undefined){
      this.formulario.get('codigoAfip').setValue(null);
      this.formulario.get('tipoComprobante').setValue(null);
      this.formulario.get('letra').setValue(null);
      this.toastr.error("El campo Código Afip está vacío.");
    }
    if(codigoAfip.length < 3){
      this.formulario.get('codigoAfip').setValue(null);
      this.formulario.get('tipoComprobante').setValue(null);
      this.formulario.get('letra').setValue(null);
      this.toastr.error("El campo Código Afip debe tener 3 dígitos como mínimo.");
    }
  }
  //Controla el cambio en el campo "Número"
  public verificarComprobante(){
    let idProveedor = this.formulario.value.proveedor.id;
    let codigoAfip = this.formulario.value.codigoAfip;
    let puntoVenta = this.formulario.value.puntoVenta;
    let numero = this.formulario.value.numero;
    if(numero){
      this.establecerCerosIzq(this.formulario.get('numero'), '0000000', -8);
      if(idProveedor && codigoAfip && puntoVenta){
        this.compraComprobanteService.verificarUnicidadComprobante(idProveedor, codigoAfip, puntoVenta, numero).subscribe(
          res=>{
            console.log(res.json());
            let respuesta = res.json();
          },
          err=>{
            let error = err.json();
            this.toastr.error(error.mensaje);
          }
        )
      }else{
        this.toastr.error("No se puede verificar unicidad del comprobante, campos vacíos en 'Proveedor', 'Codigo Afip', 'Punto Venta' o 'Número'.");
      }
    }
  }
  //Controla la 'Fecha Contable'
  public verificarFechaContable(){
    let fechaEmision = this.formulario.value.fechaEmision;
    let fechaContable = this.formulario.value.fechaContable;
    if(fechaEmision == null || fechaEmision == undefined){
      this.toastr.error("Debe ingresar una fecha de emisión.");
      setTimeout(function () {
        document.getElementById('idFechaEmision').focus();
      }, 20);
    }else if(fechaContable < fechaEmision){
      this.toastr.error("Fecha contable debe ser igual o mayor a la fecha de emisión.");
      this.formulario.get('fechaEmision').setValue(null);
      this.formulario.get('fechaContable').setValue(this.FECHA_ACTUAL.value);
      setTimeout(function () {
        document.getElementById('idFechaEmision').focus();
      }, 20);
    }
  }
  //Controla el cambio en el campo "Fecha de Emision"
  public cambioFechaEmision(){
    let fechaEmision = null;
    let fechaContable = null;
    fechaEmision = this.formulario.get('fechaEmision').value;
    fechaContable = this.formulario.get('fechaContable').value;
    if(fechaEmision > fechaContable){
      this.toastr.error("Fecha de emisión debe ser igual o mayor a la fecha contable.");
      this.formulario.get('fechaEmision').setValue(null);
      setTimeout(function () {
        document.getElementById('idFechaContable').focus();
      }, 20);
    }
  }
  //Controla el cambio en el campo "Tipo de Comprobante"
  public cambioTipoComprobante(){
    let tipoComprobante = null;
    let letra = null;
    tipoComprobante = this.formulario.get('tipoComprobante').value;
    letra = this.formulario.get('letra').value;
    if(tipoComprobante && letra){
      this.afipComprobanteService.obtenerCodigoAfip(tipoComprobante.id, letra).subscribe(
        res=>{
          console.log(res.text());
          let respuesta = res.text();
          if(respuesta != null){
            this.formulario.get('codigoAfip').setValue(respuesta);
            this.cambioCodigoAfip();
          }else{
            this.formulario.get('codigoAfip').setValue(null);
          }
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      )
    }
    if(tipoComprobante == null || tipoComprobante == undefined || letra == null || letra == undefined){
      this.toastr.error("No se puede obtener el Código de Afip, campos vacíos en 'Tipo de Comprobante' o 'Letra'.");
    }
  }
  //Controla el cambio en el campo "Letra"
  public cambioLetra(){
    let tipoComprobante = this.formulario.value.tipoComprobante;
    let letra = this.formulario.value.letra;

    if(tipoComprobante && letra){
      this.afipComprobanteService.obtenerCodigoAfip(tipoComprobante.id, letra).subscribe(
        res=>{
          console.log(res.json());
          let respuesta = res.json();
          if(respuesta != null)
          this.formulario.get('codigoAfip').setValue(respuesta.codigoAfip);
            else
            this.formulario.get('codigoAfip').setValue(null);
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      )
    }else{
      this.toastr.error("No se puede obtener el Código de Afip porque hay campos vacíos en 'Tipo de Comprobante' o 'Letra'.");
    }
  }
  //Abre modal para agregar los items
  public agregarItemDialogo() {
    const dialogRef = this.dialog.open(AgregarItemDialogo, {
      width: '1100px',
      data: {

      },
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(function () {
        document.getElementById('idActualizacion').focus();
      }, 20);
    });
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
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
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if(valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
      this.condicion = true;
    }else{
      this.condicion = false;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if(elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  } 
}

//Componente Confirmar
@Component({
  selector: 'agregar-item-dialogo',
  templateUrl: 'agregar-item-dialogo.html',
})
export class AgregarItemDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de items 
  public listaItem: Array<any> = [];
  //Define la lista de resultados de busqueda para insumoProducto
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda pata deposito
  public tiposDepositos: Array<any> = [];
  //Define el campo Unidad de Medida como FormControl
  public unidadMedida: FormControl = new FormControl();
  //Define el campo Neto ITC como FormControl
  public netoITC: FormControl = new FormControl();
  //Define el campo Neto No Gravado como FormControl
  public netoNoGravado: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<AgregarItemDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobanteItem, private insumoProductoService: InsumoProductoService,
    private appService: AppService, private depositoInsumoProductoService: DepositoInsumoProductoService ) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    //Obtiene la lista de Depositos
    this.listarDepositos();
    //Inicializa los valores por defecto
    this.establecerValoresPorDefecto();
    //Autocompletado InsumoProducto- Buscar por alias
    this.formulario.get('insumoProducto').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.insumoProductoService.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
        })
      }
    })
  }
  public listarDepositos(){
    this.insumoProductoService.listar().subscribe(
      res=>{
        this.tiposDepositos = res.json();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    )
  }
  //Inicializa valores por defecto
  private establecerValoresPorDefecto(){
    this.formulario.get('cantidad').setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('precioUnitario').setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0', 2));
    this.netoNoGravado.setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('importeITC').setValue(this.appService.establecerDecimales('0', 2));
    this.netoITC.setValue(this.appService.establecerDecimales('0', 2));
  }
  //Establece valores por el insumoProducto seleccionado
  public establecerValores(){
    let insumoProducto = null;
    insumoProducto = this.formulario.get('insumoProducto').value;
    if(insumoProducto){
      this.unidadMedida.setValue(insumoProducto.unidadMedida.nombre);
    }
  }
  //Agregar item
  public agregar() {
    
  }
  //Actualizar item
  public actualizar() {

  }
  //Eliminar un item
  public eliminar() {

  }
  //Setea en el formulario el item a actualizar
  public activarMod() {

  }
  //Calcula el Importe
  public calcularImporte(){
    let precioUnitario = null;
    let cantidad = null;
    let importe = null;
    this.establecerDecimales(this.formulario.get('precioUnitario'), 2);
    this.establecerDecimales(this.formulario.get('cantidad'), 2);
    precioUnitario = this.formulario.get('precioUnitario').value;
    cantidad = this.formulario.get('cantidad').value;
    if(precioUnitario && cantidad){
      importe = precioUnitario * cantidad;
      this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(importe, 2));
    }
    if(precioUnitario == null || precioUnitario == undefined || cantidad == null || cantidad == undefined){
      this.toastr.error("Error al calcular el importe. Campo vacío en 'Precio Unitario' o en 'Cantidad'.");
    }
  }
  //Calcula el Importe
  public calcularImporteITC(){
    let cantidad = null;
    let importeITC = null;
    let itcPorLitro = null;
    cantidad = this.formulario.get('cantidad').value;
    itcPorLitro = this.formulario.get('itcPorLitro').value;
    // this.establecerDecimales(this.formulario.get('importeITC'), 2);
    if(itcPorLitro){
      importeITC = itcPorLitro * cantidad;
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales(importeITC, 2));
    }
    if(itcPorLitro == 0 || itcPorLitro == '0.00' ){
      
    }
  }
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
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appService.mascararEnterosConDecimales(limit);
  }
  //Mascara para cuatro decimales
  public mascararCuatroDecimales(limit){
    return this.appService.mascararEnterosCon4Decimales(limit);
  }
   //Obtiene la mascara de importe
   public mascararImporte(intLimite) {
     return this.appService.mascararImporte(intLimite, 2);
   }
   //Obtiene la mascara de enteros
   public mascararEnteros(intLimite) {
     return this.appService.mascararEnteros(intLimite);
   }
   //Establece los decimales
   public establecerDecimales(formulario, cantidad): void {
     let valor = formulario.value;
     if(valor) {
       formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
     }else{
     }
   }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
