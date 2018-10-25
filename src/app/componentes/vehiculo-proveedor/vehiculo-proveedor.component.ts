import { Component, OnInit } from '@angular/core';
import { VehiculoProveedorService } from '../../servicios/vehiculo-proveedor.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs'

@Component({
  selector: 'app-vehiculo-proveedor',
  templateUrl: './vehiculo-proveedor.component.html',
  styleUrls: ['./vehiculo-proveedor.component.css']
})
export class VehiculoProveedorComponent implements OnInit {
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
  //Define la lista completa de registros
  private listaCompleta:Array<any> = [];
  //Define la lista de tipos de vehiculos
  private tiposVehiculos:Array<any> = [];
  //Define la lista de marcas de vehiculos
  private marcasVehiculos:Array<any> = [];
  //Define el autocompletado para las busquedas
  private autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados = [];
  //Define la lista de resultados de busqueda vehiculo remolque
  private resultadosVehiculosRemolques = [];
  //Define la lista de resultados de busqueda localidad
  private resultadosLocalidades = [];
  //Define la lista de resultados de busqueda compania seguro
  private resultadosCompaniasSeguros = [];
  //Constructor
  constructor(private servicio: VehiculoProveedorService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private localidadServicio: LocalidadService, private proveedorServicio: ProveedorService,
    private companiaSeguroServicio: CompaniaSeguroService) {
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
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
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
      dominio: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      proveedor: new FormControl('', Validators.required),
      tipoVehiculo: new FormControl('', Validators.required),
      marcaVehiculo: new FormControl('', Validators.required),
      choferProveedor: new FormControl(),
      vehiculoRemolque: new FormControl(),
      anioFabricacion: new FormControl('', [Validators.required, Validators.min(1)]),
      numeroMotor: new FormControl('', Validators.maxLength(25)),
      numeroChasis: new FormControl('', Validators.maxLength(25)),
      companiaSeguro: new FormControl('', Validators.required),
      numeroPoliza: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      vtoPoliza: new FormControl('', Validators.required),
      vtoRTO: new FormControl('', Validators.required),
      numeroRuta: new FormControl('', Validators.required),
      vtoRuta: new FormControl('', Validators.required),
      vtoSenasa: new FormControl(),
      vtoHabBromatologica: new FormControl(),
      usuarioAlta: new FormControl(),
      fechaBaja: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      alias: new FormControl('', Validators.maxLength(100))
    });
    //Autocompletado - Buscar por alias filtro remolque
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.servicio.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCompaniasSeguros = response;
        })
        }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
  }
  //Obtiene la lista de tipos de vehiculos
  private listarTiposVehiculos() {
    this.tipoVehiculoServicio.listar().subscribe(res => {
      this.tiposVehiculos = res.json();
    })
  }
  //Obtiene la lista de marcas de vehiculos
  private listarMarcasVehiculos() {
    this.marcaVehiculoServicio.listar().subscribe(res => {
      this.marcasVehiculos = res.json();
    })
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosLocalidades = [];
    this.resultadosCompaniasSeguros = [];
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura,
    boton, componente) {
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
        this.establecerValoresPestania(nombre, false, false, true,'idProveedor');
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
            document.getElementById('idProveedor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        }
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
        this.reestablecerFormulario('');
        setTimeout(function() {
          document.getElementById('idAutocompletado').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
      }
    },
    err => {
      var respuesta = err.json();
      if(respuesta.codigo == 11017) {
        document.getElementById("labelDominio").classList.add('label-error');
        document.getElementById("idDominio").classList.add('is-invalid');
        document.getElementById("idDominio").focus();
      }
      this.toastr.error(respuesta.mensaje);
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
    this.vaciarLista();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
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
  //Muestra el valor en los autocompletados
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor de otro autocompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
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
