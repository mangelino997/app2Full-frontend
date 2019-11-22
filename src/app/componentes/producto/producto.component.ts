import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from 'src/app/servicios/producto.service';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';
import { MarcaProductoService } from 'src/app/servicios/marca-producto.service';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { InsumoProducto } from 'src/app/modelos/insumoProducto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
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
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario listar para validaciones de campos
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista completa de rubros
  public rubros: Array<any> = [];
  //Define rubro para la lista
  public rubro: FormControl = new FormControl();
  //Define la lista de marcas
  public marcas: Array<any> = [];
  //Define marca para la lista
  public marca: FormControl = new FormControl();
  //Define la lista completa de unidades de medida
  public unidadesMedidas: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'MARCA', 'MODELO', 'RUBRO', 'ES_ASIGNABLE', 'ES_SERIALIZABLE', 'ES_CRITICO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private appService: AppService, private modelo: InsumoProducto, private servicio: ProductoService,
    private subopcionPestaniaService: SubopcionPestaniaService, private rubrosServicio: RubroProductoService,
    private unidadMedidaServicio: UnidadMedidaService, private marcaServicio: MarcaProductoService, private toastr: ToastrService,
    private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
      });
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
        })
      }
    });
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    this.formularioFiltro = new FormGroup({
      rubroProducto: new FormControl('', Validators.required),
      marcaProducto: new FormControl('', Validators.required),
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene los rubros
    this.listarRubros();
    //Obtiene las marcas
    this.listarMarcas();
    //Obtiene las unidades de medida
    this.listarUnidadesMedida();
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('esAsignable').setValue(false);
    this.formulario.get('esSerializable').setValue(false);
    this.formulario.get('esCritico').setValue(false);
  }
  //Establece el formulario al seleccionar de autocompletado
  public cambioAutocompletado(): void {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);

    /* Cuando la pestaña es 'Consultar' muestra los ITC y precios */
    if(this.indiceSeleccionado == 2){
      let precioUnitarioVenta = elemento.precioUnitarioViaje;
      let precioUnitarioViaje = elemento.precioUnitarioVenta;
      let itcPorLitro = elemento.itcPorLitro;
      let itcNeto = elemento.itcNeto;
      this.formulario.get('precioUnitarioViaje').setValue(this.appService.establecerDecimales(precioUnitarioViaje.toString(), 2));
      this.formulario.get('precioUnitarioVenta').setValue(this.appService.establecerDecimales(precioUnitarioVenta.toString(), 2));
      this.formulario.get('itcPorLitro').setValue(this.appService.establecerDecimales(itcPorLitro.toString(), 4));
      this.formulario.get('itcNeto').setValue(this.appService.desenmascararPorcentaje(itcNeto.toString(), 2));
    }
  }
  //Obtiene el listado de rubros
  private listarRubros() {
    this.rubrosServicio.listar().subscribe(
      res => {
        this.rubros = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de marcas
  private listarMarcas() {
    this.marcaServicio.listar().subscribe(
      res => {
        this.marcas = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de unidades de medida
  private listarUnidadesMedida() {
    this.unidadMedidaServicio.listar().subscribe(
      res => {
        this.unidadesMedidas = res.json();
      },
      err => {
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.listaCompleta = new MatTableDataSource([]);
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
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
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
      case 5:
        setTimeout(function () {
          document.getElementById('idRubro').focus();
        }, 20);
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('rubroProducto').enable();
      this.formulario.get('marcaProducto').enable();
      this.formulario.get('unidadMedida').enable();
      this.formulario.get('esAsignable').enable();
      this.formulario.get('esSerializable').enable();
      this.formulario.get('esCritico').enable();
    } else {
      this.formulario.get('rubroProducto').disable();
      this.formulario.get('marcaProducto').disable();
      this.formulario.get('unidadMedida').disable();
      this.formulario.get('esAsignable').disable();
      this.formulario.get('esSerializable').disable();
      this.formulario.get('esCritico').disable();
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
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuario').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerValoresPorDefecto();
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
          this.toastr.error(respuesta.mensaje);
        }
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
          this.reestablecerFormulario(undefined);
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
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    let formulario = this.formulario.value;
    this.servicio.eliminar(formulario.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 500) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
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
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.reset();
    this.formularioFiltro.reset();
    this.formulario.get('id').setValue(id);
    this.vaciarListas();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.establecerElemento(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.establecerElemento(elemento);
  }
  //Establece los valores del registro seleccionado en pestaña consultar o actualizar
  private establecerElemento(elemento) {
    elemento.precioUnitarioVenta = elemento.precioUnitarioVenta && elemento.precioUnitarioVenta != 0 ? this.appService.establecerDecimales(elemento.precioUnitarioVenta, 2) : null;
    elemento.coeficienteITC = elemento.coeficienteITC ? this.appService.establecerDecimales(elemento.coeficienteITC, 2) : null;
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
  public listarPorRubroYMarcaLista() {
    this.loaderService.show();
    let rubroProducto = this.formularioFiltro.get('rubroProducto').value;
    let marcaProducto = this.formularioFiltro.get('marcaProducto').value;
    rubroProducto = rubroProducto.id;
    marcaProducto = marcaProducto == '1' ? 0 : marcaProducto.id;
    this.servicio.listarPorRubroYMarca(rubroProducto, marcaProducto).subscribe(
      res => {
        if (res.json().length > 0) {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.listaCompleta.paginator = this.paginator;
        } else {
          this.listaCompleta = new MatTableDataSource([]);
          this.toastr.error("Sin registros para mostrar.");
        }

        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      });
  }
  //Funcion para comparar y mostrar elemento de campo select
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
  //Mascara un numero con cuatro decimales
  public mascararCuatroDecimales(limit) {
    return this.appService.mascararEnterosCon4Decimales(limit);
  }
  //Obtiene la mascara de enteros CON decimales (sin signo de $)
  public obtenerMascaraEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Mascara enteros
  public mascararEnteros(limit) {
    return this.appService.mascararEnteros(limit);
  }
  //Mascara un importe
  public mascararImporte(limit, decimalLimite) {
    return this.appService.mascararImporte(limit, decimalLimite);
  }
  //Obtiene la mascara de importe
  public mascararCoeficiente(intLimite) {
    return this.appService.mascararEnterosCon4Decimales(intLimite);
  }
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
    if (formulario.value > 100.00)
      formulario.setValue('100.00');
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre,
        marca: elemento.marcaProducto.nombre,
        modelo: elemento.modelo,
        rubro: elemento.rubroProducto.nombre,
        es_asignable: elemento.esAsignable ? 'Si' : 'No',
        es_serializable: elemento.esSerializable ? 'Si' : 'No',
        es_critico: elemento.esCritico ? 'Si' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Insumos/Productos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}