import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajePropioGasto } from 'src/app/modelos/viajePropioGasto';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ViajePropioGastoService } from 'src/app/servicios/viaje-propio-gasto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viaje-gasto',
  templateUrl: './viaje-gasto.component.html',
  styleUrls: ['./viaje-gasto.component.css']
})
export class ViajeGastoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio gasto para validaciones de campos
  public formularioViajePropioGasto:FormGroup;
  //Define la lista de ordenes de gastos (tabla)
  public listaGastos:Array<any> = [];
  //Define la lista de resultados rubro producto de busqueda
  public resultadosRubrosProductos:Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura:boolean = false;
  //Define el indice del Gasto para las modificaciones
  public indiceGasto:number;
  //Define si muestra el boton agregar Gasto o actualizar Gasto
  public btnGasto:boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado:number = 1;
  //Define el viaje actual de los tramos
  public viaje:any;
  //Constructor
  constructor(private viajePropioGastoModelo: ViajePropioGasto, private rubroProductoServicio: RubroProductoService,
    private fechaServicio: FechaService, private appComponent: AppComponent, public dialog: MatDialog, public appService: AppService,
    private servicio: ViajePropioGastoService, private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio gasto
    this.formularioViajePropioGasto = this.viajePropioGastoModelo.formulario;
    //Autocompletado Rubro Producto - Buscar por nombre
    this.formularioViajePropioGasto.get('rubroProducto').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.rubroProductoServicio.listarPorNombre(data).subscribe(response =>{
          this.resultadosRubrosProductos = response;
        })
      }
    })
    //Establece los valores por defecto del formulario viaje gasto
    this.establecerValoresPorDefecto(1);
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioGasto.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioGasto.get('cantidad').setValue(valor);
    this.formularioViajePropioGasto.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioGasto.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Agrega datos a la tabla de gastos
  public agregarGasto(): void {
    this.formularioViajePropioGasto.get('tipoComprobante').setValue({id:19});
    let usuario = this.appComponent.getUsuario();
    this.formularioViajePropioGasto.get('sucursal').setValue(usuario.sucursal);
    this.formularioViajePropioGasto.get('usuario').setValue(usuario);
    this.listaGastos.push(this.formularioViajePropioGasto.value);
    this.formularioViajePropioGasto.reset();
    this.calcularImporteTotal();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaG').focus();
    this.enviarDatos();
  }
  //Modifica los datos del Gasto
  public modificarGasto(): void {
    this.listaGastos[this.indiceGasto] = this.formularioViajePropioGasto.value;
    this.btnGasto = true;
    this.formularioViajePropioGasto.reset();
    this.calcularImporteTotal();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaG').focus();
    this.enviarDatos();
  }
  //Modifica un Gasto de la tabla por indice
  public modGasto(indice): void {
    this.indiceGasto = indice;
    this.btnGasto = false;
    this.formularioViajePropioGasto.patchValue(this.listaGastos[indice]);
  }
  //Elimina un gasto de la tabla por indice
  public eliminarGasto(indice, elemento): void {
    if(this.indiceSeleccionado == 1) {
      this.listaGastos.splice(indice, 1);
      this.calcularImporteTotal();
      this.establecerValoresPorDefecto(0);
      this.enviarDatos();
    } else {
      this.servicio.eliminar(elemento.id).subscribe(res => {
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.servicio.listarGastos(this.viaje.id).subscribe(res => {
          this.listaGastos = res.json();
          this.calcularImporteTotal();
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
        });
      });
    }
    document.getElementById('idFechaG').focus();
    this.enviarDatos();
  }
  //Calcula el importe a partir de cantidad y precio unitario
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
  //Calcula el importe total
  private calcularImporteTotal(): void {
    let importeTotal = 0;
    this.listaGastos.forEach(item => {
      importeTotal += Number(item.importe);
    });
    this.formularioViajePropioGasto.get('importeTotal').setValue(importeTotal.toFixed(2));
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaGastos);
  }
  //Establece la lista de efectivos
  public establecerLista(lista, viaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaGastos = lista;
    this.viaje = viaje;
    this.calcularImporteTotal();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch(indice) {
      case 1:
        this.soloLectura = false;
        break;
      case 2:
        this.soloLectura = true;
        break;
      case 3:
        this.soloLectura = false;
        break;
      case 4:
        this.soloLectura = true;
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
    this.listaGastos = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioGasto.reset();
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
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
  //Mascara un importe
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