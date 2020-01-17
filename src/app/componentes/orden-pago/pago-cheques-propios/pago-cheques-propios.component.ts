import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-pago-cheques-propios',
  templateUrl: './pago-cheques-propios.component.html',
  styleUrls: ['./pago-cheques-propios.component.css']
})
export class PagoChequesPropiosComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define el total
  public total:FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show:boolean = false;
  //Defiene la columnas de la tabla
  public columnas:Array<string> = ['CUENTA_BANCARIA', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'IMPORTE'];
  //Define una lista de cuentas bancarias
  public cuentasBancarias:Array<any> = [];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<PagoChequesPropiosComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private cuentaBancariaService: CuentaBancariaService, private appService: AppService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      cuentaBancaria: new FormControl(),
      tipoChequera: new FormControl(),
      numeroCheque: new FormControl(),
      fechaPago: new FormControl(),
      importe: new FormControl()
    });
    //Obtiene la lista de cuentas bancarias por empresa
    this.listarCuentasBancariasPorEmpresa(this.appService.getEmpresa().id);
  }
  //Obtiene una lista de cuentas bancarias por empresa
  private listarCuentasBancariasPorEmpresa(idEmpresa): void {
    this.show = true;
    this.cuentaBancariaService.listarConChequerasPorEmpresa(idEmpresa).subscribe(
      res => {
        this.cuentasBancarias = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtine una lista de chequeras por cuenta bancaria
  public listarChequerasPorCuentaBancaria(idCuentaBancaria): void {
    
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}