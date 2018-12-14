import { Component, OnInit, ViewChild } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reparto-entrante',
  templateUrl: './reparto-entrante.component.html',
  styleUrls: ['./reparto-entrante.component.css']
})
export class RepartoEntranteComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
   //Define la lista completa de registros
   public listaSegundaTabla:Array<any> = [];
  constructor() {

   }

  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      tipo: new FormControl(),
      estado: new FormControl(),
      cobranza: new FormControl(),
      contado: new FormControl(),
      cobranzaContraReembolso: new FormControl(),
      observaciones: new FormControl()
      });
  }


  //Elimina una fila de la segunda tabla
  public eliminarElemento(indice) {
    this.listaSegundaTabla.splice(indice, 1); 
  }
}
