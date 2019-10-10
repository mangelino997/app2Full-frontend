import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';
import { Aforo } from 'src/app/modelos/aforo';
import { AppService } from 'src/app/servicios/app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-aforo',
  templateUrl: './aforo.component.html',
  styleUrls: ['./aforo.component.css']
})
export class AforoComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  constructor(private aforo: Aforo, private servicio: VentaConfigService, private appService: AppService,
    public dialogRef: MatDialogRef<AforoComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.formulario = this.aforo.formulario;
    if (this.data.formularioAforar.kiloAforadoTotal) {
      console.log(this.data.formularioAforar);
      this.formulario.patchValue(this.data.formularioAforar);
      this.data.formulario = this.formulario.value;
    } else {
      this.servicio.obtenerPorId(1).subscribe(
        res => {
          let aforo = res.json().aforo;
          this.formulario.get('aforo').setValue(this.establecerDecimales(aforo, 2));
        },
        err => {
          if (err.json().status == 500)
            this.formulario.get('aforo').setValue(this.establecerDecimales('350', 2));
        }
      );
    }

  }
  //calcula el aforo total 
  public calcularTotal() {
    let total = 0;
    let aforo = this.formulario.get('aforo').value ? this.formulario.get('aforo').value : '350';
    let cantidad = this.formulario.get('cantidad').value ? this.formulario.get('cantidad').value : '0';
    let alto = this.formulario.get('alto').value ? this.formulario.get('alto').value : '0.00';
    let ancho = this.formulario.get('ancho').value ? this.formulario.get('ancho').value : '0.00';
    let largo = this.formulario.get('largo').value ? this.formulario.get('largo').value : '0.00';
    total = aforo * cantidad * alto * ancho * largo;
    this.formulario.get('kiloAforadoTotal').setValue(this.establecerDecimales(total, 2));
    this.data.formulario = this.formulario.value;
  }
  //Obtiene la mascara de enteros SIN decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if (valor != '') {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Reestablece el formulario
  public reestablecerFormulario() {
    this.formulario.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}