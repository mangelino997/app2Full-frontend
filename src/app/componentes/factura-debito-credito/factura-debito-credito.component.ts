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
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { CompraComprobantePercepcion } from 'src/app/modelos/compra-comprobante-percepcion';
import { TipoPercepcionService } from 'src/app/servicios/tipo-percepcion.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { CompraComprobantePercepcionJurisdiccion } from 'src/app/modelos/compra-comprobante-percepcion-jurisdiccion';
import { CompraComprobanteVencimiento } from 'src/app/modelos/compra-comprobante-vencimiento';
import { CompraComprobanteVencimientoService } from 'src/app/servicios/compra-comprobante-vencimiento.service';

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
  //Define si mostrar el boton de vencimientos
  public mostrarBotonVencimiento: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la pestaña Listar y  sus validaciones de campos
  public formularioListar: FormGroup;
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
  //Define la lista de tipos de condiciones de compra
  public condicionesCompra: Array<any> = [];
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
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
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
    private proveedorService: ProveedorService, private compraComprobanteService: CompraComprobanteService, public dialog: MatDialog,
    private condicionCompraService: CondicionCompraService) {
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
    //Reestablece el formulario
    this.reestablecerFormulario(undefined);
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la fecha Actual
    this.obtenerFecha();
    //Obtiene la lista de tipos de comprobantes
    this.listarTipoComprobante();
    //Obtiene la lista de Condiciones de Compra
    this.listarCondicionCompra();
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
        this.formulario.get('fechaEmision').setValue(res.json());
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
  //Carga la lista de tipos de condiciones de compra
  private listarCondicionCompra(){
    this.condicionCompraService.listar().subscribe(
      res=>{
        this.condicionesCompra = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de Tipos de Condiciones de Compra");
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
    let empresa = this.appService.getEmpresa();
    let usuarioAlta = this.appService.getUsuario();
    let sucursal = usuarioAlta.sucursal;
    this.formulario.get('empresa').setValue(empresa);
    this.formulario.get('sucursal').setValue(sucursal);
    this.formulario.get('usuarioAlta').setValue(usuarioAlta);
    console.log(this.formulario.value);
    this.compraComprobanteService.agregar(this.formulario.value).subscribe(
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
    this.domicilio.disable();
    this.localidad.disable();
    this.condicionIVA.disable();
    this.tipoProveedor.disable();
    this.formulario.get('condicionCompra').setValue(elemento.condicionCompra);
    if(elemento.condicionCompra.id == 1)
      this.mostrarBotonVencimiento = true;
      else
      this.mostrarBotonVencimiento = false;
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
      this.toastr.error("Fecha de emisión debe ser igual o menor a la fecha contable.");
      this.formulario.get('fechaEmision').setValue(null);
      setTimeout(function () {
        document.getElementById('idFechaEmision').focus();
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
          console.log(res, res.status);
          let respuesta = res.text();
          if(respuesta){
            this.formulario.get('codigoAfip').setValue(respuesta);
          }else{
            this.formulario.get('codigoAfip').reset();
            this.formulario.get('letra').reset();
            setTimeout(function () {
              document.getElementById('idCodigoAfip').focus();
            }, 20);
            this.toastr.error("Ingrese otro Código de Afip");
          }
        },
        err=>{
          this.formulario.get('codigoAfip').reset();
          this.formulario.get('letra').reset();
          setTimeout(function () {
            document.getElementById('idCodigoAfip').focus();
          }, 20);
          this.toastr.error("Ingrese otro Código de Afip");
        }
      )
    }else{
      this.toastr.error("No se puede obtener el Código de Afip porque hay campos vacíos en 'Tipo de Comprobante' o 'Letra'.");
    }
  }
  //Abre modal para agregar los items
  public agregarItemDialogo() {
    const dialogRef = this.dialog.open(AgregarItemDialogo, {
      width: '95%',
      maxWidth: '100vw',
      data: {
        proveedor: this.formulario.value.proveedor
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      //Seteo la lista de Item en el formulario
      this.formulario.get('compraComprobanteItems').setValue(result);
      //Cargo los items a la tabla
      if(this.listaCompleta.data.length > 0){
        result.forEach(item =>{
          this.listaCompleta.data.push(item);
        });
        this.listaCompleta.sort = this.sort;
      }else{
        this.listaCompleta = new MatTableDataSource(result);
        this.listaCompleta.sort = this.sort;
      }
      this.calcularImportes();
    });
  }
  //Abre modal para agregar detalle de percepciones
  public detallePercepcionDialogo() {
    const dialogRef = this.dialog.open(DetallePercepcionesDialogo, {
      width: '95%',
      maxWidth: '100vw',
      data: {
        detallePercepcion: this.formulario.value.compraComprobantePercepciones
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.formulario.get('compraComprobantePercepciones').setValue(result);
        this.calcularImportesPercepciones(result);
      }else{
        this.formulario.get('compraComprobantePercepciones').setValue([]);
        this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales('0.00', 2));
      }
    });
  }
  //Abre modal para agregar los vencimientos
  public detalleVencimientosDialogo() {
    const dialogRef = this.dialog.open(DetalleVencimientosDialogo, {
      width: '95%',
      maxWidth: '100vw',
      data: {
        proveedor: this.formulario.value.proveedor,
        importeTotal: this.formulario.value.importeTotal
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.formulario.get('compraComprobanteVencimientos').setValue(result);
      }else{
        this.formulario.get('compraComprobanteVencimientos').setValue([]);
      }
    });
  }
  //Calcula el importe total de detalle percepciones
  public calcularImportesPercepciones(listaPercepciones){
    let importePercepciones = null;
    //Suma el importe de las percepciones
    listaPercepciones.forEach(
      item=>{
        importePercepciones += Number(item.importe);
      }
    );
    //Setea el valor correspondiente en el formulario
    if(importePercepciones > 0)
      this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales(importePercepciones, 2));
      else
      this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales('0.00', 2));
  }
  //Calcula los importes
  public calcularImportes(){
    this.establecerImportesPorDefecto();
    this.listaCompleta.data.forEach(
      item=>{
        //Obtiene los importes de cada item
        let itemImpNoGravado = Number(item.importeNoGravado);
        let itemImpExento = Number(item.importeExento);
        let itemImpInt = Number(item.importeImpuestoInterno);
        let itemImpNetoGravado = Number(item.importeNetoGravado);
        let itemImpIva = Number(item.importeIva);
        //Suma los importes anteriores con los nuevos
        let impNoGravado = Number(this.formulario.value.importeNoGravado) + itemImpNoGravado;
        let impExento = Number(this.formulario.value.importeExento) + itemImpExento;
        let impInt = Number(this.formulario.value.importeImpuestoInterno) + itemImpInt;
        let impNetoGravado = Number(this.formulario.value.importeNetoGravado) + itemImpNetoGravado;
        let impIva = Number(this.formulario.value.importeIVA) + itemImpIva;
        //Setea el valor correspondiente en los importes del formulario
        if(impNoGravado > 0)
          this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales(impNoGravado, 2));
          else
          this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
        if(impExento > 0)
          this.formulario.get('importeExento').setValue(this.appService.establecerDecimales(impExento, 2));
          else
          this.formulario.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
        if(impInt > 0)
          this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales(impInt, 2));
          else
          this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales('0.00', 2));
        if(impNetoGravado > 0)
          this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(impNetoGravado, 2));
          else
          this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
        if(impIva > 0)
          this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales(impIva, 2));
          else
          this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales('0.00', 2));
      }
    );
    this.calcularImporteTotal();
  }
  //Calcula el Importe Total
  private calcularImporteTotal(){
    let importePercepciones = Number(this.formulario.value.importeNoGravado);
    let importeNoGravado = Number(this.formulario.value.importeNoGravado);
    let importeExento = Number(this.formulario.value.importeExento);
    let importeImpInt = Number(this.formulario.value.importeImpuestoInterno);
    let importeNetoGravado = Number(this.formulario.value.importeNetoGravado);
    let IVA = Number(this.formulario.value.importeIVA);

    let importeTotal = importePercepciones + importeNoGravado + importeExento + importeImpInt + importeNetoGravado + IVA;
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(importeTotal,2));

  }
  //Elimina un item de la tabla
  public activarEliminar(indice){
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
    if(this.listaCompleta.data.length == 0){
      this.establecerImportesPorDefecto();
    }
    this.calcularImportes();
  }
  //Reestablece el formulario
  private reestablecerFormulario(id){
    this.formulario.reset();
    this.domicilio.reset();
    this.localidad.reset();
    this.condicionIVA.reset();
    this.tipoProveedor.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.resultados = [];
    this.obtenerFecha();
    this.establecerImportesPorDefecto();
    setTimeout(function () {
      document.getElementById('idAutocompletado').focus();
    }, 20);
  }
  //Inicializa valores por defecto
  private establecerImportesPorDefecto(){
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales('0.00', 2));
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

//Componente Agregar Item Dialogo
@Component({
  selector: 'agregar-item-dialogo',
  templateUrl: 'agregar-item-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class AgregarItemDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de items 
  public listaItems: Array<any> = [];
  //Define la lista de resultados de busqueda para insumoProducto
  public resultados: Array<any> = [];
  //Define la lista de tipos de depositos
  public tiposDepositos: Array<any> = [];
  //Define la lista de afip alicuotas iva
  public afipAlicuotasIva: Array<any> = [];
  //Define el campo Unidad de Medida como FormControl
  public unidadMedida: FormControl = new FormControl();
  //Define el campo Condicion de Iva como FormControl
  public condicionIva: FormControl = new FormControl();
  //Define el campo Subtotal como FormControl
  public subtotal: FormControl = new FormControl();
  //Define los campos de ITC como FormControls
  public importeITC: FormControl = new FormControl();
  public netoITC: FormControl = new FormControl();
  public deducirDeNoGravado: FormControl = new FormControl();
  public importeNoGravado: FormControl = new FormControl();
  public netoNoGravado: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<AgregarItemDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobanteItem, private insumoProductoService: InsumoProductoService,
    private appService: AppService, private depositoInsumoProductoService: DepositoInsumoProductoService, private depositoInsumoProducto: DepositoInsumoProductoService,
    private afipAlicuotaIvaService: AfipAlicuotaIvaService) {
      dialogRef.disableClose = true;
     }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    //Obtiene la lista de afip alicuota iva
    this.listarAfipAlicuotaIva();
    //Obtiene la lista de Depositos
    this.listarDepositos();
    //Inicializa los valores por defecto
    this.reestablecerFormulario();
    
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
    this.depositoInsumoProducto.listar().subscribe(
      res=>{
        this.tiposDepositos = res.json();
      },
      err=>{
        console.log(err);
      }
    )
  }
  private listarAfipAlicuotaIva(){
    this.afipAlicuotaIvaService.listar().subscribe(
      res=>{
        this.afipAlicuotasIva = res.json();
        this.establecerAfipAlicuotaIva();
      },
      err=>{
        console.log(err);
      }
    );
  }
  //Inicializa el campo Afip Alicuota Iva
  private establecerAfipAlicuotaIva(){
    this.afipAlicuotasIva.forEach(
      item=>{
        if(item.porDefecto == true)
          this.formulario.get('alicuotaIva').setValue(item);
      }
    );
  }
  //Establece valores por el insumoProducto seleccionado
  public establecerValores(){
    let insumoProducto = null;
    insumoProducto = this.formulario.get('insumoProducto').value;
    if(insumoProducto){
      this.unidadMedida.setValue(insumoProducto.unidadMedida.nombre);
      this.formulario.get('itcPorLitro').setValue(this.appService.establecerDecimales(insumoProducto.itcPorLitro.toString(), 4));
    }
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
    this.calcularImporteIVA();
  }
  //Calcula el Importe ITC 
  public calcularImporteITC(){
    console.log(this.formulario.get('itcPorLitro').value);

    let cantidad = null;
    let itcPorLitro = null;
    let importeITC = null;
    let netoITC = null;
    let insumoNetoITC = null;
    cantidad = Number(this.formulario.get('cantidad').value);
    itcPorLitro = Number(this.formulario.get('itcPorLitro').value);
    // this.establecerDecimales(this.formulario.get('importeITC'), 2);
    console.log(itcPorLitro);
    if(itcPorLitro == 0 || itcPorLitro == '0.0000' || itcPorLitro == null || itcPorLitro == undefined ){
      this.importeITC.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoITC.setValue(this.appService.establecerDecimales('0.00', 2));
      this.deducirDeNoGravado.setValue(null);
      this.importeNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));

      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales('0.00', 2));
      this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));

      this.importeITC.disable();
      this.netoITC.disable();
      this.deducirDeNoGravado.disable();
      this.importeNoGravado.disable();
      this.netoNoGravado.disable();
    }else{
      this.importeITC.enable();
      this.netoITC.enable();
      this.deducirDeNoGravado.enable();
      this.importeNoGravado.enable();
      this.netoNoGravado.enable();


      importeITC = itcPorLitro*cantidad;
      insumoNetoITC = Number(this.formulario.value.insumoProducto.itcNeto);
      netoITC = (importeITC*insumoNetoITC)/100;
      console.log(importeITC, insumoNetoITC ,netoITC);
      this.importeITC.setValue(this.appService.establecerDecimales(importeITC, 2));
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales(importeITC, 2));
      this.netoITC.setValue(this.appService.establecerDecimales(netoITC, 2));
    }
  }
  //Maneja el cambio en el select "Deducir de No Gravado"
  public cambioDeducirNoGravado(){
    console.log(this.deducirDeNoGravado.value);
    if(this.deducirDeNoGravado.value){
      this.importeNoGravado.enable();
    }else{
      this.importeNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.importeNoGravado.disable();
    }
  }
  //Calcula el Neto No Gravado
  public calcularNetoNoGravado(){
    this.establecerDecimales(this.importeNoGravado, 2);
    let netoNoGravado = null;
    netoNoGravado = this.importeNoGravado.value - this.netoITC.value;
    this.netoNoGravado.setValue(this.appService.establecerDecimales(netoNoGravado, 2));
  }
  //Calcula el Importe IVA
  public calcularImporteIVA(){
    let importeGravado = null;
    let alicuotaIva = null;
    let importeIva = null;
    importeGravado = this.formulario.get('importeNetoGravado').value;
    alicuotaIva = this.formulario.get('alicuotaIva').value.alicuota;
    if(importeGravado && alicuotaIva){
      importeIva = (importeGravado*alicuotaIva)/100;
      this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIva, 2));
    }
  }
  //Calcula el Subtotal del Item
  public calcularSubtotal(){
    this.establecerDecimales(this.formulario.get('importeImpuestoInterno'), 2);
    let importeGravado = null;
    let importeIva = null;
    let importeItc = null;
    let importeNoGravado = null;
    let importeExento = null;
    let importeImpuestoInterno = null;
    let subtotal = null;

    importeGravado = Number(this.formulario.value.importeNetoGravado);
    importeIva = Number(this.formulario.value.importeIva);
    importeItc = Number(this.formulario.value.importeITC);
    importeNoGravado = Number(this.formulario.value.importeNoGravado);
    importeExento = Number(this.formulario.value.importeExento);
    importeImpuestoInterno = Number(this.formulario.value.importeImpuestoInterno);

    subtotal = importeGravado + importeIva + importeItc + importeNoGravado + importeExento + importeImpuestoInterno;
    console.log(importeGravado, importeIva , importeItc , importeNoGravado , importeExento , importeImpuestoInterno);
    this.subtotal.setValue(this.appService.establecerDecimales(subtotal, 2));

  }
  //Agrega un item a la lista de items
  public agregarItem(){
    this.controlarCamposVacios();
    this.listaItems.push(this.formulario.value);
    this.toastr.success("Item agregado con éxito.");
    this.reestablecerFormulario();
  }
  //Controla campso vacios. Establece en cero los nulos
  private controlarCamposVacios(){
    if(!this.formulario.value.cantidad || this.formulario.value.cantidad==undefined)
      this.formulario.get('cantidad').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.precioUnitario || this.formulario.value.precioUnitario==undefined)
      this.formulario.get('precioUnitario').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeNetoGravado || this.formulario.value.importeNetoGravado==undefined)
      this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeNoGravado || this.formulario.value.importeNoGravado==undefined)
      this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeExento || this.formulario.value.importeExento==undefined)
      this.formulario.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeImpuestoInterno || this.formulario.value.importeImpuestoInterno==undefined)
      this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeITC || this.formulario.value.importeITC==undefined)
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.importeIva || this.formulario.value.importeIva==undefined)
      this.formulario.get('importeIva').setValue(this.appService.establecerDecimales('0.00', 2));
    if(!this.formulario.value.afipAlicuotaIva || this.formulario.value.afipAlicuotaIva==undefined)
      this.formulario.get('afipAlicuotaIva').setValue(this.data.proveedor.afipCondicionIva);
  }
  //Reestablece el Formulario y los FormControls
  private reestablecerFormulario(){
    this.formulario.reset();
    this.importeITC.reset();
    this.netoITC.reset();
    this.deducirDeNoGravado.reset();
    this.importeNoGravado.reset();
    this.netoNoGravado.reset();
    this.unidadMedida.reset();
    this.establecerAfipAlicuotaIva();
    this.formulario.get('afipAlicuotaIva').setValue(this.data.proveedor.afipCondicionIva);
    this.condicionIva.setValue(this.data.proveedor.afipCondicionIva.nombre);
    this.deducirDeNoGravado.setValue(null);
    this.subtotal.setValue(this.appService.establecerDecimales('0.00', 2));
    //Establece foco
    setTimeout(function () {
      document.getElementById('idInsumoProducto').focus();
    }, 20);
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

//Componente Agregar Item Dialogo
@Component({
  selector: 'detalle-percepciones-dialogo',
  templateUrl: 'detalle-percepciones-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class DetallePercepcionesDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioPorJurisdiccion: FormGroup;
  //Define la lista de Años 
  public anios: Array<any> = [];
  //Define la lista de Meses 
  public meses: Array<any> = [];
  //Define la lista de provincias 
  public provincias: Array<any> = [];
  //Define la lista de resultados de busqueda para insumoProducto
  public resultados: Array<any> = [];
  //Define la lista de tipos de percepciones
  public tiposPercepciones: Array<any> = [];
  //Define un boolean para controlar vista de campos Percepción por Jurisdicción
  public mostrarCamposPorJurisdiccion: boolean = false;
  //Define el campo Condicion de Iva como FormControl
  public provincia: FormControl = new FormControl();
  //Define el campo Importe de Jurisdiccion FormControl
  public importeJurisdiccion: FormControl = new FormControl();
  //Define la lista completa de registros para la primera tabla
  public listaCompletaPorJurisdiccion = new MatTableDataSource([]);
  //Define la lista completa de registros para la segunda tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la primer tabla (percepciones por jurisdiccion)
  public columnasPercepcionPorJurisdiccion: string[] = ['provincia', 'importe', 'eliminar'];
  //Define las columnas de la segunda tabla (percepciones)
  public columnasPercepcion: string[] = ['tipoPercepcion', 'anio', 'mes', 'importe', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetallePercepcionesDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobantePercepcion, private modeloPorJurisdiccion: CompraComprobantePercepcionJurisdiccion,
    private insumoProductoService: InsumoProductoService, private appService: AppService, private tipoPercepcionService: TipoPercepcionService,
    private fechaService: FechaService, private mesService: MesService, private provinciaService: ProvinciaService) {
      dialogRef.disableClose = true;
     }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario General (sin detalle por jurisdicción)
    this.formulario = this.modelo.formulario;
    //Establece el formulario Por Jurisdiccion 
    this.formularioPorJurisdiccion = this.modeloPorJurisdiccion.formulario;
    //Establece la lista de percepciones
    console.log([this.data.detallePercepcion]);
    if(this.data.detallePercepcion){
      this.listaCompleta = new MatTableDataSource(this.data.detallePercepcion);
      this.listaCompleta.sort = this.sort;
    }
    //Obtiene la lista de recepciones
    this.listarPercepciones();
    //Obtiene la lista de anios mas menos uno
    this.listarAniosMasMenosUno();
    //Obtiene la lista de meses
    this.listarMeses();
    //Obtiene la lista de provincias
    this.listarProvincias();
    //Reestablece el formulario general
    this.reestablecerFormularioGeneral();
  }
  //Carga la lista de tipos de percepciones
  public listarPercepciones(){
    this.tipoPercepcionService.listar().subscribe(
      res=>{
        this.tiposPercepciones = res.json();
      },
      err=>{
        console.log(err);
      }
    )
  }
  //Carga la lista de anios
  private listarAniosMasMenosUno(){
    this.fechaService.listarAniosMasMenosUno().subscribe(
      res=>{
        this.anios = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de años");
      }
    )
  }
  //Carga la lista de meses
  private listarMeses(){
    this.mesService.listar().subscribe(
      res=>{
        this.meses = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de meses");
      }
    )
  }
  //Carga la lista de provincias
  private listarProvincias(){
    this.provinciaService.listar().subscribe(
      res=>{
        this.provincias = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de provincias");
      }
    )
  }
  //Controla el cambio en el campo de selecicon Tipo de Percepción
  public cambioTipoPercepcion(){
    let elemento = this.formulario.get('tipoPercepcion').value;
    if(elemento.detallePorJurisdiccion){
      this.mostrarCamposPorJurisdiccion = true;
    }else{
      this.mostrarCamposPorJurisdiccion = false;
    }
  }
  //Agrega una precepcion a la primera tabla (percepcion por jurisdiccion)
  public agregarPercepcionPorJurisdiccion(){
    if(this.listaCompletaPorJurisdiccion.data.length == 0){
      this.listaCompletaPorJurisdiccion = new MatTableDataSource([this.formularioPorJurisdiccion.value]);
      this.listaCompletaPorJurisdiccion.sort = this.sort;
      this.toastr.success("Percepción por jurisdicción agregada con éxito.");
      this.reestablecerFormularioPorJurisdiccion();
    }else{
      //Controla unicidad de la provincia en la tabla
      let indice = null;
      indice = this.listaCompletaPorJurisdiccion.data.findIndex(
        item => item.provincia.id === this.formularioPorJurisdiccion.value.provincia.id);
        if(indice >= 0){ //La provincia ya fue cargada anteriormente
          this.toastr.error("La provincia seleccionada ya fue agregada a la tabla.");
          this.formularioPorJurisdiccion.get('provincia').reset();
          setTimeout(function () {
            document.getElementById('idProvincia').focus();
          }, 20);
        }else{ //La provincia no se encuentra en la tabla (devuelve -1)
          this.listaCompletaPorJurisdiccion.data.push(this.formularioPorJurisdiccion.value);
          this.listaCompletaPorJurisdiccion.sort = this.sort;
          this.toastr.success("Percepción por jurisdicción agregada con éxito.");
          this.reestablecerFormularioPorJurisdiccion();
        }
    }
  }
  //Controla antes de Agregar Percepcion
  public controlarAgregarPercepcion(){
    if(this.mostrarCamposPorJurisdiccion){ //Controla que los importes coincidan cuando es por jurisdiccion
      let importe = null;
      this.listaCompletaPorJurisdiccion.data.forEach(
        item => {
          importe += Number(item.importe);
        }
      );
      if(importe == Number(this.formulario.value.importe)){ //Controla igualdad de importes
        this.agregarPercepcion();
      }else{
        this.toastr.error("La suma de importes por jurisdicción es diferente al importe de cabecera.");
      }
    }
    if(!this.mostrarCamposPorJurisdiccion){
      this.agregarPercepcion();
    }
  }
  //Agrega una percepcion a la segunda tabla
  private agregarPercepcion(){
    this.formulario.get('compraCptePercepcionJurisdicciones').setValue(this.listaCompletaPorJurisdiccion.data);
    if(this.listaCompleta.data.length == 0){
      this.listaCompleta = new MatTableDataSource([this.formulario.value]);
      this.listaCompleta.sort = this.sort;
    }else{
      this.listaCompleta.data.push(this.formulario.value);
      this.listaCompleta.sort = this.sort;
    }
    this.toastr.success("Percepción agregada con éxito.");
    this.reestablecerFormularioGeneral();
  }
  //Elimina un item de la primera tabla
  public activarEliminarPorJurisdiccion(indice){
    this.listaCompletaPorJurisdiccion.data.splice(indice, 1);
    this.listaCompletaPorJurisdiccion.sort = this.sort;
  }
  //Elimina un item de segunda la tabla
  public activarEliminarPercepcion(indice){
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
  }
  //Reestablece el Formulario general
  private reestablecerFormularioPorJurisdiccion(){
    this.formularioPorJurisdiccion.reset();
    setTimeout(function () {
      document.getElementById('idProvincia').focus();
    }, 20);
  }
  //Reestablece el Formulario percepciones por jurisdiccion
  private reestablecerFormularioGeneral(){
    this.formulario.reset();
    this.listaCompletaPorJurisdiccion = new MatTableDataSource([]);
    this.listaCompletaPorJurisdiccion.sort = this.sort;
    setTimeout(function () {
      document.getElementById('idTipoPercepcion').focus();
    }, 20);
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
  closeDialog(opcion) {
    if(opcion == 'aceptar'){
      this.dialogRef.close(this.listaCompleta.data);
    }
    if(opcion == 'cerrar'){
      this.dialogRef.close(null);
    }
  }
}


//Componente Agregar Item Dialogo
@Component({
  selector: 'detalle-vencimientos-dialogo',
  templateUrl: 'detalle-vencimientos-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class DetalleVencimientosDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define si habilita el boton Aceptar
  public btnAceptar: boolean = null;
  //Define un formulario para validaciones de campos
  public formularioPorJurisdiccion: FormGroup;
  //Define la lista de Fechas de Vencimientos
  public fechasVencimiento: Array<any> = [];
  //Define la lista de condiciones de compra
  public condicionesCompra: Array<any> = [];
  //Define el campo Total Comprobante como FormControl
  public totalComprobante: FormControl = new FormControl();
  //Define el campo Condicion de Compra como FormControl
  public condicionCompra: FormControl = new FormControl();
  //Define el campo Cantidad Cuotas como FormControl
  public cantidadCuotas: FormControl = new FormControl();
  //Define el campo N° de Cuota como FormControl
  public numeroCuota: FormControl = new FormControl();
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define el importe total de la tabla
  public importeTotalTabla: number = null;
  //Define el campo Diferencia como FormControl
  public diferencia: FormControl = new FormControl();
  //Define la lista completa de registros para la tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnasPercepcion: string[] = ['numeroCuota', 'fechaVencimiento', 'importe', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetallePercepcionesDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobanteVencimiento, private modeloPorJurisdiccion: CompraComprobantePercepcionJurisdiccion,
    private condicionCompraService: CondicionCompraService, private appService: AppService, private provinciaService: ProvinciaService,
    private compraCbteVencimientoService:  CompraComprobanteVencimientoService) {
      dialogRef.disableClose = true;
     }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario General (sin detalle por jurisdicción)
    this.formulario = this.modelo.formulario;
    //Establece el formulario Por Jurisdiccion 
    this.formularioPorJurisdiccion = this.modeloPorJurisdiccion.formulario;
    //Establece la lista de vencimientos
    console.log(this.data.compraComprobanteVencimientos);
    // if(this.data.compraComprobanteVencimientos){
    //   this.listaCompleta = new MatTableDataSource(this.data.compraComprobanteVencimientos);
    //   this.listaCompleta.sort = this.sort;
    // }
    //Obtiene la lista de recepciones
    this.listarCondicionesCompra();
    //Inicializa valores por defecto
    this.establecerPorDefecto();
  }
  //Carga la lista de condiciones de compra
  public listarCondicionesCompra(){
    this.condicionCompraService.listar().subscribe(
      res=>{
        this.condicionesCompra = res.json();
      },
      err=>{
        console.log(err);
      }
    )
  }
  //Establece valores por defecto
  private establecerPorDefecto(){
    this.importeTotalTabla = null;
    this.totalComprobante.reset();
    this.condicionCompra.reset();
    this.cantidadCuotas.reset();
    this.diferencia.reset();
    this.btnAceptar = false;

    this.cantidadCuotas.setValue(this.data.proveedor.condicionCompra.cuotas);
    this.condicionCompra.setValue(this.data.proveedor.condicionCompra);
    this.cantidadCuotas.setValue(this.data.proveedor.condicionCompra.cuotas);
    if(Number(this.data.importeTotal) > 0)
      this.totalComprobante.setValue(this.appService.establecerDecimales(this.data.importeTotal,2));
      else
      this.totalComprobante.setValue(this.appService.establecerDecimales('0.00',2));
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
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
  //Confirma y genera tabla de vencimientos
  public confirmar(){
    this.loaderService.show();
    let cantidadCuotas = this.cantidadCuotas.value;
    let totalImporte = this.totalComprobante.value;
    let idCondicionCompra = this.condicionCompra.value.id;
    console.log(cantidadCuotas,totalImporte,idCondicionCompra );
    this.compraCbteVencimientoService.generarTablaVencimientos(cantidadCuotas,totalImporte,idCondicionCompra).subscribe(
      res=>{
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.calcularImporteTabla();
        this.loaderService.hide();
      },
      err=>{
        this.toastr.error(err.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro de la tabla
  public actualizar(){
    this.listaCompleta.data[this.idMod] = this.formulario.value;
    this.listaCompleta.sort = this.sort;
    this.calcularImporteTabla();
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar(){
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
  }
  //Completa los campos del formulario con los datos del registro a modificar
  public activarActualizar(elemento, indice){
    this.formulario.setValue(elemento);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.numeroCuota.setValue(indice + 1);
    this.idMod= indice;
  }
  //Activar Eliminar
  public activarEliminar(indice){
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
    this.calcularImporteTabla();
  }
  //Calcula el importe total de la tabla
  private calcularImporteTabla(){
    this.importeTotalTabla = 0;
    this.listaCompleta.data.forEach(
      item=>{
        this.importeTotalTabla += Number(item.importe);
      }
    );
    this.calcularDiferencia();
  }
  //Calcula la diferencia entre el "totalComprobante" y el "importeTotalTabla"
  private calcularDiferencia(){
    let diferencia = null;
    diferencia = Number(this.totalComprobante.value) - this.importeTotalTabla;
    console.log(this.importeTotalTabla);
    this.diferencia.setValue(this.appService.establecerDecimales(diferencia.toString(), 2));
    if(diferencia == 0)
      this.btnAceptar = true;
      else
      this.btnAceptar = false;
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
  closeDialog(opcion) {
    if(opcion == 'aceptar'){
      console.log(this.btnAceptar);
      if(this.btnAceptar)
      this.dialogRef.close(this.listaCompleta.data);
      else
        this.toastr.warning("Campo Diferencia debe ser cero.");
    }
    if(opcion == 'cerrar'){
      this.dialogRef.close(null);
    }
  }
}