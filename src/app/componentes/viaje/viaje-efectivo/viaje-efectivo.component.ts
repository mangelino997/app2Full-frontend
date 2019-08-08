import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeEfectivo } from 'src/app/modelos/viajeEfectivo';
import { ViajeEfectivoService } from 'src/app/servicios/viaje-efectivo';

@Component({
  selector: 'app-viaje-efectivo',
  templateUrl: './viaje-efectivo.component.html',
  styleUrls: ['./viaje-efectivo.component.css']
})
export class ViajeEfectivoComponent implements OnInit {
  //Define un formulario viaje  efectivo para validaciones de campos
  public formularioViajeEfectivo:FormGroup;
  //Define el importe Total como un formControl
  public importeTotal = new FormControl();
  //Define la lista de adelantos de efectivo (tabla)
  public listaEfectivos:Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
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
  //Define la pestaña seleccionada
  public indiceSeleccionado:number = 1;
  //Define el viaje actual de los tramos
  public viaje:any;
  //Define el viaje Cabecera
  public VIAJE_CABECERA: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['sucursal', 'adelanto', 'fecha', 'empresa', 'importe', 'observaciones', 'anulado', 'obsAnulado', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private viajeEfectivoModelo: ViajeEfectivo, private empresaServicio: EmpresaService,
    private fechaServicio: FechaService, public dialog: MatDialog,
    private appServicio: AppService, private toastr: ToastrService, private servicio: ViajeEfectivoService,
    private loaderService: LoaderService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  efectivo
    this.formularioViajeEfectivo = this.viajeEfectivoModelo.formulario;
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Establece los valores por defecto del formulario viaje efectivo
    this.establecerValoresPorDefecto(1);
  }
  //Establece el id del viaje de Cabecera
  public establecerViajeCabecera(viajeCabecera){
    this.VIAJE_CABECERA = viajeCabecera;
    console.log(this.VIAJE_CABECERA);
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar(){
    this.loaderService.show();
      this.servicio.listarEfectivos(this.VIAJE_CABECERA.id).subscribe(
        res=>{
          this.listaEfectivos = res.json();
          this.recargarListaCompleta(this.listaEfectivos);
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
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
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formularioViajeEfectivo.get('fechaCaja').setValue(res.json());
    })
    if(opcion == 1) {
      this.importeTotal.setValue(this.appServicio.establecerDecimales('0.00', 2));
    }
    this.formularioViajeEfectivo.get('importe').setValue(this.appServicio.establecerDecimales('0.00', 2));
  }
  //Agrega datos a la tabla de adelanto efectivo
  public agregarEfectivo(): void {
    this.formularioViajeEfectivo.get('fecha').setValue(this.fechaActual);
    this.formularioViajeEfectivo.get('tipoComprobante').setValue({id:16});
    this.formularioViajeEfectivo.get('sucursal').setValue(this.appServicio.getUsuario().sucursal);
    this.formularioViajeEfectivo.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeEfectivo.value.viaje = {id: idViajeCabecera};
    this.servicio.agregar(this.formularioViajeEfectivo.value).subscribe(
      res=>{
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
          document.getElementById('idFechaCajaAE').focus();
          this.toastr.success("Registro agregado con éxito");
          this.loaderService.hide();
        }
      },
      err=>{
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica los datos del Efectivo
  public modificarEfectivo(): void {
    let usuarioMod = this.appServicio.getUsuario();
    this.formularioViajeEfectivo.value.usuarioMod = usuarioMod;
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeEfectivo.value.viaje = {id: idViajeCabecera};
    this.servicio.actualizar(this.formularioViajeEfectivo.value).subscribe(
      res=>{
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.btnEfectivo = true;
          document.getElementById('idFechaCajaAE').focus();
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
      },  
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica un Efectivo de la tabla por indice
  public modEfectivo(indice): void {
    this.indiceEfectivo = indice;
    this.btnEfectivo = false;
    let elemento = this.listaEfectivos[indice];
    elemento.importe = this.appServicio.establecerDecimales(elemento.importe, 2);
    this.formularioViajeEfectivo.patchValue(elemento);
  }
  //Elimina un  efectivo de la tabla por indice
  public eliminarEfectivo(indice, elemento): void {
    if(this.indiceSeleccionado == 1) {
      this.listaEfectivos.splice(indice, 1);
      this.recargarListaCompleta(this.listaEfectivos);
      this.establecerValoresPorDefecto(0);
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(
        res => {
          let respuesta = res.json();
          this.listaEfectivos.splice(indice, 1);
          this.recargarListaCompleta(this.listaEfectivos);
          this.establecerValoresPorDefecto(0);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        },
        err => {
          this.toastr.error("Error al eliminar el registro");
          this.loaderService.hide();
        });
    }
    document.getElementById('idFechaCajaAE').focus();
  }
  //Calcula el importe total para agregar
  private calcularImporteTotal(): void {
    let total = 0;
    this.listaEfectivos.forEach(item => {
      total += parseFloat(item.importe);
    });
    // this.formularioViajeEfectivo.get('importeTotal').setValue(this.appServicio.establecerDecimales(total, 2));
    this.importeTotal.setValue(this.appServicio.establecerDecimales(total, 2));
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appServicio.establecerDecimales(elemento.value, 2));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appServicio.establecerDecimales(elemento, 2);
  }
  //Establece la lista de efectivos
  public establecerLista(lista, viaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaEfectivos = lista;
    this.recargarListaCompleta(this.listaEfectivos);
    this.viaje = viaje;
    this.formularioViajeEfectivo.get('viaje').patchValue(viaje);
    this.establecerViajeCabecera(viaje);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();

  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch(indice) {
      case 1:
        this.soloLectura = false;
        this.establecerValoresPorDefecto(1);
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
  //Limpia el formulario
  public cancelar(){
    this.reestablecerFormulario();
    this.formularioViajeEfectivo.get('viaje').setValue(this.viaje);
    this.listar();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaCajaAE').focus();
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaEfectivos'
  private recargarListaCompleta(listaEfectivos){
    this.listaCompleta = new MatTableDataSource(listaEfectivos);
    this.listaCompleta.sort = this.sort; 
    this.calcularImporteTotal();
  }
  //Establece los campos select en solo lectura o no
  private establecerCamposSelectSoloLectura(opcion): void {
    if(opcion) {
      this.formularioViajeEfectivo.get('empresa').disable();
    } else {
      this.formularioViajeEfectivo.get('empresa').enable();
    }
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function() {
      document.getElementById('idFechaCajaAE').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaEfectivos = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();   
    this.formularioViajeEfectivo.reset();
    this.formularioViajeEfectivo.value.viaje = this.VIAJE_CABECERA;
    this.indiceEfectivo = null;
    this.btnEfectivo = true;
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
        tema: this.appServicio.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {});
  }
  //Mascara un importe decimal
  public mascararImporte(limit, decimalLimite) {
    return this.appServicio.mascararImporte(limit, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
}