import { Component, OnInit, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MatDialog, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObservacionesDialogo } from '../observaciones-dialogo/observaciones-dialogo.component';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeEfectivo } from 'src/app/modelos/viajeEfectivo';
import { ViajeEfectivoService } from 'src/app/servicios/viaje-efectivo';
import { NormalizarDialogo } from '../viaje/normalizar-dialogo.component';
import { AnularDialogo } from '../viaje/anular-dialogo.component';

@Component({
  selector: 'app-efectivo-dialogo',
  templateUrl: './efectivo-dialogo.component.html',
  styleUrls: ['./efectivo-dialogo.component.css']
})
export class EfectivoDialogo implements OnInit {
  @Output() dataEvent = new EventEmitter();
  //Define un formulario viaje  efectivo para validaciones de campos
  public formularioViajeEfectivo: FormGroup;
  //Define el importe Total como un formControl
  public importeTotal = new FormControl();
  //Define la lista de adelantos de efectivo (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de empresas
  public empresas: Array<any> = [];
  //Define la fecha actual
  public fechaActual: any;
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del efectivo para las modificaciones
  public indiceEfectivo: number;
  //Define si muestra el boton agregar efectivo o actualizar efectivo
  public btnEfectivo: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el id del viaje
  public ID_VIAJE: number;
  //Define si muestra el boton CERRAR 
  public btnCerrar: boolean = false;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['adelanto', 'sucursal', 'fecha', 'empresa', 'importe', 'observaciones', 'anulado', 'obsAnulado', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Constructor
  constructor(private viajeEfectivoModelo: ViajeEfectivo, private empresaServicio: EmpresaService,
    private fechaServicio: FechaService, public dialog: MatDialog,
    private appServicio: AppService, private toastr: ToastrService, private servicio: ViajeEfectivoService,
    private loaderService: LoaderService, public dialogRef: MatDialogRef<EfectivoDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario viaje  efectivo
    this.formularioViajeEfectivo = this.viajeEfectivoModelo.formulario;
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Establece los valores por defecto del formulario viaje efectivo
    this.establecerValoresPorDefecto(1);
    //Obtiene la lista de registros (combustibles reparto) cuando el reparto viene en .data
    this.data ? this.listarParaReparto() : '';
  }
  //Establece el id del viaje
  public establecerIdViaje(idViaje) {
    this.ID_VIAJE = idViaje;
  }
  //Controla a que metodo debe llamar para obtener la lista (depende si es un viaje o un remito)
  private listar() {
    this.loaderService.show();
    this.ID_VIAJE? this.listarParaViaje(): this.listarParaReparto();
    
  }
  //Obtiene la lista completa de registros para un viaje
  private listarParaViaje(){
    this.servicio.listarEfectivos(this.ID_VIAJE).subscribe(
      res => {
        this.recargarListaCompleta(res.json());
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Obtiene la lista completa de registros para un reparto
  private listarParaReparto(){
    this.servicio.listarEfectivosReparto(this.data.elemento.id).subscribe(
      res => {
        this.recargarListaCompleta(res.json());
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Emite los efectivos al Padre
  public emitirEfectivos(lista) {
    this.dataEvent.emit(lista);
  }
  //Obtiene el listado de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
      }
    );
  }
  //Establece los valores por defecto del formulario viaje adelanto efectivo
  public establecerValoresPorDefecto(opcion): void {
    if (this.data) {
      this.formularioViajeEfectivo.get('reparto').patchValue(this.data.elemento);
      this.btnCerrar = this.data.btnCerrar;
    }
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formularioViajeEfectivo.get('fechaCaja').setValue(this.fechaActual);
    })
    if (opcion == 1) {
      this.importeTotal.setValue(this.appServicio.setDecimales('0', 2));
    }
  }
  //Agrega datos a la tabla de adelanto efectivo
  public agregarEfectivo(): void {
    // this.formularioViajeEfectivo.get('fecha').setValue(this.fechaActual);
    this.formularioViajeEfectivo.get('tipoComprobante').setValue({ id: 16 });
    this.formularioViajeEfectivo.get('reparto').setValue({ id: this.formularioViajeEfectivo.get('reparto').value.id });
    this.formularioViajeEfectivo.get('sucursal').setValue(this.appServicio.getUsuario().sucursal);
    this.formularioViajeEfectivo.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    !this.formularioViajeEfectivo.value.importe ? this.formularioViajeEfectivo.get('importe').setValue(this.appServicio.establecerDecimales('0.00', 2)) : '';
    this.data ? this.formularioViajeEfectivo.get('viaje').reset() : this.formularioViajeEfectivo.get('viaje').setValue({ id: this.ID_VIAJE });
    this.servicio.agregar(this.formularioViajeEfectivo.value).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.data ? this.listarParaReparto() : this.listar();
          this.establecerValoresPorDefecto(0);
          document.getElementById('idFechaCajaAE').focus();
          this.toastr.success("Registro agregado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica los datos del Efectivo
  public modificarEfectivo(): void {
    let usuarioMod = this.appServicio.getUsuario();
    this.formularioViajeEfectivo.value.usuarioMod = usuarioMod;
    !this.formularioViajeEfectivo.value.importe ? this.formularioViajeEfectivo.get('importe').setValue(this.appServicio.establecerDecimales('0.00', 2)) : '';
    this.data ? this.formularioViajeEfectivo.get('viaje').reset() : this.formularioViajeEfectivo.get('viaje').setValue({ id: this.ID_VIAJE });
    this.servicio.actualizar(this.formularioViajeEfectivo.value).subscribe(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.data ? this.listarParaReparto() : this.listar();
          this.establecerValoresPorDefecto(0);
          this.btnEfectivo = true;
          document.getElementById('idFechaCajaAE').focus();
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let mensajeNulo = " no puede estar vacio.";
    let mensajeInexistente = " no es un registro válido.";
    let mensajeLongitud = " excedió su longitud.";

    var respuesta = err;
    if (respuesta.codigo == 5001) {
      this.toastr.error("Fallo al sincronizar.");
    } else if (respuesta.codigo == 500) {
      this.toastr.error("Se produjo un error en el sistema.");
    } else if (respuesta.codigo == 600) {
      this.toastr.error("Fallo al actualizar.");
    } else if (respuesta.codigo == 16032) {
      this.toastr.error("Campo Caja Viajes" + mensajeNulo);
    } else if (respuesta.codigo == 16070) {
      this.toastr.error("Sucursal" + mensajeNulo);
    } else if (respuesta.codigo == 16087) {
      this.toastr.error("Usuario Alta del Registro" + mensajeNulo);
    } else if (respuesta.codigo == 16076) {
      this.toastr.error("Tipo Comprobante" + mensajeNulo);
    } else if (respuesta.codigo == 16210) {
      this.toastr.error("Campo Fecha Caja" + mensajeNulo);
    } else if (respuesta.codigo == 16242) {
      this.toastr.error("Campo Importe" + mensajeNulo);
    } else if (respuesta.codigo == 16380) {
      this.toastr.error("Está Anulado" + mensajeNulo);
    } else if (respuesta.codigo == 13037) {
      this.toastr.error("Campo Caja Viajes" + mensajeInexistente);
    } else if (respuesta.codigo == 13096) {
      this.toastr.error("Sucursal" + mensajeInexistente);
    } else if (respuesta.codigo == 13117) {
      this.toastr.error("Usuario de Alta del registro" + mensajeInexistente);
    } else if (respuesta.codigo == 13105) {
      this.toastr.error("Tipo Comprobante" + mensajeInexistente);
    } else if (respuesta.codigo == 12031) {
      this.toastr.error("Campo observaciones" + mensajeLongitud);
    } else if (respuesta.codigo == 12065) {
      this.toastr.error("Campo Observaciones para Anular" + mensajeLongitud);
    } else if (respuesta.codigo == 12093) {
      this.toastr.error("Campo Precio Unitario" + mensajeLongitud);
    }
  }
  //Modifica un Efectivo de la tabla por indice
  public modEfectivo(indice): void {
    this.indiceEfectivo = indice;
    this.btnEfectivo = false;
    let elemento = this.listaCompleta.data[indice];
    elemento.importe = this.appServicio.establecerDecimales(elemento.importe, 2);
    this.formularioViajeEfectivo.patchValue(elemento);
  }
  //Elimina un efectivo de la tabla por indice
  public anularEfectivo(elemento): void {
    const dialogRef = this.dialog.open(AnularDialogo, {
      width: '60%',
      maxWidth: '60%',
      data: {
        tema: this.appServicio.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado.value.observaciones) {
        this.loaderService.show();
        this.ID_VIAJE ? elemento.viaje = { id: this.ID_VIAJE } : elemento.viaje = null;
        elemento.observacionesAnulado = resultado.value.observaciones;
        this.servicio.anularEfectivo(elemento).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            this.toastr.error("No se pudo anular el registro");
            this.loaderService.hide();
          }
        );
      }
      document.getElementById('idFechaCajaAE').focus();
    });
  }
  //Normaliza un efectivo de la tabla por indice
  public normalizarEfectivo(elemento): void {
    const dialogRef = this.dialog.open(NormalizarDialogo, {
      width: '60%',
      maxWidth: '60%',
      data: {
        tema: this.appServicio.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loaderService.show();
        elemento.viaje = { id: this.ID_VIAJE };
        this.servicio.normalizarEfectivo(elemento).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            this.toastr.error("No se pudo normalizar el registro");
            this.loaderService.hide();
          }
        );
      }
      document.getElementById('idFechaCajaAE').focus();
    });
  }
  //Calcula el importe total para agregar
  private calcularImporteTotal(): void {
    let total = 0;
    this.listaCompleta.data.forEach(item => {
      if (!item.estaAnulado) {
        total += parseFloat(item.importe);
      }
    });
    this.importeTotal.setValue(this.appServicio.setDecimales(total, 2));
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appServicio.establecerDecimales(elemento.value, 2));
  }
  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appServicio.establecerDecimales(elemento, 2);
  }
  //Establece la lista de efectivos
  public establecerLista(lista, idViaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto(1);
    this.recargarListaCompleta(lista);
    this.formularioViajeEfectivo.get('viaje').patchValue({ id: idViaje });
    this.establecerIdViaje(idViaje);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();

  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        this.establecerValoresPorDefecto(1);
        this.establecerCamposSelectSoloLectura(false);
        break;
      case 2:
        this.soloLectura = true;
        this.establecerCamposSelectSoloLectura(true);
        break;
      case 3:
        this.soloLectura = false;
        this.establecerCamposSelectSoloLectura(false);
        break;
      case 4:
        this.soloLectura = true;
        this.establecerCamposSelectSoloLectura(true);
        break;
    }
  }
  //Limpia el formulario
  public cancelar() {
    this.formularioViajeEfectivo.reset();
    this.formularioViajeEfectivo.get('viaje').setValue({ id: this.ID_VIAJE });
    this.establecerValoresPorDefecto(0);
    this.indiceEfectivo = null;
    this.btnEfectivo = true;
    document.getElementById('idFechaCajaAE').focus();
  }
  //Finalizar
  public finalizar() {
    this.formularioViajeEfectivo.reset();
    this.indiceEfectivo = null;
    this.btnEfectivo = true;
    this.establecerValoresPorDefecto(0);
    this.vaciarListas();
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaEfectivos'
  private recargarListaCompleta(listaEfectivos) {
    this.listaCompleta = new MatTableDataSource(listaEfectivos);
    this.listaCompleta.sort = this.sort;
    this.calcularImporteTotal();
  }
  //Establece los campos select en solo lectura o no
  private establecerCamposSelectSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajeEfectivo.get('empresa').disable();
    } else {
      this.formularioViajeEfectivo.get('empresa').enable();
    }
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function () {
      document.getElementById('idFechaCajaAE').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formularioViajeEfectivo.reset();
    this.formularioViajeEfectivo.value.viaje = this.ID_VIAJE;
    this.indiceEfectivo = null;
    this.btnEfectivo = true;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '70%',
      maxWidth: '70%',
      data: {
        tema: this.appServicio.getTema(),
        elemento: elemento,
        soloLectura: true
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Mascara un importe decimal
  public mascararImporte(limit, decimalLimite) {
    return this.appServicio.mascararImporte(limit, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
}