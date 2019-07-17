import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-bug-imagen-dialogo',
  templateUrl: './bug-imagen-dialogo.component.html',
  styleUrls: ['./bug-imagen-dialogo.component.css']
})
export class BugImagenDialogoComponent implements OnInit {
  //Define el nombre del bug-imagen
  public nombre:string = null;
  //Define los datos del bug-imagen
  public datos:string = null;
  //Constructor
  constructor(public dialogRef: MatDialogRef<BugImagenDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el nombre del bug
    this.nombre = this.data.nombre;
    //Establece los datos del bug
    this.datos = this.data.datos;
  }
  //Descarga el bug
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