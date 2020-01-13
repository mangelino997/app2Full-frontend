import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CobranzaItem } from 'src/app/modelos/cobranzaItem';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ListaRemitoDialogoComponent } from '../../emitir-factura/lista-remito-dialogo/lista-remito-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cobranza-item-dialogo',
  templateUrl: './cobranza-item-dialogo.component.html',
  styleUrls: ['./cobranza-item-dialogo.component.css']
})
export class CobranzaItemDialogoComponent implements OnInit {

  //Define el formulario
  public formulario: FormGroup;
  //Define los formControls para mostrar solo datos
  public pVenta: FormControl = new FormControl();
  public letra: FormControl = new FormControl();
  public numero: FormControl = new FormControl();
  public importeSaldo: FormControl = new FormControl();
  constructor(private modelo: CobranzaItem, public dialog: MatDialog, private appService: AppService,
    public dialogRef: MatDialogRef<CobranzaItemDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    //inicializa el formulario de Cobranza y sus elementos
    this.formulario = this.modelo.formulario;
    this.formulario.get('ventaComprobante').setValue(this.data.ventaComprobante);
    //inicializa los formControls
    this.letra.setValue(this.data.ventaComprobante.letra);
    this.numero.setValue(this.completarCeros(this.data.ventaComprobante.numero, '0000000', -8));
    this.pVenta.setValue(this.completarCeros(this.data.ventaComprobante.puntoVenta, '0000', -5));
    this.importeSaldo.setValue(this.data.ventaComprobante.importeSaldo);
    console.log(this.data.ventaComprobante);
  }
  //Controla el cambio en el campo 'importe'
  public cambioImporteCuenta() {
    this.setDecimales(this.formulario.get('importe'), 2);
    let importe = Number(this.formulario.value.importe);
    //controla que el importe ingresado sea menor a 'importeSaldo'
    if (Number(this.formulario.value.importe) > Number(this.importeSaldo.value)) {
      this.formulario.get('importe').setValue(this.appService.setDecimales('0.00', 2));
      this.toastr.error("El importe debe ser menor a importe saldo.");
    }
  }
  //Define como se muestra los datos con ceros a la izquierda
  public completarCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
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
}
