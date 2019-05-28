import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { CostoInsumoProducto } from 'src/app/modelos/costoInsumoProducto';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ToastrService } from 'ngx-toastr';

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
  //Define la lista de Rubros, Marcas, Unidad de Medida
  public rubros: Array<any> = [];
  public marcas: Array<any> = [];
  public unidadesMedidas: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['codigo','nombre', 'rubro', 'marca', 'unidadMedida', 'modelo', 'precioUnitarioVenta', 'coeficienteITC', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: InsumoProductoService, private insumoProducto: CostoInsumoProducto, private loaderService: LoaderService,
    private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private toastr: ToastrService) {
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
          console.log(res.json());
          this.pestanias = res.json();
          this.pestanias.splice(0, 1); //Saca la opcion agregar
          this.pestanias.splice(2, 1); //Saca la opcion eliminar
          console.log(this.pestanias);
          this.activeLink = this.pestanias[0].nombre;
          this.loaderService.hide();
        },
        err => {
          console.log(err);
        }
      );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorNombre(data).subscribe(response => {
          console.log(response);
          this.resultados = response;
        })
      }
    })
   }

  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.insumoProducto.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(2, 'Consultar', 0);
    //Obtiene la lista completa de registros
    this.listar();
  }

  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
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
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.listar();
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
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
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error= err;
        document.getElementById("idAutocompletado").focus();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    this.rubros= [];
    this.marcas = [];
    this.unidadesMedidas =[];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    this.formulario.setValue(elemAutocompletado);
  }
   //Obtiene la mascara de importe
   public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de importe
  public mascararCoeficiente(intLimite) {
    return this.appService.mascararEnterosCon4Decimales(intLimite);
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
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.formulario.get('precioUnitarioViaje').setValue(this.appService.establecerDecimales(elemento.precioUnitarioViaje, 2));
    this.formulario.get('precioUnitarioVenta').setValue(this.appService.establecerDecimales(elemento.precioUnitarioVenta, 2));
    this.formulario.get('coeficienteITC').setValue(this.appService.establecerDecimales(elemento.coeficienteITC, 4));
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    console.log(elemento);
    this.seleccionarPestania(3, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.formulario.get('precioUnitarioViaje').setValue(this.appService.establecerDecimales(elemento.precioUnitarioViaje, 2));
    this.formulario.get('precioUnitarioVenta').setValue(this.appService.establecerDecimales(elemento.precioUnitarioVenta, 2));
    this.formulario.get('coeficienteITC').setValue(this.appService.establecerDecimales(elemento.coeficienteITC, 4));
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    console.log(a, b);
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
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