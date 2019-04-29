import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { ViajePropioCombustible } from 'src/app/modelos/viajePropioCombustible';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialog } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-viaje-combustible',
  templateUrl: './viaje-combustible.component.html',
  styleUrls: ['./viaje-combustible.component.css']
})
export class ViajeCombustibleComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio combustible para validaciones de campos
  public formularioViajePropioCombustible:FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores:Array<any> = [];
  //Define la lista de insumos
  public insumos:Array<any> = [];
  //Define la lista de combustibles
  public listaCombustibles:Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura:boolean = false;
  //Define el indice del combustible para las modificaciones
  public indiceCombustible:number;
  //Define si muestra el boton agregar combustible o actualizar combustible
  public btnCombustible:boolean = true;
  //Constructor
  constructor(private proveedorServicio: ProveedorService, private viajePropioCombustibleModelo: ViajePropioCombustible,
    private fechaServicio: FechaService, private appComponent: AppComponent, 
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog, private appService:AppService) { }
  //Al inicilizarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio combustible
    this.formularioViajePropioCombustible = this.viajePropioCombustibleModelo.formulario;
    //Autocompletado Proveedor (Combustible) - Buscar por alias
    this.formularioViajePropioCombustible.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
        })
      }
    })
    //Obtiene la lista de insumos
    this.listarInsumos();
    //Establece los valores por defecto del formulario viaje combustible
    this.establecerValoresPorDefecto(1);
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioCombustible.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioCombustible.get('cantidad').setValue(valor);
    this.formularioViajePropioCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioCombustible.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioCombustible.get('totalCombustible').setValue(this.appComponent.establecerCeros(valor));
      this.formularioViajePropioCombustible.get('totalUrea').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Obtiene el listado de insumos
  private listarInsumos() {
    this.insumoProductoServicio.listarCombustibles().subscribe(
      res => {
        this.insumos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    this.establecerDecimales(formulario.get('precioUnitario'), 2 )
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    if(cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Establece el precio unitario
  public establecerPrecioUnitario(formulario, elemento): void {
    let precioUnitarioVenta = parseFloat(formulario.get(elemento).value.precioUnitarioVenta);
    if(precioUnitarioVenta != 0) {
      formulario.get('precioUnitario').setValue(precioUnitarioVenta);
      this.establecerCeros(formulario.get('precioUnitario'));
      formulario.get('precioUnitario').disable();
    } else {
      formulario.get('precioUnitario').enable();
      formulario.get('precioUnitario').reset();
    }
  }
  //Agrega datos a la tabla de combustibles
  public agregarCombustible(): void {
    this.formularioViajePropioCombustible.get('tipoComprobante').setValue({id:15});
    this.formularioViajePropioCombustible.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioCombustible.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaCombustibles.push(this.formularioViajePropioCombustible.value);
    this.formularioViajePropioCombustible.reset();
    this.formularioViajePropioCombustible.value.id == null ? this.calcularTotalCombustibleYUreaA() : this.calcularTotalCombustibleYUrea();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Modifica los datos del combustible
  public modificarCombustible(): void {
    this.listaCombustibles[this.indiceCombustible] = this.formularioViajePropioCombustible.value;
    this.btnCombustible = true;
    this.formularioViajePropioCombustible.reset();
    this.formularioViajePropioCombustible.value.id == null ? this.calcularTotalCombustibleYUreaA() : this.calcularTotalCombustibleYUrea();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Modifica un combustible de la tabla por indice
  public modCombustible(indice): void {
    this.indiceCombustible = indice;
    this.btnCombustible = false;
    this.formularioViajePropioCombustible.patchValue(this.listaCombustibles[indice]);
  }
  //Elimina un combustible de la tabla por indice
  public eliminarCombustible(indice, elemento): void {
    if(elemento.id == null) {
      this.listaCombustibles.splice(indice, 1);
      this.calcularTotalCombustibleYUreaA();
    } else {
      this.listaCombustibles[indice].id = elemento.id*(-1);
      this.calcularTotalCombustibleYUrea();
    }
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Calcula el total de combustible y el total de urea
  private calcularTotalCombustibleYUreaA(): void {
    let totalCombustible = 0;
    let totalUrea = 0;
    this.listaCombustibles.forEach(item => {
      if (item.insumo.id == 1) {
        totalCombustible += item.cantidad;
      } else if (item.insumo.id == 3) {
        totalUrea += item.cantidad;
      }
    })
    this.formularioViajePropioCombustible.get('totalCombustible').setValue(totalCombustible.toFixed(2));
    this.formularioViajePropioCombustible.get('totalUrea').setValue(totalUrea.toFixed(2));
  }
  //Calcula el total de combustible y el total de urea
  private calcularTotalCombustibleYUrea(): void {
    let totalCombustible = 0;
    let totalUrea = 0;
    this.listaCombustibles.forEach(item => {
      if(item.id != -1) {
        if(item.insumo.id == 1) {
          totalCombustible += item.cantidad;
        } else if(item.insumo.id == 3) {
          totalUrea += item.cantidad;
        }
      }
    })
    this.formularioViajePropioCombustible.get('totalCombustible').setValue(totalCombustible.toFixed(2));
    this.formularioViajePropioCombustible.get('totalUrea').setValue(totalUrea.toFixed(2));
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appComponent.establecerCeros(elemento);
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaCombustibles);
  }
  //Establece la lista de combustibles
  public establecerLista(lista): void {
    this.establecerValoresPorDefecto(1);
    this.listaCombustibles = lista;
    this.calcularTotalCombustibleYUrea();
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
      this.formularioViajePropioCombustible.get('insumo').disable();
    } else {
      this.formularioViajePropioCombustible.get('insumo').enable();
    }
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaCombustibles = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioCombustible.reset();
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
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

}