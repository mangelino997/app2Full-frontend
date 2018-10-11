import { Component, OnInit } from '@angular/core';
import { ViajePropioService } from '../../servicios/viaje-propio.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { FechaService } from '../../servicios/fecha.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.css']
})
export class ViajeComponent implements OnInit {
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
  //Define la lista de opciones
  private opciones = null;
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
  //Define la lista de sindicatos
  private sindicatos:any = null;
  //Define la opcion activa
  private botonOpcionActivo:any = null;
  //Define el form control para las busquedas
  private buscar:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados = [];
  //Define el form control para autocompletado barrio
  private buscarBarrio:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de barrios
  private resultadosBarrios = [];
  //Constructor
  constructor(private servicio: ViajePropioService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private fechaServicio: FechaService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      empresaEmision: new FormControl(),
      sucursal: new FormControl(),
      usuario: new FormControl(),
      fecha: new FormControl(),
      vehiculo: new FormControl(),
      personal: new FormControl(),
      esRemolquePropio: new FormControl(),
      vehiculoRemolque: new FormControl(),
      vehiculoProveedorRemolque: new FormControl(),
      empresa: new FormControl(),
      empresaRemolque: new FormControl(),
      condicionIva: new FormControl(),
      numeroDocumentacion: new FormControl(),
      fechaDocumentacion: new FormControl(),
      usuarioDocumentacion: new FormControl(),
      numeroLiquidacion: new FormControl(),
      fechaLiquidacion: new FormControl(),
      usuarioLiquidacion: new FormControl(),
      usuarioVehiculoAutorizado: new FormControl(),
      usuarioVehiculoRemAutorizado: new FormControl(),
      usuarioChoferAutorizado: new FormControl(),
      observacionVehiculo: new FormControl(),
      observacionVehiculoRemolque: new FormControl(),
      observacionChofer: new FormControl(),
      observaciones: new FormControl()
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
    //Obtiene la lista de opciones por rol y subopcion
    this.rolOpcionServicio.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.opciones = res.json();
      },
      err => {
        console.log(err);
      }
    );
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(15, 0);
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
    //Autocompletado Barrio - Buscar por nombre
    this.buscarBarrio.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
          })
        }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.buscarLocalidad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
          })
        }
    })
    //Autocompletado Categoria - Buscar por nombre
    this.buscarCategoria.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.categoriaServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosCategorias = response;
          })
        }
    })
    //Autocompletado Seguridad Social - Buscar por nombre
    this.buscarSeguridadSocial.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.seguridadSocialServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosSeguridadesSociales = response;
          })
        }
    })
    //Autocompletado Obra Social - Buscar por nombre
    this.buscarObraSocial.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.obraSocialServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosObrasSociales = response;
          })
        }
    })
    //Autocompletado Afip Actividad - Buscar por nombre
    this.buscarAfipActividad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipActividadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipActividades = response;
          })
        }
    })
    //Autocompletado Afip Condicion - Buscar por nombre
    this.buscarAfipCondicion.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipCondicionServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipCondiciones = response;
          })
        }
    })
    //Autocompletado Afip Localidad - Buscar por nombre
    this.buscarAfipLocalidad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipLocalidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipLocalidades = response;
          })
        }
    })
    //Autocompletado Afip Mod Contratacion - Buscar por nombre
    this.buscarAfipModContratacion.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipModContratacionServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipModContrataciones = response;
          })
        }
    })
    //Autocompletado Afip Siniestrado - Buscar por nombre
    this.buscarAfipSiniestrado.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipSiniestradoServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipSiniestrados = response;
          })
        }
    })
    //Autocompletado Afip Situacion - Buscar por nombre
    this.buscarAfipSituacion.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.afipSituacionServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosAfipSituaciones = response;
          })
        }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de sexos
    this.listarSexos();
    //Obtiene la lista de estados civiles
    this.listarEstadosCiviles();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Obtiene la lista de areas
    this.listarAreas();
    //Obtiene la lista de sindicatos
    this.listarSindicatos();
  }
  //Obtiene el listado de sexos
  private listarSexos() {
    this.sexoServicio.listar().subscribe(
      res => {
        this.sexos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de estados civiles
  private listarEstadosCiviles() {
    this.estadoCivilServicio.listar().subscribe(
      res => {
        this.estadosCiviles = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de areas
  private listarAreas() {
    this.areaServicio.listar().subscribe(
      res => {
        this.areas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de sindicatos
  private listarSindicatos() {
    this.sindicatoServicio.listar().subscribe(
      res => {
        this.sindicatos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosCategorias = [];
    this.resultadosSeguridadesSociales = [];
    this.resultadosObrasSociales = [];
    this.resultadosAfipActividades = [];
    this.resultadosAfipCondiciones = [];
    this.resultadosAfipLocalidades = [];
    this.resultadosAfipModContrataciones = [];
    this.resultadosAfipSiniestrados = [];
    this.resultadosAfipSituaciones = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.elemento = elemAutocompletado;
   this.elemento.fechaNacimiento = elemAutocompletado.fechaNacimiento.substring(0, 10);
   this.elemento.fechaInicio = elemAutocompletado.fechaInicio.substring(0, 10);
   if(elemAutocompletado.fechaFin != null) {
     this.elemento.fechaFin = elemAutocompletado.fechaFin.substring(0, 10);
   }
   if(elemAutocompletado.vtoLicenciaConducir != null) {
     this.elemento.vtoLicenciaConducir = elemAutocompletado.vtoLicenciaConducir.substring(0, 10);
   }
   if(elemAutocompletado.vtoCursoCNRT != null) {
     this.elemento.vtoCursoCNRT = elemAutocompletado.vtoCursoCNRT.substring(0, 10);
   }
   if(elemAutocompletado.vtoLNH != null) {
     this.elemento.vtoLNH = elemAutocompletado.vtoLNH.substring(0, 10);
   }
   if(elemAutocompletado.vtoLibretaSanidad != null) {
     this.elemento.vtoLibretaSanidad = elemAutocompletado.vtoLibretaSanidad.substring(0, 10);
   }
   if(elemAutocompletado.telefonoMovilFechaEntrega != null) {
     this.elemento.telefonoMovilFechaEntrega = elemAutocompletado.telefonoMovilFechaEntrega.substring(0, 10);
   }
   if(elemAutocompletado.telefonoMovilFechaDevolucion != null) {
     this.elemento.telefonoMovilFechaDevolucion = elemAutocompletado.telefonoMovilFechaDevolucion.substring(0, 10);
   }
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
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idApellido');
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
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch(opcion) {
      case 15:
        setTimeout(function () {
          document.getElementById('idApellido').focus();
        }, 20);
        break;
      case 16:
        setTimeout(function () {
          document.getElementById('idSucursal').focus();
        }, 20);
        break;
      case 17:
        setTimeout(function () {
          document.getElementById('idCuil').focus();
        }, 20);
        break;
      case 18:
        setTimeout(function () {
          document.getElementById('idRecibeAdelanto').focus();
        }, 20);
        break;
      case 19:
        setTimeout(function () {
          document.getElementById('idEsChofer').focus();
        }, 20);
        break;
      case 20:
        setTimeout(function () {
          document.getElementById('idTalleCamisa').focus();
        }, 20);
        break;
      case 21:
        setTimeout(function () {
          document.getElementById('idCorreoelectronico').focus();
        }, 20);
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
    this.nacionalidad = null;
    this.vaciarLista();
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
    this.elemAutocompletado = null;
    this.nacionalidad = null;
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
  //Agrega un registro
  private agregar(elemento) {
    elemento.usuarioAlta = this.appComponent.getUsuario();
    elemento.empresa = this.appComponent.getEmpresa();
    elemento.esJubilado = false;
    elemento.esMensualizado = true;
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
          setTimeout(function() {
            document.getElementById('idApellido').focus();
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
    elemento.usuarioMod = this.appComponent.getUsuario();
    elemento.empresa = this.appComponent.getEmpresa();
    elemento.esJubilado = false;
    elemento.esMensualizado = true;
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
    if(respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    } else if(respuesta.codigo == 11012) {
      document.getElementById("labelCuil").classList.add('label-error');
      document.getElementById("idCuil").classList.add('is-invalid');
      document.getElementById("idCuil").focus();
    } else if(respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    } else if(respuesta.codigo == 11014) {
      document.getElementById("labelTelefonoMovil").classList.add('label-error');
      document.getElementById("idTelefonoMovil").classList.add('is-invalid');
      document.getElementById("idTelefonoMovil").focus();
    } else if(respuesta.codigo == 11003) {
      document.getElementById("labelCorreoelectronico").classList.add('label-error');
      document.getElementById("idCorreoelectronico").classList.add('is-invalid');
      document.getElementById("idCorreoelectronico").focus();
    } else if(respuesta.codigo == 11015) {
      document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
      document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
      document.getElementById("idTelefonoMovilEmpresa").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, valor, campo) {
    if(valor != undefined) {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if(campo == 'telefonoFijo') {
          document.getElementById("labelTelefonoFijo").classList.add('label-error');
          document.getElementById("idTelefonoFijo").classList.add('is-invalid');
          this.toastr.error('Telefono Fijo incorrecto');
        } else if(campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil incorrecto');
        } else if(campo == 'telefonoMovilEmpresa') {
          document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
          document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Empresa incorrecto');
        } else if(campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico incorrecto');
        }
      }
    }
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
  //Establece la nacionalidad
  public establecerNacionalidad(localidad) {
    console.log(localidad);
    this.nacionalidad = localidad.provincia.pais.nombre;
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
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    } else if(keycode == 115) {
      if(opcion < this.opciones[(this.opciones.length-1)].id) {
        this.seleccionarOpcion(opcion+1, opcion-14);
      } else {
        this.seleccionarOpcion(15, 0);
      }
    }
  }
}
