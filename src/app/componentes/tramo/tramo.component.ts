import { Component, OnInit, ViewChild } from '@angular/core';
import { TramoService } from '../../servicios/tramo.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { OrigenDestinoService } from '../../servicios/origen-destino.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-tramo',
  templateUrl: './tramo.component.html',
  styleUrls: ['./tramo.component.css']
})
export class TramoComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
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
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el autocompletado para las busquedas Origen
  public autocompletadoOrigen: FormControl = new FormControl();
  //Define el autocompletado para las busquedas Destino
  public autocompletadoDestino: FormControl = new FormControl();
  //Define la lista de resultados del autocompletado
  public resultados: Array<any> = [];
  //Define la lista de resultados de origenes destinos
  public resultadosOrigenesDestinos: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'ORIGEN', 'DESTINO', 'KM', 'RUTA_ALTERNATIVA', 'LIQ_CHOFER', 'ESTA_ACTIVO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define autocompletados listar
  public autocompletadoOrigenListar: FormControl = new FormControl();
  public autocompletadoDestinoListar: FormControl = new FormControl();
  public resultadosOrigenListar: Array<any> = [];
  public resultadosDestinoListar: Array<any> = [];
  //Constructor
  constructor(private servicio: TramoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private origenDestinoServicio: OrigenDestinoService,
    private toastr: ToastrService, private loaderService: LoaderService, private reporteServicio: ReporteService) {
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
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorOrigen(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoOrigen.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorOrigen(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoDestino.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorDestino(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoOrigenListar.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosOrigenListar = res;
        })
      }
    })
    //Autocompletado - Buscar por nombre
    this.autocompletadoDestinoListar.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosDestinoListar = res;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      origen: new FormControl('', Validators.required),
      destino: new FormControl('', Validators.required),
      km: new FormControl(),
      estaActivo: new FormControl('', Validators.required),
      excluirLiqChofer: new FormControl('', Validators.required),
      rutaAlternativa: new FormControl('', Validators.maxLength(20))
    });
    //Autocompletado Origen - Buscar por nombre
    this.formulario.get('origen').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosOrigenesDestinos = res;
        })
      }
    })
    //Autocompletado Destino - Buscar por nombre
    this.formulario.get('destino').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.origenDestinoServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosOrigenesDestinos = res;
        })
      }
    })
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
  }
  //Establece el formulario
  public establecerFormulario(): void {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
  }
  //Obtiene la mascara de km
  public obtenerMascaraKm(intLimite) {
    return this.appService.mascararKm(intLimite);
  }
  //Desenmascara km
  public establecerKm(formulario): void {
    formulario.setValue(this.appService.desenmascararKm(formulario.value));
  }
  //Vacia las listas de resultados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosOrigenesDestinos = [];
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('excluirLiqChofer').setValue(false);
    this.formulario.get('estaActivo').setValue(true);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('excluirLiqChofer').enable();
      this.formulario.get('estaActivo').enable();
    } else {
      this.formulario.get('excluirLiqChofer').disable();
      this.formulario.get('estaActivo').disable();
    }
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
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (id != 5) {
      this.reestablecerFormulario('');
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPorDefecto();
        this.establecerValoresPestania(nombre, false, false, true, 'idOrigen');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        setTimeout(function () {
          document.getElementById('idAutocompletadoOrigen').focus();
        }, 20);
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
      case 3:
        this.actualizar();
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerValoresPorDefecto();
          document.getElementById('idOrigen').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11017) {
          this.toastr.error('Error Unicidad Origen->Destino', respuesta.mensaje + " TRAMO");
        }
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Limpia los autocompletados
  public limpiarAutocompletados(opcion): void {
    this.listaCompleta = new MatTableDataSource([]);
    if (opcion) {
      this.autocompletadoDestino.reset();
    } else {
      this.autocompletadoOrigen.reset();
    }
  }
  //Establece la tabla al seleccion elemento de autocompletado
  public establecerTabla() {
    let origen = this.autocompletadoOrigenListar.value;
    let destino = this.autocompletadoDestinoListar.value;
    this.servicio.listarPorFiltro(origen ? origen.id : 0, destino ? destino.id : 0).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
      this.listaCompleta.paginator = this.paginator;
    })
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.reset();
    this.vaciarListas();
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre + ' -> '
        + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre
        + ' (Ruta Alt.: ' + elemento.rutaAlternativa + ')' : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        origen: elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre,
        destino: elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre,
        km: elemento.km,
        ruta_alternativa: elemento.rutaAlternativa,
        liq_chofer: elemento.excluirLiqChofer ? 'Sí' : 'No',
        esta_activo: elemento.estaActivo ? 'Sí' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Tramos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}