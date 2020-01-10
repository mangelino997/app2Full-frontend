import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-efectivo',
  templateUrl: './efectivo.component.html',
  styleUrls: ['./efectivo.component.css']
})
export class EfectivoComponent implements OnInit {
  //Define el importe
  public importe:FormControl = new FormControl('', Validators.required);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<EfectivoComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}