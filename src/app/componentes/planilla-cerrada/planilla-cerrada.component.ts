import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { PersonalService } from 'src/app/servicios/personal.service';
import { RepartoDTO } from 'src/app/modelos/repartoDTO';

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
  public columnas: string[] = ['numeroReparto', 'zona', 'vehiculo', 'chofer', 'fechaSalida', 'horaSalida', 'reabrir', 'reporte'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private modelo: RepartoDTO, private choferProveedorService: ChoferProveedorService, private fechaService: FechaService,
    private personalService: PersonalService, private loaderService: LoaderService, public dialog: MatDialog, private toastr: ToastrService) {

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
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalService.listarChoferesPorDistanciaPorAlias(data, false).subscribe(response => {
          this.resultadosChofer = response.json();
        })
      }
    })
    //Autocompletado chofer proveedor - Buscar por alias
    this.formulario.get('choferProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.choferProveedorService.listarActivosPorAlias(data).subscribe(response => {
          this.resultadosChofer = response;
        })
      }
    })
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('tipoViaje').setValue(true);
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaDesde').setValue(res.json());
      this.formulario.get('fechaHasta').setValue(res.json());
    });
  }
  //Controla el cambio en el select Tipo de Viaje
  public cambioTipoViaje() {
    this.formulario.get('personal').reset();
    this.formulario.get('choferProveedor').reset();
    this.resultadosChofer = [];
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
