import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../servicios/personal.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { SexoService } from '../../servicios/sexo.service';
import { EstadoCivilService } from '../../servicios/estado-civil.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { AreaService } from '../../servicios/area.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { SindicatoService } from '../../servicios/sindicato.service';
import { SeguridadSocialService } from '../../servicios/seguridad-social.service';
import { ObraSocialService } from '../../servicios/obra-social.service';
import { AfipActividadService } from '../../servicios/afip-actividad.service';
import { AfipCondicionService } from '../../servicios/afip-condicion.service';
import { AfipLocalidadService } from '../../servicios/afip-localidad.service';
import { AfipModContratacionService } from '../../servicios/afip-mod-contratacion.service';
import { AfipSiniestradoService } from '../../servicios/afip-siniestrado.service';
import { AfipSituacionService } from '../../servicios/afip-situacion.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html'
})
export class PersonalComponent implements OnInit {
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
  //Define la lista de sexos
  private sexos:any = null;
  //Define la lista de estados civiles
  private estadosCiviles:any = null;
  //Define la lista de tipos de documentos
  private tiposDocumentos:any = null;
  //Define la lista de sucursales
  private sucursales:any = null;
  //Define la lista de areas
  private areas:any = null;
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
  //Define el form control para autocompletado localidad
  private buscarLocalidad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de localidades
  private resultadosLocalidades = [];
  //Define el form control para autocompletado categoria
  private buscarCategoria:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de categorias
  private resultadosCategorias = [];
  //Define el form control para autocompletado seguridad social
  private buscarSeguridadSocial:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de seguridad social
  private resultadosSeguridadesSociales = [];
  //Define el form control para autocompletado obra social
  private buscarObraSocial:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de obra social
  private resultadosObrasSociales = [];
  //Define el form control para autocompletado afip actividad
  private buscarAfipActividad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip actividad
  private resultadosAfipActividades = [];
  //Define el form control para autocompletado afip condicion
  private buscarAfipCondicion:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip condicion
  private resultadosAfipCondiciones = [];
  //Define el form control para autocompletado afip localidad
  private buscarAfipLocalidad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip localidad
  private resultadosAfipLocalidades = [];
  //Define el form control para autocompletado afip mod contratacion
  private buscarAfipModContratacion:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip mod contratacion
  private resultadosAfipModContrataciones = [];
  //Define el form control para autocompletado afip siniestrado
  private buscarAfipSiniestrado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip siniestrado
  private resultadosAfipSiniestrados = [];
  //Define el form control para autocompletado afip situacion
  private buscarAfipSituacion:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de afip situacion
  private resultadosAfipSituaciones = [];
  //Constructor
  constructor(private servicio: PersonalService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private sexoServicio: SexoService,
    private estadoCivilServicio: EstadoCivilService, private tipoDocumentoServicio: TipoDocumentoService,
    private sucursalServicio: SucursalService, private areaServicio: AreaService,
    private categoriaServicio: CategoriaService, private sindicatoServicio: SindicatoService,
    private seguridadSocialServicio: SeguridadSocialService, private obraSocialServicio: ObraSocialService,
    private afipActividadServicio: AfipActividadService, private afipCondicionServicio: AfipCondicionService,
    private afipLocalidadServicio: AfipLocalidadService, private afipModContratacionServicio: AfipModContratacionService,
    private afipSiniestradoServicio: AfipSiniestradoService, private afipSituacionServicio: AfipSituacionService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      nombre: new FormControl(),
      apellido: new FormControl(),
      nombreCompleto: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl(),
      cuil: new FormControl(),
      empresa: new FormControl(),
      barrio: new FormControl(),
      localidad: new FormControl(),
      localidadNacimiento: new FormControl(),
      fechaNacimiento: new FormControl(),
      telefonoFijo: new FormControl(),
      telefonoMovil: new FormControl(),
      estadoCivil: new FormControl(),
      correoelectronico: new FormControl(),
      sexo: new FormControl(),
      sucursal: new FormControl(),
      area: new FormControl(),
      fechaInicio: new FormControl(),
      fechaFin: new FormControl(),
      antiguedadAntAnio: new FormControl(),
      antiguedadAntMes: new FormControl(),
      domicilio: new FormControl(),
      esJubilado: new FormControl(),
      esMensualizado: new FormControl(),
      categoria: new FormControl(),
      obraSocial: new FormControl(),
      sindicato: new FormControl(),
      seguridadSocial: new FormControl(),
      afipSituacion: new FormControl(),
      afipCondicion: new FormControl(),
      afipActividad: new FormControl(),
      afipModContratacion: new FormControl(),
      afipLocalidad: new FormControl(),
      afipSiniestrado: new FormControl(),
      adherenteObraSocial: new FormControl(),
      aporteAdicObraSocial: new FormControl(),
      contribAdicObraSocial: new FormControl(),
      aporteAdicSegSoc: new FormControl(),
      aporteDifSegSoc: new FormControl(),
      contribTareaDifSegSoc: new FormControl(),
      enConvenioColectivo: new FormControl(),
      conCoberturaSCVO: new FormControl(),
      recibeAdelanto: new FormControl(),
      recibePrestamo: new FormControl(),
      cuotasPrestamo: new FormControl(),
      usuarioAlta: new FormControl(),
      usuarioBaja: new FormControl(),
      usuarioMod: new FormControl(),
      vtoLicenciaConducir: new FormControl(),
      vtoCursoCNRT: new FormControl(),
      vtoLNH: new FormControl(),
      vtoLibretaSanidad: new FormControl(),
      usuarioModLC: new FormControl(),
      usuarioModCNRT: new FormControl(),
      usuarioModLNH: new FormControl(),
      usuarioModLS: new FormControl(),
      fechaModLC: new FormControl(),
      fechaModCNRT: new FormControl(),
      fechaModLNH: new FormControl(),
      fechaModLS: new FormControl(),
      talleCamisa: new FormControl(),
      tallePantalon: new FormControl(),
      talleCalzado: new FormControl(),
      turnoMEntrada: new FormControl(),
      turnoMSalida: new FormControl(),
      turnoTEntrada: new FormControl(),
      turnoTSalida: new FormControl(),
      turnoNEntrada: new FormControl(),
      turnoNSalida: new FormControl(),
      turnoSEntrada: new FormControl(),
      turnoSSalida: new FormControl(),
      turnoDEntrada: new FormControl(),
      turnoDSalida: new FormControl(),
      turnoRotativo: new FormControl(),
      turnoFueraConvenio: new FormControl(),
      telefonoMovilEmpresa: new FormControl(),
      telefonoMovilFechaEntrega: new FormControl(),
      telefonoMovilFechaDevolucion: new FormControl(),
      telefonoMovilObservacion: new FormControl(),
      esChofer: new FormControl(),
      esChoferLargaDistancia: new FormControl(),
      esAcompReparto: new FormControl(),
      observaciones: new FormControl(),
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
  //Agrega un registro
  private agregar(elemento) {
    elemento.usuarioAlta = this.appComponent.getUsuario();
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
