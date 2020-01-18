import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { ChequeCarteraService } from 'src/app/servicios/cheque-cartera.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-pago-cheques-electronicos',
  templateUrl: './pago-cheques-electronicos.component.html',
  styleUrls: ['./pago-cheques-electronicos.component.css']
})
export class PagoChequesElectronicosComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['CHECK', 'BANCO', 'NUMERO_CHEQUE', 'FECHA_PAGO', 'CUIT_EMISOR', 'IMPORTE'];
  //Define la fecha actual
  public fechaActual:any = null;
  //Define la lista de cheques en cartera
  public chequesCartera = new MatTableDataSource([]);
  //Define la lista de compras comprobantes seleccionados
  public chequesCarteraSeleccionados = new SelectionModel<any>(true, []);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<PagoChequesElectronicosComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private fechaService: FechaService, private appService: AppService, private toastr: ToastrService,
    private chequeCarteraService: ChequeCarteraService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      fechaPagoDesde: new FormControl('', Validators.required),
      fechaPagoHasta: new FormControl('', Validators.required),
      importeDesde: new FormControl(),
      importeHasta: new FormControl(),
      numero: new FormControl(),
      eCheq: new FormControl()
    });
    //Obtiene la fecha actual
    this.obtenerFechaActual();
    //Verifica si ya se cargo datos en el dialogo actual
    this.verificarDatosExistentes();
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.chequesCartera = new MatTableDataSource(elemento.chequesCartera);
      elemento.chequesCarteraSeleccionados.selected.forEach((elem) => {
        this.chequesCarteraSeleccionados.toggle(elem);
      });
      this.total.setValue(this.calcularTotal());
    }
  }
  //El numero de elemento seleccionados es igual al numero total de filas (Tabla de Compras Comprobantes)
  public estanTodosSeleccionados(): boolean {
    let numSeleccionado = this.chequesCarteraSeleccionados.selected.length;
    let numFilas = this.chequesCartera.data.length;
    return numSeleccionado === numFilas;
  }
  //Selecciona todos los elementos si no hay ninguno seleccionado, caso contrario, limpia todas las selecciones
  public alternarSeleccion(): void {
    this.estanTodosSeleccionados() ?
        this.chequesCarteraSeleccionados.clear() :
        this.chequesCartera.data.forEach(row => this.chequesCarteraSeleccionados.select(row));
    //Establece el importe total
    this.total.setValue(this.calcularTotal());
  }
  //Retorna la etiqueta de seleccionada o no
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.estanTodosSeleccionados() ? 'select' : 'deselect'} all`;
    }
    return `${this.chequesCarteraSeleccionados.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  //Al seleccionar un checkbox
  public seleccionarCheckbox(row): void {
    this.chequesCarteraSeleccionados.toggle(row);
    //Establece el importe total
    this.total.setValue(this.calcularTotal());
  }
  //Obtiene la fecha actual
  private obtenerFechaActual(): void {
    this.show = true;
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.fechaActual = res.json();
        this.formulario.get('fechaPagoDesde').setValue(this.fechaActual);
        this.formulario.get('fechaPagoHasta').setValue(this.fechaActual);
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene una lista de cheques por filtro
  public buscar(): void {
    this.show = true;
    let formulario = this.formulario.value;
    formulario.eCheq = true;
    this.chequeCarteraService.listarPorFiltros(formulario).subscribe(
      res => {
        this.chequesCartera = new MatTableDataSource(res.json());
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Calcula el importe total
  private calcularTotal(): number {
    let total = 0;
    this.chequesCarteraSeleccionados.selected.forEach((elemento) => {
      total += parseFloat(elemento.importe);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Verifica que fecha hasta sea mayor que fecha desde
  public verificarFechaMayor(): void {
    let valor1 = this.formulario.get('fechaPagoHasta').value;
    let valor2 = this.formulario.get('fechaPagoDesde').value;
    if(valor2 > valor1) {
      document.getElementById("labelFechaPagoHasta").classList.add('label-error');
      document.getElementById("idFechaPagoHasta").classList.add('is-invalid');
      document.getElementById("idFechaPagoHasta").focus();
      this.toastr.error('Fecha Pago Hasta debe ser mayor a Fecha Pago Desde');
    }
  }
  //Verifica que importe hasta sea mayor que importe desde
  public verificarImporteMayor(): void {
    this.establecerDecimales(this.formulario.get('importeHasta'), 2);
    let valor1 = this.formulario.get('importeHasta').value;
    let valor2 = this.formulario.get('importeDesde').value;
    if(Number(valor2) > Number(valor1)) {
      document.getElementById("labelImporteHasta").classList.add('label-error');
      document.getElementById("idImporteHasta").classList.add('is-invalid');
      document.getElementById("idImporteHasta").focus();
      this.toastr.error('Importe Hasta debe ser mayor a Importe Desde');
    }
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Establece los decimales de importes de la tabla
  public establecerDecimalesTabla(valor, cantidad): number {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Define mascara de numero entero
  public mascararEntero(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Mascara un importe decimal
  public mascararImporte(limite, decimalLimite) {
    return this.appService.mascararImporte(limite, decimalLimite);
  }
  //Cierra el dialogo
  public cerrar(importe): void {
    let elemento = {
      indice: this.data.elemento.value ? this.data.elemento.value.indice : -1,
      chequesCartera: this.chequesCartera.data,
      chequesCarteraSeleccionados: this.chequesCarteraSeleccionados,
      total: this.total.value,
      formulario: {
        nombre: 'Cheques Electrónicos',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}