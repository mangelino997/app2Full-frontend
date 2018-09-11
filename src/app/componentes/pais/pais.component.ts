import { Component } from '@angular/core';
import { PaisService } from '../../servicios/pais.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

const estados = [
  {'id': 1, 'nombre': 'Argentina'},
  {'id': 2, 'nombre': 'Arginta'}
]

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html'
})
export class PaisComponent {
  activeLink = null;
  indiceSeleccionado = null;
  pestaniaActual = null;
  mostrarAutocompletado = null;
  soloLectura = false;
  mostrarBoton = null;
  lista = null;
  pestanias = null;
  formulario = null;
  //Define el elemento
  private elemento:any = {};
  //Define el siguiente id
  private siguienteId:number = null;
  //Define la lista completa de registros
  private listaCompleta:any = null;
  //Constructor
  constructor(private paisService: PaisService, private pestaniaService: PestaniaService,
      private appComponent: AppComponent, private toastr: ToastrService) {
        //Define los campos para validaciones
        this.formulario = new FormGroup({
          autocompletado: new FormControl(),
          id: new FormControl(),
          nombre: new FormControl()
        });
        //Obtiene la lista de pestania por rol y subopcion
        this.pestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
          .subscribe(
            res => {
              this.pestanias = res.json();
              this.activeLink = this.pestanias[0].nombre;
            },
            err => {
              console.log(err);
            }
          );
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar');
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
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice, elemento) {
    switch (indice) {
      case 1:
        this.agregar(elemento);
        break;
      case 3:
        this.actualizar(elemento);
        break;
      case 4:
        this.eliminar(elemento);
        break;
      default:
        break;
    }
  }
  //Reestablece los campos agregar
  private reestablecerCamposAgregar(id) {
    this.elemento = {};
    this.elemento.id = id;
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.paisService.obtenerSiguienteId().subscribe(
      res => {
        this.elemento.id = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de registros
  public listar() {
    this.paisService.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un registro
  private agregar(elemento) {
    this.paisService.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
          setTimeout(function() {
            document.getElementById('idNombre').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
      }
    );
  }
  //Actualiza un registro
  private actualizar(elemento) {
  this.paisService.actualizar(elemento).subscribe(
    res => {
      var respuesta = res.json();
      if(respuesta.codigo == 200) {
        this.reestablecerCampos();
        setTimeout(function() {
          document.getElementById('idAutocompletado').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
      }
    },
    err => {
      var respuesta = err.json();
      if(respuesta.codigo == 11002) {
        document.getElementById("labelNombre").classList.add('label-error');
        document.getElementById("idNombre").classList.add('is-invalid');
        document.getElementById("idNombre").focus();
        this.toastr.error(respuesta.mensaje);
      }
    }
  );
  }
  //Elimina un registro
  private eliminar(elemento) {
    console.log(elemento);
  }
  //Funcion para listar por nombre
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 2 ? [] : this.paisService.listarPorNombre(term))
    )
    formatter = (x: {nombre: string}) => x.nombre;
  //Manejo de colores de campos y labels
  public cambioCampo() {
    document.getElementById("idNombre").classList.remove('is-invalid');
    document.getElementById("labelNombre").classList.remove('label-error');
  };
}
