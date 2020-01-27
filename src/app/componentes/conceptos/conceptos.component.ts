import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

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
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
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
  public resultadosTiposConceptos: Array <any> = [];
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania activa
  public activeLink: any = null;
  //Defiene el render
  public render: boolean = false;
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'CODIGOEMPLEADOR', 'NOMBRE','TIPOCONCEPTO','EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el constructor de la clase
  constructor(private conceptosService: ConceptosService, private tipoConceptoSueldoService: TipoConceptoSueldoService, private loaderService: LoaderService, private toastrService: ToastrService,
    private afipConceptoSueldoGrupoService: AfipConceptoSueldoGrupoService, private afipConceptoSueldoService: AfipConceptoSueldoService, private unidadMedidaSueldoService: UnidadMedidaSueldoService, private appService: AppService) {
    this.formulario = new FormGroup({
      //Se definen los FormControl del Formulario
      id: new FormControl(),
      version: new FormControl(),
      nombre: new FormControl(),
      afipConceptoSueldo: new FormControl(),
      codigoEmpleador: new FormControl(),
      unidadMedidaSueldo: new FormControl(),
      ingresaCantidad: new FormControl(),
      ingresaValorUnitario: new FormControl(),
      ingresaImporte: new FormControl(),
      esRepetible: new FormControl(),
      imprimeValorUnitario: new FormControl(),
    })
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(nombre => {
      if (typeof nombre == 'string') {
        nombre = nombre.trim();
        if (nombre == '*' || nombre.length > 0) {
          this.loaderService.show();
          this.conceptosService.listarPorNombre(nombre).subscribe(response => {
            this.resultados = response.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Al inicializarse el componente se ejecuta el codigo de OnInit
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    this.esRepetible();
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
  //Pone al campo en ready Only y con valor "true" 
  public esRepetible(){
    this.formulario.get('esRepetible').setValue(true);
    this.formulario.get('esRepetible').disable();
  }

  //LLama a la funcion de listar Afip Concepto Sueldo Grupo y a funcion Obtener el ultimo código Empleador 
  public listarACSGyobtenerUCE(){
    this.listarAfipConceptoSueldoGrupo(null);
    this.obtieneUltimoCodigoEmpleador();
  }
  //Lista el selec de Afip Grupo Concepto
  private listarAfipConceptoSueldoGrupo(afipConceptoSueldoGrupo) {
    let id = this.tipoConceptoSueldo.value.id;
    this.afipConceptoSueldoGrupoService.listarPorTipoConceptoSueldo(id).subscribe(
      res => {
        this.gruposConceptos = res.json();
        if (afipConceptoSueldoGrupo != null) {
          this.afipGrupoConcepto.setValue(afipConceptoSueldoGrupo);
        }
      },
      err => {
      }
    )
  }
  //Obtiene el ultimo codigo empleador
  public obtieneUltimoCodigoEmpleador(){
    this.conceptosService.obtenerUltimoCodigoEmpleador().subscribe(
      res=>{
        console.log(res.text())
        this.formulario.get('codigoEmpleador').setValue(res.text());
      },
      err=>{
      }
    )
  }
  //Lista el select de Afip Concepto
  public listarAfipConceptoSueldo(afipConceptoSueldo) {
    let id = this.afipGrupoConcepto.value.id;
    this.afipConceptoSueldoService.listarPorAfipConceptoSueldoGrupo(id).subscribe(
      res => {
        this.afipConceptosSueldo = res.json();
        if (afipConceptoSueldo != null) {
          this.formulario.get('afipConceptoSueldo').setValue(afipConceptoSueldo);
        }
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
  //Obtiene el listado de registros por filtro
  public listarPorTipoConcepto() {
    this.loaderService.show();
    let tipoConcepto = this.tipoConceptoSueldo.value;
    let id = tipoConcepto != '0' ? tipoConcepto.id:0;
    this.conceptosService.listarPorTipoConcepto(id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
        if(this.listaCompleta.data.length == 0) {
          this.toastrService.warning("Sin registros para mostrar");
        }
      },
      err => {
        this.toastrService.error(err.json().message);
        this.loaderService.hide();
      });
  }
  public liquidacion() {
  }
  public subSistema() {
  }
  public formula() {
  }
  //Agrega un registro
  public agregar() {
    console.log(this.formulario.value);
    this.loaderService.show();
    this.conceptosService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario();
          document.getElementById('idTipoConceptoSueldo').focus();
          this.toastrService.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idTipoConceptoSueldo").classList.add('is-invalid');
          document.getElementById("idTipoConceptoSueldo").focus();
          this.toastrService.error(respuesta.mensaje);
        } else {
          this.toastrService.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  public actualizar() {
    this.loaderService.show();
    this.conceptosService.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastrService.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastrService.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    )
  }
  public eliminar() {
    this.conceptosService.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastrService.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastrService.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    )
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerElemento() {
    let elemento = this.autocompletado.value;
    console.log(elemento);
    this.formulario.setValue(this.autocompletado.value);
    this.tipoConceptoSueldo.setValue(elemento.afipConceptoSueldo.afipConceptoSueldoGrupo.tipoConceptoSueldo);
    this.listarAfipConceptoSueldoGrupo(elemento.afipConceptoSueldo.afipConceptoSueldoGrupo);
    
    this.codigoAfip.setValue(elemento.afipConceptoSueldo.codigoAfip);
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
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    switch (id) {
      case 1:
        this.camposSoloLectura(false);
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoConceptoSueldo');
        break;
      case 2:
        this.camposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.camposSoloLectura(false);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.camposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        setTimeout(function () {
          document.getElementById('idTipoConceptoSueldo').focus();
        }, 20);
        break;
      default:
        break;
    }
  }
  //Vacia la lista de localidades
  public vaciarLista(): void {
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosTiposConceptos = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario() {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    this.tipoConceptoSueldo.reset();
    this.afipGrupoConcepto.reset();
    this.codigoAfip.reset();
    this.esRepetible();
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
  //Establecer los campos de solo lectura
  public camposSoloLectura(opcion): void {
    if (opcion){
      this.formulario.get('afipConceptoSueldo').disable();
      this.formulario.get('nombre').disable()
      this.formulario.get('codigoEmpleador').disable();
      this.formulario.get('unidadMedidaSueldo').disable();
      this.formulario.get('ingresaCantidad').disable();
      this.formulario.get('ingresaValorUnitario').disable();
      this.formulario.get('ingresaImporte').disable();
      this.formulario.get('esRepetible').disable();
      this.formulario.get('imprimeValorUnitario').disable();
      this.tipoConceptoSueldo.disable();
      this.afipGrupoConcepto.disable();
      this.codigoAfip.disable();
    } else {
      this.formulario.get('afipConceptoSueldo').enable();
      this.formulario.get('nombre').enable()
      this.formulario.get('codigoEmpleador').enable();
      this.formulario.get('unidadMedidaSueldo').enable();
      this.formulario.get('ingresaCantidad').enable();
      this.formulario.get('ingresaValorUnitario').enable();
      this.formulario.get('ingresaImporte').enable();
      this.formulario.get('imprimeValorUnitario').enable();
      this.tipoConceptoSueldo.enable();
      this.afipGrupoConcepto.enable();
      this.codigoAfip.enable();
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}