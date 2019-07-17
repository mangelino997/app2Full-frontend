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
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { ViajeTramoCliente } from 'src/app/modelos/viajeTramoCliente';
import { ViajeTramoClienteService } from 'src/app/servicios/viaje-tramo-cliente.service';

@Component({
  selector: 'app-viaje-tramo',
  templateUrl: './viaje-tramo.component.html',
  styleUrls: ['./viaje-tramo.component.css']
})
export class ViajeTramoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio para validaciones de campos
  // public formularioViaje: FormGroup;
  //Define un formulario viaje propio tramo para validaciones de campos
  public formularioViajeTramo: FormGroup;
  //Define un formulario viaje propio tramo cliente para validaciones de campos
  // public formularioViajeTramoCliente: FormGroup;
  //Define la lista de resultados de vehiculos
  public resultadosVehiculos: Array<any> = [];
  //Define la lista de resultados de vehiculos remolques
  public resultadosVehiculosRemolques: Array<any> = [];
  //Define la lista de resultados de choferes
  public resultadosChoferes: Array<any> = [];
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
  //Define la lista de viajes tarifas
  public viajesTarifas: Array<any> = [];
  //Define la lista de dedor-destinatario
  public listaDadorDestinatario: Array<any> = [];
  //Define la lista de tramos (tabla)
  public listaTramos: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
  //Define el numero de orden del tramo
  public numeroOrden: number;
  //Define si los campos son de solo lectura
  public soloLectura: boolean = false;
  //Define el indice del tramo para las modificaciones
  public indiceTramo: number;
  //Define si muestra el boton agregar tramo o actualizar tramo
  public btnTramo: boolean = true;
  //Define el tipo de viaje
  public tipoViaje: boolean = true;
  //Define la pestaña seleccionada
  public indiceSeleccionado: number = 1;
  //Define el viaje actual de los tramos
  public viaje: any;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'fecha', 'tramo', 'km', 'empresa', 'tipoCarga', 'tipoViaje', 'tarifa', 'destinatario', 'unidadNegocio', 'obs', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private viajeTramoModelo: ViajeTramo,
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
    //Establece el formulario viaje propio tramo
    this.formularioViajeTramo = this.viajeTramoModelo.formulario;
    //Autocompletado Tramo - Buscar por alias
    this.formularioViajeTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.tramoServicio.listarPorOrigen(data).subscribe(response => {
          this.resultadosTramos = response;
        })
      }
    })
    //Establece el numero de orden del tramo por defecto en cero
    this.numeroOrden = 0;
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de unidades de negocios
    this.listarUnidadesNegocios();
    //Obtiene la lista de viajes tipos cargas
    this.listarViajesTiposCargas();
    //Obtiene la lista de viajes tipos
    this.listarViajesTipos();
    //Obtiene la lista de viajes tarifas
    this.listarViajesTarifas();
    //Establece los valores por defecto del formulario viaje tramo
    this.establecerValoresPorDefecto();
  }
  //Obtiene la lista completa de registros segun el Id del Viaje (CABECERA)
  private listar(){
    this.loaderService.show();
    console.log(this.formularioViajeTramo.value.viaje.id);
    if(this.formularioViajeTramo.value.viaje.id){
      this.servicio.listarTramos(this.formularioViajeTramo.value.viaje.id).subscribe(
        res=>{
          console.log("Tramos: " + res.json());
          this.listaTramos = res.json();
          this.recargarListaCompleta(this.listaTramos);
          this.loaderService.hide();
        },
        err=>{
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
    }
  }
  //Establece el viaje de guia de servicio (CABECERA)
  public establecerViaje(idViaje){
    console.log(idViaje);
    this.formularioViajeTramo.get('viaje').setValue({id: idViaje});
  }
  //Establece los valores por defecto del formulario viaje tramo
  public establecerValoresPorDefecto(): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajeTramo.get('fechaTramo').setValue(res.json());
    })
    this.formularioViajeTramo.get('importe').setValue(this.appServicio.establecerDecimales(valor, 2));
    this.obtenerSiguienteId();
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formularioViajeTramo.get('id').setValue(res.json());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene la mascara de importes
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
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
  public establecerTipoViaje(tipoViaje): void {
    this.tipoViaje = tipoViaje;
    let viajeTarifa = this.formularioViajeTramo.get('viajeTarifa').value;
    let modalidadCarga = this.formularioViajeTramo.get('viajeTipo').value;
    let km = this.formularioViajeTramo.get('km').value;
    if (this.tipoViaje != null && viajeTarifa && modalidadCarga && km) {
      if (viajeTarifa.id == 1) {
        if (this.tipoViaje) {
          this.formularioViajeTramo.get('precioUnitario').setValue(modalidadCarga.costoPorKmPropio);
          let importe = km * modalidadCarga.costoPorKmPropio;
          this.formularioViajeTramo.get('importe').setValue(this.appServicio.establecerDecimales(importe, 3));
          this.formularioViajeTramo.get('cantidad').setValue(0);
          this.formularioViajeTramo.get('cantidad').disable();
          this.formularioViajeTramo.get('precioUnitario').disable();
        } else {
          //Viaje Tercero
        }
      } else {
        this.formularioViajeTramo.get('cantidad').enable();
        this.formularioViajeTramo.get('precioUnitario').enable();
        this.formularioViajeTramo.get('cantidad').reset();
        this.formularioViajeTramo.get('precioUnitario').reset();
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
      }
    );
  }
  //Obtiene el listado de viajes tarifas
  private listarViajesTarifas() {
    this.viajeTarifaServicio.listar().subscribe(
      res => {
        this.viajesTarifas = res.json();
        this.establecerViajeTarifaPorDefecto();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece el viaje tarifa por defecto
  private establecerViajeTarifaPorDefecto(): void {
    this.viajesTarifas.forEach((elemento) => {
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
  public establecerEstadoTipoCarga(): void {
    let modalidadCarga = this.formularioViajeTramo.get('viajeTipo').value;
    if (modalidadCarga.id == 3) {
      this.formularioViajeTramo.get('viajeTipoCarga').setValue(this.viajesTiposCargas[0]);
      this.formularioViajeTramo.get('viajeTipoCarga').disable();
      this.formularioViajeTramo.get('viajeTramoClientes').disable();
    } else {
      this.formularioViajeTramo.get('viajeTipoCarga').enable();
      this.formularioViajeTramo.get('viajeTramoClientes').enable();
    }
    this.establecerTipoViaje(this.tipoViaje);
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario, form, cant): void {
    if(form && cant) {
      this.desenmascararImporte(form, cant);
    }
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(cant));
    if (cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'), cant);
    }
  }
  //Verifica el elemento seleccionado en Tarifa para determinar si coloca cantidad e importe en solo lectura
  // public estadoTarifa(): boolean {
  //   try {
  //     let viajeTarifa = this.formularioViajeTramo.get('viajeTarifa').value.id;
  //     return viajeTarifa == 2 || viajeTarifa == 5;
  //   } catch (e) {
  //     return false;
  //   }
  // }
  //Agrega datos a la tabla de tramos
  public agregarTramo(): void {
    this.loaderService.show();
    this.formularioViajeTramo.enable();
    this.numeroOrden++;
    this.formularioViajeTramo.get('numeroOrden').setValue(this.numeroOrden);
    let fecha = this.formularioViajeTramo.get('fechaTramo').value;
    this.formularioViajeTramo.get('fechaAlta').setValue(fecha);
    let km = this.formularioViajeTramo.get('tramo').value.km;
    this.formularioViajeTramo.get('km').setValue(km);
    let usuario = this.appServicio.getUsuario();
    this.formularioViajeTramo.get('usuarioAlta').setValue(usuario);
    console.log(this.formularioViajeTramo.value);
    this.servicio.agregar(this.formularioViajeTramo.value).subscribe(
      res=>{
        let resultado = res.json();
        if (res.status == 201) {
          console.log(resultado);
          let idViaje = this.formularioViajeTramo.value.viaje.id;
          this.reestablecerFormulario();
          this.establecerViaje(idViaje);
          this.listar();
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          this.enviarDatos();
          document.getElementById('idTramoFecha').focus();
          this.toastr.success("Registro agregado con éxito");
          this.loaderService.hide();
        }
      },
      err=>{
        let resultado = err.json();
        this.toastr.error(resultado.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica los datos del tramo
  public modificarTramo(): void {
    this.loaderService.show();
    // this.establecerTipoViaje();  REVISAAR
    this.servicio.actualizar(this.formularioViajeTramo.value).subscribe(
      res=>{
        let idViaje = this.formularioViajeTramo.value.viaje.id;
        console.log(idViaje);
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.establecerViaje(idViaje);
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          this.listar();
          this.btnTramo = true;
          // this.enviarDatos(); REVISAR SI LO PUEDO ELIMINAR
          document.getElementById('idTramoFecha').focus();
          this.toastr.success("Registro actualizado con éxito");
          this.loaderService.hide();
        }
      },  
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Modifica un tramo de la tabla por indice
  public modTramo(indice): void {
    this.indiceTramo = indice;
    this.btnTramo = false;
    this.formularioViajeTramo.patchValue(this.listaTramos[indice]);
    console.log(this.listaTramos[indice]);
    // this.
  }
  //Elimina un tramo de la tabla por indice
  public eliminarTramo(indice, elemento): void {
    if (this.indiceSeleccionado == 1) {
      this.listaTramos.splice(indice, 1);
      this.recargarListaCompleta(this.listaTramos);
      this.establecerValoresPorDefecto();
      this.establecerViajeTarifaPorDefecto();
      this.enviarDatos();
    } else {
      this.loaderService.show();
      this.servicio.eliminar(elemento.id).subscribe(
        res => {
          let respuesta = res.json();
          this.listaTramos.splice(indice, 1);
          this.recargarListaCompleta(this.listaTramos);
          this.establecerValoresPorDefecto();
          this.establecerViajeTarifaPorDefecto();
          this.enviarDatos();
          this.toastr.success(respuesta.mensaje);
          this.listar();
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.loaderService.hide();
          this.toastr.error(error.mensaje);
        });
    }
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    this.resultadosTramos = [];
    document.getElementById('idTramoFecha').focus();
  }
  //Envia la lista de tramos a Viaje
  private enviarDatos(): void {
    this.dataEvent.emit(this.listaTramos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento, decimales): void {
    elemento.setValue(this.appServicio.establecerDecimales(elemento.value, decimales));
  }
  //Establece la lista de tramos
  public establecerLista(lista, viaje, pestaniaViaje): void {
    console.log(pestaniaViaje);
    // this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    this.listaTramos = lista;
    this.recargarListaCompleta(this.listaTramos);
    this.viaje = viaje;
    this.enviarDatos();
    this.establecerViaje(viaje.id);
    this.establecerCamposSoloLectura(pestaniaViaje);
    this.listar();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    console.log(indice);
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        // this.establecerValoresPorDefecto();
        this.listarViajesTarifas();
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
    } else {
      this.formularioViajeTramo.get('empresa').enable();
      this.formularioViajeTramo.get('viajeUnidadNegocio').enable();
      this.formularioViajeTramo.get('viajeTipoCarga').enable();
      this.formularioViajeTramo.get('viajeTipo').enable();
      this.formularioViajeTramo.get('viajeTarifa').enable();
    }
  }
  //Recarga la listaCompleta con cada agregar, mod, eliminar que afecte a 'this.listaTramos'
  private recargarListaCompleta(listaTramos){
    this.listaCompleta = new MatTableDataSource(listaTramos);
    this.listaCompleta.sort = this.sort; 
  }
  //Establece el foco en fecha
  public establecerFoco(): void {
    setTimeout(function() {
      document.getElementById('idTramoFecha').focus();
    }, 100);
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaTramos = [];
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
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
        ' ---> ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Abre un dialogo para agregar dadores y destinatarios
  public verDadorDestinatarioDialogo(elemento): void {
    const dialogRef = this.dialog.open(DadorDestinatarioDialogo, {
      width: '1200px',
      data: {
        tema: this.appServicio.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(viajeTramoClientes => {
      
    });
  }
  //Abre un dialogo para ver la lista de dadores y destinatarios
  // public verDadorDestTablaDialogo(elemento): void {
  //   const dialogRef = this.dialog.open(DadorDestTablaDialogo, {
  //     width: '1200px',
  //     data: {
  //       tema: this.appServicio.getTema(),
  //       elemento: elemento
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(resultado => { });
  // }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appServicio.getTema(),
        elemento: elemento,
        soloLectura: true
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre un dialogo para ver las observaciones
  public abrirObservacionesDialogo(): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appServicio.getTema(),
        elemento: null,
        soloLectura: false
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      let observaciones = resultado.value.observaciones;
      this.formularioViajeTramo.get('observaciones').setValue(observaciones);
    });
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
  public listaDadorDestinatario: Array<any> = [];
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de clientes
  public resultadosClientes: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['dador', 'destinatario', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestinatarioDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private viajeTramoClienteModelo: ViajeTramoCliente, private viajeTramoClienteService: ViajeTramoClienteService ,private clienteServicio: ClienteService) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = this.viajeTramoClienteModelo.formulario;
    //Autocompletado Cliente Dador - Buscar por alias
    this.formulario.get('clienteDador').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
    //Autocompletado Cliente Destinatario - Buscar por alias
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
    
    //Establece la lista de dadores-destinatarios
    this.listarDadoresDestinatarios();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Obtiene la lista completa de dadores-destinatarios por el id del viaje
  private listarDadoresDestinatarios(){
    this.viajeTramoClienteService.listarPorViajeTramo(this.data.elemento.id).subscribe(
      res=>{
        this.listaDadorDestinatario = res.json();
        this.listaCompleta = new MatTableDataSource(this.listaDadorDestinatario);
        this.listaCompleta.sort = this.sort; 
      },
      err=>{
        this.toastr.error("Error al obtener la lista de dadores-destinatarios");
      }
    )
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Agrega el dador y el destinatario a la tabla
  public agregarDadorDestinatario(): void {
    this.formulario.get('viajeTramo').setValue({id: this.data.elemento.id});
    console.log(this.formulario.value);

    this.viajeTramoClienteService.agregar(this.formulario.value).subscribe(
      res=>{
        console.log(res);
        if(res.status == 201){
          this.listarDadoresDestinatarios();
          this.formulario.reset();
          this.resultadosClientes = [];
          document.getElementById('idTramoDadorCarga').focus();
          this.toastr.success("Registro agregado con éxito");
        }
      },
      err=>{
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    );
    
  }
  //Elimina un dador-destinatario de la tabla
  public eliminarDadorDestinatario(id): void {
    console.log(id);
    this.viajeTramoClienteService.eliminar(id).subscribe(
      res=>{
        this.listarDadoresDestinatarios();
        this.resultadosClientes = [];
        document.getElementById('idTramoDadorCarga').focus();
        this.toastr.success("Registro eliminado con éxito");
      },
      err=>{
        this.toastr.error("Error al eliminar el registro");
      }
    )
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
//Componente DadorDestTablaDialogo
// @Component({
//   selector: 'dador-dest-tabla-dialogo',
//   templateUrl: 'dador-dest-tabla-dialogo.component.html'
// })
// export class DadorDestTablaDialogo {
//   //Define el tema
//   public tema: string;
//   //Define la observacion
//   public listaDadorDestinatario: Array<any> = [];
//   //Define las columnas de la tabla
//   public columnas: string[] = ['dador', 'destinatario', 'eliminar'];
//   //Define la matSort
//   @ViewChild(MatSort) sort: MatSort;
//   //Constructor
//   constructor(public dialogRef: MatDialogRef<DadorDestTablaDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
//   ngOnInit() {
//     //Establece el tema
//     this.tema = this.data.tema;
//     //Establece la lista de dadores-destinatarios
//     this.listaDadorDestinatario = this.data.elemento.viajeTramoClientes;
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }