import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajePropioInsumo } from 'src/app/modelos/viajePropioInsumo';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialog } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { ViajePropioInsumoService } from 'src/app/servicios/viaje-propio-insumo';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viaje-insumo',
  templateUrl: './viaje-insumo.component.html',
  styleUrls: ['./viaje-insumo.component.css']
})
export class ViajeInsumoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio insumo para validaciones de campos
  public formularioViajePropioInsumo: FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores: Array<any> = [];
  //Define la lista de ordenes de insumos (tabla)
  public listaInsumos: Array<any> = [];
  //Define la lista de insumos productos
  public insumos: Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del Insumo para las modificaciones
  public indiceInsumo: number;
  //Define si muestra el boton agregar Insumo o actualizar Insumo
  public btnInsumo: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el viaje actual de los tramos
  public viaje: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private viajePropioInsumoModelo: ViajePropioInsumo, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private appComponent: AppComponent, private loaderService: LoaderService,
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog,
    private appServicio: AppService, private toastr: ToastrService, private servicio: ViajePropioInsumoService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje propio insumo
    this.formularioViajePropioInsumo = this.viajePropioInsumoModelo.formulario;
    //Autocompletado Proveedor (Insumo) - Buscar por alias
    this.formularioViajePropioInsumo.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response => {
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
    this.insumoProductoServicio.listarInsumos().subscribe(
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
    this.formularioViajePropioInsumo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    if (opcion == 1) {
      this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
    }
  }
  //Establece el precio unitario
  public establecerPrecioUnitario(formulario, elemento): void {
    let precioUnitarioVenta = formulario.get(elemento).value.precioUnitarioVenta;
    if (precioUnitarioVenta != 0) {
      formulario.get('precioUnitario').setValue(precioUnitarioVenta);
      this.establecerCeros(formulario.get('precioUnitario'));
      formulario.get('precioUnitario').disable();
    } else {
      formulario.get('precioUnitario').enable();
      formulario.get('precioUnitario').reset();
    }
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    this.establecerDecimales(formulario.get('precioUnitario'), 2);
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    if (cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Agrega datos a la tabla de orden insumo
  public agregarInsumo(): void {
    this.formularioViajePropioInsumo.get('tipoComprobante').setValue({ id: 18 });
    this.formularioViajePropioInsumo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajePropioInsumo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaInsumos.push(this.formularioViajePropioInsumo.value);
    this.formularioViajePropioInsumo.reset();
    this.calcularImporteTotal();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Modifica los datos del Insumo
  public modificarInsumo(): void {
    this.listaInsumos[this.indiceInsumo] = this.formularioViajePropioInsumo.value;
    this.btnInsumo = true;
    this.formularioViajePropioInsumo.reset();
    this.calcularImporteTotal();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Modifica un Insumo de la tabla por indice
  public modInsumo(indice): void {
    this.indiceInsumo = indice;
    this.btnInsumo = false;
    this.formularioViajePropioInsumo.patchValue(this.listaInsumos[indice]);
  }
  //Elimina una orden insumo de la tabla por indice
  public eliminarInsumo(indice, elemento): void {
    if (this.indiceSeleccionado == 1) {
      this.listaInsumos.splice(indice, 1);
      this.calcularImporteTotal();
      this.establecerValoresPorDefecto(0);
      this.enviarDatos();
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(res => {
          let respuesta = res.json();
          this.listaInsumos.splice(indice, 1);
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
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Calcula el importe total al agregar
  private calcularImporteTotal(): void {
    let total = 0;
    this.listaInsumos.forEach(item => {
      total += parseFloat(item.importe);
    })
    this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appServicio.establecerDecimales(total, 2));
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaInsumos);
  }
  //Establece la lista de efectivos
  public establecerLista(lista, viaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaInsumos = lista;
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
    if (opcion) {
      this.formularioViajePropioInsumo.get('insumoProducto').disable();
    } else {
      this.formularioViajePropioInsumo.get('insumoProducto').enable();
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
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function() {
      document.getElementById('idProveedorI').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaInsumos = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioInsumo.reset();
  }
  //Mascara un importe decimal
  public mascararImporte(limit) {
    return this.appServicio.mascararImporte(limit);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Mascara un entero
  public mascararEnteros(limit) {
    return this.appServicio.mascararEnteros(limit);
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
      valor.setValue(null);
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
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
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
    dialogRef.afterClosed().subscribe(resultado => { });
  }
}