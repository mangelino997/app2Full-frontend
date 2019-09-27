import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { InsumoProducto } from 'src/app/modelos/insumoProducto';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ToastrService } from 'ngx-toastr';
import { MarcaProductoService } from 'src/app/servicios/marca-producto.service';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-costos-insumos-producto',
  templateUrl: './costos-insumos-producto.component.html',
  styleUrls: ['./costos-insumos-producto.component.css']
})
export class CostosInsumosProductoComponent implements OnInit {
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
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: InsumoProductoService, private insumoProducto: InsumoProducto, private loaderService: LoaderService,
    private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private toastr: ToastrService,
    private rubroProductoServicio: RubroProductoService, private marcaProductoServicio: MarcaProductoService,
    private unidadMedidaServicio: UnidadMedidaService, private reporteServicio: ReporteService) {
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
          this.pestanias.splice(0, 1); //Saca la opcion agregar
          this.pestanias.splice(2, 1); //Saca la opcion eliminar
          this.activeLink = this.pestanias[0].nombre;
          this.loaderService.hide();
        },
        err => {
        }
      );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
        })
      }
    })
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.insumoProducto.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(2, 'Consultar', 0);
    //Obtiene la lista de rubros de productos
    this.listarRubroProducto();
    //Obtiene la lista de marcas de productos
    this.listarMarcaProducto();
    //Obtiene la lista de unidades de medida
    this.listarUnidadMedida();
  }
  //Obtiene la lista de rubros de productos
  private listarRubroProducto(): void {
    this.rubroProductoServicio.listar().subscribe(res => {
      this.rubros = res.json();
    });
  }
  //Obtiene la lista de marcas de productos
  private listarMarcaProducto(): void {
    this.marcaProductoServicio.listar().subscribe(res => {
      this.marcas = res.json();
    });
  }
  //Obtiene la lista de unidades de medida
  private listarUnidadMedida(): void {
    this.unidadMedidaServicio.listar().subscribe(res => {
      this.unidadesMedidas = res.json();
    });
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
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
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 5:
          this.listaCompleta = new MatTableDataSource([]);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 3:
        this.actualizar();
        break;
      default:
        break;
    }
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
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
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
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.resultados = [];
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
  public listarPorRubroYMarcaLista(rubro, marca) {
    this.loaderService.show();
    this.servicio.listarPorRubroYMarca(rubro.value.id, marca.value.id).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
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
    this.seleccionarPestania(2, this.pestanias[0].nombre, 1);
    this.autocompletado.patchValue(elemento);
    this.cambioAutocompletado();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[1].nombre, 1);
    this.autocompletado.patchValue(elemento);
    this.cambioAutocompletado();
  }
  ////Controla que no haya valores en null/Nan
  private controlaValores(elemento) {
    if (elemento.itcNeto == null || elemento.itcNeto == NaN)
      this.formulario.get('itcNeto').setValue(0);
    if (elemento.itcPorLitro == null || elemento.itcPorLitro == NaN)
      this.formulario.get('itcPorLitro').setValue(0);
    if (elemento.precioUnitarioVenta == null || elemento.precioUnitarioVenta == "NaN")
      this.formulario.get('precioUnitarioVenta').setValue(0);
    if (elemento.precioUnitarioViaje == null || elemento.precioUnitarioViaje == "NaN")
      this.formulario.get('precioUnitarioViaje').setValue(0);
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
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
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