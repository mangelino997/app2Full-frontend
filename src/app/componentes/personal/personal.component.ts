import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../servicios/personal.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html'
})
export class PersonalComponent implements OnInit {
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
  //Define la lista de opciones
  public opciones:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define la opcion seleccionada
  public opcionSeleccionada:number = null;
  //Define la lista de sexos
  public sexos:Array<any> = [];
  //Define la lista de estados civiles
  public estadosCiviles:Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos:Array<any> = [];
  //Define la lista de sucursales
  public sucursales:Array<any> = [];
  //Define la lista de areas
  public areas:Array<any> = [];
  //Define la lista de sindicatos
  public sindicatos:Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo:boolean = null;
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento:FormControl = new FormControl();
  //Define el form control para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda de barrios
  public resultadosBarrios:Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades:Array<any> = [];
  //Define la lista de resultados de busqueda de categorias
  public resultadosCategorias:Array<any> = [];
  //Define la lista de resultados de busqueda de seguridad social
  public resultadosSeguridadesSociales:Array<any> = [];
  //Define la lista de resultados de busqueda de obra social
  public resultadosObrasSociales:Array<any> = [];
  //Define la lista de resultados de busqueda de afip actividad
  public resultadosAfipActividades:Array<any> = [];
  //Define la lista de resultados de busqueda de afip condicion
  public resultadosAfipCondiciones:Array<any> = [];
  //Define la lista de resultados de busqueda de afip localidad
  public resultadosAfipLocalidades:Array<any> = [];
  //Define la lista de resultados de busqueda de afip mod contratacion
  public resultadosAfipModContrataciones:Array<any> = [];
  //Define la lista de resultados de busqueda de afip siniestrado
  public resultadosAfipSiniestrados:Array<any> = [];
  //Define la lista de resultados de busqueda de afip situacion
  public resultadosAfipSituaciones:Array<any> = [];
  //Constructor
  constructor(private servicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService,
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
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorAlias(data).subscribe(response =>{
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
      nombre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      apellido: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      nombreCompleto: new FormControl('', [Validators.maxLength(40)]),
      tipoDocumento: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(11)]),
      cuil: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(11)]),
      empresa: new FormControl(),
      barrio: new FormControl(),
      localidad: new FormControl('', Validators.required),
      localidadNacimiento: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      telefonoFijo: new FormControl('', Validators.maxLength(45)),
      telefonoMovil: new FormControl('', Validators.maxLength(45)),
      estadoCivil: new FormControl('', Validators.required),
      correoelectronico: new FormControl('', Validators.maxLength(30)),
      sexo: new FormControl('', Validators.required),
      sucursal: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl(),
      antiguedadAntAnio: new FormControl('', [Validators.min(1), Validators.maxLength(5)]),
      antiguedadAntMes: new FormControl('', [Validators.min(1), Validators.maxLength(5)]),
      domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      esJubilado: new FormControl(),
      esMensualizado: new FormControl(),
      categoria: new FormControl('', Validators.required),
      obraSocial: new FormControl('', Validators.required),
      sindicato: new FormControl('', Validators.required),
      seguridadSocial: new FormControl('', Validators.required),
      afipSituacion: new FormControl('', Validators.required),
      afipCondicion: new FormControl('', Validators.required),
      afipActividad: new FormControl('', Validators.required),
      afipModContratacion: new FormControl('', Validators.required),
      afipLocalidad: new FormControl('', Validators.required),
      afipSiniestrado: new FormControl('', Validators.required),
      adherenteObraSocial: new FormControl('', [Validators.min(1), Validators.maxLength(2)]),
      aporteAdicObraSocial: new FormControl('', [Validators.min(1), Validators.maxLength(10)]),
      contribAdicObraSocial: new FormControl('', [Validators.min(1), Validators.maxLength(10)]),
      aporteAdicSegSoc: new FormControl('', [Validators.min(1), Validators.maxLength(4)]),
      aporteDifSegSoc: new FormControl('', [Validators.min(1), Validators.maxLength(4)]),
      contribTareaDifSegSoc: new FormControl('', [Validators.min(1), Validators.maxLength(4)]),
      enConvenioColectivo: new FormControl('', Validators.required),
      conCoberturaSCVO: new FormControl('', Validators.required),
      recibeAdelanto: new FormControl('', Validators.required),
      recibePrestamo: new FormControl('', Validators.required),
      cuotasPrestamo: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(2)]),
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
      talleCamisa: new FormControl('', Validators.maxLength(20)),
      tallePantalon: new FormControl('', Validators.maxLength(20)),
      talleCalzado: new FormControl('', Validators.maxLength(20)),
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
      telefonoMovilEmpresa: new FormControl('', Validators.maxLength(45)),
      telefonoMovilFechaEntrega: new FormControl(),
      telefonoMovilFechaDevolucion: new FormControl(),
      telefonoMovilObservacion: new FormControl('', Validators.maxLength(100)),
      esChofer: new FormControl('', Validators.required),
      esChoferLargaDistancia: new FormControl('', Validators.required),
      esAcompReparto: new FormControl('', Validators.required),
      observaciones: new FormControl('', Validators.maxLength(200)),
      alias: new FormControl('', Validators.maxLength(100))
    });
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Localidad Nacimiento - Buscar por nombre
    this.formulario.get('localidadNacimiento').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Categoria - Buscar por nombre
    this.formulario.get('categoria').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.categoriaServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCategorias = response;
        })
      }
    })
    //Autocompletado Seguridad Social - Buscar por nombre
    this.formulario.get('seguridadSocial').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.seguridadSocialServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosSeguridadesSociales = response;
        })
      }
    })
    //Autocompletado Obra Social - Buscar por nombre
    this.formulario.get('obraSocial').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.obraSocialServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosObrasSociales = response;
        })
      }
    })
    //Autocompletado Afip Actividad - Buscar por nombre
    this.formulario.get('afipActividad').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipActividadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipActividades = response;
        })
      }
    })
    //Autocompletado Afip Condicion - Buscar por nombre
    this.formulario.get('afipCondicion').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipCondicionServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipCondiciones = response;
        })
      }
    })
    //Autocompletado Afip Localidad - Buscar por nombre
    this.formulario.get('afipLocalidad').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipLocalidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipLocalidades = response;
        })
      }
    })
    //Autocompletado Afip Mod Contratacion - Buscar por nombre
    this.formulario.get('afipModContratacion').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipModContratacionServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipModContrataciones = response;
        })
      }
    })
    //Autocompletado Afip Siniestrado - Buscar por nombre
    this.formulario.get('afipSiniestrado').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipSiniestradoServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipSiniestrados = response;
        })
      }
    })
    //Autocompletado Afip Situacion - Buscar por nombre
    this.formulario.get('afipSituacion').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.afipSituacionServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosAfipSituaciones = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(15, 0);
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
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('aporteAdicObraSocial').setValue('0.00');
    this.formulario.get('contribAdicObraSocial').setValue('0.00');
    this.formulario.get('aporteAdicSegSoc').setValue('0.00');
    this.formulario.get('aporteDifSegSoc').setValue('0.00');
    this.formulario.get('contribTareaDifSegSoc').setValue('0.00');
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
  private vaciarListas() {
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
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('sexo').enabled;
      this.formulario.get('estadoCivil').enabled;
      this.formulario.get('tipoDocumento').enabled;
      this.formulario.get('sucursal').enabled;
      this.formulario.get('area').enabled;
      this.formulario.get('sindicato').enabled;
      this.formulario.get('esAcompReparto').enabled;
      this.formulario.get('enConvenioColectivo').enabled;
      this.formulario.get('conCoberturaSCVO').enabled;
      this.formulario.get('recibeAdelanto').enabled;
      this.formulario.get('recibePrestamo').enabled;
      this.formulario.get('esChofer').enabled;
      this.formulario.get('esChoferLargaDistancia').enabled;
      this.formulario.get('turnoRotativo').enabled;
      this.formulario.get('turnoFueraConvenio').enabled;
    } else {
      this.formulario.get('sexo').disabled;
      this.formulario.get('estadoCivil').disabled;
      this.formulario.get('tipoDocumento').disabled;
      this.formulario.get('sucursal').disabled;
      this.formulario.get('area').disabled;
      this.formulario.get('sindicato').disabled;
      this.formulario.get('esAcompReparto').disabled;
      this.formulario.get('enConvenioColectivo').disabled;
      this.formulario.get('conCoberturaSCVO').disabled;
      this.formulario.get('recibeAdelanto').disabled;
      this.formulario.get('recibePrestamo').disabled;
      this.formulario.get('esChofer').disabled;
      this.formulario.get('esChoferLargaDistancia').disabled;
      this.formulario.get('turnoRotativo').disabled;
      this.formulario.get('turnoFueraConvenio').disabled;
    }
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.formulario.setValue(elemAutocompletado);
   this.nacionalidadNacimiento.setValue(elemAutocompletado.localidadNacimiento.provincia.pais.nombre);
   this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
   this.formulario.get('fechaInicio').setValue(elemAutocompletado.fechaInicio.substring(0, 10));
   if(elemAutocompletado.fechaFin != null) {
     this.formulario.get('fechaFin').setValue(elemAutocompletado.fechaFin.substring(0, 10));
   }
   if(elemAutocompletado.vtoLicenciaConducir != null) {
     this.formulario.get('vtoLicenciaConducir').setValue(elemAutocompletado.vtoLicenciaConducir.substring(0, 10));
   }
   if(elemAutocompletado.vtoCursoCNRT != null) {
     this.formulario.get('vtoCursoCNRT').setValue(elemAutocompletado.vtoCursoCNRT.substring(0, 10));
   }
   if(elemAutocompletado.vtoLNH != null) {
     this.formulario.get('vtoLNH').setValue(elemAutocompletado.vtoLNH.substring(0, 10));
   }
   if(elemAutocompletado.vtoLibretaSanidad != null) {
     this.formulario.get('vtoLibretaSanidad').setValue(elemAutocompletado.vtoLibretaSanidad.substring(0, 10));
   }
   if(elemAutocompletado.telefonoMovilFechaEntrega != null) {
     this.formulario.get('telefonoMovilFechaEntrega').setValue(elemAutocompletado.telefonoMovilFechaEntrega.substring(0, 10));
   }
   if(elemAutocompletado.telefonoMovilFechaDevolucion != null) {
     this.formulario.get('telefonoMovilFechaDevolucion').setValue(elemAutocompletado.telefonoMovilFechaDevolucion.substring(0, 10));
   }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idApellido');
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
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
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
  private actualizar() {
    this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
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
        this.lanzarError(err);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.nacionalidadNacimiento.setValue(undefined);
    this.vaciarListas();
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
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if(valor != undefined && valor != null && valor != '') {
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
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
  }
  //Establece la nacionalidad
  public establecerNacionalidad(localidad) {
    this.nacionalidadNacimiento.setValue(localidad.provincia.pais.nombre);
  }
  //Define el mostrado de datos y comparacion en campo select
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
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Si' : 'No';
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
