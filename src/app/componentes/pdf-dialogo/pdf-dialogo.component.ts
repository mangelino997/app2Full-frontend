import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PdfService } from 'src/app/servicios/pdf.service';

@Component({
  selector: 'app-pdf-dialogo',
  templateUrl: './pdf-dialogo.component.html',
  styleUrls: ['./pdf-dialogo.component.css']
})
export class PdfDialogoComponent implements OnInit {
  //Define circulo de progreso
  public show:boolean = false;
  //Define el nombre del pdf
  public nombre:string = null;
  //Define los datos del pdf
  public datos:string = null;
  //Constructor
  constructor(public dialogRef: MatDialogRef<PdfDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private pdfService: PdfService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Verifica si existe el id
    if(this.data.id) {
      //Obtiene los datos del pdf por id
      this.obtenerPorId(this.data.id);
    } else {
      this.nombre = this.data.nombre;
      this.datos = this.data.datos;
    }
  }
  //Obtiene por id
  private obtenerPorId(id): void {
    this.show = true;
    this.pdfService.obtenerPorId(id).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta) {
          this.nombre = respuesta.nombre;
          this.datos = atob(respuesta.datos);
        }
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
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