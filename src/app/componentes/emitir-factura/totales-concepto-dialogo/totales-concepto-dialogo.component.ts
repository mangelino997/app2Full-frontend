import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-totales-concepto-dialogo',
  templateUrl: './totales-concepto-dialogo.component.html',
  styleUrls: ['./totales-concepto-dialogo.component.css']
})
export class TotalesConceptoDialogoComponent implements OnInit {

  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Tramos
  public listaTramos: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'SEGURO', 'FLETE', 'RETIRO', 'ENTREGA', 'VARIOS'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<TotalesConceptoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog) {
    this.dialogRef.disableClose = true;
   }
  ngOnInit() {
    this.listaCompleta.data = this.data.items;
    this.listaCompleta.sort = this.sort;
  }
  /** Obtiene el total de seguro de listaCompleta. */
  getTotalSeguro() {
    return this.listaCompleta.data.map(t => Number(t.pSeguro)).reduce((acc, value) => acc + value, 0);
  }
  /** Obtiene el total de kgEfectivo de listaCompleta. */
  getTotalFlete() {
    return this.listaCompleta.data.map(t => Number(t.flete)).reduce((acc, value) => acc + value, 0);
  }
  /** Obtiene el total de kgAforado de listaCompleta. */
  getTotalRetiro() {
    return this.listaCompleta.data.map(t => Number(t.importeRetiro)).reduce((acc, value) => acc + value, 0);
  }
  /** Obtiene el total de valorDeclarado de listaCompleta. */
  getTotalEntrega() {
    return this.listaCompleta.data.map(t => Number(t.importeEntrega)).reduce((acc, value) => acc + value, 0);
  }
  /** Obtiene el total de m3 de listaCompleta. */
  getTotalVarios() {
    return this.listaCompleta.data.map(t => Number(t.importeTipoConceptoVenta)).reduce((acc, value) => acc + value, 0);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
