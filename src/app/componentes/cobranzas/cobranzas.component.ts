import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  public formulario:FormGroup;
  public columnas:string[] = ['FECHA_EMISION','FECHA_VTO_PAGO','TIPO','PUNTO_VENTA','LETRA','NUMERO','SALDO','IMPORTE','IMPORTE_COBRO']
  constructor() { 
    this.formulario = new FormGroup({
      cliente: new FormControl(),
      integracion: new FormControl,
      pendienteDeIntegrar: new FormControl,
      retenciones: new FormControl,
      items: new FormControl,
      totalImporteSeleccionado: new FormControl,
      items2: new FormControl,
      totalDeuda: new FormControl,
      totalIntegrado: new FormControl
    })
  }

  ngOnInit() {
  }

  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  // public manejarEvento(keycode) {
  //   let indice = this.indiceSeleccionado;
  //   if (keycode == 113) {
  //     if (indice < this.pestanias.length) {
  //       this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
  //     } else {
  //       this.seleccionarPestania(1, this.pestanias[0].nombre);
  //     }
  //   }
  // }
}
