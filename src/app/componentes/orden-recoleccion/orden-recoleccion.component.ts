import { Component, OnInit } from '@angular/core';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { OrdenRecoleccion } from 'src/app/modelos/ordenRecoleccion';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
@Component({
  selector: 'app-orden-recoleccion',
  templateUrl: './orden-recoleccion.component.html',
  styleUrls: ['./orden-recoleccion.component.css']
})
export class OrdenRecoleccionComponent implements OnInit {
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
  //Define si los campos de seleccion son de solo lectura
  public selectSoloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define si muestra los datos (localidad-barrio-provincia) del cliente
  public mostrarCliente:boolean=false;
  //Define una lista
  public lista = null;
  //Define la lista para las Escalas agregadas
  public listaDeEscalas:Array<any> = [];
  //Define la lista para los tramos agregados
  public listaDeTramos:Array<any> = [];
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define el siguiente id
  public siguienteId:number = null;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  //Define el form control para el remitente
  public cliente:FormControl = new FormControl();
  public domicilio:FormControl = new FormControl();
  public localidad:FormControl = new FormControl();
  public barrio:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de sucursales
  public resultadosSucursales = [];
  
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  constructor(private ordenRecoleccion: OrdenRecoleccion, private subopcionPestaniaService: SubopcionPestaniaService, private appComponent: AppComponent, private fechaServicio: FechaService,
    private localidadService: LocalidadService, private clienteService: ClienteService, private toastr: ToastrService, private barrioService: BarrioService,
    private appService: AppService, private servicio: OrdenRecoleccionService, private sucursalService: SucursalService) {
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
   }
  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.ordenRecoleccion.formulario;
    //Setea la fecha actual
    this.fechaServicio.obtenerFechaYHora().subscribe(res=>{
      this.formulario.get('fechaEmision').setValue(res.json());
    },
    err=>{

    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Lista todos los registros
    this.listar();
    //Lista todas las sucursales
    this.listarSucursales();
    //Autcompletado - Buscar por Remitente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosClientes = res;
        })
      }
    });
    //Autcompletado - Buscar por Localidad
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.localidadService.listarPorNombre(data).subscribe(res => {
          this.resultadosLocalidades = res;
        })
      }
    });
    //Autcompletado - Buscar por Barrio
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.barrioService.listarPorNombre(data).subscribe(res => {
          this.resultadosBarrios = res;
        })
      }
    })
  }
  //Obtiene el listado de registros
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de Sucursales
  private listarSucursales() {
    this.sucursalService.listar().subscribe(
      res => {
        this.resultadosSucursales = res.json();
      },
      err => {
      }
    );
  }
  //Controla el cambio del autocompletado para el Remitente
  public cambioRemitente(){
    this.mostrarCliente=true;
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, selectSoloLectura, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;

    if(selectSoloLectura==true){
      this.formulario.get('entregarEnDomicilio').disable();
      this.formulario.get('pagoEnOrigen').disable();
      this.formulario.get('sucursalDestino').disable();
      this.formulario.get('entregarEnDomicilio').disable();
      this.formulario.get('localidad').disable();
      this.formulario.get('barrio').disable();
      this.formulario.get('cliente').disable();
    }else{
      this.formulario.get('entregarEnDomicilio').enable();
      this.formulario.get('pagoEnOrigen').enable();
      this.formulario.get('sucursalDestino').enable();
      this.formulario.get('entregarEnDomicilio').enable();
      this.formulario.get('localidad').enable();
      this.formulario.get('barrio').enable();
      this.formulario.get('cliente').enable();
    }

    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, false, 'idCliente');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, true, 'idOrdenRecoleccion');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, false, 'idOrdenRecoleccion');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, true, 'idOrdenRecoleccion');
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
  //Agrega un Cliente Eventual
  public agregarClienteEventual(){

  }
  //Agrega un registro
  private agregar() {
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario();
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
          this.reestablecerFormulario();
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
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Reestablece el formulario
  public reestablecerFormulario(){
    this.mostrarCliente=false;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    // this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    // this.autocompletado.setValue(elemento);
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
