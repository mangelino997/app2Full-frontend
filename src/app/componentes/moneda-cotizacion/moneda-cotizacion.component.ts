import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MonedaCotizacion } from 'src/app/modelos/moneda-cotizacion';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-moneda-cotizacion',
  templateUrl: './moneda-cotizacion.component.html',
  styleUrls: ['./moneda-cotizacion.component.css']
})
export class MonedaCotizacionComponent implements OnInit {
  //Define la pestania actual
  public pestaniaActual: string = null;
  //Define campos solo lectura
  public soloLectura: boolean = false;
  //Define fecha actual
  public fechaActual: String;
  //Define si mostrar el boton
  public mostrarAgregar: boolean = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista completa de Monedas
  public listaMonedas: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define las columnas seleccionadas
  public elegirColumna: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['MONEDA', 'FECHA', 'VALOR', 'EDITAR'];
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
  //Constructor
  constructor(private appService: AppService, private monedaCotizacion: MonedaCotizacion, private servicio: MonedaCotizacionService,
    private monedaServicio: MonedaService, private toastr: ToastrService, private fechaServicio: FechaService, private loaderService: LoaderService,
    private reporteServicio: ReporteService) {
    //Actualiza en tiempo real la tabla
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorMoneda(data).subscribe(res => {
            this.resultados = res.json();
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
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
    /* Obtiene todos los listados */
    this.inicializar();
  }
  //Obtiene los datos necesarios para el componente
  private inicializar() {
    this.render = true;
    this.servicio.inicializar().subscribe(
      res => {
        let respuesta = res.json();
        //Establece demas datos necesarios
        this.listaMonedas = respuesta.monedas;
        this.fechaActual = respuesta.fecha;
        this.formulario.get('fecha').setValue(this.fechaActual);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Agrega un registro
  public agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.cambioSeleccionado();
        this.reestablecerFormulario(respuesta.id);
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
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.cambioSeleccionado();
        this.reestablecerFormulario(respuesta.id);
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
    this.servicio.listarPorMoneda(this.formulario.get('moneda').value.id).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
      this.listaCompleta.data.length == 0 ? this.toastr.warning("Sin registros para mostrar.") : '';
    });
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.get('fecha').reset();
    this.formulario.get('valor').reset();
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    this.mostrarAgregar = true;
    this.formulario.get('fecha').setValue(this.fechaActual);
    document.getElementById('idNombre').focus();
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
    this.servicio.eliminar(id).subscribe(res => {
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
  //Valida que la fecha de cotización no sea posterior a la fecha actual
  public validarFechaCotizacion() {
    if (this.formulario.value.fecha > this.fechaActual) {
      this.toastr.error("Fecha de Cotización debe ser menor a fecha actual.");
      this.formulario.get('fecha').reset();
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
  //Prepara los datos para exportar
  private prepararDatos(listaMonedaCotizacion): Array<any> {
    let lista = listaMonedaCotizacion;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        moneda: elemento.moneda.nombre,
        fecha: elemento.fecha,
        valor: '$' + this.returnDecimales(elemento.valor, 2)
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Cotizaciones Monedas',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}