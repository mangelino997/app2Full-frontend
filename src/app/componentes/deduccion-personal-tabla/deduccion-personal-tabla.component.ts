import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { MesService } from 'src/app/servicios/mes.service';
import { AfipDeduccionPersonalTabla } from 'src/app/modelos/afipDeduccionPersonalTabla';
import { AfipTipoBeneficioDeduccionService } from 'src/app/servicios/afip-tipo-beneficio-deduccion.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AfipTipoBeneficioService } from 'src/app/servicios/afip-tipo-beneficio.service';
import { AfipDeduccionPersonalService } from 'src/app/servicios/afip-deduccion-personal.service';

@Component({
  selector: 'app-deduccion-personal-tabla',
  templateUrl: './deduccion-personal-tabla.component.html',
  styleUrls: ['./deduccion-personal-tabla.component.css']
})
export class DeduccionPersonalTablaComponent implements OnInit {
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
  //Define los formControl
  public anio: FormControl = new FormControl();
  public tipoBeneficio: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultadosPorFiltro: Array<any> = [];
  //Define las listas
  public anios: Array<any> = [];
  public tiposBeneficios: Array<any> = [];
  public deduccionesPersonales: Array<any> = [];
  public meses: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['anio', 'tipoBeneficio', 'deduccionPersonal', 'importeAcumulado', 'tipoImporte', 'mes', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipTipoBeneficioDeduccionService, 
    private modelo: AfipDeduccionPersonalTabla, private mesService: MesService, private afipTipoBenecioService: AfipTipoBeneficioService,
    private afipDeduccionPersonalService: AfipDeduccionPersonalService, public dialog: MatDialog) {
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
    //Obtiene la lista de Tipos de Beneficios
    this.listarTipoBeneficios();
    //Obtiene la lista de Deducciones Personales
    this.listarDeduccionPersonales();
    //Obtiene la lista de Meses
    this.listarMeses();
    //Inicializa el importeAnualMensual
    this.formulario.get('importeAnualMensual').setValue(false);
  }
  //carga la lista de Años Fiscales
  private listarAnios(){
    this.fechaService.listarAnioFiscal().subscribe(
      res=>{
        this.anios = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de año fiscal");
      }
    )
  }
  //carga la lista de Tipos de Beneficios
  private listarTipoBeneficios(){
    this.afipTipoBenecioService.listar().subscribe(
      res=>{
        console.log(res.json());
        this.tiposBeneficios = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de tipo de beneficios");
      }
    )
  }
  //carga la lista de Deducciones Personales
  private listarDeduccionPersonales(){
    this.afipDeduccionPersonalService.listar().subscribe(
      res=>{
        console.log(res.json());
        this.deduccionesPersonales = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de deducciones personales");
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
    this.reestablecerValores();
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
        this.establecerValoresPestania(nombre, true, false, true, 'idAnioFiscal');
        break;
      case 4:
        // this.establecerValoresPestania(nombre, true, true, true, 'idAnio');
        break;
      case 5:
        this.establecerValoresPestania(nombre, false, false, false, 'idAnio');
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
    this.anio.setValue(this.formulario.value.anio);
    this.tipoBeneficio.setValue(this.formulario.value.afipTipoBeneficio);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        this.formulario.get('anio').setValue(this.anio.value);
        this.formulario.get('afipTipoBeneficio').setValue(this.tipoBeneficio.value);
        setTimeout(function () {
          document.getElementById('idAnioFiscal').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
        this.listar();
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
    this.tipoBeneficio.setValue(this.formulario.value.afipTipoBeneficio);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.formulario.get('afipTipoBeneficio').setValue(this.tipoBeneficio.value);
          this.formulario.get('anio').setValue(this.anio.value);
          setTimeout(function () {
            document.getElementById('idAnioFiscal').focus();
          }, 20);
          this.listar();
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
  //Carga la Lista Completa - Tabla
  public listar(){
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    switch(this.indiceSeleccionado){
      case 1: 
      this.servicio.listar().subscribe(
        res => {
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
      break;

      case 2:
      case 3:
      case 4:
      case 5:
        this.servicio.listarPorAnioYTipoBeneficio(this.anio.value, this.tipoBeneficio.value.id).subscribe(
          res => {
            let respuesta = res.json();
            if(respuesta.length == 0){
              this.toastr.error("Sin datos para ésta consulta");
            }
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
        break;
    }    
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
    this.idMod = null;
    this.resultados = [];
  }
  //Reestablece los valores
  private reestablecerValores(){
    this.reestablecerFormulario(undefined);
    this.anio.reset();
    this.tipoBeneficio.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.idMod = elemento.id;
    this.formulario.patchValue(elemento);
    this.establecerDecimales(this.formulario.get('importe'), 2);
  }
  //elimina el registro seleccionado
  public activarEliminar(idElemento){
    this.loaderService.show();
    this.servicio.eliminar(idElemento).subscribe(
      res=>{
        let respuesta = res.json();
        this.listar();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Controla el cambio de seleccion
  public cambioTipoImporte(){
    if(!this.formulario.value.gananciaNeta)
      this.formulario.get('mes').reset();
  }
  //Controla el cambio de seleccion
  public cambioAnio(elemento){
    if(elemento != undefined){
      this.anio.setValue(elemento);
    }
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
  }
  //Controla el cambio de seleccion
  public cambioTipoBeneficio(elemento){
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.tipoBeneficio.setValue(elemento);
  }
  //Limpia los campos en la pestaña Actualizar
  public cancelar(){
    if(this.indiceSeleccionado == 3){
      let anio = this.formulario.value.anio;
      let tipoBeneficio = this.formulario.value.afipTipoBeneficio
      this.formulario.reset();
      this.formulario.get('anio').enable();
      this.formulario.get('anio').setValue(anio);
      this.formulario.get('afipTipoBeneficio').enable();
      this.formulario.get('afipTipoBeneficio').setValue(tipoBeneficio);
    }else{
      this.formulario.reset();
      this.formulario.enable();
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
  //Abre ventana Dialog 
  public verModaAnual(elemento): void {
    const dialogRef = this.dialog.open(ImporteAnualDialogo, {
      width: '750px',
      data: { 
        elemento: elemento
      },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
//Componente ventana modal/dialog
@Component({
  selector: 'importe-anual-dialog',
  templateUrl: 'importe-anual-dialog.html',
})
export class ImporteAnualDialogo {
  //Define el elemento que se pasa por paramentro
  public elemento: FormControl= new FormControl();
  //Lista de meses con sus importes
  public lista: Array<any> = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['mes', 'importeMensual'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ImporteAnualDialogo>, @Inject(MAT_DIALOG_DATA) public data, private mesService: MesService,
  private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.elemento.setValue(this.data.elemento);
    console.log(this.elemento.value); 
    this.listarMeses();
  }
  //Obtiene la lista de meses y le añade el importe
  private listarMeses(){
    this.mesService.listar().subscribe(
      res=>{
        console.log(res.json());
        let respuesta = res.json();
        this.calcularImporteMensual(respuesta);
      },
      err=>{
        this.toastr.error("Error al obtener la lista de meses");
      }
    )
    
  }
  //Calcula el importe mensual
  private calcularImporteMensual(listaMeses){
    let importeAcumulado = this.elemento.value.importe;
    listaMeses.forEach(item => {
      let importeMensual = (importeAcumulado/12)*item.id;
      let fila = {mes: item.nombre, importeMensual: importeMensual};
      this.lista.push(fila);
    });
    console.log(this.lista);
    this.listaCompleta = new MatTableDataSource(this.lista);
    this.listaCompleta.sort = this.sort;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
   
}