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
  //Define el viaje Cabecera
  public VIAJE_CABECERA: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['sucursal', 'orden', 'fecha', 'proveedor', 'insumoProducto', 'cantidad', 'precioUnitario', 'observaciones', 'anulado', 'obsAnulado', 'mod', 'anular'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private proveedorServicio: ProveedorService, private viajeCombustibleModelo: ViajeCombustible,
    private fechaServicio: FechaService, private appComponent: AppComponent, 
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog, private appServicio: AppService,
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
  //Establece el id del viaje de Cabecera
  public establecerViajeCabecera(viajeCabecera){
    this.VIAJE_CABECERA = viajeCabecera;
    console.log(this.VIAJE_CABECERA);
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar(){
    this.loaderService.show();
      this.servicio.listarCombustibles(this.VIAJE_CABECERA.id).subscribe(
        res=>{
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
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaCombustibles'
  private recargarListaCompleta(listaCombustibles){
    this.listaCompleta = new MatTableDataSource(listaCombustibles);
    this.listaCompleta.sort = this.sort; 
    this.calcularTotalCombustibleYUrea();
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto(opcion): void {
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajeCombustible.get('fecha').setValue(res.json());
    })
    // this.formularioViajeCombustible.get('cantidad').setValue('0');
    // this.formularioViajeCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros('0.00'));
    // this.formularioViajeCombustible.get('importe').setValue(this.appComponent.establecerCeros('0.00'));
    if (opcion == 1) {
      this.formularioViajeCombustible.get('totalCombustible').setValue(this.appComponent.establecerCeros('0.00'));
      this.formularioViajeCombustible.get('totalUrea').setValue(this.appComponent.establecerCeros('0.00'));
    }
    // this.calcularImporte(this.formularioViajeCombustible);
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
        this.formularioViajeCombustible.get('precioUnitario').setValue(res.text());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    if(!this.formularioViajeCombustible.value.cantidad)
      this.formularioViajeCombustible.get('cantidad').setValue('0');
    if(!this.formularioViajeCombustible.value.precioUnitario)
      this.formularioViajeCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros('0.00'));
    if(!this.formularioViajeCombustible.value.importe)
      this.formularioViajeCombustible.get('importe').setValue(this.appComponent.establecerCeros('0.00'));
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
    console.log(insumoProducto.id);
    this.insumoProductoServicio.obtenerPrecioUnitario(insumoProducto.id).subscribe(
      res => {
        let precioUnitarioViaje = parseFloat(res.text());
        console.log(precioUnitarioViaje);

        if (precioUnitarioViaje != 0 ) {
          formulario.get('precioUnitario').setValue(precioUnitarioViaje);
          this.establecerCeros(formulario.get('precioUnitario'));
          // formulario.get('precioUnitario').disable();
          }else {
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
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeCombustible.value.viaje = {id: idViajeCabecera};
    this.servicio.agregar(this.formularioViajeCombustible.value).subscribe(
      res=>{
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
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
    let usuarioMod = this.appServicio.getUsuario();
    this.formularioViajeCombustible.value.usuarioMod = usuarioMod;
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeCombustible.value.viaje = {id: idViajeCabecera};
    this.servicio.actualizar(this.formularioViajeCombustible.value).subscribe(
      res=>{
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.btnCombustible = true;
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
  public anularCombustible(elemento): void {
    this.loaderService.show();
    elemento.viaje = {id: this.VIAJE_CABECERA.id};
      this.servicio.anularCombustible(elemento).subscribe(
        res => {
          let respuesta = res.json();
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        },
        err => {
          this.toastr.error("Error al anular el registro");
          this.loaderService.hide();
        });
    document.getElementById('idProveedorOC').focus();
  }
  //Calcula el total de combustible y el total de urea
  private calcularTotalCombustibleYUrea(): void {
    let totalCombustible = 0;
    let totalUrea = 0;
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
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appComponent.establecerCeros(elemento);
  }
  //Establece la lista de combustibles
  public establecerLista(lista, viaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaCombustibles = lista;
    this.recargarListaCompleta(this.listaCombustibles);
    this.formularioViajeCombustible.get('viaje').patchValue(viaje);
    this.establecerViajeCabecera(viaje);
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
    this.formularioViajeCombustible.value.viaje = this.VIAJE_CABECERA;
    this.indiceCombustible = null;
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
    return this.appServicio.mascararImporte(limit, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appServicio.mascararEnterosConDecimales(limit);
  }
  //Mascarar litros
  public mascararLitros(limite) {
    return this.appServicio.mascararLitros(limite);
  }
  //Desenmascarar litros
  public desenmascararLitros(formulario) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.desenmascararLitros(valor));
    }
  }
  //Establece la cantidad con decimales
  public establecerCantidad(){
    this.establecerDecimales(this.formularioViajeCombustible.get('cantidad'), 2);
  }
}