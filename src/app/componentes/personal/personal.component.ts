import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Personal } from 'src/app/modelos/personal';
import { MatSort, MatTableDataSource } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { FotoService } from 'src/app/servicios/foto.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { Pdf } from 'src/app/modelos/pdf';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de sexos
  public sexos: Array<any> = [];
  //Define la lista de estados civiles
  public estadosCiviles: Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de areas
  public areas: Array<any> = [];
  //Define la lista de sindicatos
  public sindicatos: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento: FormControl = new FormControl();
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda de barrios
  public resultadosBarrios: Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de categorias
  public resultadosCategorias: Array<any> = [];
  //Define la lista de resultados de busqueda de seguridad social
  public resultadosSeguridadesSociales: Array<any> = [];
  //Define la lista de resultados de busqueda de obra social
  public resultadosObrasSociales: Array<any> = [];
  //Define la lista de resultados de busqueda de afip actividad
  public resultadosAfipActividades: Array<any> = [];
  //Define la lista de resultados de busqueda de afip condicion
  public resultadosAfipCondiciones: Array<any> = [];
  //Define la lista de resultados de busqueda de afip localidad
  public resultadosAfipLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de afip mod contratacion
  public resultadosAfipModContrataciones: Array<any> = [];
  //Define la lista de resultados de busqueda de afip siniestrado
  public resultadosAfipSiniestrados: Array<any> = [];
  //Define la lista de resultados de busqueda de afip situacion
  public resultadosAfipSituaciones: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'nombre', 'tipoDocumento', 'documento', 'telefonoMovil', 'domicilio', 'localidad', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define los botones para los pdf
  public btnPdfLicConducir: boolean = null;
  public btnPdfLibSanidad: boolean = null;
  public btnPdflinti: boolean = null;
  //Constructor
  constructor(private servicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService, private personal: Personal,
    private appService: AppService, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private sexoServicio: SexoService, private loaderService: LoaderService,
    private estadoCivilServicio: EstadoCivilService, private tipoDocumentoServicio: TipoDocumentoService,
    private sucursalServicio: SucursalService, private areaServicio: AreaService,
    private categoriaServicio: CategoriaService, private sindicatoServicio: SindicatoService,
    private seguridadSocialServicio: SeguridadSocialService, private obraSocialServicio: ObraSocialService,
    private afipActividadServicio: AfipActividadService, private afipCondicionServicio: AfipCondicionService,
    private afipLocalidadServicio: AfipLocalidadService, private afipModContratacionServicio: AfipModContratacionService,
    private afipSiniestradoServicio: AfipSiniestradoService, private afipSituacionServicio: AfipSituacionService,
    private fotoService: FotoService, private pdfServicio: PdfService, private pdf: Pdf) {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    this.loaderService.show();
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
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
    this.rolOpcionServicio.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.opciones = res.json();
          this.loaderService.hide();
        },
        err => {
          console.log(err);
          this.loaderService.hide();
        }
      );
    //Se subscribe al servicio de lista de registros
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = new MatTableDataSource(res);
    //   this.listaCompleta.sort = this.sort;
    // });
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.personal.formulario;
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (data && typeof data == 'string' && data.length > 2) {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        });
      } else {
        this.resultadosLocalidades = [];
      }
    })
    //Autocompletado Localidad Nacimiento - Buscar por nombre
    this.formulario.get('localidadNacimiento').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Categoria - Buscar por nombre
    this.categoriaServicio.listar().subscribe(response => {
      this.resultadosCategorias = response.json();
    })
    //Autocompletado Seguridad Social - Buscar por nombre
    this.seguridadSocialServicio.listar().subscribe(response => {
      this.resultadosSeguridadesSociales = response.json();
    })
    //Autocompletado Obra Social - Buscar por nombre
    this.obraSocialServicio.listar().subscribe(response => {
      this.resultadosObrasSociales = response.json();
    })
    //Autocompletado Afip Actividad - Buscar por nombre
    this.afipActividadServicio.listar().subscribe(response => {
      this.resultadosAfipActividades = response.json();
    })
    //Autocompletado Afip Condicion - Buscar por nombre
    this.afipCondicionServicio.listar().subscribe(response => {
      this.resultadosAfipCondiciones = response.json();
    })
    //Autocompletado Afip Localidad - Buscar por nombre
    this.afipLocalidadServicio.listar().subscribe(response => {
      this.resultadosAfipLocalidades = response.json();
    })
    //Autocompletado Afip Mod Contratacion - Buscar por nombre
    this.afipModContratacionServicio.listar().subscribe(response => {
      this.resultadosAfipModContrataciones = response.json();
    })
    //Autocompletado Afip Siniestrado - Buscar por nombre
    this.afipSiniestradoServicio.listar().subscribe(response => {
      this.resultadosAfipSiniestrados = response.json();
    })
    //Autocompletado Afip Situacion - Buscar por nombre
    this.afipSituacionServicio.listar().subscribe(response => {
      this.resultadosAfipSituaciones = response.json();
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(15, 0);
    //Obtiene la lista completa de registros
    //this.listar();
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
    //Obtiene la foto por defecto
    this.obtenerFotoPorDefecto();
    //Establece los valores por defecto
    // this.establecerValoresPorDefecto();
  }
  //Obtiene la foto por defecto
  private obtenerFotoPorDefecto(): void {
    this.fotoService.obtenerPorId(1).subscribe(res => {
      let respuesta = res.json();
      this.formulario.get('foto').setValue(respuesta);
      this.formulario.get('foto.nombre').setValue(null);
      this.formulario.get('foto.datos').setValue(atob(this.formulario.get('foto.datos').value));
    });
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appServicio.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appServicio.mascararPorcentaje();
  }
  //Obtiene la mascara de hora-minuto
  public mascararHora() {
    return this.appServicio.mascararHora();
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.desenmascararPorcentaje(valor, cantidad));
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('esAcompReparto').setValue(false);
    this.formulario.get('recibeAdelanto').setValue(false);
    this.formulario.get('recibePrestamo').setValue(false);
    this.formulario.get('cuotasPrestamo').setValue(1);
    this.formulario.get('esChofer').setValue(false);
    this.formulario.get('esChoferLargaDistancia').setValue(false);
    this.formulario.get('esChoferLargaDistancia').disable();
    this.formulario.get('enConvenioColectivo').setValue(true);
    this.formulario.get('conCoberturaSCVO').setValue(true);
    this.formulario.get('vtoLicenciaConducir').disable();
    this.formulario.get('vtoCurso').disable();
    this.formulario.get('vtoCursoCargaPeligrosa').disable();
    this.formulario.get('vtoLINTI').disable();
    this.formulario.get('vtoLibretaSanidad').disable();
    this.formulario.get('vtoPsicoFisico').disable();
    this.cambioEsChofer();
  }
  //Al cambiar elemento de select esChofer
  public cambioEsChofer(): void {
    let esChofer = this.formulario.get('esChofer').value;
    let esChoferLargaDistancia = this.formulario.get('esChoferLargaDistancia').value;
    if (esChofer && esChoferLargaDistancia) {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').enable();
      this.formulario.get('vtoLibretaSanidad').enable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.btnPdfLibSanidad = true;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = true;
    } else if (esChofer && !esChoferLargaDistancia) {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
      this.btnPdfLibSanidad = false;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = false;
    } else {
      this.formulario.get('vtoLicenciaConducir').disable();
      this.formulario.get('vtoCurso').disable();
      this.formulario.get('vtoCursoCargaPeligrosa').disable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
      this.formulario.get('vtoPsicoFisico').disable();
      this.formulario.get('esChoferLargaDistancia').disable();
      this.formulario.get('esChoferLargaDistancia').setValue(false);
      this.btnPdfLibSanidad = false;
      this.btnPdfLicConducir = false;
      this.btnPdflinti = false;
    }
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
        this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
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
  private establecerEstadoCampos(estado, opcionPestania) {
    if (estado) {
      this.formulario.get('sexo').enable();
      this.formulario.get('estadoCivil').enable();
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('sucursal').enable();
      this.formulario.get('area').enable();
      this.formulario.get('sindicato').enable();
      this.formulario.get('esAcompReparto').enable();
      this.formulario.get('enConvenioColectivo').enable();
      this.formulario.get('conCoberturaSCVO').enable();
      this.formulario.get('recibeAdelanto').enable();
      this.formulario.get('recibePrestamo').enable();
      this.formulario.get('esChofer').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
      this.formulario.get('turnoRotativo').enable();
      this.formulario.get('turnoFueraConvenio').enable();
      this.formulario.get('seguridadSocial').enable();
      this.formulario.get('afipSituacion').enable();
      this.formulario.get('afipCondicion').enable();
      this.formulario.get('afipActividad').enable();
      this.formulario.get('afipModContratacion').enable();
      this.formulario.get('afipSiniestrado').enable();
      this.formulario.get('afipLocalidad').enable();
      this.formulario.get('obraSocial').enable();
      if (opcionPestania == 3) {
        this.formulario.get('fechaFin').enable();
      } else {
        this.formulario.get('fechaFin').disable();
      }
    } else {
      this.formulario.get('sexo').disable();
      this.formulario.get('estadoCivil').disable();
      this.formulario.get('tipoDocumento').disable();
      this.formulario.get('sucursal').disable();
      this.formulario.get('area').disable();
      this.formulario.get('sindicato').disable();
      this.formulario.get('esAcompReparto').disable();
      this.formulario.get('enConvenioColectivo').disable();
      this.formulario.get('conCoberturaSCVO').disable();
      this.formulario.get('recibeAdelanto').disable();
      this.formulario.get('recibePrestamo').disable();
      this.formulario.get('esChofer').disable();
      this.formulario.get('esChoferLargaDistancia').disable();
      this.formulario.get('turnoRotativo').disable();
      this.formulario.get('turnoFueraConvenio').disable();
      this.formulario.get('seguridadSocial').disable();
      this.formulario.get('afipSituacion').disable();
      this.formulario.get('afipCondicion').disable();
      this.formulario.get('afipActividad').disable();
      this.formulario.get('afipModContratacion').disable();
      this.formulario.get('afipSiniestrado').disable();
      this.formulario.get('afipLocalidad').disable();
      this.formulario.get('obraSocial').disable();
    }
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    let pdf = {
      id: null,
      version: null,
      nombre: null,
      tipo: null,
      tamanio: null,
      datos: null,
      tabla: null
    }
    if (elemAutocompletado.pdfAltaTemprana == null) {
      elemAutocompletado.pdfAltaTemprana = pdf;
    }
    if (elemAutocompletado.pdfDni == null) {
      elemAutocompletado.pdfDni = pdf;
    }
    if (elemAutocompletado.pdfLibSanidad == null) {
      elemAutocompletado.pdfLibSanidad = pdf;
    }
    if (elemAutocompletado.pdfLicConducir == null) {
      elemAutocompletado.pdfLicConducir = pdf;
    }
    if (elemAutocompletado.pdfLinti == null) {
      elemAutocompletado.pdfLinti = pdf;
    }
    if (elemAutocompletado.foto == null) {
      elemAutocompletado.foto = pdf;
    }
    this.formulario.patchValue(elemAutocompletado);
    this.nacionalidadNacimiento.setValue(elemAutocompletado.localidadNacimiento.provincia.pais.nombre);
    this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
    this.formulario.get('fechaInicio').setValue(elemAutocompletado.fechaInicio.substring(0, 10));
    this.formulario.get('aporteAdicObraSocial').setValue(this.appServicio.establecerDecimales(elemAutocompletado.aporteAdicObraSocial, 2));
    this.formulario.get('contribAdicObraSocial').setValue(this.appServicio.establecerDecimales(elemAutocompletado.contribAdicObraSocial, 2));
    this.formulario.get('aporteAdicSegSoc').setValue(this.appServicio.establecerDecimales(elemAutocompletado.aporteAdicSegSoc, 2));
    this.formulario.get('aporteDifSegSoc').setValue(this.appServicio.establecerDecimales(elemAutocompletado.aporteDifSegSoc, 2));
    this.formulario.get('contribTareaDifSegSoc').setValue(this.appServicio.establecerDecimales(elemAutocompletado.contribTareaDifSegSoc, 2));
    this.formulario.get('contribTareaDifSegSoc').setValue(this.appServicio.establecerDecimales(elemAutocompletado.contribTareaDifSegSoc, 2));
    if (elemAutocompletado.fechaFin != null) {
      this.formulario.get('fechaFin').setValue(elemAutocompletado.fechaFin.substring(0, 10));
    }
    if (elemAutocompletado.vtoLicenciaConducir != null) {
      this.formulario.get('vtoLicenciaConducir').setValue(elemAutocompletado.vtoLicenciaConducir.substring(0, 10));
    }
    if (elemAutocompletado.vtoCurso != null) {
      this.formulario.get('vtoCurso').setValue(elemAutocompletado.vtoCurso.substring(0, 10));
    }
    if (elemAutocompletado.vtoCursoCargaPeligrosa != null) {
      this.formulario.get('vtoCursoCargaPeligrosa').setValue(elemAutocompletado.vtoCursoCargaPeligrosa.substring(0, 10));
    }
    if (elemAutocompletado.vtoLINTI != null) {
      this.formulario.get('vtoLINTI').setValue(elemAutocompletado.vtoLINTI.substring(0, 10));
    }
    if (elemAutocompletado.vtoLibretaSanidad != null) {
      this.formulario.get('vtoLibretaSanidad').setValue(elemAutocompletado.vtoLibretaSanidad.substring(0, 10));
    }
    if (elemAutocompletado.telefonoMovilFechaEntrega != null) {
      this.formulario.get('telefonoMovilFechaEntrega').setValue(elemAutocompletado.telefonoMovilFechaEntrega.substring(0, 10));
    }
    if (elemAutocompletado.telefonoMovilFechaDevolucion != null) {
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
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(true, 1);
        this.establecerValoresPestania(nombre, false, false, true, 'idApellido');
        break;
      case 2:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(false, 2);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(true, 3);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(false, 4);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch (opcion) {
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
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
    this.servicio.agregar(this.formulario.value).then(
      res => {
        var respuesta = res.json();
        if (res.status == 201) {
          respuesta.then(data => {
            this.reestablecerFormulario(data.id);
            this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
            setTimeout(function () {
              document.getElementById('idApellido').focus();
            }, 20);
            this.toastr.success(data.mensaje);
          },
            err => {
              console.log(err.json());
            })
        } else {
          respuesta.then(err => {
            this.toastr.error(err.mensaje);
          })
        }
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
    this.servicio.actualizar(this.formulario.value).then(
      res => {
        var respuesta = res.json();
        if (res.status == 200) {
          respuesta.then(data => {
            this.reestablecerFormulario(data.id);
            setTimeout(function () {
              document.getElementById('idAutocompletado').focus();
            }, 20);
            this.toastr.success(data.mensaje);
            this.loaderService.hide();
          })
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
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
    var respuesta = err;
    try {
      if (respuesta.codigo == 11010) {
        document.getElementById("labelNumeroDocumento").classList.add('label-error');
        document.getElementById("idNumeroDocumento").classList.add('is-invalid');
        document.getElementById("idNumeroDocumento").focus();
      } else if (respuesta.codigo == 11012) {
        document.getElementById("labelCuil").classList.add('label-error');
        document.getElementById("idCuil").classList.add('is-invalid');
        document.getElementById("idCuil").focus();
      } else if (respuesta.codigo == 11013) {
        document.getElementById("labelTelefonoFijo").classList.add('label-error');
        document.getElementById("idTelefonoFijo").classList.add('is-invalid');
        document.getElementById("idTelefonoFijo").focus();
      } else if (respuesta.codigo == 11014) {
        document.getElementById("labelTelefonoMovil").classList.add('label-error');
        document.getElementById("idTelefonoMovil").classList.add('is-invalid');
        document.getElementById("idTelefonoMovil").focus();
      } else if (respuesta.codigo == 11003) {
        document.getElementById("labelCorreoelectronico").classList.add('label-error');
        document.getElementById("idCorreoelectronico").classList.add('is-invalid');
        document.getElementById("idCorreoelectronico").focus();
      } else if (respuesta.codigo == 11015) {
        document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
        document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
        document.getElementById("idTelefonoMovilEmpresa").focus();
      }
    } catch (e) { }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'telefonoFijo') {
          document.getElementById("labelTelefonoFijo").classList.add('label-error');
          document.getElementById("idTelefonoFijo").classList.add('is-invalid');
          this.toastr.error('Telefono Fijo incorrecto');
        } else if (campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil incorrecto');
        } else if (campo == 'telefonoMovilEmpresa') {
          document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
          document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Empresa incorrecto');
        } else if (campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico incorrecto');
        }
      }
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          let respuesta = this.appServicio.validarCUIT(documento.toString());
          if (!respuesta) {
            let err = { codigo: 11007, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appServicio.validarCUIT(documento.toString());
          if (!respuesta2) {
            let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appServicio.validarDNI(documento.toString());
          if (!respuesta8) {
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Valida el CUIL
  public validarCUIL(): void {
    let cuil = this.formulario.get('cuil').value;
    if (cuil) {
      let respuesta = this.appServicio.validarCUIT(cuil + '');
      if (!respuesta) {
        let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
        this.lanzarError(err);
      }
    }
  }
  //Carga la imagen del personal
  public readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let foto = {
          id: this.formulario.get('foto.id').value ? this.formulario.get('foto.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get('foto').patchValue(foto);
      }
      reader.readAsDataURL(file);
    }
  }
  //Elimina la foto del personal
  public eliminarFoto(campo) {
    if (!this.formulario.get(campo).value) {
      this.toastr.error("Sin foto adjunta");
    } else {
      this.formulario.get(campo).setValue('');
    }
  }
  //Carga el archivo PDF 
  public readPdfURL(event, campo): void {
    let file = event.target.files[0];
    let extension = file.name.split('.');
    extension = extension[extension.length - 1];
    if (event.target.files && event.target.files[0] && extension == 'pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get(campo).patchValue(pdf);
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .pdf");
    }
  }
  //Elimina un pdf ya cargado, se pasa el campo como parametro
  public eliminarPdf(campo) {
    if (!this.formulario.get(campo).value) {
      this.toastr.success("Sin archivo adjunto");
    } else {
      this.formulario.get(campo).setValue('');
    }
  }
  //Obtiene el pdf para mostrarlo
  public obtenerPDF(id, nombre) {
    if (this.formulario.get(id).value) {
      this.pdfServicio.obtenerPorId(this.formulario.get(id).value).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          nombre: resultado.nombre,
          datos: atob(resultado.datos)
        }
        this.formulario.get(nombre).patchValue(pdf);
      })
    }
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(pdf) {
    let datos = this.formulario.get(pdf).value;
    window.open(datos, '_blank');
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
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFd(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.codigoAfip + ' - ' + elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFe(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    var opcion = this.opcionSeleccionada;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    } else if (keycode == 115) {
      if (opcion < this.opciones[(this.opciones.length - 1)].id) {
        this.seleccionarOpcion(opcion + 1, opcion - 14);
      } else {
        this.seleccionarOpcion(15, 0);
      }
    }
  }
}