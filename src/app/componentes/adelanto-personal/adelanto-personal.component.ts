import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';
import { PersonalService } from 'src/app/servicios/personal.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ObservacionDialogComponent } from '../observacion-dialog/observacion-dialog.component';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-adelanto-personal',
  templateUrl: './adelanto-personal.component.html',
  styleUrls: ['./adelanto-personal.component.css']
})
export class AdelantoPersonalComponent implements OnInit {
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
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si habilita el boton de abrir modal prestamo
  public btnPrestamoModal: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define la lista de prestamos
  public listaPrestamos: Array<any> = [];
  //Define un formulario para validaciones de campos de la primera Pestaña
  public formulario: FormGroup;
  //Define un formulario de solo lectura para mostrar datos del personal seleccionado.
  public formularioDatosPersonal: FormGroup;
  //Define un formulario para validaciones de campos para buscar por filtros
  public formularioFiltro: FormGroup;
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define las columnas elegidas en Listar
  public columnasElejidas: FormControl = new FormControl();
  //Define las columnas a mostrar en el reporte
  public columnasMostradas: FormControl = new FormControl();
  public adelanto: FormControl = new FormControl();
  public personal: FormControl = new FormControl();
  public estado: FormControl = new FormControl();
  public alias: FormControl = new FormControl();
  //Define el numero del lote como un formControl
  public lote: FormControl = new FormControl();
  //Define la fecha actual
  public FECHA_ACTUAL: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define las columnas de la tabla
  public columnas: string[] = ['SUCURSAL', 'TIPO_CPTE', 'NUM_ADELANTO', 'ANULADO', 'FECHA_EMISION', 'FECHA_VTO', 'PERSONAL',
    'IMPORTE', 'OBSERVACIONES', 'USUARIO', 'CUOTA', 'TOTAL_CUOTAS', 'NUMERO_LOTE', 'ANULAR', 'EDITAR'];
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render: boolean = false;
  //Constructor
  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: PersonalAdelanto, private servicio: PersonalAdelantoService, public dialog: MatDialog,
    private personalService: PersonalService, private basicoCategoriaService: BasicoCategoriaService, private fechaService: FechaService,
    private sucursalService: SucursalService, private reporteServicio: ReporteService) {
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
    //Autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalService.listarActivosPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }
    });
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.modelo.formulario;
    //Define los campos para los datos del personal elegido
    this.formularioDatosPersonal = new FormGroup({
      legajo: new FormControl(),
      apellido: new FormControl(),
      nombre: new FormControl(),
      saldoActual: new FormControl(),
      categoria: new FormControl(),
      basicoCategoria: new FormControl(),
      topeAdelanto: new FormControl(),
      importeDisponible: new FormControl(),
    });
    //Define los campos para las validaciones del segundo formulario
    this.formularioFiltro = new FormGroup({
      sucursal: new FormControl('', Validators.required),
      fechaEmisionDesde: new FormControl('', Validators.required),
      fechaEmisionHasta: new FormControl('', Validators.required),
      adelanto: new FormControl('', Validators.required),
      personal: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      alias: new FormControl(),
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de Sucursal Emision
    this.listarSucursalesEmision();
    //Alias - Buscar por alias, empresa y sucursal
    let empresa = this.appService.getEmpresa();
    let usuario = this.appService.getUsuario();
    this.formularioFiltro.get('alias').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalService.listarActivosPorAliasEmpresaYSucursal(data, empresa.id, usuario.sucursal.id).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Carga la lista de Sucursales de Emision
  private listarSucursalesEmision() {
    this.sucursalService.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
      }
    )
  }
  //Obtiene la fecha actual
  private obtenerFechaActual() {
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.FECHA_ACTUAL.setValue(res.json());
        this.formulario.get('fechaEmision').setValue(res.json());
        this.formularioFiltro.get('fechaEmisionDesde').setValue(res.json());
        this.formularioFiltro.get('fechaEmisionHasta').setValue(res.json());
      },
      err => {
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
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 2:
        this.establecerValoresPestania(nombre, false, true, false, 'idSucursal');
        break;
      case 3:
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 4:
        this.establecerValoresPestania(nombre, false, true, true, 'idSucursal');
        break;
      case 5:
        this.establecerValoresPestania(nombre, false, true, true, 'idSucursal');
        break
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

  //Carga la tabla con los registros
  public listarPorFiltros() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta.paginator = this.paginator;
    let alias = this.formularioFiltro.get('alias').value;
    alias != undefined || alias != null ? alias = alias.alias : alias = "";
    //Genero el objeto
    let obj = {
      idEmpresa: this.appService.getEmpresa().id,
      idSucursal: this.appService.getUsuario().sucursal.id,
      fechaDesde: this.formularioFiltro.get('fechaEmisionDesde').value,
      fechaHasta: this.formularioFiltro.get('fechaEmisionHasta').value,
      adelanto: this.formularioFiltro.get('adelanto').value,
      alias: alias,
      estado: this.formularioFiltro.get('estado').value
    }
    //Consulta por filtro
    this.servicio.listarPorFiltros(obj).subscribe(
      res => {
        if(res.json().length > 0){
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
        }else{
          this.listaCompleta = new MatTableDataSource([]);
          this.toastr.warning("Sin registros para mostrar.");
        }
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.message);
        this.loaderService.hide()
      }
    )
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    let usuarioAlta = this.appService.getUsuario();
    if (this.btnPrestamoModal) {
      this.servicio.agregarPrestamo(this.listaPrestamos).subscribe(
        res => {
          let respuesta = res.json();
          if (res.status == 201) {
            this.reestablecerFormulario(respuesta.id);
            this.toastr.success("Registro agregado con éxito.");
            document.getElementById("idAutocompletado").focus();
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.formulario.get('usuarioAlta').setValue(usuarioAlta);
      this.servicio.agregar(this.formulario.value).subscribe(
        res => {
          let respuesta = res.json();
          this.reestablecerFormulario(respuesta.id);
          this.toastr.success("Registro agregado con éxito.");
          document.getElementById("idAutocompletado").focus();
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        this.idMod = null;
        this.lote.reset();
        this.formulario.reset();
        this.toastr.success("Registro actualizado con éxito.");
        this.listarPorFiltros();
        document.getElementById("idAutocompletado").focus();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.formulario.get('usuarioBaja').setValue(this.appService.getUsuario());
    this.servicio.anular(this.formulario.value).subscribe(
      res => {
        this.idMod = null;
        this.lote.reset();
        this.formulario.reset();
        this.toastr.success("Registro anulado con éxito.");
        this.listarPorFiltros();
        document.getElementById("idAutocompletado").focus();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.formularioDatosPersonal.reset();
    if (elemento.recibeAdelanto) {
      this.formulario.get('personal').setValue(elemento);
      this.formulario.get('totalCuotas').setValue(elemento.cuotasPrestamo);
      this.formularioDatosPersonal.get('categoria').setValue(elemento.categoria.nombre);
      this.formularioDatosPersonal.get('nombre').setValue(elemento.nombre);
      this.formularioDatosPersonal.get('apellido').setValue(elemento.apellido);
      this.formularioDatosPersonal.get('legajo').setValue(elemento.id);
      this.obtenerBasicoCategoria(elemento.categoria.id);
      let recibePrestamo = elemento.recibePrestamo;
      this.btnPrestamoModal = null;
      this.listaPrestamos = [];
      if (recibePrestamo) {
        this.formulario.get('importe').disable();
        this.btnPrestamoModal = true;
      } else {
        this.formulario.get('importe').enable();
        this.btnPrestamoModal = false;
        this.toastr.warning("El personal no está habilitado para recibir préstamos.");
      }
    } else {
      this.autocompletado.reset();
      this.toastr.warning("El usuario seleccionado no recibe adelanto de sueldo.");
      document.getElementById('idAutocompletado').focus();
    }
  }
  //Obtiene el valor de basico categoria
  private obtenerBasicoCategoria(idCategoria) {
    this.basicoCategoriaService.obtenerPorCategoria(idCategoria).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta) {
          this.formularioDatosPersonal.get('basicoCategoria').setValue(this.appService.establecerDecimales(respuesta.basico, 2));
          this.calcularImporteDisponible();
        }
      },
      err => {
        let error = err.json();
        this.toastr.error(error);
      }
    )
  }
  //Calcula el importe disponible
  private calcularImporteDisponible() {
    let elemento = this.formulario.value.personal;
    let topeBasicoAdelanto = elemento.categoria.topeBasicoAdelantos;
    let basico = this.formularioDatosPersonal.value.basicoCategoria;
    let importeDisponible = (topeBasicoAdelanto / 100) * basico;
    this.formularioDatosPersonal.get('importeDisponible').setValue(this.appService.establecerDecimales(importeDisponible, 2));
    this.formularioDatosPersonal.get('topeAdelanto').setValue(this.appService.establecerDecimales(topeBasicoAdelanto, 2));
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    //Reestablece los formularios
    this.formulario.reset();
    this.formularioFiltro.reset();
    this.formularioDatosPersonal.reset();
    //Reestablece campos
    this.lote.reset();
    this.autocompletado.reset();
    //Reestablece variables
    this.idMod = null;
    this.btnPrestamoModal = null;
    //Vacía las listas
    this.resultados = [];
    this.listaPrestamos = [];
    this.listaCompleta = new MatTableDataSource([]);
    //Setea valores por defecto
    let usuario = this.appService.getUsuario();
    let empresa = this.appService.getEmpresa();
    let sucursal = usuario.sucursal;
    this.obtenerFechaActual();
    this.formulario.get('sucursal').setValue(sucursal);
    this.formulario.get('empresa').setValue(empresa);
    if (this.indiceSeleccionado == 1) {
      this.formulario.get('observacionesAnulado').setValidators([]);
      this.formulario.get('fechaVto').setValidators([]);
      this.formulario.get('observacionesAnulado').updateValueAndValidity();//Actualiza la validacion
    }
    if (this.indiceSeleccionado == 3) {
      this.formulario.get('observacionesAnulado').setValidators([]);
      this.formulario.get('fechaVto').setValidators(Validators.required);
      this.formulario.get('observacionesAnulado').updateValueAndValidity();//Actualiza la validacion
    }
    if (this.indiceSeleccionado == 4) {
      this.formulario.get('observacionesAnulado').setValidators(Validators.required);
      this.formulario.get('fechaVto').setValidators([]);
      this.formulario.get('observacionesAnulado').updateValueAndValidity();//Actualiza la validacion
    }
  }
  //Controla el campo importe
  public controlarImporte() {
    let importeDisponible = Number(this.formularioDatosPersonal.value.importeDisponible);
    let importe = this.formulario.value.importe;
    importe != null || importe != undefined ? this.formulario.get('importe').setValue(this.appService.establecerDecimales(importe, 2)) :
      this.formulario.get('importe').setValue(this.appService.establecerDecimales('0.00', 2));
    importe = Number(this.appService.establecerDecimales(importe, 2));
    this.controlarImporteSuperior(importe, importeDisponible);
  }
  //Si recibePrestamo == false, controla que el "Importe" no supere al campo “Importe Disponible”  
  private controlarImporteSuperior(importe, importeDisponible) {
    if (importe > importeDisponible) {
      this.formulario.get('importe').reset();
      this.toastr.error("El valor no puede ser superior al campo 'Importe Disponible'.");
      document.getElementById('idImporte').focus();
    } else {
      this.formulario.get('importe').setValue(this.appService.establecerDecimales(importe, 2));
    }
  }
  //Controla el cambio en el campo "Fecha Emision Desde"
  public controlarFechaEmisionDesde() {
    let fechaEmisionDesde = this.formularioFiltro.get('fechaEmisionDesde').value;
    let fechaEmisionHasta = this.formularioFiltro.get('fechaEmisionHasta').value;
    if (fechaEmisionDesde > fechaEmisionHasta) {
      this.toastr.error("Fecha Emisión Desde debe ser igual o menor a la Fecha Emisión Hasta.");
      this.formularioFiltro.get('fechaEmisionDesde').setValue(null);
      document.getElementById('idFechaEmisionDesde').focus();
    }
  }
  //Controla el cambio en el campo "Fecha Emision Hasta"
  public controlarFechaEmisionHasta() {
    let fechaEmisionDesde = this.formularioFiltro.get('fechaEmisionDesde').value;
    let fechaEmisionHasta = this.formularioFiltro.get('fechaEmisionHasta').value;
    if (fechaEmisionDesde == null || fechaEmisionDesde == undefined) {
      this.toastr.error("Debe ingresar Fecha de Emisión Desde.");
      document.getElementById('idFechaEmision').focus();
    } else if (fechaEmisionHasta < fechaEmisionDesde) {
      this.toastr.error("Fecha Emision Hasta debe ser igual o mayor a Fecha de Emisión Desde.");
      this.formulario.get('idFechaEmisionDesde').setValue(null);
      this.formulario.get('idFechaEmisionHasta').setValue(this.FECHA_ACTUAL.value);
      document.getElementById('idFechaEmisionDesde').focus();
    }
  }
  //Controla el cambio en el select "Personal"
  public cambioPersonal() {
    let opcion = this.formularioFiltro.get('personal').value;
    if (opcion) {
      this.formularioFiltro.get('alias').enable();
      this.formularioFiltro.get('alias').setValidators(Validators.required);
      this.formularioFiltro.get('alias').updateValueAndValidity();//Actualiza la validacion
    } else {
      this.formularioFiltro.get('alias').disable();
      this.formularioFiltro.get('alias').setValidators([]);
      this.formularioFiltro.get('alias').updateValueAndValidity();//Actualiza la validacion
      this.formularioFiltro.get('alias').setValue(null);
    }
  }
  //Abre un dialogo para ver las observaciones
  public verObservacionesDialogo(elemento): void {
    const dialogRef = this.dialog.open(ObservacionDialogComponent, {
      width: '95%',
      maxWidth: '95%',
      data: {
        tema: this.appService.getTema(),
        elemento: elemento,
        soloLectura: true
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Anula un registro de la tabla
  public activarAnular(elemento, indice) {
    this.formulario.patchValue(elemento);
    this.formulario.value.importe = elemento.importe;
    this.lote.setValue(elemento.numeroLote);
    this.idMod = indice;
    document.getElementById('idObservaciones').focus();
  }
  //Actualiza un registro de la tabla
  public activarActualizar(elemento, indice) {
    this.formulario.patchValue(elemento);
    this.idMod = indice;
  }
  //Abre un modal al consultar un registro de la tabla
  public activarConsultar(elemento) {
    const dialogRef = this.dialog.open(DetalleAdelantoDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        personalAdelanto: elemento
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listaPrestamos = result;
    });
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar() {
    this.formulario.reset();
    this.lote.reset();
    this.idMod = null;
  }
  //Abre modal de prestamos
  public abrirPrestamoModal() {
    const dialogRef = this.dialog.open(PrestamoDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        personalAdelanto: this.formulario.value,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listaPrestamos = result.listaCompleta;
        this.formulario.get("importe").setValue(result.importe);
      } else {
        this.listaPrestamos = [];
        this.formulario.get("importe").reset();
      }
    });
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
  //Mascara un porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
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
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
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
        sucursal: elemento.sucursal.nombre,
        tipo_cpte: elemento.tipoComprobante.nombre,
        num_adelanto: elemento.id,
        anulado: elemento.estaAnulado ? 'Sí' : 'No',
        fecha_emision: elemento.fechaEmision,
        fecha_vto: elemento.fechaVto,
        personal: elemento.personal.nombreCompleto,
        importe: '$' + this.returnDecimales(elemento.importe, 2),
        observaciones: elemento.observaciones,
        usuario: elemento.usuarioAlta.alias,
        cuota: elemento.cuota,
        total_cuotas: elemento.totalCuotas,
        numero_lote: elemento.numeroLote
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Adelantos Sueldos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}

//Componente 
@Component({
  selector: 'prestamo-dialogo',
  templateUrl: 'prestamo-dialogo.html',
  styleUrls: ['./adelanto-personal.component.css']
})
export class PrestamoDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define a personal adelanto como un formControl
  public personalAdelanto: FormControl = new FormControl();
  //Define el total del prestamo como un formControl
  public totalPrestamo: FormControl = new FormControl();
  //Define la cantidad de cuotas como un formControl
  public totalCuotas: FormControl = new FormControl();
  //Define la Diferencia como un formControl
  public diferencia: FormControl = new FormControl();
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define si habilita el boton Actualizar y Cancelar
  public btnMostrar: boolean = null;
  //Define si habilita el boton Aceptar
  public btnAceptar: boolean = null;
  //Define el campo N° de Cuota como FormControl
  public numeroCuota: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['numeroCuota', 'fechaVencimiento', 'importe', 'mod'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Se subscribe al loader
  subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<PrestamoDialogo>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService,
    private servicio: PersonalAdelantoService, private toastr: ToastrService, private loaderService: LoaderService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      cuota: new FormControl('', Validators.required),
      fechaVto: new FormControl('', Validators.required),
      importe: new FormControl('', Validators.required)
    });
    //Reestablece el formulario
    this.reestablecerFormulario();
  }
  //Reestablece los campos del formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.totalPrestamo.reset();
    this.totalCuotas.reset();
    this.diferencia.reset();
    this.personalAdelanto.setValue(this.data.personalAdelanto);
    this.totalCuotas.setValue(this.personalAdelanto.value.personal.cuotasPrestamo);
  }
  //Realiza la accion confirmar - Obtiene un listado de cuotas
  public confirmar() {
    this.loaderService.show();
    let totalPrestamo = Number(this.appService.establecerDecimales(this.totalPrestamo.value, 2));
    this.personalAdelanto.value.importe = totalPrestamo;
    this.servicio.listarCuotas(this.personalAdelanto.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.establecerTotalPrestamoACuotas();
        this.diferencia.setValue(this.appService.establecerDecimales('0.00', 2));
        this.btnAceptar = true;
        this.establecerUsuarioAlta();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error);
        this.loaderService.hide();
      }
    )
  }
  //Establece a cada registro, de la lista de cuotas, el prestamo total 
  private establecerTotalPrestamoACuotas() {
    let totalPrestamo = this.personalAdelanto.value.importe
    this.listaCompleta.data.forEach(
      item => {
        item.importeTotal = totalPrestamo;
      }
    );
  }
  //Actualiza un registro de la tabla
  public actualizar() {
    this.listaCompleta.data[this.idMod].importe = this.formulario.value.importe;
    this.listaCompleta.data[this.idMod].fechaVto = this.formulario.value.fechaVto;
    this.listaCompleta.sort = this.sort;
    this.calcularDiferenciaImporte();
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
    this.btnMostrar = false;
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar() {
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
    this.btnMostrar = false;
  }
  //Completa los campos del formulario con los datos del registro a modificar
  public activarActualizar(elemento, indice) {
    this.formulario.patchValue(elemento);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.numeroCuota.setValue(elemento.cuota);
    this.idMod = indice;
    this.btnMostrar = true;
  }
  //Setea a cada registro (a cada prestamo) el usuario alta
  private establecerUsuarioAlta() {
    let usuarioAlta = this.appService.getUsuario();
    this.listaCompleta.data.forEach(
      item => {
        item.usuarioAlta = usuarioAlta;
      }
    )
  }
  //Calcula la diferencia entre el prestamo y la suma de los importes de las cuotas
  private calcularDiferenciaImporte() {
    let diferencia = 0;
    this.servicio.obtenerDiferenciaImportes(this.listaCompleta.data).subscribe(
      res => {
        diferencia = res.json();
        if (diferencia == 0) {
          this.btnAceptar = true;
          this.diferencia.setValue(this.appService.establecerDecimales('0.00', 2));
        } else {
          this.btnAceptar = false;
          this.diferencia.setValue(this.appService.establecerDecimales(diferencia.toString(), 2));
          this.toastr.error("El Total Préstamo no coincide con la suma de los importes.");
        }
      }
    );
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
  closeDialog(opcion) {
    let obj = {
      listaCompleta: this.listaCompleta.data,
      importe: this.totalPrestamo.value
    }
    if (opcion == 'aceptar') {
      if (this.btnAceptar)
        this.dialogRef.close(obj);
      else
        this.toastr.warning("Campo Diferencia debe ser cero.");
    }
    if (opcion == 'cancelar') {
      this.dialogRef.close();
    }
  }

}

//Componente 
@Component({
  selector: 'detalle-adelanto-dialogo',
  templateUrl: 'detalle-adelanto-dialogo.html',
})
export class DetalleAdelantoDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define el Viaje como un formControl
  public viaje: FormControl = new FormControl();
  //Define el Reparto como un formControl
  public reparto: FormControl = new FormControl();
  //Define la Fecha Liquidacion como un formControl
  public fechaLiquidacion: FormControl = new FormControl();
  //Define la N° Liquidacion como un formControl
  public numeroLiquidacion: FormControl = new FormControl();
  //Define el usuario anulacion como un formControl
  public usuarioAnulacion: FormControl = new FormControl();
  //Define el observacion anulado como un formControl
  public observacionAnulado: FormControl = new FormControl();
  //Define el usuario mod de cuotas como un formControl
  public usuarioMod: FormControl = new FormControl();
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetalleAdelantoDialogo>, @Inject(MAT_DIALOG_DATA) public data, private appService: AppService,
    private loaderService: LoaderService, private modelo: PersonalAdelanto) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el formulario y sus validaciones
    this.formulario = new FormGroup({
      viaje: new FormControl(),
      reparto: new FormControl(),
      fechaLiquidacion: new FormControl(),
      numeroLiquidacion: new FormControl(),
      observacionesAnulado: new FormControl(),
      usuarioBaja: new FormControl(),
      usuarioMod: new FormControl()
    });
    //Reestablece el formulario
    this.reestablecerFormulario();
  }
  //Reestablece los campos del formulario
  private reestablecerFormulario() {
    let elemento = this.data.personalAdelanto;
    this.formulario.reset();
    this.formulario.patchValue(elemento);
    if (elemento.usuarioBaja)
      this.formulario.get('usuarioBaja').setValue(elemento.usuarioBaja.nombre);
    if (elemento.usuarioMod)
      this.formulario.get('usuarioMod').setValue(elemento.usuarioMod.nombre);
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
  closeDialog() {
    this.dialogRef.close(null);
  }
}