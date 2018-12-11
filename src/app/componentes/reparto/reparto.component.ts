import { Component, OnInit } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css']
})
export class RepartoComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Constructor
  constructor(private repartoModelo: Reparto) { }

  ngOnInit() {
    //Establece el formulario
    this.formulario = this.repartoModelo.formulario;
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('tipoViaje').setValue(1);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
}
