import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort } from '@angular/material';

@Component({
  selector: 'app-totales-carga-dialogo',
  templateUrl: './totales-carga-dialogo.component.html',
  styleUrls: ['./totales-carga-dialogo.component.css']
})
export class TotalesCargaDialogoComponent implements OnInit {

  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Tramos
  public listaTramos: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'BULTOS', 'KILOS_EFECTIVO', 'KILOS_AFORADO', 'M3', 'VALOR_DECLARADO'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<TotalesCargaDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog) {
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
