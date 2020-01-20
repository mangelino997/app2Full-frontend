import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { AppService } from 'src/app/servicios/app.service';
import { ChequeraService } from 'src/app/servicios/chequera.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cheques-propios',
  templateUrl: './cheques-propios.component.html',
  styleUrls: ['./cheques-propios.component.css']
})
export class ChequesPropiosComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define el total
  public total:FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show:boolean = false;
  //Defiene la columnas de la tabla
  public columnas:Array<string> = ['CUENTA_BANCARIA', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'IMPORTE', 'ELIMINAR'];
  //Define una lista de cuentas bancarias
  public cuentasBancarias:Array<any> = [];
  //Define una lista de tipos de chequeras
  public tiposChequeras:Array<any> = [];
  //Define la fecha actual
  public fechaActual:any = null;
  //Define la lista de cheques propios
  public chequesPropios = new MatTableDataSource([]);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<ChequesPropiosComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private cuentaBancariaService: CuentaBancariaService, private appService: AppService,
    private chequeraService: ChequeraService, private fechaService: FechaService,
    private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      cuentaBancaria: new FormControl('', Validators.required),
      tipoChequera: new FormControl('', Validators.required),
      numeroCheque: new FormControl('', Validators.required),
      fechaPago: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required)
    });
    //Obtiene la lista de cuentas bancarias por empresa
    this.listarCuentasBancariasPorEmpresa(this.appService.getEmpresa().id);
    //Obtiene la fecha actual
    this.obtenerFechaActual();
    //Verifica si ya se cargo, anteriormente, datos en el dialogo
    this.verificarDatosExistentes();
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.chequesPropios = new MatTableDataSource(elemento.chequesPropios);
      this.total.setValue(this.calcularTotal());
    }
  }
  //Obtiene la fecha actual
  private obtenerFechaActual(): void {
    this.show = true;
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.fechaActual = res.json();
        this.formulario.get('fechaPago').setValue(this.fechaActual);
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
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
    this.show = true;
    this.chequeraService.listarPorCuentaBancaria(idCuentaBancaria).subscribe(
      res => {
        this.tiposChequeras = res.json();
        this.show = false;
      },
      err => {
        this.show = true;
      }
    );
  }
  //Agrega un elemento a la tabla
  public agregar(): void {
    let formulario = this.formulario.value;
    let lista = this.chequesPropios.data;
    lista.push(formulario);
    this.chequesPropios.data = lista;
    this.formulario.reset();
    this.formulario.get('fechaPago').setValue(this.fechaActual);
    document.getElementById('idCuentaBancaria').focus();
    this.total.setValue(this.calcularTotal());
  }
  //Calcula el importe total
  private calcularTotal(): number {
    let total = 0;
    this.chequesPropios.data.forEach((elemento) => {
      total += parseFloat(elemento.importe);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Elimina un elemento de la tabla
  public eliminarItemTabla(indice): void {
    let lista = this.chequesPropios.data;
    lista.splice(indice, 1);
    this.chequesPropios.data = lista;
    this.total.setValue(this.calcularTotal());
    document.getElementById('idCuentaBancaria').focus();
  }
  //Verifica si el importe es mayor a cero
  public verificarImporteMayorCero(valor, cantidad): void {
    valor = this.appService.establecerDecimales(valor, cantidad);
    this.formulario.get('importe').setValue(valor);
    if(valor <= 0) {
      document.getElementById("labelImporteCP").classList.add('label-error');
      document.getElementById("idImporteCP").classList.add('is-invalid');
      document.getElementById("idImporteCP").focus();
      this.toastr.error('El importe debe ser mayor a cero');
    }
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Obtiene el estado del boton confirmar
  public obtenerEstadoBtnConfirmar(): boolean {
    let total = this.total.value;
    return total == null;
  }
  //Establece los decimales en la tabla
  public establecerDecimalesTabla(valor, cantidad): number {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Define mascara de numero entero
  public mascararEntero(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Mascara un importe decimal
  public mascararImporte(limite, decimalLimite) {
    return this.appService.mascararImporte(limite, decimalLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Cierra el dialogo
  public cerrar(importe): void {
    let elemento = {
      indice: this.data.elemento.value ? this.data.elemento.value.indice : -1,
      chequesPropios: this.chequesPropios.data,
      total: this.total.value,
      formulario: {
        nombre: 'Cheques Propios',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}