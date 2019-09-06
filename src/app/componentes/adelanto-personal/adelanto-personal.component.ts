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
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { DatePipe } from '@angular/common';

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
  //Define la lista de prestamos
  public listaPrestamos:Array<any> = [];
  //Define un formulario para validaciones de campos de la primera Pestaña
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
  //Define los formControl para las pestañas con Listar (Consultar, Actualizar, Eliminar, Listar)
  public sucursal: FormControl = new FormControl();
  public fechaEmisionDesde: FormControl = new FormControl();
  public fechaEmisionHasta: FormControl = new FormControl();
  public adelanto: FormControl = new FormControl();
  public personal: FormControl = new FormControl();
  public estado: FormControl = new FormControl();
  public alias: FormControl = new FormControl();
  //Define la fecha actual
  public FECHA_ACTUAL: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
   //Define las columnas de la tabla
  public columnas:string[] = ['sucursal', 'tipoCpte', 'numAdelanto', 'anulado', 'fechaEmision', 'fechaVto', 'personal',
  'importe', 'observaciones', 'usuario', 'cuota', 'totalCuotas', 'numeroLote', 'anular', 'mod', 'ver'];
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
    private personalService: PersonalService, private basicoCategoriaService: BasicoCategoriaService, private fechaService: FechaService,
    private sucursalService: SucursalService) {
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
      //Autocompletado
      this.autocompletado.valueChanges.subscribe(data => {
        if (typeof data == 'string' && data.length > 2) {
          this.personalService.listarPorAlias(data).subscribe(res => {
            this.resultados = res;
          })
        }
      });
      //Alias - Buscar por alias, empresa y sucursal
      let empresa = this.appService.getEmpresa();
      let usuario = this.appService.getUsuario();
      this.alias.valueChanges.subscribe(data => {
        if (typeof data == 'string' && data.length > 2) {
          this.personalService.listarActivosPorAliasEmpresaYSucursal(data, empresa.id, usuario.sucursal.id).subscribe(res => {
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
    //Obtiene la lista de Sucursal Emision
    this.listarSucursalesEmision();
    
  }
  //Carga la lista de Sucursales de Emision
  private listarSucursalesEmision(){
    this.sucursalService.listar().subscribe(
      res=>{
        this.sucursales = res.json();
      },
      err=>{
        console.log(err);
      }
    )
  }
  //Obtiene la fecha actual
  private obtenerFechaActual(){
    this.fechaService.obtenerFecha().subscribe(
      res=>{
        this.FECHA_ACTUAL.setValue(res.json());
        this.formulario.get('fechaEmision').setValue(res.json());
        this.fechaEmisionDesde.setValue(res.json());
        this.fechaEmisionHasta.setValue(res.json());
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
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 2:
        this.establecerValoresPestania(nombre, false, true, false, 'idSucursal');
        break;
      case 3:
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 4:
        this.establecerValoresPestania(nombre, false, true, true, 'idSucursal');
        break;
      case 5:
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
  public listarPorFiltros(){
    let empresa = null;
    let usuario = null;
    let idSucursal = null;
    let fechaDesde = null;
    let fechaHasta = null;
    let adelanto = null;
    let estado = null;
    let alias = null;
    //Setea valores
    empresa = this.appService.getEmpresa();
    usuario = this.appService.getUsuario();
    idSucursal = usuario.sucursal.id;
    fechaDesde = this.fechaEmisionDesde.value;
    fechaHasta = this.fechaEmisionHasta.value;
    adelanto = this.adelanto.value;
    estado = this.estado.value;
    alias = this.alias.value.alias;

    if(alias != undefined || alias != null)
      alias = this.alias.value.alias;
      else
      alias = "";
    //Consulta
    this.servicio.listarPorFiltros(empresa.id, idSucursal, fechaDesde, fechaHasta, adelanto, estado, alias).subscribe(
      res=>{
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
      },
      err=>{
        console.log(err);
      }
    )
  }
  //Agrega un registro
  private agregar(){
    this.loaderService.show();
    if(this.btnPrestamoModal){
      this.servicio.agregarPrestamo(this.listaPrestamos).subscribe(
        res=>{
          console.log(res);
          this.reestablecerFormulario(undefined);
          this.toastr.success("Registro agregado con éxito.");
          setTimeout(function () {
              document.getElementById("idAutocompletado").focus();
          }, 20);      
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }else{
      console.log(this.formulario.value);
      this.servicio.agregar(this.formulario.value).subscribe(
        res=>{
          console.log(res.json);
          this.reestablecerFormulario(undefined);
          this.toastr.success("Registro agregado con éxito.");
          setTimeout(function () {
            document.getElementById("idAutocompletado").focus();
          }, 20);
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Actualiza un registro
  private actualizar(){
    this.loaderService.show();
    console.log(this.formulario.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res=>{
        console.log(res.json);
        this.reestablecerFormulario(undefined);
        this.toastr.success("Registro actualizado con éxito.");
        setTimeout(function () {
          document.getElementById("idAutocompletado").focus();
        }, 20);
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Elimina un registro
  private eliminar(){
    this.loaderService.show();
    console.log(this.formulario.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res=>{
        console.log(res.json);
        this.reestablecerFormulario(undefined);
        this.toastr.success("Registro actualizado con éxito.");
        setTimeout(function () {
          document.getElementById("idAutocompletado").focus();
        }, 20);
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.get('personal').setValue(elemento);
    this.formulario.get('totalCuotas').setValue(elemento.cuotasPrestamo);
    this.categoria.setValue(elemento.categoria.nombre);
    this.nombre.setValue(elemento.nombre);
    this.apellido.setValue(elemento.apellido);
    this.legajo.setValue(elemento.id);
    this.obtenerBasicoCategoria(elemento.categoria.id);
    let recibePrestamo = elemento.recibePrestamo;
    this.btnPrestamoModal = null;
    this.listaPrestamos = [];
    console.log(elemento, recibePrestamo);
    if(recibePrestamo){
      this.formulario.get('importe').disable();
      this.btnPrestamoModal = true;
    }else{
      this.btnPrestamoModal = false;
    }
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
    this.autocompletado.reset();
    this.alias.reset();
    this.listaPrestamos = [];
    this.resultados = [];
    let usuario = this.appService.getUsuario();
    let empresa = this.appService.getEmpresa();
    let sucursal = usuario.sucursal;
    this.obtenerFechaActual();
    this.formulario.get('sucursal').setValue(sucursal);
    this.formulario.get('empresa').setValue(empresa);
    if(this.indiceSeleccionado == 1){
      this.formulario.get('usuarioAlta').setValue(usuario);
      this.formulario.get('observaciones').setValidators([]);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
      this.formulario.get('fechaVto').setValidators([]);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
    }
    if(this.indiceSeleccionado == 3){
      this.formulario.get('usuarioMod').setValue(usuario);
      this.formulario.get('observaciones').setValidators([]);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
      this.formulario.get('fechaVto').setValidators(Validators.required);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
    }
    if(this.indiceSeleccionado == 4){
      this.formulario.get('usuarioBaja').setValue(usuario);
      this.formulario.get('observaciones').setValidators(Validators.required);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
      this.formulario.get('fechaVto').setValidators([]);
      this.formulario.get('observaciones').updateValueAndValidity();//Actualiza la validacion
    }
    this.saldoActual.setValue(this.appService.establecerDecimales('0.00', 2));
    this.btnPrestamoModal = null;

  }
  //Controla el cmapo importe
  public controlarImporte(){
    let importeDisponible = null;
    let importe = null;
    importeDisponible = Number(this.importeDisponible.value);
    importe = this.formulario.value.importe;
    console.log(importe, importeDisponible);
    if(importe!=null || importe!=undefined)
      this.formulario.get('importe').setValue(this.appService.establecerDecimales(importe, 2));
      else
      this.formulario.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
    importe = Number(this.appService.establecerDecimales(importe, 2));
    this.controlarImporteSuperior(importe, importeDisponible);
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
  //Controla el cambio en el campo "Fecha Emision Desde"
  public controlarFechaEmisionDesde(){
    let fechaEmisionDesde = null;
    let fechaEmisionHasta = null;
    fechaEmisionDesde = this.fechaEmisionDesde.value;
    fechaEmisionHasta = this.fechaEmisionHasta.value;
    if(fechaEmisionDesde > fechaEmisionHasta){
      this.toastr.error("Fecha Emisión Desde debe ser igual o menor a la Fecha Emisión Hasta.");
      this.fechaEmisionDesde.setValue(null);
      setTimeout(function () {
        document.getElementById('idFechaEmisionDesde').focus();
      }, 20);
    }
  }
  //Controla el cambio en el campo "Fecha Emision Hasta"
  public controlarFechaEmisionHasta(){
    let fechaEmisionDesde = null;
    let fechaEmisionHasta = null;
    fechaEmisionDesde = this.fechaEmisionDesde.value;
    fechaEmisionHasta = this.fechaEmisionHasta.value;
    if(fechaEmisionDesde == null || fechaEmisionDesde == undefined){
      this.toastr.error("Debe ingresar Fecha de Emisión Desde.");
      setTimeout(function () {
        document.getElementById('idFechaEmision').focus();
      }, 20);
    }else if(fechaEmisionHasta < fechaEmisionDesde){
      this.toastr.error("Fecha Emision Hasta debe ser igual o mayor a Fecha de Emisión Desde.");
      this.formulario.get('idFechaEmisionDesde').setValue(null);
      this.formulario.get('idFechaEmisionHasta').setValue(this.FECHA_ACTUAL.value);
      setTimeout(function () {
        document.getElementById('idFechaEmisionDesde').focus();
      }, 20);
    }
  }
  //Controla el cambio en el select "Personal"
  public cambioPersonal(){
    let opcion = null;
    opcion = this.personal.value;
    console.log(opcion);
    if(opcion){
      this.alias.enable();
      this.alias.setValidators(Validators.required);
      this.alias.updateValueAndValidity();//Actualiza la validacion
    }else{
      this.alias.disable();
      this.alias.setValidators([]);
      this.alias.updateValueAndValidity();//Actualiza la validacion
      this.alias.setValue(null);
    }
  }
  //Anula un registro de la tabla
  public activarAnular(elemento){
    console.log(elemento);
    this.formulario.patchValue(elemento);
  }
  //Actualiza un registro de la tabla
  public activarActualizar(elemento){
    console.log(elemento);
    this.formulario.patchValue(elemento);
  }
  //Abre un modal al consultar un registro de la tabla
  public activarConsultar(elemento){
    const dialogRef = this.dialog.open(DetalleAdelantoDialogo, {
      width: '95%',
      maxWidth: '100vw',
      data: { 
        personalAdelanto: elemento
       },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.listaPrestamos = result;
    });
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar(){
    this.formulario.reset();
  }
  //Abre modal de prestamos
  public abrirPrestamoModal(){
    const dialogRef = this.dialog.open(PrestamoDialogo, {
      width: '95%',
      maxWidth: '100vw',
      data: { 
        personalAdelanto: this.formulario.value
       },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.listaPrestamos = result;
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
  //Define a personal adelanto como un formControl
  public personalAdelanto:FormControl = new FormControl();
  //Define el total del prestamo como un formControl
  public totalPrestamo:FormControl = new FormControl();
  //Define la cantidad de cuotas como un formControl
  public totalCuotas:FormControl = new FormControl();
  //Define la Diferencia como un formControl
  public diferencia:FormControl = new FormControl();
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define si habilita el boton Aceptar
  public btnAceptar: boolean = null;
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
  private servicio: PersonalAdelantoService, private toastr: ToastrService, private loaderService: LoaderService,
  private datePipe: DatePipe) {
    dialogRef.disableClose = true;
   }
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
      fechaVto: new FormControl('', Validators.required),
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
    this.personalAdelanto.setValue(this.data.personalAdelanto);
    this.totalCuotas.setValue(this.personalAdelanto.value.personal.cuotasPrestamo);
  }
  //Realiza la accion confirmar
  public confirmar(){
    this.loaderService.show();
    let totalPrestamo = Number(this.appService.establecerDecimales(this.totalPrestamo.value, 2));
    this.personalAdelanto.value.importe = totalPrestamo;
    console.log(this.personalAdelanto.value);
    this.servicio.listarCuotas(this.personalAdelanto.value).subscribe(
      res=>{
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.calcularImporteTotal();
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
    this.listaCompleta.data[this.idMod].importe = this.formulario.value.importe;
    this.listaCompleta.data[this.idMod].fechaVto = this.formulario.value.importe;
    this.listaCompleta.sort = this.sort;
    this.calcularImporteTotal();
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
    this.formulario.get('cuota').setValue(elemento.cuota);
    this.formulario.get('fechaVto').setValue(this.datePipe.transform(elemento.fechaVto, "yyyy-MM-dd"));
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.numeroCuota.setValue(elemento.cuota);
    this.idMod= indice;
  }
  //Calcula el importe total 
  private calcularImporteTotal(){
    let totalImporte = 0;
    this.listaCompleta.data.forEach(
      item=>{
        //Obtiene el importe de cada item
        let importe = Number(item.importe);
        //Suma los importes
        totalImporte += importe;
      }
    )
    this.calcularDiferencia(totalImporte);
  }
  //Calcula el campo diferencia
  private calcularDiferencia(totalImporte){
    let diferencia = 0;
    let totalPrestamo = 0;
    totalPrestamo = Number(this.appService.establecerDecimales(this.totalPrestamo.value, 2));
    diferencia = totalPrestamo - totalImporte;
    if(diferencia == 0){
      this.btnAceptar = true;
      this.diferencia.setValue(this.appService.establecerDecimales('0.00', 2));
    }else{
      this.btnAceptar = false;
      this.diferencia.setValue(this.appService.establecerDecimales(diferencia, 2));
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
    }
  }
  closeDialog(opcion) {
    if(opcion == 'aceptar'){
      console.log(this.btnAceptar);
      if(this.btnAceptar)
      this.dialogRef.close(this.listaCompleta.data);
      else
        this.toastr.warning("Campo Diferencia debe ser cero.");
    }
    if(opcion == 'cerrar'){
      this.dialogRef.close(null);
    }
  }
   
}

//Componente 
@Component({
  selector: 'detalle-adelanto-dialogo',
  templateUrl: 'detalle-adelanto-dialogo.html',
})
export class DetalleAdelantoDialogo {
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la Fecha Liquidacion como un formControl
  public fechaLiquidacion:FormControl = new FormControl();
  //Define la N° Liquidacion como un formControl
  public numeroLiquidacion:FormControl = new FormControl();
  //Define el usuario anulacion como un formControl
  public usuarioAnulacion:FormControl = new FormControl();
  //Define el usuario mod de cuotas como un formControl
  public usuarioMod:FormControl = new FormControl();
  //Constructor
  constructor(public dialogRef: MatDialogRef<PrestamoDialogo>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService, 
  private loaderService: LoaderService, private modelo: PersonalAdelanto) {
    dialogRef.disableClose = true;
   }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario y sus validaciones
    this.formulario = this.modelo.formulario;
    //Reestablece el formulario
    this.reestablecerFormulario();
  }
  //Reestablece los campos del formulario
  private reestablecerFormulario(){
    this.formulario.reset();
    this.fechaLiquidacion.setValue(null);
    this.numeroLiquidacion.setValue(null);
    this.usuarioAnulacion.reset();
    this.usuarioAnulacion.reset();
    this.formulario.patchValue(this.data.personalAdelanto);
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
  closeDialog() {
    this.dialogRef.close(null);
  }
}