import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FechaService } from 'src/app/servicios/fecha.service';

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
  //Define la fecha actual
  public fecha:any = null;
  //Define la lista completa
  public lista = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'nombre', 'provincia'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ReporteDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private fechaServicio: FechaService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el nombre del pdf
    this.nombre = this.data.nombre;
    //Establece la empresa
    this.empresa = this.data.empresa;
    //Establece el usuario
    this.usuario = this.data.usuario;
    //Establece la lista completa
    this.lista = new MatTableDataSource(this.data.datos);
    this.lista.sort = this.sort;
    //Obtiene la fecha actual
    this.obtenerFecha();
  }
  //Obtiene la fecha actual
  private obtenerFecha(): void {
    this.fechaServicio.obtenerFecha().subscribe(
      res => {
        let fecha = new Date(res.text());
        this.fecha = this.establecerCerosIzq(fecha.getDate(), '0', -2) 
          + "/" + this.establecerCerosIzq(fecha.getMonth()+1, '0', -2) 
          + "/" + fecha.getFullYear();
      },
      err => {

      }
    );
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
  }
  private posicionarTexto(pdf, posicion, tamanioTexto, texto) {
    let pageWidth = pdf.internal.pageSize.width;
    let txtWidth = pdf.getStringUnitWidth(texto)*tamanioTexto/pdf.internal.scaleFactor;
    switch(posicion) {
      case "center":
        return (pageWidth - txtWidth + 10) / 2;
      case "right":
        return (pageWidth - txtWidth - 10);
    }
  }
  //Exporta los datos
  private exportar(columnas, datos): void {
    var pdf = new jsPDF('p', 'mm', 'a4');
    let tamanioTexto = 12;
    //Establece titulo empresa
    pdf.setFontSize(12);
    pdf.text(this.empresa, 10, 10);
    //Establece fecha
    pdf.setFontSize(12);
    pdf.text(this.fecha, this.posicionarTexto(pdf, 'right', tamanioTexto, this.fecha), 10);
    //Establece titulo listado
    pdf.setFontSize(12);
    pdf.text('Listado de ' + this.nombre, this.posicionarTexto(pdf, 'center', tamanioTexto, this.empresa), 18);
    //Establece tabla
    pdf.autoTable(columnas, datos,
    { margin:{ top: 20 }}
    );
    pdf.save();
  }
  //Descarga el pdf
  public descargar(): void {
    let columnas = this.data.columnas;
    let datos = this.data.datos;
    this.exportar(columnas, datos);
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}