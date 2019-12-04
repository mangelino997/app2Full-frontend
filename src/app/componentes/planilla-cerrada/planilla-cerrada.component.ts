import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { PersonalService } from 'src/app/servicios/personal.service';
import { RepartoDTO } from 'src/app/modelos/repartoDTO';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-planilla-cerrada',
  templateUrl: './planilla-cerrada.component.html',
  styleUrls: ['./planilla-cerrada.component.css']
})
export class PlanillaCerradaComponent implements OnInit {

  //Define el formulario General
  public formulario: FormGroup;
  //Define la lista de resultados para chofer
  public resultadosChofer = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['numeroReparto', 'fechaRegistracion', 'zona', 'vehiculo', 'chofer', 'fechaSalida', 'horaSalida', 'reabrir', 'reporte'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private modelo: RepartoDTO, private choferProveedorService: ChoferProveedorService, private fechaService: FechaService,
    private personalService: PersonalService, private loaderService: LoaderService, public dialog: MatDialog, private toastr: ToastrService,
    private servicio: RepartoService, private appService: AppService) {
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Autocompletado chofer- Buscar por alias
    this.formulario.get('idChofer').valueChanges.subscribe(data => {
      if (typeof data == 'string' && this.formulario.value.esRepartoPropio) {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.personalService.listarChoferesCortaDistanciaPorAlias(data).subscribe(response => {
            this.resultadosChofer = response;
            response.length == 0 ? this.toastr.error("No se encontraron registros.") : '';
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
      else if (typeof data == 'string' && !this.formulario.value.esRepartoPropio) {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.choferProveedorService.listarActivosPorAlias(data).subscribe(response => {
            this.resultadosChofer = response;
            response.length == 0 ? this.toastr.error("No se encontraron registros.") : '';
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.reset();
    this.formulario.get('estaCerrada').setValue(true);
    this.formulario.get('esRepartoPropio').setValue(true);
    this.formulario.get('idEmpresa').setValue(this.appService.getEmpresa().id);
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaDesde').setValue(res.json());
      this.formulario.get('fechaHasta').setValue(res.json());
    });
  }
  //Controla el cambio en el select Tipo de Viaje
  public cambioTipoViaje() {
    this.formulario.get('idChofer').reset();
    this.resultadosChofer = [];
  }
  //Comprueba que la fecha de Recolección sea igual o mayor a la fecha actual 
  public verificarFecha() {
    if (this.formulario.get('fechaHasta').value < this.formulario.get('fechaDesde').value) {
      this.formulario.get('fechaHasta').reset();
      document.getElementById('idFechaHasta').focus();
      this.toastr.error("La Fecha Hasta no puede ser menor a la Fecha Desde");
    }
  }
  //Obtine la lista de registros por filtro y lo setea en la tabla
  public listarPorFiltros() {
    this.loaderService.show();
    let chofer = null;
    if (this.formulario.value.idChofer) {
      chofer = this.formulario.value.idChofer;
      this.formulario.get('idChofer').setValue(chofer.id);
    }
    this.servicio.listarPorFiltros(this.formulario.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        res.json().length > 0 ? this.listaCompleta.sort = this.sort : this.toastr.error("Sin registros para mostrar.");
        this.formulario.get('idChofer').setValue(chofer);
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.formulario.get('idChofer').setValue(chofer);
        document.getElementById('idTipoViaje').focus();
        this.loaderService.hide();
      }
    )
  }
  //Abre el dialogo reabrir reparto para confirmar
  public reabrirReparto(idReparto) {
    const dialogRef = this.dialog.open(ReabrirRepartoDialogo, {
      width: '40%',
      maxWidth: '40%',
      data: {
        idReparto: idReparto,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listarPorFiltros();
      document.getElementById('idTipoViaje').focus();
    });
  }
  //Abre el dialogo que muestra el reporte
  public abrirReporte() {

  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}

//Componente Confirmar
@Component({
  selector: 'reabrir-reparto-dialogo',
  templateUrl: 'reabrir-reparto-dialogo.html',
})
export class ReabrirRepartoDialogo {
  //Constructor
  constructor(public dialogRef: MatDialogRef<ReabrirRepartoDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService, private servicio: RepartoService) { }
  //Al inicializarse el componente
  ngOnInit() {
  }
  //Reabre un reparto
  public reabrirReparto() {
    this.servicio.abrirReparto(this.data.idReparto).subscribe(
      res => {
        res.json().codigo == 5005 ? this.toastr.success(res.json().mensaje) : '';
        this.dialogRef.close();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.dialogRef.close();
      }
    )
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}