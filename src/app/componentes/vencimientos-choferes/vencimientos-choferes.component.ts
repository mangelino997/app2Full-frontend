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
  //Define la lista de Rubros, Marcas, Unidad de Medida
  public rubros: Array<any> = [];
  public marcas: Array<any> = [];
  public unidadesMedidas: Array<any> = [];
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
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el form control para las busquedas
  public autocompletadoListar: FormControl = new FormControl();
  //Constructor
  constructor(private personalServicio: PersonalService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private personal: Personal, private toastr: ToastrService,
    private loaderService: LoaderService, private appComponent: AppComponent) {
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
    //Autocompletado - Buscar personal por alias
    this.autocompletadoListar.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarChoferesPorEmpresa(empresa.id).subscribe(response => {
          this.resultados = response;
        })
      }
    })
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
    //Define el modelo
    this.formulario = this.personal.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Consultar', 0);
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
    this.vaciarListas();
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('apellido').enable();
      this.formulario.get('nombre').enable();
      this.formulario.get('esChofer').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
      this.formulario.get('VtoLicCondcir').enable();
      this.formulario.get('VtoCurso').enable();
      this.formulario.get('VtoCursoCargaPeligrosa').enable();
      this.formulario.get('VtoLinti').enable();
    } else {
      this.formulario.get('tipoVehiculo').disable();
    }
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    this.formulario.setValue(elemAutocompletado);
    this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
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
}
