import { Component, OnInit } from '@angular/core';
import { SucursalClienteService } from '../../servicios/sucursal-cliente.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { ClienteService } from '../../servicios/cliente.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-sucursal-cliente',
  templateUrl: './sucursal-cliente.component.html'
})
export class SucursalClienteComponent implements OnInit {
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
  private lista = null;
  //Define la lista de pestanias
  private pestanias = null;
  //Define un formulario para validaciones de campos
  private formulario = null;
  //Define el elemento
  private elemento:any = {};
  //Define el elemento de autocompletado
  private elemAutocompletado:any = null;
  //Define el siguiente id
  private siguienteId:number = null;
  //Define la lista completa de registros
  private listaCompleta:any = null;
  //Define la opcion seleccionada
  private opcionSeleccionada:number = null;
  //Define la lista de sucursales
  private sucursales:any = null;
  //Define el form control para las busquedas cliente
  private buscarCliente:FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  private resultadosClientes = [];
  //Define el form control para las busquedas barrio
  private buscarBarrio:FormControl = new FormControl();
  //Define la lista de resultados de busqueda barrio
  private resultadosBarrios = [];
  //Define el form control para las busquedas localidad
  private buscarLocalidad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda localidad
  private resultadosLocalidades = [];
  //Constructor
  constructor(private servicio: SucursalClienteService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private clienteServicio: ClienteService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      nombre: new FormControl(),
      domicilio: new FormControl(),
      barrio: new FormControl(),
      telefonoFijo: new FormControl(),
      telefonoMovil: new FormControl(),
      cliente: new FormControl(),
      localidad: new FormControl()
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
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias cliente
    this.buscarCliente.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.clienteServicio.listarPorAlias(data).subscribe(response =>{
            this.resultadosClientes = response;
          })
        }
    })
    //Autocompletado - Buscar por nombre barrio
    this.buscarBarrio.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.barrioServicio.listarPorNombre(data).subscribe(response =>{
            this.resultadosBarrios = response;
          })
        }
    })
    //Autocompletado - Buscar por nombre localidad
    this.buscarLocalidad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.localidadServicio.listarPorNombre(data).subscribe(response =>{
            this.resultadosLocalidades = response;
          })
        }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultadosClientes = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.elemento = elemAutocompletado;
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarLista();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idCliente');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idCliente');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idCliente');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idCliente');
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
    this.vaciarLista();
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
    this.elemAutocompletado = null;
    this.vaciarLista();
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.elemento.id = res.json();
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
  //Obtiene una lista por cliente
  public listarPorCliente(elemento) {
    if(this.mostrarAutocompletado) {
      this.servicio.listarPorCliente(elemento.id).subscribe(
        res => {
          this.sucursales = res.json();
        },
        err => {
          console.log(err);
        }
      )
    }
  }
  //Agrega un registro
  private agregar(elemento) {
    elemento.usuarioAlta = this.appComponent.getUsuario();
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
          setTimeout(function() {
            document.getElementById('idCliente').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Actualiza un registro
  private actualizar(elemento) {
    this.servicio.actualizar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerCampos();
          setTimeout(function() {
            document.getElementById('idCliente').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Elimina un registro
  private eliminar(elemento) {
    console.log(elemento);
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if(respuesta.codigo == 11002) {
      document.getElementById("labelNombre").classList.add('label-error');
      document.getElementById("idNombre").classList.add('is-invalid');
      document.getElementById("idNombre").focus();
    } else if(respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    } else if(respuesta.codigo == 11014) {
      document.getElementById("labelTelefonoMovil").classList.add('label-error');
      document.getElementById("idTelefonoMovil").classList.add('is-invalid');
      document.getElementById("idTelefonoMovil").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ' - ' + elemento.cliente.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    var opcion = this.opcionSeleccionada;
    if(keycode == 113) {
      if(indice < this.pestanias.length) {
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
}
