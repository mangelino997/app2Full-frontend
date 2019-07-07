import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pdf-dialogo',
  templateUrl: './pdf-dialogo.component.html',
  styleUrls: ['./pdf-dialogo.component.css']
})
export class PdfDialogoComponent implements OnInit {
  //Define el nombre del pdf
  public nombre:string = null;
  //Define los datos del pdf
  public datos:string = null;
  //Constructor
  constructor(public dialogRef: MatDialogRef<PdfDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el nombre del pdf
    this.nombre = this.data.nombre;
    //Establece los datos del pdf
    this.datos = this.data.datos;
  }
  //Descarga el pdf
  public descargar(): void {
    const linkDescarga = document.createElement("a");
    linkDescarga.href = this.datos;
    linkDescarga.download = this.nombre;
    linkDescarga.click();
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}