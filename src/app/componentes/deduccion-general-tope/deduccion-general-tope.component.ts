import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipDeduccionGeneralTopeService } from 'src/app/servicios/afip-deduccion-general-tope.service';
import { AfipDeduccionGeneralTope } from 'src/app/modelos/afipDeduccionGeneralTope';
import { LoaderState } from 'src/app/modelos/loader';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AfipDeduccionGeneralService } from 'src/app/servicios/afip-deduccion-general.service';

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
  public columnas: string[] = ['anio', 'deduccionGeneral', 'descripcion', 'importe', 'porcentajeGananciaNeta', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipDeduccionGeneralTopeService,
    private modelo: AfipDeduccionGeneralTope, private deduccionesGralService: AfipDeduccionGeneralService ) {
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
    //Obtiene la lista de Años Fiscales
    this.listarAnios();
    //Obtiene la lista de Deducciones Generales
    this.listarDeduccionesGenerales();
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
  //carga la lista de Años Fiscales
  public listarDeduccionesGenerales(){
    this.deduccionesGralService.listar().subscribe(
      res=>{
        this.deduccionesGenerales = res.json();
      },
      err=>{
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
  //Obtiene el listado de registros
  public listar() {
    this.loaderService.show();
    this.servicio.listarPorAnio(this.anio.value).subscribe(
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
  //Metodo Agregar 
  private agregar() {
    this.loaderService.show();    
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        setTimeout(function () {
          document.getElementById('idAnioFiscal').focus();
        }, 20);
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
    console.log(this.formulario.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
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
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
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
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.anio.setValue(undefined);
    this.resultados = [];
    setTimeout(function () {
      document.getElementById('idAnio').focus();
    }, 20);
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
    if(this.indiceSeleccionado == 5){
      this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    }
    this.formulario.patchValue(elemento);
    this.establecerDecimales(this.formulario.get('importe'), 2);
    this.formulario.get('porcentajeGananciaNeta').setValue(this.appService.desenmascararPorcentaje(elemento.porcentajeGananciaNeta.toString(), 2));
    this.anio.setValue(elemento.anio);
    this.listar();
  }
  //elimina el registro seleccionado
  public activarEliminar(idElemento){
    this.loaderService.show();
    this.servicio.eliminar(idElemento).subscribe(
      res=>{
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.listar();
        this.loaderService.hide();
      },
      err=>{
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
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentajeDosEnteros();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    let valor = formulario.value;
    if(valor){
      formulario.setValue(this.appService.desenmascararPorcentaje(valor, cantidad));
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
