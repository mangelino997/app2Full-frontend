import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { PagoAnticipoService } from 'src/app/servicios/pago-anticipo.service';
import { AppService } from 'src/app/servicios/app.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface Anticipo {
  id: number,
  version: number,
  pago: {},
  importe: any,
  saldo: any,
  importeAnticipo: any
}

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
  styleUrls: ['./anticipos.component.css']
})
export class AnticiposComponent implements OnInit {
  //Define el id del registro a actualizar
  public idMod:number = 0;
  //Define el formulario
  public formulario: FormGroup;
  //Define el campo total
  public total:FormControl = new FormControl();
  //Define la lista de anticipos
  public anticipos:MatTableDataSource<Anticipo> = new MatTableDataSource([]);
  //Define la lista de anticipos seleccionados
  public anticiposSeleccionados = new SelectionModel<any>(true, []);
  //Define las columnas de la tabla
  public columnas: string[] = ['CHECK', 'FECHA', 'ORDEN_PAGO', 'ANTICIPO', 'SALDO', 'IMPORTE', 'OBSERVACIONES'];
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Muestra el boton actualizar
  public mostrarBoton:boolean = false;
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<AnticiposComponent>, @Inject(MAT_DIALOG_DATA) public data, 
    private pagoAnticipoService: PagoAnticipoService, private appService: AppService) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      totalDisponible: new FormControl(),
      saldo: new FormControl(),
      importe: new FormControl()
    });
    //Establece importe como readonly
    this.formulario.get('importe').disable();
    //Verifica si ya se cargo, anteriormente, datos en el dialogo
    this.verificarDatosExistentes(); 
  }
  //El numero de elemento seleccionados es igual al numero total de filas (Tabla de Compras Comprobantes)
  public estanTodosSeleccionados(): boolean {
    let numSeleccionado = this.anticiposSeleccionados.selected.length;
    let numFilas = this.anticipos.data.length;
    return numSeleccionado === numFilas;
  }
  //Selecciona todos los elementos si no hay ninguno seleccionado, caso contrario, limpia todas las selecciones
  public alternarSeleccion(): void {
    if(this.estanTodosSeleccionados()) {
      //Todos deseleccionados
      this.anticiposSeleccionados.clear()
      //Establece importe de la tabla en cero y total en cero
      this.anticipos.data.forEach(row => row.importeAnticipo = 0);
      this.total.setValue(this.establecerDecimales('0', 2));
    } else {
      //Todos seleccionados
      this.anticipos.data.forEach(row => this.anticiposSeleccionados.select(row));
    }
  }
  //Retorna la etiqueta de seleccionada o no
  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.estanTodosSeleccionados() ? 'select' : 'deselect'} all`;
    }
    return `${this.anticiposSeleccionados.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  //Al seleccionar un checkbox
  public seleccionarCheckbox(elemento): void {
    this.anticiposSeleccionados.toggle(elemento);
    if(!this.anticiposSeleccionados.isSelected(elemento)) {
      elemento.importeAnticipo = 0;
      this.total.setValue(this.calcularTotal());
    }
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.anticipos = new MatTableDataSource(elemento.anticipos);
      elemento.anticiposSeleccionados.selected.forEach((elem) => {
        this.anticiposSeleccionados.toggle(elem);
      });
      this.formulario.get('totalDisponible').setValue(this.calcularTotalDisponible());
      this.total.setValue(this.calcularTotal());
    } else {
      //Obtiene la lista de anticipos
      this.listarPorProveedorYSaldoMayorCero();
    }
  }
  //Obtiene la lista de anticipo por proveedor y saldo mayor a cero
  private listarPorProveedorYSaldoMayorCero(): void {
    this.show = true;
    let idProveedor = this.data.idProveedor;
    this.pagoAnticipoService.listarPorProveedorYSaldoMayorCero(idProveedor).subscribe(
      res => {
        this.anticipos = new MatTableDataSource(res.json());
        this.formulario.get('totalDisponible').setValue(this.calcularTotalDisponible());
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Calcula el total disponible
  private calcularTotalDisponible(): number {
    let total = 0;
    this.anticipos.data.forEach((elemento) => {
      total += parseFloat(elemento.saldo);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Calcula el total, suma de importes de la tabla
  private calcularTotal(): number {
    let total = 0;
    this.anticiposSeleccionados.selected.forEach((elemento) => {
      total += parseFloat(elemento.importeAnticipo ? elemento.importeAnticipo : 0);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Habilita la edicion de un registro de la tabla
  public habilitarEditar(elemento): void {
    this.formulario.get('importe').enable();
    this.mostrarBoton = true;
    this.idMod = elemento;
    this.formulario.get('saldo').setValue(this.appService.establecerDecimales(elemento.saldo, 2));
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.saldo, 2));
  }
  //Actualiza un registro de la tabla
  public actualizar(): void {
    let formulario = this.formulario.value;
    let indice = this.anticiposSeleccionados.selected.indexOf(this.idMod);
    this.anticiposSeleccionados.selected[indice].importeAnticipo = this.appService.establecerDecimales(formulario.importe, 2);
    this.formulario.get('saldo').reset();
    this.formulario.get('importe').reset();
    this.formulario.get('importe').disable();
    this.mostrarBoton = false;
    this.total.setValue(this.calcularTotal());
  }
  //Controla el estado del boton confirmar
  public obtenerEstadoBtnConfirmar(): boolean {
    return this.total.value == null || this.total.value == 0 || this.total.value == '0.00' ? true : false;
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
      anticipos: this.anticipos.data,
      anticiposSeleccionados: this.anticiposSeleccionados,
      total: this.total.value,
      formulario: {
        nombre: 'Anticipos',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}