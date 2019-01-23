import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { ViajePropioCombustible } from 'src/app/modelos/viajePropioCombustible';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-viaje-combustible',
  templateUrl: './viaje-combustible.component.html',
  styleUrls: ['./viaje-combustible.component.css']
})
export class ViajeCombustibleComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio combustible para validaciones de campos
  public formularioViajePropioCombustible:FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores:Array<any> = [];
  //Define la lista de insumos
  public insumos:Array<any> = [];
  //Define la lista de combustibles
  public listaCombustibles:Array<any> = [];
  //Constructor
  constructor(private proveedorServicio: ProveedorService, private viajePropioCombustibleModelo: ViajePropioCombustible,
    private fechaServicio: FechaService, private appComponent: AppComponent, 
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog) { }
  //Al inicilizarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio combustible
    this.formularioViajePropioCombustible = this.viajePropioCombustibleModelo.formulario;
    //Autocompletado Proveedor (Combustible) - Buscar por alias
    this.formularioViajePropioCombustible.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
        })
      }
    })
    //Obtiene la lista de insumos
    this.listarInsumos();
    //Establece los valores por defecto del formulario viaje combustible
    this.establecerValoresPorDefecto(1);
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioCombustible.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioCombustible.get('cantidad').setValue(valor);
    this.formularioViajePropioCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioCombustible.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(this.appComponent.establecerCeros(valor));
      this.formularioViajePropioCombustible.get('totalUrea').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Obtiene el listado de insumos
  private listarInsumos() {
    this.insumoProductoServicio.listar().subscribe(
      res => {
        this.insumos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
    if(cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Establece el precio unitario
  public establecerPrecioUnitario(formulario, elemento): void {
    formulario.get('precioUnitario').setValue((formulario.get(elemento).value.precioUnitarioVenta));
    this.establecerCeros(formulario.get('precioUnitario'));
  }
  //Agrega datos a la tabla de combustibles
  public agregarCombustible(): void {
    this.formularioViajePropioCombustible.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioCombustible.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaCombustibles.push(this.formularioViajePropioCombustible.value);
    let insumo = this.formularioViajePropioCombustible.get('insumoProducto').value.id;
    let cantidad = this.formularioViajePropioCombustible.get('cantidad').value;
    let totalCombustible = this.formularioViajePropioCombustible.get('totalCombustible').value;
    let totalUrea = this.formularioViajePropioCombustible.get('totalUrea').value;
    let total = 0;
    this.formularioViajePropioCombustible.reset();
    if(insumo == 1) {
      total = parseFloat(totalCombustible) + parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(total.toFixed(2));
      this.formularioViajePropioCombustible.get('totalUrea').setValue(totalUrea);
    } else if(insumo == 3) {
      total = parseFloat(totalUrea) + parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalUrea').setValue(total.toFixed(2));
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(totalCombustible);
    }
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Elimina un combustible de la tabla por indice
  public eliminarCombustible(indice, elemento): void {
    this.listaCombustibles.splice(indice, 1);
    let insumo = elemento.insumoProducto.id;
    let cantidad = elemento.cantidad;
    let totalCombustible = this.formularioViajePropioCombustible.get('totalCombustible').value;
    let totalUrea = this.formularioViajePropioCombustible.get('totalUrea').value;
    let total = 0;
    if(insumo == 1) {
      total = parseFloat(totalCombustible) - parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(total.toFixed(2));
    } else if(insumo == 3) {
      total = parseFloat(totalUrea) - parseFloat(cantidad);
      this.formularioViajePropioCombustible.get('totalUrea').setValue(total.toFixed(2));
    }
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaCombustibles);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {});
  }
}
//Componente ObservacionesDialogo
@Component({
  selector: 'observaciones-dialogo',
  templateUrl: '../observaciones-dialogo.component.html'
})
export class ObservacionesDialogo {
  //Define el tema
  public tema:string;
  //Define el formulario
  public formulario:FormGroup;
  //Define la observacion
  public observaciones:string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ObservacionesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = new FormGroup({
      observaciones: new FormControl()
    });
    //Establece las observaciones
    this.formulario.get('observaciones').setValue(this.data.elemento);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}