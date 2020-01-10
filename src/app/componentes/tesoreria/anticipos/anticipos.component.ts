import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
  styleUrls: ['./anticipos.component.css']
})
export class AnticiposComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define el total
  public total:FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show:boolean = false;
  //Defiene la columnas de la tabla
  public columnas:Array<string> = ['FECHA', 'ORDEN_PAGO', 'OBSERVACIONES', 'ANTICIPO', 'SALDO', 'IMPORTE'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<AnticiposComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      totalDisponible: new FormControl(),
      saldo: new FormControl(),
      importe: new FormControl()
    });
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}