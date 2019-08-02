import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeCombustibleService } from 'src/app/servicios/viaje-combustible';
import { ViajeCombustible } from 'src/app/modelos/viajeCombustible';

@Component({
  selector: 'app-viaje-combustible',
  templateUrl: './viaje-combustible.component.html',
  styleUrls: ['./viaje-combustible.component.css']
})
export class ViajeCombustibleComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje  combustible para validaciones de campos
  public formularioViajeCombustible: FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores: Array<any> = [];
  //Define la lista de insumos
  public insumos: Array<any> = [];
  //Define la lista de tramos (tabla)
  public listaCombustibles: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del combustible para las modificaciones
  public indiceCombustible: number;
  //Define si muestra el boton agregar combustible o actualizar combustible
  public btnCombustible: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el viaje actual de los tramos
  public viaje: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['sucursal', 'orden', 'fecha', 'proveedor', 'insumoProducto', 'cantidad', 'precioUnitario', 'observaciones', 'anulado', 'obsAnulado', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private proveedorServicio: ProveedorService, private viajeCombustibleModelo: ViajeCombustible,
    private fechaServicio: FechaService, private appComponent: AppComponent,
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog, private appService: AppService,
    private servicio: ViajeCombustibleService, private toastr: ToastrService, private loaderService: LoaderService) { }
  //Al inicilizarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  combustible
    this.formularioViajeCombustible = this.viajeCombustibleModelo.formulario;
    //Autocompletado Proveedor (Combustible) - Buscar por alias
    this.formularioViajeCombustible.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosProveedores = response;
        })
      }
    })
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Obtiene la lista de insumos
    this.listarInsumos();
    //Establece los valores por defecto del formulario viaje combustible
    this.establecerValoresPorDefecto(1);
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar(){
    this.loaderService.show();
    console.log(this.formularioViajeCombustible.value.viaje.id);
    if(this.formularioViajeCombustible.value.viaje.id){
      this.servicio.listarCombustibles(this.formularioViajeCombustible.value.viaje.id).subscribe(
        res=>{
          console.log("Combustibles: " + res.json());
          this.listaCombustibles = res.json();
          this.recargarListaCompleta(this.listaCombustibles);
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
    }
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaCombustibles'
  private recargarListaCompleta(listaCombustibles){
    this.listaCompleta = new MatTableDataSource(listaCombustibles);
    this.listaCompleta.sort = this.sort; 
    this.calcularTotalCombustibleYUrea();
  }
  //Establece el viaje de guia de servicio (CABECERA)
  public establecerViaje(idViaje){
    console.log(idViaje);
    this.formularioViajeCombustible.get('viaje').setValue({id: idViaje});
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto(opcion): void {
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajeCombustible.get('fecha').setValue(res.json());
    })
    this.formularioViajeCombustible.get('cantidad').setValue('0');
    this.formularioViajeCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros('0.00'));
    this.formularioViajeCombustible.get('importe').setValue(this.appComponent.establecerCeros('0.00'));
    if (opcion == 1) {
      this.formularioViajeCombustible.get('totalCombustible').setValue(this.appComponent.establecerCeros('0.00'));
      this.formularioViajeCombustible.get('totalUrea').setValue(this.appComponent.establecerCeros('0.00'));
    }
    this.calcularImporte(this.formularioViajeCombustible);
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
  //Obtiene el ultimo valor de precio unitario de un insumo
  public obtenerPrecioUnitario(): void {
    let insumoProducto = this.formularioViajeCombustible.get('insumoProducto').value;
    this.insumoProductoServicio.obtenerPrecioUnitario(insumoProducto.id).subscribe(
      res => {
        console.log(res.text());
        this.formularioViajeCombustible.get('precioUnitario').setValue(res.text());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    this.establecerDecimales(formulario.get('precioUnitario'), 2);
    this.establecerDecimales(formulario.get('cantidad'), 2);
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    if (cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Establece el precio unitario
  public establecerPrecioUnitario(formulario, elemento): void {
    let insumoProducto = formulario.get(elemento).value;
    this.insumoProductoServicio.obtenerPrecioUnitario(insumoProducto.id).subscribe(
      res => {
        let precioUnitarioViaje = parseFloat(res.text());
        if (precioUnitarioViaje != 0) {
          formulario.get('precioUnitario').setValue(precioUnitarioViaje);
          this.establecerCeros(formulario.get('precioUnitario'));
          formulario.get('precioUnitario').disable();
        } else {
          formulario.get('precioUnitario').enable();
          formulario.get('precioUnitario').reset();
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega datos a la tabla de combustibles
  public agregarCombustible(): void {
    this.formularioViajeCombustible.get('precioUnitario').enable();
    this.formularioViajeCombustible.get('tipoComprobante').setValue({ id: 15 });
    this.formularioViajeCombustible.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajeCombustible.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    console.log(this.formularioViajeCombustible.value);
    this.servicio.agregar(this.formularioViajeCombustible.value).subscribe(
      res=>{
        let resultado = res.json();
        let viajeCabecera = resultado.viaje;
        console.log(viajeCabecera);
        if (res.status == 201) {
          console.log(resultado);
          this.formularioViajeCombustible.reset();
          this.formularioViajeCombustible.value.viaje = viajeCabecera;
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          document.getElementById('idProveedorOC').focus();
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
  //Modifica los datos del combustible
  public modificarCombustible(): void {
    // this.btnCombustible = true;
    this.servicio.actualizar(this.formularioViajeCombustible.value).subscribe(
      res=>{
        let resultado = res.json();
        let viajeCabecera = resultado.viaje;
        console.log(viajeCabecera);
        if (res.status == 200) {
          console.log(resultado);
          this.btnCombustible = true;
          this.formularioViajeCombustible.reset();
          this.formularioViajeCombustible.value.viaje = viajeCabecera;
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          document.getElementById('idProveedorOC').focus();
          this.toastr.success("Registro actualizado con éxito");
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
  //Modifica un combustible de la tabla por indice
  public modCombustible(indice): void {
    this.indiceCombustible = indice;
    this.btnCombustible = false;
    this.formularioViajeCombustible.patchValue(this.listaCombustibles[indice]);
    this.calcularImporte(this.formularioViajeCombustible);
  }
  //Elimina un combustible de la tabla por indice
  public eliminarCombustible(indice, elemento): void {
    if (this.indiceSeleccionado == 1) {
      this.listaCombustibles.splice(indice, 1);
      this.recargarListaCompleta(this.listaCombustibles);
      this.establecerValoresPorDefecto(0);
      this.enviarDatos();
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(
        res => {
          let respuesta = res.json();
          this.listaCombustibles.splice(indice, 1);
          this.recargarListaCompleta(this.listaCombustibles);
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        },
        err => {
          this.loaderService.hide();
        });
    }
    document.getElementById('idProveedorOC').focus();
    this.enviarDatos();
  }
  //Calcula el total de combustible y el total de urea
  private calcularTotalCombustibleYUrea(): void {
    let totalCombustible = 0;
    let totalUrea = 0;
    console.log(this.listaCombustibles);
    if(this.listaCombustibles.length>0){
      this.listaCombustibles.forEach(item => {
        if (item.insumoProducto.id == 1) {
          totalCombustible += Number(item.cantidad);
        } else if (item.insumoProducto.id == 3) {
          totalUrea += Number(item.cantidad);
        }
      })
    }
    this.formularioViajeCombustible.get('totalCombustible').setValue(totalCombustible.toFixed(2));
    this.formularioViajeCombustible.get('totalUrea').setValue(totalUrea.toFixed(2));
  }
  //Limpia el formulario
  public cancelar(){
    this.reestablecerFormulario();
    this.formularioViajeCombustible.reset();
    this.formularioViajeCombustible.get('viaje').setValue(this.viaje);
    this.listar();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedorOC').focus();
    // this.establecerViaje(this.viaje);
    // this.formularioViajeTramo.get('viaje').setValue(this.viaje);
    // this.listar();
    // this.establecerValoresPorDefecto();
    // this.establecerViajeTarifaPorDefecto();
    // document.getElementById('idTramoFecha').focus();
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
  public establecerLista(lista, viaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaCombustibles = lista;
    this.recargarListaCompleta(this.listaCombustibles);
    this.viaje = viaje;
    this.formularioViajeCombustible.get('viaje').patchValue(viaje);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();
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
      this.formularioViajeCombustible.get('insumoProducto').disable();
    } else {
      this.formularioViajeCombustible.get('insumoProducto').enable();
    }
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function() {
      document.getElementById('idProveedorOC').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaCombustibles = [];
    this.resultadosProveedores = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formularioViajeCombustible.reset();
    this.btnCombustible = true;
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
  //Define como se muestra los datos en el autcompletado c
  public displayFn(elemento) {
    if (elemento != undefined) {
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
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Mascara un importe decimal
  public mascararImporte(limit, decimalLimite) {
    return this.appService.mascararImporte(limit, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appService.mascararEnterosConDecimales(limit);
  }
  //Mascarar litros
  public mascararLitros(limite) {
    return this.appService.mascararLitros(limite);
  }
  //Desenmascarar litros
  public desenmascararLitros(formulario) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.desenmascararLitros(valor));
    }
  }
}