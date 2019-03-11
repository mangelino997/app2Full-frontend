import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';
import { Aforo } from 'src/app/modelos/aforo';
import { AppService } from 'src/app/servicios/app.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-aforo',
  templateUrl: './aforo.component.html',
  styleUrls: ['./aforo.component.css']
})
export class AforoComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  constructor(private aforo: Aforo, private servicio: VentaConfigService, private toastr: ToastrService, private appService: AppService,
    public dialogRef: MatDialogRef<AforoComponent>, @Inject(MAT_DIALOG_DATA) public data)
  {
    this.dialogRef.disableClose = true;
   }
  ngOnInit() {
    this.formulario = this.aforo.formulario;
    this.servicio.obtenerPorId(1).subscribe(
      res=>{
        this.formulario.get('aforo').setValue(res.json().aforo);
      }
    )
  }
  //calcula el aforo total 
  public calcularTotal(){
    this.formulario.get('kiloAforadoTotal').setValue(0);
    let total = 0;
    let aforo = this.formulario.get('aforo').value;
    let cantidad = this.formulario.get('cantidad').value;
    let alto = this.formulario.get('alto').value;
    let ancho = this.formulario.get('ancho').value;
    let largo = this.formulario.get('largo').value;
    total= aforo * cantidad* alto * ancho * largo;
    this.formulario.get('kiloAforadoTotal').setValue(total);
    this.data.formulario = this.formulario.get('kiloAforadoTotal').value;
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Reestablece el formulario
  public reestablecerFormulario() {
    this.formulario.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
