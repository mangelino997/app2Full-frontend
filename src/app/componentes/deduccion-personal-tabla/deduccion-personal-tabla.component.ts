import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { MesService } from 'src/app/servicios/mes.service';
import { AfipDeduccionPersonalTabla } from 'src/app/modelos/afipDeduccionPersonalTabla';
import { AfipTipoBeneficioDeduccionService } from 'src/app/servicios/afip-tipo-beneficio-deduccion.service';
import { LoaderState } from 'src/app/modelos/loader';
import { AfipTipoBeneficioService } from 'src/app/servicios/afip-tipo-beneficio.service';
import { AfipDeduccionPersonalService } from 'src/app/servicios/afip-deduccion-personal.service';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ConfirmarDialogoComponent } from '../confirmar-dialogo/confirmar-dialogo.component';

@Component({
  selector: 'app-deduccion-personal-tabla',
  templateUrl: './deduccion-personal-tabla.component.html',
  styleUrls: ['./deduccion-personal-tabla.component.css']
})
export class DeduccionPersonalTablaComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define el indice del registro seleccionado en la tabla
  public idMod: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define una de las condiciones para el boton de la pestaña (cuando "importe"/"deduccionGeneral" no es nulos)
  public condicion: boolean = false;
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
  //Define los formControl
  public anio: FormControl = new FormControl();
  public tipoBeneficio: FormControl = new FormControl();
  //Define las columnas del reporte en LISTAR
  public columnasElejidas: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultadosPorFiltro: Array<any> = [];
  //Define la lista para años
  public anios: Array<any> = [];
  //Define la lista para tipos de beneficios
  public tiposBeneficios: Array<any> = [];
  //Define la lista para
  public deduccionesPersonales: Array<any> = [];
  //Define la lista para meses
  public meses: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ANIO', 'TIPO_BENEFICIO', 'DEDUCCION_PERSONAL', 'IMPORTE_ACUMULADO', 'TIPO_IMPORTE', 'MES', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private appService: AppService, private subopcionPestaniaService: SubopcionPestaniaService, private fechaService: FechaService,
    private toastr: ToastrService, private loaderService: LoaderService, private servicio: AfipTipoBeneficioDeduccionService,
    private modelo: AfipDeduccionPersonalTabla, private mesService: MesService, private afipTipoBenecioService: AfipTipoBeneficioService,
    private afipDeduccionPersonalService: AfipDeduccionPersonalService, public dialog: MatDialog, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestanias
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
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Define el formulario para el metodo buscar (filtro)
    // this.formulario
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de Años Fiscales
    this.listarAnios();
    //Obtiene la lista de Tipos de Beneficios
    this.listarTipoBeneficios();
    //Obtiene la lista de Deducciones Personales
    this.listarDeduccionPersonales();
    //Obtiene la lista de Meses
    this.listarMeses();
    //Inicializa el importeAnualMensual
    this.formulario.get('importeAnualMensual').setValue(false);
  }
  //carga la lista de Años Fiscales
  private listarAnios() {
    this.fechaService.listarAnioFiscal().subscribe(
      res => {
        this.anios = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de año fiscal");
      }
    )
  }
  //carga la lista de Tipos de Beneficios
  private listarTipoBeneficios() {
    this.afipTipoBenecioService.listar().subscribe(
      res => {
        this.tiposBeneficios = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de tipo de beneficios");
      }
    )
  }
  //carga la lista de Deducciones Personales
  private listarDeduccionPersonales() {
    this.afipDeduccionPersonalService.listar().subscribe(
      res => {
        this.deduccionesPersonales = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de deducciones personales");
      }
    )
  }
  //carga la lista de meses en pestaña listar
  private listarMeses() {
    this.mesService.listar().subscribe(
      res => {
        this.meses = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de meses");
      }
    )
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
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    switch (id) {
      case 1:
        this.formulario.enable();
        this.establecerValoresPestania(nombre, false, false, true, 'idAnioFiscal');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAnio');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAnioFiscal');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, false, 'idAnioFiscal');
        break;
      case 5:
        this.establecerValoresPestania(nombre, false, false, false, 'idAnio');
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
        break;
      default:
        break;
    }
  }
  //Metodo Agregar 
  public agregar() {
    this.loaderService.show();
    let anio = this.formulario.value.anio;
    let afipTipoBeneficio = this.formulario.value.afipTipoBeneficio;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario();
        this.establecerValoresCampos(anio, afipTipoBeneficio);
        this.toastr.success(respuesta.mensaje);
        this.listar();
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  public actualizar() {
    this.loaderService.show();
    this.formulario.get('anio').enable();
    this.formulario.get('afipTipoBeneficio').enable();
    this.formulario.get('afipDeduccionPersonal').enable();
    let anio = this.formulario.value.anio;
    let afipTipoBeneficio = this.formulario.value.afipTipoBeneficio;
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          this.establecerValoresCampos(anio, afipTipoBeneficio);
          this.listar();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Carga la Lista Completa - Tabla
  public listar() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    if (this.indiceSeleccionado == 1) {
      this.servicio.listar().subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
    } else {
      this.servicio.listarPorAnioYTipoBeneficio(this.anio.value, this.tipoBeneficio.value.id).subscribe(
        res => {
          let respuesta = res.json();
          if (respuesta.length == 0) {
            this.toastr.error("Sin datos para ésta consulta");
          }
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
    }
  }
  //Establece valores luego de Agregar y Actualizar
  private establecerValoresCampos(anio, afipTipoBeneficio) {
    this.formulario.get('anio').setValue(anio);
    this.formulario.get('afipTipoBeneficio').setValue(afipTipoBeneficio);
    this.anio.setValue(anio);
    this.tipoBeneficio.setValue(afipTipoBeneficio);
    document.getElementById('idAnioFiscal').focus();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11002) {
      document.getElementById("labelAnioFiscal").classList.add('label-error');
      document.getElementById("idAnioFiscal").classList.add('is-invalid');
      document.getElementById("idAnioFiscal").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario() {
    this.formulario.reset();
    this.idMod = null;
    this.resultados = [];
    this.anio.reset();
    this.tipoBeneficio.reset();
    this.listaCompleta = new MatTableDataSource([]);
    this.formulario.get('anio').enable();
    this.formulario.get('afipTipoBeneficio').enable();
    this.indiceSeleccionado == 3 ? this.formulario.get('afipDeduccionPersonal').disable() : this.formulario.get('afipDeduccionPersonal').enable();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.idMod = elemento.id;
    this.formulario.patchValue(elemento);
    this.formulario.get('anio').disable();
    this.formulario.get('afipTipoBeneficio').disable();
    this.establecerDecimales(this.formulario.get('importe'), 2);
  }
  //elimina el registro seleccionado
  public eliminar(id) {
    const dialogRef = this.dialog.open(ConfirmarDialogoComponent, {
      width: '60%',
      data: {
        mensaje: "¿Está seguro de eliminar el registro?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loaderService.show();
        this.servicio.eliminar(id).subscribe(
          res => {
            let respuesta = res.json();
            this.listar();
            this.toastr.success(respuesta.mensaje);
            this.loaderService.hide();
          },
          err => {
            let error = err.json();
            this.toastr.error(error.mensaje);
            this.loaderService.hide();
          }
        );
      }
    });
  }
  //Controla el cambio de seleccion
  public cambioTipoImporte() {
    this.formulario.get('mes').reset();
    this.formulario.value.importeAnualMensual ? this.formulario.get('mes').enable() : this.formulario.get('mes').disable();
  }
  //Controla el cambio de seleccion
  public cambioAnio(elemento) {
    if (elemento != undefined) {
      this.anio.setValue(elemento);
    }
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Controla el cambio de seleccion
  public cambioTipoBeneficio() {
    let elemento = this.formulario.get('afipTipoBeneficio').value;
    this.listaCompleta = new MatTableDataSource([]);
    this.tipoBeneficio.setValue(elemento);
  }
  //Limpia los campos en la pestaña Actualizar
  public cancelar() {
    if (this.indiceSeleccionado == 3) {
      let anio = this.formulario.value.anio;
      let tipoBeneficio = this.formulario.value.afipTipoBeneficio
      this.formulario.reset();
      this.formulario.get('anio').enable();
      this.formulario.get('anio').setValue(anio);
      this.formulario.get('afipTipoBeneficio').enable();
      this.formulario.get('afipTipoBeneficio').setValue(tipoBeneficio);
    } else {
      this.formulario.reset();
      this.formulario.enable();
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
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
      return elemento.descripcion ? elemento.descripcion : elemento;
    } else {
      return elemento;
    }
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Mascara enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
      this.condicion = true;
    } else {
      this.condicion = false;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Abre ventana Dialog 
  public verModaAnual(elemento): void {
    const dialogRef = this.dialog.open(ImporteAnualDialogo, {
      width: '750px',
      data: {
        elemento: elemento
      },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.establecerDecimales(valor, cantidad);
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        anio: elemento.anio,
        tipo_beneficio: elemento.afipTipoBeneficio.descripcion,
        deduccion_personal: elemento.afipDeduccionPersonal.descripcion,
        importe_acumulado: '$' + this.returnDecimales(elemento.importe, 2),
        tipo_importe: elemento.mes ? 'Mensual' : 'Anual',
        mes: elemento.mes ? elemento.mes.nombre : '-'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Deducciones Personales',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
//Componente ventana modal/dialog
@Component({
  selector: 'importe-anual-dialog',
  templateUrl: 'importe-anual-dialog.html',
})
export class ImporteAnualDialogo {
  //Define el elemento que se pasa por paramentro
  public elemento: FormControl = new FormControl();
  //Lista de meses con sus importes
  public lista: Array<any> = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['mes', 'importeMensual'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ImporteAnualDialogo>, @Inject(MAT_DIALOG_DATA) public data, private mesService: MesService,
    private toastr: ToastrService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.elemento.setValue(this.data.elemento);
    this.listarMeses();
  }
  //Obtiene la lista de meses y le añade el importe
  private listarMeses() {
    this.mesService.listar().subscribe(
      res => {
        let respuesta = res.json();
        this.calcularImporteMensual(respuesta);
      },
      err => {
        this.toastr.error("Error al obtener la lista de meses");
      }
    )

  }
  //Calcula el importe mensual
  private calcularImporteMensual(listaMeses) {
    let importeAcumulado = this.elemento.value.importe;
    listaMeses.forEach(item => {
      let importeMensual = (importeAcumulado / 12) * item.id;
      let fila = { mes: item.nombre, importeMensual: importeMensual };
      this.lista.push(fila);
    });
    this.listaCompleta = new MatTableDataSource(this.lista);
    this.listaCompleta.sort = this.sort;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
}