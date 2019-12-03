import { Component, OnInit, ViewChild } from '@angular/core';
import { ViajeRemitoService } from '../../servicios/viaje-remito.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { ClienteService } from '../../servicios/cliente.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { TipoComprobanteService } from '../../servicios/tipo-comprobante.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AforoComponent } from '../aforo/aforo.component';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ViajeRemitoGS } from 'src/app/modelos/viajeRemitoGS';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { Aforo } from 'src/app/modelos/aforo';

@Component({
  selector: 'app-viaje-remito',
  templateUrl: './viaje-remito.component.html',
  styleUrls: ['./viaje-remito.component.css']
})
export class ViajeRemitoComponent implements OnInit {
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
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el formulario 
  public formulario: FormGroup;
  //Define un formulario para guardar valores del ultimo aforo cargado
  public formularioAforar: FormGroup;
  //Define el formulario para el listar
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el form control para las busquedas del Destinatario en pestaña Listar
  public autocompletadoDestinatario: FormControl = new FormControl();
  //Define el form control para las busquedas del Remitente en pestaña Listar
  public autocompletadoRemitente: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda cliente remitente
  public resultadosClienteRemitente: Array<any> = [];
  //Define la lista de resultados de busqueda cliente destinatario
  public resultadosClienteDestinatario: Array<any> = [];
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Define la lista de letras
  public letras: Array<any> = [];
  //Define la lista de sucursales que tiene el Destinatario
  public sucursalesDestinatario: Array<any> = [];
  //Define el estado de la letra
  public estadoLetra: boolean = false;
  //Define la fecha actual
  public fechaActual: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['SUCURSAL_INGRESO', 'SUCURSAL_DESTINO', 'FECHA', 'PUNTO_VENTA', 'NUMERO', 'REMITENTE', 'DESTINATARIO', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO', 'OBSERVACIONES', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: ViajeRemitoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private loaderService: LoaderService, private toastr: ToastrService, private modelo: ViajeRemitoGS,
    private sucursalServicio: SucursalService, private clienteServicio: ClienteService, private sucursalClienteService: SucursalClienteService,
    private tipoComprobanteServicio: TipoComprobanteService, public dialog: MatDialog, private aforo: Aforo,
    private fechaServicio: FechaService, private appService: AppService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        }
      );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.servicio.listarPorAlias(data).subscribe(response => {
            this.resultados = response;
          })
        }
      }
    });
    //Autocompletado ClienteRemitente - Buscar por nombre
    this.autocompletadoRemitente.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClienteRemitente = response.json();
          })
        }
      }
    });
    //Autocompletado ClienteDestinatario - Buscar por nombre
    this.autocompletadoDestinatario.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClienteDestinatario = response.json();
          })
        }
      }
    });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Define los campos para validaciones del Aforo
    this.formularioAforar = this.aforo.formulario;
    //Define el formulario para el Listar
    this.formularioFiltro = this.modelo.formularioFiltro;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formulario.get('fecha').setValue(this.fechaActual);
    });
    //Obtiene la lista de condiciones de iva
    this.listarSucursales();
    //Obtiene la lista de tipos de comprobantes
    this.listarTiposComprobantes();
    //Crea la lista de letras
    this.letras = ['A', 'B', 'C'];
    //Autocompletado ClienteRemitente - Buscar por nombre
    this.formulario.get('clienteRemitente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClienteRemitente = response.json();
          })
        }
      }
    })
    //Autocompletado ClienteDestinatario - Buscar por nombre
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClienteDestinatario = response.json();
          })
        }
      }
    });
  }
  //Maneja el cambio en el campo Destinatario - obtiene las sucursales del cliente
  public cambioClienteDestinatario() {
    this.sucursalClienteService.listarPorCliente(this.formulario.get('clienteDestinatario').value.id).subscribe(
      res => {
        this.sucursalesDestinatario = res.json();
        if (this.sucursalesDestinatario.length > 0)
          this.formulario.get('sucursalClienteDest').setValue(this.sucursalesDestinatario[0]);
      }
    )
  }
  //Establece los enteros
  public establecerEnteros(formulario): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerEnteros(valor));
    }
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de enteros con separador de miles
  public mascararEnterosSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de importe
  public mascararEnterosConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.cambioClienteDestinatario();
    elemento.puntoVenta ? this.formulario.get('puntoVenta').setValue(this.displayCeros(elemento.puntoVenta, '0000', -5)) :
      this.formulario.get('puntoVenta').reset();
    elemento.numero ? this.formulario.get('numero').setValue(this.displayCeros(elemento.numero, '0000000', -8)) :
      this.formulario.get('numero').reset();
    elemento.m3 ? this.formulario.get('m3').setValue(this.appService.establecerDecimales(elemento.m3, 2)) :
      this.formulario.get('m3').reset();
    elemento.valorDeclarado ? this.formulario.get('valorDeclarado').setValue(this.appService.establecerDecimales(elemento.valorDeclarado, 2)) :
      this.formulario.get('valorDeclarado').reset();
    elemento.kilosEfectivo ? this.formulario.get('kilosEfectivo').setValue(this.appService.establecerDecimales(elemento.kilosEfectivo, 2)) :
      this.formulario.get('kilosEfectivo').reset();
    elemento.kilosAforado ? this.formulario.get('kilosAforado').setValue(this.appService.establecerDecimales(elemento.kilosAforado, 2)) :
      this.formulario.get('kilosAforado').reset();
    elemento.importeRetiro ? this.formulario.get('importeRetiro').setValue(this.appService.establecerDecimales(elemento.importeRetiro, 2)) :
      this.formulario.get('importeRetiro').reset();
    elemento.importeEntrega ? this.formulario.get('importeEntrega').setValue(this.appService.establecerDecimales(elemento.importeEntrega, 2)) :
      this.formulario.get('importeEntrega').reset();
    elemento.idSucursalClienteDest ? this.formulario.get('sucursalClienteDest').setValue(elemento.idSucursalClienteDest) :
      this.formulario.get('sucursalClienteDest').setValue(null);
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(numeroCamion, sucursalDestino) {
    this.formulario.get('fecha').setValue(this.fechaActual);
    this.formulario.get('numeroCamion').setValue(numeroCamion);
    this.formulario.get('sucursalDestino').setValue(sucursalDestino);
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosClienteRemitente = [];
    this.resultadosClienteDestinatario = [];
    this.sucursalesDestinatario = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de tipos comprobantes
  private listarTiposComprobantes() {
    this.tipoComprobanteServicio.listarActivosIngresoCarga().subscribe(
      res => {
        this.tiposComprobantes = res.json();
        this.establecerTipoComprobantePorDefecto();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Establece el tipo comprobante por defecto
  private establecerTipoComprobantePorDefecto() {
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobantes[1]);
    this.formulario.get('letra').setValue('R');
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
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('sucursalDestino').enable();
      this.formulario.get('tipoComprobante').enable();
      this.formulario.get('letra').enable();
    } else {
      this.formulario.get('sucursalDestino').disable();
      this.formulario.get('tipoComprobante').disable();
      this.formulario.get('letra').disable();
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPorDefecto(null, null);
        this.establecerTipoComprobantePorDefecto();
        this.establecerValoresPestania(nombre, false, false, true, 'idFecha');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.establecerCamposDefectoListar();
        break;
      default:
        break;
    }
  }
  //Establece campos por defecto en pestaña listar
  private establecerCamposDefectoListar(): void {
    this.formularioFiltro.get('idSucursalIngreso').setValue('0');
    this.formularioFiltro.get('idSucursalDestino').setValue('0');
    this.formularioFiltro.get('estaPendiente').setValue('2');
    this.formularioFiltro.get('estaFacturado').setValue('2');
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
  //Obtiene el siguiente id
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
  //Obtiene el listado de registros
  public listar() {
    this.loaderService.show();
    let sucursalIngreso = this.formularioFiltro.value.idSucursalIngreso;
    let sucursalDestino = this.formularioFiltro.value.idSucursalDestino;
    if (sucursalIngreso == 0)
      this.formularioFiltro.get('idSucursalIngreso').setValue(null);
    if (sucursalDestino == 0)
      this.formularioFiltro.get('idSucursalDestino').setValue(null);
    if (this.autocompletadoRemitente.value)
      this.formularioFiltro.get('idClienteRemitente').setValue(this.autocompletadoRemitente.value.id);
    if (this.autocompletadoDestinatario.value)
      this.formularioFiltro.get('idClienteDestinatario').setValue(this.autocompletadoDestinatario.value.id);
    this.servicio.listarPorFiltros(this.formularioFiltro.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        this.toastr.error("No se pudo obtener la lista de remitos");
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    let numeroCamion = this.formulario.get('numeroCamion').value;
    let sucursalDestino = this.formulario.get('sucursalDestino').value;
    this.formulario.get('letra').enable();
    this.formulario.get('sucursalIngreso').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerValoresPorDefecto(numeroCamion, sucursalDestino);
          this.formulario.get('tipoComprobante').setValue(tipoComprobante);
          this.cambioTipoComprobante();
          document.getElementById('idPuntoVenta').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('letra').enable();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.establecerTipoComprobantePorDefecto();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.establecerTipoComprobantePorDefecto();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.reset();
    this.formularioFiltro.reset();
    this.formularioAforar.reset();
    this.formulario.get('id').setValue(id);
    this.vaciarListas();
    //Establece valores por defecto
    this.establecerValoresPorDefecto(null, null);
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err.json();
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Establece la letra al cambiar el tipo de comprobante
  public cambioTipoComprobante(): void {
    let id = this.formulario.get('tipoComprobante').value.id;
    if (id == 5) {
      this.estadoLetra = false;
      this.formulario.get('letra').setValue('R');
    } else {
      this.estadoLetra = true;
      this.formulario.get('letra').setValue(this.letras[0]);
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
    this.establecerEstadoCampos(false);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.establecerEstadoCampos(true);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Abre el dialogo para agregar un cliente eventual
  public agregarCliente(tipo): void {
    const dialogRef = this.dialog.open(ClienteEventualComponent, {
      width: '95%',
      maxWidth: '95%',
      data: {
        formulario: null,
        usuario: this.appService.getUsuario()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (tipo == 1) {
          this.formulario.get('clienteRemitente').setValue(resultado);
        } else {
          this.formulario.get('clienteDestinatario').setValue(resultado);
        }
      }
    });
  }
  //Abre un modal para agregar un aforo
  public agregarAforo(): void {
    const dialogRef = this.dialog.open(AforoComponent, {
      width: '80%',
      maxWidth: '80%',
      data: {
        formularioAforar: this.formularioAforar.value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.formularioAforar.patchValue(resultado);
        this.formulario.get('kilosAforado').setValue(this.appService.setDecimales(resultado.kiloAforadoTotal, 2));
      } else {
        this.formularioAforar.reset();
        this.formulario.get('kilosAforado').setValue(this.appService.setDecimales('0.00', 2));
      }
    });
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos con ceros a la izquierda
  public displayCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        sucursal_ingreso: elemento.sucursalIngreso.nombre,
        sucursal_destino: elemento.sucursalDestino.nombre,
        fecha: elemento.fecha,
        punto_venta: this.displayCeros(elemento.puntoVenta, '0000', -5),
        numero: this.displayCeros(elemento.numero, '0000000', -8),
        remitente: elemento.clienteRemitente ? elemento.clienteRemitente.razonSocial : '',
        destinatario: elemento.clienteDestinatario ? elemento.clienteDestinatario.razonSocial : '',
        bultos: elemento.bultos ? elemento.bultos : '',
        kg_efectivo: elemento.kilosEfectivo ? elemento.kilosEfectivo + ' Kg' : '',
        valor_declarado: elemento.valorDeclarado ? elemento.valorDeclarado : '',
        observaciones: elemento.observaciones ? elemento.observaciones : ''
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Remitos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}