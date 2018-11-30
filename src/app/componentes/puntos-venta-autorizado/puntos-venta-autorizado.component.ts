import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-puntos-venta-autorizado',
  templateUrl: './puntos-venta-autorizado.component.html',
  styleUrls: ['./puntos-venta-autorizado.component.css']
})
export class PuntosVentaAutorizadoComponent implements OnInit {
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
  // public compereFn:any;
  //Constructor

  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private toastr: ToastrService) {
    
   }

  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      empresa: new FormControl()
      });
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  
}
