import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-pago-efectivo',
  templateUrl: './pago-efectivo.component.html',
  styleUrls: ['./pago-efectivo.component.css']
})
export class PagoEfectivoComponent implements OnInit {
  //Define el importe
  public importe:FormControl = new FormControl('', Validators.required);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<PagoEfectivoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService) { }
  //Al inicializarse el componente
  ngOnInit() { }
  //Mascara un importe decimal
  public mascararImporte(limite, decimalLimite) {
    return this.appService.mascararImporte(limite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Cierra el dialogo
  public cerrar(importe): void {
    let formulario = {
      nombre: 'Efectivo',
      importe: importe
    }
    this.dialogRef.close(formulario);
  }
}