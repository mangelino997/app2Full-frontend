import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { BasicoCategoria } from 'src/app/modelos/basicoCategoria';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MesService } from 'src/app/servicios/mes.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-basico-categoria',
  templateUrl: './basico-categoria.component.html',
  styleUrls: ['./basico-categoria.component.css']
})
export class BasicoCategoriaComponent implements OnInit {
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
  //Define una lista para guardar las categorias
  public categorias: Array<any> = [];
  //Define una lista de meses
  public meses: Array<any> = [];
  //Define una lista de anios
  public anios: Array<any> = [];
  //Defiene la categoria
  public formularioListar: FormGroup;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'CATEGORIA', 'MES', 'ANIO', 'BASICO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: BasicoCategoriaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private appService: AppService, private basicoCategoria: BasicoCategoria,
    private anio: FechaService, private mes: MesService, private categoriaService: CategoriaService,
    private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorCategoriaNombre(data).subscribe(res => {
          this.resultados = res;
        })
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
    this.formulario = this.basicoCategoria.formulario;
    //Define el formulario de listar
    this.formularioListar = new FormGroup({
      categoria: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required)
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de categorias
    this.listarCategorias();
    //Obtiene la lista de meses
    this.listarMeses();
    //Obtiene la lista de años
    this.listarAnios();
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la lista de categorias
  public listarCategorias() {
    this.categoriaService.listar().subscribe(
      res => {
        this.categorias = res.json();
      }
    );
  }
  //Obtiene la lista de meses
  private listarMeses() {
    this.mes.listar().subscribe(
      res => {
        this.meses = res.json();
      }
    );
  }
  //Obtiene la lista de años
  private listarAnios() {
    this.anio.listarAnios().subscribe(
      res => {
        this.anios = res.json();
      }
    );
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.setValue(elemento);
    this.formulario.get('basico').setValue(this.appService.establecerDecimales(this.formulario.get('basico').value, 2));
  }
  //Establecer campos en disabled
  public establecerEstadoCampos(opcion): void {
    if (opcion) {
      this.formulario.get('categoria').enable();
      this.formulario.get('anio').enable();
      this.formulario.get('mes').enable();
    } else {
      this.formulario.get('categoria').disable();
      this.formulario.get('anio').disable();
      this.formulario.get('mes').disable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    this.reestablecerFormulario(undefined);
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idCategoria');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.formularioListar.reset();
        this.vaciarListas();
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
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idCategoria').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.enable();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.establecerEstadoCampos(false);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.formulario.enable();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          this.establecerEstadoCampos(false);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    );
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err;
    if (respuesta.codigo == 11017) {
      this.toastr.error('Error Unicidad Categoría, Mes y Año', respuesta.mensaje + ' Categoría');
    } else {
      this.toastr.error(respuesta.mensaje);
    }
  }
  //Obtiene una lista por categoria y anio
  public listarPorCategoriaYAnio(): void {
    this.loaderService.show();
    let idCategoria = this.formularioListar.get('categoria').value.id;
    let anio = this.formularioListar.get('anio').value;
    this.servicio.listarPorCategoriaYAnio(idCategoria, anio).subscribe(res => {
      if (res.json().length > 0) {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'categoria': return item.categoria.nombre;
            case 'mes': return item.mes.nombre;
            default: return item[property];
          }
        };
      } else {
        this.toastr.error("Sin registros para mostrar.");
      }
      this.listaCompleta.sort = this.sort;
      this.listaCompleta.paginator = this.paginator;
      this.loaderService.hide();
    })
  }
  //Vacia la lista
  public vaciarListas() {
    this.listaCompleta = new MatTableDataSource([]);
    this.resultados = [];
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.reset();
    this.formulario.get('id').setValue(id);
    this.vaciarListas();
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Muestra numero con decimales
  public mostrarDecimales(valor, cantidad) {
    if (valor) {
      return this.appService.establecerDecimales(valor, cantidad);
    }
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
    this.cambioAutocompletado(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.cambioAutocompletado(elemento);
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.categoria ? elemento.categoria.nombre + ' - ' +
        elemento.mes.nombre + '/' + elemento.anio + ' - $ ' + this.appService.establecerDecimales(elemento.basico, 2) : elemento;
    } else {
      return elemento;
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
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
        categoria: elemento.categoria.nombre,
        mes: elemento.mes.nombre,
        anio: elemento.anio,
        basico: '$' + this.mostrarDecimales(elemento.basico, 2)
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Basicos Categorias',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}