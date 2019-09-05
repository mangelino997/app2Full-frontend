import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reporte-dialogo',
  templateUrl: './reporte-dialogo.component.html',
  styleUrls: ['./reporte-dialogo.component.css']
})
export class ReporteDialogoComponent implements OnInit {
  //Define mostrar para ocultar parte del codigo al exportar pdf
  public mostrar: boolean = true;
  //Define el nombre del pdf
  public nombre: string = null;
  //Define los datos del pdf
  public empresa: string = null;
  //Define el usuario
  public usuario: string = null;
  //Define la lista completa
  public lista = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'nombre'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ReporteDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el nombre del pdf
    this.nombre = this.data.nombre;
    //Establece la empresa
    this.empresa = this.data.empresa;
    //Establece el usuario
    this.usuario = this.data.usuario;
    //Establece la lista completa
    this.lista = new MatTableDataSource(this.data.lista);
    this.lista.sort = this.sort;
  }
  //Descarga el pdf
  public descargar(): void {
    this.mostrar = false;
    setTimeout(() => {
      var HTML_Width = document.getElementById('idContenedor').clientWidth;
      var HTML_Height = document.getElementById('idContenedor').clientHeight;
      var top_left_margin = 15;
      var PDF_Width = HTML_Width + (top_left_margin * 2);
      var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;
      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      html2canvas(document.getElementById('idContenedor'), { allowTaint: true }).then(function (canvas) {
        canvas.getContext('2d');
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage(PDF_Width, PDF_Height);
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        pdf.save("HTML-Document.pdf");
      });
      this.mostrar = true;
    }, 50);
    // //Ocultar seccion de codigo
    // this.mostrar = false;
    // setTimeout(() => {
    //   //Exporta a pdf
    //   window.frames['myiframe'].print();
    //   //Cierra el dialogo
    //   this.cerrar();
    // }, 50);
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}