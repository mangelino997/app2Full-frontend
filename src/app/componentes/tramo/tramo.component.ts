import { Component, OnInit } from '@angular/core';
import { TramoService } from '../../servicios/tramo.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { OrigenDestinoService } from '../../servicios/origen-destino.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tramo',
  templateUrl: './tramo.component.html',
  styleUrls: ['./tramo.component.css']
})
export class TramoComponent implements OnInit {
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
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define el autocompletado para las busquedas Origen
  public autocompletadoOrigen:FormControl = new FormControl();
  //Define el autocompletado para las busquedas Destino
  public autocompletadoDestino:FormControl = new FormControl();
  //Define la lista de resultados del autocompletado
  public resultados:Array<any> = [];
  //Define la lista de resultados de origenes destinos
  public resultadosOrigenesDestinos:Array<any> = [];
  //Constructor
  constructor(private servicio: TramoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private origenDestinoServicio: OrigenDestinoService,
    private toastr: ToastrService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
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
        this.servicio.listarPorOrigen(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoOrigen.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorOrigen(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoDestino.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorDestino(data).subscribe(res => {
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
      origen: new FormControl('', Validators.required),
      destino: new FormControl('', Validators.required),
      km: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(5)]),
      estaActivo: new FormControl('', Validators.required),
      excluirLiqChofer: new FormControl('', Validators.required),
      rutaAlternativa: new FormControl('', Validators.maxLength(20))
    });
    //Autocompletado Origen - Buscar por nombre
    this.formulario.get('origen').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosOrigenesDestinos = res;
        })
      }
    })
    //Autocompletado Destino - Buscar por nombre
    this.formulario.get('destino').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosOrigenesDestinos = res;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
  }
  //Vacia las listas de resultados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosOrigenesDestinos = [];
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('excluirLiqChofer').setValue(false);
    this.formulario.get('estaActivo').setValue(true);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('excluirLiqChofer').enable();
      this.formulario.get('estaActivo').enable();
    } else {
      this.formulario.get('excluirLiqChofer').disable();
      this.formulario.get('estaActivo').disable();
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
  public seleccionarPestania(id, nombre, opcion) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(id != 5) {
      this.reestablecerFormulario('');
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPorDefecto();
        this.establecerValoresPestania(nombre, false, false, true, 'idOrigen');
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
      case 5:
        setTimeout(function() {
          document.getElementById('idAutocompletadoOrigen').focus();
        }, 20);
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
  //Agrega un registro
  private agregar() {
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerValoresPorDefecto();
          setTimeout(function() {
            document.getElementById('idOrigen').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        let respuesta = err.json();
        if(respuesta.codigo == 11017) {
          this.toastr.error('Error Unicidad Origen->Destino', respuesta.mensaje + " TRAMO");
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
        console.log(err);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Establece la tabla al seleccion elemento de autocompletado
  public establecerTabla(opcion): void {
    if(opcion) {
      this.autocompletadoDestino.reset();
    } else {
      this.autocompletadoOrigen.reset();
    }
    this.listaCompleta = this.resultados;
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.reset();
    this.vaciarListas();
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autocompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ' -> ' + elemento.destino.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
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
