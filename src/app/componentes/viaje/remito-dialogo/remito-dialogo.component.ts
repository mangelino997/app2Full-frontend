import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
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
  //Define la tarifa seleccionada en el tramo
  public tarifa:any;
  //Define la lista de tramos (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define el ordenamiento de la lista
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  //Define el paginador de la lista
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  //Define el campo fecha para focus
  @ViewChild('fecha', {static: false}) fecha : ElementRef;
  //Activa el boton cancelar
  public esEditable:boolean = false;
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
    //Establece la tarifa seleccionada en el tramo
    this.tarifa = this.data.viajeTarifa;
    if(this.tarifa.id != 0) {
      this.formulario.get('viajeTarifa').setValue(this.tarifa);
      this.formulario.get('importeCosto').setValue(this.data.importeCosto);
    }
    //Obtiene la lista
    this.listar();
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
  //Obtiene la lista de cliente remitos
  private listar(): void {
    this.loaderService.show();
    this.viajeTramoClienteRemitoService.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
        this.toastr.error(MensajeExcepcion.NO_LISTO);
      }
    );
  }
  //Agrega un remito
  public agregar(): void {
    this.loaderService.show();
    this.formulario.get('tipoComprobante').enable();
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.viajeTramoClienteRemitoService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.toastr.success(MensajeExcepcion.AGREGADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  public actualizar(): void {
    this.loaderService.show();
    this.formulario.get('tipoComprobante').enable();
    this.formulario.get('usuarioMod').setValue(this.appServicio.getUsuario());
    this.viajeTramoClienteRemitoService.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.toastr.success(MensajeExcepcion.ACTUALIZADO);
        }
        this.loaderService.hide();
      },
      err =>{
        this.loaderService.hide();
        this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
      }
    );
  }
  //Carga un registro en formulario para ser actualizado
  public editar(elemento): void {
    this.esEditable = true;
    this.formulario.patchValue(elemento);
    elemento.puntoVenta ? this.formulario.get('puntoVenta').setValue(this.mostrarCeros(elemento.puntoVenta, '0000', -5)) :
      this.formulario.get('puntoVenta').reset();
    elemento.numero ? this.formulario.get('numero').setValue(this.mostrarCeros(elemento.numero, '0000000', -8)) :
      this.formulario.get('numero').reset();
    elemento.m3 ? this.formulario.get('m3').setValue(this.appServicio.establecerDecimales(elemento.m3, 2)) :
      this.formulario.get('m3').reset();
    elemento.valorDeclarado ? this.formulario.get('valorDeclarado').setValue(this.appServicio.establecerDecimales(elemento.valorDeclarado, 2)) :
      this.formulario.get('valorDeclarado').reset();
    elemento.kilosEfectivo ? this.formulario.get('kilosEfectivo').setValue(this.appServicio.establecerDecimales(elemento.kilosEfectivo, 2)) :
      this.formulario.get('kilosEfectivo').reset();
    elemento.kilosAforado ? this.formulario.get('kilosAforado').setValue(this.appServicio.establecerDecimales(elemento.kilosAforado, 2)) :
      this.formulario.get('kilosAforado').reset();
    elemento.precioUnitario ? this.formulario.get('precioUnitario').setValue(this.appServicio.establecerDecimales(elemento.precioUnitario, 2)) :
      this.formulario.get('precioUnitario').reset();
    elemento.importeCosto ? this.formulario.get('importeCosto').setValue(this.appServicio.establecerDecimales(elemento.importeCosto, 2)) :
      this.formulario.get('importeCosto').reset();
    elemento.importeRetiro ? this.formulario.get('importeRetiro').setValue(this.appServicio.establecerDecimales(elemento.importeRetiro, 2)) :
      this.formulario.get('importeRetiro').reset();
    elemento.importeEntrega ? this.formulario.get('importeEntrega').setValue(this.appServicio.establecerDecimales(elemento.importeEntrega, 2)) :
      this.formulario.get('importeEntrega').reset();
    elemento.importeFlete ? this.formulario.get('importeFlete').setValue(this.appServicio.establecerDecimales(elemento.importeFlete, 2)) :
      this.formulario.get('importeFlete').reset();
  }
  public cancelar(): void {
    this.esEditable = false;
    this.reestablecerFormulario();
  }
  //Elimina un registro
  public eliminar(id): void {
    this.loaderService.show();
    this.viajeTramoClienteRemitoService.eliminar(id).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.listar();
          this.toastr.success(MensajeExcepcion.ELIMINADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
        this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
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
    this.esEditable = false;
    this.formulario.reset();
    this.establecerTipoComprobantePorDefecto();
    this.formulario.get('fecha').setValue(this.fechaActual);
    this.formulario.get('viajeTramoCliente').setValue(this.data.dadorDestinatario);
    this.fecha.nativeElement.focus();
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
  public establecerDecimalesTabla(valor, decimales) {
    return parseFloat(valor).toFixed(decimales);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Define como se muestra los datos con ceros a la izquierda
  public mostrarCeros(elemento, string, cantidad) {
    if (elemento != undefined) {
      return elemento ? (string + elemento).slice(cantidad) : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}