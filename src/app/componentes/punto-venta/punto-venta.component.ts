import { Component, OnInit, ViewChild } from '@angular/core';
import { PuntoVentaService } from '../../servicios/punto-venta.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { PuntoVenta } from 'src/app/modelos/puntoVenta';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.css']
})
export class PuntoVentaComponent implements OnInit {
  //Obtiene el componente autocompletado sucursal del dom
  // @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  // autoComplete: MatAutocompleteTrigger;
  //Define el ultimo id
  public ultimoId: string = null;
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
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista completa de registros Codigos de Afip
  public afipComprobantes: Array<any> = [];
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de empresas
  public empresas: Array<any> = [];
  //Define la lista de Tipos de comprobantes
  public tipoComprobantes: Array<any> = [];
  //Define la lista de puntos de ventas de sucursal
  public puntosVentas: Array<any> = [];
  //Define la lista de puntos de ventas como autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define sucursal para la lista
  public sucursal: FormControl = new FormControl();
  //Define empresa para la lista
  public empresa: FormControl = new FormControl();
  //Define el tipo de comprobante
  public tipoComprobante: FormControl = new FormControl('', Validators.required);
  //Define las columnas de la tabla
  public columnas: string[] = ['SUCURSAL', 'EMPRESA', 'PUNTO_VENTA', 'FE', 'FE_LINEA',
    'CAE', 'NUMERO', 'COPIA', 'IMPRIME', 'HABILITADA', 'DEFECTO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: PuntoVentaService, private toastr: ToastrService, private puntoVenta: PuntoVenta,
    private afipComprobanteService: AfipComprobanteService, private appService: AppService, private loaderService: LoaderService,
    private reporteServicio: ReporteService) {
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.puntoVenta.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.sucursales = respuesta.sucursales;
        this.empresas = respuesta.empresas;
        this.tipoComprobantes = respuesta.tipoComprobantes;
        this.formulario.get('id').setValue(this.ultimoId);
        this.sucursal.setValue(this.sucursales[0]);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Obtiene la mascara de enteros
  public obtenerMascaraEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('empresa').disable();
  }
  //Obtiene los afip comprobantes
  public obtenerAfipComprobantes() {
    let tipoComprobante = this.tipoComprobante.value;
    this.afipComprobanteService.listarPorTipoComprobante(tipoComprobante.id).subscribe(
      res => {
        this.afipComprobantes = res.json();
      }
    )
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.tipoComprobante.setValue(elemento.afipComprobante.tipoComprobante);
    this.obtenerAfipComprobantes();
    this.formulario.setValue(elemento);
    this.formulario.get('puntoVenta').setValue(this.displayFe(elemento));
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('fe').enable();
      this.formulario.get('feEnLinea').enable();
      this.formulario.get('feCAEA').enable();
      this.formulario.get('esCuentaOrden').enable();
      this.formulario.get('imprime').enable();
      this.formulario.get('estaHabilitado').enable();
      this.formulario.get('afipComprobante').enable();
      this.formulario.get('puntoVenta').enable();
      this.tipoComprobante.enable();
    } else {
      this.formulario.get('fe').disable();
      this.formulario.get('feEnLinea').disable();
      this.formulario.get('feCAEA').disable();
      this.formulario.get('esCuentaOrden').disable();
      this.formulario.get('imprime').disable();
      this.formulario.get('estaHabilitado').disable();
      this.formulario.get('afipComprobante').disable();
      this.formulario.get('puntoVenta').disable();
      this.tipoComprobante.disable();
    }
  }
  //Habilita o deshabilita los campos select para la pestania actualizar
  private establecerEstadoCamposActualizar() {
    this.formulario.get('fe').enable();
    this.formulario.get('feEnLinea').enable();
    this.formulario.get('feCAEA').enable();
    this.formulario.get('esCuentaOrden').enable();
    this.formulario.get('imprime').enable();
    this.formulario.get('estaHabilitado').enable();
    this.formulario.get('puntoVenta').disable();
    this.tipoComprobante.disable();
    this.formulario.get('afipComprobante').disable();
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
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    this.establecerValoresPorDefecto();
    switch (id) {
      case 1:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idSucursal');
        break;
      case 3:
        this.establecerEstadoCamposActualizar();
        this.establecerValoresPestania(nombre, true, false, true, 'idSucursal');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idSucursal');
        break;
      case 5:
        this.empresa.setValue(this.appService.getEmpresa());
        this.empresa.disable();
        setTimeout(function () {
          document.getElementById('idSucursal').focus();
        }, 20);
        break;
      default:
        this.listaCompleta = new MatTableDataSource([]);
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
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Obtiene la lista por sucursal y empresa
  public listarPorSucursalYEmpresa() {
    this.loaderService.show();
    let sucursal = this.formulario.get('sucursal').value;
    this.formulario.reset();
    this.formulario.get('sucursal').setValue(sucursal);
    this.establecerValoresPorDefecto();
    if (this.mostrarAutocompletado) {
      let sucursal = this.formulario.get('sucursal').value;
      let empresa = this.formulario.get('empresa').value;
      if (sucursal && empresa) {
        this.servicio.listarPorSucursalYEmpresaLetra(sucursal.id, empresa.id).subscribe(res => {
          this.puntosVentas = res.json();
          this.loaderService.hide();
        });
      } else {
        this.loaderService.hide();
      }
    } else {
      this.loaderService.hide();
    }
  }
  //Obtiene la lista por sucursal y empresa
  public listarPorSucursalYEmpresaLista(sucursal, empresa) {
    this.loaderService.show();
    this.servicio.listarPorSucursalYEmpresaLetra(sucursal.value.id, empresa.value.id).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
      this.listaCompleta.paginator = this.paginator;
      this.loaderService.hide();
    });
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.enable();
    this.formulario.get('id').setValue(null);

    //guarda la sucursal seleccionada para reestablecerla
    let sucursal = this.formulario.value.sucursal;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario(respuesta.id);
          this.establecerEstadoCampos(true);
          this.formulario.get('sucursal').setValue(sucursal);
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
    this.formulario.enable();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          this.establecerEstadoCamposActualizar();
          document.getElementById('idSucursal').focus();
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
          this.reestablecerFormulario(null);
          this.establecerEstadoCamposActualizar();
          document.getElementById('idSucursal').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    )
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.reset();
    this.tipoComprobante.reset();
    this.establecerValoresPorDefecto();
    this.afipComprobantes = [];
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err.json();
    if (respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Maneja el cambio en el formControl de la pestaña listar
  public cambioSucursal() {
    this.listaCompleta.data = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Marcarar enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.puntosVentas = this.listaCompleta.data;
    this.establecerFormulario();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.puntosVentas = this.listaCompleta.data;
    this.establecerFormulario();
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
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
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.puntoVenta ? ('00000' + elemento.puntoVenta).slice(-5)
        + ' | ' + elemento.afipComprobante.tipoComprobante.abreviatura + ' | ' + elemento.afipComprobante.letra
        + ' | ' + elemento.afipComprobante.codigoAfip : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFd(elemento) {
    if (elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFe(elemento) {
    if (elemento != undefined) {
      return elemento.puntoVenta ? ('00000' + elemento.puntoVenta).slice(-5) : elemento;
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        sucursal: elemento.sucursal.nombre,
        empresa: elemento.empresa.razonSocial,
        punto_venta: this.displayFb(elemento),
        fe: elemento.fe ? 'Si' : 'No',
        fe_linea: elemento.feEnLinea ? 'Si' : 'No',
        cae: elemento.feCAEA ? 'Si' : 'No',
        // cuenta_orden: elemento.esCuentaOrden ? 'Si' : 'No',
        numero: elemento.ultimoNumero,
        copia: elemento.copias,
        imprime: elemento.imprime ? 'Si' : 'No',
        habilitada: elemento.estaHabilitado ? 'Si' : 'No',
        defecto: elemento.porDefecto ? 'Si' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Puntos de Ventas',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}