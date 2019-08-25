import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeGasto } from 'src/app/modelos/viajeGasto';
import { ViajeGastoService } from 'src/app/servicios/viaje-gasto';
import { EliminarModalComponent } from '../../eliminar-modal/eliminar-modal.component';
import { AnularDialogo } from '../anular-dialogo.component';
import { NormalizarDialogo } from '../normalizar-dialogo.component';

@Component({
  selector: 'app-viaje-gasto',
  templateUrl: './viaje-gasto.component.html',
  styleUrls: ['./viaje-gasto.component.css']
})
export class ViajeGastoComponent implements OnInit {
  @Output() dataEvent = new EventEmitter();
  //Define un formulario viaje  gasto para validaciones de campos
  public formularioViajeGasto: FormGroup;
  //Define la lista de ordenes de gastos (tabla)
  public listaGastos: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de resultados rubro producto de busqueda
  public resultadosRubrosProductos: Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del Gasto para las modificaciones
  public indiceGasto: number;
  //Define si muestra el boton agregar Gasto o actualizar Gasto
  public btnGasto: boolean = true;
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
  public columnas: string[] = ['eliminar', 'mod', 'fecha', 'rubro', 'cantidad', 'precioUnitario', 'importe', 'obs', 'anulado', 'obsAnulado'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private viajeGastoModelo: ViajeGasto, private rubroProductoServicio: RubroProductoService,
    private fechaServicio: FechaService, private appComponent: AppComponent, public dialog: MatDialog, public appService: AppService,
    private servicio: ViajeGastoService, private toastr: ToastrService, private loaderService: LoaderService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  gasto
    this.formularioViajeGasto = this.viajeGastoModelo.formulario;
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Obtiene la lista de rubros de productos
    this.listarRubrosProductos();
    //Establece los valores por defecto del formulario viaje gasto
    this.establecerValoresPorDefecto(1);
  }
  //Establece el id del viaje de Cabecera
  public establecerViajeCabecera(viajeCabecera) {
    this.VIAJE_CABECERA = viajeCabecera;
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar() {
    this.loaderService.show();
    this.servicio.listarGastos(this.VIAJE_CABECERA.id).subscribe(
      res => {
        this.listaGastos = res.json();
        this.recargarListaCompleta(this.listaGastos);
        this.emitirGastos(this.listaGastos);
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Emite los gastos al Padre
  public emitirGastos(lista) {
    this.dataEvent.emit(lista);
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefecto(opcion): void {
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajeGasto.get('fecha').setValue(res.json());
    })
    this.formularioViajeGasto.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
    if (opcion == 1) {
      this.formularioViajeGasto.get('importeTotal').setValue(this.appService.establecerDecimales('0.00', 2));
    }
  }
  //Obtiene la lista de rubros de productos
  public listarRubrosProductos(): void {
    this.rubroProductoServicio.listar().subscribe(res => {
      this.resultadosRubrosProductos = res.json();
    });
  }
  //Agrega datos a la tabla de gastos
  public agregarGasto(): void {
    this.formularioViajeGasto.get('tipoComprobante').setValue({ id: 19 });
    let usuario = this.appComponent.getUsuario();
    this.formularioViajeGasto.get('sucursal').setValue(usuario.sucursal);
    this.formularioViajeGasto.get('usuarioAlta').setValue(usuario);
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeGasto.value.viaje = { id: idViajeCabecera };
    this.servicio.agregar(this.formularioViajeGasto.value).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
          document.getElementById('idFechaG').focus();
          this.toastr.success("Registro agregado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica los datos del Gasto
  public modificarGasto(): void {
    let usuarioMod = this.appService.getUsuario();
    this.formularioViajeGasto.value.usuarioMod = usuarioMod;
    let idViajeCabecera = this.VIAJE_CABECERA.id;
    this.formularioViajeGasto.value.viaje = { id: idViajeCabecera };
    this.servicio.actualizar(this.formularioViajeGasto.value).subscribe(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto(0);
          this.btnGasto = true;
          document.getElementById('idFechaG').focus();
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica un Gasto de la tabla por indice
  public modGasto(indice): void {
    this.indiceGasto = indice;
    this.btnGasto = false;
    this.formularioViajeGasto.patchValue(this.listaGastos[indice]);
    this.formularioViajeGasto.get('importe').setValue(this.appService.establecerDecimales(this.formularioViajeGasto.value.importe, 2));
    this.formularioViajeGasto.get('precioUnitario').setValue(this.appService.establecerDecimales(this.formularioViajeGasto.value.precioUnitario, 2));
  }
  //Anula un gasto de la tabla por indice
  public anularGasto(elemento): void {
    const dialogRef = this.dialog.open(AnularDialogo, {
      width: '800px',
      data: {
        tema: this.appService.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado.value.observaciones) {
        this.loaderService.show();
        elemento.viaje = { id: this.VIAJE_CABECERA.id };
        elemento.observacionesAnulado = resultado.value.observaciones;
        this.servicio.anular(elemento).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            this.toastr.error("No se pudo anular el registro");
            this.loaderService.hide();
          }
        );
      }
      document.getElementById('idFechaG').focus();
    });
  }
  //Normaliza un gasto de la tabla por indice
  public normalizarGasto(elemento): void {
    const dialogRef = this.dialog.open(NormalizarDialogo, {
      width: '800px',
      data: {
        tema: this.appService.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loaderService.show();
        elemento.viaje = { id: this.VIAJE_CABECERA.id };
        this.servicio.normalizar(elemento).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            this.toastr.error("No se pudo normalizar el registro");
            this.loaderService.hide();
          }
        );
      }
      document.getElementById('idFechaG').focus();
    });
  }
  //Calcula el importe a partir de cantidad y precio unitario
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
  //Calcula el importe total
  private calcularImporteTotal(): void {
    let importeTotal = 0;
    this.listaGastos.forEach(item => {
      if(!item.estaAnulado) {
        importeTotal += Number(item.importe);
      }
    });
    this.formularioViajeGasto.get('importeTotal').setValue(importeTotal.toFixed(2));
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaGastos'
  private recargarListaCompleta(listaGastos) {
    this.listaCompleta = new MatTableDataSource(listaGastos);
    this.listaCompleta.sort = this.sort;
    // this.emitirGastos(listaGastos);
    this.calcularImporteTotal();
  }
  //Establece la lista de efectivos
  public establecerLista(lista, viaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.listaGastos = lista;
    this.viaje = viaje;
    this.formularioViajeGasto.get('viaje').patchValue(viaje);
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
  //Limpia el formulario
  public cancelar() {
    this.formularioViajeGasto.reset();
    this.formularioViajeGasto.value.viaje = this.VIAJE_CABECERA;
    this.btnGasto = true;
    this.formularioViajeGasto.get('viaje').setValue(this.viaje);
    // this.listar();
    this.establecerValoresPorDefecto(0);
    document.getElementById('idFechaG').focus();
  }
  //Establece selects solo lectura
  private establecerSelectsSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajeGasto.get('rubroProducto').disable();
    } else {
      this.formularioViajeGasto.get('rubroProducto').enable();
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
    setTimeout(function () {
      document.getElementById('idFechaG').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaGastos = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formularioViajeGasto.reset();
    this.formularioViajeGasto.value.viaje = this.VIAJE_CABECERA;
    this.btnGasto = true;
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
  //Mascara un entero
  public mascararEnteros(limit) {
    return this.appService.mascararEnteros(limit);
  }
}