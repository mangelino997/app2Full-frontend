import { Component, OnInit } from '@angular/core';
import { OrigenDestinoService } from '../../servicios/origen-destino.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { ProvinciaService } from '../../servicios/provincia.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-origen-destino',
  templateUrl: './origen-destino.component.html',
  styleUrls: ['./origen-destino.component.css']
})
export class OrigenDestinoComponent implements OnInit {
  //Define la pestania activa
  private activeLink:any = null;
  //Define el indice seleccionado de pestania
  private indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  private pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  private mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  private soloLectura:boolean = false;
  //Define si mostrar el boton
  private mostrarBoton:boolean = null;
  //Define la lista de pestanias
  private pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  private formulario:FormGroup;
  //Defiene el autocompletado para las busquedas
  private autocompletado:FormControl = new FormControl();
  //Define la lista de resultados del autocompletado
  private resultados:Array<any> = [];
  //Define la lista completa de registros
  private listaCompleta:Array<any> = [];
  //Define la lista de provincias
  private resultadosProvincias:Array<any> = [];
  //Constructor
  constructor(private servicio: OrigenDestinoService, private pestaniaService: PestaniaService,
    private provinciaServicio: ProvinciaService, private appComponent: AppComponent, private toastr: ToastrService) {
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
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      provincia: new FormControl('', Validators.required)
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado Provincia - Buscar por nombre
    this.formulario.get('provincia').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.provinciaServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosProvincias = res;
        })
      }
    })
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.formulario.setValue(elemAutocompletado);
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
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.listaCompleta = null;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
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
      default:
        break;
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
  //Obtiene el listado de registros
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
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
  private actualizar() {
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
  private eliminar() {
    console.log();
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
  }
  //Obtiene la lista de localidades por provincia
  public listarPorProvincia(idProvincia) {
    this.servicio.listarPorProvincia(idProvincia).subscribe(res => {
      this.listaCompleta = res.json();
    })
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento)
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento)
    this.formulario.setValue(elemento);
  }
  //Muestra el valor en los autocompletados
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
}
