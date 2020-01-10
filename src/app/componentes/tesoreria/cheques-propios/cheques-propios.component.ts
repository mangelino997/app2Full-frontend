import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cheques-propios',
  templateUrl: './cheques-propios.component.html',
  styleUrls: ['./cheques-propios.component.css']
})
export class ChequesPropiosComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define el total
  public total:FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show:boolean = false;
  //Defiene la columnas de la tabla
  public columnas:Array<string> = ['CUENTA_BANCARIA', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'IMPORTE'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<ChequesPropiosComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      cuentaBancaria: new FormControl(),
      tipoChequera: new FormControl(),
      numeroCheque: new FormControl(),
      fechaPago: new FormControl(),
      importe: new FormControl()
    });
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}