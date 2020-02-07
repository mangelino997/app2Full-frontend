import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { VentaComprobanteItemCR } from 'src/app/modelos/ventaComprobanteItemCR';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';

@Component({
  selector: 'app-contrareembolso-dialogo',
  templateUrl: './contrareembolso-dialogo.component.html',
  styleUrls: ['./contrareembolso-dialogo.component.css']
})
export class ContrareembolsoDialogoComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define el importeTotal como un formControl
  public importeTotal: FormControl = new FormControl();
  //Define la lista de Alicuotas Afip Iva que estan activas
  public afipAlicuotasIva = [];
  constructor(private appService: AppService, private alicuotasIvaService: AfipAlicuotaIvaService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContrareembolsoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private modelo: VentaComprobanteItemCR, private ventaConfigService: VentaConfigService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = this.modelo.formulario;
    //Si en el data viene un CR ya cargado lo setea
    this.data.ventaComprobanteItemCR.length > 0 ?
      [this.formulario.patchValue(this.data.ventaComprobanteItemCR[0]), this.cambioPComision()] :
       this.formulario.reset();
    //Obtiene la lista de Alicuotas Iva
    this.listarAlicuotaIva();
    //Obtiene el procentaje de comision por defecto
    this.obtenerPComision();
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
  //Obtiene pComision de ventaConfig 
  private obtenerPComision() {
    this.ventaConfigService.obtenerPorId(1).subscribe(
      res => {
        this.formulario.get('pComision').setValue(this.appService.establecerDecimales(res.json().comisionCR, 2));
      },
      err => { this.toastr.error(err.json().mensaje); }
    )
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
    if (this.formulario.get('pComision').value && this.formulario.get('importeContraReembolso').value) {
      /* establece los decimales */
      this.establecerPorcentaje(this.formulario.get('pComision'), 2);
      this.setDecimales(this.formulario.get('importeContraReembolso'), 2);

      /* convierte a numerico para realizar los calculos */
      let importe = Number(this.formulario.value.importeContraReembolso);
      let pComision = Number(this.formulario.value.pComision);

      /* realiza la operacion para calcular importes */
      this.formulario.get('afipAlicuotaIva').enable();
      let afipAlicuotaIva = this.formulario.value.afipAlicuotaIva;
      let importeNetoGravado = importe * (pComision / 100);
      let importeIva = importeNetoGravado * (afipAlicuotaIva.alicuota / 100);
      let importeTotal = importeNetoGravado + importeIva;
      this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIva.toString(), 2));
      this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(importeNetoGravado.toString(), 2));
      this.importeTotal.setValue(this.appService.establecerDecimales(importeTotal.toString(), 2));
      this.formulario.get('afipAlicuotaIva').disable();

      /* asigna el idProvincia del clienteRemitente*/
      this.formulario.get('idProvincia').setValue(this.data.idProvincia);
    } else {
      this.toastr.error("Error al calcular importes. Valores en cero.");
      this.formulario.get('importeNetoGravado').reset();
      this.importeTotal.reset();
    }
  }
  //Cierra el modal y envía el formulario de contrareembolso
  public enviarContrareembolso() {
    if(!this.formulario.get('importeNetoGravado').value || this.formulario.get('importeNetoGravado').value==0){
      this.formulario.enable();
      this.dialogRef.close(this.formulario.value);
    }else{
      this.dialogRef.close(null);
    }
    
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
