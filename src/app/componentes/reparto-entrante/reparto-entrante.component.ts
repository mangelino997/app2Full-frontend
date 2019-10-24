import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup, FormControl } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatDialog, MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { SeguimientoVentaComprobante } from 'src/app/modelos/seguimientoVentaComprobante';
import { SeguimientoOrdenRecoleccion } from 'src/app/modelos/seguimientoOrdenRecoleccion';
import { SeguimientoViajeRemito } from 'src/app/modelos/seguimientoViajeRemito';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { CombustibleDialogo } from '../combustible-dialogo/combustible-dialogo.component';
import { EfectivoDialogo } from '../efectivo-dialogo/efectivo-dialogo.component';
import { RepartoComprobanteComponent } from '../reparto-comprobante/reparto-comprobante.component';
import { FechaService } from 'src/app/servicios/fecha.service';

@Component({
  selector: 'app-reparto-entrante',
  templateUrl: './reparto-entrante.component.html',
  styleUrls: ['./reparto-entrante.component.css']
})
export class RepartoEntranteComponent implements OnInit {
  //Define el formulario General
  public formulario: FormGroup;
  //Define como un formControl
  public tipoViaje: FormControl = new FormControl();
  //Define el formulario Comrpobante
  // public formularioComprobante:FormGroup;
  // //Define el Id de la Planilla seleccionada en la primer Tabla
  // public idPlanillaSeleciconada: number;

  // //Define como un formControl
  // public tipoItem:FormControl = new FormControl();
  // //Define la lista de resultados para Zonas, Comprobantes, Letras
  // public resultadosZona = [];
  // public resultadosComprobante = [];
  // public resultadosLetra = [];
  // //Define la lista de resultados para vehiculo o vehiculoProveedor
  // public resultadosVehiculo = [];
  // //Define la lista de resultados para remolque
  // public resultadosRemolque = [];
  // //Define la lista de resultados para chofer
  // public resultadosChofer = [];
  // //Define la lista de que muestra en la primer tabla (planilla pendientes de cerrar)
  // public planillasPendientesPropio = [];
  // public planillasPendientesTercero = [];
  // public planillasPendientesDeposito = [];
  // //Define la lista de comprobantes para la planilla seleccionada
  // public comprobantesPropio = [];
  // public comprobantesTercero = [];
  // public comprobantesDeposito = [];
  // //Define la lista de acompañantes
  // public listaAcompaniantes = [];
  // //Define la lista de tipo comprobantes Activos 
  // public listaTipoComprobantes = [];
  // //Define una bandera para control
  // public bandera:boolean=false;
  //Define al elemento (Reparto seleccionado) guardado en memoria como un formControl
  public elementoEnMemoria: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['numeroReparto', 'fechaRegistracion', 'zona', 'vehiculo', 'chofer', 'fechaSalida', 'horaSalida', 'fechaRegreso', 'horaRegreso',
    'ordenesCombustibles', 'adelantosEfectivos', 'entrar', 'descargar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(
    private modelo: Reparto, private toastr: ToastrService, private appService: AppService,
    private appComponent: AppComponent, public dialog: MatDialog, private loaderService: LoaderService,
    private seguimientoOrdenRecoleccionService: SeguimientoOrdenRecoleccionService, private servicio: RepartoService,
    private seguimientoViajeRemitoService: SeguimientoViajeRemitoService, private seguimientoVentaCpteService: SeguimientoVentaComprobanteService,
    private seguimientoVentaComprobante: SeguimientoVentaComprobante, private seguimientoOrdenRecoleccion: SeguimientoOrdenRecoleccion,
    private seguimientoViajeRemito: SeguimientoViajeRemito
  ) {

  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Establece el foco en el primer campo
    setTimeout(function () {
      document.getElementById('idTipoViaje').focus();
    }, 20);
    // //Reestablece los valores
    // this.reestablecerFormulario(undefined);
    // //Establece los valores por defecto
    // this.establecerValoresPorDefecto();
  }

  //Controla el cambio en el select TipoViaje
  public cambioTipoViaje() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    if (this.tipoViaje.value) {
      this.servicio.listarAbiertosPropios().subscribe(
        res => {
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.servicio.listarAbiertosTerceros().subscribe(
        res => {
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        }
      )
    }
  }

  //Abre el modal de Viaje Combustible
  public abrirOrdenesCombustibles(elemento) {
    const dialogRef = this.dialog.open(CombustibleDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        esRepartoEntrante: true,
        elemento: elemento,
        btnCerrar: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Abre el modal de viaje Efectivo
  public abrirAdelantosEfectivo(elemento) {
    const dialogRef = this.dialog.open(EfectivoDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        esRepartoEntrante: true,
        elemento: elemento,
        btnCerrar: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  //Abre el modal de Comprobantes
  public abrirComprobantes(elemento) {
    console.log(this.elementoEnMemoria.value);
    // if (this.elementoEnMemoria.value.id = elemento.id) //
    //   elemento = this.elementoEnMemoria.value;
    const dialogRef = this.dialog.open(RepartoComprobanteComponent, {
      width: '95%',
      maxWidth: '95%',
      data: {
        esRepartoEntrante: true,
        elemento: elemento,
        btnCerrar: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.elementoEnMemoria.setValue(result.elemento); //Guarda en memoria el reparto y sus comprobantes modificados 
      document.getElementById('idTipoViaje').focus();
    });
  }
  //Abre el modal de Recibir Reparto
  public abrirRecibirReparto(elemento) {
    const dialogRef = this.dialog.open(RecibirRepartoDialogo, {
      width: '50%',
      maxWidth: '50%',
      data: {
        elemento: elemento,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      document.getElementById('idTipoViaje').focus();
    });
  }
}

@Component({
  selector: 'recibir-reparto-dialogo',
  templateUrl: 'recibir-reparto-dialogo.html',
})
export class RecibirRepartoDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la fecha actual
  public fechaActual: any;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RecibirRepartoDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private modelo: Reparto, private toastr: ToastrService, private fechaService: FechaService,
    private servicio: RepartoService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Declara el formulario y las variables 
    this.formulario = this.modelo.formulario;
    //Reestablece el formulario
    setTimeout(() => {
      this.reestablecerFormulario();
    }, 20);
  }
  //Reestablece el formulario y sus valores.
  public reestablecerFormulario() {
    this.formulario.reset();
    this.formulario.patchValue(this.data.elemento);
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.formulario.get('fechaSalida').setValue(res.json());
        this.fechaActual = res.json();
      }
    );
  }
  //Comprueba que la fecha de Recolección sea igual o mayor a la fecha actual 
  public verificarFechaSalida() {
    if (this.formulario.get('fechaSalida').value < this.fechaActual) {
      this.formulario.get('fechaSalida').setValue(this.fechaActual);
      document.getElementById('idFechaSalida').focus();
      this.toastr.error("La Fecha Salida no puede ser menor a la Fecha Actual.");
    }
  }
  //Cierra un reparto
  public recibirReparto() {
    // this.formulario.get('repartoComprobantes').setValue([]); // se ejecuta esta linea como en cerrar reparto?
    console.log(this.formulario.value);
    this.servicio.recibirReparto(this.formulario.value).subscribe(
      res => {
        this.toastr.success(res.json().mensaje);
        this.dialogRef.close();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.dialogRef.close();
      }
    )
  }
  //Obtiene la mascara de hora-minuto
  public mascararHora() {
    return this.appService.mascararHora();
  }
  //Desenmascarar Hora
  public desenmascararHora(formulario) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.desenmascararHora(valor));
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


