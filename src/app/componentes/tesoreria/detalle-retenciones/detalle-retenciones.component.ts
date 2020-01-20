import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-retenciones',
  templateUrl: './detalle-retenciones.component.html',
  styleUrls: ['./detalle-retenciones.component.css']
})
export class DetalleRetencionesComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['TIPO_RETENCION', 'PUNTO_VENTA', 'NUMERO', 'ANIO', 'MES', 'PROVINCIA', 'IMPORTE', 'ELIMINAR'];
  //Define la lista de tipos de retenciones
  public tiposRetenciones:Array<any> = [];
  //Define la lista de retenciones
  public retenciones = new MatTableDataSource([]);
  //Define la lista de anios
  public anios:Array<any> = [];
  //Define la lista de meses
  public meses:Array<any> = [];
  //Define la lista de provincias
  public provincias:Array<any> = [];
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<DetalleRetencionesComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private tipoRetencionService: TipoRetencionService,
    private fechaService: FechaService, private mesService: MesService,
    private provinciaService: ProvinciaService, private toastr: ToastrService) { }
  //Al inicializarse el componente ejecuta el codigo de OnInit
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      tipoRetencion: new FormControl('', Validators.required),
      puntoVenta: new FormControl('', Validators.required),
      letra: new FormControl(),
      numero: new FormControl('', Validators.required),
      anio: new FormControl('', Validators.required),
      mes: new FormControl('', Validators.required),
      provincia: new FormControl(),
      importe: new FormControl('', Validators.required)
    });
    //Verifica si ya se cargo datos en el dialogo actual
    this.verificarDatosExistentes();
    //Obtiene la lista de tipos de retenciones
    this.listarTiposRetenciones();
    //Obtiene la lista de años
    this.listarAniosPorAnioFiscal();
    //Obtiene la lista de meses
    this.listarMeses();
    //Establece la letra por defecto
    this.formulario.get('letra').setValue('A');
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    const elemento = this.data.elemento;
    if(elemento) {
      this.retenciones = new MatTableDataSource(elemento.retenciones);
      this.total.setValue(this.calcularTotal());
    }
  }
  //Calcula el importe total
  private calcularTotal(): number {
    let total = 0;
    this.retenciones.data.forEach((elemento) => {
      total += parseFloat(elemento.importe);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Obtiene la lista de tipos de retenciones
  private listarTiposRetenciones(): void {
    this.show = true;
    this.tipoRetencionService.listar().subscribe(
      res => {
        this.tiposRetenciones = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene la lista de años por año fiscal
  private listarAniosPorAnioFiscal(): void {
    this.show = true;
    this.fechaService.listarAnioFiscal().subscribe(
      res => {
        this.anios = res.json();
        this.formulario.get('anio').setValue(this.anios[0]);
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene la lista de meses
  private listarMeses(): void {
    this.show = true;
    this.mesService.listar().subscribe(
      res => {
        this.meses = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene la lista de provincias
  private listarProvincias(): void {
    this.show = true;
    this.provinciaService.listar().subscribe(
      res => {
        this.provincias = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Agrega un elemento a la tabla
  public agregar(): void {
    let formulario = this.formulario.value;
    let lista = this.retenciones.data;
    lista.push(formulario);
    this.retenciones.data = lista;
    this.formulario.reset();
    this.formulario.get('letra').setValue('A');
    this.formulario.get('anio').setValue(this.anios[0]);
    document.getElementById('idTipoRetencionDR').focus();
    this.total.setValue(this.calcularTotal());
  }
  //Elimina un elemento de la tabla
  public eliminarItemTabla(indice): void {
    let lista = this.retenciones.data;
    lista.splice(indice, 1);
    this.retenciones.data = lista;
    this.total.setValue(this.calcularTotal());
    document.getElementById('idTipoRetencionDR').focus();
  }
  //Establece el estado del campo provincia (habilitado o deshabilitado)
  public establecerEstadoProvincia(tipoRetencion): void {
    if(tipoRetencion.id == 2) {
      this.formulario.get('provincia').enable();
      this.listarProvincias();
    } else {
      this.formulario.get('provincia').disable();
    }
  }
  //Verifica si el importe es mayor a cero
  public verificarImporteMayorCero(valor, cantidad): void {
    valor = this.appService.establecerDecimales(valor, cantidad);
    this.formulario.get('importe').setValue(valor);
    if(valor <= 0) {
      document.getElementById("labelImporteDR").classList.add('label-error');
      document.getElementById("idImporteDR").classList.add('is-invalid');
      document.getElementById("idImporteDR").focus();
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
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Define como se muestra los datos con ceros a la izquierda
  public establecerCerosIzqTabla(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
  }
  //Mascara un entero
  public mascararEnteros(limite) {
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
  //Confirma y cierra el dialogo
  public confirmar(): void {
    let elemento = {
      retenciones: this.retenciones.data,
      total: this.total.value,
    }
    this.dialogRef.close(elemento);
  }
}