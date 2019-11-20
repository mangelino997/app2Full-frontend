import { Component, OnInit, ViewChild } from '@angular/core';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { EscalaTarifa } from 'src/app/modelos/escalaTarifa';

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
  public columnasMostradas: FormControl = new FormControl();
  //Define las columnas de la tabla
  public columnas: string[] = ['HASTA', 'VALOR', 'ELIMINAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private appService: AppService, private servicio: EscalaTarifaService, private loaderService: LoaderService,
    private toastr: ToastrService, private appServicio: AppService, private reporteServicio: ReporteService, private modelo: EscalaTarifa) {
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
    this.formulario = this.modelo.formulario;
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
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  public agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          this.listar();
          document.getElementById('idValor').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        if (error.codigo == 11016) {
          document.getElementById("labelValor").classList.add('label-error');
          document.getElementById("idValor").classList.add('is-invalid');
          document.getElementById("idValor").focus();
        }
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un item de la lista
  public eliminar(id) {
    this.loaderService.show();
    this.servicio.eliminar(id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.listar();
          document.getElementById('idValor').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Manejo de colores de campos y labels
  public cambioValor() {
    this.setDecimales(this.formulario.get('valor'), 2);
    let elemento = this.formulario.get('valor').value;
    document.getElementById('idValor').classList.remove('is-invalid');
    document.getElementById('labelValor').classList.remove('label-error');
    elemento ? this.formulario.get('descripcion').setValue('Hasta ' + elemento) : this.formulario.get('descripcion').reset() ;
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
      this.formulario.get('descripcion').setValue('Hasta ' + formulario.value);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        hasta: 'Hasta',
        valor: this.returnDecimales(elemento.valor, 2)
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Escalas de Tarifas',
      empresa: this.appServicio.getEmpresa().razonSocial,
      usuario: this.appServicio.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}