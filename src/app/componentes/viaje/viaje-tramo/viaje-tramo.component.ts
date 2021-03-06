import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajeTramo } from 'src/app/modelos/viajeTramo';
import { TramoService } from 'src/app/servicios/tramo.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ViajeUnidadNegocioService } from 'src/app/servicios/viaje-unidad-negocio.service';
import { ViajeTipoCargaService } from 'src/app/servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from 'src/app/servicios/viaje-tipo.service';
import { ViajeTarifaService } from 'src/app/servicios/viaje-tarifa.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ObservacionesDialogo } from '../../observaciones-dialogo/observaciones-dialogo.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { ViajeTramoCliente } from 'src/app/modelos/viajeTramoCliente';
import { ViajeTramoClienteService } from 'src/app/servicios/viaje-tramo-cliente.service';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { Viaje } from 'src/app/modelos/viaje';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { RemitoDialogoComponent } from '../remito-dialogo/remito-dialogo.component';
import { VacioFacturadoDialogoComponent } from '../vacio-facturado-dialogo/vacio-facturado-dialogo.component';
import { ConfirmarDialogoComponent } from '../../confirmar-dialogo/confirmar-dialogo.component';

@Component({
  selector: 'app-viaje-tramo',
  templateUrl: './viaje-tramo.component.html',
  styleUrls: ['./viaje-tramo.component.css']
})
export class ViajeTramoComponent implements OnInit {
  @Output() dataEvent = new EventEmitter();
  //Define un formulario viaje propio tramo para validaciones de campos
  public formularioViajeTramo: FormGroup;
  //Define el formulario para Viaje Cabecera
  public formularioViaje: FormGroup;
  //Define la lista de resultados de tramos
  public resultadosTramos: Array<any> = [];
  //Define la lista de empresas
  public empresas: Array<any> = [];
  //Define la lista de unidades de negocios
  public unidadesNegocios: Array<any> = [];
  //Define la lista de viajes tipos cargas
  public viajesTiposCargas: Array<any> = [];
  //Define la lista de viajes tipos
  public viajesTipos: Array<any> = [];
  //Define la lista de viajes tarifas con costo tramo true
  public viajesTarifasCostoTramoTrue: Array<any> = [];
  //Define la lista de tramos (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del tramo para las modificaciones
  public indiceTramo: number;
  //Define si muestra el boton agregar tramo o actualizar tramo
  public btnTramo: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el id del viaje actual
  public ID_VIAJE: number;
  //Define la fecha actual
  public fechaActual: any;
  //Define si mostrar por remitos en tarifa
  public mostrarPorRemitos: boolean = true;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'fecha', 'tramo', 'km', 'empresa', 'tipoViaje', 'tipoCarga', 'tarifa', 'unidadNegocio', 'obs', 'editar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Constructor
  constructor(
    private viajeTramoModelo: ViajeTramo, private viajeServicio: ViajeService, private viajeModelo: Viaje,
    private tramoServicio: TramoService, private appServicio: AppService,
    private empresaServicio: EmpresaService, private viajeUnidadNegocioServicio: ViajeUnidadNegocioService,
    private viajeTipoCargaServicio: ViajeTipoCargaService, private viajeTipoServicio: ViajeTipoService,
    private viajeTarifaServicio: ViajeTarifaService, public dialog: MatDialog, private fechaServicio: FechaService,
    private servicio: ViajeTramoService, private toastr: ToastrService, private loaderService: LoaderService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario de Viaje Tramo
    this.formularioViajeTramo = this.viajeTramoModelo.formulario;
    //Establece el formulario de Viaje Cabecera
    this.formularioViaje = this.viajeModelo.formulario;
    //Autocompletado Tramo - Buscar por alias
    this.formularioViajeTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.tramoServicio.listarPorOrigen(data).subscribe(response => {
            this.resultadosTramos = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Limpia el formulario y las listas
    this.reestablecerFormulario();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de unidades de negocios
    this.listarUnidadesNegocios();
    //Obtiene la lista de viajes tipos cargas
    this.listarViajesTiposCargas();
    //Obtiene la lista de viajes tipos
    this.listarViajesTipos();
    //Obtiene la lista de viajes tarifas
    this.listarViajesTarifasCostoTramoTrue();
    //Establece los valores por defecto del formulario viaje tramo
    this.establecerValoresPorDefecto();
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar() {
    this.loaderService.show();
    this.servicio.listarTramos(this.ID_VIAJE).subscribe(
      res => {
        let tramos = res.json();
        this.convertirListaAMatTable(tramos);
        this.emitirTramos(tramos, this.ID_VIAJE);
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Emite tamaño lista tramos al Padre
  public emitirTramos(lista, idViaje) {
    this.dataEvent.emit([lista, idViaje]);
  }
  //Establece los valores por defecto del formulario viaje tramo
  public establecerValoresPorDefecto(): void {
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.fechaActual = res.json();
      this.formularioViajeTramo.get('fechaTramo').setValue(this.fechaActual);
    })
  }
  //Establece el id del viaje de Cabecera
  public establecerViajeCabecera(idViaje) {
    this.ID_VIAJE = idViaje;
  }
  //Obtiene la mascara de importes
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Establece decimales de importe
  public desenmascararImporte(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Obtiene mascara enteros
  public mascararEnteros(limite) {
    return this.appServicio.mascararEnteros(limite);
  }
  //Obtiene la mascara de km
  public mascararKm(intLimite) {
    return this.appServicio.mascararKm(intLimite);
  }
  //Establece el tipo de viaje (Propio o Tercero)
  public establecerTipoViaje(): void {
    let viajeTarifa = this.formularioViajeTramo.get('viajeTarifa').value;
    let modalidadCarga = this.formularioViajeTramo.get('viajeTipo').value;
    let km = this.formularioViajeTramo.get('km').value;
    if (viajeTarifa && modalidadCarga && km) {
      switch (viajeTarifa.id) {
        case 1:
          let importe = km * modalidadCarga.costoPorKmPropio;
          this.formularioViajeTramo.get('importeCosto').setValue(parseFloat(this.appServicio.establecerDecimales(importe, 3)));
          this.formularioViajeTramo.get('costoKm').setValue(modalidadCarga.costoPorKmPropio);
          this.formularioViajeTramo.get('importeCosto').disable();
          break;
        case 5:
          this.formularioViajeTramo.get('importeCosto').enable();
          this.formularioViajeTramo.get('importeCosto').reset();
          break;
        case 0:
          this.formularioViajeTramo.get('importeCosto').disable();
          this.formularioViajeTramo.get('importeCosto').reset();
          break;
      }
    }
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
  //Obtiene el listado de unidades de negocio
  private listarUnidadesNegocios() {
    this.viajeUnidadNegocioServicio.listar().subscribe(
      res => {
        this.unidadesNegocios = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de viaje tipo carga
  private listarViajesTiposCargas() {
    this.viajeTipoCargaServicio.listar().subscribe(
      res => {
        this.viajesTiposCargas = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de viajes tipos
  private listarViajesTipos() {
    this.viajeTipoServicio.listar().subscribe(
      res => {
        this.viajesTipos = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de viajes tarifas
  private listarViajesTarifasCostoTramoTrue() {
    this.viajeTarifaServicio.listarPorCostoTramoTrue().subscribe(
      res => {
        this.viajesTarifasCostoTramoTrue = res.json();
        this.establecerViajeTarifaPorDefecto();
      },
      err => {
      }
    );
  }
  //Establece el viaje tarifa por defecto
  private establecerViajeTarifaPorDefecto(): void {
    this.viajesTarifasCostoTramoTrue.forEach((elemento) => {
      if (elemento.porDefecto == true) {
        this.formularioViajeTramo.get('viajeTarifa').setValue(elemento);
      }
    });
  }
  //Establece los km al seleccionar elemento de tramo
  public establecerKm(): void {
    let tramo = this.formularioViajeTramo.get('tramo').value;
    this.formularioViajeTramo.get('km').setValue(this.appServicio.desenmascararKm(tramo.km));
  }
  //Establece el estado de tipo de carga al seleccionar una modalidad de carga
  public establecerEstadoTipoCarga(editar): void {
    let modalidadCarga = this.formularioViajeTramo.get('viajeTipo').value;
    if (modalidadCarga.id == 3 || modalidadCarga.id == 4) {
      this.formularioViajeTramo.get('viajeTipoCarga').setValue(this.viajesTiposCargas[0]);
      this.formularioViajeTramo.get('viajeTipoCarga').disable();
      this.mostrarPorRemitos = false;
    } else {
      this.formularioViajeTramo.get('viajeTipoCarga').enable();
      this.mostrarPorRemitos = true;
    }
    this.establecerTipoViaje();
  }
  //Agrega primero un Viaje y luego un viajeTramo (cuando listaCompleta esta vacia)
  public agregarTramo(): void {
    this.loaderService.show();
    this.formularioViaje.enable();
    this.formularioViajeTramo.enable();
    let usuario = this.appServicio.getUsuario();
    this.formularioViajeTramo.get('fechaAlta').setValue(this.fechaActual);
    this.formularioViajeTramo.get('numeroOrden').setValue(1);
    this.formularioViajeTramo.get('usuarioAlta').setValue(usuario);
    if (this.listaCompleta.data.length > 0) {
      this.agregar();
    } else {
      if (this.formularioViajeTramo.get('viajeTarifa').value.id == 0) {
        this.formularioViajeTramo.get('viajeTarifa').reset();
      }
      let tramos = [];
      tramos.push(this.formularioViajeTramo.value);
      this.formularioViaje.get('viajeTramos').setValue(tramos);
      this.formularioViaje.get('id').setValue(null);
      this.viajeServicio.agregar(this.formularioViaje.value).subscribe(
        res => {
          let respuesta = res.json();
          if (res.status == 201) {
            this.ID_VIAJE = respuesta.id;
            this.formularioViaje.get('id').setValue(respuesta.id);
            this.reestablecerFormulario();
            this.listar();
            this.establecerValoresPorDefecto();
            this.establecerViajeTarifaPorDefecto();
            this.toastr.success(MensajeExcepcion.AGREGADO);
            document.getElementById('idTramoFecha').focus();
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
  }
  //Agrega un registro en viajeTramos
  public agregar() {
    if (this.formularioViajeTramo.get('viajeTarifa').value.id == 0) {
      this.formularioViajeTramo.get('viajeTarifa').reset();
    }
    this.formularioViajeTramo.get('viaje').setValue({ id: this.ID_VIAJE });
    this.servicio.agregar(this.formularioViajeTramo.value).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listar();
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          document.getElementById('idTramoFecha').focus();
          this.toastr.success(MensajeExcepcion.AGREGADO);
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
  //Modifica los datos del tramo
  public modificarTramo(): void {
    this.loaderService.show();
    this.formularioViajeTramo.enable();
    if (!this.formularioViajeTramo.value.importeCosto)
      this.formularioViajeTramo.get('importeCosto').setValue(this.appServicio.establecerDecimales('0.00', 2));
    let usuarioMod = this.appServicio.getUsuario();
    this.formularioViajeTramo.value.usuarioMod = usuarioMod;
    this.formularioViajeTramo.value.importe = parseFloat(this.formularioViajeTramo.value.importe);
    this.formularioViajeTramo.value.precioUnitario = parseFloat(this.formularioViajeTramo.value.precioUnitario);
    this.formularioViajeTramo.value.viaje = { id: this.ID_VIAJE };
    if (this.formularioViajeTramo.get('viajeTarifa').value.id == 0) {
      this.formularioViajeTramo.get('viajeTarifa').reset();
    }
    this.servicio.actualizar(this.formularioViajeTramo.value).subscribe(
      res => {
        if (res.status == 200) {
          let respuesta = res.json();
          this.reestablecerFormulario();
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          this.listar();
          this.btnTramo = true;
          document.getElementById('idTramoFecha').focus();
          this.toastr.success(respuesta.mensaje);
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
  //Modifica un tramo de la tabla por indice
  public modTramo(indice, elemento): void {
    this.indiceTramo = indice;
    this.btnTramo = false;
    if (elemento.importeCosto) {
      elemento.importeCosto = this.appServicio.establecerDecimales(elemento.importeCosto.toString(), 2);
    }
    this.formularioViajeTramo.patchValue(elemento);
    this.formularioViajeTramo.get('viaje').setValue({ id: this.ID_VIAJE });
    this.establecerEstadoTipoCarga(true);
    if (!elemento.viajeTarifa) {
      this.formularioViajeTramo.get('viajeTarifa').setValue({ id: 0 });
    }
  }
  //Elimina un tramo de la tabla por indice
  public eliminarTramo(elemento): void {
    if (this.listaCompleta.data.length == 1) {
      this.toastr.error("El viaje debe tener un tramo");
    } else {
      const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
        width: '50%',
        maxWidth: '50%',
        data: {
          mensaje: "¿Está seguro de eliminar el Tramo?"
        }
      });
      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado) {
          this.loaderService.show();
          this.servicio.eliminar(elemento.id).subscribe(
            res => {
              let respuesta = res.json();
              this.listar();
              this.establecerValoresPorDefecto();
              this.establecerViajeTarifaPorDefecto();
              this.toastr.success(respuesta.mensaje);
              this.loaderService.hide();
            },
            err => {
              this.toastr.error("No se pudo eliminar el registro");
              this.loaderService.hide();
            });
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          this.resultadosTramos = [];
        }
      });
    }
    document.getElementById('idTramoFecha').focus();
  }
  //Limpia el formulario
  public cancelar() {
    this.formularioViajeTramo.reset();
    this.indiceTramo = null;
    this.btnTramo = true;
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    document.getElementById('idTramoFecha').focus();
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento, decimales): void {
    elemento.setValue(this.appServicio.establecerDecimales(elemento.value, decimales));
  }
  //Establece la lista de tramos
  public establecerLista(lista, idViaje, pestaniaViaje): void {
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    this.convertirListaAMatTable(lista);
    this.formularioViajeTramo.get('viaje').setValue({ id: idViaje });
    this.establecerViajeCabecera(idViaje);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        this.listarViajesTarifasCostoTramoTrue();
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
  //Establece los campos select en solo lectura o no
  private establecerCamposSelectSoloLectura(opcion): void {
    if (opcion) {
      this.formularioViajeTramo.get('empresa').disable();
      this.formularioViajeTramo.get('viajeUnidadNegocio').disable();
      this.formularioViajeTramo.get('viajeTipoCarga').disable();
      this.formularioViajeTramo.get('viajeTipo').disable();
      this.formularioViajeTramo.get('viajeTarifa').disable();
      this.formularioViajeTramo.get('importeCosto').disable();
      this.formularioViajeTramo.get('observaciones').disable();
    } else {
      this.formularioViajeTramo.get('empresa').enable();
      this.formularioViajeTramo.get('viajeUnidadNegocio').enable();
      this.formularioViajeTramo.get('viajeTipoCarga').enable();
      this.formularioViajeTramo.get('viajeTipo').enable();
      this.formularioViajeTramo.get('viajeTarifa').enable();
      this.formularioViajeTramo.get('importeCosto').enable();
      this.formularioViajeTramo.get('observaciones').enable();
    }
  }
  //Convierte la lista de tramos a MatTableDataSource
  private convertirListaAMatTable(listaTramos) {
    this.listaCompleta = new MatTableDataSource(listaTramos);
    this.listaCompleta.sort = this.sort;
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function () {
      document.getElementById('idTramoFecha').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.resultadosTramos = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario() {
    this.vaciarListas();
    this.formularioViajeTramo.reset();
    this.indiceTramo = null;
    this.btnTramo = true;
  }
  //Finalizar
  public finalizar() {
    this.ID_VIAJE = 0;
    this.reestablecerFormulario();
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre +
        ' --> ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Abre un dialogo para agregar dadores y destinatarios
  public verDadorDestinatarioDialogo(elemento): void {
    const dialogRef = this.dialog.open(DadorDestinatarioDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        tema: this.appServicio.getTema(),
        viajeTramo: elemento.id,
        tramo: elemento,
        viajeTarifa: elemento.viajeTarifa,
        importeCosto: elemento.importeCosto,
        indiceSeleccionado: this.indiceSeleccionado
      }
    });
    dialogRef.afterClosed().subscribe(viajeTramoClientes => {

    });
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
}
//Componente DadorDestinatarioDialogo
@Component({
  selector: 'dador-destinatario-dialogo',
  templateUrl: 'dador-destinatario-dialogo.component.html'
})
export class DadorDestinatarioDialogo {
  //Define el tema
  public tema: string;
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista de dador-destinatario
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de clientes
  public resultadosClientes: Array<any> = [];
  //Define el tramo seleccionado
  public tramo: string = null;
  //Define la modalidad de carga seleccionada
  public modalidadCarga: boolean;
  //Define campos solo lectura
  public soloLectura: boolean = false;
  //Define las columnas de la tabla
  public columnas: string[] = ['dador', 'destinatario', 'remitos', 'eliminar'];
  //Define muestra de progress dialog
  public show: boolean = false;
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestinatarioDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private toastr: ToastrService, private viajeTramoClienteModelo: ViajeTramoCliente,
    private viajeTramoClienteService: ViajeTramoClienteService, private clienteServicio: ClienteService,
    public dialog: MatDialog, private appServicio: AppService) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = this.viajeTramoClienteModelo.formulario;
    let tramo = this.data.tramo.tramo;
    //Establece el tramo seleccionado
    this.tramo = tramo.origen.nombre + ', ' + tramo.origen.provincia.nombre
      + ' --> ' + tramo.destino.nombre + ', ' + tramo.destino.provincia.nombre;
    //Establece la modalidad de carga
    this.modalidadCarga = this.data.tramo.viajeTipo.id != 4 ? true : false;
    //Inicializa la tabla
    this.listar(this.data.viajeTramo);
    //Autocompletado Cliente Dador - Buscar por alias
    this.formulario.get('clienteDador').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClientes = response.json();
          })
        }
      }
    });
    //Autocompletado Cliente Destinatario - Buscar por alias
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClientes = response.json();
          })
        }
      }
    });
    //Establece botones y campos solo lectura
    this.soloLectura = this.data.indiceSeleccionado == 2 || this.data.indiceSeleccionado == 4 ? true : false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Establece la tabla de dadores y destinatarios
  private listar(idViajeTramo) {
    if (idViajeTramo) {
      this.show = true;
      this.viajeTramoClienteService.listarPorViajeTramo(idViajeTramo).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.show = false;
        },
        err => {
          this.toastr.error(err.json().message);
          this.show = false;
        }
      );
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Agrega el dador y el destinatario a la tabla
  public agregarDadorDestinatario(): void {
    this.show = true;
    this.formulario.get('viajeTramo').setValue({ id: this.data.viajeTramo });
    this.viajeTramoClienteService.agregar(this.formulario.value).subscribe(
      res => {
        this.formulario.reset();
        this.resultadosClientes = [];
        this.toastr.success(MensajeExcepcion.AGREGADO);
        document.getElementById('idTramoDadorCarga').focus();
        this.listar(this.data.viajeTramo);
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Elimina un dador-destinatario de la tabla
  public eliminarDadorDestinatario(elemento): void {
    if (elemento) {
      const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
        width: '50%',
        maxWidth: '50%',
        data: {
          mensaje: '¿Seguro que desea eliminar este registro? (Puede contener remitos)'
        }
      });
      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado) {
          this.show = true;
          this.viajeTramoClienteService.eliminar(elemento.id).subscribe(
            res => {
              this.resultadosClientes = [];
              this.toastr.success(MensajeExcepcion.ELIMINADO);
              document.getElementById('idTramoDadorCarga').focus();
              this.show = false;
              this.listar(this.data.viajeTramo);
            },
            err => {
              this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
              this.show = false;
            }
          );
        }
      });
    }
  }
  //Abre el dialogo para cargar remitos
  public verRemitos(elemento): void {
    const dialogRef = this.dialog.open(RemitoDialogoComponent, {
      width: '95%',
      maxWidth: '95%',
      data: {
        tema: this.appServicio.getTema(),
        tramo: this.tramo,
        dadorDestinatario: elemento,
        viajeTarifa: this.data.viajeTarifa,
        importeCosto: this.data.importeCosto,
        indiceSeleccionado: this.data.indiceSeleccionado
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre el dialogo para valorizar vacio facturado
  public verVacioFacturado(elemento): void {
    const dialogRef = this.dialog.open(VacioFacturadoDialogoComponent, {
      width: '95%',
      maxWidth: '95%',
      data: {
        tema: this.appServicio.getTema(),
        tramo: this.tramo,
        dadorDestinatario: elemento,
        viajeTarifa: this.data.viajeTarifa,
        indiceSeleccionado: this.data.indiceSeleccionado
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}