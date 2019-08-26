import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
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
  //Defiene la lista de sucursales
  public sucursales: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['check', 'fecha', 'tipoComprobante', 'puntoVenta', 'numeroComprobante', 'remitente', 'destinatario'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private viajeRemito: ViajeRemito, private ViajeTramo: ViajeTramo, private viajeRemitoServicio: ViajeRemitoService, private viajeTramoService: ViajeTramoService,
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
    if(this.estanTodosSeleccionados()) {
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
  public verLista() {
    console.log(this.listaCompleta);
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
  public listarRemitosPorFiltro(): void {
    let sucursal = this.appService.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    let tramo = this.formularioViajeRemito.get('tramo').value;
    this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(res => {
      let listaRemitosPendientes = res.json();
      for (var i = 0; i < listaRemitosPendientes.length; i++) {
        listaRemitosPendientes[i].viajeTramo = tramo;
        this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
        this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosPendientes[i]));
      }
      this.establecerRemitos(this.remitos);
    });
  }
  //Establece la lista de remitos a la tabla
  private establecerRemitos(lista) {
    this.listaCompleta = new MatTableDataSource(lista.value);
    this.listaCompleta.sort = this.sort;
    console.log(this.listaCompleta);
  }
  //Asigna o Quita remitos de tramo
  public asignarRemitos(): void {
    this.viajeRemitoServicio.asignar(this.formularioViajeRemito.value.remitos, 1).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario();
        document.getElementById('idTramoRG').focus();
        this.toastr.success(respuesta.mensaje);
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Reestablece el formulario
  private reestablecerFormulario(): void {
    this.formularioViajeRemito.reset();
    while (this.remitos.length != 0) {
      this.remitos.removeAt(0);
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
    setTimeout(function () {
      // document.getElementById('idTramoRG').focus();
    }, 100);
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