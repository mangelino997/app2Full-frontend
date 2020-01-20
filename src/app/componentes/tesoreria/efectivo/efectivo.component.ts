import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-efectivo',
  templateUrl: './efectivo.component.html',
  styleUrls: ['./efectivo.component.css']
})
export class EfectivoComponent implements OnInit {
  //Define el importe
  public importe:FormControl = new FormControl('', Validators.required);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<EfectivoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService) { }
  //Al inicializarse el componente
  ngOnInit() { 
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.importe.setValue(elemento.importe);
    }
  }
  //Obtiene el estado del boton confirmar
  public obtenerEstadoBtnConfirmar(): boolean {
    let importe = this.importe.value;
    return importe == 0 || importe == '0.00' || importe == null ? true : false;
  }
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
    let elemento = {
      indice: this.data.elemento.value ? this.data.elemento.value.indice : -1,
      importe: this.importe.value,
      formulario: {
        nombre: 'Efectivo',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}