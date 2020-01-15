import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EfectivoComponent } from '../../tesoreria/efectivo/efectivo.component';

@Component({
  selector: 'app-cobranza-efectivo',
  templateUrl: './cobranza-efectivo.component.html',
  styleUrls: ['./cobranza-efectivo.component.css']
})
export class CobranzaEfectivoComponent implements OnInit {

  //Define el importe
  public importe: FormControl = new FormControl('', Validators.required);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<EfectivoComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
  }
  //Cierra el dialogo
  public cerrar(importe): void {
    this.dialogRef.close(importe);
  }
}