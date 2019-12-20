import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompaniaSeguroPoliza } from 'src/app/modelos/companiaSeguroPoliza';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { PdfService } from 'src/app/servicios/pdf.service';
import { PdfDialogoComponent } from '../pdf-dialogo/pdf-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-compania-seguro-poliza',
  templateUrl: './compania-seguro-poliza.component.html',
  styleUrls: ['./compania-seguro-poliza.component.css']
})
export class CompaniaSeguroPolizaComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
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
  //Define la imagen 
  public imagen: any = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define el objeto 'pdf' como un formControl
  public objetoPdf: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'EMPRESA', 'NUMERO_POLIZA', 'VTO_POLIZA', 'PDF', 'EDITAR', 'ELIMINAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene la poliza
  public poliza: FormControl = new FormControl();
  //Define la lista de polizas de una compania seguro y empresa
  public polizas: Array<any> = [];
  //Define fecha actual
  public fechaActual: String;
  //Constructor
  constructor(private servicio: CompaniaSeguroPolizaService, private toastr: ToastrService,
    private appService: AppService, private companiaSeguroServicio: CompaniaSeguroService,
    private companiaSeguroPolizaModelo: CompaniaSeguroPoliza, private loaderService: LoaderService,
    private pdfServicio: PdfService, public dialog: MatDialog, private reporteServicio: ReporteService) {
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.companiaSeguroPolizaModelo.formulario;
    //Define el objeto 'pdf' y sus campos
    this.objetoPdf.setValue(this.companiaSeguroPolizaModelo.formulario.get('pdf').value);
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.companiaSeguroServicio.listarPorNombre(data).subscribe(res => {
            this.resultadosCompaniasSeguros = res;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.fechaActual = respuesta.fecha;
        this.empresas = respuesta.empresas;
        // this.unidadesMedidas = respuesta.unidadMedidas;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Vacia la listas de resultados autocompletados
  private vaciarListas() {
    this.polizas = [];
    this.listaCompleta = new MatTableDataSource([]);
    this.resultadosCompaniasSeguros = [];
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    /* Limpia el formulario para no mostrar valores en campos cuando 
      la pestaña es != 1 */
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idCompaniaSeguro');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idCompaniaSeguroFiltro');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idCompaniaSeguro');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idCompaniaSeguroFiltro');
        break;
      case 5:
        setTimeout(function () {
          document.getElementById('idCompaniaSeguroFiltro').focus();
        }, 20);
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
        break;
      default:
        break;
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).then(
      res => {
        var respuesta = res.json();
        if (res.status == 201) {
          respuesta.then(data => {
            this.ultimoId = data.id;
            this.reestablecerFormulario(data.id);
            document.getElementById('idCompaniaSeguro').focus();
            this.toastr.success('Registro agregado con éxito');
          })
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).then(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idCompaniaSeguro').focus();
          this.toastr.success('Registro actualizado con éxito');
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        document.getElementById("idCompaniaSeguro").focus();
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar(elemento) {
    this.loaderService.show();
    this.servicio.eliminar(elemento.id).subscribe(
      res => {
        let respuesta = res.json();
        if (res.status == 200) {
          let companiaSeguro = this.formulario.value.companiaSeguro;
          this.formulario.reset();
          this.formulario.get('companiaSeguro').setValue(companiaSeguro);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Obtiene un listado por empresa
  public listarPorEmpresa(elemento) {
    this.resultados = [];
    if (this.mostrarAutocompletado) {
      this.servicio.listarPorEmpresa(elemento.id).subscribe(res => {
        this.resultados = res.json();
        if (this.resultados.length == 0) {
          this.toastr.warning("Sin registros para mostrar.");
        }
      })
    }
  }
  //Obtiene un listado por compania de seguro
  public listarPorCompaniaSeguro() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    this.servicio.listarPorCompaniaSeguroYEmpresa(this.formulario.value.companiaSeguro.id, this.formulario.value.empresa.id)
      .subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.listaCompleta.data.length == 0 ? this.toastr.warning("Sin registros para mostrar para la Empresa y Compañía Seguro.") : '';
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        })
  }
  //Obtiene un listado por compania de seguro
  public listarPorCompaniaSeguroYEmpresa() {
    if (this.indiceSeleccionado != 1) {
      let companiaSeguro = this.formulario.get('companiaSeguro').value;
      let empresa = this.formulario.get('empresa').value;
      if (companiaSeguro != null && empresa != null) {
        this.servicio.listarPorCompaniaSeguroYEmpresa(companiaSeguro.id, empresa.id).subscribe(res => {
          this.polizas = [];
          this.polizas = res.json();
          if (this.polizas.length == 0) {
            this.toastr.warning("Sin registros para mostrar.");
          }
        })
      }
    }
  }
  //Establece los datos de la poliza seleccionada
  public establecerPoliza(): void {
    this.formulario.reset();
    let poliza = this.poliza.value;
    if (poliza.pdf) {
      this.formulario.patchValue(poliza);
      this.obtenerPDF();
    } else {
      poliza.pdf = this.objetoPdf.value;
      this.formulario.patchValue(poliza);
      this.obtenerPDF();
    }
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.vaciarListas();
    this.poliza.reset();
    this.formulario.reset();
    this.empresaBusqueda.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        let elemento = res.json();
        !elemento.pdf ? elemento.pdf = {} : '';
        this.formulario.patchValue(elemento);
        this.establecerPdf(elemento);
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    );
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.establecerElemento(elemento);
    this.listaCompleta.data.push(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.establecerElemento(elemento);
  }
  //Establece elemento a formulario y controles
  private establecerElemento(elemento) {
    let pdf = elemento.pdf;
    !pdf ? elemento.pdf = this.objetoPdf.value : '';
    this.formulario.patchValue(elemento);
    this.listarPorCompaniaSeguroYEmpresa();
    this.poliza.patchValue(elemento);
    pdf ? this.obtenerPorId(elemento.id) : '';
  }
  //Establece la foto y pdf (activar consultar/actualizar)
  private establecerPdf(elemento): void {
    if (elemento.pdf) {
      elemento.pdf.datos ? this.formulario.get('pdf.datos').setValue(atob(elemento.pdf.datos)) : '';
    }
  }
  //Obtiene el pdf para mostrarlo
  public obtenerPDF() {
    if (this.formulario.value.pdf.id) {
      this.pdfServicio.obtenerPorId(this.formulario.value.pdf.id).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          nombre: resultado.nombre,
          datos: atob(resultado.datos)
        }
        this.formulario.get('pdf').patchValue(pdf);
      })
    }
  }
  //Obtiene el pdf para mostrarlo en la tabla
  public obtenerPDFTabla(elemento) {
    if (elemento.pdf) {
      this.pdfServicio.obtenerPorId(elemento.pdf.id).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          nombre: resultado.nombre,
          datos: atob(resultado.datos)
        }
        window.open(pdf.datos, '_blank');
      })
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
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Muestra el pdf en una pestana nueva
  public verPDFTabla(elemento) {
    if (!elemento.pdf) {
      this.toastr.success("Sin archivo adjunto");
    } else {
      this.pdfServicio.obtenerPorId(elemento.pdf.id).subscribe(
        res => {
          let respuesta = res.json();
          elemento.pdf.datos = respuesta.datos;
          if (elemento.pdf.datos) {
            const dialogRef = this.dialog.open(PdfDialogoComponent, {
              width: '95%',
              height: '95%',
              data: {
                nombre: elemento.pdf.nombre,
                datos: atob(elemento.pdf.datos)
              }
            });
            dialogRef.afterClosed().subscribe(resultado => { });
          }
        },
        err => {
          this.toastr.error("Error al obtener los datos del pdf '" + elemento.pdf.nombre + "'");
        }
      );
    }
  }
  //Carga el pdf
  public readURL(event): void {
    if (event.target.files && event.target.files[0] && event.target.files[0].type == 'application/pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get('pdf.id').value ? this.formulario.get('pdf.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get('pdf').patchValue(pdf);
        event.target.value = null;
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .pdf");
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        empresa: elemento.empresa.razonSocial,
        numero_poliza: elemento.numeroPoliza,
        vto_poliza: elemento.vtoPoliza,
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Companias Seguros Polizas',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.numeroPoliza ? elemento.numeroPoliza + ' - ' + elemento.companiaSeguro.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}