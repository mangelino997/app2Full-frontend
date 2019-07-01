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
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  public formularioTarifa: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioEscala: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioTramo: FormGroup;
  //Define el elemento de autocompletado
  public elemAutocompletado: any = null;
  //Define el siguiente id
  public siguienteId: number = null;
  //Define el id del Tramo que se quiere modificar
  public idModTramo: number = null;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  //Define el nombre de la Empresa Actual
  public empresa: FormControl = new FormControl();
  //Define la opcion (SELECT) Tipo Tarifa como un FormControl
  public tipoTarifa: FormControl = new FormControl();
  //Define la lista de tarifas para el Tipo Tarifa
  public listaTarifas: any = [];
  //Define la lista de Tarifas para un id Orden de Venta 
  public listaTarifasDeOrdVta= new MatTableDataSource([]);
  //Define la lista de tramos para la segunda tabla
  public listaTramos: any = [];
  //Define el form control para las busquedas
  public buscar: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
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
  //Define el id de la tabla escala para las actualizaciones
  public idModEscala: any;
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
  //Bandera boolean para determinar si ya se creo una orden venta (cambia el boton "crear orden venta" a "actualizar orden venta")
  public btnActualizarOrdVta: boolean= false;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'listaPrecio', 'precioDesde', 'ver', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private empresaSevicio: EmpresaService, private clienteServicio: ClienteService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService, public dialog: MatDialog,
    private escalaTarifaServicio: EscalaTarifaService, private appService: AppService,
    private tramoServicio: TramoService, private ordenVenta: OrdenVenta, private ordenVentaServicio: OrdenVentaService,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ordenVentaTramoServicio: OrdenVentaTramoService,
    private loaderService: LoaderService, private ordenVentaTarifa: OrdenVentaTarifa, private ordenVentaTarifaService: OrdenVentaTarifaService) {
      //Obtiene la lista de pestania por rol y subopcion
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
    //Define el formulario de orden venta y orden venta tarifa
    this.formulario = this.ordenVenta.formulario;
    this.formularioTarifa = this.ordenVentaTarifa.formulario;    
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Selecciona la pestania agregar por defecto
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado - Buscar por nombre cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    });
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
          this.listaTarifas = res.json();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de Tarifas por Escala");
        }
      )
    }else {
      this.tipoTarifaServicio.listarPorTramo().subscribe(
        res=>{
          this.listaTarifas = res.json();
        },
        err=>{
          this.toastr.error("Error al obtener la lista de Tarifas por Tramo");
        }
      )
    }
    // if (tipoTarifa) {
    //   if (!tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
    //     this.formularioEscala.get('porcentaje').setValue(null);
    //     this.formularioEscala.get('porcentaje').disable();
    //     this.tipoTarifaEstado = false;
    //   } else if (tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
    //     this.formularioEscala.get('importeFijo').setValue(null);
    //     this.formularioEscala.get('precioUnitario').setValue(null);
    //     this.formularioEscala.get('importeFijo').disable();
    //     this.formularioEscala.get('precioUnitario').disable();
    //     this.formularioEscala.get('porcentaje').enable();
    //     this.tipoTarifaEstado = true;
    //   } else if(!tipoTarifa.porPorcentaje && !tipoTarifa.porEscala) {
    //     this.importeSecoPor.setValue(false);
    //     this.importeRefPor.setValue(false);
    //     this.cambioImportesSecoPor();
    //     this.cambioImportesRefPor();
    //   }
    // }
  }
  //Establece el tipo (empresa o cliente)
  public establecerTipo(): void {
    // this.reestablecerCampos(null);
    let tipoOrdenVenta = this.formulario.get('tipoOrdenVenta').value;
    console.log(tipoOrdenVenta);
    if (!tipoOrdenVenta) {
      this.listarOrdenesVentas('empresa');
      // this.formulario.get('cliente').setValidators([]);
    } 
  }
  //Listar ordenes de ventas por Empresa/Cliente
  public listarOrdenesVentas(tipo) {
    this.loaderService.show();
    switch (tipo) {
      case 'empresa':
        // this.establecerCamposSoloLectura(this.indiceSeleccionado);
        this.establecerEmpresa();
        this.formulario.get('cliente').setValue(null);
        this.ordenVentaServicio.listarPorEmpresa(this.formulario.get('empresa').value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
          }
        );
        break;
      case 'cliente':
        // this.reestablecerCampos(this.formulario.get('cliente').value);
        // this.establecerCamposSoloLectura(this.indiceSeleccionado);
        // this.formulario.get('cliente').setValue(this.formulario.get('cliente').value);
        this.formulario.get('empresa').setValue({id: null});
        this.ordenVentaServicio.listarPorCliente(this.formulario.get('cliente').value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
          }
        );
        break;
    }
  }
  //Establece los datos de la empresa actual
  private establecerEmpresa(){
    let empresa = this.appService.getEmpresa();
    console.log(this.formulario.value, empresa);
    this.empresa.setValue(empresa.razonSocial);
    if(empresa) 
      this.formulario.get('empresa').setValue(empresa);

  }
  
  //Reestablecer campos
  private reestablecerCampos() {
    this.formulario.reset();
    this.formularioTarifa.reset();
    this.btnActualizarOrdVta = false;
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.ordenventa.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.tipoTarifa.setValue('porEscala');
    this.establecerValoresPorDefecto();
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('empresa').disable();
    if (this.indiceSeleccionado != 1) {
      this.formularioTarifa.get('tipoTarifa').disable();
      this.formularioTarifa.get('preciosDesde').disable();
      this.tipoTarifa.disable();
    }
    if (this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      // this.formulario.get('vendedor').disable();
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    // this.formulario.get('tipoOrdenVenta').setValue(tipoOrdenVenta);
    this.formulario.get('seguro').setValue(this.appService.desenmascararPorcentaje('8', 2));
    this.formulario.get('comisionCR').setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('esContado').setValue(false);
    // this.cambioImportesPor();
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
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
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
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
        this.agregar();
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
  private agregar() {
    this.loaderService.show();
    console.log(this.formulario.value);
    this.ordenVentaServicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          // this.listarEscalaTarifa();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.habilitarFormTarifa(true);
          this.btnActualizarOrdVta = true;
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    console.log(this.formulario.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.establecerValoresPorDefecto();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.habilitarFormTarifa(true);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro actualizado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
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
        // this.formularioEscala.get('importeFijo').enable();
        // this.importePor.enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        // this.cambioTipoTarifa();
        // this.cambioImportesPor();
        break;
      case 2:
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        // this.formularioEscala.get('importeFijo').disable();
        // this.importePor.disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        break;
      case 3:
        this.formulario.get('vendedor').enable();
        this.formulario.get('esContado').enable();
        this.formularioEscala.get('importeFijo').enable();
        this.importePor.enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        // this.cambioTipoTarifa();
        // this.cambioImportesPor();
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
  //Obtiene la lista de precios desde (cuando indiceSeleccionado!=1)
  // private obtenerPreciosDesde() {
  //   this.loaderService.show();
  //   let opcion = this.formulario.get('tipoTarifa').value.porEscala;
  //   if (opcion) {
  //     this.ordenVentaEscalaServicio.listarFechasPorOrdenVenta(this.ordenventa.value.id).subscribe(
  //       res => {
  //         this.preciosDesdeLista = res.json();
  //         this.loaderService.hide();
  //       }
  //     );
  //   } else {
  //     this.ordenVentaTramoServicio.listarFechasPorOrdenVenta(this.ordenventa.value.id).subscribe(
  //       res => {
  //         this.preciosDesdeLista = res.json();
  //         this.loaderService.hide();
  //       }
  //     );
  //   }
  // }
  //Habilita o deshabilita el Formulario de Orden Venta Tarifa
  public habilitarFormTarifa(estado){
    if(estado){
      this.formularioTarifa.get('tipoTarifa').enable();
      this.formularioTarifa.get('preciosDesde').enable();
      this.tipoTarifa.enable();
      this.listarOrdenVentaTarifas();
    }else{
      this.formularioTarifa.get('tipoTarifa').disable();
      this.formularioTarifa.get('preciosDesde').disable();
      this.tipoTarifa.disable();
    }
  }
  //Obtiene la lista de Orden Venta Tarifas por el id de la Orden Venta creada
  private listarOrdenVentaTarifas(){
    this.ordenVentaTarifaService.listarPorOrdenVenta(this.formulario.value.id).subscribe(
      res=>{
        console.log(res.json());
        // this.listaTarifasDeOrdVta = res.json();
        this.listaTarifasDeOrdVta = new MatTableDataSource(res.json());
        this.listaTarifasDeOrdVta.sort = this.sort;
      },
      err=>{
        let error= err.json();
        this.toastr.error(error.mensaje);
      }
    )
  }
  //Agrega un registro a Orden Venta Tarifa
  public agregarTarifa(){
    console.log(this.formularioTarifa.value);
    this.formularioTarifa.get('ordenVenta').setValue({id: this.formulario.value.id});
    this.ordenVentaTarifaService.agregar(this.formularioTarifa.value).subscribe(
      res=>{
        console.log(res.json());
        this.listarOrdenVentaTarifas();
      }
    )
  }
  //Abre el modal de ver Orden Venta Tarifa
  public verOrdenVentaTarifa(tarifa, indice){
    console.log(tarifa);
    const dialogRef = this.dialog.open(VerTarifaDialogo, {
      width: '1100px',
      data: {
        tarifa: tarifa.tipoTarifa,
        ordenVentaTarifa: tarifa.ordenVenta
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(function () {
        document.getElementById('idActualizacion').focus();
      }, 20);
    });
  }
  //Abre el modal de ver Orden Venta Tarifa
  public modificarOrdenVentaTarifa(elemento){
    this.formularioTarifa.patchValue(elemento);
    console.log(this.formulario.value);
    
  }
  //Abre el modal de ver Orden Venta Tarifa
  public eliminarOrdenVentaTarifa(elemento){
    console.log(elemento);
    this.loaderService.show();
    this.ordenVentaTarifaService.eliminar(elemento.id).subscribe(
      res=>{
        var respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
        this.listarOrdenVentaTarifas()
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Obtiene la mascara de importe
  public mascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
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
})
export class VerTarifaDialogo {
  //Define un formulario para Orden Venta Escala o Tramo
  public formularioTramo: FormGroup;
  public formularioEscala: FormGroup;
  //Define tipo tarifa
  public tipoTarifa: any = null;
  //Define la Orden Venta
  public ordenVentaTarifa: any=null;
  //Define el campo importe por
  public importePor: any = null;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Escalas Tarifas
  public listaEscalasTarifas: Array<any> = [];
  //Define a escala como un FormControl
  public escala: FormControl = new FormControl();
  //Define a tramo como un FormControl
  public tramo: FormControl = new FormControl();
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'escala', 'precioFijo', 'precioUnitario', 'porcentaje', 'minimo', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<VerTarifaDialogo>, @Inject(MAT_DIALOG_DATA) public data, private ordenVentaEscala: OrdenVentaEscala,
  private ordenVentaTramo: OrdenVentaTramo, private ordenVentaEscalaService: OrdenVentaEscalaService, private toastr: ToastrService,
  private ordenVentaTramoService: OrdenVentaTramoService, private loaderService: LoaderService, private escalaTarifaService: EscalaTarifaService) {

   }
  //Al inicializarse el componente
  ngOnInit() {
    //Inicializa valores
    this.tipoTarifa = this.data.tarifa; 
    this.ordenVentaTarifa = this.data.ordenVentaTarifa;
    console.log(this.tipoTarifa, this.ordenVentaTarifa);
    //Inicializa el Formulario 
    this.formularioEscala = this.ordenVentaEscala.formulario;
    this.formularioEscala.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
    this.formularioTramo = this.ordenVentaTramo.formulario;
    this.formularioTramo.get('ordenVentaTarifa').setValue(this.ordenVentaTarifa);
    //Obtiene la lista de Escalas 
    this.listarEscalasTarifas();
    //Obtiene la lista de registros segun el tipoTarifa
    this.listar();
    console.log(this.formularioTramo.value, this.formularioEscala.value);
  }
  //Obtiene la lista de Escalas Tarifas
  private listarEscalasTarifas(){
    this.escalaTarifaService.listar().subscribe(
      res=>{
        this.listaEscalasTarifas = res.json();
      }
    )
  }
  //Agrega un Registro a la Lista de Tarifa
  public agregar(){
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaEscalaService.agregar(this.formularioEscala.value).subscribe(
        res=>{
          var respuesta = res.json();
          if (respuesta.codigo == 201) {
            setTimeout(function () {
              document.getElementById('idEscala').focus();
            }, 20);
          this.toastr.success(respuesta.mensaje);
          this.formularioEscala.reset();
          this.loaderService.hide();
          this.listar();
          }        
        },
        err=>{
          let error= err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } 
    if(this.tipoTarifa == 'porTramo'){
      this.ordenVentaTramoService.agregar(this.formularioTramo.value).subscribe(
        res=>{
          var respuesta = res.json();
          if (respuesta.codigo == 201) {
            setTimeout(function () {
              document.getElementById('idEscala').focus();
            }, 20);
          this.toastr.success(respuesta.mensaje);
          this.formularioTramo.reset();
          this.loaderService.hide();
          this.listar();
          }        
        },
        err=>{
          let error= err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Obtiene la lista de registros segun el tipoTarifa
  public listar(){
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaEscalaService.listarPorOrdenVenta(this.ordenVentaTarifa.id).subscribe(
        res=>{
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err=>{
          let error= err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
    if(this.tipoTarifa == 'porTramo'){
      this.ordenVentaTramoService.listarPorOrdenVenta(this.ordenVentaTarifa.id).subscribe(
        res=>{
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
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
  //Elimina un registro segun el tipoTarifa
  public eliminar(elemento){
    console.log(elemento.id);
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.ordenVentaEscalaService.eliminar(elemento.id).subscribe(
        res=>{
          var respuesta = res.json();
          this.toastr.success(respuesta.mensaje);
          this.formularioEscala.reset();
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
          this.toastr.success(respuesta.mensaje);
          this.formularioTramo.reset();
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
  public modificar(elemento){
    this.loaderService.show();
    if(this.tipoTarifa == 'porEscala'){
      this.formularioEscala.patchValue(elemento);
      this.ordenVentaEscalaService.actualizar(elemento.id).subscribe(
        res=>{
          let respuesta = res.json();
          if (respuesta.codigo == 200) {
            setTimeout(function () {
              document.getElementById('idTipoOrdenVenta').focus();
            }, 20);
          }
          this.toastr.success(respuesta.mensaje);
          this.formularioEscala.reset();
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
    if(this.tipoTarifa == 'porTramo'){
      this.formularioTramo.patchValue(elemento);
      this.ordenVentaTramoService.actualizar(elemento.id).subscribe(
        res=>{
          var respuesta = res.json();
          if (respuesta.codigo == 200) {
            setTimeout(function () {
              document.getElementById('idTipoOrdenVenta').focus();
            }, 20);
          }
          this.toastr.success(respuesta.mensaje);
          this.formularioTramo.reset();
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