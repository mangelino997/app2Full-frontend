import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';

@Component({
  selector: 'app-adelanto-lote',
  templateUrl: './adelanto-lote.component.html',
  styleUrls: ['./adelanto-lote.component.css']
})
export class AdelantoLoteComponent implements OnInit {
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de categorias
  public categorias: Array<any> = [];
  //Define el resultado
  public resultados: Array<any> = [];
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define el indice seleccionado para anular en Eliminar
  public indiceElemento: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define a empresa como un formControl
  public empresa: FormControl = new FormControl();
  //Define a topeMax como un formControl
  public topeMax: FormControl = new FormControl();
  //Define a categoria como un formControl
  public categoria: FormControl = new FormControl();
  //Define a basicoCategoria como un formControl
  public basicoCategoria: FormControl = new FormControl();
  //Define a fechaDesde como un formControl
  public fechaDesde: FormControl = new FormControl();
  //Define a fechaHasta como un formControl
  public fechaHasta: FormControl = new FormControl();
  //Define a numeroLote como un formControl
  public numeroLote: FormControl = new FormControl();
  //Define a observacion como un formControl
  public observacion: FormControl = new FormControl('', Validators.required);
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define las columnas de la tabla
  public columnas: string[] = ['empresa', 'fechaEmision', 'lote', 'importeAdelanto', 'totalLegajos', 'importeTotal', 'anular'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render: boolean = false;
  //Constructor
  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: PersonalAdelanto, private sucursalService: SucursalService,
    private categoriaService: CategoriaService, private fechaService: FechaService, private basicoCategoriaService: BasicoCategoriaService,
    private servicio: PersonalAdelantoService, public dialog: MatDialog) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de Sucursales
    this.listarSucursales();
    //Obtiene la lista de Categorias
    this.listarCategorias();
    //Establece la empresa
    this.empresa.setValue(this.appService.getEmpresa());
  }
  //Carga la lista de sucursales
  private listarSucursales() {
    this.sucursalService.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
      }
    );
  }
  //Carga la lista de categorias
  private listarCategorias() {
    this.categoriaService.listar().subscribe(
      res => {
        this.categorias = res.json();
      },
      err => {
      }
    );
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idFechaDesde');
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregar();
        break;
      case 4:
        break;
      default:
        break;
    }
  }

  //Agrega un registro
  public agregar() {
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
    let usuario = this.appService.getUsuario();
    let observaciones = this.formulario.value.observaciones;
    let importe = this.formulario.value.importe;
    let categoria = this.categoria.value;
    let sucursal = usuario.sucursal;
    let idCategoria;
    if (categoria != 0)
      idCategoria = categoria.id;
    else
      idCategoria = 0;
    let elemento = {
      idEmpresa: empresa.id,
      idSucursal: sucursal.id,
      idCategoria: idCategoria,
      idUsuarioAlta: usuario.id,
      observaciones: observaciones,
      importe: importe
    };
    this.servicio.agregarLote(elemento).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.length == 0) {
          this.toastr.success("Registros agregados con éxito");
          setTimeout(function () {
            document.getElementById('idSucursal').focus();
          }, 20);
          this.loaderService.hide();
        } else {
          this.toastr.success("Registros agregados con éxito");
          this.modalAdelantosFallidos(respuesta);
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        if (err.status == 409) {
          this.modalAdelantosFallidos(error);
          this.toastr.error("No se aplicó ningún adelanto.");
        }
        this.loaderService.hide();
      }
    )
  }
  //Abre el modal de los personales a los que no se aplico el adelanto de sueldo (fallidos)
  private modalAdelantosFallidos(adelantosFallidos) {
    const dialogRef = this.dialog.open(AdelantoLoteDialogo, {
      width: '750px',
      data: {
        listaPersonalAdelanto: adelantosFallidos
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.reestablecerFormulario(undefined);
    });
  }
  //Elimina un registro
  public anular() {
    this.loaderService.show();
    this.formulario.reset();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.formulario.get('observacionesAnulado').setValue(this.observacion.value);
    this.formulario.get('numeroLote').setValue(this.numeroLote.value);
    this.servicio.anularLote(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.observacion.reset();
        this.buscar();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Controla el Anular
  public activarAnular(numeroLote, indice) {
    this.numeroLote.setValue(numeroLote);
    this.indiceElemento = indice;
    setTimeout(function () {
      document.getElementById('idObervaciones').focus();
    }, 20);
  }
  //Carga la tabla con registros
  public buscar() {
    this.loaderService.show();
    let fechaDesde = this.fechaDesde.value;
    let fechaHasta = this.fechaHasta.value;
    let empresa = this.appService.getEmpresa();
    this.servicio.listarLotes(fechaDesde, fechaHasta, empresa.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.toastr.error("Error al obtener la lista de registros");
        this.loaderService.hide();
      }
    )
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.observacion.reset();
    this.numeroLote.setValue(null);
    this.indiceElemento = null,
      this.fechaDesde.reset();
    this.fechaHasta.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.topeMax.reset();
    this.basicoCategoria.reset();
    this.categoria.reset();
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.formulario.get('fechaEmision').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Controla el cambio en categoria
  public cambioCategoria() {
    let categoria = this.categoria.value;
    if (categoria != 0) {
      this.basicoCategoriaService.obtenerPorCategoria(categoria.id).subscribe(
        res => {
          if (res.status == 200) {
            this.basicoCategoria.setValue(res.json());
            let topeMax = (categoria.topeBasicoAdelantos / 100) * this.basicoCategoria.value.basico;
            this.topeMax.setValue(this.appService.establecerDecimales(topeMax, 2));
          } else {
            this.basicoCategoria.setValue(null);
            this.topeMax.setValue(null);
            this.toastr.error("La categoría no tiene asignado un básico categoría.");
            setTimeout(function () {
              document.getElementById('idCategoria').focus();
            }, 20);
          }
        },
        err => {
          this.basicoCategoria.setValue(null);
          this.topeMax.setValue(null);
          this.toastr.error("La categoría no tiene asignado un básico categoría.");
          setTimeout(function () {
            document.getElementById('idCategoria').focus();
          }, 20);
        }
      )
    } else {
      this.topeMax.setValue(this.appService.establecerDecimales('0.00', 2));
    }
  }
  //Controla y valida el improte
  public controlarImporte() {
    let categoria = this.categoria.value;
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(this.formulario.value.importe, 2));
    let importe = Number(this.formulario.get('importe').value);
    let topeMax = Number(this.topeMax.value);
    if (categoria != 0) {
      if (importe > topeMax) {
        this.toastr.error("El importe no debe ser mayor al tope máximo.");
        this.formulario.get('importe').setValue(null);
        setTimeout(function () {
          document.getElementById('idImporte').focus();
        }, 20);
      }
    }

  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
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
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
}
//Componente 
@Component({
  selector: 'adelanto-lote-dialogo',
  templateUrl: 'adelanto-lote-dialogo.html',
  styleUrls: ['./adelanto-lote.component.css']
})
export class AdelantoLoteDialogo {
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['numeroLegajo', 'personal', 'motivo'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<AdelantoLoteDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.listaCompleta = new MatTableDataSource(this.data.listaPersonalAdelanto);
    this.listaCompleta.sort = this.sort;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }

}