import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ViajePropioEfectivo } from 'src/app/modelos/viajePropioEfectivo';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-viaje-efectivo',
  templateUrl: './viaje-efectivo.component.html',
  styleUrls: ['./viaje-efectivo.component.css']
})
export class ViajeEfectivoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio efectivo para validaciones de campos
  public formularioViajePropioEfectivo:FormGroup;
  //Define la lista de adelantos de efectivo (tabla)
  public listaEfectivos:Array<any> = [];
  //Define la lista de empresas
  public empresas:Array<any> = [];
  //Define la fecha actual
  public fechaActual:any;
  //Define si los campos son de solo lectura
  public soloLectura:boolean = false;
  //Define el indice del efectivo para las modificaciones
  public indiceEfectivo:number;
  //Define si muestra el boton agregar efectivo o actualizar efectivo
  public btnEfectivo:boolean = true;
  //Constructor
  constructor(private viajePropioEfectivoModelo: ViajePropioEfectivo, private empresaServicio: EmpresaService,
    private fechaServicio: FechaService, private appComponent: AppComponent, public dialog: MatDialog) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio efectivo
    this.formularioViajePropioEfectivo = this.viajePropioEfectivoModelo.formulario;
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Establece los valores por defecto del formulario viaje efectivo
    this.establecerValoresPorDefecto(1);
  }
  //Obtiene el listado de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece los valores por defecto del formulario viaje adelanto efectivo
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formularioViajePropioEfectivo.get('fechaCaja').setValue(res.json());
    })
    this.formularioViajePropioEfectivo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Agrega datos a la tabla de adelanto efectivo
  public agregarEfectivo(): void {
    this.formularioViajePropioEfectivo.get('fecha').setValue(this.fechaActual);
    this.formularioViajePropioEfectivo.get('tipoComprobante').setValue({id:16});
    this.formularioViajePropioEfectivo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioEfectivo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaEfectivos.push(this.formularioViajePropioEfectivo.value);
    let importeTotal = this.formularioViajePropioEfectivo.get('importeTotal').value;
    let importe = this.formularioViajePropioEfectivo.get('importe').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioEfectivo.reset();
    this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaCajaAE').focus();
    this.enviarDatos();
  }
  //Modifica los datos del Efectivo
  public modificarEfectivo(): void {
    this.listaEfectivos[this.indiceEfectivo] = this.formularioViajePropioEfectivo.value;
    this.btnEfectivo = true;
    this.formularioViajePropioEfectivo.reset();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaCajaAE').focus();
    this.enviarDatos();
  }
  //Modifica un Efectivo de la tabla por indice
  public modEfectivo(indice): void {
    this.indiceEfectivo = indice;
    this.btnEfectivo = false;
    this.formularioViajePropioEfectivo.patchValue(this.listaEfectivos[indice]);
  }
  //Elimina un  efectivo de la tabla por indice
  public eliminarEfectivo(indice, elemento): void {
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioEfectivo.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.listaEfectivos.splice(indice, 1);
    document.getElementById('idFechaCajaAE').focus();
    this.enviarDatos();
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaEfectivos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appComponent.establecerCeros(elemento);
  }
  //Establece la lista de efectivos
  public establecerLista(lista): void {
    this.establecerValoresPorDefecto(1);
    this.listaEfectivos = lista;
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    switch(indice) {
      case 1:
        this.soloLectura = false;
        this.establecerCamposSelectSoloLectura(false);
        break;
      case 2:
        this.soloLectura = true;
        this.establecerCamposSelectSoloLectura(true);
        break;
      case 3:
        this.soloLectura = false;
        this.establecerCamposSelectSoloLectura(false);
        break;
      case 4:
        this.soloLectura = true;
        this.establecerCamposSelectSoloLectura(true);
        break;
    }
  }
  //Establece los campos select en solo lectura o no
  private establecerCamposSelectSoloLectura(opcion): void {
    if(opcion) {
      this.formularioViajePropioEfectivo.get('empresa').disable();
    } else {
      this.formularioViajePropioEfectivo.get('empresa').enable();
    }
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaEfectivos = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioEfectivo.reset();
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {});
  }
}
//Componente ObservacionesDialogo
@Component({
  selector: 'observaciones-dialogo',
  templateUrl: '../observaciones-dialogo.component.html'
})
export class ObservacionesDialogo {
  //Define el tema
  public tema:string;
  //Define el formulario
  public formulario:FormGroup;
  //Define la observacion
  public observaciones:string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ObservacionesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = new FormGroup({
      observaciones: new FormControl()
    });
    //Establece las observaciones
    this.formulario.get('observaciones').setValue(this.data.elemento);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}