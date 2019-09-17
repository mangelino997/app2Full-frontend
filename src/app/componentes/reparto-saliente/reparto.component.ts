import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup, FormControl } from '@angular/forms';
import { ZonaService } from 'src/app/servicios/zona.service';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { Subscription } from 'rxjs';
import { RepartoPersonal } from 'src/app/modelos/repartoPersonal';
import { LoaderService } from 'src/app/servicios/loader.service';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.css']
})
export class RepartoComponent implements OnInit {
  //Define el formulario General
  public formulario: FormGroup;
  //Define el formulario Comrpobante
  public formularioComprobante: FormGroup;
  //Define el numero reparto como un formControl
  public id: FormControl = new FormControl();
  //Define como un formControl
  public usuario: FormControl = new FormControl();
  //Define como un formControl
  public sucursal: FormControl = new FormControl();
  //Define como un formControl
  public tipoViaje: FormControl = new FormControl();
  //Define como un formControl
  public tipoRemolque: FormControl = new FormControl();
  //Define la lista de resultados para vehiculo o vehiculoProveedor
  public resultadosVehiculo = [];
  //Define la lista de resultados para remolque
  public resultadosRemolque = [];
  //Define la lista de resultados para chofer
  public resultadosChofer = [];
  //Define la lista de resultados para Zonas, Comprobantes, Letras
  public resultadosZona = [];
  // public resultadosComprobante = [];
  //Define el Id de la Planilla seleccionada en la primer Tabla
  // //Define como un formControl
  // public tipoItem:FormControl = new FormControl();
  // //Define la lista de acompañantes
  // public listaAcompaniantes = [];
  // //Define la lista de tipo comprobantes Activos 
  // public listaTipoComprobantes = [];
  // //Define una bandera para control
  // public bandera:boolean=false;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['numeroReparto', 'fecha', 'zona', 'vehiculo', 'chofer', 'ordenesCombustibles', 'adelantosEfectivos',
    'comprobantes', 'cerrar', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private modelo: Reparto, private zonaService: ZonaService, private toastr: ToastrService, private appService: AppService,
    private appComponent: AppComponent, private vehiculoService: VehiculoService, private vehiculoProveedorService: VehiculoProveedorService,
    private personalServie: PersonalService, private choferProveedorService: ChoferProveedorService, public dialog: MatDialog,
    private servicio: RepartoService, private fechaService: FechaService, private loaderService: LoaderService) {
  }

  ngOnInit() {
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    // this.formularioComprobante = this.modelo.formularioComprobante;
    //Reestablece los valores
    this.reestablecerFormulario(undefined);
    //Establece el N° de reparto
    this.obtenerSiguienteId();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Obtiene un listado de Zonas
    this.listarZonas();
    //Obtiene la lista de repartos agregados
    this.listarRepartos();
    //Autocompletado vehiculo- Buscar por alias
    var empresa = this.appService.getEmpresa();
    this.formulario.get('vehiculo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoService.listarPorAliasYEmpresa(data, empresa.id).subscribe(response => {
          this.resultadosVehiculo = response;
        })
      }
    })
    //Autocompletado vehiculo proveedor- Buscar por alias
    var empresa = this.appService.getEmpresa();
    this.formulario.get('vehiculoProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoProveedorService.listarPorAlias(data).subscribe(response => {
          this.resultadosVehiculo = response;
        })
      }
    })
    //Autocompletado vehiculo remolque- Buscar por alias
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoService.listarPorAliasYEmpresaFiltroRemolque(data, empresa.id).subscribe(response => {
          this.resultadosRemolque = response;
        })
      }
    })
    //Autocompletado vehiculo remolque proveedor- Buscar por alias
    this.formulario.get('vehiculoRemolqueProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.vehiculoProveedorService.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosRemolque = response;
        })
      }
    })
    //Autocompletado chofer- Buscar por alias
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServie.listarPorAliasYEmpresa(data, empresa.id).subscribe(response => {
          console.log(response);
          this.resultadosChofer = response;
        })
      }
    })
    //Autocompletado chofer proveedor - Buscar por alias
    this.formulario.get('choferProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.choferProveedorService.listarActivosPorAlias(data).subscribe(response => {
          this.resultadosChofer = response;
        })
      }
    })
  }
  //Establece el N° de reparto
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.id.setValue(res.json());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene la lista de zonas
  private listarZonas() {
    this.zonaService.listar().subscribe(
      res => {
        this.resultadosZona = res.json();
        console.log(res.json());
      },
      err => {
        this.toastr.error('Error al obtener listado de Zonas');
      }
    );
  }
  //Controla el cambio en el select Tipo de Viaje
  public cambioTipoViaje() {
    this.formulario.get('vehiculo').reset();
    this.formulario.get('personal').reset();
    this.formulario.get('vehiculoProveedor').reset();
    this.formulario.get('choferProveedor').reset();
    this.resultadosVehiculo = [];
    this.resultadosChofer = [];
  }
  //Controla el cambio en el select Tipo de Remolque
  public cambioTipoRemolque() {
    this.formulario.get('vehiculoRemolque').reset();
    this.formulario.get('vehiculoRemolqueProveedor').reset();
    this.resultadosRemolque = [];
  }
  //Abre el dialogo para seleccionar un Tramo
  public abrirAcompaniante(): void {
    //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
    const dialogRef = this.dialog.open(AcompanianteDialogo, {
      width: '1200px',
      data: {
        listaAcompaniantesAgregados: this.formulario.value.acompaniantes,
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      if (resultado.length > 0)
        this.formulario.get('acompaniantes').setValue(resultado);
      else
        this.formulario.get('acompaniantes').setValue([]);
    });
  }
  //Agrega un reparto a la tabla
  public agregar() {
    this.loaderService.show();
    console.log(this.formulario.value);
    this.formulario.get('fechaRegistracion').setValue(null);
    this.formulario.get('acompaniantes').setValue([]);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        console.log(res.json);
        let respuesta = res.json();
        if (res.status == 201) {
          setTimeout(function () {
            document.getElementById('idTipoViaje').focus();
          }, 20);
          this.toastr.success("Registro agregado con éxito.");
          this.reestablecerFormulario(respuesta.id);
          this.listarRepartos();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.message);
        this.loaderService.hide();
      }
    )
  }
  //Carga la tabla con la lista de repartos agregados
  private listarRepartos() {
    let empresa = this.appComponent.getEmpresa();
    this.servicio.listarPorEstaCerradaYEmpresa(false, empresa.id).subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
      }
    )
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.usuario.setValue(this.appComponent.getUsuario().nombre);
    this.sucursal.setValue(this.appComponent.getUsuario().sucursal.nombre);
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('empresaEmision').setValue(this.appComponent.getEmpresa());
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.formulario.get('acompaniantes').setValue([]);
    this.tipoViaje.setValue(true);
    this.tipoRemolque.setValue(true);
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaRegistracion').setValue(res.json());
    });
  }

  //Reestablece el formulario completo
  public reestablecerFormulario(id) {
    this.resultadosChofer = [];
    this.resultadosRemolque = [];
    this.resultadosVehiculo = [];
    this.resultadosZona = [];
    this.formulario.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.sort = this.sort;
    this.establecerValoresPorDefecto();
    console.log(id);
    if (id != undefined || id != null)
      this.id.setValue(id);
    setTimeout(function () {
      document.getElementById('idTipoViaje').focus();
    }, 20);
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
@Component({
  selector: 'acompaniante-dialogo',
  templateUrl: 'acompaniante-dialogo.html',
})
export class AcompanianteDialogo {
  //Define la lista del mat-select para acompaniantes 
  public resultadosAcompaniante: Array<any> = [];
  //Define la lista de Acompañantes que se agregan
  public listaAcompaniantes: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['acompaniante', 'quitar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private personalService: PersonalService, public dialogRef: MatDialogRef<AcompanianteDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private modelo: RepartoPersonal, private toastr: ToastrService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    //Declara el formulario y las variables 
    this.formulario = this.modelo.formulario;
    //Inicializa la lista completa para la tabla
    if(this.data.listaAcompaniantesAgregados.length > 0){
      this.listaCompleta = new MatTableDataSource(this.data.listaAcompaniantesAgregados);
      this.listaCompleta.sort = this.sort;
    }else{
      this.listaCompleta = new MatTableDataSource([]);
      this.listaCompleta.sort = this.sort;
    }
    //Obtiene la lista de acompaniantes - completa el mat-select
    this.listarAcompaniantes();
  }
  //Carga la lista de acompaniantes
  private listarAcompaniantes() {
    let empresa = this.appService.getEmpresa();
    this.personalService.listarAcompaniantesPorEmpresa(empresa.id).subscribe(
      res => {
        this.resultadosAcompaniante = res.json();
        console.log(res.json());
      },
      err => {
        console.log("Error al obtener la lista de acompaniantes por empresa.");
      }
    )
  }
  //Agrega Acompañantes a una lista
  public agregar() {
    if (this.listaCompleta.data.length > 0) {
      for (let i = 0; i < this.listaCompleta.data.length; i++) {
        if (this.formulario.get('personal').value.id == this.listaCompleta.data[i].personal.id) {
          this.formulario.reset();
          this.toastr.error("El acompañante seleccionado ya fue agregado a la lista.");
          setTimeout(function () {
            document.getElementById('idAcompaniante').focus();
          }, 20);
        } else {
          this.agregarAcompaniante();
        }
      }
    } else {
      this.agregarAcompaniante();
    }
  }
  //Agrega un acompañante a la lista
  private agregarAcompaniante() {
    this.listaCompleta.data.push(this.formulario.value);
    this.listaCompleta.sort = this.sort;
    this.toastr.success("Acompañante agregado a la lista.");
    this.formulario.reset();
    setTimeout(function () {
      document.getElementById('idAcompaniante').focus();
    }, 20);
  }
  //Quita un acompaniante de la lista
  public quitarAcompaniante(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
    this.toastr.success("Acompañante quitado de la lista.");
    setTimeout(function () {
      document.getElementById('idAcompaniante').focus();
    }, 20);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}