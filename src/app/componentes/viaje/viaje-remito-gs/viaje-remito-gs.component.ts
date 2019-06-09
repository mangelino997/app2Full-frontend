import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-viaje-remito-gs',
  templateUrl: './viaje-remito-gs.component.html',
  styleUrls: ['./viaje-remito-gs.component.css']
})
export class ViajeRemitoGSComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje remito para validaciones de campos
  public formularioViajeRemito: FormGroup;
  //Define una lista de remitos
  public remitos: FormArray;
  //Define la lista de tramos
  public listaTramos: Array<any> = [];
  //Defiene la lista de sucursales
  public sucursales: Array<any> = [];
  //Constructor
  constructor(private viajeRemito: ViajeRemito, private viajeRemitoServicio: ViajeRemitoService,
    private appService: AppService, private sucursalServicio: SucursalService,
    private toast: ToastrService) { }
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
    let sucursal = this.appService.getUsuario().sucursal;
    let sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
    let numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
    let viajePropio = this.formularioViajeRemito.get('tramo').value;
    this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(res => {
      let listaRemitosPendientes = res.json();
      for (var i = 0; i < listaRemitosPendientes.length; i++) {
        listaRemitosPendientes[i].viajePropioTramo = viajePropio;
        this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
        this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosPendientes[i]));
      }
    });
    // if (tipo) {
    //   this.viajeRemitoServicio.listarAsignadosPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion, viajePropio.id).subscribe(res => {
    //     let listaRemitosAsignados = res.json();
    //     for (var i = 0; i < listaRemitosAsignados.length; i++) {
    //       listaRemitosAsignados[i].viajePropioTramo = this.formularioViajeRemito.get('tramo').value;
    //       this.remitos = this.formularioViajeRemito.get('remitos') as FormArray;
    //       this.remitos.push(this.viajeRemito.crearRemitos(listaRemitosAsignados[i]));
    //     }
    //   })
    // } else {
      
    // }
  }
  //Asigna o Quita remitos de tramo
  public asignarRemitos(): void {
    this.viajeRemitoServicio.asignar(this.formularioViajeRemito.value.remitos).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario();
        document.getElementById('idTramoRG').focus();
        this.toast.success(respuesta.mensaje);
      },
      err => {
        let respuesta = err.json();
        this.toast.error(respuesta.mensaje);
      }
    );
    // if (opcion) {
    //   this.viajeRemitoServicio.quitar(this.formularioViajeRemito.value.remitos).subscribe(
    //     res => {
    //       let respuesta = res.json();
    //       this.reestablecerFormulario();
    //       document.getElementById('idTipoRemitoRG').focus();
    //       this.toast.success(respuesta.mensaje);
    //     },
    //     err => {
    //       let respuesta = err.json();
    //       this.toast.error(respuesta.mensaje);
    //     }
    //   )
    // } else {
      
    // }
  }
  //Reestablece el formulario
  private reestablecerFormulario(): void {
    // this.formularioViajeRemito.get('tipoRemito').reset();
    // this.formularioViajeRemito.get('tramo').reset();
    // this.formularioViajeRemito.get('numeroCamion').reset();
    // this.formularioViajeRemito.get('sucursalDestino').reset();
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
    setTimeout(function() {
      document.getElementById('idTramoRG').focus();
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