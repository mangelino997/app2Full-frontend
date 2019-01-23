import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  public numeroOrden:number;
  //Constructor
  constructor(private appComponent: AppComponent, private viajePropioTramoModelo: ViajePropioTramo,
    private tramoServicio: TramoService,
    private empresaServicio: EmpresaService, private viajeUnidadNegocioServicio: ViajeUnidadNegocioService,
    private viajeTipoCargaServicio: ViajeTipoCargaService, private viajeTipoServicio: ViajeTipoService,
    private viajeTarifaServicio: ViajeTarifaService, public dialog: MatDialog, private fechaServicio: FechaService) { }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario viaje propio tramo
    this.formularioViajePropioTramo = this.viajePropioTramoModelo.formulario;
    //Autocompletado Tramo - Buscar por alias
    this.formularioViajePropioTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
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
    this.formularioViajePropioTramo.get('cantidad').setValue(valor);
    this.formularioViajePropioTramo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
    this.formularioViajePropioTramo.get('importe').setValue(this.appComponent.establecerCeros(valor));
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
      },
      err => {
        console.log(err);
      }
    );
  }
  //Calcula el importe a partir de cantidad/km y precio unitario
  public calcularImporte(formulario): void {
    let cantidad = formulario.get('cantidad').value;
    let precioUnitario = formulario.get('precioUnitario').value;
    formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
    if (cantidad != null && precioUnitario != null) {
      let importe = cantidad * precioUnitario;
      formulario.get('importe').setValue(importe);
      this.establecerCeros(formulario.get('importe'));
      // formulario.get('importe').setValue(importe.toFixed(2));
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
    document.getElementById('idTramoFecha').focus();
    this.enviarDatos();
  }
  //Elimina un tramo de la tabla por indice
  public eliminarTramo(indice): void {
    this.listaTramos.splice(indice, 1);
    document.getElementById('idTramoFecha').focus();
    this.enviarDatos();
  }
  //Envia la lista de tramos a Viaje
  private enviarDatos(): void {
    this.dataEvent.emit(this.listaTramos);
  }
  //Establece los ceros en los numeros flotantes
  public establecerCeros(elemento): void {
    elemento.setValue(this.appComponent.establecerCeros(elemento.value));
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
        ' ---> ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre + ' (' + elemento.km + 'km)' : elemento;
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
    dialogRef.afterClosed().subscribe(resultado => {});
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
    dialogRef.afterClosed().subscribe(resultado => {});
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
      if (typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
    //Autocompletado Cliente Destinatario - Buscar por alias
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
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
    this.listaDadorDestinatario = this.data.elemento.listaViajePropioTramoCliente;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente ObservacionesDialogo
@Component({
  selector: 'observaciones-dialogo',
  templateUrl: '../observaciones-dialogo.component.html'
})
export class ObservacionesDialogo {
  //Define el tema
  public tema: string;
  //Define el formulario
  public formulario: FormGroup;
  //Define la observacion
  public observaciones: string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ObservacionesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit() {
    //Establece el tema
    this.tema = this.data.tema;
    //Establece el formulario
    this.formulario = new FormGroup({
      observaciones: new FormControl()
    });
    //Establece las observaciones
    this.formulario.get('observaciones').setValue(this.data.elemento);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}