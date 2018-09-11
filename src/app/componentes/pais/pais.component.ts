import { Component, Renderer2 } from '@angular/core';
import { PaisService } from '../../servicios/pais.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';

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
  elemento:any = {};
  lista = null;
  pestanias = null;
  idRol = 1;
  idSubopcion = 1;
  formulario = null;
  constructor(private paisService: PaisService, private pestaniaService: PestaniaService,
      private appComponent: AppComponent, private renderer: Renderer2) {
        this.formulario = new FormGroup({
          autocompletado: new FormControl(),
          id: new FormControl(),
          nombre: new FormControl()
        });
        this.pestaniaService.listarPorRolSubopcion(this.appComponent.getUsuario().rol.id, this.appComponent.getSubopcion())
          .subscribe(
            res => {
              this.pestanias = res.json();
              this.activeLink = this.pestanias[0].nombre;
            },
            err => {
              console.log(err);
            }
          );
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
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    //var id = this.pestanias[indice].id;
    //var nombre = this.pestanias[indice].nombre;
    switch (id) {
      case 1:
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
        //listar();
        break;
      default:
        break;
    }
  }
  //Obtiene el listado de registros
  public listar() {
    this.paisService.listar().subscribe(res => {
      //console.log(JSON.parse(res._body));
    });
  }
  //Agrega un registro
  public agregar(elemento) {
    this.paisService.agregar(elemento).subscribe(res => {
      console.log(res);
    });
  }
}
