import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { TipoTarifaService } from '../../servicios/tipo-tarifa.service';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { TramoService } from '../../servicios/tramo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { OrdenVentaTarifa } from 'src/app/modelos/ordenVentaTarifa';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EliminarModalComponent } from '../eliminar-modal/eliminar-modal.component';
import { ClienteOrdenVentaService } from 'src/app/servicios/cliente-orden-venta.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ConfirmarDialogo } from '../actualizacion-precios/actualizacion-precios.component';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define el id de la Orden Venta Cabecera
  public ORDEN_VTA_CABECERA: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define una lista
  public lista = null;
  //Define la lista para las Escalas agregadas
  public listaDeEscalas: Array<any> = [];
  //Define la lista para los tramos agregados
  public listaDeTramos: Array<any> = [];
  //Define la lista para Tarifas
  public listaDeTarifas: Array<any> = [];
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  public formularioTarifa: FormGroup;
  public formularioListar: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioEscala: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioTramo: FormGroup;
  //Define el elemento de autocompletado
  public elemAutocompletado: any = null;
  //Define el siguiente id
  public siguienteId: number = null;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  //Define Empresa como FormControl 
  public empresa: FormControl = new FormControl();
  //Define cliente como FormControl
  public cliente: FormControl = new FormControl();
  //Define tipoOrdenVenta como FormControl
  public tipoOrdenVenta: FormControl = new FormControl();
  
  //Define la opcion (SELECT) Tipo Tarifa como un FormControl
  public tipoTarifa: FormControl = new FormControl();
  //Define la lista de tarifas para el Tipo Tarifa
  public listaTarifas: any = [];
  //Define la lista de Tarifas para un id Orden de Venta 
  public listaTarifasDeOrdVta= new MatTableDataSource([]);
  //Define la lista de Orden Vta para la pestania Listar
  public listaOrdenVenta= new MatTableDataSource([]);
  //Define la lista de los resultados para la pestaña LISTAR
  public resultados= new MatTableDataSource([]);
  //Define la lista de tramos para la segunda tabla
  public listaTramos: any = [];
  //Define el form control para las busquedas
  public buscar: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  // public resultados = [];
  //Define el form control para el preciosDesde de cada registro
  public preciosDesde: FormControl = new FormControl('', Validators.required);
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define la lista de resultados de busqueda vendedor
  public resultadosVendedores = [];
  //Define el form control para el combo ordenes de venta
  public ordenventa: FormControl = new FormControl();
  //Define la lista de ordenes de ventas
  public ordenesVentas: Array<any> = [];
  //Define la lista de resultados de busqueda tramo
  public resultadosTramos = [];
  //Define la lista de vendedores
  public vendedores: Array<any> = [];
  //Define la lista de escalas
  public escalas: Array<any> = [];
  //Define el estado de tipo tarifa
  public tipoTarifaEstado: boolean = false;
  //Define la lista de precios desde
  public preciosDesdeLista: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define importes por
  public importePor:FormControl = new FormControl();
  //Define importes seco por
  public importeSecoPor:FormControl = new FormControl();
  //Define importes ref por
  public importeRefPor:FormControl = new FormControl();
  //Define la escala actual
  public escalaActual:any;
  //Define la cantidad de resultados que trae listaTarifasDeOrdVta
  public lengthTable: number = 0;
  //Bandera boolean para determinar si ya se creo una orden venta (cambia el boton "crear orden venta" a "actualizar orden venta")
  public btnActualizarOrdVta: boolean= false;
  //Bandera boolean para determinar si modifica o agrega un atarifa
  public btnActualizarTarifa: boolean= false;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'tarifa', 'escala', 'porPorcentaje', 'ver', 'eliminar'];
  //Define las columnas de la tabla para la pestaña LISTAR
  public columnasListar: string[] = ['id', 'descripcion', 'vendedor', 'seguro', 'cr', 'esContado', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private clienteServicio: ClienteService, private fechaService: FechaService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService, public dialog: MatDialog,
    private appService: AppService, private clienteOVService: ClienteOrdenVentaService,
    private ordenVenta: OrdenVenta, private ordenVentaServicio: OrdenVentaService,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo,
    private loaderService: LoaderService, private ordenVentaTarifa: OrdenVentaTarifa, private ordenVentaTarifaService: OrdenVentaTarifaService) {
      //Obtiene la lista de pestania por rol y subopcion
      this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
      //Autocompletado - Buscar por nombre
      this.buscar.valueChanges.subscribe(data => {
        if (typeof data == 'string' && data.length > 2) {
          this.servicio.listarPorNombre(data).subscribe(response => {
            this.resultados = response;
          })
        }
      });
     }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
    });
    
    //Define el formulario de orden venta (contiene a clienteOrdenVentaForm, empresaOrdenVentaForm )
    this.formulario = this.ordenVenta.formulario;
    //Define el formulario de orden venta tarifa
    this.formularioTarifa = this.ordenVentaTarifa.formulario;
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Define el formulario para la pestaña listar
    this.formularioListar = new FormGroup({
      tipo: new FormControl(),
      cliente: new FormControl(),
      empresa: new FormControl()
    });    
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Selecciona la pestania agregar por defecto
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado - Buscar por nombre cliente
    this.cliente.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    });
    //Autocompletado - Buscar por nombre cliente - Pestania Listar
    this.formularioListar.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    });
  }
  //Establece el id de la Orden Venta (cabecera)
  public establecerOrdenVentaCabecera(ordenCabecera){
    this.ORDEN_VTA_CABECERA = ordenCabecera;
    this.formulario.value.id = ordenCabecera;
    console.log(this.ORDEN_VTA_CABECERA);
  }
  //Obtiene el id para la orden venta
  private obtenerSiguienteId(){
    this.ordenVentaServicio.obtenerSiguienteId().subscribe(
      res=>{
        this.formulario.get('id').setValue(res.json());
      },
      err=>{
        let error= err.json();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Obtiene la lista de vendedores
  private listarVendedores() {
    this.vendedorServicio.listar().subscribe(res => {
      this.vendedores = res.json();
    });
  }
  //Cambio tipo tarifa
  public cambioTipoTarifa(): void {
    this.listaTarifas = [];
    console.log(this.tipoTarifa.value);
    if(this.tipoTarifa.value=='porEscala'){
      this.tipoTarifaServicio.listarPorEscala().subscribe(
        res=>{
          console.log(res.json());
          this.listaTarifas = res.json();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de Tarifas por Escala");
        }
      )
    }
    if(this.tipoTarifa.value=='porTramo') {
      this.tipoTarifaServicio.listarPorTramo().subscribe(
        res=>{
          this.listaTarifas = res.json();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de Tarifas por Tramo");
        }
      )
    }
  }
  //Establece el tipo (empresa o cliente)
  public establecerTipo(): void {
    // let tipoOrdenVenta = this.tipoOrdenVenta.value;
    if (!this.tipoOrdenVenta.value) {
      this.formulario.get('clientes').setValue([]);
      this.formulario.get('clientes').setValidators([]);
      // this.formulario.get('empresas').setValidators(Validators.required);
      // this.formulario.get('clientes').updateValueAndValidity();//Actualiza las validaciones en el Formulario
      // this.listarOrdenesVentas('empresas');
        
    } 
    if (this.tipoOrdenVenta.value) {
      this.formulario.get('empresas').setValue([]);
        this.formulario.get('empresas').setValidators([]);
        // this.formulario.get('clientes').setValidators(Validators.required);
        // this.formulario.get('empresas').updateValueAndValidity(); //Actualiza las validaciones en el Formulario
    } 
  }
  //
  public establecerTipoEnListar(){
    let tipo = this.formularioListar.get('tipo').value;
    if(tipo == 'empresa'){
      this.formularioListar.get('clientes').setValue(null);
      this.formularioListar.get('clientes').setValidators([]);
      this.formularioListar.get('empresas').setValidators(Validators.required);
      this.formularioListar.get('clientes').updateValueAndValidity();//Actualiza las validaciones en el Formulario de la pestaña listar
      this.establecerEmpresa();
    }
    if(tipo == 'cliente'){
      this.formularioListar.get('empresas').setValue(null);
      this.formularioListar.get('empresas').setValidators([]);
      this.formularioListar.get('clientes').setValidators(Validators.required);
      this.formularioListar.get('empresas').updateValueAndValidity();//Actualiza las validaciones en el Formulario de la pestaña listar
    }
  }
  //Listar ordenes de ventas por Empresa/Cliente
  public listarOrdenesVentas(tipo) {
    this.loaderService.show();
    switch (tipo) {
      case 'empresa':
        this.establecerEmpresa();
        this.ordenVentaServicio.listarPorEmpresa(this.formulario.value.empresas[0].id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
          },
          err=>{
            this.toastr.error("Error al obtener la lista de Ordenes de Ventas");
            this.loaderService.hide();
          }
        );
        break;
      case 'cliente':
        this.ordenVentaServicio.listarPorCliente(this.formulario.value.clientes[0].id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
          },
          err=>{
            this.toastr.error("Error al obtener la lista de Ordenes de Ventas");
            this.loaderService.hide();
          }
        );
        break;
    }
  }
  //Establece los datos de la empresa actual
  private establecerEmpresa(){
    let empresa = this.appService.getEmpresa();
    this.empresa.setValue(empresa.razonSocial);
    this.formulario.value.empresas = [empresa];
    if(this.indiceSeleccionado == 5)
      this.formularioListar.get('empresa.empresa').setValue(empresa);
    // else 
    //   this.formulario.get('empresaOrdenVenta.empresa').setValue(empresa);

      // this.formulario.get('empresaOrdenVenta.empresa').setValue(empresa);

    console.log(this.formulario.value);
  }
  
  //Reestablecer campos
  private reestablecerCampos() {
    this.formulario.reset();
    this.formularioTarifa.reset();
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.formularioListar.reset();
    this.vaciarLista();
    this.ordenventa.reset();
    this.empresa.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.tipoTarifa.setValue('porEscala');
    this.cambioTipoTarifa();
    this.btnActualizarOrdVta = false;
    // this.establecerValoresPorDefecto();
    // this.habilitarFormTarifa(true);
    // this.formulario.get('empresaOrdenVenta.empresa').setValue(this.appService.getEmpresa());
    this.formulario.value.empresas = [this.appService.getEmpresa()];

    // this.formulario.get('tipoOrdenVenta').setValue(false);

    // this.establecerTipo();
    if (this.indiceSeleccionado != 1) {
      // this.formularioTarifa.get('tipoTarifa').disable();
      // this.tipoTarifa.disable();
    }
    if (this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      // this.formulario.get('vendedor').disable();
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    //Inicializa valores para el formulario
    this.formulario.get('seguro').setValue(this.appService.establecerDecimales('7.00', 2));
    this.formulario.get('comisionCR').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('esContado').setValue(true);
    this.formulario.get('estaActiva').setValue(true);
    this.tipoOrdenVenta.setValue(false);
    this.establecerTipo();
    this.establecerEmpresa();
    //Inicializa a tipoTarifa
    //Obtiene la fecha actual
    this.fechaService.obtenerFecha().subscribe(res => {
      this.preciosDesde.setValue(res.json());
    });
    this.formularioTarifa.get('tipoTarifa').enable();
    this.tipoTarifa.enable();
    this.tipoTarifa.setValue('porEscala');
    this.cambioTipoTarifa();
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = new MatTableDataSource([]);
    this.listaOrdenVenta = new MatTableDataSource([]);
    this.listaTarifasDeOrdVta = new MatTableDataSource([]);
    this.resultadosClientes = [];
    this.resultadosVendedores = [];
    this.resultadosTramos = [];
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
    this.vaciarLista();
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = new MatTableDataSource([]);
    }
    switch (id) {
      case 1:
        //Obtiene el id para la orden venta
        this.obtenerSiguienteId();
        this.establecerCamposSoloLectura(1);
        this.establecerValoresPorDefecto();
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
        break;
      case 2:
        this.establecerValoresPorDefecto();
        this.establecerCamposSoloLectura(2);
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
        break;
      case 3:
        this.establecerValoresPorDefecto();
        this.establecerCamposSoloLectura(3);
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
        break;
      case 4:
        this.establecerValoresPorDefecto();
        this.establecerCamposSoloLectura(4);
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoOrdenVenta');
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        // this.agregar();
        break;
      case 3:
        this.actualizar();
        break;
      case 4:
        // this.eliminar();
        break;
      default:
        break;
    }
  }
  //Agrega una Orden de Venta
  // public agregar() {
  //   this.loaderService.show();
  //   // if(this.formulario.value.clienteOrdenVenta.cliente)
  //   //   this.formulario.value.clientes = [this.formulario.value.clienteOrdenVenta.cliente];
  //   //   else
  //   //   this.formulario.value.clientes = [];

  //   // if(this.formulario.value.empresaOrdenVenta.empresa)
  //   // this.formulario.value.empresas = [this.formulario.value.empresaOrdenVenta.empresa];
  //   //   else
  //   //   this.formulario.value.empresas = [];

  //   // this.formulario.value.clienteOrdenVenta = null;
  //   // this.formulario.value.empresaOrdenVenta = null;
  //   this.formularioTarifa.value.ordenVenta = this.formulario.value;
  //   console.log(this.formularioTarifa.value);
  //   this.ordenVentaTarifaService.agregar(this.formularioTarifa.value).subscribe(
  //     res => {
  //       var elemento = res.json();
  //       if (res.status == 201) {
  //         // this.habilitarFormTarifa(true);
  //         this.recargarFormulario(elemento);
  //         this.toastr.success("Registro agregado con éxito");
  //         this.loaderService.hide();
  //         setTimeout(function () {
  //           document.getElementById('idTipoOrdenVenta').focus();
  //         }, 20);
  //       }
  //     },
  //     err => {
  //       var error = err.json();
  //       this.toastr.error(error.mensaje);
  //       this.loaderService.hide();
  //     }
  //   );
  // }
  //Actualiza un registro
  public actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var elemento = res.json();
        if (res.status == 200) {
          this.establecerValoresPorDefecto();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success("Registro actualizado con éxito");
          // this.habilitarFormTarifa(true);
          this.loaderService.hide();
          this.recargarFormulario(elemento);
        }
      },
      err => {
        var error = err.json();
        if (error.codigo == 5001) {
          this.toastr.warning(error.mensaje, 'Registro actualizado con éxito');
        } else {
          this.toastr.error(error.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Establece campos solo lectura
  private establecerCamposSoloLectura(pestania): void {
    switch (pestania) {
      case 1:
        this.formulario.get('vendedor').enable();
        this.formulario.get('esContado').enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        break;
      case 2:
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        this.formularioTarifa.disable();
        this.tipoTarifa.disable();
        break;
      case 3:
        this.formulario.get('vendedor').enable();
        this.formulario.get('esContado').enable();
        this.formularioEscala.get('importeFijo').enable();
        this.importePor.enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        break;
      case 4:
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        this.formularioEscala.get('importeFijo').disable();
        this.importePor.disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        break;
    }
  }
  //Realiza una recarga del formulario para no tener problemas al Agregar una Orden Venta
  private recargarFormulario(elemento){
    this.ordenventa.setValue(elemento.ordenVenta);
    this.formulario.patchValue(elemento);
    this.controlaPorcentajes(elemento);

    if(elemento.empresa){
      this.tipoOrdenVenta.setValue(false);
      this.empresa.setValue(elemento.empresa.razonSocial);
      this.establecerTipo();
    }
    if(elemento.cliente){
      this.tipoOrdenVenta.setValue(true);
    }
    this.formularioTarifa.enable();
    this.tipoTarifa.enable();
    this.listarOrdenVentaTarifas();
    this.btnActualizarOrdVta = true;
  }
  //Obtiene la lista de Orden Venta Tarifas por el id de la Orden Venta creada
  private listarOrdenVentaTarifas(){
    this.loaderService.show();
    // this.listaTarifasDeOrdVta = new MatTableDataSource(this.listaDeTarifas);
    // this.listaTarifasDeOrdVta.sort = this.sort;
    this.ordenVentaTarifaService.listarPorOrdenVenta(this.ORDEN_VTA_CABECERA).subscribe(
      res=>{
        console.log(res.json());
        this.listaTarifasDeOrdVta = new MatTableDataSource(res.json());
        this.listaTarifasDeOrdVta.sort = this.sort;
        this.loaderService.hide();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de Orden Venta Tarifa");
        this.loaderService.hide();
      }
    )
  }
  //Agrega un registro a Orden Venta Tarifa
  public agregarTarifa(){
    this.loaderService.show();
    if(this.listaDeTarifas.length == 0){
      this.formulario.get('id').setValue(null);
      this.formulario.get('ordenesVentasTarifas').setValue(this.formularioTarifa.value);
      if(this.formulario.value.clientes.length > 0){
        this.formulario.value.empresas = [];
        this.formulario.value.clientes = [this.cliente.value];
      }else{
        this.formulario.value.empresas = [this.appService.getEmpresa()];
        this.formulario.value.clientes = [];
      }
      console.log(this.formulario.value);
      this.ordenVentaServicio.agregar(this.formulario.value).then(
        res=>{
          if(res.status== 201){
            console.log(res, res.text());
            this.formularioTarifa.reset();
            this.establecerOrdenVentaCabecera(res.text());
            this.formulario.disable();
            this.listarOrdenVentaTarifas();
            this.toastr.success("Registro agregado con éxito");
            this.loaderService.hide();
            setTimeout(function () {
              document.getElementById('idTipoTarifa').focus();
            }, 20);
          }
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }else{
      this.formularioTarifa.get('ordenVenta').setValue({id: this.formulario.value});
      console.log(this.formulario.value);
      this.ordenVentaTarifaService.agregar(this.formularioTarifa.value).subscribe(
        res=>{
          if(res.status== 201){
            console.log(res, res.text());
            this.formularioTarifa.reset();
            this.listarOrdenVentaTarifas();
            this.toastr.success("Registro agregado con éxito");
            this.loaderService.hide();
            setTimeout(function () {
              document.getElementById('idTipoTarifa').focus();
            }, 20);
          }
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Actualizar un registro a Orden Venta Tarifa
  public actualizarTarifa(){
    this.formularioTarifa.get('ordenVenta').setValue({id: this.formulario.value.id});
    this.ordenVentaTarifaService.actualizar(this.formularioTarifa.value).subscribe(
      res=>{
        if(res.status==200){
          this.btnActualizarTarifa = false;
          this.listarOrdenVentaTarifas();
          this.toastr.success("Registro actualizado agregado con éxito");
        }
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    );
    this.formularioTarifa.reset();
  }
  //Abre el modal de ver Orden Venta Tarifa
  public verOrdenVentaTarifa(tarifa, indice){
    const dialogRef = this.dialog.open(VerTarifaDialogo, {
      maxWidth: '100vw',
      data: {
        tarifa: this.tipoTarifa.value,
        ordenVentaTarifa: tarifa,
        indiceSeleccionado: this.indiceSeleccionado,
        fechaActual: this.preciosDesde.value
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listarOrdenVentaTarifas();
      setTimeout(function () {
        document.getElementById('idTipoTarifa').focus();
      }, 20);
    });
  }
  //Abre el modal de ver Orden Venta Tarifa
  public modificarOrdenVentaTarifa(elemento){
    this.btnActualizarTarifa = true;
    this.formularioTarifa.patchValue(elemento);
    if(elemento.tipoTarifa.porEscala){
      this.tipoTarifa.setValue('porEscala');
      this.cambioTipoTarifa();
    }else{
      this.tipoTarifa.setValue('porTramo');
      this.cambioTipoTarifa();
    }
    this.tipoTarifa.disable();
  }
  //Abre el modal de ver Orden Venta Tarifa
  public eliminarOrdenVentaTarifa(index){
    const dialogRef = this.dialog.open(ConfirmarDialogo, {
      width: '600px',
      data: {
        formulario: null,
        porEscala: null,
        ordenVenta: null
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.listaDeTarifas.splice(index, 1);
        this.listarOrdenVentaTarifas();
        this.formularioTarifa.reset();
      }
    });
  }
  //Obtiene la lista de resultados para la pestania Listar
  public buscarLista(){
    this.listaOrdenVenta = new MatTableDataSource([]);
    if(this.formularioListar.value.tipo == 'empresa'){
      this.ordenVentaServicio.listarPorEmpresa(this.formularioListar.value.empresa.id).subscribe(
        res=>{
          this.listaOrdenVenta = new MatTableDataSource(res.json());
          this.listaOrdenVenta.sort = this.sort;
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      );
    }
    if(this.formularioListar.value.tipo == 'cliente'){
      this.ordenVentaServicio.listarPorCliente(this.formularioListar.value.cliente.id).subscribe(
        res=>{
          this.listaOrdenVenta = new MatTableDataSource(res.json());
          this.listaOrdenVenta.sort = this.sort;
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      );
    }
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.ordenventa.setValue(elemento.ordenVenta);
    this.tipoTarifa.enable();
    this.tipoTarifa.setValue('porEscala');
    this.cambioTipoTarifa();
    this.formulario.patchValue(elemento);
    this.controlaPorcentajes(elemento);

    if(elemento.empresa){
      this.tipoOrdenVenta.setValue(false);
      this.empresa.setValue(elemento.empresa.razonSocial);
      this.establecerTipo();
    }
    if(elemento.cliente){
      this.tipoOrdenVenta.setValue(true);
    }
    this.formularioTarifa.enable();
    this.listarOrdenVentaTarifas();
    this.btnActualizarOrdVta = true;
  }
  //Elimina una Orden Venta (Pestaña Listar, accion 'eliminar')
  public activarEliminar(elemento){
    const dialogRef = this.dialog.open(EliminarModalComponent, {
      width: '1100px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      let respuesta = result;
      if(respuesta){
        this.ordenVentaServicio.eliminar(elemento.id).subscribe(
          res=>{
            var respuesta = res.json();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err=>{
            let error= err.json();
            this.toastr.error(error.mensaje);
            this.loaderService.hide();
          }
        )
      }
    });
  }
  //Carga los datos de la orden de venta seleccionada en los input
  public cargarDatosOrden() {
    this.listaTarifas = [];
    this.tipoTarifa.enable();
    this.tipoTarifa.setValue('porEscala');
    let elemento = this.ordenventa.value;
    this.cambioTipoTarifa();
    this.formulario.patchValue(elemento);
    this.controlaPorcentajes(elemento);
    this.btnActualizarOrdVta = true;
    if(this.formulario.value.empresa){
      this.tipoOrdenVenta.setValue(false);
      this.listarOrdenVentaTarifas();
    }
    if(this.formulario.value.cliente){
      this.tipoOrdenVenta.setValue(true);
      this.listarOrdenVentaTarifas();
    }
    if(this.indiceSeleccionado == 3)
      this.formularioTarifa.enable();
  }
  //Controla que los porcentajes queden bien establecidos
  private controlaPorcentajes(elemento){
    if(elemento.seguro)
      this.formulario.get('seguro').setValue(this.appService.desenmascararPorcentajePorMil(elemento.seguro.toString(), 2));
    if(elemento.comisionCR == 0)
      this.formulario.get('comisionCR').setValue(this.appService.desenmascararPorcentaje('0.00', 2));
      else
      this.formulario.get('comisionCR').setValue(this.appService.desenmascararPorcentaje(elemento.comisionCR.toString(), 2));

  }
  //Obtiene la mascara de importe
  public mascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentajeDosEnteros();
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentajePorMil() {
    return this.appService.mascararPorcentajePorMil();
  }
  //Obtiene la mascara de km
  public obtenerMascaraKm(intLimite) {
    return this.appService.mascararKm(intLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if (valor != '') {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Establece los decimales de porcentaje (por mil)
  public establecerPorcentajePorMil(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentajePorMil(formulario.value, cantidad));
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararKm(formulario.value));
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }


  //Funcion para comparar y mostrar elemento del campo 'Tipo' 
  public compareT = this.compararT.bind(this);
  private compararT(a, b) {
    if (a != null && b != null) {
      return a === b;
    }
  }
  //Muestra el valor en los autocompletados
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre
        + ' - ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre : elemento;
    } else {
      return elemento;
    }
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }  
}
//Componente: dialogo para ver tarifa de Orden Venta
@Component({
  selector: 'ver-tarifa-dialogo',
  templateUrl: 'ver-tarifa-dialogo.html',
  styleUrls: ['./orden-venta.component.css']

})
export class VerTarifaDialogo {
  //Define un formulario para Orden Venta Escala o Tramo
  public formularioTramo: FormGroup;
  public formularioEscala: FormGroup;
  //Define el indice seleccionado 
  public indiceSeleccionado:number = null;
  //Define tipo tarifa
  public tipoTarifa: string = null;
  //Define la Orden Venta como un FormControl
  public ordenVenta = new FormControl();
  //Define la Fecha Actual como un FormControl
  public preciosDesde = new FormControl();
  //Define la Orden Venta Tarifa
  public ordenVentaTarifa: any=null;
  //Define importes por
  public importePor:FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Escalas Tarifas
  public listaEscalasTarifas: Array<any> = [];
  //Define la lista de resultados de busqueda tramo
  public resultadosTramos = [];
  //Define a escala como un FormControl
  public escala: FormControl = new FormControl();
  //Define a tramo como un FormControl
  public tramo: FormControl = new FormControl();
  //Define importes seco por
  public importeSecoPor:FormControl = new FormControl();
  //Define importes ref por
  public importeRefPor:FormControl = new FormControl();
  //Define la escala actual
  public escalaActual:any;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si el boton Agregar se habilita o deshabilita
  public btnAgregar: boolean = null;
  //Define el id del Tramo o Escala que se quiere modificar
  public idMod: number = null;
  //Define las columnas de las tablas
  public columnasEscala: string[] = ['escala', 'precioFijo', 'precioUnitario', 'porcentaje', 'minimo', 'mod', 'eliminar'];
  public columnasTramo: string[] = ['tramoOrigen', 'tramoDestino', 'km', 'kmPactado', 'precioFijoSeco', 'precioUnitSeco',
                                    'precioFijoRefrig', 'precioUnitRefrig', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<VerTarifaDialogo>, @Inject(MAT_DIALOG_DATA) public data, private ordenVentaEscala: OrdenVentaEscala,
  private ordenVentaTramo: OrdenVentaTramo, private ordenVentaEscalaService: OrdenVentaEscalaService, private toastr: ToastrService,
  private ordenVentaTramoService: OrdenVentaTramoService, private loaderService: LoaderService, private escalaTarifaService: EscalaTarifaService,
  private appService: AppService, private tramoService: TramoService, private ordenVentaTarifaService: OrdenVentaTarifaService) {
    dialogRef.disableClose = true;
   }
  //Al inicializarse el componente
  ngOnInit() {
    console.log(this.data.ordenVentaTarifa);
    //Inicializa valores
    this.ordenVentaTarifa = this.data.ordenVentaTarifa;
    this.listaCompleta = new MatTableDataSource([]);
    // if(!this.ordenVentaTarifa.listaOrdenVentaEscala){
    //   this.ordenVentaTarifa.listaOrdenVentaEscala = [];
    // }else{
    //   this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaEscala);
    //   this.listaCompleta.sort = this.sort;
    // }
    // if(!this.ordenVentaTarifa.listaOrdenVentaTramo){
    //   this.ordenVentaTarifa.listaOrdenVentaTramo = [];
    // }else{
    //   this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaTramo);
    //   this.listaCompleta.sort = this.sort;
    // }
    this.ordenVenta.setValue(this.ordenVentaTarifa.ordenVenta);
    this.preciosDesde.setValue(this.data.fechaActual);
    //Inicializa el Formulario 
    this.formularioEscala = this.ordenVentaEscala.formulario;
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Inicializa el indiceSeleccionado
    this.indiceSeleccionado = this.data.indiceSeleccionado;
    this.reestablecerFormularios();
    //Obtiene la lista de Escalas 
    this.listarEscalasTarifas();
    //Obtiene la lista de registros segun el tipoTarifa
    this.listar();
    //Autocompletado Tramo - Buscar por nombre
    this.formularioTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.tramoService.listarPorOrigen(data).subscribe(response => {
          this.resultadosTramos = response;
        })
      }
    });
  }
  //Obtiene la lista de Escalas Tarifas
  private listarEscalasTarifas(){
    this.escalaTarifaService.listar().subscribe(
      res=>{
        this.listaEscalasTarifas = res.json();
      }
    )
  }
  //Contrala campos vacios
  public controlarCamposVaciosTramo(formulario) {
    if(formulario.get('importeFijoSeco').value == 'NaN') {
      formulario.get('importeFijo').setValue('0.00');
    } 
    if(formulario.get('precioUnitarioSeco').value == 'NaN') {
      formulario.get('precioUnitario').setValue('0.00');
    }
    if(formulario.get('importeFijoRef').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
    if(formulario.get('precioUnitarioRef').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
    if(formulario.get('kmPactado').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
  }
  //Cancela - Resetea el formulario correspondiente
  public cancelar(){
    if(this.ordenVentaTarifa.tipoTarifa.porEscala){
      this.tipoTarifa = "porEscala";
      // this.formularioEscala.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('porcentaje').setValue(null);
      this.formularioEscala.get('minimo').setValue(null);
      this.formularioEscala.get('preciosDesde').setValue(this.data.fechaActual);
      this.controlarCampos();
    }else{
      this.tipoTarifa = "porTramo";
      // this.formularioTramo.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
      this.formularioTramo.get('importeFijoSeco').setValue('0.00');
      this.formularioTramo.get('importeFijoRef').setValue('0.00');
      this.formularioTramo.get('precioUnitarioSeco').setValue('0.00');
      this.formularioTramo.get('precioUnitarioRef').setValue('0.00');
      this.formularioTramo.get('preciosDesde').setValue(this.data.fechaActual);
    }
  }
  //Agrega un Registro a la Lista de Tarifa
  public agregar(){
    this.idMod = null;
    this.loaderService.show();
    let realizarAgregar= true;
    if(this.tipoTarifa == 'porEscala'){
      
      if(this.importePor.value == false && (this.formularioEscala.value.importeFijo == 0 || this.formularioEscala.value.importeFijo == '0.00')){
        realizarAgregar = false;
        this.toastr.error("El Precio Fijo no puede ser '0.00'");
      }
      if(this.importePor.value == true && (this.formularioEscala.value.precioUnitario == 0 || this.formularioEscala.value.precioUnitario == '0.00')){
        realizarAgregar = false;
        this.toastr.error("El Precio Unitario no puede ser '0.00'");
      }
      // if(this.ordenVentaTarifa.listaOrdenVentaEscala.length>0){
      //   realizarAgregar=this.controlarEscalaDuplicada(this.ordenVentaTarifa.listaOrdenVentaEscala);
      //   console.log(realizarAgregar);
      // }
      if(realizarAgregar==true){
        this.ordenVentaEscalaService.agregar(this.formularioEscala.value).subscribe(
          res=>{
            this.listaCompleta = new MatTableDataSource(res.json());
            this.listaCompleta.sort = this.sort;
            this.cancelar();
          },
          err=>{
            this.toastr.error("Error al agregar el registro");
            this.loaderService.hide();
          }
        )
          // this.ordenVentaTarifa.listaOrdenVentaEscala.push(this.formularioEscala.value);
          // this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaEscala);
          // this.listaCompleta.sort = this.sort;
          // this.toastr.success("Registro agregado con éxito");
          // this.cancelar();
          // this.loaderService.hide();
      }
    } 
    if(this.tipoTarifa == 'porTramo'){
      this.ordenVentaTramoService.agregar(this.formularioTramo.value).subscribe(
        res=>{
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.cancelar();
        },
        err=>{
          this.toastr.error("Error al agregar el registro");
          this.loaderService.hide();
        }
      )
      // this.formularioTramo.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
      // this.controlarCamposVaciosTramo(this.formularioTramo);
      // this.ordenVentaTarifa.listaOrdenVentaTramo.push(this.formularioTramo.value);
      // this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaTramo);
      // this.listaCompleta.sort = this.sort;
      // this.toastr.success("Registro agregado con éxito");
      // this.cancelar();
      // this.loaderService.hide();
    }
  }
  //Obtiene la lista de registros segun el tipoTarifa
  public listar(){
    console.log(this.ordenVentaTarifa);
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaEscalaService.listarPorOrdenVentaTarifa(this.ordenVentaTarifa.id).subscribe(
        res=>{
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de registros");
          this.loaderService.hide();
        }
      )
      
    }
    if(this.tipoTarifa == 'porTramo'){
      this.ordenVentaTramoService.listarPorOrdenVentaTarifa(this.ordenVentaTarifa.id).subscribe(
        res=>{
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de registros");
          this.loaderService.hide();
        }
      )
    }
  }
  //Controla que no hayan escalas duplicadas
  private controlarEscalaDuplicada(listaDeEscalas){
    // let indice = this.ordenVentaTarifa.listaOrdenVentaEscala.findIndex(x => x.escalaTarifa.id === this.formularioEscala.value.escalaTarifa.id);
    // let resultado;
    // console.log(indice);
    // if(indice > -1){
    //   this.toastr.error("No se pueden agregar escalas iguales");
    //   resultado =  false; //le pasamos un false para que no realice el agregar
    // }else{
    //   resultado =  true;
    // }
    // return resultado;
  }
  //Elimina un registro segun el tipoTarifa
  public eliminar(elemento){
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaEscalaService.eliminar(elemento.id).subscribe(
        res=>{
          var respuesta = res.json();
          this.toastr.success("Registro eliminado con éxito");
          this.reestablecerFormularios();
          this.loaderService.hide();
          this.listar();
        },
        err=>{
          let error= err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } 
    if(this.tipoTarifa == 'porTramo'){
      this.ordenVentaTramoService.eliminar(elemento.id).subscribe(
        res=>{
          var respuesta = res.json();
          this.toastr.success("Registro eliminado con éxito");
          this.reestablecerFormularios();
          this.listar();
          this.loaderService.hide();          
        },
        err=>{
          let error= err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Modifica los datos del registro seleccionado segun el tipoTarifa
  public modificar(){
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaTarifa.listaOrdenVentaEscala[this.idMod] = this.formularioEscala.value;
      this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaEscala);
      this.listaCompleta.sort = this.sort;
      this.idMod= null;
      this.toastr.success("Registro actualizado con éxito");
      this.cancelar();
      this.loaderService.hide();
    } 
    if(this.tipoTarifa == 'porTramo'){
      this.controlarCamposVaciosTramo(this.formularioTramo);
      this.ordenVentaTarifa.listaOrdenVentaTramo[this.idMod] = this.formularioTramo.value;
      this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaTramo);
      this.listaCompleta.sort = this.sort;
      this.idMod= null;
      this.toastr.success("Registro actualizado con éxito");
      this.cancelar();
      this.loaderService.hide();
    };
  }
  //Reestablece valores y formularios
  public reestablecerFormularios(){
    console.log(this.ordenVentaTarifa.tipoTarifa.porEscala);
    this.listaCompleta = new MatTableDataSource([]);
    
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.resultadosTramos = [];
    this.idMod = null;

    if(this.ordenVentaTarifa.tipoTarifa.porEscala){
      this.tipoTarifa = "porEscala";
      // this.formularioEscala.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('porcentaje').setValue(null);
      this.formularioEscala.get('minimo').setValue(null);
      this.formularioEscala.get('preciosDesde').setValue(this.data.fechaActual);
      this.controlarCampos();
    }else{
      this.tipoTarifa = "porTramo";
      // this.formularioTramo.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
      this.formularioTramo.get('importeFijoSeco').setValue('0.00');
      this.formularioTramo.get('importeFijoRef').setValue('0.00');
      this.formularioTramo.get('precioUnitarioSeco').setValue('0.00');
      this.formularioTramo.get('precioUnitarioRef').setValue('0.00');
      this.formularioTramo.get('preciosDesde').setValue(this.data.fechaActual);
    }
    

  }
  //Controla campos habilitados y deshabilitados
  private controlarCampos(){
    if(this.ordenVentaTarifa.tipoTarifa.porPorcentaje){
      console.log("entra",this.ordenVentaTarifa.tipoTarifa.porPorcentaje );
      this.importePor.disable();
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('minimo').disable();
      this.formularioEscala.get('porcentaje').enable();
      if(this.indiceSeleccionado==2 || this.indiceSeleccionado == 4){
        this.soloLectura = true;
      }
    }else{
      //Inicializa por defecto el select de 'importePor' cuando es porEscala
      if(this.indiceSeleccionado==2 || this.indiceSeleccionado == 4){
        this.soloLectura = true;
        this.importePor.disable();
      }
        else{
          this.soloLectura = false;
          this.importePor.enable();
          this.importePor.setValue(false);
        }
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('minimo').enable();
      this.formularioEscala.get('porcentaje').disable();
      this.cambioImportesPor();

    }
  }
  //Controla el modificar en Escala
  public controlModEscala(elemento, indice){
    this.formularioEscala.patchValue(elemento);
    elemento.ordenVentaTarifa = this.ordenVentaTarifa;
    this.idMod = indice;
    if (elemento.importeFijo) {
      this.formularioEscala.get('importeFijo').setValue(parseFloat(elemento.importeFijo).toFixed(2));
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.importePor.setValue(false);
      this.cambioImportesPor();
    } 
    if(elemento.precioUnitario) {
      this.formularioEscala.get('precioUnitario').setValue(parseFloat(elemento.precioUnitario).toFixed(2));
      this.formularioEscala.get('importeFijo').setValue(null);
      this.importePor.setValue(true);
      this.cambioImportesPor();
    }
    let tipoTarifa = this.formularioEscala.get('ordenVentaTarifa').value;
    if(tipoTarifa.tipoTarifa.porPorcentaje) {
      this.formularioEscala.get('porcentaje').enable();
    } else {
      this.formularioEscala.get('porcentaje').disable();
    }
    this.formularioEscala.get('porcentaje').setValue(parseFloat(elemento.porcentaje).toFixed(2));
    this.formularioEscala.get('minimo').setValue(parseFloat(elemento.minimo).toFixed(2));
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Controla el modificar en Tramo
  public controlModTramo(elemento, indice){
    this.formularioTramo.patchValue(elemento);
    this.idMod = indice;
    elemento.ordenVentaTarifa = this.ordenVentaTarifa;
    if(elemento.importeFijoSeco) {
      this.formularioTramo.get('importeFijoSeco').setValue(parseFloat(elemento.importeFijoSeco).toFixed(2));
      this.importeSecoPor.setValue(false);
      this.cambioImportesSecoPor();
    } 
    if(elemento.precioUnitarioSeco) {
      this.formularioTramo.get('precioUnitarioSeco').setValue(parseFloat(elemento.precioUnitarioSeco).toFixed(2));
      this.importeSecoPor.setValue(true);
      this.cambioImportesSecoPor();
    }
    if(elemento.importeFijoRef) {
      this.formularioTramo.get('importeFijoRef').setValue(parseFloat(elemento.importeFijoRef).toFixed(2));
      this.importeRefPor.setValue(false);
      this.cambioImportesRefPor();
    }
    if(elemento.precioUnitarioRef) {
      this.formularioTramo.get('precioUnitarioRef').setValue(parseFloat(elemento.precioUnitarioRef).toFixed(2));
      this.importeRefPor.setValue(true);
      this.cambioImportesRefPor();
    }
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Elimina un Tramo a listaDeTramos
  public controlEliminarTramo(indice) {
    this.ordenVentaTarifa.listaOrdenVentaTramo.splice(indice, 1);
    this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaTramo);
    this.listaCompleta.sort = this.sort;
    this.toastr.success("Registro eliminado con éxito");
  }
  //Elimina una Escala de listaDeEscalas
  public controlEliminarEscala(indice) {
    this.ordenVentaTarifa.listaOrdenVentaEscala.splice(indice, 1);
    this.listaCompleta = new MatTableDataSource(this.ordenVentaTarifa.listaOrdenVentaEscala);
    this.listaCompleta.sort = this.sort;
    this.toastr.success("Registro eliminado con éxito");      
  }
  //Al cambiar select importes seco por
  public cambioImportesSecoPor(): void {
    let importesPor = this.importeSecoPor.value;
    if(!importesPor) {
      this.formularioTramo.get('importeFijoSeco').enable();
      this.formularioTramo.get('importeFijoSeco').setValidators([Validators.required]);
      this.formularioTramo.get('precioUnitarioSeco').setValidators([]);
      this.formularioTramo.get('precioUnitarioSeco').setValue(null);
      this.formularioTramo.get('precioUnitarioSeco').disable();
    } else {
      this.formularioTramo.get('precioUnitarioSeco').enable();
      this.formularioTramo.get('precioUnitarioSeco').setValidators([Validators.required]);
      this.formularioTramo.get('importeFijoSeco').setValidators([]);
      this.formularioTramo.get('importeFijoSeco').setValue(null);
      this.formularioTramo.get('importeFijoSeco').disable();
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramo(tipoPrecio) {
    switch (tipoPrecio) {
      case 1:
        let importeFijoSeco = this.formularioTramo.get('importeFijoSeco').value;
        if (importeFijoSeco) {
          this.formularioTramo.get('importeFijoSeco').setValue(this.appService.establecerDecimales(importeFijoSeco, 2));
          this.formularioTramo.get('importeFijoSeco').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioSeco').setValidators([]);
          this.formularioTramo.get('precioUnitarioSeco').setValue(null);
        }
        break;
      case 2:
        let precioUnitarioSeco = this.formularioTramo.get('precioUnitarioSeco').value;
        if (precioUnitarioSeco) {
          this.formularioTramo.get('precioUnitarioSeco').setValue(this.appService.establecerDecimales(precioUnitarioSeco, 2));
          this.formularioTramo.get('precioUnitarioSeco').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoSeco').setValidators([]);
          this.formularioTramo.get('importeFijoSeco').setValue(null);
        }
        break;
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramoRef(tipoPrecio) {
    switch (tipoPrecio) {
      case 1:
        let importeFijoRef = this.formularioTramo.get('importeFijoRef').value;
        if (importeFijoRef) {
          this.formularioTramo.get('importeFijoRef').setValue(this.appService.establecerDecimales(importeFijoRef, 2));
          this.formularioTramo.get('importeFijoRef').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioRef').setValidators([]);
          this.formularioTramo.get('precioUnitarioRef').setValue(null);
        }
        break;
      case 2:
        let precioUnitarioRef = this.formularioTramo.get('precioUnitarioRef').value;
        if (precioUnitarioRef) {
          this.formularioTramo.get('precioUnitarioRef').setValue(this.appService.establecerDecimales(precioUnitarioRef, 2));
          this.formularioTramo.get('precioUnitarioRef').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoRef').setValidators([]);
          this.formularioTramo.get('importeFijoRef').setValue(null);
        }
        break;
    }
  }
  //Al cambiar select importes por
  public cambioImportesPor(): void {
    let importesPor = this.importePor.value;
    if(importesPor) {
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('precioUnitario').setValidators([Validators.required]);
      this.formularioEscala.get('importeFijo').setValidators([]);
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('minimo').enable();
    } else {
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('importeFijo').setValidators([Validators.required]);
      this.formularioEscala.get('precioUnitario').setValidators([]);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('minimo').disable();
    }
  }
  //Al cambiar select importes ref por
  public cambioImportesRefPor(): void {
    let importesPor = this.importeRefPor.value;
    if(!importesPor) {
      this.formularioTramo.get('importeFijoRef').enable();
      this.formularioTramo.get('importeFijoRef').setValidators([Validators.required]);
      this.formularioTramo.get('precioUnitarioRef').setValidators([]);
      this.formularioTramo.get('precioUnitarioRef').setValue(null);
      this.formularioTramo.get('precioUnitarioRef').disable();
    } else {
      this.formularioTramo.get('precioUnitarioRef').enable();
      this.formularioTramo.get('precioUnitarioRef').setValidators([Validators.required]);
      this.formularioTramo.get('importeFijoRef').setValidators([]);
      this.formularioTramo.get('importeFijoRef').setValue(null);
      this.formularioTramo.get('importeFijoRef').disable();
    }
  }
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre
        + ' - ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Manejo de cambio de autocompletado tramo
  public cambioAutocompletadoTramo() {
    this.formularioTramo.get('kmTramo').setValue(this.formularioTramo.get('tramo').value.km);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if (valor) {
      return this.appService.establecerDecimales(valor, cantidad);
    }else{
      return '0.00';
    }
  }
  //Establece los decimales de porcentaje
  public setPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(valor, cantidad) {
    if (valor) {
      return this.appService.desenmascararPorcentaje(valor.toString(), cantidad);
    }else{
      return '0.00';
    }
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararKm(formulario.value));
  }
  //Obtiene la mascara de importe
  public mascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentajeDosEnteros();
  }
  //Obtiene la mascara de km
  public obtenerMascaraKm(intLimite) {
    return this.appService.mascararKm(intLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Muestra el valor en los autocompletados
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
    document.getElementById('idActualizacion').focus();
  } 
}
// //Componente: dialogo para modificar tarifa de Orden Venta
// @Component({
//   selector: 'modificar-tarifa-dialogo',
//   templateUrl: 'modificar-tarifa-dialogo.html',
// })
// export class ModificarTarifaDialogo {
//   //Define la empresa 
//   public fecha: string;
//   //Define la variable como un booleano
//   public porEscala: boolean;
//   //Define la lista de usuarios activos de la empresa
//   public listaPrecios: Array<any> = [];
//   //Define las columnas de la tabla
//   public columnas: string[] = ['id', 'escala', 'precioFijo', 'precioUnitario', 'porcentaje', 'minimo', 'mod', 'eliminar'];
//   //Define la matSort
//   @ViewChild(MatSort) sort: MatSort;
//   //Define el mostrar del circulo de progreso
//   public show = false;
//   //Define la subscripcion a loader.service
//   private subscription: Subscription;
//   //Constructor
//   constructor(public dialogRef: MatDialogRef<ModificarTarifaDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
//   //Al inicializarse el componente
//   ngOnInit() {
//     this.listaPrecios = this.data.listaFiltrada;
//     this.fecha = this.data.fecha;
//     this.porEscala = this.data.porEscala; //controlo que tabla muestro en el modal
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//     document.getElementById('idActualizacion').focus();
//   }
// }
// //Componente: dialogo para eliminar tarifa de Orden Venta
// @Component({
//   selector: 'eliminar-tarifa-dialogo',
//   templateUrl: 'eliminar-tarifa-dialogo.html',
// })
// export class EliminarTarifaDialogo {
//   //Define la empresa 
//   public fecha: string;
//   //Define la variable como un booleano
//   public porEscala: boolean;
//   //Define la lista de usuarios activos de la empresa
//   public listaPrecios: Array<any> = [];
//   //Define las columnas de la tabla
//   public columnas: string[] = ['id', 'escala', 'precioFijo', 'precioUnitario', 'porcentaje', 'minimo', 'mod', 'eliminar'];
//   //Define la matSort
//   @ViewChild(MatSort) sort: MatSort;
//   //Define el mostrar del circulo de progreso
//   public show = false;
//   //Define la subscripcion a loader.service
//   private subscription: Subscription;
//   //Constructor
//   constructor(public dialogRef: MatDialogRef<EliminarTarifaDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
//   //Al inicializarse el componente
//   ngOnInit() {
//     this.listaPrecios = this.data.listaFiltrada;
//     this.fecha = this.data.fecha;
//     this.porEscala = this.data.porEscala; //controlo que tabla muestro en el modal
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//     document.getElementById('idActualizacion').focus();
//   }
// }