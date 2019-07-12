import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
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
  //Define si es o no chofer 
  public chofer :string ='';
  //Define si es o no chofer larga distancia
  public choferLargaDistancia:string = '';
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
  private obtenerSiEsChoferYChoferLargaDistancia() {
    if(this.formulario.get('esChoferLargaDistancia').value) {
      this.choferLargaDistancia = 'Si';
    }else {
      this.choferLargaDistancia = 'No';
    }
    if(this.formulario.get('esChofer').value) {
      this.chofer = 'Si';
    }else {
      this.chofer = 'No';
    }
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
  private listar() {
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
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
    setTimeout(function () {
      document.getElementById('idAutocompletado').focus();
    }, 20);
  }
  //Carga el pdf
  public readURL(event, nombrePdf): void {
    console.log(event.target);
    if (event.target.files && event.target.files[0] && event.target.files[0].type== 'application/pdf'
    || event.target.files[0].type== 'image/jpeg') {
console.log(event.target.files[0]);
console.log(event.target.files[0].type);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          nombre: file.name,
          id: this.formulario.get(nombrePdf + '.id').value  ? this.formulario.get(nombrePdf+ '.id').value : null,
          datos: reader.result
        }
        this.formulario.get(nombrePdf).patchValue(pdf);
      }
      reader.readAsDataURL(file);
    }else {
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
   public verPDF() {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      data: {
        nombre: this.formulario.get('pdf.nombre').value,
        datos: this.formulario.get('pdf.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {});
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
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    this.obtenerSiEsChoferYChoferLargaDistancia();
    console.log(elemAutocompletado);
    this.formulario.get('nombre').setValue(elemAutocompletado.nombre);
    this.formulario.get('apellido').setValue(elemAutocompletado.apellido);
    this.formulario.get('id').setValue(elemAutocompletado.id);
    this.formulario.get('cuil').setValue(elemAutocompletado.cuil);
    this.formulario.get('numeroDocumento').setValue(elemAutocompletado.numeroDocumento);
    this.formulario.get('tipoDocumento').setValue(elemAutocompletado.tipoDocumento.nombre);
    if(this.formulario.get('esChofer').value){
      this.formulario.get('esChofer').setValue('Si');
    }else {
      this.formulario.get('esChofer').setValue('No');
    }
    if(this.formulario.get('esChoferLargaDistancia').value){
      this.formulario.get('esChoferLargaDistancia').setValue('Si');
    }else {
      this.formulario.get('esChoferLargaDistancia').setValue('No');
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
