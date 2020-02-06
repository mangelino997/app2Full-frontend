import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { VentaComprobanteItemCR } from 'src/app/modelos/ventaComprobanteItemCR';

@Component({
  selector: 'app-contrareembolso-dialogo',
  templateUrl: './contrareembolso-dialogo.component.html',
  styleUrls: ['./contrareembolso-dialogo.component.css']
})
export class ContrareembolsoDialogoComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  constructor(private appService: AppService, private alicuotasIvaService: AfipAlicuotaIvaService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContrareembolsoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private modelo: VentaComprobanteItemCR) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = this.modelo.formulario;
    //Si en el data viene un CR ya cargado lo setea
    this.data.ventaComprobanteItemCR.length > 0 ?
      [this.formulario.patchValue(this.data.ventaComprobanteItemCR[0]), this.cambioPComision()] : '';
    //Obtiene la lista de Alicuotas Iva
    this.listarAlicuotaIva();
  }
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva() {
    this.alicuotasIvaService.listarActivas().subscribe(
      res => {
        this.afipAlicuotasIva = res.json();
        this.establecerAlicuotaIva();
      }
    );
  }
  //Establece alicuota iva por defecto
  private establecerAlicuotaIva() {
    this.afipAlicuotasIva.forEach(elemento => {
      if (elemento.id == 5) {
        this.formulario.get('afipAlicuotaIva').setValue(elemento);
        this.formulario.get('afipAlicuotaIva').disable();
      }
    })
  }
  //Controla el cambio en el porcentaje de comision
  public cambioPComision() {
    this.formulario.value.importeContraReembolso ? this.calcularComision() : [this.toastr.error('Ingrese un importe'), document.getElementById('idImporteContrareembolso').focus()];
  }
  //Calcula el valor de la Comision
  public calcularComision() {
    this.establecerPorcentaje(this.formulario.get('pComision'), 2);
    let importe = Number(this.formulario.value.importeContraReembolso);
    let pComision = Number(this.formulario.value.pComision);
    this.formulario.get('afipAlicuotaIva').enable();
    let afipAlicuotaIva = this.formulario.value.afipAlicuotaIva;
    let importeComision = importe * (pComision / 100);
    let importeIva = importeComision * (afipAlicuotaIva.alicuota / 100);
    let importeNtoGravado = importeComision + importeIva;
    this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIva, 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(importeNtoGravado, 2));
    this.formulario.get('afipAlicuotaIva').disable();
  }
  //Cierra el modal y envía el formulario de contrareembolso
  public enviarContrareembolso(){
    this.formulario.enable();
    this.dialogRef.close(this.formulario.value);
  }
  //Obtiene la mascara de enteros CON decimales
  public mascararEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.desenmascararPorcentaje(valor, cantidad)) : '';
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    valor ? formulario.setValue(this.appService.establecerDecimales(valor, cantidad)) : '';
  }
}
