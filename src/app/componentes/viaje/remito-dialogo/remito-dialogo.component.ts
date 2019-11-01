import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { AforoComponent } from '../../aforo/aforo.component';
import { Aforo } from 'src/app/modelos/aforo';
import { ViajeTarifaService } from 'src/app/servicios/viaje-tarifa.service';
import { ViajeTramoClienteRemito } from 'src/app/modelos/viajeTramoClienteRemito';
import { ViajeTramoClienteRemitoService } from 'src/app/servicios/viaje-tramo-cliente-remito.service';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';

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
  //Define la lista de viajes tarifas con costo tramo false
  public viajesTarifasCostoTramoFalse: Array<any> = [];
  //Defiene viaje tarifa
  public viajeTarifa:FormControl = new FormControl();
  //Define la lista de tramos (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define la fecha actual
  public fechaActual:any;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'tipoComprobante', 'puntoVenta', 'letra', 'numero', 'bultos', 'm3', 'kgEfectivo', 'valorDeclarado', 'facturado', 'editar'];
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define el formulario de remito
  public formulario:FormGroup;
  //Define el formulario de aforar
  public formularioAforar: FormGroup;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RemitoDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data, 
    private toastr: ToastrService, private appServicio: AppService, private viajeTramoClienteRemito: ViajeTramoClienteRemito, 
    private fechaServicio: FechaService, private tipoComprobanteServicio: TipoComprobanteService,
    public dialog: MatDialog, private aforo: Aforo, private viajeTarifaServicio: ViajeTarifaService,
    private viajeTramoClienteRemitoService: ViajeTramoClienteRemitoService, private loaderService: LoaderService) { }
  //Al incializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Crea el formulario remito
    this.formulario = this.viajeTramoClienteRemito.formulario;
    this.formulario.reset();
    //Define los campos para validaciones del Aforo
    this.formularioAforar = this.aforo.formulario;
    this.formularioAforar.reset();
    //Establece el tramo
    this.tramo.setValue(this.data.tramo);
    //Establece el dador destinatario
    let dadorDestinatario = this.data.dadorDestinatario.clienteDador.razonSocial + ' --> ' + this.data.dadorDestinatario.clienteDestinatario.razonSocial;
    this.dadorDestinatario.setValue(dadorDestinatario);
    this.formulario.get('viajeTramoCliente').setValue(this.data.dadorDestinatario);
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(): void {
    this.obtenerFecha();
    this.listarTiposComprobantes();
    this.listarViajesTarifasCostoTramoFalse();
  }
  //Obtiene la fecha actual
  private obtenerFecha(): void {
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formulario.get('fecha').setValue(this.fechaActual);
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
  //Obtiene el listado de viajes tarifas
  private listarViajesTarifasCostoTramoFalse() {
    this.viajeTarifaServicio.listarPorCostoTramoFalse().subscribe(
      res => {
        this.viajesTarifasCostoTramoFalse = res.json();
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
    this.formulario.get('tipoComprobante').disable();
  }
  //Calcula el importe costo
  public calcularImporte() {
    this.establecerDecimales(this.formulario.get('precioUnitario'), 2);
    let cantidad = this.formulario.get('cantidad').value;
    let precio = this.formulario.get('precioUnitario').value;
    if(cantidad && precio) {
      let importe = cantidad * precio;
      this.formulario.get('importeCosto').setValue(parseFloat(importe.toString()).toFixed(2));
    }
  }
  //Agrega un remito
  public agregar(): void {
    this.loaderService.show();
    this.formulario.get('tipoComprobante').enable();
    this.viajeTramoClienteRemitoService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario();
          this.toastr.success(MensajeExcepcion.AGREGADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
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
  //Reestablece los campos
  private reestablecerFormulario(): void {
    this.formulario.reset();
    this.establecerTipoComprobantePorDefecto();
    this.formulario.get('fecha').setValue(this.fechaActual);
  }
  //Obtiene la mascara de importes
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
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