import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-cobranza-cheques-cartera',
  templateUrl: './cobranza-cheques-cartera.component.html',
  styleUrls: ['./cobranza-cheques-cartera.component.css']
})
export class CobranzaChequesCarteraComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el importeTotal
  public importeTotal: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['BANCO', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'CUIT_EMISOR', 'IMPORTE', 'ELIMINAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<CobranzaChequesCarteraComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      empresa: new FormControl(),
      banco: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      fechaPago: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required),
      tipoDocumentoEmisor: new FormControl(),
      numeroDocumentoEmisor: new FormControl('', Validators.required),
      eCheq: new FormControl(),
    });
  }
  //Elimina un registro de la tabla
  public eliminarCheque(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.calcularTotal();
  }
  //Calcula el total de importes de registros en la tabla
  private calcularTotal() {
    let importeTotal = 0;
    this.listaCompleta.data.forEach(
      item => {
        importeTotal += Number(item.importe);
      }
    )
    console.log(importeTotal);
    this.importeTotal.setValue(this.appService.setDecimales(String(importeTotal), 2));
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Marcarar enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}