import { Component, OnInit, Inject } from '@angular/core';
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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css']
})
export class RepartoComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define la lista de resultados para Zonas, Comprobantes, Letras
  public resultadosZona = [];
  public resultadosComprobante = [];
  public resultadosLetra = [];
  //Define la lista de resultados para vehiculo o vehiculoProveedor
  public resultadosVehiculo = [];
  //Define la lista de resultados para remolque
  public resultadosRemolque = [];
  //Define la lista de resultados para chofer
  public resultadosChofer = [];
  

  //Constructor
  constructor(private reparto: Reparto, private zonaService: ZonaService, private toastr: ToastrService, private appService: AppService,
    private appComponent: AppComponent, private vehiculoService: VehiculoService, private vehiculoProveedorService: VehiculoProveedorService,
    private personalServie: PersonalService, private choferProveedorService: ChoferProveedorService, public dialog: MatDialog, private fechaService: FechaService,
    
    ) { }

  ngOnInit() {
    //Establece el formulario
    this.formulario = this.reparto.formulario;
    //Reestablece los valores
    this.reestablecerFormulario(undefined);
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene un listado de Zonas
    this.listarZonas();
    //Autcompletado - Buscar por vehiculo segun tipo de viaje
    this.formulario.get('vehiculo').valueChanges.subscribe(data => {
      switch(this.formulario.get('tipoViaje').value){
        case 1:
          if(typeof data == 'string') {
            this.vehiculoService.listarPorAlias(data).subscribe(res => {
              this.resultadosVehiculo = res;
            })
          }
          break;

        case 2:
          if(typeof data == 'string') {
            this.vehiculoProveedorService.listarPorAlias(data).subscribe(res => {
              this.resultadosVehiculo = res;
            })
          }
          break;
        case 3: 
          this.formulario.get('vehiculo').disable();
          break;
      }
    });
    //Autcompletado - Buscar por remolque segun tipo de viaje
    this.formulario.get('remolque').valueChanges.subscribe(data => {
      switch(this.formulario.get('tipoViaje').value){
        case 1:
          if(typeof data == 'string') {
            this.vehiculoService.listarPorAliasFiltroRemolque(data).subscribe(res => {
              this.resultadosRemolque = res;
            })
          }
          break;
        case 2:
          if(typeof data == 'string') {
            this.vehiculoProveedorService.listarPorAliasFiltroRemolque(data).subscribe(res => {
              this.resultadosRemolque = res;
            })
          }
          break;
        case 3: 
          this.formulario.get('remolque').disable();
          break;
      }
    });
    //Autcompletado - Buscar por chofer segun tipo de viaje
    this.formulario.get('chofer').valueChanges.subscribe(data => {
      switch(this.formulario.get('tipoViaje').value){
        case 1:
          if(typeof data == 'string') {
            this.personalServie.listarChoferesCortaDistanciaPorAlias(data).subscribe(res => {
              console.log(res);
              this.resultadosChofer = res.json();
            })
          }
          break;
        case 2:
          if(typeof data == 'string') {
            this.choferProveedorService.listarPorProveedor(data).subscribe(res => {
              console.log(res);
              this.resultadosChofer = res.json();
            })
          }
          break;
        case 3: 
          this.formulario.get('chofer').disable();
          break;
      }
    });
  }

  //Obtiene una lista de Zonas por nombre de la columna 
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

  //Obtiene una lista de Tipos de Comprobantes
  private listarComprobantes(){

  }
  //Obtiene una lista de Letras
  private listarLetras(){

  }
  //Abre el dialogo para seleccionar un Tramo
  public abrirAcompaniante(): void {
    //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
    const dialogRef = this.dialog.open(AcompanianteDialogo, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(resultado => {
     console.log(resultado);
    });
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('tipoViaje').setValue(1);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
    } else {
      return '';
    }
  }
  //Reestablece el formulario completo
  public reestablecerFormulario(id){
    this.resultadosChofer = [];
    this.resultadosComprobante = [];
    this.resultadosLetra = [];
    this.resultadosRemolque = [];
    this.resultadosVehiculo = [];
    this.resultadosZona = [];
    this.formulario.reset(); 
    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fechaSalida').setValue(res.json());
    });
    setTimeout(function() {
      document.getElementById('idTipoViaje').focus();
    }, 20);
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
  constructor(private personalService: PersonalService, public dialogRef: MatDialogRef<AcompanianteDialogo>, @Inject(MAT_DIALOG_DATA) public data) {}
   ngOnInit() {
     this.formulario = new FormGroup({
      acompaniante: new FormControl()
     });  
    //Autcompletado - Buscar por vehiculo segun tipo de viaje
    this.formulario.get('acompaniante').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.personalService.listarAcompaniantesPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }    
    });   
   }
   //Agrega Acompañantes a una lista
   public agregarAcompaniante(){
    this.listaAcompaniantes.push(this.formulario.get('acompaniante').value);
    console.log(this.listaAcompaniantes);
    this.formulario.get('acompaniante').reset();
    setTimeout(function() {
      document.getElementById('idAcompaniante').focus();
    }, 20);
   }
   //Quita un acompaniante de la lista
   public quitarAcompaniante(indice){
    this.listaAcompaniantes.splice(indice, 1);
    console.log(this.listaAcompaniantes);
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
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}