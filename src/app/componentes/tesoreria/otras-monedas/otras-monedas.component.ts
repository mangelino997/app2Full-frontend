import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otras-monedas',
  templateUrl: './otras-monedas.component.html',
  styleUrls: ['./otras-monedas.component.css']
})
export class OtrasMonedasComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['MONEDA', 'CANTIDAD', 'CAMBIO', 'IMPORTE', 'ELIMINAR'];
  //Define la lista de monedas
  public monedas:Array<any> = [];
  //Define la lista de cotizaciones
  public cotizaciones:Array<any> = [];
  //Define la fecha actual
  public fechaActual:any = null;
  //Define una lista de otras monedas
  public otrasmonedas = new MatTableDataSource([]);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<OtrasMonedasComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private monedaService: MonedaService, private monedaCotizacionService: MonedaCotizacionService,
    private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      moneda: new FormControl('', Validators.required),
      cantidad: new FormControl('', Validators.required),
      cotizacion: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required)
    });
    //Verifica si ya se cargo datos en el dialogo actual
    this.verificarDatosExistentes();
    //Obtiene la lista de monedas activas
    this.listarMonedas();
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.otrasmonedas = new MatTableDataSource(elemento.otrasmonedas);
      this.total.setValue(this.calcularTotal());
    }
  }
  //Obtiene la lista de monedas
  private listarMonedas(): void {
    this.show = true;
    this.monedaService.listarActivas().subscribe(
      res => {
        this.monedas = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene las cotizaciones por moneda
  public listarCotizacionesPorMoneda(idMoneda): void {
    this.show = true;
    this.monedaCotizacionService.listarPorMoneda(idMoneda).subscribe(
      res => {
        this.cotizaciones = res.json();
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
    let lista = this.otrasmonedas.data;
    lista.push(formulario);
    this.otrasmonedas.data = lista;
    this.formulario.reset();
    document.getElementById('idMoneda').focus();
    this.total.setValue(this.calcularTotal());
  }
  //Calcula el importe total
  private calcularTotal(): number {
    let total = 0;
    this.otrasmonedas.data.forEach((elemento) => {
      total += parseFloat(elemento.importe);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Calcula el importe a partir de la cantidad y la cotizacion
  public calcularImporte(): void {
    let cantidad = this.formulario.get('cantidad').value;
    let valor = this.formulario.get('cotizacion').value.valor;
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(cantidad*valor, 2));
  }
  //Elimina un elemento de la tabla
  public eliminarItemTabla(indice): void {
    let lista = this.otrasmonedas.data;
    lista.splice(indice, 1);
    this.otrasmonedas.data = lista;
    this.total.setValue(this.calcularTotal());
    document.getElementById('idMoneda').focus();
  }
  //Verifica si la cantidad es mayor a cero
  public verificarCantidadMayorCero(valor): void {
    if(valor <= 0) {
      document.getElementById("labelCantidadOM").classList.add('label-error');
      document.getElementById("idCantidadOM").classList.add('is-invalid');
      document.getElementById("idCantidadOM").focus();
      this.toastr.error('La cantidad debe ser mayor a cero');
    }
  }
  //Verifica si el importe es mayor a cero
  public verificarImporteMayorCero(valor, cantidad): void {
    valor = this.appService.establecerDecimales(valor, cantidad);
    this.formulario.get('importe').setValue(valor);
    if(valor <= 0) {
      document.getElementById("labelImporteOM").classList.add('label-error');
      document.getElementById("idImporteOM").classList.add('is-invalid');
      document.getElementById("idImporteOM").focus();
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
  //Mascara un entero
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
      otrasmonedas: this.otrasmonedas.data,
      total: this.total.value,
      formulario: {
        nombre: 'Otras Monedas',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}