import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { AfipConceptoSueldo } from 'src/app/modelos/afipConceptoSueldo';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';

@Component({
  selector: 'app-afip-concepto-sueldo',
  templateUrl: './afip-concepto-sueldo.component.html',
  styleUrls: ['./afip-concepto-sueldo.component.css']
})
export class AfipConceptoSueldoComponent implements OnInit {
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
  //Define una lista
  public lista: Array<any> = [];
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de afipConceptoSueldoGrupo
  public resultadosAfipCptoSueldoGrupos: Array<any> = [];
  //Define la lista de resultadosTiposConcepto
  public resultadosTiposConcepto: Array<any> = [];
  //Define la lista de afipConceptoSueldoGrupo
  public tipoCptoSueldo: FormControl = new FormControl();
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'CONCEPTO_GRUPO', 'NOMBRE', 'CODIGO_AFIP', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: AfipConceptoSueldoService, private appService: AppService,
    private modelo: AfipConceptoSueldo, private afipGrupoConcepto: AfipConceptoSueldoGrupoService,
    private toastr: ToastrService, private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorNombre(data).subscribe(res => {
            this.resultados = res;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Define el formulario de la pestaña Listar y sus validaciones
    this.formularioFiltro = new FormGroup({
      afipConceptoSueldoGrupo: new FormControl('', Validators.required)
    });
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        console.log(respuesta);
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.formulario.get('id').setValue(this.ultimoId);
        this.resultadosTiposConcepto = respuesta.tipoConceptoSueldos;
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.patchValue(elemento);
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
    this.soloLectura ? this.formulario.get('afipConceptoSueldoGrupo').disable() : this.formulario.get('afipConceptoSueldoGrupo').enable();
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
        this.establecerValoresPestania(nombre, false, false, true, 'idConceptoGrupo');
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
      case 5:
        this.listarPorFiltro();
        break;
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
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Obtiene el listado de registros
  public listarPorFiltro() {
    this.loaderService.show();
    let afipConceptoGrupo = this.formularioFiltro.value.afipConceptoSueldoGrupo;
    if (afipConceptoGrupo) {
      this.servicio.listarPorAfipConceptoSueldoGrupo(afipConceptoGrupo.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.listaCompleta.paginator = this.paginator;
          this.loaderService.hide();
          this.listaCompleta.data.length == 0 ? this.toastr.warning('Sin registros para mostrar.') : '';
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.loaderService.hide();
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let conceptoGrupoAfip = this.formulario.get('afipConceptoSueldoGrupo').value;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario(respuesta.id);
          this.formulario.get('afipConceptoSueldoGrupo').setValue(conceptoGrupoAfip);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Valida que el campo 'Codigo AFIP' tenga como minimo y máx 6 carácteres
  public validarCodigoAFIP() {
    let codigoAFIP = this.formulario.get('codigoAfip').value;
    this.formulario.value.codigoAfip && String(codigoAFIP).length < 6 ? [
      this.formulario.get('codigoAfip').reset(),
      this.toastr.error("Código Afip debe tener 6 carácteres."),
      setTimeout(function () {
        document.getElementById('idCodigoAfip').focus();
      }, 20)
    ] : '';
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Conceptos de Sueldo de AFIP',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
  //Muestra el nombre de Tipo Concepto de AFIP Grupo Concepto seleccionado en pestaña 'Listar'  
  public establecerTipoConcepto() {
    this.tipoCptoSueldo.setValue(this.formularioFiltro.get('afipConceptoSueldoGrupo').value.tipoConceptoSueldo.nombre);
  }
  //Controla el cambio en select 'Tipo de Concepto'. Obtiene los grupos de AFIP concepto
  public cambioTipoConcepto() {
    this.afipGrupoConcepto.listarPorTipoConceptoSueldo(this.tipoCptoSueldo.value.id).subscribe(
      res => {
        this.resultadosAfipCptoSueldoGrupos = res.json();
        this.resultadosAfipCptoSueldoGrupos.length == 0 ? this.toastr.warning("Sin registros para AFIP Grupo Concepto.") : '';
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
}
