import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatDialog, MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { RepartoService } from 'src/app/servicios/reparto.service';
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
    private modelo: Reparto, private toastr: ToastrService, public dialog: MatDialog, private loaderService: LoaderService,
    private servicio: RepartoService) {

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
  }
  //Controla el cambio en el select TipoViaje
  public cambioTipoViaje() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    if (this.tipoViaje.value) {
      this.servicio.listarAbiertosPropios().subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          if (this.listaCompleta.data.length == 0)
            this.toastr.error("Sin registros para mostrar.");
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
          this.listaCompleta = new MatTableDataSource(res.json());
          if (this.listaCompleta.data.length == 0)
            this.toastr.error("Sin registros para mostrar.");
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
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RecibirRepartoDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private modelo: Reparto, private toastr: ToastrService, private fechaService: FechaService,
    private servicio: RepartoService, private loaderService: LoaderService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
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
        this.formulario.get('fechaRegreso').setValue(res.json());
        this.fechaActual = res.json();
      }
    );
  }
  //Comprueba que la fecha de Recolección sea igual o mayor a la fecha actual 
  public verificarFechaRegreso() {
    if (this.formulario.get('fechaRegreso').value < this.fechaActual) {
      this.formulario.get('fechaRegreso').setValue(this.fechaActual);
      this.toastr.error("La Fecha Regreso no puede ser menor a la fecha actual.");
      document.getElementById('idFechaRegreso').focus();
    }
  }
  //Cierra un reparto
  public recibirReparto() {
    this.loaderService.show();
    this.servicio.recibirReparto(this.formulario.value).subscribe(
      res => {
        this.toastr.success(res.json().mensaje);
        this.loaderService.hide();
        this.dialogRef.close();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
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


