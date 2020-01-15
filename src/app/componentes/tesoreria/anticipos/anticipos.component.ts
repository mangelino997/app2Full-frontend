import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { CobranzaAnticiposService } from 'src/app/servicios/cobranza-anticipos.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { ObservacionesDialogo } from '../../observaciones-dialogo/observaciones-dialogo.component';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
  styleUrls: ['./anticipos.component.css']
})
export class AnticiposComponent implements OnInit {
  //Define el indice del registro seleccionado en la tabla
  public idMod: number = null;
  //Define el formulario
  public formulario: FormGroup;
  //Define el totalDisponible como un formControl
  public totalDisponible: FormControl = new FormControl();
  //Define el total como un formControl
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Define la lista completa de registros (se modificaran)
  public listaCompleta = new MatTableDataSource([]);
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['FECHA', 'ORDEN_PAGO', 'OBSERVACIONES', 'ANTICIPO', 'SALDO', 'IMPORTE', 'EDITAR'];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<AnticiposComponent>, @Inject(MAT_DIALOG_DATA) public data,
    public appService: AppService, private servicio: CobranzaAnticiposService, private toastr: ToastrService,
    private dialog: MatDialog) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      id: new FormControl(),
      cobranza: new FormControl(),
      saldo: new FormControl(),
      importe: new FormControl()
    })
    //Bloqueo el formulario hasta que selecione el boton editar
    this.formulario.disable();
    //Obtiene la lista de registros por Cliente
    this.listarPorCliente();
  }
  //Completa la listaCompleta 
  private listarPorCliente() {
    if (this.data.cliente) {
      this.servicio.listarPorCliente(this.data.cliente.id).subscribe(
        res => {
          console.log(res.json());
          this.listaCompleta.data = res.json();
          this.listaCompleta.sort = this.sort;
          this.listaCompleta.data.length == 0 ? this.toastr.warning("Sin datos para mostrar.") :
            [this.calcularTotalDisponible(), this.establecerAtributoChecked()];
        },
        err => {
          this.toastr.error(err.json().mensaje);
        }
      )
    } else {
      this.toastr.error("Debe seleccionar un Cliente en la ventana principal.");
    }
  }
  //Calcula el total disponible 
  private calcularTotalDisponible() {
    let totalDisponible = 0;
    if (this.listaCompleta.data.length > 0) {
      this.listaCompleta.data.forEach(
        item => {
          totalDisponible += Number(item.saldo);
        }
      )
    }
    console.log(totalDisponible);
    this.totalDisponible.setValue(this.appService.setDecimales(String(totalDisponible), 2));
  }
  //Establece atributo 'checked' a cada registro de la lista
  private establecerAtributoChecked() {
    for (let i = 0; i < this.listaCompleta.data.length; i++) {
      this.listaCompleta.data[i].checked = false;
    }
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        tema: this.appService.getTema(),
        elemento: elemento,
        soloLectura: true
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Controla el cambio los check-box
  public cambioCheck(elemento, indice, $event) {
    //Si el check esta en 'true' crea una variable boolean para controlarlo en el front
    if ($event.checked) {
      elemento.checked = true;
      this.listaCompleta.data[indice].importe = this.listaCompleta.data[indice].saldo;
      this.listaCompleta.data[indice].saldo = 0;
    } else {
      elemento.checked = false;
      this.listaCompleta.data[indice].saldo = Number(this.listaCompleta.data[indice].saldo) + Number(this.listaCompleta.data[indice].importe);
      this.listaCompleta.data[indice].importe = 0;
    }
    this.calcularTotalItemsYTotalDeuda();
  }
  /* Determina la cantidad de elementos de la tabla y el total de deuda, 
     tanto para registros seleccionados como para todos */
  private calcularTotalItemsYTotalDeuda(): void {
    //suma el importe de todos los registros seleccionados
    let total = 0;
    this.listaCompleta.data.forEach((elemento) => {
      elemento.checked ? total += elemento.importe : '';
    })
    //Establece el total obtenido en el formControl 'Total' 
    this.total.setValue(this.appService.establecerDecimales(
      total == 0 ? '0.00' : total, 2));
  }
  //Completa los campos del formulario con los datos del registro a modificar
  public activarActualizar(elemento, indice) {
    this.formulario.enable();
    this.formulario.patchValue(elemento);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.formulario.get('saldo').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.idMod = indice;
  }
  //Actualiza el campo 'saldo' del elemento seleccionado
  public actualizarAnticipo() {
    console.log(this.formulario.value, this.idMod);
    //Calculo el saldo restante
    let saldo = Number(this.formulario.value.saldo) - Number(this.formulario.value.importe);
    this.formulario.value.saldo = saldo;
    console.log(saldo);
    //Establezco el atributo 'checked'
    this.formulario.value.checked = true;
    //Reemplazo el registro de la tabla por el formulario 
    this.listaCompleta.data[this.idMod] = this.formulario.value;
    this.listaCompleta.sort = this.sort;
    //Calculo los totales
    this.calcularTotalItemsYTotalDeuda();
    //Reestablezco 
    this.idMod = null;
    this.formulario.reset();
    this.formulario.disable();

  }
  //Controla que importe sea menor o igual a saldo
  public cambioImporte() {
    if (this.formulario.value.importe) {
      this.setDecimales(this.formulario.get('importe'), 2);
      let importe = Number(this.formulario.value.importe);
      let saldo = Number(this.formulario.value.saldo);
      console.log(importe, saldo);
      (importe > saldo) || (importe < 0) ?
        [this.toastr.error("Importe debe ser mayor a 0 y menor a saldo."), this.formulario.get('importe').reset()] : '';
    }
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}