import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { ReporteService } from 'src/app/servicios/reporte.service';

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
  //Define si el campo es de solo en el Actualizar
  public soloLecturaMod: boolean = false;
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
  public formularioFiltro: FormGroup;
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
  public tipoOrdenVenta: FormControl = new FormControl('', Validators.required);
  //
  public columnasMostradas: FormControl = new FormControl();
  //Define la opcion (SELECT) Tipo Tarifa como un FormControl
  public tipoTarifa: FormControl = new FormControl();
  //Define la lista de tarifas para el Tipo Tarifa
  public listaTarifas: any = [];
  //Define la lista de Tarifas para un id Orden de Venta 
  public listaTarifasDeOrdVta = new MatTableDataSource([]);
  //Define la lista de Orden Vta para la pestania Listar
  public listaOrdenVenta = new MatTableDataSource([]);
  //Define la lista de los resultados para la pestaña LISTAR
  public resultados = new MatTableDataSource([]);
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
  public importePor: FormControl = new FormControl();
  //Define importes seco por
  public importeSecoPor: FormControl = new FormControl();
  //Define importes ref por
  public importeRefPor: FormControl = new FormControl();
  //Define la escala actual
  public escalaActual: any;
  //Define la cantidad de resultados que trae listaTarifasDeOrdVta
  public lengthTable: number = 0;
  //Define si muestra el boton de orden venta (en actualizat, eliminar)
  public btnOrdenVta: boolean = false;
  //Bandera boolean para determinar si modifica o agrega un atarifa
  public btnActualizarTarifa: boolean = false;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'tarifa', 'escala', 'porPorcentaje', 'ver', 'eliminar'];
  //Define las columnas de la tabla para la pestaña LISTAR
  public columnasListar: string[] = ['ID', 'DESCRIPCION', 'VENDEDOR', 'SEGURO', 'ES_CONTADO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private clienteServicio: ClienteService, private fechaService: FechaService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService, public dialog: MatDialog,
    private appService: AppService, private ordenVenta: OrdenVenta,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo,
    private loaderService: LoaderService, private ordenVentaTarifa: OrdenVentaTarifa, private ordenVentaTarifaService: OrdenVentaTarifaService,
    private reporteServicio: ReporteService) {
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
    //Define el formulario de orden venta
    this.formulario = this.ordenVenta.formulario;
    //Define el formulario de orden venta tarifa
    this.formularioTarifa = this.ordenVentaTarifa.formulario;
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Define el formulario para la pestaña listar
    this.formularioFiltro = new FormGroup({
      tipo: new FormControl('', Validators.required),
      cliente: new FormControl(),
      empresa: new FormControl()
    });
    //Habilita el formulario de Orden Venta
    this.formulario.enable();
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Selecciona la pestania agregar por defecto
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado - Buscar por nombre cliente
    this.cliente.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response.json();
        })
      }
    });
    //Autocompletado - Buscar por nombre cliente - Pestania Listar
    this.formularioFiltro.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response.json();
        })
      }
    });
  }
  //Establece el id de la Orden Venta (cabecera)
  public establecerOrdenVentaCabecera(ordenCabecera) {
    this.ORDEN_VTA_CABECERA = ordenCabecera;
    this.formulario.value.id = ordenCabecera;
  }
  //Obtiene el id para la orden venta
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
        let error = err.json();
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
  //Cambio tipo orden venta
  public cambioTipoOrdenVenta(): void {
    this.ordenesVentas = [];
    let tipo = this.tipoOrdenVenta.value;
    if (!tipo) {
      this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
    }
  }
  //Cambio tipo tarifa
  public cambioTipoTarifa(): void {
    this.listaTarifas = [];
    if (this.tipoTarifa.value == 'porEscala') {
      this.tipoTarifaServicio.listarPorEscala().subscribe(
        res => {
          this.listaTarifas = res.json();
        },
        err => {
          this.toastr.error("No se pudo obtener las tarifas por escala");
        }
      )
    }
    if (this.tipoTarifa.value == 'porTramo') {
      this.tipoTarifaServicio.listarPorTramo().subscribe(
        res => {
          this.listaTarifas = res.json();
        },
        err => {
          this.toastr.error("No se pudo obtener las tarifas por tramo");
        }
      )
    }
  }
  //Establece el tipo (empresa o cliente)
  public establecerTipoEnListar() {
    this.listaOrdenVenta = new MatTableDataSource([]);
    let tipo = this.formularioFiltro.get('tipo').value;
    if (tipo == 'empresa') {
      let empresa = this.appService.getEmpresa();
      this.empresa.setValue(empresa.razonSocial);
      this.formularioFiltro.get('empresa').setValue(empresa);
      this.formularioFiltro.get('cliente').setValue(null);
      this.formularioFiltro.get('cliente').setValidators([]);
      this.formularioFiltro.get('empresa').setValidators(Validators.required);
      this.formularioFiltro.get('cliente').updateValueAndValidity();//Actualiza las validaciones en el Formulario de la pestaña listar
    }
    if (tipo == 'cliente') {
      this.formularioFiltro.get('empresa').setValue(null);
      this.formularioFiltro.get('empresa').setValidators([]);
      this.formularioFiltro.get('cliente').setValidators(Validators.required);
      this.formularioFiltro.get('empresa').updateValueAndValidity();//Actualiza las validaciones en el Formulario de la pestaña listar
    }
  }
  //Lista las ordenes de ventas por Empresa o Cliente
  public listarOrdenesVentas(tipo, id) {
    this.loaderService.show();
    if (this.indiceSeleccionado != 1) {
      switch (tipo) {
        case 'empresa':
          this.servicio.listarPorEmpresa(id).subscribe(
            res => {
              this.ordenesVentas = res.json();
              this.loaderService.hide();
            },
            err => {
              this.toastr.error("No se pudo obtener las ordenes de venta");
              this.loaderService.hide();
            }
          );
          break;
        case 'cliente':
          this.servicio.listarPorCliente(id).subscribe(
            res => {
              this.ordenesVentas = res.json();
              this.loaderService.hide();
            },
            err => {
              this.toastr.error("No se pudo obtener las ordenes de venta");
              this.loaderService.hide();
            }
          );
          break;
      }
    }
  }
  //Reestablecer campos
  private reestablecerCampos() {
    this.formulario.reset();
    this.formularioTarifa.reset();
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.formularioFiltro.reset();
    this.elemAutocompletado = null;
    this.soloLectura = false;
    this.tipoOrdenVenta.enable();
    this.formulario.enable();
    this.tipoTarifa.enable();
    this.cliente.reset();
    this.vaciarLista();
    this.ordenventa.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.btnOrdenVta = false;
    this.empresa.reset();
    let empresa = this.appService.getEmpresa();
    this.formulario.value.empresas = [empresa];
    this.empresa.setValue(empresa.razonSocial);
    this.establecerValoresPorDefecto();
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('esContado').setValue(true);
    this.formulario.get('estaActiva').setValue(true);
    this.soloLecturaMod = false;
    this.tipoOrdenVenta.setValue(false);
    this.fechaService.obtenerFecha().subscribe(res => {
      this.preciosDesde.setValue(res.json());
    });
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
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerCampos();
    switch (id) {
      case 1:
        //Obtiene el id para la orden venta
        this.obtenerSiguienteId();
        this.establecerCamposSoloLectura(1);
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
        break;
      case 2:
        this.establecerCamposSoloLectura(2);
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
        //Obtiene la lista de ordenes de venta por empresa actual
        this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
        break;
      case 3:
        this.establecerCamposSoloLectura(3);
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
        //Obtiene la lista de ordenes de venta por empresa actual
        this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
        break;
      case 4:
        this.establecerCamposSoloLectura(4);
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoOrdenVenta');
        //Obtiene la lista de ordenes de venta por empresa actual
        this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
        break;
      case 5:
        this.formularioFiltro.get('tipo').setValue('empresa');
        this.establecerTipoEnListar();
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregarOrdenVenta();
        break;
      case 3:
        this.actualizarOrdenVenta();
        break;
      case 4:
        let id = this.formulario.get('id').value;
        this.eliminar(id, true);
        break;
      default:
        break;
    }
  }
  //Establece campos solo lectura
  private establecerCamposSoloLectura(pestania): void {
    switch (pestania) {
      case 1:
        this.formulario.get('vendedor').enable();
        this.formulario.get('esContado').enable();
        this.formulario.get('estaActiva').enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        this.formularioTarifa.enable();
        this.tipoTarifa.enable();
        this.btnOrdenVta = false;
        break;
      case 2:
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        this.formulario.get('estaActiva').disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        this.formularioTarifa.disable();
        this.tipoTarifa.disable();
        this.btnOrdenVta = false;
        break;
      case 3:
        this.formulario.get('vendedor').enable();
        this.formulario.get('esContado').enable();
        this.formulario.get('estaActiva').enable();
        this.formularioEscala.get('importeFijo').enable();
        this.importePor.enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        this.formularioTarifa.enable();
        this.tipoTarifa.enable();
        this.btnOrdenVta = true;
        break;
      case 4:
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        this.formularioEscala.get('importeFijo').disable();
        this.importePor.disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        this.formularioTarifa.disable();
        this.tipoTarifa.disable();
        this.btnOrdenVta = true;
        break;
    }
  }
  //Obtiene la lista de Orden Venta Tarifas por el id de la Orden Venta creada
  private listarTarifasOrdenVenta() {
    this.loaderService.show();
    this.listaTarifasDeOrdVta = null;
    this.ordenVentaTarifaService.listarPorOrdenVenta(this.ORDEN_VTA_CABECERA).subscribe(
      res => {
        this.listaTarifasDeOrdVta = new MatTableDataSource(res.json());
        this.listaTarifasDeOrdVta.sort = this.sort;
        if (this.listaTarifasDeOrdVta.data.length > 0) {
          this.tipoTarifa.setValue(this.listaTarifasDeOrdVta.data[0].tipoTarifa.porEscala ? 'porEscala' : 'porTramo');
          this.tipoTarifa.disable();
          this.cambioTipoTarifa();
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error("No se pudo obtener las tarifas");
        this.loaderService.hide();
      }
    )
  }
  //Agrega un registro a Orden Venta Tarifa
  public agregarTarifa() {
    this.loaderService.show();
    if (this.listaTarifasDeOrdVta.data.length == 0) {
      let usuarioAlta = this.appService.getUsuario();
      let empresa = this.appService.getEmpresa();
      this.formulario.get('id').setValue(null);
      this.formulario.get('ordenesVentasTarifas').setValue(this.formularioTarifa.value);
      if (!this.formulario.get('seguro').value) {
        this.formulario.get('seguro').setValue(this.appService.setDecimales('7', 2));
      }
      this.formulario.get('comisionCR').setValue(0.00);
      this.servicio.agregar(this.formulario.value, usuarioAlta, empresa, this.cliente.value).then(
        res => {
          if (res.status == 201) {
            let respuesta = res.json();
            respuesta.then(
              data => {
                this.formularioTarifa.reset();
                this.establecerOrdenVentaCabecera(data.id);
                this.soloLectura = true;
                this.listarTarifasOrdenVenta();
                this.formulario.disable();
                this.tipoOrdenVenta.disable();
                this.toastr.success("Registro agregado con éxito");
                this.loaderService.hide();
                document.getElementById('idTipoTarifa').focus();
              }
            );
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.formularioTarifa.get('ordenVenta').setValue({ id: this.ORDEN_VTA_CABECERA });
      this.ordenVentaTarifaService.agregar(this.formularioTarifa.value).subscribe(
        res => {
          if (res.status == 201) {
            this.formularioTarifa.reset();
            this.listarTarifasOrdenVenta();
            document.getElementById('idTipoTarifa').focus();
            this.toastr.success("Registro agregado con éxito");
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          if (error.codigo == 11025) {
            this.toastr.error(MensajeExcepcion.DD_ORDENVENTATARIFA_TIPOTARIFA);
          } else {
            this.toastr.error(error.mensaje);
          }
          this.formularioTarifa.get('tipoTarifa').reset();
          document.getElementById('idTipoTarifa').focus();
          this.loaderService.hide();
        }
      )
    }
  }
  //Reestablece los campos al agregar orden de venta
  public agregarOrdenVenta(): void {
    this.reestablecerCampos();
    document.getElementById('idTipoOrdenVenta').focus();
    this.toastr.success('Registro agregado con éxito');
  }
  //Actualiza una orden de venta
  public actualizarOrdenVenta(): void {
    this.loaderService.show();
    if (!this.formulario.get('seguro').value) {
      this.formulario.get('seguro').setValue(this.appService.setDecimales('7', 2));
    }
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (res.status == 200) {
          this.reestablecerCampos();
          this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
          document.getElementById('idTipoOrdenVenta').focus();
          this.toastr.success(respuesta.mensaje);
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
  //Actualizar un registro a Orden Venta Tarifa
  public eliminar(id, opcion) {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loaderService.show();
        this.servicio.eliminar(id).subscribe(
          res => {
            if (res.status == 200) {
              if (opcion) {
                this.establecerCamposSoloLectura(4);
                this.establecerValoresPestania('Eliminar', true, true, true, 'idTipoOrdenVenta');
                //Obtiene la lista de ordenes de venta por empresa actual
                this.listarOrdenesVentas('empresa', this.appService.getEmpresa().id);
                document.getElementById('idTipoOrdenVenta').focus();
              } else {
                this.buscarLista();
              }
              this.toastr.success("Registro eliminado con éxito");
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
    });
  }
  //Finaliza la orden de venta
  public finalizar(): void {

  }
  //Abre el modal de ver Orden Venta Tarifa
  public verTarifaOrdenVenta(tarifa) {
    const dialogRef = this.dialog.open(VerTarifaDialogo, {
      width: '95%',
      data: {
        tarifa: this.tipoTarifa.value,
        ordenVentaTarifa: tarifa,
        indiceSeleccionado: this.indiceSeleccionado,
        fechaActual: this.preciosDesde.value,
        ordenVentaActiva: this.formulario.get('estaActiva').value
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      document.getElementById('idTipoTarifa').focus();
    });
  }
  //Abre el modal de ver Orden Venta Tarifa
  public modificarOrdenVentaTarifa(elemento) {
    this.btnActualizarTarifa = true;
    this.formularioTarifa.patchValue(elemento);
    if (elemento.tipoTarifa.porEscala) {
      this.tipoTarifa.setValue('porEscala');
      this.cambioTipoTarifa();
    } else {
      this.tipoTarifa.setValue('porTramo');
      this.cambioTipoTarifa();
    }
  }
  //Abre el modal de ver Orden Venta Tarifa
  public eliminarTarifaOrdenVenta(elemento) {
    if (this.listaTarifasDeOrdVta.data.length == 1) {
      this.toastr.warning("No se pueden eliminar todas las tarifas");
      document.getElementById('idTipoTarifa').focus();
    } else {
      const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
        width: '500px',
        data: {
          formulario: null,
          porEscala: null,
          ordenVenta: null
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loaderService.show();
          this.ordenVentaTarifaService.eliminar(elemento.id).subscribe(
            res => {
              let respuesta = res.json();
              this.toastr.success(respuesta.mensaje);
              this.listarTarifasOrdenVenta();
              this.formularioTarifa.reset();
              document.getElementById('idTipoTarifa').focus();
              this.loaderService.hide();
            },
            err => {
              let error = err.json();
              this.toastr.error(error.mensaje);
              this.loaderService.hide();
            }
          );
        }
      });
    }
  }
  //Obtiene la lista de resultados para la pestania Listar
  public buscarLista() {
    this.listaOrdenVenta = new MatTableDataSource([]);
    if (this.formularioFiltro.value.tipo == 'empresa') {
      this.servicio.listarPorEmpresa(this.formularioFiltro.value.empresa.id).subscribe(
        res => {
          this.listaOrdenVenta = new MatTableDataSource(res.json());
          this.listaOrdenVenta.sort = this.sort;
          this.listaOrdenVenta.paginator = this.paginator;
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      );
    }
    if (this.formularioFiltro.value.tipo == 'cliente') {
      this.servicio.listarPorCliente(this.formularioFiltro.value.cliente.id).subscribe(
        res => {
          this.listaOrdenVenta = new MatTableDataSource(res.json());
          this.listaOrdenVenta.sort = this.sort;
          this.listaCompleta.paginator = this.paginator;
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      );
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.soloLecturaMod = true;
    this.ordenventa.setValue(elemento);
    this.cambioTipoTarifa();
    this.formulario.patchValue(elemento);
    this.establecerPorcentajes(elemento);
    this.establecerOrdenVentaCabecera(elemento.id);
    this.listarTarifasOrdenVenta();
    this.btnOrdenVta = true;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.soloLecturaMod = true;
    this.ordenventa.setValue(elemento);
    this.cambioTipoTarifa();
    this.formulario.patchValue(elemento);
    this.establecerPorcentajes(elemento);
    this.establecerOrdenVentaCabecera(elemento.id);
    this.listarTarifasOrdenVenta();
    this.btnOrdenVta = true;
  }
  //Carga los datos de la orden de venta seleccionada en los input
  public cargarDatosOrden() {
    let elemento = this.ordenventa.value;
    this.soloLecturaMod = true;
    this.formulario.patchValue(elemento);
    this.establecerPorcentajes(elemento);
    this.establecerOrdenVentaCabecera(elemento.id);
    this.listarTarifasOrdenVenta();
    this.btnOrdenVta = true;
    //En la pestaña consultar y eliminar, deshabilita todo
    if (this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      this.formulario.get('vendedor').disable();
      this.formulario.get('esContado').disable();
      this.formulario.disable();
      this.formularioEscala.disable();
      this.formularioTramo.disable();
      this.formularioTarifa.disable();
      this.btnOrdenVta = false;
    } else {
      //Si la orden de venta no esta activa, deshabilita todos los campos excepto 'estaActiva'
      if (!this.formulario.get('estaActiva').value) {
        this.formulario.get('vendedor').disable();
        this.formulario.get('esContado').disable();
        this.formulario.disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        this.formularioTarifa.disable();
        this.btnOrdenVta = false;
      } else {
        this.formulario.enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        this.formularioTarifa.enable();
        this.btnOrdenVta = true;
      }
    }
    this.tipoTarifa.disable();
    this.formulario.get('estaActiva').enable();
  }
  //Controla que los porcentajes queden bien establecidos
  private establecerPorcentajes(elemento) {
    this.formulario.get('seguro').setValue(this.appService.desenmascararPorcentajePorMil(elemento.seguro.toString(), 2));
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
      formulario.patchValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if (valor) {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.patchValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Establece los decimales de porcentaje (por mil)
  public establecerPorcentajePorMil(formulario, cantidad): void {
    formulario.patchValue(this.appService.desenmascararPorcentajePorMil(formulario.value, cantidad));
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.patchValue(this.appService.desenmascararKm(formulario.value));
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
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.reset();
    }
  }
  //Estado boton eliminar de tabla tarifas
  public estadoBtnEliminar(): boolean {
    let estaActiva = this.formulario.get('estaActiva').value;
    return estaActiva ? this.indiceSeleccionado == 1 || this.indiceSeleccionado == 3 : false;
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Prepara los datos para exportar
  private prepararDatos(listaOrdenVenta): Array<any> {
    let lista = listaOrdenVenta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        descripcion: elemento.nombre,
        vendedor: elemento.vendedor.nombre,
        seguro: this.returnDecimales(elemento.seguro, 2) + '%',
        es_contado: elemento.esContado ? 'Si' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaOrdenVenta.data);
    let datos = {
      nombre: 'Ordenes de Venta',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnasListar
    }
    this.reporteServicio.abrirDialogo(datos);
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
  public indiceSeleccionado: number = null;
  //Define tipo tarifa
  public tipoTarifa: string = null;
  //Define la Orden Venta como un FormControl
  public ordenVenta = new FormControl();
  //Define la Fecha Actual como un FormControl
  public preciosDesde = new FormControl();
  //Define la Orden Venta Tarifa
  public ordenVentaTarifa: any = null;
  //Define importes por
  public importePor: FormControl = new FormControl();
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
  public importeSecoPor: FormControl = new FormControl();
  //Define importes ref por
  public importeRefPor: FormControl = new FormControl();
  //Define la escala actual
  public escalaActual: any;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si el boton Agregar se habilita o deshabilita
  public btnAgregar: boolean = null;
  //Define el id del Tramo o Escala que se quiere modificar
  public idMod: number = null;
  //Define si la orden de venta esta activa
  public ordenVentaActiva: boolean;
  //Define las columnas de las tablas
  public columnasEscala: string[] = ['eliminar', 'mod', 'escala', 'precioFijo', 'precioUnitario', 'porcentaje', 'minimo'];
  public columnasTramo: string[] = ['eliminar', 'mod', 'origendestino', 'km', 'kmPactado', 'precioFijoSeco', 'precioUnitSeco',
    'precioFijoRefrig', 'precioUnitRefrig'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<VerTarifaDialogo>, @Inject(MAT_DIALOG_DATA) public data, private ordenVentaEscala: OrdenVentaEscala,
    private ordenVentaTramo: OrdenVentaTramo, private ordenVentaEscalaService: OrdenVentaEscalaService, private toastr: ToastrService,
    private ordenVentaTramoService: OrdenVentaTramoService, private loaderService: LoaderService, private escalaTarifaService: EscalaTarifaService,
    private appService: AppService, private tramoService: TramoService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Inicializa valores
    this.ordenVentaTarifa = this.data.ordenVentaTarifa;
    this.ordenVentaActiva = this.data.ordenVentaActiva;
    this.listaCompleta = new MatTableDataSource([]);
    this.ordenVenta.setValue(this.ordenVentaTarifa.ordenVenta);
    this.preciosDesde.setValue(this.data.fechaActual);
    this.preciosDesde.disable();
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
  private listarEscalasTarifas() {
    this.escalaTarifaService.listar().subscribe(
      res => {
        this.listaEscalasTarifas = res.json();
      }
    )
  }
  //Contrala campos vacios
  public controlarCamposVaciosTramo(formulario) {
    formulario.get('importeFijoSeco').value == 'NaN' ? formulario.get('importeFijo').setValue('0.00') : '';
    formulario.get('precioUnitarioSeco').value == 'NaN' ? formulario.get('precioUnitario').setValue('0.00') : '';
    formulario.get('importeFijoRef').value == 'NaN' ? formulario.get('minimo').setValue('0.00') : '';
    formulario.get('precioUnitarioRef').value == 'NaN' ? formulario.get('minimo').setValue('0.00') : '';
    formulario.get('kmPactado').value == 'NaN' ? formulario.get('minimo').setValue('0.00') : '';
  }
  //Cancela - Resetea el formulario correspondiente
  public cancelar() {
    let ordenVentaTarifa = { id: this.ordenVentaTarifa.id };
    if (this.ordenVentaTarifa.tipoTarifa.porEscala) {
      this.tipoTarifa = "porEscala";
      this.formularioEscala.reset();
      this.formularioEscala.get('ordenVentaTarifa').setValue(ordenVentaTarifa);
      this.formularioEscala.get('preciosDesde').setValue(this.data.fechaActual);
      this.controlarCampos();
    } else {
      this.tipoTarifa = "porTramo";
      this.importeSecoPor.reset();
      this.importeRefPor.reset();
      this.formularioTramo.reset();
      this.formularioTramo.get('ordenVentaTarifa').setValue(ordenVentaTarifa);
      this.formularioTramo.get('preciosDesde').setValue(this.data.fechaActual);
    }
    this.idMod = null;
  }
  //Agrega un Registro a la Lista de Tarifa
  public agregar() {
    this.idMod = null;
    this.loaderService.show();
    let realizarAgregar = true;
    if (this.tipoTarifa == 'porEscala') {
      if (this.importePor.value == false && (this.formularioEscala.value.importeFijo == 0 || this.formularioEscala.value.importeFijo == '0.00')) {
        realizarAgregar = false;
        this.toastr.error("El Precio Fijo no puede ser '0.00'");
      }
      if (this.importePor.value == true && (this.formularioEscala.value.precioUnitario == 0 || this.formularioEscala.value.precioUnitario == '0.00')) {
        realizarAgregar = false;
        this.toastr.error("El Precio Unitario no puede ser '0.00'");
      }
      if (realizarAgregar == true) {
        this.ordenVentaEscalaService.agregar(this.formularioEscala.value).subscribe(
          res => {
            if (res.status == 201) {
              this.listar();
              this.cancelar();
              document.getElementById('idEscala').focus();
              this.toastr.success("Registro agregado con éxito");
            }
            this.loaderService.hide();
          },
          err => {
            let error = err.json();
            this.toastr.error(error.mensaje);
            this.loaderService.hide();
          }
        )
      }
    } else {
      this.ordenVentaTramoService.agregar(this.formularioTramo.value).subscribe(
        res => {
          if (res.status == 201) {
            this.listar();
            this.cancelar();
            document.getElementById('idTramo').focus();
            this.toastr.success("Registro agregado con éxito");
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          if (error.codigo == 11041) {
            this.toastr.error(MensajeExcepcion.DD_ORDENVENTATARIFA_TRAMO);
          } else {
            this.toastr.error(MensajeExcepcion.ERROR_INTERNO_SERVIDOR);
          }
          this.loaderService.hide();
        }
      )
    }
  }
  //Modifica los datos del registro seleccionado segun el tipoTarifa
  public actualizar() {
    this.loaderService.show();
    if (this.tipoTarifa == 'porEscala') {
      let formulario = this.formularioEscala.value;
      if (formulario.minimo == 'NaN') {
        formulario.minimo = '0.00';
      }
      this.ordenVentaEscalaService.actualizar(formulario).subscribe(
        res => {
          if (res.status == 200) {
            this.cancelar();
            this.listar();
            this.idMod = null;
            this.toastr.success("Registro actualizado con éxito");
            this.loaderService.hide();
          }
        },
        err => {
          let error = err.json();
          if (error.codigo == 11039) {
            this.toastr.error(MensajeExcepcion.DD_ORDENVENTATARIFA_ESCALA);
          } else {
            this.toastr.error(MensajeExcepcion.ERROR_INTERNO_SERVIDOR);
          }
          this.loaderService.hide();
        }
      )
    } else {
      this.ordenVentaTramoService.actualizar(this.formularioTramo.value).subscribe(
        res => {
          if (res.status == 200) {
            this.cancelar();
            this.listar();
            this.idMod = null;
            this.toastr.success("Registro actualizado con éxito");
            this.loaderService.hide();
          }
        },
        err => {
          let error = err.json();
          if (error.codigo == 11041) {
            this.toastr.error(MensajeExcepcion.DD_ORDENVENTATARIFA_TRAMO);
          } else {
            this.toastr.error(MensajeExcepcion.ERROR_INTERNO_SERVIDOR);
          }
          this.loaderService.hide();
        }
      )
    };
  }
  //Elimina un registro segun el tipoTarifa
  public eliminar(elemento) {
    this.loaderService.show();
    if (this.tipoTarifa == 'porEscala') {
      this.ordenVentaEscalaService.eliminar(elemento.id).subscribe(
        res => {
          this.reestablecerFormularios();
          this.listar();
          this.toastr.success("Registro eliminado con éxito");
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.ordenVentaTramoService.eliminar(elemento.id).subscribe(
        res => {
          this.toastr.success("Registro eliminado con éxito");
          this.reestablecerFormularios();
          this.listar();
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Obtiene la lista de registros segun el tipoTarifa
  public listar() {
    this.loaderService.show();
    if (this.tipoTarifa == 'porEscala') {
      this.ordenVentaEscalaService.listarPorOrdenVentaTarifa(this.ordenVentaTarifa.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          this.toastr.error("No se pudo obtener los registros");
          this.loaderService.hide();
        }
      )
    } else {
      this.ordenVentaTramoService.listarPorOrdenVentaTarifa(this.ordenVentaTarifa.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          this.toastr.error("No se pudo obtener los registros");
          this.loaderService.hide();
        }
      )
    }
  }
  //Reestablece valores y formularios
  public reestablecerFormularios() {
    this.listaCompleta = new MatTableDataSource([]);
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.resultadosTramos = [];
    this.idMod = null;
    if (this.ordenVentaTarifa.tipoTarifa.porEscala) {
      this.tipoTarifa = "porEscala";
      this.formularioEscala.get('ordenVentaTarifa').setValue({ id: this.ordenVentaTarifa.id });
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('porcentaje').setValue(null);
      this.formularioEscala.get('minimo').setValue(null);
      this.formularioEscala.get('preciosDesde').setValue(this.preciosDesde.value);
      this.controlarCampos();
    } else {
      this.tipoTarifa = "porTramo";
      this.formularioTramo.get('ordenVentaTarifa').setValue({ id: this.ordenVentaTarifa.id });
      this.formularioTramo.get('importeFijoSeco').setValue(null);
      this.formularioTramo.get('importeFijoRef').setValue(null);
      this.formularioTramo.get('precioUnitarioSeco').setValue(null);
      this.formularioTramo.get('precioUnitarioRef').setValue(null);
      this.formularioTramo.get('preciosDesde').setValue(this.preciosDesde.value);
      this.controlarCamposTramo();
    }
  }
  //Controla campos habilitados y deshabilitados
  private controlarCampos() {
    if (this.ordenVentaTarifa.tipoTarifa.porPorcentaje) {
      this.importePor.disable();
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('minimo').disable();
      this.formularioEscala.get('porcentaje').enable();
    } else {
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('minimo').enable();
      this.formularioEscala.get('porcentaje').disable();
      this.cambioImportesPor();
    }
    if (!this.ordenVentaActiva || this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      this.soloLectura = true;
      this.importePor.disable();
    }
    else {
      this.soloLectura = false;
      this.importePor.enable();
      this.importePor.setValue(false);
    }
  }
  //Controla estado campos por tramo
  public controlarCamposTramo(): void {
    if (!this.ordenVentaActiva || this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      this.soloLectura = true;
      this.importeSecoPor.disable();
      this.importeRefPor.disable();
    }
    else {
      this.soloLectura = false;
      this.importeSecoPor.enable();
      this.importeRefPor.enable();
    }
  }
  //Controla el modificar en Escala
  public controlModEscala(elemento) {
    this.formularioEscala.patchValue(elemento);
    elemento.ordenVentaTarifa = this.ordenVentaTarifa;
    this.idMod = elemento.id;
    if (elemento.importeFijo) {
      this.formularioEscala.get('importeFijo').setValue(parseFloat(elemento.importeFijo).toFixed(2));
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.importePor.setValue(false);
      this.cambioImportesPor();
    }
    if (elemento.precioUnitario) {
      this.formularioEscala.get('precioUnitario').setValue(parseFloat(elemento.precioUnitario).toFixed(2));
      this.formularioEscala.get('importeFijo').setValue(null);
      this.importePor.setValue(true);
      this.cambioImportesPor();
    }
    let tipoTarifa = this.formularioEscala.get('ordenVentaTarifa').value;
    if (tipoTarifa.tipoTarifa.porPorcentaje) {
      this.formularioEscala.get('porcentaje').enable();
    } else {
      this.formularioEscala.get('porcentaje').disable();
    }
    this.formularioEscala.get('porcentaje').setValue(parseFloat(elemento.porcentaje).toFixed(2));
    this.formularioEscala.get('minimo').setValue(parseFloat(elemento.minimo).toFixed(2));
    document.getElementById('idEscala').focus();
  }
  //Controla el modificar en Tramo
  public controlModTramo(elemento) {
    this.formularioTramo.patchValue(elemento);
    this.idMod = elemento.id;
    elemento.ordenVentaTarifa = this.ordenVentaTarifa;
    if (elemento.importeFijoSeco) {
      this.formularioTramo.get('importeFijoSeco').setValue(parseFloat(elemento.importeFijoSeco).toFixed(2));
      this.importeSecoPor.setValue(false);
      this.cambioImportesSecoPor();
    }
    if (elemento.precioUnitarioSeco) {
      this.formularioTramo.get('precioUnitarioSeco').setValue(parseFloat(elemento.precioUnitarioSeco).toFixed(2));
      this.importeSecoPor.setValue(true);
      this.cambioImportesSecoPor();
    }
    if (elemento.importeFijoRef) {
      this.formularioTramo.get('importeFijoRef').setValue(parseFloat(elemento.importeFijoRef).toFixed(2));
      this.importeRefPor.setValue(false);
      this.cambioImportesRefPor();
    }
    if (elemento.precioUnitarioRef) {
      this.formularioTramo.get('precioUnitarioRef').setValue(parseFloat(elemento.precioUnitarioRef).toFixed(2));
      this.importeRefPor.setValue(true);
      this.cambioImportesRefPor();
    }
    document.getElementById('idTramo').focus();
  }
  //Elimina un Tramo a listaDeTramos
  public controlEliminarTramo(elemento) {
    this.loaderService.show();
    this.ordenVentaTramoService.eliminar(elemento.id).subscribe(
      res => {
        let respuesta = res.json();
        this.listar();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina una Escala de listaDeEscalas
  public controlEliminarEscala(elemento) {
    this.loaderService.show();
    this.ordenVentaEscalaService.eliminar(elemento.id).subscribe(
      res => {
        let respuesta = res.json();
        this.listar();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Al cambiar select importes seco por
  public cambioImportesSecoPor(): void {
    let importesPor = this.importeSecoPor.value;
    if (!importesPor) {
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
    if (importesPor) {
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('precioUnitario').setValidators([Validators.required]);
      this.formularioEscala.get('importeFijo').setValidators([]);
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('minimo').reset();
      this.formularioEscala.get('minimo').enable();
    } else {
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('importeFijo').setValidators([Validators.required]);
      this.formularioEscala.get('precioUnitario').setValidators([]);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('minimo').reset();
      this.formularioEscala.get('minimo').disable();
    }
  }
  //Al cambiar select importes ref por
  public cambioImportesRefPor(): void {
    let importesPor = this.importeRefPor.value;
    if (!importesPor) {
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
      formulario.patchValue(this.appService.establecerDecimales(valor, cantidad));
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
    } else {
      return '0.00';
    }
  }
  //Establece los decimales de porcentaje
  public setPorcentaje(formulario, cantidad): void {
    formulario.patchValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(valor, cantidad) {
    if (valor) {
      return this.appService.desenmascararPorcentaje(valor.toString(), cantidad);
    } else {
      return '0.00';
    }
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.patchValue(this.appService.desenmascararKm(formulario.value));
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
  public cerrar(): void {
    this.dialogRef.close();
  }
}