import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MonedaCotizacion } from 'src/app/modelos/moneda-cotizacion';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
@Component({
  selector: 'app-moneda-cotizacion',
  templateUrl: './moneda-cotizacion.component.html',
  styleUrls: ['./moneda-cotizacion.component.css']
})
export class MonedaCotizacionComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: Array<any> = [];
  //Define la lista completa de Monedas
  public listaMonedas: Array<any> = [];
  //Define la lista completa de Monedas
  public listaMonedaCotizacion: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id:FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  // public compereFn:any;
  //Constructor
  constructor(private monedaCotizacion: MonedaCotizacion, private monedaCotizacionServicio: MonedaCotizacionService, private monedaServicio: MonedaService,private subopcionPestaniaService: SubopcionPestaniaService, private toastr: ToastrService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(1, 205)
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
          console.log(res.json());
        },
        err => {
          console.log(err);
        }
      );
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.monedaCotizacionServicio.listarPorMoneda(data).subscribe(res => {
          this.resultados = res.json();
          console.log(res.json());
        })
      }
    });
  }
  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.monedaCotizacion.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Lista todos los registros de Monedas Cotizacion
    this.listar();
    //Lista las Monedas
    this.listarMonedas();
  }
  
  //Obtiene el listado de registros
  private listar() {
    this.monedaCotizacionServicio.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de Monedas
  private listarMonedas() {
    this.monedaServicio.listar().subscribe(
      res => {
        this.listaMonedas = res.json();
      },
      err => {
        console.log(err);
      }
    );
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
  public seleccionarPestania(id, nombre, opcion) {
    this.formulario.reset();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        // this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      default:
        break;
    }
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('fechaCotizacion').enable();
      this.formulario.get('valor').enable();
    } else {
      this.formulario.get('fechaCotizacion').disable();
      this.formulario.get('valor').disable();
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregar();
        break;
      // case 3:
      //   this.actualizar();
      //   break;
      // case 4:
      //   this.eliminar();
      //   break;
      default:
        break;
    }
  }
  //Agrega un registro
  private agregar() {
    this.monedaCotizacionServicio.agregar(this.formulario.value).subscribe(
      res=>{
        
      },
      err=>{
        this.toastr.error(err.mensaje);
      }
    );
  }
  //Carga la tabla con los datos de la moneda seleccionada
  public cambioSeleccionado(){
    console.log(this.formulario.value);
    this.monedaCotizacionServicio.listarPorMoneda(this.formulario.get('moneda').value.id).subscribe(
      res=>{
        this.listaMonedaCotizacion=res.json();
        console.log(res.json());
      },
      err=>{

      }
    );
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    var elemento= this.autocompletado.value;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
}