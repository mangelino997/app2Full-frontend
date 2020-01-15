import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentosComponent } from '../../tesoreria/documentos/documentos.component';

@Component({
  selector: 'app-cobranza-documentos-cartera',
  templateUrl: './cobranza-documentos-cartera.component.html',
  styleUrls: ['./cobranza-documentos-cartera.component.css']
})
export class CobranzaDocumentosCarteraComponent implements OnInit {

  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['DOCUMENTO', 'NUMERO', 'FECHA_PAGO', 'IMPORTE'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<DocumentosComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      documento: new FormControl(),
      numero: new FormControl(),
      fechaPago: new FormControl(),
      importe: new FormControl()
    });
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}

