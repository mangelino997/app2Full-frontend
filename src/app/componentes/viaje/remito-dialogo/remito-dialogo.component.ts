import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { ViajeRemitoGS } from 'src/app/modelos/viajeRemitoGS';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { AforoComponent } from '../../aforo/aforo.component';
import { Aforo } from 'src/app/modelos/aforo';

@Component({
  selector: 'app-remito-dialogo',
  templateUrl: './remito-dialogo.component.html',
  styleUrls: ['./remito-dialogo.component.css']
})
export class RemitoDialogoComponent implements OnInit {
  //Define el tramo actual
  public tramo:FormControl = new FormControl();
  //Define el dador-destinatario actual
  public dadorDestinatario:FormControl = new FormControl();
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Define el formulario de remito
  public formulario:FormGroup;
  //Define el formulario de aforar
  public formularioAforar: FormGroup;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RemitoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, 
    private toastr: ToastrService, private appServicio: AppService, private viajeRemitoGS: ViajeRemitoGS, 
    private fechaServicio: FechaService, private tipoComprobanteServicio: TipoComprobanteService,
    public dialog: MatDialog, private aforo: Aforo) { }
  //Al incializarse el componente
  ngOnInit() {
    //Crea el formulario remito
    this.formulario = this.viajeRemitoGS.formulario;
    //Define los campos para validaciones del Aforo
    this.formularioAforar = this.aforo.formulario;
    //Establece el tramo
    this.tramo.setValue(this.data.tramo);
    //Establece el dador destinatario
    let dadorDestinatario = this.data.dadorDestinatario.clienteDador.razonSocial + ' --> ' + this.data.dadorDestinatario.clienteDestinatario.razonSocial;
    this.dadorDestinatario.setValue(dadorDestinatario);
    this.formulario.get('clienteRemitente').setValue(this.data.dadorDestinatario.clienteDador);
    this.formulario.get('clienteDestinatario').setValue(this.data.dadorDestinatario.clienteDestinatario);
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(): void {
    this.obtenerFecha();
    this.listarTiposComprobantes();
  }
  //Obtiene la fecha actual
  private obtenerFecha(): void {
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formulario.get('fecha').setValue(res.json());
    });
  }
  //Obtiene el listado de tipos comprobantes
  private listarTiposComprobantes(): void {
    this.tipoComprobanteServicio.listarActivosIngresoCarga().subscribe(
      res => {
        this.tiposComprobantes = res.json();
        this.establecerTipoComprobantePorDefecto();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Establece el tipo comprobante por defecto
  private establecerTipoComprobantePorDefecto() {
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobantes[1]);
    this.formulario.get('letra').setValue('R');
  }
  //Abre un modal para agregar un aforo
  public agregarAforo(): void {
    const dialogRef = this.dialog.open(AforoComponent, {
      width: '80%',
      maxWidth: '80%',
      data: {
        formularioAforar: this.formularioAforar.value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.formularioAforar.patchValue(resultado);
        this.formulario.get('kilosAforado').setValue(this.appServicio.setDecimales(resultado.kiloAforadoTotal, 2));
      }else{
        this.formularioAforar.reset();
        this.formulario.get('kilosAforado').setValue(this.appServicio.setDecimales('0.00', 2));
      }
    });
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appServicio.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de enteros con separador de miles
  public mascararEnterosSinDecimales(intLimite) {
    return this.appServicio.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene la mascara de importe
  public mascararEnterosConDecimales(intLimite) {
    return this.appServicio.mascararEnterosConDecimales(intLimite);
  }
  //Establece los enteros
  public establecerEnteros(formulario): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerEnteros(valor));
    }
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  public cerrar(): void {
    this.dialogRef.close();
  }
}