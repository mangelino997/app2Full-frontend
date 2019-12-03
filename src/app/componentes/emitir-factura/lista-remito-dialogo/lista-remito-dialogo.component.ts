import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ObservacionesDialogo } from '../../observaciones-dialogo/observaciones-dialogo.component';
import { TramoService } from 'src/app/servicios/tramo.service';
import { ViajeTramoRemitoService } from 'src/app/servicios/viaje-tramo-remito.service';
import { ViajeTramoClienteRemitoService } from 'src/app/servicios/viaje-tramo-cliente-remito.service';

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
  //Define la lista de Remitos seleccionados
  public listaRemitoSeleccionados: Array<any> = [];
  //Define el elemento seleccionado en el check-box como un FormControl y lo inicializa con valor por defecto
  public elementoSeleccionado: FormControl = new FormControl({ id: 0 });
  //Define las columnas de la tabla
  public columnas: string[] = ['NUMERO_VIAJE', 'CHOFER', 'TRAMO', 'NUMERO_REMITO', 'FECHA', 'BULTOS', 'KG_EFECTIVO', 'VALOR_DECLARADO',
    'REMITENTE', 'DESTINATARIO', 'SUC_ENTREGA', 'OBSERVACIONES', 'CHECK'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private serviceRemitoGeneral: ViajeTramoRemitoService, private loaderService: LoaderService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListaRemitoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private tramoService: TramoService, private serviceNoEsRemitoGeneral: ViajeTramoClienteRemitoService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    if (this.data.esRemitoGeneral) {
      /*Define los campos del formulario y validaciones si es un Remito General -G.S*/
      this.formularioFiltro = new FormGroup({
        idViaje: new FormControl(),
        idRemito: new FormControl(),
        estaFacturado: new FormControl(0)
      })
    } else {
      /*Define los campos del formulario y validaciones si es Dador de Carga*/
      this.formularioFiltro = new FormGroup({
        idViaje: new FormControl('', Validators.required),
        idRemito: new FormControl(),
        estaFacturado: new FormControl(0)
      })
      //Obtiene la lista de Tramos
      this.listarTramos();
    }
    //Maneja el data que proviene al abrir el modal
    this.controlDataModal();
  }
  //Maneja el data que recibe el modal al abrirse
  private controlDataModal() {
    if (this.data.configuracionModalRemitos.formularioFiltro) {
      this.formularioFiltro.patchValue(this.data.configuracionModalRemitos.formularioFiltro);
      this.formularioFiltro.disable();
      this.data.configuracionModalRemitos.listaCompletaRemitos.forEach(element => {
        if (element.mostrarCheck = true)
          this.remitoAsignado(element) ? element.mostrarCheck = false : element.mostrarCheck = true;
      });
      this.listaCompleta = new MatTableDataSource(this.data.configuracionModalRemitos.listaCompletaRemitos);
      this.listaCompleta.sort = this.sort;
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
  //Maneja el cambio en el input 'N° de Viaje'
  public cambioNumeroViaje() {
    this.formularioFiltro.value.idRemito ? this.formularioFiltro.get('idRemito').reset() : '';
  }
  //Obtiene los registros mediante el formulario de filtro
  public filtrar() {
    this.loaderService.show();
    if (this.data.esRemitoGeneral) {
      this.serviceRemitoGeneral.listarPorViajeYEstado(this.formularioFiltro.value).subscribe(
        res => {
          let respuesta = res.json();
          respuesta.length > 0? this.asignarAtributoChecked(respuesta, true) : this.toastr.error("Sin registros para mostrar.");
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().message);
          this.loaderService.hide();
        }
      )
    } else {
      this.serviceNoEsRemitoGeneral.listarPorViajeYEstado(this.formularioFiltro.value).subscribe(
        res => {
          let respuesta = res.json();
          respuesta.length > 0? this.asignarAtributoChecked(respuesta, false) : this.toastr.error("Sin registros para mostrar.");
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().message);
          this.loaderService.hide();
        }
      )
    }
  }
  /*Agrga a cada registro el atributo 'checked' para controlarlo en la vista
   Le paso como parámetro si es RemitoGeneral en true ó si es DadorCarga como false (en éste establece el json viajeRemito)*/
  private asignarAtributoChecked(registros, esRemitoGeneral) {
    let listaModificada = [];
    registros.forEach(elemento => {
      if (!esRemitoGeneral) {
        let registro = elemento; /* guarda los datos de cada fila devuelta */
        elemento = {};
        elemento.viajeRemito = registro; /* genero el atributo(json) viajeRemito y le asigno los datos del registro*/
        
        /* genera el nuevo json con sus atributos correspondientes */
        elemento.id = registro.id;
        elemento.checked = false;
        elemento.mostrarCheck = true;
      } else {
        elemento.checked = false;
        elemento.mostrarCheck = true;
      }
      listaModificada.push(elemento); /* agrega cada elemento(registro) a la nueva lista modificada  */
    });
    this.data.configuracionModalRemitos.formularioFiltro = this.formularioFiltro.value;
    this.data.configuracionModalRemitos.listaCompletaRemitos = listaModificada;
    this.listaCompleta = new MatTableDataSource(listaModificada);
    this.listaCompleta.sort = this.sort;
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
  //Controla el cambio los check-box
  public cambioCheck(elemento, indice, event) {
    event.checked ?
      this.controlCheck(elemento) : this.listaCompleta.data[indice].checked = false;
    this.data.configuracionModalRemitos.listaCompletaRemitos = this.listaCompleta.data;
  }
  //Controla que un solo checkbox puede estar en true a la vez. recibe el id del elemento checkeado = true
  private controlCheck(elementoSeleccionado) {
    this.listaCompleta.data.forEach(elemento => {
      elemento.id == elementoSeleccionado.id ? elemento.checked = true : elemento.checked = false;
    })
    this.data.remitoSeleccionado = elementoSeleccionado;
  }
  //Limpia formularioFiltro, listaCompleta y el data del modal
  public limpiarConfiguracion() {
    this.formularioFiltro.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.data.configuracionModalRemitos.listaCompletaRemitos = [];
    this.data.configuracionModalRemitos.formularioFiltro = [];
  }
  //Controla los remitos que ya fueron asignados a la Factura principal. Si fueron asignados, no se muestra el check-box
  public remitoAsignado(elemento) {
    let resultado = false;
    this.data.listaItemsAsignados.forEach(element => {
      if (resultado == false)
        element.id == elemento.id ? resultado = true : resultado = false;
    });
    return resultado;
  }
}
