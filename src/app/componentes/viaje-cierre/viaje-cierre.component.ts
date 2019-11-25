import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { ViajeCierreDocumentacion } from 'src/app/modelos/viaje-cierre-documentacion';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ViajeCierreDocumentacionService } from 'src/app/servicios/viaje-cierre-documentacion.service';

@Component({
  selector: 'app-viaje-cierre',
  templateUrl: './viaje-cierre.component.html',
  styleUrls: ['./viaje-cierre.component.css']
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
    private subopcionPestaniaService: SubopcionPestaniaService) { 
      console.log('PASO');
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
          console.log(this.pestanias);
        }
      );
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario
    this.formulario = this.viajeCierreDocumentacion.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
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
        this.establecerValoresPestania(nombre, false, false, true, 'idViaje');
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
      // document.getElementById(componente).focus();
    }, 20);
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('viaje').enable();
      this.formulario.get('fechaDocumentacion').enable();
      this.formulario.get('kmInicio').enable();
      this.formulario.get('kmFinal').enable();
      this.formulario.get('kmRecorridos').enable();
      this.formulario.get('kmTramos').enable();
      this.formulario.get('kmDiferencia').enable();
      this.formulario.get('litrosViaje').enable();
      this.formulario.get('litrosRendidos').enable();
      this.formulario.get('litrosDiferencia').enable();
    } else {
      this.formulario.get('viaje').disable();
      this.formulario.get('fechaDocumentacion').disable();
      this.formulario.get('kmInicio').disable();
      this.formulario.get('kmFinal').disable();
      this.formulario.get('kmRecorridos').disable();
      this.formulario.get('kmTramos').disable();
      this.formulario.get('kmDiferencia').disable();
      this.formulario.get('litrosViaje').disable();
      this.formulario.get('litrosRendidos').disable();
      this.formulario.get('litrosDiferencia').disable();
    }
  }
}