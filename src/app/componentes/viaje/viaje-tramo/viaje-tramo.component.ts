import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViajePropioTramo } from 'src/app/modelos/viajePropioTramo';
import { ViajePropioTramoCliente } from 'src/app/modelos/viajePropioTramoCliente';
import { TramoService } from 'src/app/servicios/tramo.service';
import { AppComponent } from 'src/app/app.component';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ViajeUnidadNegocioService } from 'src/app/servicios/viaje-unidad-negocio.service';
import { ViajeTipoCargaService } from 'src/app/servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from 'src/app/servicios/viaje-tipo.service';
import { ViajeTarifaService } from 'src/app/servicios/viaje-tarifa.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ObservacionesDialogo } from '../observaciones-dialogo.component';
import { ViajePropioTramoService } from 'src/app/servicios/viaje-propio-tramo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viaje-tramo',
  templateUrl: './viaje-tramo.component.html',
  styleUrls: ['./viaje-tramo.component.css']
})
export class ViajeTramoComponent implements OnInit {
  //Evento que envia los datos del formulario a Viaje
  @Output() dataEvent = new EventEmitter<any>();
  //Define un formulario viaje propio para validaciones de campos
  public formularioViajePropio: FormGroup;
  //Define un formulario viaje propio tramo para validaciones de campos
  public formularioViajePropioTramo: FormGroup;
  //Define un formulario viaje propio tramo cliente para validaciones de campos
  public formularioViajePropioTramoCliente: FormGroup;
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
  //Constructor
  constructor(private appComponent: AppComponent, private viajePropioTramoModelo: ViajePropioTramo,
    private tramoServicio: TramoService, private appServicio: AppService,
    private empresaServicio: EmpresaService, private viajeUnidadNegocioServicio: ViajeUnidadNegocioService,
    private viajeTipoCargaServicio: ViajeTipoCargaService, private viajeTipoServicio: ViajeTipoService,
    private viajeTarifaServicio: ViajeTarifaService, public dialog: MatDialog, private fechaServicio: FechaService,
    private servicio: ViajePropioTramoService, private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio tramo
    this.formularioViajePropioTramo = this.viajePropioTramoModelo.formulario;
    //Autocompletado Tramo - Buscar por alias
    this.formularioViajePropioTramo.get('tramo').valueChanges.subscribe(data => {
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
  //Establece los valores por defecto del formulario viaje tramo
  public establecerValoresPorDefecto(): void {
    let valor = 0;
    //Establece la fecha actual
    this.fechaServicio.obtenerFecha().subscribe(res => {
      this.formularioViajePropioTramo.get('fechaTramo').setValue(res.json());
    })
    // this.formularioViajePropioTramo.get('cantidad').setValue(valor);
    // this.formularioViajePropioTramo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioTramo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioTramo.get('importe').disable();
  }
  //Obtiene la mascara de importes
  public mascararImporte(limite) {
    return this.appServicio.mascararImporte(limite);
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
    let viajeTarifa = this.formularioViajePropioTramo.get('viajeTarifa').value;
    let modalidadCarga = this.formularioViajePropioTramo.get('viajeTipo').value;
    let km = this.formularioViajePropioTramo.get('km').value;
    if (this.tipoViaje != null && viajeTarifa && modalidadCarga && km) {
      if (viajeTarifa.id == 1) {
        if (this.tipoViaje) {
          this.formularioViajePropioTramo.get('precioUnitario').setValue(modalidadCarga.costoPorKmPropio);
          let importe = km * modalidadCarga.costoPorKmPropio;
          this.formularioViajePropioTramo.get('importe').setValue(this.appServicio.establecerDecimales(importe, 3));
          this.formularioViajePropioTramo.get('cantidad').setValue(0);
          this.formularioViajePropioTramo.get('cantidad').disable();
          this.formularioViajePropioTramo.get('precioUnitario').disable();
        } else {
          //Viaje Tercero
        }
      } else {
        this.formularioViajePropioTramo.get('cantidad').reset();
        this.formularioViajePropioTramo.get('precioUnitario').reset();
        this.formularioViajePropioTramo.get('cantidad').enable();
        this.formularioViajePropioTramo.get('precioUnitario').enable();
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
        this.formularioViajePropioTramo.get('viajeTarifa').setValue(elemento);
      }
    });
  }
  //Establece los km al seleccionar elemento de tramo
  public establecerKm(): void {
    let tramo = this.formularioViajePropioTramo.get('tramo').value;
    this.formularioViajePropioTramo.get('km').setValue(this.appServicio.desenmascararKm(tramo.km));
  }
  //Establece el estado de tipo de carga al seleccionar una modalidad de carga
  public establecerEstadoTipoCarga(): void {
    let modalidadCarga = this.formularioViajePropioTramo.get('viajeTipo').value;
    if (modalidadCarga.id == 3) {
      this.formularioViajePropioTramo.get('viajeTipoCarga').setValue(this.viajesTiposCargas[0]);
      this.formularioViajePropioTramo.get('viajeTipoCarga').disable();
    } else {
      this.formularioViajePropioTramo.get('viajeTipoCarga').enable();
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
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
    if (cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
    }
  }
  //Verifica el elemento seleccionado en Tarifa para determinar si coloca cantidad e importe en solo lectura
  public estadoTarifa(): boolean {
    try {
      let viajeTarifa = this.formularioViajePropioTramo.get('viajeTarifa').value.id;
      return viajeTarifa == 2 || viajeTarifa == 5;
    } catch (e) {
      return false;
    }
  }
  //Agrega datos a la tabla de tramos
  public agregarTramo(): void {
    this.formularioViajePropioTramo.enable();
    this.numeroOrden++;
    this.formularioViajePropioTramo.get('numeroOrden').setValue(this.numeroOrden);
    let fecha = this.formularioViajePropioTramo.get('fechaTramo').value;
    this.formularioViajePropioTramo.get('fechaAlta').setValue(fecha);
    let km = this.formularioViajePropioTramo.get('tramo').value.km;
    this.formularioViajePropioTramo.get('km').setValue(km);
    this.formularioViajePropioTramo.get('usuario').setValue(this.appComponent.getUsuario());
    this.listaTramos.push(this.formularioViajePropioTramo.value);
    this.formularioViajePropioTramo.reset();
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    document.getElementById('idTramoFecha').focus();
    this.enviarDatos();
  }
  //Modifica los datos del tramo
  public modificarTramo(): void {
    this.listaTramos[this.indiceTramo] = this.formularioViajePropioTramo.value;
    this.btnTramo = true;
    this.formularioViajePropioTramo.reset();
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    document.getElementById('idTramoFecha').focus();
    this.enviarDatos();
  }
  //Modifica un tramo de la tabla por indice
  public modTramo(indice): void {
    this.indiceTramo = indice;
    this.btnTramo = false;
    this.formularioViajePropioTramo.patchValue(this.listaTramos[indice]);
  }
  //Elimina un tramo de la tabla por indice
  public eliminarTramo(indice, elemento): void {
    if (this.indiceSeleccionado == 1) {
      this.listaTramos.splice(indice, 1);
      this.establecerValoresPorDefecto();
      this.establecerViajeTarifaPorDefecto();
      this.enviarDatos();
    } else {
      this.servicio.eliminar(elemento.id).subscribe(res => {
        let respuesta = res.json();
        this.listaTramos.splice(indice, 1);
        this.establecerValoresPorDefecto();
        this.establecerViajeTarifaPorDefecto();
        this.enviarDatos();
        this.toastr.success(respuesta.mensaje);
      });
    }
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    document.getElementById('idTramoFecha').focus();
  }
  //Envia la lista de tramos a Viaje
  private enviarDatos(): void {
    this.dataEvent.emit(this.listaTramos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
  }
  //Establece la lista de tramos
  public establecerLista(lista, viaje): void {
    this.establecerValoresPorDefecto();
    this.establecerViajeTarifaPorDefecto();
    this.listaTramos = lista;
    this.viaje = viaje;
    this.enviarDatos();
  }
  //Establece los campos solo lectura
  public establecerCamposSoloLectura(indice): void {
    this.indiceSeleccionado = indice;
    switch (indice) {
      case 1:
        this.soloLectura = false;
        this.establecerValoresPorDefecto();
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
      this.formularioViajePropioTramo.get('empresa').disable();
      this.formularioViajePropioTramo.get('viajeUnidadNegocio').disable();
      this.formularioViajePropioTramo.get('viajeTipoCarga').disable();
      this.formularioViajePropioTramo.get('viajeTipo').disable();
      this.formularioViajePropioTramo.get('viajeTarifa').disable();
    } else {
      this.formularioViajePropioTramo.get('empresa').enable();
      this.formularioViajePropioTramo.get('viajeUnidadNegocio').enable();
      this.formularioViajePropioTramo.get('viajeTipoCarga').enable();
      this.formularioViajePropioTramo.get('viajeTipo').enable();
      this.formularioViajePropioTramo.get('viajeTarifa').enable();
    }
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.listaTramos = [];
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormularioYLista(): void {
    this.vaciarListas();
    this.formularioViajePropioTramo.reset();
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
  public verDadorDestinatarioDialogo(): void {
    const dialogRef = this.dialog.open(DadorDestinatarioDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema()
      }
    });
    dialogRef.afterClosed().subscribe(viajePropioTramoClientes => {
      this.formularioViajePropioTramo.get('viajePropioTramoClientes').setValue(viajePropioTramoClientes);
    });
  }
  //Abre un dialogo para ver la lista de dadores y destinatarios
  public verDadorDestTablaDialogo(elemento): void {
    const dialogRef = this.dialog.open(DadorDestTablaDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionesDialogo, {
      width: '1200px',
      data: {
        tema: this.appComponent.getTema(),
        elemento: elemento
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
  public listaDadorDestinatario: Array<any> = [];
  //Define la lista de clientes
  public resultadosClientes: Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestinatarioDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private viajePropioTramoClienteModelo: ViajePropioTramoCliente, private clienteServicio: ClienteService) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = this.viajePropioTramoClienteModelo.formulario;
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
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Agrega el dador y el destinatario a la tabla
  public agregarDadorDestinatario(): void {
    this.listaDadorDestinatario.push(this.formulario.value);
    this.formulario.reset();
    document.getElementById('idTramoDadorCarga').focus();
  }
  //Elimina un dador-destinatario de la tabla
  public eliminarDadorDestinatario(indice): void {
    this.listaDadorDestinatario.splice(indice, 1);
    document.getElementById('idTramoDadorCarga').focus();
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
@Component({
  selector: 'dador-dest-tabla-dialogo',
  templateUrl: 'dador-dest-tabla-dialogo.component.html'
})
export class DadorDestTablaDialogo {
  //Define el tema
  public tema: string;
  //Define la observacion
  public listaDadorDestinatario: Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<DadorDestTablaDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece la lista de dadores-destinatarios
    this.listaDadorDestinatario = this.data.elemento.viajePropioTramoClientes;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}