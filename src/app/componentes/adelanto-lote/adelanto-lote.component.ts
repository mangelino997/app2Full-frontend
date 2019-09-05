import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';

@Component({
  selector: 'app-adelanto-lote',
  templateUrl: './adelanto-lote.component.html',
  styleUrls: ['./adelanto-lote.component.css']
})
export class AdelantoLoteComponent implements OnInit {
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
  //Define a topeMax como un formControl
  public topeMax: FormControl = new FormControl();
  //Define a categoria como un formControl
  public categoria: FormControl = new FormControl();
  //Define a basicoCategoria como un formControl
  public basicoCategoria: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
   //Define las columnas de la tabla
  public columnas:string[] = ['id', 'razonSocial', 'tipoDocumento', 'numeroDocumento', 'telefono', 'domicilio', 'localidad', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render:boolean = false;
  //Constructor
  constructor( private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: PersonalAdelanto, private sucursalService: SucursalService, 
    private categoriaService: CategoriaService, private fechaService: FechaService, private basicoCategoriaService: BasicoCategoriaService,
    private servicio: PersonalAdelantoService, public dialog: MatDialog) {
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
    //Obtiene la lista de Sucursales
    this.listarSucursales();
    //Obtiene la lista de Categorias
    this.listarCategorias();
  }
  //Carga la lista de sucursales
  private listarSucursales(){
    this.sucursalService.listar().subscribe(
      res=>{
        this.sucursales = res.json();
      },
      err=>{
        console.log(err);
      }
    );
  }
  //Carga la lista de categorias
  private listarCategorias(){
    this.categoriaService.listar().subscribe(
      res=>{
        this.categorias = res.json();
      },
      err=>{
        console.log(err);
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
  }
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
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idSucursal');
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
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }

  //Agrega un registro
  private agregar(){
    this.loaderService.show();
    let empresa = null;
    let sucursal = null;
    let categoria = null;
    let importe = null;
    let observaciones = null;
    let usuario = null;
    empresa = this.appService.getEmpresa();
    usuario = this.appService.getUsuario();
    observaciones = this.formulario.value.observaciones;
    importe = this.formulario.value.importe;
    categoria = this.formulario.value.categoria;
    sucursal = usuario.sucursal;
    
    console.log(empresa.id, sucursal.id, categoria.id, observaciones, importe);
    this.servicio.agregarLote(empresa.id, sucursal.id, categoria.id, usuario.id, observaciones, importe).subscribe(
      res=>{
        console.log(res.json());
        let respuesta = res.json();
        if(respuesta.length == 0){
          this.toastr.success("Registros agregados con éxito");
          setTimeout(function () {
            document.getElementById('idSucursal').focus();
          }, 20);
          this.loaderService.hide();
        }else{
          this.toastr.error("Registros no guardados");
          const dialogRef = this.dialog.open(AdelantoLoteDialogo, {
            width: '750px',
            data: { 
              listaPersonalAdelanto: respuesta
             },
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result.length == 0){
              this.toastr.success("Se agregaron todos los registros correctamente.");
            }else{
              this.toastr.error("Registros no guardados");

            }
          });
        }
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error);
        this.loaderService.hide();
      }
    )
  }
  //Elimina un registro
  private eliminar(){
    this.loaderService.show();
    let usuarioBaja = this.appService.getUsuario();
  }
  //Reestablece el formulario
  private reestablecerFormulario(id){
    this.formulario.reset();
    this.topeMax.reset();
    this.basicoCategoria.reset();
    this.categoria.reset();
    this.fechaService.obtenerFecha().subscribe(
      res=>{
        console.log(res.json());
        this.formulario.get('fechaEmision').setValue(res.json());
      },
      err=>{
        console.log(err);
      }
    );
  }
  //Controla el cambio en categoria
  public cambioCategoria(){
    let categoria = this.categoria.value;
    if(categoria != 0){
      this.basicoCategoriaService.obtenerPorCategoria(categoria.id).subscribe(
        res=>{
          this.basicoCategoria.setValue(res.json());
          let topeMax = (categoria.topeBasicoAdelantos/100)*this.basicoCategoria.value.basico;
          this.topeMax.setValue(this.appService.establecerDecimales(topeMax, 2));
        },
        err=>{
          console.log(err);
        }
      )
    }else{
      this.topeMax.setValue(this.appService.establecerDecimales('0.00', 2));
    }
  }
  //Controla y valida el improte
  public controlarImporte(){
    let categoria = this.categoria.value;
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(this.formulario.value.importe, 2));
    let importe = Number(this.formulario.get('importe').value);
    let topeMax = Number(this.topeMax.value);
    console.log(importe, topeMax);
    if(categoria != 0){
      if(importe > topeMax){
        this.toastr.error("El importe no debe ser mayor al tope máximo.");
        this.formulario.get('importe').setValue(null);
        setTimeout(function () {
          document.getElementById('idImporte').focus();
        }, 20);
      }
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
}
//Componente 
@Component({
  selector: 'adelanto-lote-dialogo',
  templateUrl: 'adelanto-lote-dialogo.html',
})
export class AdelantoLoteDialogo {
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas:string[] = ['numeroLegajo', 'personal', 'motivo'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<AdelantoLoteDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    console.log(this.data.listaPersonalAdelanto);
    this.listaCompleta = new MatTableDataSource(this.data.listaPersonalAdelanto);
    this.listaCompleta.sort = this.sort;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
   
}