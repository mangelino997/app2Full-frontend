import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConceptosService } from 'src/app/servicios/conceptos.service';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  public tipoConcepto: FormControl = new FormControl();
  public codigoAfip: FormControl = new FormControl();
  public formulario: FormGroup;
  public tiposConceptos: Array<any> = [];
  public unidadesMedidasSueldos: Array<any> = [];
  public sonRepetibles : Array<any> = []
  //Define el constructor de la clase
  constructor(private conceptosService: ConceptosService) { 
    this.formulario = new FormGroup({
      codigoEmpleador: new FormControl(),
      unidadMedidaSueldo: new FormControl(),
      esRepetible: new FormControl(),
    })
  }
  //Al inicializarse el componente se ejecuta el codigo de OnInit
  ngOnInit() {
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}//this.formulario.el componente.disable para el readyonly