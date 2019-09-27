import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ViajeTramo } from 'src/app/modelos/viajeTramo';
import { LoaderService } from 'src/app/servicios/loader.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-viaje-remito-gs',
  templateUrl: './viaje-remito-gs.component.html',
  styleUrls: ['./viaje-remito-gs.component.css']
})
export class ViajeRemitoGSComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Definje el indiceSeleccionado
  public indiceSeleccionado: Number = null;
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito: FormGroup;
  //Define el viaje Tramo
  public formularioViajeTramo: FormGroup;
  //Define una lista de remitos
  public remitos: FormArray;
  //Define la lista de tramos
  public listaTramos: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
  public seleccionCheck = new SelectionModel(true, []);
  //Define el titulo de la tabla de remitos
  public tipoRemitos: boolean = false;
  //Defiene la lista de sucursales
  public sucursales: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['check', 'fecha', 'tipoComprobante', 'puntoVenta', 'numeroComprobante', 'remitente', 'destinatario'];
  //Define la matSort
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  //Constructor
  constructor(private viajeRemito: ViajeRemito, private ViajeTramo: ViajeTramo, private viajeRemitoServicio: ViajeRemitoService,
    private appService: AppService, private sucursalServicio: SucursalService, private loaderService: LoaderService,
    private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje remito
    this.formularioViajeRemito = this.viajeRemito.formulario;
    //Establece el formulario viaje tramo
    this.formularioViajeTramo = this.ViajeTramo.formulario;
    //Obtiene la lista de sucursales
    this.listarSucursales();
  }
  public estanTodosSeleccionados() {
    const numSelected = this.seleccionCheck.selected.length;
    const numRows = this.listaCompleta.data.length;
    return numSelected === numRows;
  }
  public seleccionarTodos() {
    if (this.estanTodosSeleccionados()) {
      this.seleccionCheck.clear();
      this.listaCompleta.data.forEach(elemento => elemento.estaPendiente = true);
    } else {
      this.listaCompleta.data.forEach(elemento => {
        elemento.estaPendiente = false;
        this.seleccionCheck.select(elemento);
      });
    }
  }
  //Al seleccionar o deseleccionar un checkbox, establece estaPendiente
  public cambioCheckbox(event, elemento) {
    elemento.estaPendiente = !event.checked;
  }
  public verPendientes() {
    if (this.tipoRemitos) {
      this.tipoRemitos = false;
      this.listarPendientesPorFiltro();
    }
  }
  public verAsignados() {
    if (!this.tipoRemitos) {
      this.tipoRemitos = true;
      this.listarAsignadosPorFiltro();
    }
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(res => {
      this.sucursales = res.json();
    });
  }
  //Establece la lista de tramos (se establece de componente padre)
  public establecerTramos(tramos) {
    this.listaTramos = tramos;
  }
  //Obtiene la lista de remitos pendiente por filtro (sucursal, sucursal destino y numero de camion)
  public listarPendientesPorFiltro(): void {
    this.loaderService.show();
    this.reestablecerFormulario();
    let sucursal = this.appService.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    let tramo = this.formularioViajeRemito.get('tramo').value;
    if(sucursal && sucursalDestino && numeroCamion && tramo) {
      this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(
        res => {
          let listaRemitosPendientes = res.json();
          if (listaRemitosPendientes.length > 0) {
            for (var i = 0; i < listaRemitosPendientes.length; i++) {
              listaRemitosPendientes[i].viajeTramo = tramo;
              this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
              this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosPendientes[i]));
            }
            this.establecerRemitos(this.remitos);
          } 
          // else {
          //   this.toastr.warning("Remitos inexistentes");
          // }
          this.loaderService.hide();
        },
        err => {
          this.loaderService.hide();
        }
      );
    } else {
      this.loaderService.hide();
    }
  }
  //Obtiene la lista de remitos pendiente por filtro (sucursal, sucursal destino y numero de camion)
  public listarAsignadosPorFiltro(): void {
    this.loaderService.show();
    this.reestablecerFormulario();
    let sucursal = this.appService.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    let tramo = this.formularioViajeRemito.get('tramo').value;
    if (sucursal && sucursalDestino && numeroCamion) {
      this.viajeRemitoServicio.listarAsignadosPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(
        res => {
          let listaRemitosAsignados = res.json();
          if (listaRemitosAsignados.length > 0) {
            for (var i = 0; i < listaRemitosAsignados.length; i++) {
              listaRemitosAsignados[i].viajeTramo = tramo;
              this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
              this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosAsignados[i]));
            }
            this.establecerRemitos(this.remitos);
          } 
          // else {
          //   this.toastr.warning("Remitos inexistentes");
          // }
          this.loaderService.hide();
        },
        err => {
          this.loaderService.hide();
        }
      );
    } else {
      this.loaderService.hide();
    }
  }
  //Establece la lista de remitos a la tabla
  private establecerRemitos(lista) {
    this.listaCompleta = new MatTableDataSource(lista.value);
    this.listaCompleta.sort = this.sort;
  }
  //Asigna remitos a tramo
  public asignarRemitos(): void {
    this.loaderService.show();
    let tramo = this.formularioViajeRemito.get('tramo').value;
    this.viajeRemitoServicio.asignar(this.listaCompleta.data, tramo.id).then(
      res => {
        this.listarPendientesPorFiltro();
        document.getElementById('idTramoRG').focus();
        this.toastr.success("Registros asignados con éxito");
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Quita remitos a tramo
  public quitarRemitos(): void {
    this.loaderService.show();
    let tramo = this.formularioViajeRemito.get('tramo').value;
    this.viajeRemitoServicio.quitar(this.listaCompleta.data, tramo.id).then(
      res => {
        this.listarAsignadosPorFiltro();
        document.getElementById('idTramoRG').focus();
        this.toastr.success("Registros quitados con éxito");
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Reestablece el formulario
  public reestablecerFormularioGS(indice): void {
    this.formularioViajeRemito.reset();
    this.listaCompleta = new MatTableDataSource([]);
    if (this.remitos) {
      while (this.remitos.length != 0) {
        this.remitos.removeAt(0);
      }
    }
    this.indiceSeleccionado = indice;
  }
  //Reestablece el formulario
  private reestablecerFormulario(): void {
    this.listaCompleta = new MatTableDataSource([]);
    if (this.remitos) {
      while (this.remitos.length != 0) {
        this.remitos.removeAt(0);
      }
    }
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit();
  }
  //Establece la lista de tramos cargada en ViajeTramo
  public establecerListaTramos(tramos): void {
    this.listaTramos = tramos;
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    // setTimeout(function () {
    //   document.getElementById('idTramoRG').focus();
    // }, 100);
  }
  //Define como se muestran los ceros a la izquierda en tablas
  public mostrarCeros(elemento, string, cantidad) {
    return elemento ? (string + elemento).slice(cantidad) : elemento;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Establece control para lista remitos con checkbox
  get controlRemitos() {
    return <FormArray>this.formularioViajeRemito.get('remitos');
  }
}