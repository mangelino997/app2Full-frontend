import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort } from '@angular/material';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';

@Component({
  selector: 'app-cuenta-bancaria-dialogo',
  templateUrl: './cuenta-bancaria-dialogo.component.html',
  styleUrls: ['./cuenta-bancaria-dialogo.component.css']
})
export class CuentaBancariaDialogoComponent implements OnInit {
  //Define la razon social de la empresa
  public empresaRazonSocial:string = null;
  //Define la lista de cuentas bancarias
  public cuentasBancarias = new MatTableDataSource([]);
  //Define las columnas de la tabla cuenta bancaria
  public columnasCuentaBancaria: string[] = ['banco', 'sucursal', 'tipoCuenta', 'numCuenta', 'cbu', 'aliasCbu', 'seleccionar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructo
  constructor(public dialogRef: MatDialogRef<CuentaBancariaDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private cuentaBancariaServicio: CuentaBancariaService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Define empresa
    let empresa = this.data.empresa;
    //Establece la razon social de la empresa
    this.empresaRazonSocial = empresa.razonSocial;
    //Obtiene la lista de cuentas bancarias por empresa
    this.cuentaBancariaServicio.listarPorEmpresa(empresa.id).subscribe(
      res => {
        this.cuentasBancarias = new MatTableDataSource(res.json());
        this.cuentasBancarias.sort = this.sort;
      },
      err => {

      }
    );
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}