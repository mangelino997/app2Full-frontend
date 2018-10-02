import { Component, OnInit } from '@angular/core';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-escala-tarifa',
  templateUrl: './escala-tarifa.component.html'
})
export class EscalaTarifaComponent implements OnInit {
  //Define una lista
  private lista = null;
  //Define un formulario para validaciones de campos
  private formulario = null;
  //Define el elemento
  private elemento:any = {};
  //Define la lista completa de registros
  private listaCompleta:any = null;
  //Constructor
  constructor(private servicio: EscalaTarifaService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, private appServicio: AppService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      valor: new FormControl(),
      descripcion: new FormControl()
    });
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Establece el foco en valor
    setTimeout(function() {
      document.getElementById('idValor').focus();
    }, 20);
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.elemento.id = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de registros
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un registro
  public agregar(elemento) {
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCampos();
          setTimeout(function() {
            document.getElementById('idValor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 11016) {
          document.getElementById("labelValor").classList.add('label-error');
          document.getElementById("idValor").classList.add('is-invalid');
          document.getElementById("idValor").focus();
        }
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Elimina un item de la lista
  public eliminar(id) {
    this.servicio.eliminar(id).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerCampos();
          setTimeout(function() {
            document.getElementById('idValor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    )
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Establece el valor del campo descripcion al perder foco el campo valor
  public establecerHasta(valor) {
    if(valor.target.value != undefined && valor.target.value != '') {
      valor.target.value = this.setDecimales(valor.target.value, 2);
      this.elemento.descripcion = 'Hasta ' + valor.target.value;

    } else {
      this.elemento.descripcion = null;
    }
  }
  //Formatea el numero a x decimales
  private setDecimales(valor, cantidad) {
    return this.appServicio.setDecimales(valor, cantidad);
  }
}
