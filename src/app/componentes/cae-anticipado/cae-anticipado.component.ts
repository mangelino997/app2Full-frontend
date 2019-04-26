import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-cae-anticipado',
  templateUrl: './cae-anticipado.component.html',
  styleUrls: ['./cae-anticipado.component.css']
})
export class CaeAnticipadoComponent implements OnInit {
  //Define la pestania activa
  public pestaniaActiva:number;
  //Define el indice seleccionado
  public indiceSeleccionado:number;
  //Define el formulario
  public formulario:FormGroup;
  //Constructor
  constructor(private appComponent: AppComponent, private toastr: ToastrService, private appService: AppService) {
    //Establece la pestania activa por defecto
    this.pestaniaActiva = 1;
    //Establece el indice activo por defecto
    this.indiceSeleccionado = 1;
  }
  //Al iniciarse el componente
  ngOnInit() {}
  //Marcarar enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
}