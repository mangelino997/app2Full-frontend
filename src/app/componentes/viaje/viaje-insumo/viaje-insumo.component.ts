import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ViajePropioInsumo } from 'src/app/modelos/viajePropioInsumo';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-viaje-insumo',
  templateUrl: './viaje-insumo.component.html',
  styleUrls: ['./viaje-insumo.component.css']
})
export class ViajeInsumoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio insumo para validaciones de campos
  public formularioViajePropioInsumo:FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores:Array<any> = [];
  //Define la lista de ordenes de insumos (tabla)
  public listaInsumos:Array<any> = [];
  //Define la lista de insumos productos
  public insumos:Array<any> = [];
  //Constructor
  constructor(private viajePropioInsumoModelo: ViajePropioInsumo, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private appComponent: AppComponent, 
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio insumo
    this.formularioViajePropioInsumo = this.viajePropioInsumoModelo.formulario;
    //Autocompletado Proveedor (Insumo) - Buscar por alias
    this.formularioViajePropioInsumo.get('proveedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
          this.resultadosProveedores = response;
        })
      }
    })
    //Obtiene la lista de insumos productos
    this.listarInsumos();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto(1);
  }
  //Obtiene el listado de insumos
  private listarInsumos() {
    this.insumoProductoServicio.listar().subscribe(
      res => {
        this.insumos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece los valores por defecto del formulario viaje insumo
  private establecerValoresPorDefecto(opcion): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioInsumo.get('fecha').setValue(res.json());
    })
    this.formularioViajePropioInsumo.get('cantidad').setValue(valor);
    this.formularioViajePropioInsumo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioInsumo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if(opcion == 1) {
      this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Establece el precio unitario
  public establecerPrecioUnitario(formulario, elemento): void {
    formulario.get('precioUnitario').setValue((formulario.get(elemento).value.precioUnitarioVenta));
    this.establecerCeros(formulario.get('precioUnitario'));
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
    if(cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Agrega datos a la tabla de orden insumo
  public agregarInsumo(): void {
    this.formularioViajePropioInsumo.get('tipoComprobante').setValue({id:18});
    this.formularioViajePropioInsumo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioInsumo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaInsumos.push(this.formularioViajePropioInsumo.value);
    let importe = this.formularioViajePropioInsumo.get('importe').value;
    let importeTotal = this.formularioViajePropioInsumo.get('importeTotal').value;
    let total = parseFloat(importeTotal) + parseFloat(importe);
    this.formularioViajePropioInsumo.reset();
    this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Elimina una orden insumo de la tabla por indice
  public eliminarInsumo(indice, elemento): void {
    this.listaInsumos.splice(indice, 1);
    let importe = elemento.importe;
    let importeTotal = this.formularioViajePropioInsumo.get('importeTotal').value;
    let total = parseFloat(importeTotal) - parseFloat(importe);
    this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaInsumos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaInsumos = [];
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
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