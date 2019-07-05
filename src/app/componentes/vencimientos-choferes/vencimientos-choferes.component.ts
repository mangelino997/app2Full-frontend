import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { Personal } from 'src/app/modelos/personal';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { AppComponent } from 'src/app/app.component';
import { LoaderState } from 'src/app/modelos/loader';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { PdfService } from 'src/app/servicios/pdf.service';

@Component({
  selector: 'app-vencimientos-choferes',
  templateUrl: './vencimientos-choferes.component.html',
  styleUrls: ['./vencimientos-choferes.component.css']
})
export class VencimientosChoferesComponent implements OnInit {

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
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda para el campo Personal
  public resultadosPersonal: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['legajo', 'nombre', 'esChofer', 'choferLargaDistancia', 'vtoLicencia', 'vtoCurso', 'vtoCursoCargaPeligrosa', 'vtoCursoLINTI', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento: FormControl = new FormControl();
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el form control para las busquedas
  public autocompletadoListar: FormControl = new FormControl();
  //Define los botones para los pdf
  public btnPdfLicConducir: boolean = null;
  public btnPdfLibSanidad: boolean = null;
  public btnPdflinti: boolean = null;
  //Constructor
  constructor(private personalServicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private personal: Personal, private toastr: ToastrService,  private pdfService: PdfService,
    private loaderService: LoaderService, private appComponent: AppComponent, private tipoDocumentoServicio: TipoDocumentoService) {
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
            this.loaderService.hide();
          },
          err => {
            console.log(err);
          }
        );
      let empresa = this.appComponent.getEmpresa();
      //Autocompletado - Buscar por alias
      this.autocompletado.valueChanges.subscribe(data => {
        if (typeof data == 'string' && data.length > 2) {
          this.personalServicio.listarPorAliasYEmpresa(data, empresa.id).subscribe(response => {
            console.log(response);
            this.resultadosPersonal = response;
          })
        }
      })
  }

  ngOnInit() {
    //Define el Formulario
    this.formulario = this.personal.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de Choferes
    this.listar();
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
  //Obtiene la lista de Choferes por Empresa logueada
  private listar(){
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
    this.personalServicio.listarChoferesPorEmpresa(empresa.id).subscribe(
      res=>{
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );

  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idPersonal');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, true, true, 'idPersonal');
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosPersonal = [];
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.autocompletadoListar.setValue(undefined);
    this.nacionalidadNacimiento.setValue(undefined);
    this.vaciarListas();
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado, opcionPestania) {
    if (estado) {
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('esChofer').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
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
      this.pdfService.obtenerPorId(this.formulario.get(id).value).subscribe(res => {
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
    this.formulario.patchValue(elemento);

  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    console.log(elemento);
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    
  }
  //Valida el CUIL
  public validarCUIL(): void {
    let cuil = this.formulario.get('cuil').value;
    if (cuil) {
      let respuesta = this.appService.validarCUIT(cuil + '');
      if (!respuesta) {
        let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
        this.lanzarError(err);
      }
    }
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
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
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            let err = { codigo: 11007, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if (!respuesta2) {
            let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if (!respuesta8) {
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    this.formulario.setValue(elemAutocompletado);
    this.nacionalidadNacimiento.setValue(elemAutocompletado.localidadNacimiento.provincia.pais.nombre);
    this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
    this.formulario.get('fechaInicio').setValue(elemAutocompletado.fechaInicio.substring(0, 10));
    this.formulario.get('aporteAdicObraSocial').setValue(this.appService.establecerDecimales(elemAutocompletado.aporteAdicObraSocial, 2));
    this.formulario.get('contribAdicObraSocial').setValue(this.appService.establecerDecimales(elemAutocompletado.contribAdicObraSocial, 2));
    this.formulario.get('aporteAdicSegSoc').setValue(this.appService.establecerDecimales(elemAutocompletado.aporteAdicSegSoc, 2));
    this.formulario.get('aporteDifSegSoc').setValue(this.appService.establecerDecimales(elemAutocompletado.aporteDifSegSoc, 2));
    this.formulario.get('contribTareaDifSegSoc').setValue(this.appService.establecerDecimales(elemAutocompletado.contribTareaDifSegSoc, 2));
    this.formulario.get('contribTareaDifSegSoc').setValue(this.appService.establecerDecimales(elemAutocompletado.contribTareaDifSegSoc, 2));
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
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
}
