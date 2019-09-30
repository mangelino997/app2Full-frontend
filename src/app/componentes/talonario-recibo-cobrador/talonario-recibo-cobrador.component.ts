import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { LoaderState } from 'src/app/modelos/loader';
import { TalonarioReciboCobrador } from 'src/app/modelos/talonarioReciboCobrador';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Subscription } from 'rxjs';
import { TalonarioReciboService } from 'src/app/servicios/talonario-recibo.service';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { TalonarioReciboLoteService } from 'src/app/servicios/talonario-recibo-lote.service';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { AppComponent } from 'src/app/app.component';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-talonario-recibo-cobrador',
  templateUrl: './talonario-recibo-cobrador.component.html',
  styleUrls: ['./talonario-recibo-cobrador.component.css']
})
export class TalonarioReciboCobradorComponent implements OnInit {
  //Define los datos de la Empresa
  public empresa: FormControl = new FormControl();
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
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define los resultados del autocompletado
  public resultados: Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de Cobradores
  public listaCobradores: Array<any> = [];
  //Define la lista para Talonarios Recibos Lote
  public listaTalRecLote: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'EMPRESA', 'COBRADOR', 'TAL_REC_LOTE', 'P_VENTA', 'LETRA', 'DESDE', 'HASTA', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: TalonarioReciboService, private subopcionPestaniaService: SubopcionPestaniaService, private appComponent: AppComponent,
    private talonarioReciboLoteService: TalonarioReciboLoteService, private appService: AppService, private modelo: TalonarioReciboCobrador,
    private toastr: ToastrService, private loaderService: LoaderService, private cobradorService: CobradorService, private reporteServicio: ReporteService) {
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
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Iniciliza los campos
    this.inicializarCampos();
    //Obtiene la lista de Cobradores
    this.listarCobradores();
    //Obtiene los talonarios recibo lote
    this.listarTalRecLote();
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.patchValue(elemento);
    //this.autoLocalidad.setValue(elemento.localidad);
  }
  //Obtiene el listado de cobradores
  private listarCobradores() {
    this.cobradorService.listarPorEstaActivo().subscribe(
      res => {
        this.listaCobradores = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de Talonario Recibo Lote
  private listarTalRecLote() {
    this.talonarioReciboLoteService.listarPorEmpresaYLoteEntregadoFalse(this.formulario.value.empresa.id).subscribe(
      res => {
        this.listaTalRecLote = res;
      }
    )
  }
  //iniciliza los campos
  private inicializarCampos() {
    let empresa = this.appService.getEmpresa();
    this.empresa.setValue(empresa.razonSocial);
    this.formulario.get('empresa').setValue(empresa);
  }
  //Vacia la lista de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosLocalidades = [];
  }
  //Maneja el cambio en el select de Talonario Recibo Lote
  public cambioTalRecLote() {
    let talonarioReciboLote = this.formulario.value.talonarioReciboLote;
    this.formulario.get('letra').setValue(talonarioReciboLote.letra);
    this.formulario.get('puntoVenta').setValue(talonarioReciboLote.puntoVenta);
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
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idCobrador');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
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
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let usuario = this.appComponent.getUsuario();
    this.formulario.get('usuarioAlta').setValue(usuario);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idCobrador').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
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
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Obtiene la mascara de enteros SIN decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Valida longitud
  public validarLongitud(elemento, intLimite) {
    switch (elemento) {
      case 'desde':
        if (this.formulario.value.desde != null)
          return this.appService.validarLongitud(intLimite, this.formulario.value.desde);
      case 'hasta':
        if (!this.formulario.value.desde) {
          document.getElementById('idDesde').focus();
          this.toastr.error("El campo Desde es requerido");
        } else {
          this.validarMayor();
        }
      default:
        break;
    }
  }
  //Valida que el campo Hasta sea mayor al campo Desde
  private validarMayor() {
    if (this.formulario.value.desde <= this.formulario.value.hasta && this.formulario.value.hasta != null) {
      return this.appService.validarLongitud(8, this.formulario.value.hasta);
    } else {
      this.formulario.get('desde').setValue(null);
      this.formulario.get('hasta').setValue(null);
      document.getElementById('idDesde').focus();
      this.toastr.error("El campo Hasta debe ser Mayor que el campo Desde");
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.formulario.get('puntoVenta').setValue(elemento.talonarioReciboLote.puntoVenta);
    this.formulario.get('letra').setValue(elemento.talonarioReciboLote.letra);
    this.formulario.get('cobrador').setValue(elemento.cobrador);
    this.formulario.get('talonarioReciboLote').setValue(elemento.talonarioReciboLote);

  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.formulario.get('puntoVenta').setValue(elemento.talonarioReciboLote.puntoVenta);
    this.formulario.get('letra').setValue(elemento.talonarioReciboLote.letra);
    this.formulario.get('cobrador').setValue(elemento.cobrador);
    this.formulario.get('talonarioReciboLote').setValue(elemento.talonarioReciboLote);
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        empresa: elemento.talonarioReciboLote.empresa.razonSocial,
        cobrador: elemento.cobrador.nombre,
        tal_rec_lote: 'Desde: ' + elemento.talonarioReciboLote.desde + 'Hasta: ' + elemento.talonarioReciboLote.hasta,
        p_venta: elemento.talonarioReciboLote.puntoVenta,
        letra: elemento.talonarioReciboLote.letra,
        desde: elemento.desde,
        hasta: elemento.hasta
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Talonarios Recibos Cobradores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}