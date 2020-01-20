import { Component, OnInit } from '@angular/core';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  public tipoConceptoSueldo: FormControl = new FormControl();
  public afipGrupoConcepto: FormControl = new FormControl();
  public codigoAfip: FormControl = new FormControl();
  public formulario: FormGroup;
  public itemTiposConceptosSueldos: Array<any> = [];
  public itemGruposConceptos: Array<any> = [];
  public itemAfipConceptosSueldo: Array<any> = [];
  public itemUnidadesMedidasSueldos: Array<any> = [];
  public sonRepetibles : Array<any> = []
  //Define el constructor de la clase
  constructor(private conceptosService: ConceptosService, private tipoConceptoSueldoService: TipoConceptoSueldoService, private afipConceptoSueldoGrupoService: AfipConceptoSueldoGrupoService, private afipConceptoSueldoService: AfipConceptoSueldoService, private unidadMedidaSueldoService: UnidadMedidaSueldoService) { 
    this.formulario = new FormGroup({
      afipConceptoSueldo: new FormControl(),
      codigoEmpleador: new FormControl(),
      nombre: new FormControl(),
      unidadMedidaSueldo: new FormControl(),
      ingresaCantidad: new FormControl(),
      ingresaValorUnitario: new FormControl(),
      ingresaImporte: new FormControl(),
      esRepetible: new FormControl(),
      imprimeValorUnitario: new FormControl(),
    })
  }
  //Al inicializarse el componente se ejecuta el codigo de OnInit
  ngOnInit() {
    this.listarTipoConceptoSueldo();
  }
  public listarTipoConceptoSueldo(){
    this.tipoConceptoSueldoService.listar().subscribe(
      res=>{
        this.itemTiposConceptosSueldos = res.json();
      },
      err=>{
        console.log('err');
      }
    )
  }
  public listarAfipConceptoSueldoGrupo(){
    let id = this.tipoConceptoSueldo.value.id;
    this.afipConceptoSueldoGrupoService.listarPorTipoConceptoSueldo(id).subscribe(
      res=>{
        this.itemGruposConceptos = res.json();
      },
      err=>{
        console.log('err');
      }
    )
  }
  public listarAfipConceptoSueldo(){
    let id = this.afipGrupoConcepto.value.id;
    this.afipConceptoSueldoService.listarPorAfipConceptoSueldoGrupo(id).subscribe(
      res=>{
        this.itemAfipConceptosSueldo = res.json();
      },
      err=>{

      }
    )
  }
  public listarUnidadMedidaSueldo(){
    this.unidadMedidaSueldoService.listar().subscribe(
      res=>{
        this.itemUnidadesMedidasSueldos = res.json();
      },
      err=>{
        console.log('err');
      }
    )
  }
  public seleccionarCodigoAfip(){
    let codigo = this.formulario.get('afipConceptoSueldo').value.codigoAfip;
    this.codigoAfip.setValue(codigo); 
  }

  public liquidacion(){
  }

  public subSistema(){

  }

  public formula(){

  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}//this.formulario.el componente.disable para el readyonly