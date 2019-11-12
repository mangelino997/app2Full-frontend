import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

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
    public dialogRef: MatDialogRef<ContrareembolsoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = new FormGroup({
      ventaComprobante: new FormControl(),
      importeContraReembolso: new FormControl(),
      pComision: new FormControl(),
      comision: new FormControl(),
      afipAlicuotaIva: new FormControl(),
      // ordenVenta: new FormControl(,),

    })
    //Si en el data viene un CR ya cargado lo setea
    this.data.ventaComprobanteItemCR.length > 0 ? [this.formulario.patchValue(this.data.ventaComprobanteItemCR[0]), this.cambioPComision()] : '';
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
    let importeCR = Number(this.formulario.value.importeContraReembolso);
    let pComision = Number(this.formulario.value.pComision);
    let comision = importeCR + importeCR * (pComision / 100);
    this.formulario.get('comision').setValue(this.appService.establecerDecimales(comision, 2));
    this.formulario.get('comision').disable();
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
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
