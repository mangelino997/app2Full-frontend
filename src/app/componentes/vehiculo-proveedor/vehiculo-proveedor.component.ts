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
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs'

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
  //Define si mostrar la lista de configuraciones de vehiculos
  private mostrarConfiguracionVehiculo:boolean = null;
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
  //Define la lista de tipos de vehiculos
  private tiposVehiculos:any = null;
  //Define la lista de marcas de vehiculos
  private marcasVehiculos:any = null;
  //Define el form control para las busquedas
  private buscar:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados = [];
  //Define el form control para las busquedas vehiculo remolque
  private buscarVehiculoRemolque:FormControl = new FormControl();
  //Define la lista de resultados de busqueda vehiculo remolque
  private resultadosVehiculosRemolques = [];
  //Define el form control para buscar localidad
  private buscarLocalidad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda localidad
  private resultadosLocalidades = [];
  //Define el form control para buscar compania seguro
  private buscarCompaniaSeguro:FormControl = new FormControl();
  //Define la lista de resultados de busqueda compania seguro
  private resultadosCompaniasSeguros = [];
  //Constructor
  constructor(private servicio: VehiculoProveedorService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private localidadServicio: LocalidadService, private proveedorServicio: ProveedorService,
    private companiaSeguroServicio: CompaniaSeguroService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      dominio: new FormControl(),
      proveedor: new FormControl(),
      tipoVehiculo: new FormControl(),
      marcaVehiculo: new FormControl(),
      choferProveedor: new FormControl(),
      vehiculoRemolque: new FormControl(),
      anioFabricacion: new FormControl(),
      numeroMotor: new FormControl(),
      numeroChasis: new FormControl(),
      companiaSeguro: new FormControl(),
      numeroPoliza: new FormControl(),
      vtoPoliza: new FormControl(),
      vtoRTO: new FormControl(),
      numeroRuta: new FormControl(),
      vtoRuta: new FormControl(),
      vtoSenasa: new FormControl(),
      vtoHabBromatologica: new FormControl(),
      usuarioAlta: new FormControl(),
      fechaBaja: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      alias: new FormControl()
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
    this.seleccionarPestania(1, 'Agregar', 0);
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    this.buscar.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.servicio.listarPorAlias(data).subscribe(response =>{
            this.resultados = response;
          })
        }
    })
    //Autocompletado - Buscar por alias filtro remolque
    this.buscarVehiculoRemolque.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.servicio.listarPorAliasFiltroRemolque(data).subscribe(response =>{
            this.resultadosVehiculosRemolques = response;
          })
        }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.buscarLocalidad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.localidadServicio.listarPorNombre(data).subscribe(response =>{
            this.resultadosLocalidades = response;
          })
        }
    })
    //Autocompletado Compania Seguro - Buscar por nombre
    this.buscarCompaniaSeguro.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.companiaSeguroServicio.listarPorNombre(data).subscribe(response =>{
            this.resultadosCompaniasSeguros = response;
          })
        }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
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
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.elemento = elemAutocompletado;
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura,
    boton, configuracionVehiculo, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.mostrarConfiguracionVehiculo = configuracionVehiculo;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.listaCompleta = null;
    if(opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, true,'idTipoVehiculo');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
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
    this.elemAutocompletado = null;
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
  //Agrega un registro
  private agregar(elemento) {
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
          setTimeout(function() {
            document.getElementById('idTipoVehiculo').focus();
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
        } else if(respuesta.codigo == 11018) {
          document.getElementById("labelNumeroInterno").classList.add('label-error');
          document.getElementById("idNumeroInterno").classList.add('is-invalid');
          document.getElementById("idNumeroInterno").focus();
        }
        this.toastr.error(respuesta.mensaje);
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
      } else if(respuesta.codigo == 11018) {
        document.getElementById("labelNumeroInterno").classList.add('label-error');
        document.getElementById("idNumeroInterno").classList.add('is-invalid');
        document.getElementById("idNumeroInterno").focus();
      }
      this.toastr.error(respuesta.mensaje);
    }
  );
  }
  //Elimina un registro
  private eliminar(elemento) {
    console.log(elemento);
  }
  /*
  * Establece la configuracion de vehiculo al seleccionar un item de la lista
  * configuraciones de vehiculos
  */
  public establecerConfiguracion(elemento) {
    this.elemento.configuracion = 'Modelo: ' + elemento.modelo +
      ' - Cantidad de Ejes: ' + elemento.cantidadEjes +
      ' - Capacidad de Carga: ' + elemento.capacidadCarga + '\n' +
      'Descripcion: ' + elemento.descripcion + '\n' +
      'Tara: ' + parseFloat(elemento.tara).toFixed(2) +
      ' - Altura: ' + parseFloat(elemento.altura).toFixed(2) +
      ' - Largo: ' + parseFloat(elemento.largo).toFixed(2) +
      ' - Ancho: ' + parseFloat(elemento.ancho).toFixed(2);;
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
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
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.configuracionVehiculo ? 'Modelo: ' + elemento.configuracionVehiculo.modelo +
        ' - Cantidad Ejes: ' + elemento.configuracionVehiculo.cantidadEjes +
        ' - Capacidad Carga: ' + elemento.configuracionVehiculo.capacidadCarga : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados d
  public displayFd(elemento) {
    if(elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
}
