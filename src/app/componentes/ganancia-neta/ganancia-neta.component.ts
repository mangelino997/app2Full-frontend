import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
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
  public formularioListar: FormGroup;
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
  //Define las columnas de la tabla
  public columnas: string[] = ['anio', 'gananciaNetaAcumulada', 'importeFijo', 'alicuotaSinExcedente', 'mod', 'eliminar'];
  public columnasListar: string[] = ['anioMes', 'gananciaNetaDeMas', 'gananciaNetaA', 'importeFijo', 'alicuota', 'excedente'];

  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipGananciaNetaService, 
    private modelo: AfipGananciaNeta, private alicuotaGananciaService: AfipAlicuotaGananciaService, private mesService: MesService) {
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
  //Define el formularioListar y sus validaciones
  this.formularioListar = new FormGroup({
    anio: new FormControl('', Validators.required),
    gananciaNeta: new FormControl('', Validators.required),
    mes: new FormControl(),
  });
  //Establece los valores de la primera pestania activa
  this.seleccionarPestania(1, 'Agregar', 0);
  //Obtiene la lista de Años Fiscales
  this.listarAnios();
  //Obtiene la lista de Alicuotas
  this.listarAlicuotasGanancia();
  }
  //carga la lista de Años Fiscales
  public listarAnios(){
    this.fechaService.listarAnioFiscal().subscribe(
      res=>{
        this.anioFiscal = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de año fiscal");
      }
    )
  }
  //carga la lista de Alicuotas 
  public listarAlicuotasGanancia(){
    this.alicuotaGananciaService.listar().subscribe(
      res=>{
        console.log(res.json());
        this.alicuotasGanancia = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de año fiscal");
      }
    )
  }
  //carga la lista de meses en pestaña listar
  private listarMeses(){
    this.mesService.listar().subscribe(
      res=>{
        console.log(res.json());
        this.meses = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de meses");
      }
    )
  }
  //Carga la tabla
  public listarPorAnio(){
    this.loaderService.show();
    let anio = null;
    if(this.anio.value)
      anio = this.anio.value;
      else
      anio = this.formulario.value.anio;
    this.servicio.listarPorAnio(anio).subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Controla el cambio de seleccion
  public cambioGananciaNeta(){
    if(!this.formularioListar.value.gananciaNeta)
      this.formularioListar.get('mes').reset();
  }
  //Carga la tabla por Filtros
  public listarPorFiltro(){
    this.loaderService.show();
    let mes = null;
    let anio = this.formularioListar.value.anio;
    if(this.formularioListar.value.mes)
      mes = this.formularioListar.value.mes.id;
      else
      mes = 0;
    this.servicio.listarPorFiltros(anio, mes).subscribe(
      res => {
        console.log(res.json());
        this.resultadosPorFiltro = res.json();
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
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
  public seleccionarPestania(id, nombre, opcion) {
    this.formulario.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.anio.setValue(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.resultados = [];
    if (opcion == 0) {
      this.anio.setValue(undefined);
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
        this.listarMeses();
        this.formularioListar.get('gananciaNeta').setValue(true);
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    console.log(indice);
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
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        if(this.indiceSeleccionado == 1){
          this.formulario.get('anio').setValue(anio);
          setTimeout(function () {
            document.getElementById('idAnioFiscal').focus();
          }, 20);
        }else{
          this.anio.setValue(anio);
          setTimeout(function () {
            document.getElementById('idAnio').focus();
          }, 20);
        }
        this.toastr.success(respuesta.mensaje);
        this.listarPorAnio();
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
    console.log(this.formulario.value);
    let anio = this.formulario.value.anio;
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          if(this.indiceSeleccionado == 1){
            this.formulario.get('anio').setValue(anio);
            setTimeout(function () {
              document.getElementById('idAnioFiscal').focus();
            }, 20);
          }else{
            this.anio.setValue(anio);
            setTimeout(function () {
              document.getElementById('idAnio').focus();
            }, 20);
          }
          this.toastr.success(respuesta.mensaje);
          this.listarPorAnio();
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
      document.getElementById("labelAnioFiscal").classList.add('label-error');
      document.getElementById("idAnioFiscal").classList.add('is-invalid');
      document.getElementById("idAnioFiscal").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.anio.setValue(undefined);
    this.idMod = null;
    this.resultados = [];
    setTimeout(function () {
      document.getElementById('idAnioFiscal').focus();
    }, 20);
  }
  //Controla que el campo "importe" (Ganancia Neta Acumulada) no sea menor o igual a cero
  public controlImporte(){
    this.establecerDecimales(this.formulario.get('importe'), 2); //Quita la máscara
    if(this.formulario.value.importe < 0 || this.formulario.value.importe == 0){
      this.formulario.get('importe').setValue(null);
      this.toastr.error("La Ganancia Neta Acumulada debe ser mayor a cero");
      setTimeout(function () {
        document.getElementById('idImporte').focus();
      }, 20);
    }

  }
  //Controla que el campo "importeFijo" no sea mayor a "importe" ni menor a cero (puede ser cero)
  public controlImporteFijo(){
    let importe = this.formulario.value.importe;
    if(!importe){
      this.toastr.warning("Primero debe ingresar la Ganancia Neta Acumulada");
      setTimeout(function () {
        document.getElementById('idImporte').focus();
      }, 20);
    }else{
      this.establecerDecimales(this.formulario.get('importeFijo'), 2); //Quita la máscara
      let importeFijo = this.formulario.value.importeFijo;
      if(importeFijo > importe || importeFijo < 0){
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
    if(this.indiceSeleccionado == 3)
      this.formulario.enable();
    this.formulario.patchValue(elemento);
    this.establecerDecimales(this.formulario.get('importe'), 2);
    this.establecerDecimales(this.formulario.get('importeFijo'), 2);
    this.listarPorAnio();
  }
  //elimina el registro seleccionado
  public activarEliminar(idElemento){
    this.loaderService.show();
    this.servicio.eliminar(idElemento).subscribe(
      res=>{
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.listarPorAnio();
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Limpia los campos en la pestaña Actualizar
  public cancelar(){
    this.formulario.reset();
    this.formulario.disable();
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
  public mascararEnterosConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
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
