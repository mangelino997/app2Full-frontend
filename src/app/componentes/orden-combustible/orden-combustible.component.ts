import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ViajeCombustibleService } from 'src/app/servicios/viaje-combustible';
import { ViajeCombustible } from 'src/app/modelos/viajeCombustible';
import { LoaderState } from 'src/app/modelos/loader';
import { PersonalService } from 'src/app/servicios/personal.service';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orden-combustible',
  templateUrl: './orden-combustible.component.html',
  styleUrls: ['./orden-combustible.component.css']
})
export class OrdenCombustibleComponent implements OnInit {

  //Define el resultado
  public resultados: Array<any> = [];
  //Define la lista de insumos combustibles
  public resultadosInsComb: Array<any> = [];
  //Define un formulario para validaciones de campos 
  public formulario: FormGroup;
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define el importe como un formControl
  public importe: FormControl = new FormControl();
  //Define la lista completa de registros para la segunda tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define las columnas de la tabla
  public columnas: string[] = ['sucursal', 'numeroOrden', 'fecha', 'proveedor', 'insumoProducto', 'cantidad', 'precioUnitario',
    'observaciones', 'anulado', 'obsAnulado', 'mod', 'ver'];
  //Define la matSort
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  loaderService: any;
  constructor(private appService: AppService, private modelo: ViajeCombustible, private servicio: ViajeCombustibleService, @Inject(MAT_DIALOG_DATA) public data,
    private personalService: PersonalService, private insProductoService: InsumoProductoService, private toastr: ToastrService, ) {

  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Reestablece el formulario
    this.reestablecerFormulario();
    //Carga la tabla con los registros de combustibles reparto
    this.listarCombustiblesReparto();
    //Obtiene la lista de insumos productos
    this.listarInsProducto();
    //Alias - Buscar por alias
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalService.listarActivosPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Carga la lista de insumos productos
  private listarInsProducto() {
    this.insProductoService.listarCombustibles().subscribe(
      res => {
        console.log(res.json());
        this.resultadosInsComb = res.json();
      }
    )
  }
  //Agrega el registro 
  public agregar() {
    this.loaderService.show();
    this.controlarCamposVacios();
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listarCombustiblesReparto();
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
  //Reestablece el Formulario 
  private reestablecerFormulario() {
    this.formulario.reset();
    this.resultados = [];
    this.importe.setValue(this.appService.establecerDecimales('0.00', 2));
    setTimeout(function () {
      document.getElementById('idInsumoProducto').focus();
    }, 20);
  }
  //Calcula el Importe
  public calcularImporte() {
    this.establecerDecimales(this.formulario.get('precioUnitario'), 2);
    this.establecerDecimales(this.formulario.get('cantidad'), 2);
    let precioUnitario = this.formulario.get('precioUnitario').value;
    let cantidad = this.formulario.get('cantidad').value;
    if (precioUnitario && cantidad) {
      let importe = precioUnitario * cantidad;
      this.importe.setValue(this.appService.establecerDecimales(importe, 2));
    }
    if (precioUnitario == null || precioUnitario == '' || cantidad == null || cantidad == '') {
      this.toastr.error("Error al calcular el importe. Campo vacío en 'Precio Unitario' o en 'Cantidad'.");
    }
  }
  //Controla campos vacios. Establece en cero los nulos
  private controlarCamposVacios() {
    if (!this.formulario.value.cantidad || this.formulario.value.cantidad == undefined)
      this.formulario.get('cantidad').setValue(this.appService.establecerDecimales('0.00', 2));
    if (!this.formulario.value.precioUnitario || this.formulario.value.precioUnitario == undefined)
      this.formulario.get('precioUnitario').setValue(this.appService.establecerDecimales('0.00', 2));
    if (!this.formulario.value.importe || this.formulario.value.importe == undefined)
      this.formulario.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
  }
  //Carga la tabla con la lista de Combustibles Reparto
  private listarCombustiblesReparto() {
    this.servicio.listarCombustiblesReparto(this.data.elemento.id).subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
      }
    )
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appService.mascararEnterosConDecimales(limit);
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}
