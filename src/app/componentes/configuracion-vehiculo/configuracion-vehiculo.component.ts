import { Component, OnInit } from '@angular/core';
import { ConfiguracionVehiculoService } from '../../servicios/configuracion-vehiculo.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-configuracion-vehiculo',
  templateUrl: './configuracion-vehiculo.component.html',
  styleUrls: ['./configuracion-vehiculo.component.css']
})
export class ConfiguracionVehiculoComponent implements OnInit {
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
  //Define una lista
  private lista:Array<any> = [];
  //Define la lista de pestanias
  private pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  private formulario:FormGroup;
  //Define el autocompletado
  private autocompletado:FormControl = new FormControl();
  //Define la lista completa de registros
  private listaCompleta:Array<any> = [];
  //Define la lista de configuraciones de vehiculo
  private configuraciones:Array<any> = [];
  //Define la lista de tipos de vehiculos
  private tiposVehiculos:Array<any> = [];
  //Define la lista de marcas de vehiculos
  private marcasVehiculos:Array<any> = [];
  //Constructor
  constructor(private servicio: ConfiguracionVehiculoService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService) {
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
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      tipoVehiculo: new FormControl('', Validators.required),
      marcaVehiculo: new FormControl('', Validators.required),
      modelo: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      descripcion: new FormControl('', Validators.maxLength(100)),
      cantidadEjes: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      capacidadCarga: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      tara: new FormControl('', Validators.maxLength(5)),
      altura: new FormControl('', Validators.maxLength(5)),
      largo: new FormControl('', Validators.maxLength(5)),
      ancho: new FormControl('', Validators.maxLength(5)),
      m3: new FormControl('', Validators.maxLength(5))
    });
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
  }
  //Obtiene la lista de tipos de vehiculos
  private listarTiposVehiculos() {
    this.tipoVehiculoServicio.listar().subscribe(
      res => {
        this.tiposVehiculos = res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  private listarMarcasVehiculos() {
    this.marcaVehiculoServicio.listar().subscribe(
      res => {
        this.marcasVehiculos = res.json();
      },
      err => {
        console.log(err);
      }
    )
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
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoVehiculo');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoVehiculo');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoVehiculo');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoVehiculo');
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
  //Obtiene la lista de configuracion de vehiculos por tipo y marca
  public listarPorTipoVehiculoMarcaVehiculo() {
    let tipoVehiculo = this.formulario.get('tipoVehiculo').value;
    let marcaVehiculo = this.formulario.get('marcaVehiculo').value;
    if(tipoVehiculo && marcaVehiculo) {
      this.servicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id).subscribe(
        res => {
          this.configuraciones = res.json();
        },
        err => {
          console.log(err);
        }
      )
    }
  }
  //Agrega un registro
  private agregar() {
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario();
          setTimeout(function() {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario();
          setTimeout(function() {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.formulario.setValue(elemento);
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: '
        + elemento.cantidadEjes + ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
    } else {
      return elemento;
    }
  }
}
