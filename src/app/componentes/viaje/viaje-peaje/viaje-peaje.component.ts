import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ViajePeaje } from 'src/app/modelos/viajePeaje';
import { ViajePeajeService } from 'src/app/servicios/viaje-peaje';
import { ConfirmarDialogoComponent } from '../../confirmar-dialogo/confirmar-dialogo.component';

@Component({
  selector: 'app-viaje-peaje',
  templateUrl: './viaje-peaje.component.html',
  styleUrls: ['./viaje-peaje.component.css']
})
export class ViajePeajeComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje  peaje para validaciones de campos
  public formularioViajePeaje: FormGroup;
  //Define la lista de ordenes de peajes (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de proveedores
  public resultadosProveedores: Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del Peaje para las modificaciones
  public indicePeaje: number;
  //Define si muestra el boton agregar Peaje o actualizar Peaje
  public btnPeaje: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el id del viaje
  public ID_VIAJE: number;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['fecha', 'proveedor', 'puntoVenta', 'ticket', 'importe', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  //Constructor
  constructor(private viajePeajeModelo: ViajePeaje, private proveedorServicio: ProveedorService,
    private fechaServicio: FechaService, private servicio: ViajePeajeService, private toastr: ToastrService,
    private appService: AppService, private loaderService: LoaderService, public dialog: MatDialog) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  peaje
    this.formularioViajePeaje = this.viajePeajeModelo.formulario;
    //Autocompletado Proveedor (Peaje) - Buscar por alias
    this.formularioViajePeaje.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosProveedores = response;
        })
      }
    })
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Establece los valores por defecto del formulario viaje peaje
    this.establecerValoresPorDefecto();
  }
  //Establece el id del viaje de Cabecera
  public establecerIdViaje(viajeCabecera) {
    this.ID_VIAJE = viajeCabecera;
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar() {
    this.loaderService.show();
    this.servicio.listarPeajes(this.ID_VIAJE).subscribe(
      res => {
        this.recargarListaCompleta(res.json());
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Emite los peajes al Padre
  public emitirPeajes(lista) {
    this.dataEvent.emit(lista);
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaPeajes'
  private recargarListaCompleta(listaPeajes) {
    this.listaCompleta = new MatTableDataSource(listaPeajes);
    this.listaCompleta.sort = this.sort;
    this.calcularImporteTotal();
  }
  //Establece los valores por defecto del formulario viaje gasto
  public establecerValoresPorDefecto(): void {
    this.formularioViajePeaje.get('puntoVenta').setValue(this.establecerCerosIzq(this.formularioViajePeaje.get('puntoVenta'), '0000', -5));
    this.formularioViajePeaje.get('numeroComprobante').setValue(this.establecerCerosIzq(this.formularioViajePeaje.get('numeroComprobante'), '0000000', -8));
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePeaje.get('fecha').setValue(res.json());
    })
  }
  //Agrega datos a la tabla de peajes
  public agregarPeaje(): void {
    if (!this.formularioViajePeaje.value.importe) {
      this.formularioViajePeaje.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
      this.formularioViajePeaje.get('importe').setValue(this.appService.establecerDecimales(this.formularioViajePeaje.value.importe, 2));
    }
    this.formularioViajePeaje.get('tipoComprobante').setValue({ id: 17 });
    this.formularioViajePeaje.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formularioViajePeaje.value.viaje = { id: this.ID_VIAJE };
    this.servicio.agregar(this.formularioViajePeaje.value).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto();
          document.getElementById('idProveedorP').focus();
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
  //Modifica los datos del Peaje
  public modificarPeaje(): void {
    if (!this.formularioViajePeaje.value.importe) {
      this.formularioViajePeaje.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
    }
    let usuarioMod = this.appService.getUsuario();
    this.formularioViajePeaje.value.usuarioMod = usuarioMod;
    this.formularioViajePeaje.value.viaje = { id: this.ID_VIAJE };
    this.servicio.actualizar(this.formularioViajePeaje.value).subscribe(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto();
          this.btnPeaje = true;
          document.getElementById('idProveedor').focus();
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
  //Modifica un Peaje de la tabla por indice
  public modPeaje(indice): void {
    this.indicePeaje = indice;
    this.btnPeaje = false;
    this.formularioViajePeaje.patchValue(this.listaCompleta.data[indice]);
    this.formularioViajePeaje.get('importe').setValue(this.appService.establecerDecimales(this.formularioViajePeaje.value.importe, 2));
    this.establecerCerosIzq(this.formularioViajePeaje.get('puntoVenta'), '0000', -5);
    this.establecerCerosIzq(this.formularioViajePeaje.get('numeroComprobante'), '0000000', -8);
  }
  //Elimina un peaje de la tabla por indice
  public eliminarPeaje(elemento): void {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '60%',
      maxWidth: '60%',
      data: {
        tema: this.appService.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loaderService.show();
        this.servicio.eliminar(elemento.id).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            this.toastr.error("No se pudo eliminar el registro");
            this.loaderService.hide();
          }
        );
      }
      document.getElementById('idProveedorP').focus();
    });
  }
  //Calcula el total de combustible y el total de urea
  private calcularImporteTotal(): void {
    let importeTotal = 0;
    this.listaCompleta.data.forEach(item => {
      importeTotal += Number(item.importe);
    })
    this.formularioViajePeaje.get('importeTotal').setValue(importeTotal.toFixed(2));
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero cuando el elemento es un numerico
  public establecerCerosIzqTabla(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value.toString()).slice(cantidad));
  }
  //Define como se muestran los ceros a la izquierda en tablas
  public mostrarCeros(elemento, string, cantidad) {
    return elemento ? (string + elemento).slice(cantidad) : elemento;
  }
  //Establece la lista de efectivos
  public establecerLista(lista, idViaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto();
    this.formularioViajePeaje.get('viaje').setValue({id: idViaje});
    this.establecerIdViaje(idViaje);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        this.establecerValoresPorDefecto();
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
    this.formularioViajePeaje.reset();
    this.indicePeaje = null;
    this.btnPeaje = true;
    this.formularioViajePeaje.get('viaje').setValue({id: this.ID_VIAJE});
    this.establecerValoresPorDefecto();
    this.calcularImporteTotal();
    document.getElementById('idProveedorP').focus();
  }
  //Finalizar
  public finalizar() {
    this.formularioViajePeaje.reset();
    this.indicePeaje = null;
    this.btnPeaje = true;
    this.establecerValoresPorDefecto();
    this.vaciarListas();
  }
  //Establece selects solo lectura
  private establecerSelectsSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajePeaje.get('letra').disable();
    } else {
      this.formularioViajePeaje.get('letra').enable();
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
    setTimeout(function () {
      document.getElementById('idProveedorP').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formularioViajePeaje.reset();
    this.formularioViajePeaje.value.viaje = this.ID_VIAJE;
    this.indicePeaje = null;
    this.btnPeaje = true;
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
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