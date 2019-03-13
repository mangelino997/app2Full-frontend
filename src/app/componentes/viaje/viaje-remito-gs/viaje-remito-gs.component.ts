import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { AppComponent } from 'src/app/app.component';
import { SucursalService } from 'src/app/servicios/sucursal.service';

@Component({
  selector: 'app-viaje-remito-gs',
  templateUrl: './viaje-remito-gs.component.html',
  styleUrls: ['./viaje-remito-gs.component.css']
})
export class ViajeRemitoGSComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito:FormGroup;
  //Define una lista de remitos
  public remitos:FormArray;
  //Define la lista de remitos pendientes
  public listaRemitosPendientes:Array<any> = [];
  //Define la lista de tramos
  public listaTramos:Array<any> = [];
  //Defiene la lista de sucursales
  public sucursales:Array<any> = [];
  //Constructor
  constructor(private viajeRemito: ViajeRemito, private viajeRemitoServicio: ViajeRemitoService,
    private appComponent: AppComponent, private sucursalServicio: SucursalService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje remito
    this.formularioViajeRemito = this.viajeRemito.formulario;
    //Obtiene la lista de sucursales
    this.listarSucursales();
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(res => {
      this.sucursales = res.json();
    });
  }
  //Obtiene la lista de remitos pendiente por filtro (sucursal, sucursal destino y numero de camion)
  public listarRemitosPorFiltro(): void {
    let tipo = this.formularioViajeRemito.get('tipoRemito').value;
    let sucursal = this.appComponent.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    if(tipo) {

    } else {
      this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(res => {
        let listaRemitosPendientes = res.json();
        for (var i = 0; i < listaRemitosPendientes.length; i++) {
          listaRemitosPendientes[i].viajePropioTramo = this.formularioViajeRemito.get('tramo').value;
          this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
          this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosPendientes[i]));
        }
      });
    }
  }
  //Asigna los remitos a un tramo
  public asignarRemitos(): void {
    console.log(this.formularioViajeRemito.value.remitos);
  }
  //Envia la lista de tramos a Viaje
  public enviarDatos(): void {
    this.dataEvent.emit();
  }
  //Establece la lista de tramos cargada en ViajeTramo
  public establecerListaTramos(tramos): void {
    this.listaTramos = tramos;
  }
  //Define como se muestran los ceros a la izquierda en tablas
  public mostrarCeros(elemento, string, cantidad) {
    return elemento ? (string + elemento).slice(cantidad) : elemento;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
}
