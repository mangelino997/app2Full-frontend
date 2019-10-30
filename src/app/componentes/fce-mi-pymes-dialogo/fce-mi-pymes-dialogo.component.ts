import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteCuentaBancariaService } from 'src/app/servicios/cliente-cuenta-bancaria.service';
import { AppService } from 'src/app/servicios/app.service';
import { ClienteVtoPagoService } from 'src/app/servicios/cliente-vto-pago.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fce-mi-pymes-dialogo',
  templateUrl: './fce-mi-pymes-dialogo.component.html',
  styleUrls: ['./fce-mi-pymes-dialogo.component.css']
})
export class FceMiPymesDialogoComponent implements OnInit {

  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la fecha de la factura
  public fechaFactura: any = null;
  //Define la lista de registros en tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['mes', 'fechaPago'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<FceMiPymesDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private clienteCuentaBancariaService: ClienteCuentaBancariaService, private clienteVtoPagoService: ClienteVtoPagoService,
    private appService: AppService, private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Define el formulario y sus validaciones
    this.formulario = new FormGroup({
      cliente: new FormControl(),
      cbu: new FormControl(),
      diasFechaFactura: new FormControl(),
      fechaVtoPago: new FormControl()
    });
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene la lista de cuenta bancaria y CBU del emisor
    this.listarCuentaBancaria();
    //Obtiene la lista de vto. pagos y dias fecha factura
    this.listarVtoPagos();
  }
  //Establece valores por defecto que recibe de la Factura
  private establecerValoresPorDefecto() {
    this.listaCompleta = new MatTableDataSource([]);
    this.formulario.get('cliente').setValue(this.data.cliente.razonSocial);
    this.data.fechaVtoPago ? this.formulario.get('fechaVtoPago').setValue(this.data.fechaVtoPago) : this.formulario.get('fechaVtoPago').setValue(this.data.fechaFactura);
  }
  //Carga la lista de cuenta bancaria
  private listarCuentaBancaria() {
    this.clienteCuentaBancariaService.listarPorClienteYEmpresa(this.data.cliente.id, this.appService.getEmpresa().id).subscribe(
      res => {
        console.log(res.json());
        let respuesta = res.json();
        respuesta.length > 0 ? this.formulario.get('cbu').setValue(respuesta[0].cuentaBancaria.cbu) : '';
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Carga la lista de vto. pagos
  private listarVtoPagos() {
    this.clienteVtoPagoService.listarPorClienteYEmpresa(this.data.cliente.id, this.appService.getEmpresa().id).subscribe(
      res => {
        console.log(res.json());
        let respuesta = res.json();
        respuesta.length > 0 ? this.generarListaCompleta(respuesta) : '';
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Genera la lista completa solo con los atributos necesarios
  private generarListaCompleta(resultado) {
    let listaFiltradaPorMes = [];
    resultado[0].enero ? listaFiltradaPorMes.push({ mes: 'ENERO', fechaPago: resultado[0].enero }) : '';
    resultado[0].febrero ? listaFiltradaPorMes.push({ mes: 'FEBRERO', fechaPago: resultado[0].febrero }) : '';
    resultado[0].marzo ? listaFiltradaPorMes.push({ mes: 'MARZO', fechaPago: resultado[0].marzo }) : '';
    resultado[0].abril ? listaFiltradaPorMes.push({ mes: 'ABRIL', fechaPago: resultado[0].abril }) : '';
    resultado[0].mayo ? listaFiltradaPorMes.push({ mes: 'MAYO', fechaPago: resultado[0].mayo }) : '';
    resultado[0].junio ? listaFiltradaPorMes.push({ mes: 'JUNIO', fechaPago: resultado[0].junio }) : '';
    resultado[0].julio ? listaFiltradaPorMes.push({ mes: 'JULIO', fechaPago: resultado[0].julio }) : '';
    resultado[0].agosto ? listaFiltradaPorMes.push({ mes: 'AGOSTO', fechaPago: resultado[0].agosto }) : '';
    resultado[0].septiembre ? listaFiltradaPorMes.push({ mes: 'SEPTIEMBRE', fechaPago: resultado[0].septiembre }) : '';
    resultado[0].octubre ? listaFiltradaPorMes.push({ mes: 'OCTUBRE', fechaPago: resultado[0].octubre }) : '';
    resultado[0].noviembre ? listaFiltradaPorMes.push({ mes: 'NOVIEMBRE', fechaPago: resultado[0].noviembre }) : '';
    resultado[0].diciembre ? listaFiltradaPorMes.push({ mes: 'DICIEMBRE', fechaPago: resultado[0].diciembre }) : '';

    this.formulario.get('diasFechaFactura').setValue(resultado[0].diasFechaFactura);
    this.listaCompleta = new MatTableDataSource(listaFiltradaPorMes);
    this.listaCompleta.sort = this.sort;
  }
  //Controla si la fecha es valida o no, debe ser igual o mayor a la fecha de la factura
  public verificarFecha() {
    if (this.formulario.get('fechaVtoPago').value < this.data.fechaFactura) {
      this.formulario.get('fechaVtoPago').setValue(this.data.fechaFactura);
      this.toastr.error("La Fecha Vto. no puede ser menor a la Fecha de la factura.");
      document.getElementById('idFechaVtoPago').focus();
    } else {
      this.data.fechaVtoPago = this.formulario.get('fechaVtoPago').value;
    }
  }
  //Cierra el dialogo
  public closeDialog() {
    this.dialogRef.close(this.data.fechaVtoPago);
  }
}
