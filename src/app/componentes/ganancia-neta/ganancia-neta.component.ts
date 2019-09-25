import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ToastrService } from 'ngx-toastr';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AfipGananciaNetaService } from 'src/app/servicios/afip-ganancia-neta.service';
import { AfipGananciaNeta } from 'src/app/modelos/afipGananciaNeta';
import { LoaderState } from 'src/app/modelos/loader';
import { AfipAlicuotaGananciaService } from 'src/app/servicios/afip-alicuota-ganancia.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-ganancia-neta',
  templateUrl: './ganancia-neta.component.html',
  styleUrls: ['./ganancia-neta.component.css']
})
export class GananciaNetaComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define el indice del registro seleccionado en la tabla
  public idMod: number = null;
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
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public anio: FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id: FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultadosPorFiltro: Array<any> = [];
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
  //Define las columnas de la tabla principal
  public columnas: string[] = ['anio', 'id', 'gananciaNetaAcumulada', 'importeFijo', 'alicuotaSinExcedente', 'mod', 'eliminar'];
  //Define las columnas de la tabla reporte
  public columnasListar: string[] = ['ANIO_MES', 'GANANCIA_NETA_DE_MAS', 'GANANCIA_NETA_A', 'IMPORTE_FIJO', 'ALICUOTA', 'EXCEDENTE'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipGananciaNetaService,
    private modelo: AfipGananciaNeta, private alicuotaGananciaService: AfipAlicuotaGananciaService, private mesService: MesService,
    private reporteServicio: ReporteService) {
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
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Define el formulario para los filtros y sus validaciones
    this.formularioFiltro = new FormGroup({
      anio: new FormControl('', [Validators.required, Validators.minLength(4)]),
      gananciaNeta: new FormControl('', Validators.required),
      mes: new FormControl('', Validators.required),
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de Años Fiscales
    this.listarAnios();
    //Obtiene la lista de Alicuotas
    this.listarAlicuotasGanancia();
    //Obtiene la lista de meses
    this.listarMeses();
  }
  //carga la lista de Años Fiscales
  public listarAnios() {
    this.fechaService.listarAnioFiscal().subscribe(
      res => {
        this.anioFiscal = res.json();
      },
      err => {
      }
    )
  }
  //carga la lista de Alicuotas 
  public listarAlicuotasGanancia() {
    this.alicuotaGananciaService.listar().subscribe(
      res => {
        this.alicuotasGanancia = res.json();
      },
      err => {
      }
    )
  }
  //carga la lista de meses en pestaña listar
  private listarMeses() {
    this.mesService.listar().subscribe(
      res => {
        this.meses = res.json();
      },
      err => {
      }
    )
  }
  //Carga la tabla
  public listar() {
    this.loaderService.show();
    this.servicio.listarPorAnio(this.anio.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.message);
        this.loaderService.hide();
      }
    );
  }
  //Controla el cambio en el campo "anio"
  public cambioAnio(elemento) {
    if (elemento != undefined) {
      this.anio.setValue(elemento);
    }
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Controla el cambio en el campo "anio" pestaña listar
  public cambioAnioFiltro() {
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Controla el cambio en el campo "mes" pestaña listar
  public cambioMesFiltro() {
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Controla el cambio de seleccion
  public cambioGananciaNetaFiltro() {
    this.listaCompleta = new MatTableDataSource([]);
    if (!this.formularioFiltro.value.gananciaNeta) {
      this.formularioFiltro.get('mes').reset();
      this.formularioFiltro.get('mes').disable();
      this.formularioFiltro.get('mes').setValidators([]);
      this.formularioFiltro.get('mes').updateValueAndValidity();//Actualiza la validacion
    } else {
      this.formularioFiltro.get('mes').enable();
      this.formularioFiltro.get('mes').setValidators([Validators.required]);
      this.formularioFiltro.get('mes').updateValueAndValidity();//Actualiza la validacion
    }
  }
  //Carga la tabla por Filtros
  public listarPorFiltro() {
    this.loaderService.show();
    let mes = null;
    this.formularioFiltro.value.mes? mes=this.formularioFiltro.value.mes.id: mes=0;
    let anio = this.formularioFiltro.value.anio;
    this.servicio.listarPorFiltros(anio, mes).subscribe(
      res => {
        this.resultadosPorFiltro = res.json();
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.toastr.error("Error al obtener la lista de registros.");
        this.loaderService.hide();
      }
    );
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
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.formulario.enable();
        this.establecerValoresPestania(nombre, false, false, true, 'idAnioFiscal');
        break;
      case 2:
        this.formulario.enable();
        this.establecerValoresPestania(nombre, true, true, false, 'idAnio');
        break;
      case 3:
        this.formulario.disable();
        this.establecerValoresPestania(nombre, true, false, true, 'idAnio');
        break;
      case 4:
        this.formulario.enable();
        this.establecerValoresPestania(nombre, true, true, true, 'idAnio');
        break;
      case 5:
        this.establecerValoresPestania(nombre, true, true, true, 'idAnioListar');
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
        break;
      default:
        break;
    }
  }
  //Metodo Agregar 
  public agregar() {
    this.loaderService.show();
    let anio = this.formulario.value.anio;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (res.status == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.anio.setValue(anio);
          this.formulario.get('anio').setValue(anio);
          this.toastr.success(respuesta.mensaje);
          this.listar();
        }
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  public actualizar() {
    this.loaderService.show();
    let anio = this.formulario.value.anio;
    console.log(anio);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.anio.setValue(anio);
          this.formulario.get('anio').setValue(anio);
          console.log(anio);
          this.toastr.success(respuesta.mensaje);
          this.listar();
        }
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
      document.getElementById("labelAnioFiscal").classList.add('label-error');
      document.getElementById("idAnioFiscal").classList.add('is-invalid');
      document.getElementById("idAnioFiscal").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos de los formularios y limpia la lista de resultados de 
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formularioFiltro.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.formularioFiltro.get('gananciaNeta').setValue(true);
    this.anio.setValue(undefined);
    this.idMod = null;
  }
  //Controla que el campo "importe" (Ganancia Neta Acumulada) no sea menor o igual a cero
  public controlImporte() {
    this.establecerDecimales(this.formulario.get('importe'), 2); //Quita la máscara
    if (this.formulario.value.importe < 0 || this.formulario.value.importe == 0) {
      this.formulario.get('importe').setValue(null);
      this.toastr.error("La Ganancia Neta Acumulada debe ser mayor a cero");
      setTimeout(function () {
        document.getElementById('idImporte').focus();
      }, 20);
    }

  }
  //Controla que el campo "importeFijo" no sea mayor a "importe" ni menor a cero (puede ser cero)
  public controlImporteFijo() {
    let importe = Number(this.formulario.value.importe);
    if (!importe) {
      this.toastr.warning("Primero debe ingresar la Ganancia Neta Acumulada");
      setTimeout(function () {
        document.getElementById('idImporte').focus();
      }, 20);
    } else {
      this.establecerDecimales(this.formulario.get('importeFijo'), 2); //Quita la máscara
      let importeFijo = Number(this.formulario.value.importeFijo);
      if (importeFijo > importe || importeFijo < 0) {
        this.formulario.get('importeFijo').setValue(null);
        this.toastr.error("El Importe Fijo debe ser menor Ganancia Neta Acumulada y mayor o igual a cero");
        setTimeout(function () {
          document.getElementById('idImporteFijo').focus();
        }, 20);
      }
    }
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.idMod = elemento.id;
    if (this.indiceSeleccionado == 3)
      this.formulario.enable();
    this.formulario.patchValue(elemento);
    this.establecerDecimales(this.formulario.get('importe'), 2);
    this.establecerDecimales(this.formulario.get('importeFijo'), 2);
    this.listar();
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
  //Limpia los campos en la pestaña Actualizar
  public cancelar() {
    this.formulario.reset();
    this.formulario.disable();
    this.idMod = null;
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
  public compareF = this.compararF.bind(this);
  private compararF(a, b) {
    if (a != null && b != null) {
      return a === b;
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
      this.condicion = true;
    } else {
      this.condicion = false;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach((elemento, index) => {
      let importeExcedente =null;
      index == 0? importeExcedente = 0 : importeExcedente = lista[index-1].importe;
      let f = {
        anio_mes: elemento.mes ? elemento.mes : elemento.anio,
        ganancia_neta_de_mas: importeExcedente,
        ganancia_neta_a: elemento.importe,
        importe_fijo: elemento.importeFijo,
        alicuota: elemento.afipAlicuotaGanancia.alicuota,
        excedente: importeExcedente
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'IMP. a la Ganancia',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnasListar
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}