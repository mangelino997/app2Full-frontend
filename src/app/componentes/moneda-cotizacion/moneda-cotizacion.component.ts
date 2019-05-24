import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MonedaCotizacion } from 'src/app/modelos/moneda-cotizacion';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moneda-cotizacion',
  templateUrl: './moneda-cotizacion.component.html',
  styleUrls: ['./moneda-cotizacion.component.css']
})
export class MonedaCotizacionComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define el nombre del Boton
  public nombreBtn: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define si mostrar el boton
  public mostrarAgregar: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: Array<any> = [];
  //Define la lista completa de Monedas
  public listaMonedas: Array<any> = [];
  //Define la lista completa de Monedas
  public listaMonedaCotizacion = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id: FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['moneda', 'fecha', 'valor', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private appService: AppService, private monedaCotizacion: MonedaCotizacion, private monedaCotizacionServicio: MonedaCotizacionService,
    private monedaServicio: MonedaService, private toastr: ToastrService, private fechaServicio: FechaService, private loaderService: LoaderService) {
    //Actualiza en tiempo real la tabla
    this.monedaCotizacionServicio.listaCompleta.subscribe(res => {
      this.listaMonedaCotizacion = res;
    });
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.monedaCotizacionServicio.listarPorMoneda(data).subscribe(res => {
          this.resultados = res.json();
          console.log(res.json());
        })
      }
    });
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Inicializa el boton en Agregar
    this.mostrarAgregar = true;
    //Define el formulario y validaciones
    this.formulario = this.monedaCotizacion.formulario;
    //Lista las Monedas
    this.listarMonedas();
    //Inicializamos con la fecha actual
    this.establecerFecha();
  }
  //Establecer Fecha
  public establecerFecha() {
    this.fechaServicio.obtenerFecha().subscribe(
      res => {
        this.formulario.get('fecha').setValue(res.json());
      },
      err => {
        this.toastr.error(err.mensaje);
      }
    );
  }
  //Obtiene el listado de Monedas
  private listarMonedas() {
    this.monedaServicio.listar().subscribe(
      res => {
        this.listaMonedas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un registro
  public agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.monedaCotizacionServicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        setTimeout(function () {
          document.getElementById('idNombre').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
      });
  }
  //Actualiza un registro
  public actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.monedaCotizacionServicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        setTimeout(function () {
          document.getElementById('idNombre').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
      });
  }
  //Carga la tabla con los datos de la moneda seleccionada
  public cambioSeleccionado() {
    this.monedaCotizacionServicio.listarPorMoneda(this.formulario.get('moneda').value.id).subscribe(res => {
      this.listaMonedaCotizacion = new MatTableDataSource(res.json());
      this.listaMonedaCotizacion.sort = this.sort;
    });
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.get('fecha').reset();
    this.formulario.get('valor').reset();
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    this.establecerFecha();
    this.mostrarAgregar = true;
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    var elemento = this.autocompletado.value;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.mostrarAgregar = false;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.formulario.get('fecha').setValue(elemento.fecha);
    this.formulario.get('valor').setValue(elemento.valor);
  }
  //Elimina un elemento de la lista
  public eliminar(id) {
    this.monedaCotizacionServicio.eliminar(id).subscribe(res => {
      let respuesta = res.json();
      this.toastr.success(respuesta.mensaje);
      this.cambioSeleccionado();
    },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
      });
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Obtiene la mascara de importe
  public obtenerMascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Desenmascara los campos con mascara importe
  public desenmascararImporte() {
    if (this.formulario.get('valor').value != null)
      this.setDecimales(this.formulario.get('valor'), 2);
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
}