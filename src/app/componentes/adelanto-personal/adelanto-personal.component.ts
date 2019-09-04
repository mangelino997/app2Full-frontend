import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';
import { PersonalService } from 'src/app/servicios/personal.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';

@Component({
  selector: 'app-adelanto-personal',
  templateUrl: './adelanto-personal.component.html',
  styleUrls: ['./adelanto-personal.component.css']
})
export class AdelantoPersonalComponent implements OnInit {
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de categorias
  public categorias: Array<any> = [];
  //Define el resultado
  public resultados: Array<any> = [];
  //Define la pestania activa
  public activeLink:any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si habilita el boton de abrir modal prestamo
  public btnPrestamoModal: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define la lista de opciones
  public opciones:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define los formControl de la vista
  public legajo: FormControl = new FormControl();
  public apellido: FormControl = new FormControl();
  public nombre: FormControl = new FormControl();
  public saldoActual: FormControl = new FormControl();
  public categoria: FormControl = new FormControl();
  public basicoCategoria: FormControl = new FormControl();
  public topeAdelanto: FormControl = new FormControl();
  public importeDisponible: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
   //Define las columnas de la tabla
  public columnas:string[] = ['sucursal', 'tipoCpte', 'numAdelanto', 'anulado', 'fechaEmision', 'fechaVto', 'personal',
  'importe', 'observaciones', 'usuario', 'cuota', 'totalCuotas', 'numeroLote', 'anualr', 'ver'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render:boolean = false;
  //Constructor
  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: PersonalAdelanto, private servicio: PersonalAdelantoService, public dialog: MatDialog,
    private personalService: PersonalService, private basicoCategoriaService: BasicoCategoriaService, private fechaService: FechaService) {
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
      this.autocompletado.valueChanges.subscribe(data => {
        if (typeof data == 'string' && data.length > 2) {
          this.personalService.listarPorAlias(data).subscribe(res => {
            this.resultados = res;
          })
        }
      })
     }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Reestablece el formulario
    this.reestablecerFormulario(undefined);
    
  }
  //Obtiene la fecha actual
  private obtenerFechaActual(){
    this.fechaService.obtenerFecha().subscribe(
      res=>{
        console.log(res.json());
        this.formulario.get('fechaEmision').setValue(res.json());
      },
      err=>{
        console.log(err);
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
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, true, false, true, 'idNombre');
        break;
      case 2:
        this.establecerValoresPestania(nombre, false, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, false, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, false, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
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
        this.eliminar();
        break;
      default:
        break;
    }
  }

  //Carga la tabla con los registros
  private listar(){
    
  }
  //Agrega un registro
  private agregar(){
  }
  //Actualiza un registro
  private actualizar(){

  }
  //Elimina un registro
  private eliminar(){
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.get('personal').setValue(elemento);
    this.categoria.setValue(elemento.categoria.nombre);
    this.nombre.setValue(elemento.nombre);
    this.apellido.setValue(elemento.apellido);
    this.legajo.setValue(elemento.id);
    this.obtenerBasicoCategoria(elemento.categoria.id);
    this.btnPrestamoModal = null;
  }
  //Obtiene el valor de basico categoria
  private obtenerBasicoCategoria(idCategoria){
    this.basicoCategoriaService.obtenerPorCategoria(idCategoria).subscribe(
      res=>{
        let respuesta = res.json();
        this.basicoCategoria.setValue(this.appService.establecerDecimales(respuesta.basico, 2));
        this.calcularImporteDisponible();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error);
      }
    )
  }
  //Calcula el importe disponible
  private calcularImporteDisponible(){
    let elemento = null;
    let topeBasicoAdelanto = null;
    let basico = null;
    let importeDisponible = null;
    elemento = this.formulario.value.personal;
    topeBasicoAdelanto = elemento.categoria.topeBasicoAdelantos;
    basico = this.basicoCategoria.value;
    importeDisponible = (topeBasicoAdelanto/100)*basico;
    this.importeDisponible.setValue(this.appService.establecerDecimales(importeDisponible, 2));
    this.topeAdelanto.setValue(this.appService.establecerDecimales(topeBasicoAdelanto, 2));
  }
  //Reestablece el formulario
  private reestablecerFormulario(id){
    this.formulario.reset();
    this.basicoCategoria.reset();
    this.saldoActual.setValue(this.appService.establecerDecimales('0.00', 2));
    this.obtenerFechaActual();
    this.btnPrestamoModal = null;
  }
  //Controla el cmapo importe
  public controlarImporte(){
    let importeDisponible = null;
    let recibePrestamo = null;
    let importe = null;
    recibePrestamo = this.formulario.value.personal.recibePrestamo;
    importeDisponible = Number(this.importeDisponible.value);
    importe = Number(this.appService.establecerDecimales(this.formulario.value.importe, 2));
    if(!recibePrestamo){
      this.controlarImporteSuperior(importe, importeDisponible);
      this.btnPrestamoModal = false;
    }else{
      this.importeDisponible.disable();
      this.btnPrestamoModal = true;
    }
  }
  //Si recibePrestamo == false, controla que el "Importe" no supere al campo “Importe Disponible”  
  private controlarImporteSuperior(importe, importeDisponible){
    if(importe > importeDisponible){
      this.formulario.get('importe').reset();
      this.toastr.error("El valor no puede ser superior al campo 'Importe Disponible'.");
      setTimeout(function () {
        document.getElementById('idImporte').focus();
      }, 20);
    }else{
      this.formulario.get('importe').setValue(this.appService.establecerDecimales(importe, 2));
    }
  }
  //Abre modal de prestamos
  public abrirPrestamoModal(){
    const dialogRef = this.dialog.open(PrestamoDialogo, {
      width: '750px',
      data: { 
        personal: this.formulario.get('personal').value
       },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
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
    }
  }
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
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
      return elemento.alias ? elemento.alias : elemento;
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

//Componente 
@Component({
  selector: 'prestamo-dialogo',
  templateUrl: 'prestamo-dialogo.html',
})
export class PrestamoDialogo {
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define el total del prestamo como un formControl
  public totalPrestamo:FormControl = new FormControl();
  //Define la cantidad de cuotas como un formControl
  public totalCuotas:FormControl = new FormControl();
  //Define la Diferencia como un formControl
  public diferencia:FormControl = new FormControl();
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define el campo N° de Cuota como FormControl
  public numeroCuota: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas:string[] = ['numeroCuota', 'fechaVencimiento', 'importe', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Se subscribe al loader
  subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<PrestamoDialogo>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService,
  private servicio: PersonalAdelantoService, private toastr: ToastrService, private loaderService: LoaderService,) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      cuota: new FormControl('', Validators.required),
      fechaVencimiento: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required)
    });
    //Reestablece el formulario
    this.reestablecerFormulario();
  }
  //Reestablece los campos del formulario
  private reestablecerFormulario(){
    this.formulario.reset();
    this.totalPrestamo.reset();
    this.totalCuotas.reset();
    this.diferencia.reset();
    this.totalCuotas.setValue(this.data.personal.cuotasPrestamo);
  }
  //Realiza la accion confirmar
  public confirmar(){
    this.loaderService.show();
    let totalPrestamo = Number(this.appService.establecerDecimales(this.totalPrestamo.value, 2));
    let cuotas = this.totalCuotas.value;
    console.log(totalPrestamo, cuotas);
    this.servicio.listarCuotas(totalPrestamo, cuotas).subscribe(
      res=>{
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error);
        this.loaderService.hide();
      }
    )
  }
  //Actualiza un registro de la tabla
  public actualizar(){
    this.listaCompleta.data[this.idMod] = this.formulario.value;
    this.listaCompleta.sort = this.sort;
    // this.calcularImporteTotal();
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar(){
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
  }
  //Completa los campos del formulario con los datos del registro a modificar
  public activarActualizar(elemento, indice){
    this.formulario.setValue(elemento);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.numeroCuota.setValue(indice + 1);
    this.idMod= indice;
  }
  //Calcula el importe total 
  //Calcula el campo diferencia
  private calcularDiferencia(){
    this.listaCompleta.data.forEach(
      item=>{
        let totalImporte = 0;
        //Obtiene el importe de cada item
        let importe = Number(item.importe);
        //Suma los importes
        totalImporte += importe;
      }
    )
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
    }
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
   
}