import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { CostoInsumoProducto } from 'src/app/modelos/costoInsumoProducto';

@Component({
  selector: 'app-costos-insumos-producto',
  templateUrl: './costos-insumos-producto.component.html',
  styleUrls: ['./costos-insumos-producto.component.css']
})
export class CostosInsumosProductoComponent implements OnInit {
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
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para validaciones de campos en pestaña Listar
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de rubros
  public rubros: Array<any> = [];
  //Define rubro para la lista
  public rubro: FormControl = new FormControl();
  //Define la lista de marcas
  public marcas: Array<any> = [];
  //Define marca para la lista
  public marca: FormControl = new FormControl();
  //Define la lista de unidades de medida
  public unidadesMedidas: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['CODIGO', 'NOMBRE', 'RUBRO', 'MARCA', 'UNIDAD_MEDIDA', 'MODELO', 'PRECIO_UNITARIO_VIAJE', 'PRECIO_UNITARIO_VENTA', 'ITC_POR_LITRO', 'ITC_NETO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: InsumoProductoService, private modelo: CostoInsumoProducto,
    private loaderService: LoaderService, private appService: AppService,
    private toastr: ToastrService, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorAlias(data).subscribe(response => {
            this.resultados = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Define los campos para validaciones en el formulario que filtra y obtiene registros
    this.formularioFiltro = new FormGroup({
      rubro: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required)
    })
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(2, 'Consultar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        this.pestanias.splice(0, 1); //Saca la opcion agregar
        this.pestanias.splice(2, 1); //Saca la opcion eliminar
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.marcas = respuesta.marcaProductos;
        this.rubros = respuesta.rubroProductos;
        this.unidadesMedidas = respuesta.unidadMedidas;
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.formulario.get('rubroProducto').disable();
    this.formulario.get('marcaProducto').disable();
    this.formulario.get('unidadMedida').disable();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    switch (id) {
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 5:
        this.establecerValoresPestania(nombre, true, false, true, 'idRubro');
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion() {
    this.actualizar();
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.enable();
    this.controlaValores(this.formulario.value); //Controla que no haya valores en null/Nan
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err;
        document.getElementById("idAutocompletado").focus();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Reestablece los campos agregar
  private reestablecerFormulario() {
    this.resultados = [];
    this.formulario.reset();
    this.formularioFiltro.reset();
    this.autocompletado.reset();
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    let precioUnitarioVenta = elemento.precioUnitarioViaje;
    let precioUnitarioViaje = elemento.precioUnitarioVenta;
    let itcPorLitro = elemento.itcPorLitro;
    let itcNeto = elemento.itcNeto;
    this.formulario.get('precioUnitarioViaje').setValue(this.appService.establecerDecimales(precioUnitarioViaje.toString(), 2));
    this.formulario.get('precioUnitarioVenta').setValue(this.appService.establecerDecimales(precioUnitarioVenta.toString(), 2));
    this.formulario.get('itcPorLitro').setValue(this.appService.establecerDecimales(itcPorLitro.toString(), 4));
    this.formulario.get('itcNeto').setValue(this.appService.desenmascararPorcentaje(itcNeto.toString(), 2));

  }
  //Obtiene la lista por rubro y marca
  public listarPorRubroYMarcaLista() {
    this.loaderService.show();
    let idMarca = this.formularioFiltro.value.marca;
    idMarca = idMarca == 1 ? 0 : this.formularioFiltro.value.marca.id;
    this.servicio.listarPorRubroYMarca(this.formularioFiltro.value.rubro.id, idMarca).subscribe(res => {
      if (res.json().length > 0) {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
      } else {
        this.toastr.warning("Sin registros para mostrar.");
        this.listaCompleta = new MatTableDataSource([]);
      }
      this.listaCompleta.paginator = this.paginator;
      this.loaderService.hide();
    });
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
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
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[0].nombre);
    this.autocompletado.patchValue(elemento);
    this.cambioAutocompletado();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[1].nombre);
    this.autocompletado.patchValue(elemento);
    this.cambioAutocompletado();
  }
  ////Controla que no haya valores en null/Nan
  private controlaValores(elemento) {
    elemento.itcNeto == null || elemento.itcNeto == NaN ?
      this.formulario.get('itcNeto').setValue(0) : '';
    elemento.itcPorLitro == null || elemento.itcPorLitro == NaN ?
      this.formulario.get('itcPorLitro').setValue(0) : '';
    elemento.precioUnitarioVenta == null || elemento.precioUnitarioVenta == NaN ?
      this.formulario.get('precioUnitarioVenta').setValue(0) : '';
    elemento.precioUnitarioViaje == null || elemento.precioUnitarioViaje == NaN ?
      this.formulario.get('precioUnitarioViaje').setValue(0) : '';
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        codigo: elemento.id,
        nombre: elemento.nombre,
        rubro: elemento.rubroProducto.nombre,
        marca: elemento.marcaProducto.nombre,
        unidad_medida: elemento.unidadMedida.nombre,
        modelo: elemento.modelo,
        precio_unitario_viaje: '$' + elemento.precioUnitarioViaje,
        precio_unitario_venta: '$' + elemento.precioUnitarioVenta,
        itc_por_litro: elemento.itcPorLitro,
        itc_neto: '%' + elemento.itcNeto
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Costos Insumos Productos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}