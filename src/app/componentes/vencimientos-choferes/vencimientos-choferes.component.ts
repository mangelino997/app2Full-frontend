import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { Personal } from 'src/app/modelos/personal';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { PdfDialogoComponent } from '../pdf-dialogo/pdf-dialogo.component';
import { BugImagenDialogoComponent } from '../bugImagen-dialogo/bug-imagen-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

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
  //Define un formulario para filtrar lista
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda para el campo Personal
  public resultadosPersonal: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['LEGAJO', 'NOMBRE', 'CHOFER_LARGA_DISTANCIA', 'VTO_LICENCIA', 'VTO_CURSO', 'VTO_CURSO_CARGA_PELIGROSA', 'VTO_CURSO_LINTI', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el form control para las busquedas
  public tipoDocumento: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la lista de tipos de imagenes
  private tiposImagenes = ['image/png', 'image/jpg', 'image/jpeg'];
  //Define el form control para las busquedas
  public autocompletadoListar: FormControl = new FormControl();
  //Define los botones para los pdf
  public btnPdfLicConducir: boolean = null;
  public btnPdfLibSanidad: boolean = null;
  public btnPdflinti: boolean = null;
  public btnPdfDni: boolean = null;
  public btnPdfAltaTemprana: boolean = null;
  public listaChoferes: Array<any> = [];
  //Constructor
  constructor(private servicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService,
    public dialog: MatDialog, private appService: AppService, private personal: Personal, private toastr: ToastrService,
    private loaderService: LoaderService, private tipoDocumentoServicio: TipoDocumentoService, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      let empresa = this.appService.getEmpresa();
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 2) {
          this.loaderService.show();
          this.servicio.listarChoferesPorAliasYEmpresa(data, empresa.id).subscribe(
            res => {
              this.resultados = res;
              this.loaderService.hide();
            },
            err => {
              this.loaderService.hide();
            });
        }
      }
    })
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.pestanias.splice(3, 1);
          this.pestanias.splice(0, 1);
          this.activeLink = this.pestanias[0].nombre;
        },
        err => { }
      );
    //Define el Formulario
    this.formulario = this.personal.formulario;
    //Define el formulario para filtrar  en pestania listar
    this.formularioFiltro = new FormGroup({
      chofer: new FormControl('', Validators.required),
      vtoFisico: new FormControl(),
      vtoCurso: new FormControl(),
      vtoCargaPeligrosa: new FormControl(),
      vtoLicConducir: new FormControl(),
      vtoLinti: new FormControl(),
      vtoLibSanidad: new FormControl()
    });
    this.formularioFiltro.get('chofer').setValue(0);
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(2, 'Consultar');
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Deshabilita los campos de es chofer y es chofer larga distancia 
    this.formulario.get('esChofer').disable();
    this.formulario.get('esChoferLargaDistancia').disable();
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
        this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
      },
      err => {
      }
    );
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    switch (id) {
      case 2:
        this.establecerValoresPestania(nombre, true, true, false);
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true);
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.reset();
    this.autocompletadoListar.reset();
    this.vaciarListas();
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    soloLectura ? this.formulario.disable() : this.formulario.enable();
    setTimeout(function () {
      document.getElementById('idAutocompletado').focus();
    }, 20);
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosPersonal = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.tipoDocumento.setValue(elemento.tipoDocumento.nombre);
    this.obtenerPorId(elemento.id);
  }
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        let elemento = res.json();
        this.formulario.patchValue(elemento);
        this.establecerFotoYPdfs(elemento);
      },
      err => {
      }
    );
  }
  //Establece la foto y pdf (actilet consultar/actualizar)
  private establecerFotoYPdfs(elemento): void {
    elemento.foto ? elemento.foto.datos = atob(elemento.foto.datos) : '';
    elemento.pdfLicConducir ? elemento.pdfLicConducir.datos = atob(elemento.pdfLicConducir.datos) : '';
    elemento.pdfLinti ? elemento.pdfLinti.datos = atob(elemento.pdfLinti.datos) : '';
    elemento.pdfLibSanidad ? elemento.pdfLibSanidad.datos = atob(elemento.pdfLibSanidad.datos) : '';
    elemento.pdfDni ? elemento.pdfDni.datos = atob(elemento.pdfDni.datos) : '';
    elemento.pdfAltaTemprana ? elemento.pdfAltaTemprana.datos = atob(elemento.pdfAltaTemprana.datos) : '';
    this.formulario.patchValue(elemento);
    this.cambioEsChofer();
  }
  //Al cambiar elemento de select esChofer
  public cambioEsChofer(): void {
    this.btnPdfDni = true;
    this.btnPdfAltaTemprana = true;
    if (this.formulario.get('esChoferLargaDistancia').value) {
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
  //Controla si el adjunto es un PDF o JPEG y llama al readURL apropiado
  public controlAdjunto(event) {
    let extension = event.target.files[0].type;
    if (extension == 'application/pdf') {
      this.readPdfURL(event, 'pdfDni');
    } else {
      this.readImageURL(event, 'pdfDni');
    }
  }
  //Carga la imagen del personal
  public readImageURL(event, campo): void {
    if (event.target.files && event.target.files[0] && this.tiposImagenes.includes(event.target.files[0].type)) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let foto = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : 0,
          nombre: file.name,
          datos: reader.result,
          tipo: 'image/jpeg'
        }
        this.formulario.get(campo).patchValue(foto);
        event.target.value = null;
        if(this.indiceSeleccionado == 3) {
          this.actualizarPDF(campo, foto);
        }
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .jpeg .png .jpg");
    }
  }
  //Actualiza un pdf de un vehiculo
  private actualizarPDF(campo, pdf): void {
    this.loaderService.show();
    let idPersonal = this.formulario.get('id').value;
    this.servicio.actualizarPDF(idPersonal, campo, pdf).then(
      res => {
        if(res.status == 200) {
          res.json().then(
            data => {
              this.formulario.get('version').setValue(data.version);
              //Si es una foto
              if(campo == 'foto') {
                this.formulario.get(campo + '.id').setValue(data.foto.id);
                this.formulario.get(campo + '.version').setValue(data.foto.version);
              } else {
                //Si es un pdf
                this.formulario.get(campo + '.id').setValue(data.pdfDni.id);
                this.formulario.get(campo + '.version').setValue(data.pdfDni.version);
              }
            }
          );
        } else {
          this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un pdf ya cargado, se pasa el campo como parametro
  public eliminarPdf(campoNombre, campo) {
    if(this.indiceSeleccionado == 3) {
      this.eliminarPdfPersonal(campoNombre, campo);
    } else {
      this.formulario.get(campo).reset();
    }
  }
  //Elimina un pdf
  private eliminarPdfPersonal(campoNombre, campo): void {
    this.loaderService.show();
    let idPersonal = this.formulario.get('id').value;
    let idPdf = this.formulario.get(campo).value.id;
    this.servicio.eliminarPdf(idPersonal, idPdf, campo).subscribe(
      res => {
        if(res.status == 200) {
          this.formulario.get('version').setValue(res.json());
          if (!this.formulario.get(campoNombre).value) {
            this.toastr.success("Sin archivo adjunto");
          } else {
            this.formulario.get(campo).reset();
          }
        } else {
          this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        this.loaderService.hide();
      }
    );
  }
  //Carga el archivo PDF 
  public readPdfURL(event, campo): void {
    // let extension = this.formulario.get(campo).value.tipo;
    let extension = event.target.files[0].type;
    if (event.target.files && event.target.files[0] && extension == 'application/pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : 0,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get(campo).patchValue(pdf);
        event.target.value = null;
        if(this.indiceSeleccionado == 3) {
          this.actualizarPDF(campo, pdf);
        }
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .pdf");
    }
  }
  //Obtiene el dni para mostrarlo
  public verDni() {
    let tipo;
    this.formulario.value.pdfDni.tipo ? tipo = this.formulario.value.pdfDni.tipo : tipo = this.formulario.value.pdfDni.nombre;
    if (tipo) {
      let extension;
      this.formulario.value.pdfDni.tipo ? extension = tipo.split('/') : extension = tipo.split('.');
      extension[1] == 'pdf' ? this.verPDF('pdfDni') : this.verFoto('pdfDni');
    }
  }
  //Obtiene la foto para mostrarlo
  public verFoto(campo) {
    const dialogRef = this.dialog.open(BugImagenDialogoComponent, {
      width: '95%',
      height: '95%',
      maxWidth: '95%',
      maxHeight: '95%',
      data: {
        id: this.formulario.get(campo + '.id').value,
        datos: this.formulario.get(campo + '.datos').value,
        nombre: this.formulario.get(campo + '.nombre').value,
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(campo) {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      maxWidth: '95%',
      maxHeight: '95%',
      data: {
        id: this.formulario.get(campo + '.id').value,
        datos: this.formulario.get(campo + '.datos').value,
        nombre: this.formulario.get(campo + '.nombre').value,
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Actualiza un registro
  public actualizar() {
    this.loaderService.show();
    this.formulario.enable();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(MensajeExcepcion.ACTUALIZADO);
          this.resultados = [];
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        document.getElementById("idVtoCurso").focus();
        this.loaderService.hide();
      }
    );
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[0].nombre);
    this.obtenerPorId(elemento.id);
    this.autocompletado.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[1].nombre);
    this.obtenerPorId(elemento.id);
    this.autocompletado.setValue(elemento);
  }

  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareF = this.compararF.bind(this);
  private compararF(a, b) {
    if (a != null && b != null) {
      return a === b;
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
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //obtiene la lista por filtros
  public listarChoferesPorFiltros(): void {
    this.loaderService.show();
    this.servicio.listarChoferesPorFiltros(this.formularioFiltro.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        legajo: elemento.id,
        nombre: elemento.nombreCompleto,
        chofer_larga_distancia: elemento.esChoferLargaDistancia ? 'Si' : 'No',
        vto_licencia: elemento.vtoLicenciaConducir ? elemento.vtoLicenciaConducir : '--',
        vto_curso: elemento.vtoCurso ? elemento.vtoCurso : '--',
        vto_curso_carga_peligrosa: elemento.vtoCursoCargaPeligrosa ? elemento.vtoCursoCargaPeligrosa : '--',
        vto_curso_linti: elemento.vtoLibretaSanidad ? elemento.vtoLibretaSanidad : '--'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Vencimientos Choferes',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
