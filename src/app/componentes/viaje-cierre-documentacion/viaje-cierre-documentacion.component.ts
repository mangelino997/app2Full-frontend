import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { ViajeCierreDocumentacion } from 'src/app/modelos/viaje-cierre-documentacion';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ViajeCierreDocumentacionService } from 'src/app/servicios/viaje-cierre-documentacion.service';
import { Viaje } from 'src/app/modelos/viaje';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { FechaService } from 'src/app/servicios/fecha.service';

@Component({
  selector: 'app-viaje-cierre-documentacion',
  templateUrl: './viaje-cierre-documentacion.component.html',
  styleUrls: ['./viaje-cierre-documentacion.component.css']
})
export class ViajeCierreDocumentacionComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el formulario 
  public formulario: FormGroup;
  //Define el formulario viaje
  public formularioViaje: FormGroup;
  //Define la hora
  public hora:FormControl = new FormControl('', Validators.required);
  //Define km recorridos
  public kmRecorridos:FormControl = new FormControl('', Validators.required);
  //Define km tramos
  public kmTramos:FormControl = new FormControl('', Validators.required);
  //Define diferencia km
  public diferenciaKm:FormControl = new FormControl('', Validators.required);
  //Define litros gs
  public litrosGS:FormControl = new FormControl('', Validators.required);
  //Define diferencia lts
  public diferenciaLts:FormControl = new FormControl('', Validators.required);
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'VIAJE', 'FECHA', 'KMINICIO', 'KMFINAL', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor de la clase
  constructor(private viajeCierreDocumentacion: ViajeCierreDocumentacion, private servicio: ViajeCierreDocumentacionService, private appService: AppService, 
    private subopcionPestaniaService: SubopcionPestaniaService, private viaje: Viaje, private viajeServicio: ViajeService,
    private loaderService: LoaderService, private fechaServicio: FechaService) { 
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        }
      );
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.viajeCierreDocumentacion.formulario;
    //Establece el formulario de viaje
    this.formularioViaje = new FormGroup({
      id: new FormControl(),
      fletero: new FormControl(),
      vehiculo: new FormControl(),
      chofer: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la fecha y hora actual
    this.obtenerFechaYHora();
  }
  //Obtiene la fecha y hora actual
  private obtenerFechaYHora(): void {
    this.loaderService.show();
    this.fechaServicio.obtenerFechaYHora().subscribe(
      res => {
        this.hora.setValue(res.text());
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        // this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idCodigo');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        break;
      default:
        break;
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.autocompletado.reset();
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('fecha').enable();
      this.formulario.get('kmInicio').enable();
      this.formulario.get('kmFinal').enable();
      this.formulario.get('kmAjuste').enable();
      this.formulario.get('litrosRendidos').enable();
    } else {
      this.formulario.get('fecha').disable();
      this.formulario.get('kmInicio').disable();
      this.formulario.get('kmFinal').disable();
      this.formulario.get('kmAjuste').disable();
      this.formulario.get('litrosRendidos').disable();
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Obtiene un viaje por id
  public obtenerViajePorId() {
    this.loaderService.show();
    let id = this.formularioViaje.get('id').value;
    this.viajeServicio.obtenerPorId(id).subscribe(
      res => {
        let viaje = res.json();
        this.formularioViaje.get('fletero').setValue(viaje.empresaEmision ? viaje.empresaEmision.razonSocial : viaje.proveedor.razonSocial);
        this.formularioViaje.get('vehiculo').setValue(viaje.vehiculo ? viaje.vehiculo.alias : viaje.vehiculoProveedor.alias);
        this.formularioViaje.get('chofer').setValue(viaje.personal ? viaje.personal.alias : viaje.choferProveedor.alias);
        this.loaderService.hide();
        viaje.vehiculo ? this.obtenerUltimoCierreDeVehiculo(viaje.vehiculo.id) : null;
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Obtiene el ultimo cierre de documentacion de un vehiculo
  private obtenerUltimoCierreDeVehiculo(idVehiculo): void {
    this.loaderService.show();
    this.servicio.obtenerUltimoCierreDeVehiculo(idVehiculo).subscribe(
      res => {
        let respuesta = res.json();
        this.formulario.get('kmInicio').setValue(respuesta.kmInicio);
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
}