import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup, FormControl } from '@angular/forms';
import { ZonaService } from 'src/app/servicios/zona.service';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { RepartoPropioService } from 'src/app/servicios/reparto-propio.service';
import { RepartoTerceroService } from 'src/app/servicios/reparto-tercero.service';
import { RetiroDepositoService } from 'src/app/servicios/retiro-deposito.service';
import { RepartoPropioComprobanteService } from 'src/app/servicios/reparto-propio-comprobante.service';
import { RepartoTerceroComprobanteService } from 'src/app/servicios/reparto-tercero-comprobante.service';
import { RetiroDepositoComprobanteService } from 'src/app/servicios/retiro-deposito-comprobante.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css']
})
export class RepartoComponent implements OnInit {
  //Define el formulario General
  public formulario:FormGroup;
  //Define el formulario Comrpobante
  public formularioComprobante:FormGroup;
  //Define como un formControl
  public usuario:FormControl = new FormControl();
  //Define como un formControl
  public sucursal:FormControl = new FormControl();
  //Define como un formControl
  public tipoViaje:FormControl = new FormControl();
  //Define como un formControl
  public tipoRemolque:FormControl = new FormControl();
  //Define la lista de resultados para vehiculo o vehiculoProveedor
  public resultadosVehiculo = [];
  //Define la lista de resultados para remolque
  public resultadosRemolque = [];
  //Define la lista de resultados para chofer
  public resultadosChofer = [];
  //Define la lista de resultados para Zonas, Comprobantes, Letras
  public resultadosZona = [];
  // public resultadosComprobante = [];
  //Define el Id de la Planilla seleccionada en la primer Tabla
  // //Define como un formControl
  // public tipoItem:FormControl = new FormControl();
  // //Define la lista de acompañantes
  // public listaAcompaniantes = [];
  // //Define la lista de tipo comprobantes Activos 
  // public listaTipoComprobantes = [];
  // //Define una bandera para control
  // public bandera:boolean=false;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['numeroReparto', 'fecha', 'zona', 'vehiculo', 'chofer', 'ordenesCombustibles', 'adelantosEfectivos',
    'comprobantes', 'cerrar', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private modelo: Reparto, private zonaService: ZonaService, private toastr: ToastrService, private appService: AppService,
    private appComponent: AppComponent, private vehiculoService: VehiculoService, private vehiculoProveedorService: VehiculoProveedorService,
    private personalServie: PersonalService, private choferProveedorService: ChoferProveedorService, public dialog: MatDialog, 
    private servicio: RepartoService, private fechaService: FechaService) {
     }

  ngOnInit() {
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    // this.formularioComprobante = this.modelo.formularioComprobante;
    //Establece el N° de reparto
    this.obtenerSiguienteId();
    //Reestablece los valores
    this.reestablecerFormulario(undefined);
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene un listado de Zonas
    this.listarZonas();
    //Autocompletado vehiculo- Buscar por alias
    let empresa = this.appService.getEmpresa();
    this.formulario.get('vehiculo').valueChanges.subscribe(data => {
      console.log(this.tipoViaje.value);
      let tipoViaje = this.tipoViaje.value;
      if(tipoViaje == 1){
        if (typeof data == 'string' && data.length > 2) {
          this.vehiculoService.listarPorAliasYEmpresa(data, empresa.id).subscribe(response => {
            this.resultadosVehiculo = response;
          })
        }
      }
      if(tipoViaje == 2){
        if (typeof data == 'string' && data.length > 2) {
          this.vehiculoProveedorService.listarPorAlias(data).subscribe(response => {
            this.resultadosVehiculo = response;
          })
        }
      }
    })
    //Autocompletado vehiculo remolque- Buscar por alias
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      console.log(this.tipoViaje.value);
      let tipoViaje = this.tipoViaje.value;
      if(tipoViaje == 1){
        if (typeof data == 'string' && data.length > 2) {
          this.vehiculoService.listarPorAliasYEmpresaFiltroRemolque(data, empresa.id).subscribe(response => {
            this.resultadosRemolque = response;
          })
        }
      }
      if(tipoViaje == 2){
        if (typeof data == 'string' && data.length > 2) {
          this.vehiculoProveedorService.listarPorAliasFiltroRemolque(data).subscribe(response => {
            this.resultadosRemolque = response;
          })
        }
      }
    })
    //Autocompletado vehiculo remolque- Buscar por alias
    this.formulario.get('choferProveedor').valueChanges.subscribe(data => {
      console.log(this.tipoViaje.value);
      let tipoViaje = this.tipoViaje.value;
      if(tipoViaje == 1){
        if (typeof data == 'string' && data.length > 2) {
          this.personalServie.listarPorAliasYEmpresa(data, empresa.id).subscribe(response => {
            this.resultadosChofer = response;
          })
        }
      }
      if(tipoViaje == 2){
        if (typeof data == 'string' && data.length > 2) {
          this.choferProveedorService.listarActivosPorAlias(data).subscribe(response => {
            this.resultadosChofer = response;
          })
        }
      }
    })
  }
  //Establece el N° de reparto
  private obtenerSiguienteId(){
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene la lista de zonas
  private listarZonas(){
    this.zonaService.listarOrdenado('nombre').subscribe(
      res=>{
        this.resultadosZona = res.json();
        console.log(res.json());
      },
      err=>{
        this.toastr.error('Error al obtener listado de Zonas');
      }
    );
  }
  //Controla el cambio en el select Tipo de Viaje
  public cambioTipoViaje(){
    this.formulario.get('vehiculo').setValue(null);
  }
  //Controla el cambio en el select Tipo de Remolque
  public cambioTipoRemolque(){
    this.formulario.get('vehiculoRemolque').setValue(null);

  }
  //Abre el dialogo para seleccionar un Tramo
  public abrirAcompaniante(): void {
    //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
    const dialogRef = this.dialog.open(AcompanianteDialogo, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(resultado => {
     console.log(resultado);
    //  this.listaAcompaniantes = resultado;
    });
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.usuario.setValue(this.appComponent.getUsuario().alias);
    this.sucursal.setValue(this.appComponent.getUsuario().sucursal.nombre);
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('empresaEmision').setValue(this.appComponent.getEmpresa());
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fechaRegistracion').setValue(res.json());
    });
  }
  
  //Reestablece el formulario completo
  public reestablecerFormulario(id){
    this.resultadosChofer = [];
    this.resultadosRemolque = [];
    this.resultadosVehiculo = [];
    this.resultadosZona = [];
    this.formulario.reset(); 
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    setTimeout(function() {
      document.getElementById('idTipoViaje').focus();
    }, 20);
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
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
      // this.condicion = true;
    } else {
      // this.condicion = false;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}
@Component({
  selector: 'acompaniante-dialogo',
  templateUrl: 'acompaniante-dialogo.html',
})
export class AcompanianteDialogo{
  //Define la empresa 
  public empresa: string;
  //Define los resultados para el autocompletado 
  public resultados = [];
  //Define la lista de Acompañantes
  public listaAcompaniantes = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define una bandera para el control
  public bandera:boolean=false;
  constructor(private personalService: PersonalService, public dialogRef: MatDialogRef<AcompanianteDialogo>, @Inject(MAT_DIALOG_DATA) public data) {}
   ngOnInit() {
     this.formulario = new FormGroup({
      acompaniante: new FormControl()
     });  
    //Autcompletado - Buscar por vehiculo segun tipo de viaje
    this.formulario.get('acompaniante').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.personalService.listarAcompaniantesPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }    
    });   
   }
   //Agrega Acompañantes a una lista
   public agregarAcompaniante(){
     for(let i=0; i<this.listaAcompaniantes.length; i++){
      if(this.formulario.get('acompaniante').value.id==this.listaAcompaniantes[i].id){
        this.bandera=true;
      }else{
        this.bandera=false;
     }
    }
     if(this.bandera==true){
      this.formulario.get('acompaniante').reset();
        this.resultados = [];
        setTimeout(function() {
          document.getElementById('idAcompaniante').focus();
        }, 20);
      this.bandera=false;
     }else{
      this.listaAcompaniantes.push(this.formulario.get('acompaniante').value);
      this.formulario.get('acompaniante').reset();
      this.resultados = [];
      setTimeout(function() {
        document.getElementById('idAcompaniante').focus();
      }, 20);      
     }
   }
   //Quita un acompaniante de la lista
   public quitarAcompaniante(indice){
    this.listaAcompaniantes.splice(indice, 1);
    setTimeout(function() {
      document.getElementById('idAcompaniante').focus();
    }, 20);
   }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}