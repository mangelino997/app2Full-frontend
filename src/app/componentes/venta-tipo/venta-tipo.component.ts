import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipConceptoService } from 'src/app/servicios/afip-concepto.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { VentaTipoItem } from 'src/app/modelos/venta-tipo-item';
@Component({
  selector: 'app-venta-tipo',
  templateUrl: './venta-tipo.component.html',
  styleUrls: ['./venta-tipo.component.css']
})
export class VentaTipoComponent implements OnInit {
//Define la pestania activa
public activeLink:any = null;
//Define el indice seleccionado de pestania
public indiceSeleccionado:number = null;
//Define la pestania actual seleccionada
public pestaniaActual:string = null;
//Define si mostrar el autocompletado
public mostrarAutocompletado:boolean = null;
//Define si el campo es de solo lectura
public soloLectura:boolean = false;
//Define si mostrar el boton
public mostrarBoton:boolean = null;
//Define la lista de pestanias
public pestanias:Array<any> = [];
//Define un formulario para validaciones de campos
public formulario:FormGroup;
//Define la lista completa de registros
public listaCompleta:Array<any> = [];
//Define la lista completa de tipos de comprobantes
public tiposComprobantes:Array<any> = [];
//Define la lista completa de Afip Conceptos
public afipConceptos:Array<any> = [];
//Define el autocompletado
public autocompletado:FormControl = new FormControl();
//Define empresa para las busquedas
public empresaBusqueda:FormControl = new FormControl();
//Define la lista de resultados de busqueda
public resultados:Array<any> = [];
//Define la lista de resultados de busqueda companias seguros
public resultadosCompaniasSeguros:Array<any> = [];
//Defien la lista de empresas
public empresas:Array<any> = [];
// public compereFn:any;
//Constructor

  constructor(private afipConceptosServicio: AfipConceptoService, private servicio: VentaTipoItemService, private ventaConcepto: VentaTipoItem, private appComponent: AppComponent, 
    private subopcionPestaniaService: SubopcionPestaniaService, private tipoComprobanteServicio: TipoComprobanteService, private toastr: ToastrService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
      },
      err => {
      }
    );
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
          console.log(res);
        })
      }
    })
   }

  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.ventaConcepto.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista completa de registros
    this.listar(); 
    //Obtiene la lista completa de tipos de Comprobantes
    this.listarTiposComprobantes();
    //Obtiene los conceptos de Afip
    this.listarAfipConcepto();
  }
  //Obtiene el listado de registros
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene la lista completa de tipos de Comprobantes
  private listarTiposComprobantes() {
    this.tipoComprobanteServicio.listar().subscribe(
      res => {
        this.tiposComprobantes = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene los conceptos de Afip
  public listarAfipConcepto(){
    this.afipConceptosServicio.listar().subscribe(
      res=>{
        this.afipConceptos = res.json();
      },
      err=>{
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
    this.listar();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
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
    if(estado) {
      this.formulario.get('tipoComprobante').enable();
      this.formulario.get('estaHabilitado').enable();
      this.formulario.get('esContrareembolso').enable();
      this.formulario.get('afipConcepto').enable();
      this.formulario.get('esChequeRechazado').enable();
    } else {
      this.formulario.get('tipoComprobante').disable();
      this.formulario.get('estaHabilitado').disable();
      this.formulario.get('esContrareembolso').disable();
      this.formulario.get('afipConcepto').disable();
      this.formulario.get('esChequeRechazado').disable();
    }
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
  //Agrega un registro
  private agregar() {
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function() {
            document.getElementById('idNombre').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        document.getElementById("labelNombre").classList.add('label-error');
        document.getElementById("idNombre").classList.add('is-invalid');
        document.getElementById("idNombre").focus();
        this.toastr.error(respuesta.mensaje);      
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    console.log(this.formulario.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          setTimeout(function() {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        document.getElementById("labelNombre").classList.add('label-error');
        document.getElementById("idNombre").classList.add('is-invalid');
        document.getElementById("idNombre").focus();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
        console.log(err);
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
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if(keycode == 113) {
      if(indice < this.pestanias.length) {
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
}