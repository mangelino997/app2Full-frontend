import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-cobranza-efectivo',
  templateUrl: './cobranza-efectivo.component.html',
  styleUrls: ['./cobranza-efectivo.component.css']
})
export class CobranzaEfectivoComponent implements OnInit {
  //Define el importe
  public importe: FormControl = new FormControl('', Validators.required);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<CobranzaEfectivoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
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
  public cerrar(importe): void {
    this.dialogRef.close(importe);
  }
}