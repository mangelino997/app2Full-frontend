import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OtrasMonedasComponent } from '../../tesoreria/otras-monedas/otras-monedas.component';

@Component({
  selector: 'app-cobranza-otras-monedas',
  templateUrl: './cobranza-otras-monedas.component.html',
  styleUrls: ['./cobranza-otras-monedas.component.css']
})
export class CobranzaOtrasMonedasComponent implements OnInit {

  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['MONEDA', 'CAMBIO', 'IMPORTE'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<OtrasMonedasComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      moneda: new FormControl(),
      cantidad: new FormControl(),
      cotizacion: new FormControl(),
      importe: new FormControl()
    });
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}