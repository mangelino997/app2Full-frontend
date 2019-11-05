import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ObservacionesDialogo } from '../../observaciones-dialogo/observaciones-dialogo.component';
import { TramoService } from 'src/app/servicios/tramo.service';

@Component({
  selector: 'app-lista-remito-dialogo',
  templateUrl: './lista-remito-dialogo.component.html',
  styleUrls: ['./lista-remito-dialogo.component.css']
})
export class ListaRemitoDialogoComponent implements OnInit {

  //Define un formulario para validaciones de campos
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros - tabla de items agregados
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Tramos
  public listaTramos: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['NUMERO_VIAJE', 'CHOFER', 'TRAMO', 'NUMERO_REMITO', 'FECHA', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO',
    'REMITENTE', 'DESTINATARIO', 'SUC_ENTREGA', 'OBSERVACIONES'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private service: ViajeRemitoService, private loaderService: LoaderService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListaRemitoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private tramoService: TramoService) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    /*Define los campos del formulario y validaciones si es un Remito General -G.S*/
    if (this.data.esRemitoGeneral) {
      this.formularioFiltro = new FormGroup({
        numeroViaje: new FormControl('', Validators.required),
        numeroRemito: new FormControl('', Validators.required),
        estado: new FormControl(true)
      })
    } else { /*Define los campos del formulario y validaciones si es Dador de Carga*/
      this.formularioFiltro = new FormGroup({
        numeroViaje: new FormControl('', Validators.required),
        tramo: new FormControl(),
        estado: new FormControl(true)
      })
      //Obtiene la lista de Tramos
      this.listarTramos();
    }
  }
  //Carga la lista de Tramos
  private listarTramos() {
    this.tramoService.listar().subscribe(
      res => {
        this.listaTramos = res.json();
      },
      err => {
        this.toastr.error(err.json().message);
      }
    )
  }
  //Obtiene los registros mediante el formulario de filtro
  public filtrar() {
    this.loaderService.show();
    console.log(this.formularioFiltro.value);
    this.service.listarPorViajeYEstado(this.formularioFiltro.value).subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().message);
        this.loaderService.hide();
      }
    )
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '70%',
      maxWidth: '70%',
      data: {
        elemento: elemento,
        soloLectura: true
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Obtiene la mascara de enteros SIN decimales
  public mascararEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Establece control para lista remitos con checkbox
  // get controlRemitos() {
  //   return <FormArray>this.formularioViajeRemito.get('remitos');
  // }
}
