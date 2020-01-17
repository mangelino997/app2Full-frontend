import { Component, OnInit } from '@angular/core';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania activa
  public activeLink: any = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  public tiposConceptos: Array <any> = [];
  public formulario: FormGroup;

  //Define el constructor de la clase
  constructor(private conceptosService: ConceptosService, private tipoConceptoSueldoService: TipoConceptoSueldoService) {
    this.formulario = new FormGroup({
      conceptoSueldo: new FormControl(),
      codigoAfip: new FormControl(),
      codigoEmpleador: new FormControl(),
      unidadMedida: new FormControl(),
      repetible: new FormControl(),
      afipGrupoConcepto: new FormControl(),
      ConceptoAfip: new FormControl(),
      descripcion: new FormControl(),
      cantidad: new FormControl(),
      valorUnitario: new FormControl(),
      importe: new FormControl(),
      imprime: new FormControl(),
    })
  }
  //Al inicializarse el componente se ejecuta el codigo de OnInit
  ngOnInit() {
    this.listarTipoConceptoSueldo()
  }
  public listarTipoConceptoSueldo(){
    this.tipoConceptoSueldoService.listar().subscribe(
      res=>{
        this.tiposConceptos = res.json();
        console.log(res.json());      
      },
      err=>{
        console.log('err');
      }
    )
  }
  public liquidacion(){
  }

  public subSistema(){

  }

  public formula(){

  }
}