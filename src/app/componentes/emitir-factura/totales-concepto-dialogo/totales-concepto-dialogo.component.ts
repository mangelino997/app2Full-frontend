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
  onNoClick(): void {
    this.dialogRef.close();
  }
}
