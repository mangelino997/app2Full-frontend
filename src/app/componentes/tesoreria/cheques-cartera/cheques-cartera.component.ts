import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cheques-cartera',
  templateUrl: './cheques-cartera.component.html',
  styleUrls: ['./cheques-cartera.component.css']
})
export class ChequesCarteraComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['BANCO', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'CUIT_EMISOR', 'IMPORTE'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<ChequesCarteraComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      fechaPagoDesde: new FormControl(),
      fechaPagoHasta: new FormControl(),
      importeDesde: new FormControl(),
      importeHasta: new FormControl(),
      numeroCheque: new FormControl()
    });
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}