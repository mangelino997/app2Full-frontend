import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
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
  //Define los formControl para los datos del clinte
  public domicilio: FormControl = new FormControl();
  public localidad: FormControl = new FormControl();
  public condicionIVA: FormControl = new FormControl();
  public tipoProveedor: FormControl = new FormControl();
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
    private proveedorService: ProveedorService) {
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
        this.formulario.enable();
        this.establecerValoresPestania(nombre, false, false, true, 'idAnioFiscal');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAnio');
        break;
      case 3:
        this.formulario.disable();
        this.establecerValoresPestania(nombre, true, false, true, 'idAnio');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAnio');
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
      return elemento.descripcion ? elemento.descripcion : elemento;
    } else {
      return elemento;
    }
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Obtiene la mascara de enteros
  public mascararEntero(intLimite) {
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  } 
}
