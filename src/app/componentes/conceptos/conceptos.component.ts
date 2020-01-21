import { Component, OnInit } from '@angular/core';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define el FormControl de Tipo de Concepto
  public tipoConceptoSueldo: FormControl = new FormControl();
  //Define el FormControl de Afip Grupo Concepto
  public afipGrupoConcepto: FormControl = new FormControl();
  //Define el FormControl de codigo Afip
  public codigoAfip: FormControl = new FormControl();
  //Define el Formulario
  public formulario: FormGroup;
  //Define la lista de Tipos de Conceptos
  public tiposConceptosSueldos: Array<any> = [];
  //Define la lista de Afip Grupo Concepto
  public gruposConceptos: Array<any> = [];
  //Define la lista de Afip Concepto
  public afipConceptosSueldo: Array<any> = [];
  //Define la lista de Unidades Medidas Sueldos
  public unidadesMedidasSueldos: Array<any> = [];
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de tipos de docs
  public resultadosDocumentos: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania activa
  public activeLink: any = null;
  //Defiene el render
  public render: boolean = false;
  
  //Define el constructor de la clase
  constructor(private conceptosService: ConceptosService, private tipoConceptoSueldoService: TipoConceptoSueldoService, 
    private afipConceptoSueldoGrupoService: AfipConceptoSueldoGrupoService, private afipConceptoSueldoService: AfipConceptoSueldoService, private unidadMedidaSueldoService: UnidadMedidaSueldoService, private appService: AppService) {
    this.formulario = new FormGroup({
      //Se definen los FormControl del Formulario
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
 /* Obtiene todos los listados */
 this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
 //Establece los valores de la primera pestania activa
 this.seleccionarPestania(1, 'Agregar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.conceptosService.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        this.tiposConceptosSueldos = respuesta.tiposConceptosSueldos;
        this.unidadesMedidasSueldos = respuesta.unidadesMedidasSueldos;
        //Establece demas datos necesarios
        this.render = false;
      },
      err => {
        this.render = false;
      }
    )
  }
  //Lista el selec de Afip Grupo Concepto
  public listarAfipConceptoSueldoGrupo() {
    let id = this.tipoConceptoSueldo.value.id;
    this.afipConceptoSueldoGrupoService.listarPorTipoConceptoSueldo(id).subscribe(
      res => {
        this.gruposConceptos = res.json();
      },
      err => {
        console.log('err');
      }
    )
  }
  //Lista el select de Afip Concepto
  public listarAfipConceptoSueldo() {
    let id = this.afipGrupoConcepto.value.id;
    this.afipConceptoSueldoService.listarPorAfipConceptoSueldoGrupo(id).subscribe(
      res => {
        this.afipConceptosSueldo = res.json();
      },
      err => {

      }
    )
  }
  //Completa el campo Código afip a partir de lo seleccionado en Afip Concepto
  public seleccionarCodigoAfip() {
    let codigo = this.formulario.get('afipConceptoSueldo').value.codigoAfip;
    this.codigoAfip.setValue(codigo);
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregar();
        break;
      case 3:
        this.actualizar();
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  public liquidacion() {
  }
  public subSistema() {
  }
  public formula() {
  }
  public agregar(){
  }
  public actualizar(){
  }
  public eliminar(){
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.patchValue(elemento);
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    /* Limpia el formulario para no mostrar valores en campos cuando 
      la pestaña es != 1 */
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.soloLectura ?
      this.formulario.get('tipoDocumento').disable() : this.formulario.get('tipoDocumento').enable();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}