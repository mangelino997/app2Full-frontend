import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
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
import { PdfDialogoComponent } from '../pdf-dialogo/pdf-dialogo.component';
import { BugImagenDialogoComponent } from '../bugImagen-dialogo/bug-imagen-dialogo.component';

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
  public columnas: string[] = ['legajo', 'nombre', 'choferLargaDistancia', 'vtoLicencia', 'vtoCurso', 'vtoCursoCargaPeligrosa', 'vtoCursoLINTI', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el form control para las busquedas
  public tipoDocumento: FormControl = new FormControl();
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento: FormControl = new FormControl();
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define si es o no chofer 
  public chofer: string = '';
  //Define si es o no chofer larga distancia
  public choferLargaDistancia: string = '';
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el form control para las busquedas
  public autocompletadoListar: FormControl = new FormControl();
  //Define los botones para los pdf
  public btnPdfLicConducir: boolean = null;
  public btnPdfLibSanidad: boolean = null;
  public btnPdflinti: boolean = null;
  public listaChoferes: Array<any> = [];
  //Constructor
  constructor(private personalServicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService, public dialog: MatDialog,
    private appService: AppService, private personal: Personal, private toastr: ToastrService, private pdfService: PdfService,
    private loaderService: LoaderService, private appComponent: AppComponent, private tipoDocumentoServicio: TipoDocumentoService) {

//Autocompletado - Buscar por alias
this.autocompletado.valueChanges.subscribe(data => {
  if (typeof data == 'string' && data.length > 2) {
    this.personalServicio.listarPorAlias(data).subscribe(response => {
      this.resultados = response;
    })
  }
})
}
  ngOnInit() {
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

          console.log(this.pestanias);
        },
        err => {
          console.log(err);
        }
      );
    //Define el Formulario
    this.formulario = this.personal.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Actualizar', 0);
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de Choferes
    this.listar();

  }

  //Setea si es chofer y si es chofer larga distancia
  // private obtenerSiEsChoferYChoferLargaDistancia() {
  //   if(this.formulario.get('esChoferLargaDistancia').value) {
  //     this.choferLargaDistancia = 'Si';
  //   }else {
  //     this.choferLargaDistancia = 'No';
  //   }
  //   if(this.formulario.get('esChofer').value) {
  //     this.chofer = 'Si';
  //   }else {
  //     this.chofer = 'No';
  //   }
  // }
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
  private listar() {
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
    console.log(empresa.id);
    this.personalServicio.listarChoferesPorEmpresa(empresa.id).subscribe(
      res => {
        console.log(res.json());
        if (this.indiceSeleccionado == 5) {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
        } else {
          this.listaChoferes = res.json();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Funcion para determina que accion se requiere (Actualizar)
  public accion(indice) {
    switch (indice) {
      case 3:
        this.actualizar();
        break;
      default:
        break;
    }
  }
  //Al cambiar elemento de select esChofer
  public cambioEsChofer(elemento): void {
    let esChoferLargaDistancia = elemento.esChoferLargaDistancia;
    console.log(esChoferLargaDistancia);
    if (esChoferLargaDistancia) {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').enable();
      this.formulario.get('vtoLibretaSanidad').enable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.btnPdfLibSanidad = true;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = true;
    } else {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.btnPdfLibSanidad = false;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = false;
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.listar();
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 2:
          this.establecerEstadoCampos(false, 2);
        this.establecerValoresPestania(nombre, true, true, false);
        break;
      case 3:
          this.establecerEstadoCampos(true, 3);
        this.establecerValoresPestania(nombre, true, false, true);
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  private establecerEstadoCampos(estado, opcionPestania) {
    if (estado) {
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoLINTI').enable();
      this.formulario.get('vtoLibretaSanidad').enable();
    } else {
      this.formulario.get('vtoPsicoFisico').disable();
      this.formulario.get('vtoCurso').disable();
      this.formulario.get('vtoCursoCargaPeligrosa').disable();
      this.formulario.get('vtoLicenciaConducir').disable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
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
    this.vaciarListas();
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    if (soloLectura) {
      this.formulario.get('esChofer').disable();
      this.formulario.get('esChoferLargaDistancia').disable();
      this.formulario.get('vtoPsicoFisico').disable();
      this.formulario.get('vtoCurso').disable();
      this.formulario.get('vtoCursoCargaPeligrosa').disable();
      this.formulario.get('vtoLicenciaConducir').disable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
    }
    setTimeout(function () {
      document.getElementById('idAutocompletado').focus();
    }, 20);
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
    console.log(elemAutocompletado);
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
    this.tipoDocumento.setValue(elemAutocompletado.tipoDocumento.nombre);
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
  }
  //Carga el pdf
  public readURL(event, nombrePdf): void {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0] && event.target.files[0].type == 'application/pdf'
      || event.target.files[0].type == 'image/jpeg') {
      console.log(event.target.files[0]);
      console.log(event.target.files[0].type);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          nombre: file.name,
          id: this.formulario.get(nombrePdf + '.id').value ? this.formulario.get(nombrePdf + '.id').value : null,
          datos: reader.result
        }
        this.formulario.get(nombrePdf).patchValue(pdf);
        event.target.value = null;
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
  //Obtiene el pdf para mostrarlo
  public obtenerPDF(elemento) {
    let resultadoPdf = {
      id: null,
      version: null,
      nombre: null,
      tipo: null,
      tamanio: null,
      datos: null,
      tabla: null
    };
    if(elemento){
    if (elemento.id) {
      this.pdfService.obtenerPorId(elemento.id).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          version: resultado.version,
          nombre: resultado.nombre,
          tamanio: resultado.tamanio,
          tipo: resultado.tipo,
          tabla: resultado.tabla,
          datos: atob(resultado.datos)
        }
        elemento = pdf;
      })
    }else{
      elemento = resultadoPdf;
    }
    elemento = resultadoPdf;
  }
    return elemento;
  }
  //Obtiene el dni para mostrarlo
  public verDni() {
    this.formulario.get('pdfDni').value;
    if (this.formulario.get('pdfDni.tipo').value == 'application/pdf') {
      this.verPDF('pdfDni');
    } else {
      const dialogRef = this.dialog.open(BugImagenDialogoComponent, {
        width: '95%',
        height: '95%',
        data: {
          nombre: this.formulario.get('pdfDni.nombre').value,
          datos: this.formulario.get('pdfDni.datos').value
        }
      });
      dialogRef.afterClosed().subscribe(resultado => { });
    }
  }
  //Muestra en la pestania buscar,actualizar,eliminar y listar el elemento seleccionado de listar
  public activarVer(elemento) {
    if(elemento.pdfAltaTemprana) {
      elemento.pdfAltaTemprana = this.personal.formulario.get('pdfAltaTemprana');
      this.obtenerPDF(elemento.pdfAltaTemprana);
      this.verPDF('pdfAltaTemprana');
    }
    if(elemento.pdfLibSanidad) {
      elemento.pdfLibSanidad = this.personal.formulario.get('pdfLibSanidad');
      this.obtenerPDF(elemento.pdfLibSanidad);
      this.verPDF('pdfLibSanidad');
    }
    if(elemento.pdfLicConducir) {
      elemento.pdfLicConducir = this.personal.formulario.get('pdfLicConducir');
      this.obtenerPDF(elemento.pdfLicConducir);
      this.verPDF('pdfLicConducir');
    }
    if(elemento.pdfLinti) {
      elemento.pdfLinti = this.personal.formulario.get('pdfLinti');
      this.obtenerPDF(elemento.pdfLinti);
      this.verPDF('pdfLinti');
    }
    if(elemento.pdfDni) {
      elemento.pdfDni = this.personal.formulario.get('pdfDni');
      this.obtenerPDF(elemento.pdfDni);
      this.verPDF('pdfDni');
    }
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(campo) {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      data: {
        nombre: this.formulario.get(campo +'.nombre').value,
        datos: this.formulario.get(campo +'.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.personalServicio.obtenerPorId(id).subscribe(
      res => {
        let elemento = res.json();
        this.formulario.setValue(elemento);
        this.establecerFotoYPdfs(elemento);
        console.log(this.formulario.value);
      },
      err => {
        console.log(err);
      }
    );
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[0].nombre, 1);
    this.obtenerPorId(elemento.id);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[1].nombre, 1);
    this.obtenerPorId(elemento.id);
  }
  //Establece la foto y pdf (activar consultar/actualizar)
  private establecerFotoYPdfs(elemento): void {
    this.autocompletado.setValue(elemento);
    if (elemento.foto) {
      this.formulario.get('foto.datos').setValue(atob(elemento.foto.datos));
    }
    if (elemento.licConducir) {
      this.formulario.get('pdfLicConducir.datos').setValue(atob(elemento.licConducir.datos));
    }
    if (elemento.pdfLinti) {
      this.formulario.get('pdfLinti.datos').setValue(atob(elemento.pdfLinti.datos));
    }
    if (elemento.pdfLibSanidad) {
      this.formulario.get('pdfLibSanidad.datos').setValue(atob(elemento.pdfLibSanidad.datos));
    }
    if (elemento.pdfDni) {
      this.formulario.get('pdfDni.datos').setValue(atob(elemento.pdfDni.datos));
    }
    if (elemento.pdfAltaTemprana) {
      this.formulario.get('pdfAltaTemprana.datos').setValue(atob(elemento.pdfAltaTemprana.datos));
    }
    this.cambioEsChofer(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    console.log(a, b);
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareF = this.compararF.bind(this);
  private compararF(a, b) {
    console.log(a, b);
    if (a != null && b != null) {
      return a === b;
    }
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    console.log(this.formulario.value);
    this.personalServicio.actualizar(this.formulario.value).then(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idVtoCurso').focus();
          }, 20);
          this.toastr.success('Registro actualizado con éxito');
        this.resultados = [];
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        document.getElementById("idVtoCurso").focus();
        this.loaderService.hide();
      }
    );
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
