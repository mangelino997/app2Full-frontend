import { Component, OnInit } from '@angular/core';
import { AgendaTelefonicaService } from '../../servicios/agenda-telefonica.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotaDebito } from 'src/app/modelos/notaDebito';

@Component({
  selector: 'app-emitir-nota-debito',
  templateUrl: './emitir-nota-debito.component.html',
  styleUrls: ['./emitir-nota-debito.component.css']
})
export class EmitirNotaDebitoComponent implements OnInit {
  public formulario: FormGroup;


  constructor(private notaDebito: NotaDebito) { 
    
  }

  ngOnInit() {
    this.formulario= this.notaDebito.formulario;
  }

}
