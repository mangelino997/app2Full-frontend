import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-estado-servicio-afip',
  templateUrl: './estado-servicio-afip.component.html',
  styleUrls: ['./estado-servicio-afip.component.css']
})
export class EstadoServicioAfipComponent implements OnInit {
  //Define la pestania activa
  public activeLink:any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define el autocompletado
  public autocompletado:FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros:Array<any> = [];
  //Defien la lista de empresas
  public empresas:Array<any> = [];
  
  constructor() { }

  ngOnInit() {
  }

}
