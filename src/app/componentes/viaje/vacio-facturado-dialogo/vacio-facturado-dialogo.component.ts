import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { ViajeTramoClienteRemito } from 'src/app/modelos/viajeTramoClienteRemito';
import { ViajeTramoClienteRemitoService } from 'src/app/servicios/viaje-tramo-cliente-remito.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

@Component({
  selector: 'app-vacio-facturado-dialogo',
  templateUrl: './vacio-facturado-dialogo.component.html',
  styleUrls: ['./vacio-facturado-dialogo.component.css']
})
export class VacioFacturadoDialogoComponent implements OnInit {
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define el formulario de remito
  public formulario:FormGroup;
  //Define el tramo actual
  public tramo:FormControl = new FormControl();
  //Define el dador-destinatario actual
  public dadorDestinatario:FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual:any;
  //Constructor
  constructor(public dialogRef: MatDialogRef<VacioFacturadoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private viajeTramoClienteRemito: ViajeTramoClienteRemito, private viajeTramoClienteRemitoService: ViajeTramoClienteRemitoService, 
    private fechaServicio: FechaService, private appServicio: AppService, private toastr: ToastrService) { }
  //Al inicializar el componente
  ngOnInit() {
    //Crea el formulario remito
    this.formulario = this.viajeTramoClienteRemito.formulario;
    this.formulario.reset();
    //Establece el tramo
    this.tramo.setValue(this.data.tramo);
    //Establece el dador destinatario
    let dadorDestinatario = this.data.dadorDestinatario.clienteDador.razonSocial + ' --> ' + this.data.dadorDestinatario.clienteDestinatario.razonSocial;
    this.dadorDestinatario.setValue(dadorDestinatario);
    this.formulario.get('viajeTramoCliente').setValue(this.data.dadorDestinatario);
    this.formulario.get('viajeTarifa').setValue(this.data.viajeTarifa);
    //Obtiene la fecha actual
    this.obtenerFecha();
    //Obtiene por viaje tramo cliente
    this.obtenerPorViajeTramoCliente(this.data.dadorDestinatario.id);
  }
  //Obtiene la fecha actual
  private obtenerFecha(): void {
    this.show = true;
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formulario.get('fecha').setValue(this.fechaActual);
      this.show = false;
    });
  }
  //Obtiene el remito del dador por idCliente
  private obtenerPorViajeTramoCliente(idViajeTramoCliente): void {
    this.show = true;
    this.viajeTramoClienteRemitoService.obtenerPorViajeTramoCliente(idViajeTramoCliente).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.id != 0) {
          this.formulario.patchValue(respuesta);
          this.establecerDecimales(this.formulario.get('importeRetiro'), 2);
          this.establecerDecimales(this.formulario.get('importeEntrega'), 2);
          this.establecerDecimales(this.formulario.get('importeFlete'), 2);
        }
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Agrega el registro
  public agregar(): void {
    this.show = true;
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.viajeTramoClienteRemitoService.agregarVacioFacturado(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.toastr.success(MensajeExcepcion.VALORIZADO);
        }
        this.show = false;
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_VALORIZADO);
        this.show = false;
      }
    );
  }
  //Obtiene la mascara de importes
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}