import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ViajePropioGasto } from 'src/app/modelos/viajePropioGasto';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-viaje-gasto',
  templateUrl: './viaje-gasto.component.html',
  styleUrls: ['./viaje-gasto.component.css']
})
export class ViajeGastoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio gasto para validaciones de campos
  public formularioViajePropioGasto:FormGroup;
  //Define la lista de ordenes de gastos (tabla)
  public listaGastos:Array<any> = [];
  //Define la lista de resultados rubro producto de busqueda
  public resultadosRubrosProductos:Array<any> = [];
  //Constructor
  constructor(private viajePropioGastoModelo: ViajePropioGasto, private rubroProductoServicio: RubroProductoService,
    private fechaServicio: FechaService, private appComponent: AppComponent, public dialog: MatDialog) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio gasto
    this.formularioViajePropioGasto = this.viajePropioGastoModelo.formulario;
    //Autocompletado Rubro Producto - Buscar por nombre
    this.formularioViajePropioGasto.get('rubroProducto').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.rubroProductoServicio.listarPorNombre(data).subscribe(response =>{
          this.resultadosRubrosProductos = response;
        })
      }
    })
    //Establece los valores por defecto del formulario viaje gasto
    this.establecerValoresPorDefecto(1);
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioGasto.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioGasto.get('cantidad').setValue(valor);
    this.formularioViajePropioGasto.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioGasto.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Agrega datos a la tabla de gastos
  public agregarGasto(): void {
    this.listaGastos.push(this.formularioViajePropioGasto.value);
    let importe = this.formularioViajePropioGasto.get('importe').value;
    let importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioGasto.reset();
    this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaG').focus();
  }
  //Elimina un gasto de la tabla por indice
  public eliminarGasto(indice, elemento): void {
    this.listaGastos.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idFechaG').focus();
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaGastos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
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