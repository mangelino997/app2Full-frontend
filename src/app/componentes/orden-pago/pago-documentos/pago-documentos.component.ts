import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoDocumentoCarteraService } from 'src/app/servicios/tipo-documento-cartera.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pago-documentos',
  templateUrl: './pago-documentos.component.html',
  styleUrls: ['./pago-documentos.component.css']
})
export class PagoDocumentosComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define el total
  public total: FormControl = new FormControl();
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Defiene la columnas de la tabla
  public columnas: Array<string> = ['DOCUMENTO', 'NUMERO', 'FECHA_PAGO', 'IMPORTE', 'ELIMINAR'];
  //Define la lista de tipos de documentos
  public tiposDocumentos:Array<any> = [];
  //Define la fecha actual
  public fechaActual:any = null;
  //Define una lista de documentos
  public documentos = new MatTableDataSource([]);
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<PagoDocumentosComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private fechaService: FechaService, private tipoDocumentoCarteraService: TipoDocumentoCarteraService,
    private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      documento: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      fechaPago: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required)
    });
    //Verifica si ya se cargo datos en el dialogo actual
    this.verificarDatosExistentes();
    //Obtiene la fecha actual
    this.obtenerFechaActual();
    //Obtiene una lista de tipos de documentos
    this.listarTiposDocumentos();
  }
  //Verifica si ya se cargo datos en el dialogo actual
  private verificarDatosExistentes(): void {
    let elemento = this.data.elemento.value;
    if(elemento) {
      this.documentos = new MatTableDataSource(elemento.documentos);
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
  //Obtiene una lista de tipos de documentos
  private listarTiposDocumentos(): void {
    this.show = true;
    this.tipoDocumentoCarteraService.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
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
    let lista = this.documentos.data;
    lista.push(formulario);
    this.documentos.data = lista;
    this.formulario.reset();
    this.formulario.get('fechaPago').setValue(this.fechaActual);
    document.getElementById('idDocumento').focus();
    this.total.setValue(this.calcularTotal());
  }
  //Calcula el importe total
  private calcularTotal(): number {
    let total = 0;
    this.documentos.data.forEach((elemento) => {
      total += parseFloat(elemento.importe);
    });
    return this.appService.establecerDecimales(total != 0 ? total : '0', 2);
  }
  //Elimina un elemento de la tabla
  public eliminarItemTabla(indice): void {
    let lista = this.documentos.data;
    lista.splice(indice, 1);
    this.documentos.data = lista;
    this.total.setValue(this.calcularTotal());
    document.getElementById('idDocumento').focus();
  }
  //Verifica si el importe es mayor a cero
  public verificarImporteMayorCero(valor, cantidad): void {
    valor = this.appService.establecerDecimales(valor, cantidad);
    this.formulario.get('importe').setValue(valor);
    if(valor <= 0) {
      document.getElementById("labelImporteD").classList.add('label-error');
      document.getElementById("idImporteD").classList.add('is-invalid');
      document.getElementById("idImporteD").focus();
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
  //Verifica que la fecha ingresada sea mayor a la de hoy
  public verificarFecha(fecha): void {
    if(fecha < this.fechaActual) {
      document.getElementById("labelFechaPagoD").classList.add('label-error');
      document.getElementById("idFechaPagoD").classList.add('is-invalid');
      document.getElementById("idFechaPagoD").focus();
      this.toastr.error('La fecha de pago debe ser mayor a la de hoy');
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numero').value;
    let tipoDocumento = this.formulario.get('documento').value;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if (!respuesta2) {
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 3:
          let respuesta3 = this.appService.validarDNI(documento.toString());
          if (!respuesta3) {
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err;
    if (respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Cierra el dialogo
  public cerrar(importe): void {
    let elemento = {
      indice: this.data.elemento.value ? this.data.elemento.value.indice : -1,
      documentos: this.documentos.data,
      total: this.total.value,
      formulario: {
        nombre: 'Documentos',
        importe: importe
      }
    }
    this.dialogRef.close(elemento);
  }
}
