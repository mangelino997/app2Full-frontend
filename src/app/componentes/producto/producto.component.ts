import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
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

  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private toastr: ToastrService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(1, 4)
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
   }

  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      codigo: new FormControl(),
      nombre: new FormControl(),
      marca: new FormControl(),
      modelo: new FormControl(),
      rubro: new FormControl(),
      esAsignable: new FormControl(),
      esSerializable: new FormControl(),
      esCritico: new FormControl(),
      reposicion: new FormControl()
      });
      //Establece los valores de la primera pestania activa
      this.seleccionarPestania(1, 'Agregar', 0);
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
  if(opcion == 0) {
    this.autocompletado.setValue(undefined);
    this.resultados = [];
  }
  switch (id) {
    case 1:
      // this.obtenerSiguienteId();
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
  // if(estado) {
  //   this.formulario.get('codigo').enable();
  //   this.formulario.get('nombre').enable();
  //   this.formulario.get('esContado').enable();
  // } else {
  //   this.formulario.get('codigo').disable();
  //   this.formulario.get('nombre').disable();
  //   this.formulario.get('esContado').disable();
  // }
}
//Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
// public accion(indice) {
//   switch (indice) {
//     case 1:
//       this.agregar();
//       break;
//     case 3:
//       this.actualizar();
//       break;
//     case 4:
//       this.eliminar();
//       break;
//     default:
//       break;
//   }
// }
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
