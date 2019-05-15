import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajePropioPeaje } from 'src/app/modelos/viajePropioPeaje';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ViajePropioPeajeService } from 'src/app/servicios/viaje-propio-peaje';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viaje-peaje',
  templateUrl: './viaje-peaje.component.html',
  styleUrls: ['./viaje-peaje.component.css']
})
export class ViajePeajeComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio peaje para validaciones de campos
  public formularioViajePropioPeaje: FormGroup;
  //Define la lista de ordenes de peajes (tabla)
  public listaPeajes: Array<any> = [];
  //Define la lista de proveedores
  public resultadosProveedores: Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del Peaje para las modificaciones
  public indicePeaje: number;
  //Define si muestra el boton agregar Peaje o actualizar Peaje
  public btnPeaje: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado:number = 1;
  //Define el viaje actual de los tramos
  public viaje:any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private viajePropioPeajeModelo: ViajePropioPeaje, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private servicio: ViajePropioPeajeService, private toastr: ToastrService,
    private appService: AppService, private loaderService: LoaderService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje propio peaje
    this.formularioViajePropioPeaje = this.viajePropioPeajeModelo.formulario;
    //Autocompletado Proveedor (Peaje) - Buscar por alias
    this.formularioViajePropioPeaje.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response => {
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
    if (opcion == 1) {
      this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appService.establecerDecimales(valor, 2));
    }
  }
  //Agrega datos a la tabla de peajes
  public agregarPeaje(): void {
    this.formularioViajePropioPeaje.get('tipoComprobante').setValue({ id: 17 });
    this.formularioViajePropioPeaje.get('usuario').setValue(this.appService.getUsuario());
    this.listaPeajes.push(this.formularioViajePropioPeaje.value);
    this.formularioViajePropioPeaje.reset();
    this.calcularImporteTotal();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorP').focus();
    this.enviarDatos();
  }
  //Modifica los datos del Peaje
  public modificarPeaje(): void {
    this.listaPeajes[this.indicePeaje] = this.formularioViajePropioPeaje.value;
    this.btnPeaje = true;
    this.formularioViajePropioPeaje.reset();
    this.calcularImporteTotal();
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
    if(this.indiceSeleccionado == 1 || elemento.id == null) {
      this.listaPeajes.splice(indice, 1);
      this.calcularImporteTotal();
      this.establecerValoresPorDefecto(0);
      this.enviarDatos();
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(
        res => {
          let respuesta = res.json();
          this.listaPeajes.splice(indice, 1);
          this.calcularImporteTotal();
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        },
        err => {
          this.loaderService.hide();
        });
    }
    document.getElementById('idProveedorP').focus();
    this.enviarDatos();
  }
  //Calcula el total de combustible y el total de urea
  private calcularImporteTotal(): void {
    let importeTotal = 0;
    this.listaPeajes.forEach(item => {
      importeTotal += Number(item.importe);
    })
    this.formularioViajePropioPeaje.get('importeTotal').setValue(importeTotal.toFixed(2));
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if(elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
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
  public establecerLista(lista, viaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaPeajes = lista;
    this.viaje = viaje;
    this.calcularImporteTotal();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        this.establecerValoresPorDefecto(1);
        this.establecerSelectsSoloLectura(false);
        break;
      case 2:
        this.soloLectura = true;
        this.establecerSelectsSoloLectura(true);
        break;
      case 3:
        this.soloLectura = false;
        this.establecerSelectsSoloLectura(false);
        break;
      case 4:
        this.soloLectura = true;
        this.establecerSelectsSoloLectura(true);
        break;
    }
  }
  //Establece selects solo lectura
  private establecerSelectsSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajePropioPeaje.get('letra').disable();
    } else {
      this.formularioViajePropioPeaje.get('letra').enable();
    }
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appService.establecerDecimales(elemento.value, 2));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appService.establecerDecimales(elemento, 2);
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function() {
      document.getElementById('idProveedorP').focus();
    }, 100);
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
  //Mascara un importe decimal
  public mascararImporte(limit) {
    return this.appService.mascararImporte(limit);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Mascara un entero
  public mascararEnteros(limit) {
    return this.appService.mascararEnteros(limit);
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}