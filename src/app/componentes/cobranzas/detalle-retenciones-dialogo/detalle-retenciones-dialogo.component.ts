import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CobranzaRetencion } from 'src/app/modelos/cobranzaRetencion';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';
import { ToastrService } from 'ngx-toastr';
import { CobranzaRetencionService } from 'src/app/servicios/cobranza-retencion.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';

@Component({
  selector: 'app-detalle-retenciones-dialogo',
  templateUrl: './detalle-retenciones-dialogo.component.html',
  styleUrls: ['./detalle-retenciones-dialogo.component.css']
})
export class DetalleRetencionesDialogoComponent implements OnInit {

  //Define el formulario
  public formulario: FormGroup;
  //Define a importeTotal como un FormControl
  public importeTotal: FormControl = new FormControl();
  //Define el array de Tipos de Retenciones
  public tiposRetencion: Array<any> = [];
  //Define el array de Tipos de Retenciones
  public anios: Array<any> = [];
  //Define el array de Tipos de Retenciones
  public meses: Array<any> = [];
  //Define el array de Tipos de Retenciones
  public provincias: Array<any> = [];
  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['TIPO_RETENCION', 'PUNTO_VENTA', 'NUMERO', 'ANIO', 'MES', 'PROVINCIA', 'IMPORTE', 'ELIMINAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private modelo: CobranzaRetencion, public dialog: MatDialog, private appService: AppService,
    public dialogRef: MatDialogRef<DetalleRetencionesDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private servicio: CobranzaRetencionService,
    private toastr: ToastrService, private loaderService: LoaderService, ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //inicializa el formulario y sus elementos
    this.formulario = this.modelo.formulario;
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        console.log(respuesta);
        //Establece listas
        this.meses = respuesta.meses;
        this.anios = respuesta.anios;
        this.provincias = respuesta.provincias;
        this.tiposRetencion = respuesta.tiposRetencion;
        //Establece valores por defecto
        this.establecerValoresPorDefecto();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Setea valores por defecto al formulario
  private establecerValoresPorDefecto() {
    this.formulario.reset();
    this.formulario.get('mes').setValue(this.meses[0]);
    this.formulario.get('anio').setValue(this.anios[0]);
    this.formulario.get('provincia').setValue(this.provincias[0]);
    this.formulario.get('tipoRetencion').setValue(this.tiposRetencion[0]);
    this.cambioTipoRetencion();
  }
  //Controla el cambio en el campo de seleccion 'Tipo de Retención'
  public cambioTipoRetencion() {
    this.formulario.get('provincia').reset();
    if (this.formulario.value.tipoRetencion.id == 2) {
      this.formulario.get('provincia').enable();
      this.formulario.get('provincia').setValidators(Validators.required);
      this.formulario.get('provincia').updateValueAndValidity();//Actualiza la validacion
    } else {
      this.formulario.get('provincia').disable();
      this.formulario.get('provincia').setValidators([]);
      this.formulario.get('provincia').updateValueAndValidity();//Actualiza la validacion
    }
  }
  //Agrega un registro a la tabla
  public agregarDetalleRetencion() {
    console.log(this.formulario.value);
    this.listaCompleta.data.push(this.formulario.value);
    this.listaCompleta.sort = this.sort;
    this.establecerValoresPorDefecto();
    this.calcularTotal();
  }
  //Elimina un registro de la tabla
  public eliminarDetalleRetencion(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.calcularTotal();
  }
  //Calcula el total de importes de registros en la tabla
  private calcularTotal() {
    let importeTotal = 0;
    this.listaCompleta.data.forEach(
      item => {
        importeTotal += Number(item.importe);
      }
    )
    console.log(importeTotal);
    this.importeTotal.setValue(this.appService.setDecimales(String(importeTotal), 2));
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  //Define como se muestra los datos con ceros a la izquierda
  public completarCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    console.log(elemento, string, cantidad);
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}
