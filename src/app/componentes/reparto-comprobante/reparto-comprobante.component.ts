import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { Subscription } from 'rxjs';
import { MatSort, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { RepartoComprobante } from 'src/app/modelos/repartoComprobante';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderState } from 'src/app/modelos/loader';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ToastrService } from 'ngx-toastr';
import { RepartoComprobanteService } from 'src/app/servicios/reparto-comprobante.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { SeguimientoEstadoService } from 'src/app/servicios/seguimiento-estado.service';
import { SeguimientoEstadoSituacionService } from 'src/app/servicios/seguimiento-estado-situacion.service';
import { SeguimientoVentaComprobante } from 'src/app/modelos/seguimientoVentaComprobante';
import { SeguimientoViajeRemito } from 'src/app/modelos/seguimientoViajeRemito';
import { SeguimientoOrdenRecoleccion } from 'src/app/modelos/seguimientoOrdenRecoleccion';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';

@Component({
  selector: 'app-reparto-comprobante',
  templateUrl: './reparto-comprobante.component.html',
  styleUrls: ['./reparto-comprobante.component.css']
})
export class RepartoComprobanteComponent implements OnInit {
  //Define el formulario para Comprobante
  public formulario: FormGroup;
  //Define el formulario para Comprobante
  public formularioComprobante: FormGroup;
  //Define el formulario de seguimiento (Seguimiento Venta Comprobante/Seguimiento Viaje Remito/Seguimiento Recoleccion )
  public formularioSeguimiento: FormGroup;
  //Define el array para tipos de comprobantes
  public tipoComprobantes: Array<any> = [];
  //Define el array para seguimiento estados
  public seguimientoEstados: Array<any> = [];
  //Define el array para situacion
  public situaciones: Array<any> = [];
  //Define si muestra el boton CERRAR 
  public btnCerrar: boolean = false;
  //Define la lista de tramos (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el comprobanteMod seleccionado de la tabla para modificar - Sólo en Reparto Entrante
  public comprobanteMod: any = null;
  //Define el id del reparto Cpte seleccionado de la tabla para modificar - Sólo en Reparto Entrante
  public idComprobanteMod: any = null;
  //Define la lista de tipos de Letras 
  public letras: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = [];
  //Define el campo solo lectura - Sólo en Reparto Entrante
  public soloLectura: boolean = true;
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  constructor(
    private modelo: RepartoComprobante, private tipoComprobanteService: TipoComprobanteService, private appService: AppService,
    private ordenRecoleccionService: OrdenRecoleccionService, private viajeRemitoService: ViajeRemitoService, private servicio: RepartoComprobanteService,
    private ventaComprobanteService: VentaComprobanteService, private loaderService: LoaderService, private toastr: ToastrService,
    private seguimientoEstadoService: SeguimientoEstadoService, private seguimientoEstadoSituacionService: SeguimientoEstadoSituacionService,
    private seguimientoVentaComprobante: SeguimientoVentaComprobante, private seguimientoViajeRemito: SeguimientoViajeRemito,
    private seguimientoOrdenRecoleccion: SeguimientoOrdenRecoleccion, private seguimientoVentaComprobanteService: SeguimientoVentaComprobanteService,
    private seguimientoViajeRemitoService: SeguimientoViajeRemitoService, private seguimientoOrdenRecoleccionService: SeguimientoOrdenRecoleccionService,
    private repartoService: RepartoService, public dialog: MatDialog, public dialogRef: MatDialogRef<RepartoComprobanteComponent>, @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario para el Reparto Saliente y validaciones
    let formularioParaRepSaliente = new FormGroup({
      tipoComprobante: new FormControl('', Validators.required),
      puntoVenta: new FormControl(),
      letra: new FormControl(),
      numero: new FormControl('', Validators.required),
    });
    //Define el formulario para el Reparto Entrante y validaciones
    let formularioParaRepEntrante = new FormGroup({
      estado: new FormControl('', Validators.required),
      situacion: new FormControl('', Validators.required),
      cobranzaContado: new FormControl(),
      importeContado: new FormControl(),
      cobranzaContrareembolso: new FormControl(),
      observaciones: new FormControl()
    });
    //Define el formulario Comprobante y validaciones
    this.formularioComprobante = this.modelo.formulario;
    //Define el formulario Seguimiento
    this.formularioSeguimiento = new FormGroup({});
    //Controla que operaciones se inicializan 
    if (this.data.esRepartoEntrante) {
      //Inicializa el Formulario
      this.formulario = formularioParaRepEntrante;
      //Establece las columnas de la tabla
      this.columnas = ['TIPOCPTE', 'EDITAR', 'ESTADO', 'PUNTOVENTA', 'LETRA', 'COMPROBANTE', 'DESTINATARIO', 'DOMICILIO', 'REMITENTE', 'CTACTE', 'CONTADO', 'BULTOS', 'CONTRAREEMBOLSO', 'KG'];
    } else {
      //Inicializa el Formulario
      this.formulario = formularioParaRepSaliente;
      //Establece las columnas de la tabla
      this.columnas = ['TIPOCPTE', 'PUNTOVENTA', 'LETRA', 'COMPROBANTE', 'DESTINATARIO', 'DOMICILIO', 'REMITENTE', 'CTACTE', 'CONTADO', 'BULTOS', 'CONTRAREEMBOLSO', 'KG', 'ELIMINAR'];
    }
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
  }

  //Carga la lista para tipo de comprobantes
  private listarTipoComprobantes() {
    this.tipoComprobanteService.listarActivosReparto().subscribe(
      res => {
        this.tipoComprobantes = res.json();
        this.formulario.get('tipoComprobante').setValue(this.tipoComprobantes[0]);
        this.cambioTipoComprobante();
      }
    )
  }
  //Carga la lista de seguimientos estados
  private listarSeguimientoEstado() {
    this.seguimientoEstadoService.listarParaRepartoEntrante().subscribe(
      res => {
        this.seguimientoEstados = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Controla el cambio en el campo "Estado" y obtiene la lista para el campo "Situación"
  public cambioEstado() {
    this.formulario.get('situacion').reset();
    this.seguimientoEstadoSituacionService.listarPorSeguimientoEstado(this.formulario.value.estado.id).subscribe(
      res => {
        this.situaciones = res.json();
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    )
  }
  //Habilita o Deshabilita campos de seleccion - Sólo para Reparto Entrante
  private establecerEstadoCampos() {
    if (this.comprobanteMod) {
      this.formulario.get('estado').enable();
      this.formulario.get('situacion').enable();
      this.listarSeguimientoEstado();
      if (this.comprobanteMod.ventaComprobante) {
        this.soloLectura = false;
        this.formulario.get('cobranzaContado').enable();
        this.formulario.get('observaciones').disable();
        this.comprobanteMod.ventaComprobante.ventaComprobanteItemCR.length > 0 ?
          this.formulario.get('cobranzaContrareembolso').enable() : this.formulario.get('cobranzaContrareembolso').disable();
        if (this.comprobanteMod.ventaComprobante.condicionVenta.esContado) {
          this.formulario.get('cobranzaContado').setValue(true);
          this.formulario.get('importeContado').setValue(this.appService.establecerDecimales(this.comprobanteMod.ventaComprobante.importeTotal, 2));
        } else {
          this.formulario.get('cobranzaContado').setValue(false);
          this.formulario.get('importeContado').setValue(this.appService.establecerDecimales('0.00', 2));
        }
      } else {
        this.soloLectura = true;
        this.formulario.get('observaciones').enable();
        this.formulario.get('cobranzaContado').disable();
        this.formulario.get('cobranzaContrareembolso').disable();
        this.comprobanteMod.viajeRemito ? this.formulario.get('observaciones').setValue(this.comprobanteMod.viajeRemito.observaciones) :
          this.formulario.get('observaciones').setValue(this.comprobanteMod.ordenRecoleccion.observaciones);
      }
    } else {
      this.formulario.get('estado').disable();
      this.formulario.get('situacion').disable();
      this.formulario.get('cobranzaContado').disable();
      this.formulario.get('cobranzaContrareembolso').disable();
    }

  }
  //Controla el cambio en el campo "Tipo de Comprobante"
  public cambioTipoComprobante() {
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    this.formulario.reset();
    this.formulario.enable();
    this.formulario.get('tipoComprobante').setValue(tipoComprobante);
    if (tipoComprobante.id == 1) {
      this.ventaComprobanteService.listarLetras().subscribe(
        res => {
          this.letras = res.json();
        },
        err => {
          this.toastr.error("Error al obtener la lista de Letras en Venta Comprobante.");
        }
      )
    } else if (tipoComprobante.id == 5) {
      this.viajeRemitoService.listarLetras().subscribe(
        res => {
          this.letras = res.json();
        },
        err => {
          this.toastr.error("Error al obtener la lista de Letras en Viaje Remito.");
        }
      )
    } else if (tipoComprobante.id == 13) {
      this.letras = [];
      this.formulario.get('puntoVenta').disable();
      this.formulario.get('letra').disable();
    }
  }
  //Agrega un registro a la tabla
  public agregar() {
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    let numero = this.formulario.get('numero').value;
    if (tipoComprobante.id == 13) {
      this.ordenRecoleccionService.obtenerPorId(numero).subscribe(
        res => {
          this.formularioComprobante.get('ordenRecoleccion').setValue({ id: res.json().id });
          this.agregarComprobanteReparto(this.formularioComprobante.value);
        },
        err => {
          err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
        })
    } else if (tipoComprobante.id == 5) {
      this.viajeRemitoService.obtener(this.formulario.get('puntoVenta').value, this.formulario.get('letra').value,
        this.formulario.get('numero').value).subscribe(
          res => {
            let respuesta = res.json();
            let viajeRemito = {
              letra: respuesta.letra,
              puntoVenta: respuesta.puntoVenta,
              numero: respuesta.numero
            }
            this.formularioComprobante.get('viajeRemito').setValue(viajeRemito);
            this.agregarComprobanteReparto(this.formularioComprobante.value);
          },
          err => {
            err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
          })
    } else if (tipoComprobante.id == 1) {
      this.ventaComprobanteService.obtener(this.formulario.get('puntoVenta').value, this.formulario.get('letra').value,
        this.formulario.get('numero').value, tipoComprobante.id).subscribe(
          res => {
            let respuesta = res.json();
            let ventaComprobante = {
              letra: respuesta.letra,
              puntoVenta: respuesta.puntoVenta,
              numero: respuesta.numero,
              tipoComprobante: respuesta.tipoComprobante
            }
            this.formularioComprobante.get('ventaComprobante').setValue(ventaComprobante);
            this.agregarComprobanteReparto(this.formularioComprobante.value);
          },
          err => {
            err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
          })
    }
  }
  //Agrega un Comprobante
  private agregarComprobanteReparto(formularioComprobante) {
    this.loaderService.show();
    formularioComprobante.reparto.repartoComprobantes.length > 0 ? formularioComprobante.reparto.repartoComprobantes = [] : '';
    this.servicio.agregar(formularioComprobante).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.establecerValoresPorDefecto();
          this.toastr.success("Reparto Comprobante: " + res.json().mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.letras = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formulario.reset();
    this.formularioComprobante.reset();
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto() {
    this.formularioComprobante.get('reparto').patchValue(this.data.elemento);
    this.btnCerrar = this.data.btnCerrar;
    this.listarPorReparto(this.data.elemento.id);
    if (this.data.esRepartoEntrante) {
      this.establecerEstadoCampos(); //Controla el estado de los campos de seleccion
      setTimeout(function () {
        document.getElementById('idEstado').focus();
      }, 20);
    } else {
      this.listarTipoComprobantes(); //Obtiene la lista de tipo de comprobantes
      this.formulario.get('tipoComprobante').setValue(this.tipoComprobantes[0]);
      setTimeout(function () {
        document.getElementById('idTipoComprobante').focus();
      }, 20);
    }
  }
  //Obtiene los registros, para mostrar en la tabla, por idReparto
  private listarPorReparto(idReparto) {
    this.repartoService.obtenerPorId(idReparto).subscribe(
      res => {
        let repartoComprobantes = res.json().repartoComprobantes;
        this.listaCompleta = new MatTableDataSource(repartoComprobantes);
        this.listaCompleta.sort = this.sort;
      },
      err => {
        this.toastr.error("Sin registros para mostrar.");
        this.loaderService.hide();
      }
    )
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite) {
    return this.appService.mascararImporte(intLimite, 2);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Imprime la suma de bultos VentaCpte de la lista VentaCpte ItemFAs 
  public sumaBultosVentaCpte(listaItemFAs) {
    let bultosTotal;
    listaItemFAs.array.forEach(elemento => {
      bultosTotal += Number(elemento.bultos);
    });
    return bultosTotal;
  }
  //Imprime la suma de kilos efectivos de la lista VentaCpte ItemFAs 
  public sumaKiloEfectivoVentaCpte(listaItemFAs) {
    let kiloEfectivoTotal;
    listaItemFAs.array.forEach(elemento => {
      kiloEfectivoTotal += elemento.kiloEfectivo;
    });
    return kiloEfectivoTotal;
  }
  //Abre el modal para confirmar eliminar comprobante de reparto
  public activarEliminarCpteReparto(elemento) {
    const dialogRef = this.dialog.open(EliminarRepartoCpteDialogo, {
      width: '45%',
      maxWidth: '45%',
      data: {
        elemento: elemento,
        btnCerrar: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.establecerValoresPorDefecto();
    });
  }
  //Actualiza un registro de la tabla
  public activarActualizar(elemento, indice) {
    this.formulario.reset();
    this.comprobanteMod = elemento;
    this.idComprobanteMod = indice;
    this.establecerEstadoCampos();
  }
  //Actualiza un registro - Sólo para Reparto Entrante
  public actualizar() {
    if (this.comprobanteMod.viajeRemito) {
      this.formularioSeguimiento = this.seguimientoViajeRemito.formulario;
      this.formularioSeguimiento.get('viajeRemito').setValue(this.comprobanteMod.viajeRemito);
      this.formularioSeguimiento.get('sucursal').setValue(this.appService.getUsuario().sucursal);
      this.formularioSeguimiento.get('seguimientoEstado').setValue(this.formulario.value.estado);
      this.formularioSeguimiento.get('seguimientoSituacion').setValue(this.formulario.value.situacion);
      this.formularioSeguimiento.value.viajeRemito.observaciones = this.formulario.value.observaciones;
      this.actualizarViajeRemito();
    } else if (this.comprobanteMod.ordenRecoleccion) {
      this.formularioSeguimiento = this.seguimientoOrdenRecoleccion.formulario;
      this.formularioSeguimiento.get('ordenRecoleccion').setValue(this.comprobanteMod.ordenRecoleccion);
      this.formularioSeguimiento.get('sucursal').setValue(this.appService.getUsuario().sucursal);
      this.formularioSeguimiento.get('seguimientoEstado').setValue(this.formulario.value.estado);
      this.formularioSeguimiento.get('seguimientoSituacion').setValue(this.formulario.value.situacion);
      this.formularioSeguimiento.value.ordenRecoleccion.observaciones = this.formulario.value.observaciones;
      this.actualizarSeguimientoOrdenRecoleccion();
    } else {
      this.formularioSeguimiento = this.seguimientoVentaComprobante.formulario;
      this.formularioSeguimiento.get('ventaComprobante').setValue(this.comprobanteMod.ventaComprobante);
      this.formularioSeguimiento.get('sucursal').setValue(this.appService.getUsuario().sucursal);
      this.formularioSeguimiento.get('seguimientoEstado').setValue(this.formulario.value.estado);
      this.formularioSeguimiento.get('seguimientoSituacion').setValue(this.formulario.value.situacion);
      this.actualizarSeguimientoVentaComprobante();
    }
  }
  //Actualiza un Seguimiento Venta Comprobante
  private actualizarSeguimientoVentaComprobante() {
    this.loaderService.show();
    this.formularioSeguimiento.value.ventaComprobante = {id: this.formularioSeguimiento.value.ventaComprobante.id};
    this.seguimientoVentaComprobanteService.agregar(this.formularioSeguimiento.value).subscribe(
      res => {
        if (res.status == 201) {
          this.toastr.success(res.json().mensaje);
          this.reestablecerFormularioSeguimiento();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    )
  }
  //Actualiza un Seguimiento Orden Recoleccion
  private actualizarSeguimientoOrdenRecoleccion() {
    this.loaderService.show();
    this.formularioSeguimiento.value.ordenRecoleccion = {id: this.formularioSeguimiento.value.ordenRecoleccion.id};
    this.seguimientoOrdenRecoleccionService.agregar(this.formularioSeguimiento.value).subscribe(
      res => {
        if (res.status == 201) {
          this.toastr.success(res.json().mensaje);
          this.reestablecerFormularioSeguimiento();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    )
  }
  //Actualiza un Seguimiento Viaje Remito
  private actualizarViajeRemito() {
    this.loaderService.show();
    this.formularioSeguimiento.value.viajeRemito = {id: this.formularioSeguimiento.value.viajeRemito.id};
    this.seguimientoViajeRemitoService.agregar(this.formularioSeguimiento.value).subscribe(
      res => {
        if (res.status == 201) {
          this.toastr.success(res.json().mensaje);
          this.reestablecerFormularioSeguimiento();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.lanzarError(error);
        this.loaderService.hide();
      }
    )
  }
  //Abre dialogo para conformar los comprobantes
  public abrirConformarComprobantes() {
    this.data.elemento.repartoComprobantes = this.listaCompleta.data; //Le reasigno la lista de repartoComprobantes al reparto para en el back 
    //controlar a cuales comprobantes (los no editados) se les realiza la operacion 
    const dialogRef = this.dialog.open(ConformarComprobantesDialogo, {
      width: '45%',
      maxWidth: '45%',
      data: {
        reparto: this.data.elemento
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.establecerValoresPorDefecto();
    });
  }
  //Lanza error desde el servidor 
  private lanzarError(err) {
    let respuesta = err;
    let campoVacio = "no puede estar vacío.";
    let campoInexistente = " no encontrado.";
    if (respuesta.codigo == 5008) {
      this.toastr.error("No contiene comprobante/s.");
    } else if (respuesta.codigo == 500) {
      this.toastr.error("Se produjo un error en el sistema.");
    } else if (respuesta.codigo == 5001) {
      this.toastr.error("Error al sincronizar.");
    } else if (respuesta.codigo == 16380) {
      this.toastr.error("Orden de Recolección " + campoVacio);
    } else if (respuesta.codigo == 16207) {
      this.toastr.error("Fecha " + campoVacio);
    } else if (respuesta.codigo == 16070) {
      this.toastr.error("Sucursal " + campoVacio);
    } else if (respuesta.codigo == 16062) {
      this.toastr.error("Estado del Seguimiento " + campoVacio);
    } else if (respuesta.codigo == 16092) {
      this.toastr.error("Comprobante de venta " + campoVacio);
    } else if (respuesta.codigo == 16096) {
      this.toastr.error("Remito " + campoVacio);
    } else if (respuesta.codigo == 13057) {
      this.toastr.error("Registro de Orden de Recolección " + campoInexistente);
    } else if (respuesta.codigo == 13096) {
      this.toastr.error("Registro de sucursal " + campoInexistente);
    } else if (respuesta.codigo == 13135) {
      this.toastr.error("Registro de comprobante de Venta " + campoInexistente);
    } else if (respuesta.codigo == 13140) {
      this.toastr.error("Registro de remito " + campoInexistente);
    } else if (respuesta.codigo == 13087) {
      this.toastr.error("Registro de estado del seguimiento " + campoInexistente);
    } else if (respuesta.codigo == 13088) {
      this.toastr.error("Registro de Situación del seguimiento " + campoInexistente);
    }
  }
  //Limpia los campos y reestablece el formulario de Seguimiento
  public reestablecerFormularioSeguimiento() {
    this.soloLectura = true;
    this.comprobanteMod = null;
    this.idComprobanteMod = null;
    this.formulario.reset();
    this.formularioSeguimiento.reset();
    this.establecerValoresPorDefecto();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.reset();
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
}

@Component({
  selector: 'eliminar-reparto-cpte-dialogo',
  templateUrl: 'eliminar-reparto-cpte-dialogo.html',
})
export class EliminarRepartoCpteDialogo {
  //Constructor
  constructor(public dialogRef: MatDialogRef<EliminarRepartoCpteDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private repartoCpteService: RepartoComprobanteService, private toastr: ToastrService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

  }
  public eliminarCpteReparto() {
    this.repartoCpteService.eliminar(this.data.elemento.id).subscribe(
      res => {
        if (res.status == 200) {
          this.toastr.success("Registro quitado exitosamente.");
          this.dialogRef.close();
        }
      },
      err => {
        if (err.status == 500) {
          this.toastr.error("Se produjo un erro en el sistema.");
          this.dialogRef.close();
        }
      }
    )
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'conformar-comprobantes-dialogo',
  templateUrl: 'conformar-comprobantes-dialogo.html',
})
export class ConformarComprobantesDialogo {
  //Constructor
  constructor(public dialogRef: MatDialogRef<ConformarComprobantesDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private repartoCpteService: RepartoComprobanteService, private toastr: ToastrService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

  }
  public conformarComprobantes() {
    this.repartoCpteService.conformarComprobantes(this.data.reparto).subscribe(
      res => {
        if (res.status == 200) {
          this.toastr.success("Registro/s Actualizado/s exitosamente.");
          this.data.reparto.repartoComprobantes.forEach(comprobante => {
            if (comprobante.id > 0) {
              comprobante.id = 0; //Le seteo el id a "0" para saber cual Reparto Cpte se modificó. 
              comprobante.estado = { //Le seteo el "estado" para poder mostrarlo en la tabla.
                id: 6,
                nombre: "Entregado"
              }
            }
          });
          this.dialogRef.close(this.data.reparto.repartoComprobantes);
        }
      },
      err => {
        this.lanzarError(err.json());
        this.dialogRef.close();
      }
    )
  }
  //Lanza error desde el servidor 
  private lanzarError(err) {
    let respuesta = err;
    let campoVacio = "no puede estar vacío.";
    let campoInexistente = " no encontrado.";
    if (respuesta.codigo == 5008) {
      this.toastr.error("No contiene comprobante/s.");
    } else if (respuesta.codigo == 500) {
      this.toastr.error("Se produjo un error en el sistema.");
    } else if (respuesta.codigo == 5001) {
      this.toastr.error("Error al sincronizar.");
    } else if (respuesta.codigo == 16380) {
      this.toastr.error("Orden de Recolección " + campoVacio);
    } else if (respuesta.codigo == 16207) {
      this.toastr.error("Fecha " + campoVacio);
    } else if (respuesta.codigo == 16070) {
      this.toastr.error("Sucursal " + campoVacio);
    } else if (respuesta.codigo == 16062) {
      this.toastr.error("Estado del Seguimiento " + campoVacio);
    } else if (respuesta.codigo == 16092) {
      this.toastr.error("Comprobante de venta " + campoVacio);
    } else if (respuesta.codigo == 16096) {
      this.toastr.error("Remito " + campoVacio);
    } else if (respuesta.codigo == 13057) {
      this.toastr.error("Registro de Orden de Recolección " + campoInexistente);
    } else if (respuesta.codigo == 13096) {
      this.toastr.error("Registro de sucursal " + campoInexistente);
    } else if (respuesta.codigo == 13135) {
      this.toastr.error("Registro de comprobante de Venta " + campoInexistente);
    } else if (respuesta.codigo == 13140) {
      this.toastr.error("Registro de remito " + campoInexistente);
    } else if (respuesta.codigo == 13087) {
      this.toastr.error("Registro de estado del seguimiento " + campoInexistente);
    } else if (respuesta.codigo == 13088) {
      this.toastr.error("Registro de Situación del seguimiento " + campoInexistente);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
