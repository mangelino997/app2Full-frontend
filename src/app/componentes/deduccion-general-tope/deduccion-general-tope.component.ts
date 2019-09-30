import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipDeduccionGeneralTopeService } from 'src/app/servicios/afip-deduccion-general-tope.service';
import { AfipDeduccionGeneralTope } from 'src/app/modelos/afipDeduccionGeneralTope';
import { LoaderState } from 'src/app/modelos/loader';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AfipDeduccionGeneralService } from 'src/app/servicios/afip-deduccion-general.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-deduccion-general-tope',
  templateUrl: './deduccion-general-tope.component.html',
  styleUrls: ['./deduccion-general-tope.component.css']
})
export class DeduccionGeneralTopeComponent implements OnInit {
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
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public anio: FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id: FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de Años Fiscales
  public anioFiscal: Array<any> = [];
  //Define la lista de Deduccion General
  public deduccionesGenerales: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ANIO', 'DEDUCCION_GENERAL', 'DESCRIPCION', 'IMPORTE', 'PORCENTAJE_GANANCIA_NETA', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipDeduccionGeneralTopeService,
    private modelo: AfipDeduccionGeneralTope, private deduccionesGralService: AfipDeduccionGeneralService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de Años Fiscales
    this.listarAnios();
    //Obtiene la lista de Deducciones Generales
    this.listarDeduccionesGenerales();
  }
  //carga la lista de Años Fiscales
  public listarAnios() {
    this.fechaService.listarAnioFiscal().subscribe(
      res => {
        this.anioFiscal = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de año fiscal");
      }
    )
  }
  //carga la lista de Años Fiscales
  public listarDeduccionesGenerales() {
    this.deduccionesGralService.listar().subscribe(
      res => {
        this.deduccionesGenerales = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Deducciones Generales");
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
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idAnio');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAnioLista');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAnioLista');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAnioLista');
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    if(indice == 1)
      this.agregar();
      else
      this.actualizar();
  }
  //Obtiene el listado de registros
  public listar() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.paginator = this.paginator;
    this.servicio.listarPorAnio(this.anio.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Verifica si hay campos vacios
  private verificarCamposVacios() {
    let importe = this.formulario.value.importe;
    let importeFijo = this.formulario.value.porcentajeGananciaNeta;
    if (!importe || importe == undefined)
      this.formulario.get('importe').setValue(0);
    if (!importeFijo || importeFijo == undefined)
      this.formulario.get('porcentajeGananciaNeta').setValue(0);
  }
  //Metodo Agregar 
  private agregar() {
    this.loaderService.show();
    this.verificarCamposVacios();
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario();
        document.getElementById('idAnio').focus();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
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
    let anio = this.anio.value;
    this.verificarCamposVacios();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.anio.setValue(anio);
          this.listar();
          document.getElementById('idAnioLista').focus();
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
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11002) {
      document.getElementById("labelAnio").classList.add('label-error');
      document.getElementById("idAnio").classList.add('is-invalid');
      document.getElementById("idAnio").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario() {
    this.formulario.reset();
    this.resultados = [];
    this.anio.reset();
    this.condicion = false;
    this.listaCompleta = new MatTableDataSource([]);
    this.indiceSeleccionado == 3? this.formulario.disable() : this.formulario.enable();
  }
  //Controla el cambio en el campo "anio"
  public cambioAnio() {
    let anio = this.anio.value;
    if(!anio)
      this.listaCompleta = new MatTableDataSource([]);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.anio.setValue(undefined);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    if (this.indiceSeleccionado == 5) {
      this.seleccionarPestania(3, this.pestanias[2].nombre);
    }
    this.habilitarCamposActualizar(elemento);
  }
  //Habilita los campos del formulario en el Actualizar luego de seleccionar un registro y setea sus valores
  private habilitarCamposActualizar(elemento){
    this.formulario.enable();
    this.formulario.get('afipDeduccionGeneral').disable();
    this.formulario.patchValue(elemento);
    this.establecerDecimales(this.formulario.get('importe'), 2);
    this.formulario.get('porcentajeGananciaNeta').setValue(this.appService.desenmascararPorcentaje(elemento.porcentajeGananciaNeta.toString(), 2));
    this.anio.setValue(elemento.anio);
  }
  //elimina el registro seleccionado
  public activarEliminar(idElemento) {
    this.loaderService.show();
    this.servicio.eliminar(idElemento).subscribe(
      res => {
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.listar();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
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
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
    this.verificarCondicion();
  }
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentajeDosEnteros();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.desenmascararPorcentaje(valor, cantidad));
    }
    this.verificarCondicion();
  }
  //Verifica el estado de los campos import y ganancia. Establece la condicion
  private verificarCondicion() {
    let importe = this.formulario.value.importe;
    let porcentajeGananciaNeta = this.formulario.value.porcentajeGananciaNeta;
    if ((!importe || importe == undefined) && (!porcentajeGananciaNeta || porcentajeGananciaNeta == undefined)) {
      this.condicion = false;
      this.toastr.error("Ambos montos no pueden ser nulos");
    }
    else {
      this.condicion = true;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        anio: elemento.anio,
        deduccion_general: elemento.afipDeduccionGeneral.descripcion,
        descripcion: elemento.descripcion,
        importe: '$' + this.returnDecimales(elemento.importe, 2),
        porcentaje_ganancia_neta: this.returnDecimales(elemento.porcentajeGananciaNeta, 2) + '%'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Deducciones Generales Topes',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}