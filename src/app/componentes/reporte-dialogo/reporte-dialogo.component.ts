import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  public fecha: any = null;
  //Define la lista completa
  public lista = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = [];
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
    //Establece las columnas
    this.columnas = this.data.columnas;
    //Obtiene la fecha actual
    this.obtenerFecha();
  }
  //Obtiene la fecha actual
  private obtenerFecha(): void {
    this.fechaServicio.obtenerFecha().subscribe(
      res => {
        let fecha = new Date(res.text());
        this.fecha = this.establecerCerosIzq(fecha.getDate(), '0', -2)
          + "/" + this.establecerCerosIzq(fecha.getMonth() + 1, '0', -2)
          + "/" + fecha.getFullYear();
      },
      err => {

      }
    );
  }
  //Borrar espacios en blanco
  public eliminarEspaciosBlanco(elemento) {
    elemento = elemento.replace(/\s/g,'');
    elemento = elemento.toLowerCase();
    return elemento;
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
  }
  //Exporta los datos
  private exportar(columnas, datos): void {
    var pdf = new jsPDF('p', 'mm', 'a4');
    var totalPagesExp = "{total_pages_count_string}";
    let tamanioTexto = 12;
    let empresa = this.empresa;
    let nombre = this.nombre;
    let fecha = this.fecha;
    let usuario = this.usuario;
    //Agrega ultima fila con total de items
    let ultimaFila = [];
    for (let i = 0; i < columnas.length; i++) {
      if (i == 0) {
        ultimaFila.push('Total:');
      } else if (i == 1) {
        ultimaFila.push(datos.length);
      } else {
        ultimaFila.push(null);
      }
    }
    datos.push(ultimaFila);
    //Establece la posicion del texto
    let posicionarTexto = function (posicion, texto) {
      let pageWidth = pdf.internal.pageSize.width;
      let txtWidth = pdf.getStringUnitWidth(texto) * tamanioTexto / pdf.internal.scaleFactor;
      switch (posicion) {
        case "center":
          return (pageWidth - txtWidth + 10) / 2;
        case "right":
          return (pageWidth - txtWidth - 10);
      }
    }
    let pageContent = function (data) {
      //HEADER
      //Establece titulo empresa
      pdf.setFontSize(12);
      pdf.text(empresa, 10, 10);
      //Establece fecha
      pdf.setFontSize(12);
      pdf.text(fecha, posicionarTexto('right', fecha), 10);
      //Establece titulo listado
      pdf.setFontSize(12);
      pdf.text('Listado de ' + nombre, posicionarTexto('center', empresa), 18);
      //FOOTER
      let str = "Página " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = str + " de " + totalPagesExp;
      }
      pdf.setFontSize(10);
      pdf.text(usuario, 10, pdf.internal.pageSize.height - 10);
      pdf.setFontSize(10);
      pdf.text(str, posicionarTexto('center', 'Pagina 10 de 10'), pdf.internal.pageSize.height - 10);
    };
    //Establece tabla
    pdf.autoTable(columnas, datos, {
      didDrawPage: pageContent,
      margin: { top: 20 },
    });
    // Total page number plugin only available in jspdf v1.0+
    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }
    pdf.save();
  }
  //Descarga el pdf
  public descargar(): void {
    let columnas = this.data.columnas;
    let datos = this.data.datos;
    let d = [];
    datos.forEach(dato => {
      let f = [];
      columnas.forEach(columna => {
        f.push(dato[columna.toLowerCase()]);
      });
      d.push(f);
    });
    this.exportar(columnas, d);
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}