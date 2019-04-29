import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajePropioPeaje } from 'src/app/modelos/viajePropioPeaje';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-viaje-peaje',
  templateUrl: './viaje-peaje.component.html',
  styleUrls: ['./viaje-peaje.component.css']
})
export class ViajePeajeComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio peaje para validaciones de campos
  public formularioViajePropioPeaje:FormGroup;
  //Define la lista de ordenes de peajes (tabla)
  public listaPeajes:Array<any> = [];
  //Define la lista de proveedores
  public resultadosProveedores:Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura:boolean = false;
  //Define el indice del Peaje para las modificaciones
  public indicePeaje:number;
  //Define si muestra el boton agregar Peaje o actualizar Peaje
  public btnPeaje:boolean = true;
  //Constructor
  constructor(private viajePropioPeajeModelo: ViajePropioPeaje, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private appComponent: AppComponent) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio peaje
    this.formularioViajePropioPeaje = this.viajePropioPeajeModelo.formulario;
    //Autocompletado Proveedor (Peaje) - Buscar por alias
    this.formularioViajePropioPeaje.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
        })
      }
    })
    //Establece los valores por defecto del formulario viaje peaje
    this.establecerValoresPorDefecto(1);
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioPeaje.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioPeaje.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Agrega datos a la tabla de peajes
  public agregarPeaje(): void {
    this.formularioViajePropioPeaje.get('tipoComprobante').setValue({id:17});
    this.formularioViajePropioPeaje.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaPeajes.push(this.formularioViajePropioPeaje.value);
    let importe = this.formularioViajePropioPeaje.get('importe').value;
    let importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioPeaje.reset();
    this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorP').focus();
    this.enviarDatos();
  }
  //Modifica los datos del Peaje
  public modificarPeaje(): void {
    this.listaPeajes[this.indicePeaje] = this.formularioViajePropioPeaje.value;
    this.btnPeaje = true;
    this.formularioViajePropioPeaje.reset();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorP').focus();
    this.enviarDatos();
  }
  //Modifica un Peaje de la tabla por indice
  public modPeaje(indice): void {
    this.indicePeaje = indice;
    this.btnPeaje = false;
    this.formularioViajePropioPeaje.patchValue(this.listaPeajes[indice]);
  }
  //Elimina un peaje de la tabla por indice
  public eliminarPeaje(indice, elemento): void {
    this.listaPeajes.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idProveedorP').focus();
    this.enviarDatos();
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Define como se muestran los ceros a la izquierda en tablas
  public mostrarCeros(elemento, string, cantidad) {
    return elemento ? (string + elemento).slice(cantidad) : elemento;
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaPeajes);
  }
  //Establece la lista de efectivos
  public establecerLista(lista): void {
    this.establecerValoresPorDefecto(1);
    this.listaPeajes = lista;
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    switch(indice) {
      case 1:
        this.soloLectura = false;
        // this.establecerCamposSelectSoloLectura(false);
        break;
      case 2:
        this.soloLectura = true;
        // this.establecerCamposSelectSoloLectura(true);
        break;
      case 3:
        this.soloLectura = false;
        // this.establecerCamposSelectSoloLectura(false);
        break;
      case 4:
        this.soloLectura = true;
        // this.establecerCamposSelectSoloLectura(true);
        break;
    }
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appComponent.establecerCeros(elemento);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaPeajes = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioPeaje.reset();
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}