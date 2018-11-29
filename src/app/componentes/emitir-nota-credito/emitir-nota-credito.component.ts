import { Component, OnInit } from '@angular/core';
import { AgendaTelefonicaService } from '../../servicios/agenda-telefonica.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotaCredito } from 'src/app/modelos/notaCredito';

@Component({
  selector: 'app-emitir-nota-credito',
  templateUrl: './emitir-nota-credito.component.html',
  styleUrls: ['./emitir-nota-credito.component.css']
})
export class EmitirNotaCreditoComponent implements OnInit {
  public checkboxComp: boolean=null;
  public checkboxCuenta: boolean=null;
  public tablaVisible: boolean=null;
  public formulario: FormGroup;


  constructor(private notaCredito: NotaCredito) { }

  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible=true;
    this.checkboxComp=true;
    console.log(this.tablaVisible+"///");
    //inicializa el formulario y sus elementos
    this.formulario= this.notaCredito.formulario;
  }

  public cambiarTablaCuenta(){
    this.tablaVisible=false;
  }
  public cambiarTablaComp(){
    this.tablaVisible=true;
  }


}
