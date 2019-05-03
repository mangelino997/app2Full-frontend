import { Component, OnInit, ViewChild } from '@angular/core';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-escala-tarifa',
  templateUrl: './escala-tarifa.component.html',
  styleUrls: ['./escala-tarifa.component.css']
})
export class EscalaTarifaComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['hasta', 'valor', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: EscalaTarifaService, private loaderService: LoaderService,
    private toastr: ToastrService, private appServicio: AppService) {
    //Se subscribe al servicio de lista de registros
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
    //Establece el foco en valor
    setTimeout(function () {
      document.getElementById('idValor').focus();
    }, 20);
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      valor: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(45)]),
      descripcion: new FormControl()
    });
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  public agregar() {
    this.loaderService.show();
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idValor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
          this.listar();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11016) {
          document.getElementById("labelValor").classList.add('label-error');
          document.getElementById("idValor").classList.add('is-invalid');
          document.getElementById("idValor").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un item de la lista
  public eliminar(id) {
    this.loaderService.show();
    this.servicio.eliminar(id).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idValor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
          this.listar();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
    this.establecerHasta(this.formulario.get('valor'));
  }
  //Establece el valor del campo descripcion al perder foco el campo valor
  private establecerHasta(valor) {
    if (valor.value != undefined && valor.value != '') {
      this.formulario.get('descripcion').setValue('Hasta ' + valor.value);
    } else {
      this.formulario.get('descripcion').setValue(undefined);
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
    this.formulario.get('descripcion').setValue('Hasta ' + valor.target.value);
  }
}