import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeInsumo } from 'src/app/modelos/viajeInsumo';
import { ViajeInsumoService } from 'src/app/servicios/viaje-insumo';

@Component({
  selector: 'app-viaje-insumo',
  templateUrl: './viaje-insumo.component.html',
  styleUrls: ['./viaje-insumo.component.css']
})
export class ViajeInsumoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje  insumo para validaciones de campos
  public formularioViajeInsumo: FormGroup;
  //Define la lista de resultados proveedores de busqueda
  public resultadosProveedores: Array<any> = [];
  //Define la lista de ordenes de insumos (tabla)
  public listaInsumos: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
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
  //Define las columnas de la tabla
  public columnas: string[] = ['sucursal', 'orden', 'fecha', 'proveedor', 'insumo', 'cantidad', 'precioUnitario', 'importe', 'observaciones',
                              'anulado', 'obsAnulado', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private viajeInsumoModelo: ViajeInsumo, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private appComponent: AppComponent, private loaderService: LoaderService,
    private insumoProductoServicio: InsumoProductoService, public dialog: MatDialog,
    private appServicio: AppService, private toastr: ToastrService, private servicio: ViajeInsumoService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  insumo
    this.formularioViajeInsumo = this.viajeInsumoModelo.formulario;
    //Autocompletado Proveedor (Insumo) - Buscar por alias
    this.formularioViajeInsumo.get('proveedor').valueChanges.subscribe(data => {
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
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar(){
    this.loaderService.show();
    console.log(this.formularioViajeInsumo.value.viaje.id);
    if(this.formularioViajeInsumo.value.viaje.id){
      this.servicio.listarInsumos(this.formularioViajeInsumo.value.viaje.id).subscribe(
        res=>{
          console.log("Insumos: " + res.json());
          this.listaInsumos = res.json();
          this.recargarListaCompleta(this.listaInsumos);
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
  //Establece el viaje de guia de servicio (CABECERA)
  public establecerViaje(idViaje){
    console.log(idViaje);
    this.formularioViajeInsumo.get('viaje').setValue({id: idViaje});
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
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajeInsumo.get('fecha').setValue(res.json());
    })
    this.formularioViajeInsumo.get('cantidad').setValue('0');
    this.formularioViajeInsumo.get('importe').setValue(this.appServicio.establecerDecimales('0.00', 2));
    this.formularioViajeInsumo.get('precioUnitario').setValue(this.appServicio.establecerDecimales('0.00', 2));
    if (opcion == 1) {
      this.formularioViajeInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros('0'));
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
    this.formularioViajeInsumo.get('tipoComprobante').setValue({ id: 18 });
    this.formularioViajeInsumo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formularioViajeInsumo.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    console.log(this.formularioViajeInsumo.value);
    this.servicio.agregar(this.formularioViajeInsumo.value).subscribe(
      res=>{
        let resultado = res.json();
        if (res.status == 201) {
          console.log(resultado);
          let idViaje = this.formularioViajeInsumo.value.viaje.id;
          this.reestablecerFormulario();
          this.establecerViaje(idViaje);
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          document.getElementById('idProveedor').focus();
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
  //Modifica los datos del Insumo
  public modificarInsumo(): void {
    this.servicio.actualizar(this.formularioViajeInsumo.value).subscribe(
      res=>{
        let idViaje = this.formularioViajeInsumo.value.viaje.id;
        console.log(idViaje);
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.establecerViaje(idViaje);
          this.establecerValoresPorDefecto(0);
          this.btnInsumo = true;
          this.enviarDatos();
          document.getElementById('idProveedor').focus();
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
        this.listar();
      },  
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );

  }
  //Modifica un Insumo de la tabla por indice
  public modInsumo(indice): void {
    this.indiceInsumo = indice;
    this.btnInsumo = false;
    this.formularioViajeInsumo.patchValue(this.listaInsumos[indice]);
    this.formularioViajeInsumo.get('importe').setValue(this.appServicio.establecerDecimales(this.formularioViajeInsumo.value.importe ,2));
    this.formularioViajeInsumo.get('precioUnitario').setValue(this.appServicio.establecerDecimales(this.formularioViajeInsumo.value.precioUnitario ,2));

  }
  //Elimina una orden insumo de la tabla por indice
  public eliminarInsumo(indice, elemento): void {
    if (this.indiceSeleccionado == 1) {
      this.listaInsumos.splice(indice, 1);
      this.recargarListaCompleta(this.listaInsumos);
      this.establecerValoresPorDefecto(0);
      this.enviarDatos();
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(res => {
          let respuesta = res.json();
          this.listaInsumos.splice(indice, 1);
          this.recargarListaCompleta(this.listaInsumos);
          this.establecerValoresPorDefecto(0);
          this.enviarDatos();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.loaderService.hide();
          this.toastr.error(error.mensaje);
        });
    }
    document.getElementById('idProveedor').focus();
    this.enviarDatos();
  }
  //Calcula el importe total al agregar
  private calcularImporteTotal(): void {
    let total = 0;
    console.log(total, this.listaInsumos);
    this.listaInsumos.forEach(item => {
      total += parseFloat(item.importe);
      console.log(total, item.importe);
    })
    this.formularioViajeInsumo.get('importeTotal').setValue(this.appServicio.establecerDecimales(total, 2));
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit(this.listaInsumos);
  }
  //Establece la lista de efectivos
  public establecerLista(lista, viaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaInsumos = lista;
    this.recargarListaCompleta(this.listaInsumos);
    this.viaje = viaje;
    this.establecerViaje(viaje.id);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();
    this.enviarDatos();
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
  //Limpia el formulario
  public cancelar(){
    this.reestablecerFormulario();
    this.formularioViajeInsumo.get('viaje').setValue(this.viaje);
    this.listar();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idProveedor').focus();
  }
  //Establece los campos select en solo lectura o no
  private establecerCamposSelectSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajeInsumo.get('insumoProducto').disable();
    } else {
      this.formularioViajeInsumo.get('insumoProducto').enable();
    }
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaTramos'
  private recargarListaCompleta(listaTramos){
    this.listaCompleta = new MatTableDataSource(listaTramos);
    this.listaCompleta.sort = this.sort; 
    this.calcularImporteTotal();
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
      document.getElementById('idProveedor').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.resultadosProveedores = [];
    this.listaInsumos = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formularioViajeInsumo.reset();
    this.indiceInsumo = null;
    this.btnInsumo = true;
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