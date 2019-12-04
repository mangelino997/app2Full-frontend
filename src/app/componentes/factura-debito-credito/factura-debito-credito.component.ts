import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { FacturaDebitoCredito } from 'src/app/modelos/facturaDebitoCredito';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { LoaderState } from 'src/app/modelos/loader';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { CompraComprobanteItem } from 'src/app/modelos/compra-comprobante-item';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { DepositoInsumoProductoService } from 'src/app/servicios/deposito-insumo-producto.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { CompraComprobantePercepcion } from 'src/app/modelos/compra-comprobante-percepcion';
import { TipoPercepcionService } from 'src/app/servicios/tipo-percepcion.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { CompraComprobantePercepcionJurisdiccion } from 'src/app/modelos/compra-comprobante-percepcion-jurisdiccion';
import { CompraComprobanteVencimiento } from 'src/app/modelos/compra-comprobante-vencimiento';
import { CompraComprobanteVencimientoService } from 'src/app/servicios/compra-comprobante-vencimiento.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-factura-debito-credito',
  templateUrl: './factura-debito-credito.component.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class FacturaDebitoCreditoComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si muestra el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define una de las condiciones para el boton de la pestaña (cuando "importe"/"deduccionGeneral" no es nulos)
  public condicion: boolean = false;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si muestra el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la pestaña Listar y  sus validaciones de campos
  public formularioFiltro: FormGroup;
  //Define un formulario para mostrar los datos del proveedor
  public formularioDatosProveedor: FormGroup;
  //Define la fecha actual
  public FECHA_ACTUAL: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de condiciones de compra
  public condicionesCompra: Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes: Array<any> = [];
  //Define la lista de tipos de Letras 
  public letras: Array<any> = [];
  //Defien la empresa 
  public empresa: FormControl = new FormControl();
  //Defien el modo de establecer el codigo de afip como un formControl 
  public establecerCodigoAfipPor: FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista completa de registros para el modal 'DetalleComprasComprobantesDialogo'
  public listaCompletaModal = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['id', 'producto', 'deposito', 'cantidad', 'precioUnitario', 'importeNetoGravado', 'alicuotaIva', 'IVA',
    'importeNoGravado', 'importeExento', 'impuestoInterno', 'importeITC', 'cuentaContable', 'eliminar'];
  //Define las columnas de la tabla para la pestaña Listar
  public columnasListar: string[] = ['EMPRESA', 'SUCURSAL', 'PROVEEDOR', 'TIPO_CPTE', 'PUNTO_VENTA', 'LETRA', 'NUMERO', 'FECHA_EMISION',
    'FECHA_CONTABLE', 'FECHA_REGISTRACION', 'IMPORTE', 'SALDO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(private fechaService: FechaService, private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService,
    private modelo: FacturaDebitoCredito, private subopcionPestaniaService: SubopcionPestaniaService,
    private tipoComprobanteService: TipoComprobanteService, private afipComprobanteService: AfipComprobanteService,
    private proveedorService: ProveedorService, private compraComprobanteService: CompraComprobanteService, public dialog: MatDialog,
    private condicionCompraService: CondicionCompraService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.pestanias.splice(3, 1);
          this.activeLink = this.pestanias[0].nombre;
        }, err => { }
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
    //Define el formularioFiltro y validaciones
    this.formularioFiltro = new FormGroup({
      empresa: new FormControl('', Validators.required),
      proveedor: new FormControl('', Validators.required),
      nombre: new FormControl(),
      fechaTipo: new FormControl('', Validators.required),
      fechaDesde: new FormControl('', Validators.required),
      fechaHasta: new FormControl('', Validators.required),
      tipoComprobante: new FormControl('', Validators.required)
    });
    //Define el formulario para mostrar los datos del proveedor
    this.formularioDatosProveedor = new FormGroup({
      domicilio: new FormControl(),
      localidad: new FormControl(),
      condicionIVA: new FormControl(),
      tipoProveedor: new FormControl(),
    });
    //Establece la empresa
    this.empresa.setValue(this.appService.getEmpresa());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', true);
    //Obtiene la fecha Actual
    this.obtenerFecha();
    //Obtiene la lista de tipos de comprobantes
    this.listarTipoComprobante();
    //Obtiene la lista de letras, el 0 trae todas
    this.listarLetras(0);
    //Obtiene la lista de Condiciones de Compra
    this.listarCondicionCompra();
    //Autocompletado Proveedor- Buscar por alias
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.proveedorService.listarPorAlias(data).subscribe(response => {
            this.resultados = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Autocompletado Proveedor- Buscar por alias
    this.formularioFiltro.get('nombre').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.proveedorService.listarPorAlias(data).subscribe(response => {
            this.resultados = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Carga la Fecha Actual en el campo "Fecha Contable"
  private obtenerFecha() {
    this.fechaService.obtenerFecha().subscribe(
      res => {
        let fechaActual = res.json();
        this.FECHA_ACTUAL.setValue(fechaActual);
        this.formulario.get('fechaEmision').setValue(fechaActual);
        this.formulario.get('fechaVtoPago').setValue(fechaActual);
        this.formulario.get('fechaContable').setValue(fechaActual);
      },
      err => {
        this.toastr.error("Error al obtener la Fecha Actual.");
      }
    )
  }
  //Carga la lista de tipos de comprobantes
  private listarTipoComprobante() {
    this.tipoComprobanteService.listarEstaActivoCompraCargaTrue().subscribe(
      res => {
        this.tiposComprobantes = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Tipos de Comprobantes.");
      }
    )
  }
  //Carga la lista de letras
  private listarLetras(idTipoComprobante) {
    this.afipComprobanteService.listarLetras(idTipoComprobante).subscribe(
      res => {
        this.letras = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Letras.");
      }
    )
  }
  //Carga la lista de tipos de condiciones de compra
  private listarCondicionCompra() {
    this.condicionCompraService.listar().subscribe(
      res => {
        this.condicionesCompra = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de Tipos de Condiciones de Compra.");
      }
    )
  }
  //Controla el cambio en el select "establecer codigo afip"
  public cambioEstablecerCodigoAfipPor() {
    if (this.establecerCodigoAfipPor.value) {
      this.formulario.get('tipoComprobante').disable();
      this.formulario.get('codigoAfip').enable();
    } else {
      this.formulario.get('tipoComprobante').enable();
      this.formulario.get('codigoAfip').disable();
    }
  }
  //Establecer campos en disable/enable
  public establecerEstadoCampos(): void {
    this.formularioDatosProveedor.disable();
    this.formulario.get('tipoComprobante').disable();
    switch (this.indiceSeleccionado) {
      case 1:
        this.formulario.enable();
        this.establecerCodigoAfipPor.enable();
        break;
      case 2:
        this.formulario.disable();
        this.establecerCodigoAfipPor.disable();
        break;
      case 3:
        this.formulario.disable();
        this.establecerCodigoAfipPor.disable();
      case 4:
        this.formulario.disable();
        this.establecerCodigoAfipPor.disable();
        break;
      default:
        break;
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
  /*Establece valores al seleccionar una pestania . El parámetro 'reestablecer' determina si se reestablece el formulario o no 
  (es false cuando proviene de la pestaña Listar*/
  public seleccionarPestania(id, nombre, reestablecer) {
    reestablecer ? this.reestablecerFormulario() : '';
    this.listaCompleta = new MatTableDataSource([]);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.resultados = [];
    switch (id) {
      case 1:
        this.establecerEstadoCampos();
        this.establecerValoresPestania(nombre, false, false, true, 'idAutocompletado');
        break;
      case 2:
        this.establecerEstadoCampos();
        this.establecerValoresPestania(nombre, true, true, false, 'idEmpresaListar');
        break;
      case 3:
        this.establecerEstadoCampos();
        this.establecerValoresPestania(nombre, true, false, true, 'idEmpresaListar');
        break;
      case 4:
        this.establecerEstadoCampos();
        this.establecerValoresPestania(nombre, true, true, true, 'idEmpresaListar');
        break;
      case 5:
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
      default:
        break;
    }
  }
  //Obtiene la lista de CompraComprobante y la envia al modal 'DetalleCompraComprobantesDialogo'
  public listarComprasComprobantes() {
    if (this.listaCompletaModal.data.length > 0) {
      const dialogRef = this.dialog.open(DetalleCompraComprobantesDialogo, {
        width: '95%',
        maxWidth: '95%',
        data: {
          listaCompleta: this.listaCompletaModal.data
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        result ?
          this.establecerValoresPorElemento(result) : this.toastr.warning("No seleccionó ninguna compra comprobante de la lista.");
      });
    }
  }
  //Carga la tabla de la pestaña listar con registros de acuerdo a la lista que tiene que cargar --> listaCompleta / listaCompletaModal
  public listar(opcion) {
    this.loaderService.show();

    //Establezco los parametros
    let idProveedor = null;
    this.formularioFiltro.value.proveedor != 0 ?
      idProveedor = this.formularioFiltro.value.nombre.id : idProveedor = 0;
    this.compraComprobanteService.listarPorFiltros(this.formularioFiltro.value.empresa, idProveedor, this.formularioFiltro.value.fechaTipo,
      this.formularioFiltro.value.fechaDesde, this.formularioFiltro.value.fechaHasta, this.formularioFiltro.value.tipoComprobante).subscribe(
        res => {
          let resultado = res.json();
          if (resultado.length != 0) {
            opcion == 'listaCompletaModal' ? [
              this.listaCompletaModal = new MatTableDataSource(resultado),
              this.listaCompletaModal.sort = this.sort,
              this.listarComprasComprobantes()] : [
                this.listaCompleta = new MatTableDataSource(resultado),
                this.listaCompleta.sort = this.sort,
                this.listaCompleta.paginator = this.paginator,
              ]
          } else {
            this.toastr.warning("Sin datos para mostrar.");
          }
          this.loaderService.hide();
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      );
  }
  //Método Agregar 
  public agregar() {
    this.loaderService.show();
    this.formulario.get('tipoComprobante').enable();
    let usuarioAlta = this.appService.getUsuario();
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(usuarioAlta.sucursal);
    this.formulario.get('usuarioAlta').setValue(usuarioAlta);
    this.controlaCamposVacios();
    this.compraComprobanteService.agregar(this.formulario.value).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.listaCompleta = new MatTableDataSource([]);
          this.formulario.get('tipoComprobante').disable();
          this.toastr.success(res.json().mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Método Actualizar 
  public actualizar() {
    this.loaderService.show();
    this.formulario.enable();
    let usuarioMod = this.appService.getUsuario();
    this.formulario.get('usuarioMod').setValue(usuarioMod);
    this.controlaCamposVacios();
    this.compraComprobanteService.actualizar(this.formulario.value).subscribe(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario();
          this.listaCompleta = new MatTableDataSource([]);
          this.toastr.success(res.json().mensaje);
          this.establecerEstadoCampos();
        }
        this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Controla los campos que estan en nulos
  private controlaCamposVacios() {
    this.formulario.value.importePercepcion == null || this.formulario.value.importePercepcion == undefined ?
      this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    this.formulario.value.importeSaldo == null || this.formulario.value.importeSaldo == undefined ?
      this.formulario.get('importeSaldo').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    this.formulario.value.compraComprobantePercepciones == null || this.formulario.value.compraComprobantePercepciones == undefined ?
      this.formulario.get('compraComprobantePercepciones').setValue([]) : '';
    this.formulario.value.compraComprobanteVencimientos == null || this.formulario.value.compraComprobanteVencimientos == undefined ?
      this.formulario.get('compraComprobanteVencimientos').setValue([]) : '';
    this.formulario.value.compraComprobanteItems == null || this.formulario.value.compraComprobanteItems == undefined ?
      this.formulario.get('compraComprobanteItems').setValue([]) : '';
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11002) {
      document.getElementById("labelProveedor").classList.add('label-error');
      document.getElementById("idProveedor").classList.add('is-invalid');
      document.getElementById("idProveedor").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Controla el campo proveedor
  public controlAutoVacio() {
    let elemento = this.formulario.value.proveedor;
    elemento == null || elemento == undefined || elemento == '' ? this.formularioDatosProveedor.reset() : '';
  }
  //Establece los valores segun el proveedor seleccionado
  public establecerValoresProveedor(elemento) {
    let localidad = elemento.localidad.nombre + ',' + elemento.localidad.provincia.nombre
    this.formularioDatosProveedor.get('domicilio').setValue(elemento.domicilio);
    this.formularioDatosProveedor.get('localidad').setValue(localidad);
    this.formularioDatosProveedor.get('condicionIVA').setValue(elemento.afipCondicionIva.nombre);
    this.formularioDatosProveedor.get('tipoProveedor').setValue(elemento.tipoProveedor.nombre);
    this.formulario.get('condicionCompra').setValue(elemento.condicionCompra);
  }
  //Controla el cambio en el campo "Codigo Afip"
  public cambioCodigoAfip() {
    let codigoAfip = this.formulario.get('codigoAfip').value;
    if (codigoAfip && codigoAfip.length == 3) {
      this.afipComprobanteService.obtenerPorCodigoAfip(codigoAfip).subscribe(
        res => {
          let respuesta = res.json();
          if (respuesta) {
            this.formulario.get('tipoComprobante').setValue(respuesta.tipoComprobante);
            this.formulario.get('letra').setValue(respuesta.letra);
          } else {
            this.formulario.get('codigoAfip').setValue(null);
            this.formulario.get('tipoComprobante').setValue(null);
            this.formulario.get('letra').setValue(null);
            this.toastr.error("El Código Afip ingresado no existe.");
            document.getElementById('idCodigoAfip').focus();
          }
        },
        err => {
          let error = err.json();
          this.formulario.get('codigoAfip').setValue(null);
          this.formulario.get('tipoComprobante').setValue(null);
          this.formulario.get('letra').setValue(null);
          this.toastr.error(error.mensaje);
        }
      )
    }
    if (codigoAfip == null || codigoAfip == undefined) {
      this.formulario.get('codigoAfip').setValue(null);
      this.formulario.get('tipoComprobante').setValue(null);
      this.formulario.get('letra').setValue(null);
      this.toastr.error("El campo Código Afip está vacío.");
    }
    if (codigoAfip.length < 3) {
      this.formulario.get('codigoAfip').setValue(null);
      this.formulario.get('tipoComprobante').setValue(null);
      this.formulario.get('letra').setValue(null);
      this.toastr.error("El campo Código Afip debe tener 3 dígitos como mínimo.");
    }
  }
  //Controla el cambio en el campo "Número"
  public verificarComprobante() {
    let idProveedor = this.formulario.value.proveedor.id;
    let codigoAfip = this.formulario.value.codigoAfip;
    let puntoVenta = this.formulario.value.puntoVenta;
    let numero = this.formulario.value.numero;
    if (numero) {
      this.establecerCerosIzq(this.formulario.get('numero'), '0000000', -8);
      if (idProveedor && codigoAfip && puntoVenta) {
        this.compraComprobanteService.verificarUnicidadComprobante(idProveedor, codigoAfip, puntoVenta, numero).subscribe(
          res => {
            let respuesta = res.json();
            if (respuesta) {
              this.formulario.get('numero').setValue(null);
              document.getElementById('idNumero').focus();
              this.toastr.error("Número ya utilizado en un comprobante.");
            }
          },
          err => {
            let error = err.json();
            this.toastr.error(error.mensaje);
          }
        )
      } else {
        this.toastr.error("No se puede verificar unicidad del comprobante, campos vacíos en 'Proveedor', 'Codigo Afip', 'Punto Venta' o 'Número'.");
      }
    }
  }
  //Controla la 'Fecha Contable'
  public controlarFechaContable() {
    let fechaEmision = this.formulario.value.fechaEmision;
    let fechaContable = this.formulario.value.fechaContable;
    if (fechaEmision == null || fechaEmision == undefined) {
      this.toastr.error("Debe ingresar una fecha de emisión.");
      document.getElementById('idFechaEmision').focus();
    } else if (fechaContable < fechaEmision) {
      this.toastr.error("Fecha contable debe ser igual o mayor a la fecha de emisión.");
      this.formulario.get('fechaEmision').setValue(null);
      this.formulario.get('fechaContable').setValue(this.FECHA_ACTUAL.value);
      document.getElementById('idFechaEmision').focus();
    }
  }
  //Controla el cambio en el campo "Fecha de Emision"
  public controlarFechaEmision() {
    let fechaEmision = this.formulario.get('fechaEmision').value;
    let fechaContable = this.formulario.get('fechaContable').value;
    let fechaVtoPago = this.formulario.get('fechaVtoPago').value;
    if (fechaEmision > fechaContable) {
      this.toastr.error("Fecha de emisión debe ser igual o menor a fecha contable.");
      this.formulario.get('fechaEmision').setValue(null);
      document.getElementById('idFechaEmision').focus();
    } else if (fechaEmision > fechaVtoPago) {
      this.toastr.error("Fecha de emisión debe ser igual o menor a fecha vto. pago.");
      this.formulario.get('fechaEmision').setValue(null);
      document.getElementById('idFechaEmision').focus();
    } else {
      // this.formulario.get('fechaVtoPago').setValue(fechaEmision);
      document.getElementById('idFechaVtoPago').focus();
    }
  }
  //Controla el cambio en el campo "Fecha de Pago"
  public controlarFechaVtoPago() {
    let fechaEmision = this.formulario.get('fechaEmision').value;
    let fechaVtoPago = this.formulario.get('fechaVtoPago').value;
    if (fechaEmision > fechaVtoPago) {
      this.toastr.error("Fecha vto. pagoo debe ser igual o mayor a fecha emisión.");
      this.formulario.get('fechaVtoPago').setValue(fechaEmision);
      document.getElementById('idFechaVtoPago').focus();
    }
  }
  //Controla el campo 'Fecha Hasta' en pestaña Listar
  public controlarFechaHasta() {
    if (this.formularioFiltro.value.fechaHasta == null || this.formularioFiltro.value.fechaHasta == undefined) {
      this.toastr.error("Debe ingresar una fecha desde.");
      document.getElementById('idFechaDesde').focus();
    } else if (this.formularioFiltro.value.fechaHasta < this.formularioFiltro.value.fechaDesde) {
      this.toastr.error("Fecha hasta debe ser igual o mayor a fecha desde.");
      this.formularioFiltro.get('fechaDesde').setValue(null);
      this.formularioFiltro.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
      document.getElementById('idFechaDesde').focus();
    }
  }
  //Controla el cambio en el campo "Tipo de Comprobante"
  public cambioTipoComprobante() {
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    let letra = this.formulario.get('letra').value;
    this.listarLetras(tipoComprobante.id);
    if (tipoComprobante && letra) {
      this.afipComprobanteService.obtenerCodigoAfip(tipoComprobante.id, letra).subscribe(
        res => {
          let respuesta = res.text();
          if (respuesta != null) {
            this.formulario.get('codigoAfip').setValue(respuesta);
            this.cambioCodigoAfip();
          } else {
            this.formulario.get('codigoAfip').setValue(null);
          }
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
        }
      )
    }
  }
  //Controla el cambio en el campo "Letra"
  public cambioLetra() {
    this.formulario.get('tipoComprobante').enable();
    if (this.formulario.value.tipoComprobante && this.formulario.value.letra) {
      this.afipComprobanteService.obtenerCodigoAfip(this.formulario.value.tipoComprobante.id, this.formulario.value.letra).subscribe(
        res => {
          let respuesta = res.text();
          if (respuesta) {
            this.formulario.get('codigoAfip').setValue(respuesta);
          } else {
            this.formulario.get('codigoAfip').reset();
            this.formulario.get('letra').reset();
            document.getElementById('idCodigoAfip').focus();
            this.toastr.error("Ingrese otro Código de Afip");
          }
          this.formulario.get('tipoComprobante').disable();
        },
        err => {
          this.formulario.get('codigoAfip').reset();
          this.formulario.get('letra').reset();
          this.formulario.get('tipoComprobante').disable();
          document.getElementById('idCodigoAfip').focus();
          this.toastr.error("Ingrese otro Código de Afip");
        }
      )
    } else {
      this.toastr.error("No se puede obtener el Código de Afip porque hay campos vacíos en 'Tipo de Comprobante' o 'Letra'.");
    }
  }
  //Abre modal para agregar los items
  public agregarItemDialogo() {
    const dialogRef = this.dialog.open(AgregarItemDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        proveedor: this.formulario.value.proveedor,
        cantidadItem: this.listaCompleta.data.length
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      //Seteo la lista de Item en el formulario
      this.formulario.get('compraComprobanteItems').setValue(result);

      //Cargo los items a la tabla
      if (this.listaCompleta.data.length > 0) {
        result.forEach(item => {
          this.listaCompleta.data.push(item);
        });
        this.listaCompleta.sort = this.sort;
      } else {
        this.listaCompleta = new MatTableDataSource(result);
        this.listaCompleta.sort = this.sort;
      }
      this.calcularImportes();
    });
  }
  //Abre modal para agregar detalle de percepciones
  public detallePercepcionDialogo() {
    const dialogRef = this.dialog.open(DetallePercepcionesDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        detallePercepcion: this.formulario.value.compraComprobantePercepciones,
        soloLectura: this.indiceSeleccionado != 1 ? true : false
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      result ?
        [
          this.formulario.get('compraComprobantePercepciones').setValue(result),
          this.calcularImportesPercepciones(result)] : [
          this.formulario.get('compraComprobantePercepciones').setValue([]),
          this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales('0.00', 2))
        ];
    });
  }
  //Abre modal para agregar los vencimientos
  public detalleVencimientosDialogo() {
    const dialogRef = this.dialog.open(DetalleVencimientosDialogo, {
      width: '95%',
      maxWidth: '95%',
      data: {
        proveedor: this.formulario.value.proveedor,
        importeTotal: this.formulario.value.importeTotal,
        condicionCompra: this.formulario.value.condicionCompra,
        detalleVencimientos: this.formulario.value.compraComprobanteVencimientos,
        soloLectura: this.indiceSeleccionado != 1 ? true : false
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      result ? this.formulario.get('compraComprobanteVencimientos').setValue(result) :
        this.formulario.get('compraComprobanteVencimientos').setValue([]);
    });
  }
  //Calcula el importe total de detalle percepciones
  public calcularImportesPercepciones(listaPercepciones) {
    let importePercepciones = null;
    //Suma el importe de las percepciones
    listaPercepciones.forEach(
      item => {
        importePercepciones += Number(item.importe);
      }
    );
    //Setea el valor correspondiente en el formulario
    this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales(
      importePercepciones > 0 ? importePercepciones : '0.00', 2));
  }
  //Calcula los importes
  public calcularImportes() {
    // this.establecerImportesPorDefecto();
    this.listaCompleta.data.forEach(
      item => {
        //Suma los importes anteriores con los nuevos
        let impNoGravado = Number(this.formulario.value.importeNoGravado) + Number(item.importeNoGravado);
        let impExento = Number(this.formulario.value.importeExento) + Number(item.importeExento);
        let impInt = Number(this.formulario.value.importeImpuestoInterno) + Number(item.importeImpuestoInterno);
        let impNetoGravado = Number(this.formulario.value.importeNetoGravado) + Number(item.importeNetoGravado);
        let impIva = Number(this.formulario.value.importeIVA) + Number(item.importeIva);
        //Setea el valor correspondiente en los importes del formulario
        this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales(
          impNoGravado > 0 ? impNoGravado : '0.00', 2));
        this.formulario.get('importeExento').setValue(this.appService.establecerDecimales(
          impExento > 0 ? impExento : '0.00', 2));
        this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales(
          impInt > 0 ? impInt : '0.00', 2));
        this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(
          impNetoGravado ? impNetoGravado : '0.00', 2));
        this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales(
          impIva > 0 ? impIva : '0.00', 2));
      }
    );
    this.calcularImporteTotal();
  }
  //Calcula el Importe Total
  private calcularImporteTotal() {
    let importeTotal = Number(this.formulario.value.importeNoGravado) + Number(this.formulario.value.importeNoGravado) +
      Number(this.formulario.value.importeExento) + Number(this.formulario.value.importeImpuestoInterno) +
      Number(this.formulario.value.importeNetoGravado) + Number(this.formulario.value.importeIVA);
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(importeTotal, 2));
  }
  //Elimina un item de la tabla
  public activarEliminar(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
    this.listaCompleta.data.length == 0 ? this.establecerImportesPorDefecto() : this.calcularImportes();
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.formularioDatosProveedor.reset();
    this.obtenerFecha();
    this.establecerImportesPorDefecto();
    this.reestablecerFormularioFiltro();
  }
  //Reestablece el formularioFiltro
  private reestablecerFormularioFiltro() {
    this.formularioFiltro.reset();

    /*Setea valores por defecto */
    this.formularioFiltro.get('proveedor').setValue(0);
    this.formularioFiltro.get('fechaTipo').setValue(1);
    this.formularioFiltro.get('tipoComprobante').setValue(0);
    this.formularioFiltro.get('empresa').setValue(this.empresa.value.id);
    this.formularioFiltro.get('fechaDesde').setValue(this.FECHA_ACTUAL.value);
    this.formularioFiltro.get('fechaHasta').setValue(this.FECHA_ACTUAL.value);
  }
  //Inicializa valores por defecto
  private establecerImportesPorDefecto() {
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales('0.00', 2));
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales('0.00', 2));
    this.establecerCodigoAfipPor.setValue(true);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, false);
    this.establecerValoresPorElemento(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, false);
    this.establecerValoresPorElemento(elemento);
  }
  //Setea valores y formatea (decimales y ceros izq.) por elemento seleccionado en pestaña listar
  private establecerValoresPorElemento(elemento) {
    //Controla campos a habilitar
    this.indiceSeleccionado == 3 ?
      [this.formulario.get('fechaEmision').enable(), this.formulario.get('fechaContable').enable()] :
      [this.formulario.get('fechaEmision').disable(), this.formulario.get('fechaContable').disable()];

    /* Establece el elemento */
    this.formulario.patchValue(elemento);

    //Setea la cantidad de items a la tabla principal
    this.listaCompleta = new MatTableDataSource(elemento.compraComprobanteItems);
    this.listaCompleta.sort = this.sort;

    //Formatea los valores en los campos Punto de Venta y Numero
    this.establecerCerosIzq(this.formulario.get('puntoVenta'), '0000', -5);
    this.establecerCerosIzq(this.formulario.get('numero'), '0000000', -8);

    //Establece los decimales en los campos de importes
    this.formulario.get('importePercepcion').setValue(this.appService.establecerDecimales(
      elemento.importePercepcion == 0 ? '0.00' : elemento.importePercepcion, 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales(
      elemento.importeNoGravado == 0 ? '0.00' : elemento.importeNoGravado, 2));
    this.formulario.get('importeExento').setValue(this.appService.establecerDecimales(
      elemento.importeExento == 0 ? '0.00' : elemento.importeExento, 2));
    this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales(
      elemento.importeImpuestoInterno == 0 ? '0.00' : elemento.importeImpuestoInterno, 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(
      elemento.importeNetoGravado == 0 ? '0.00' : elemento.importeNetoGravado, 2));
    this.formulario.get('importeIVA').setValue(this.appService.establecerDecimales(
      elemento.importeIVA == 0 ? '0.00' : elemento.importeIVA, 2));
    this.formulario.get('importeTotal').setValue(this.appService.establecerDecimales(
      elemento.importeTotal == 0 ? '0.00' : elemento.importeTotal, 2));

    //Establece los campos con los datos del proveedor
    this.formularioFiltro.get('nombre').setValue(elemento.proveedor);
    this.establecerValoresProveedor(elemento.proveedor);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, true);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, true);
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
      this.condicion = true;
    } else {
      this.condicion = false;
    }
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Imprime la cantidad de ceros correspondientes a la izquierda del numero 
  public establecerCerosIzqEnVista(elemento, string, cantidad) {
    if (elemento) {
      return elemento = ((string + elemento).slice(cantidad));
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.reset();
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        empresa: elemento.empresa.razonSocial,
        sucursal: elemento.sucursal.nombre,
        proveedor: elemento.proveedor.razonSocial,
        tipo_cpte: elemento.tipoComprobante.nombre,
        punto_venta: '$' + elemento.puntoVenta,
        letra: '$' + elemento.letra,
        numero: elemento.numero + '%',
        fecha_emision: elemento.fechaEmision,
        fecha_contable: elemento.fechaContable,
        fecha_registracion: elemento.fechaRegistracion,
        importe: elemento.importe,
        saldo: elemento.importeSaldo
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Facturas Debitos Creditos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnasListar
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}

//Componente Agregar Item Dialogo
@Component({
  selector: 'agregar-item-dialogo',
  templateUrl: 'agregar-item-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class AgregarItemDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de items 
  public listaItems: Array<any> = [];
  //Define la lista de resultados de busqueda para insumoProducto
  public resultados: Array<any> = [];
  //Define la lista de tipos de depositos
  public tiposDepositos: Array<any> = [];
  //Define la lista de afip alicuotas iva
  public afipAlicuotasIva: Array<any> = [];
  //Define el campo Unidad de Medida como FormControl
  public unidadMedida: FormControl = new FormControl();
  //Define el campo Condicion de Iva como FormControl
  public condicionIva: FormControl = new FormControl();
  //Define el campo Subtotal como FormControl
  public subtotal: FormControl = new FormControl();
  //Define los campos de ITC como FormControls
  public importeITC: FormControl = new FormControl();
  public netoITC: FormControl = new FormControl();
  public deducirDeNoGravado: FormControl = new FormControl();
  public importeNoGravado: FormControl = new FormControl();
  public netoNoGravado: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<AgregarItemDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobanteItem, private insumoProductoService: InsumoProductoService,
    private appService: AppService, private depositoInsumoProducto: DepositoInsumoProductoService,
    private afipAlicuotaIvaService: AfipAlicuotaIvaService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario
    this.formulario = this.modelo.formulario;
    //Obtiene la lista de afip alicuota iva
    this.listarAfipAlicuotaIva();
    //Obtiene la lista de Depositos
    this.listarDepositos();
    //Inicializa los valores por defecto
    this.reestablecerFormulario();
    //Autocompletado InsumoProducto- Buscar por alias
    this.formulario.get('insumoProducto').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.insumoProductoService.listarPorAlias(data).subscribe(response => {
            this.resultados = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  public listarDepositos() {
    this.depositoInsumoProducto.listar().subscribe(
      res => {
        this.tiposDepositos = res.json();
      },
      err => {
      }
    )
  }
  private listarAfipAlicuotaIva() {
    this.afipAlicuotaIvaService.listar().subscribe(
      res => {
        this.afipAlicuotasIva = res.json();
        this.establecerAfipAlicuotaIva();
      },
      err => {
      }
    );
  }
  //Inicializa el campo Afip Alicuota Iva
  private establecerAfipAlicuotaIva() {
    this.afipAlicuotasIva.forEach(
      item => {
        if (item.porDefecto == true)
          this.formulario.get('alicuotaIva').setValue(item);
      }
    );
  }
  //Establece valores por el insumoProducto seleccionado
  public establecerValores() {
    let insumoProducto = this.formulario.get('insumoProducto').value;
    if (insumoProducto == '' || insumoProducto == null || insumoProducto == undefined) {
      this.reestablecerFormulario();
    } else {
      this.unidadMedida.setValue(insumoProducto.unidadMedida.nombre);
      this.formulario.get('itcPorLitro').setValue(this.appService.establecerDecimales(insumoProducto.itcPorLitro.toString(), 4));
    }
  }
  //Calcula el Importe
  public calcularImporte() {
    this.establecerDecimales(this.formulario.get('precioUnitario'), 2);
    this.establecerDecimales(this.formulario.get('cantidad'), 2);
    let precioUnitario = this.formulario.get('precioUnitario').value;
    let cantidad = this.formulario.get('cantidad').value;
    if (precioUnitario && cantidad) {
      let importe = precioUnitario * cantidad;
      this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales(importe, 2));
    }
    this.calcularImporteIVA();
    this.calcularImporteITC();
  }
  //Calcula el Importe ITC 
  public calcularImporteITC() {
    let cantidad = Number(this.formulario.get('cantidad').value);
    let itcPorLitro = Number(this.formulario.get('itcPorLitro').value);
    this.establecerDecimales(this.formulario.get('itcPorLitro'), 4);
    if (itcPorLitro == 0 || itcPorLitro == null || itcPorLitro == undefined) {
      this.importeITC.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoITC.setValue(this.appService.establecerDecimales('0.00', 2));
      this.deducirDeNoGravado.setValue(null);
      this.importeNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales('0.00', 2));
      this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2));
      this.importeITC.disable();
      this.netoITC.disable();
      this.deducirDeNoGravado.disable();
      this.importeNoGravado.disable();
      this.netoNoGravado.disable();
    } else {
      this.importeITC.enable();
      this.netoITC.enable();
      this.deducirDeNoGravado.enable();
      this.importeNoGravado.enable();
      this.netoNoGravado.enable();
      let importeITC = itcPorLitro * cantidad;
      let insumoNetoITC = Number(this.formulario.value.insumoProducto.itcNeto);
      let netoITC = (importeITC * insumoNetoITC) / 100;
      this.importeITC.setValue(this.appService.establecerDecimales(importeITC, 2));
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales(importeITC, 2));
      this.netoITC.setValue(this.appService.establecerDecimales(netoITC, 2));
    }
  }
  //Controla el cambio en el campo Importe ITC
  public cambioImporteITC() {
    let importeITC = this.formulario.get('importeITC').value;
    let netoITC = null;
    let insumoNetoITC = null;
    this.establecerDecimales(this.formulario.get('importeITC'), 2);
    if (importeITC == '' || importeITC == '0.00' || importeITC == null) {
      this.netoITC.setValue(this.appService.establecerDecimales('0.00', 2));
    } else {
      insumoNetoITC = Number(this.formulario.value.insumoProducto.itcNeto);
      netoITC = (importeITC * insumoNetoITC) / 100;
      this.netoITC.setValue(this.appService.establecerDecimales(netoITC, 2));
    }
  }
  //Maneja el cambio en el select "Deducir de No Gravado"
  public cambioDeducirNoGravado() {
    if (this.deducirDeNoGravado.value) {
      this.importeNoGravado.enable();
    } else {
      this.importeNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.netoNoGravado.setValue(this.appService.establecerDecimales('0.00', 2));
      this.importeNoGravado.disable();
    }
  }
  //Calcula el Neto No Gravado
  public calcularNetoNoGravado() {
    this.establecerDecimales(this.importeNoGravado, 2);
    let netoNoGravado = this.importeNoGravado.value - this.netoITC.value;
    this.netoNoGravado.setValue(this.appService.establecerDecimales(netoNoGravado.toString(), 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales(netoNoGravado.toString(), 2));
  }
  //Calcula el Importe IVA
  public calcularImporteIVA() {
    let importeGravado = this.formulario.get('importeNetoGravado').value;
    let alicuotaIva = this.formulario.get('alicuotaIva').value.alicuota;
    if (importeGravado && alicuotaIva) {
      let importeIva = (importeGravado * alicuotaIva) / 100;
      this.formulario.get('importeIva').setValue(this.appService.establecerDecimales(importeIva, 2));
    }
  }
  //Calcula el Subtotal del Item
  public calcularSubtotal() {
    this.establecerDecimales(this.formulario.get('importeImpuestoInterno'), 2);
    let importeGravado = Number(this.formulario.value.importeNetoGravado);
    let importeIva = Number(this.formulario.value.importeIva);
    let importeItc = Number(this.formulario.value.importeITC);
    let importeNoGravado = Number(this.formulario.value.importeNoGravado);
    let importeExento = Number(this.formulario.value.importeExento);
    let importeImpuestoInterno = Number(this.formulario.value.importeImpuestoInterno);
    let subtotal = importeGravado + importeIva + importeItc + importeNoGravado + importeExento + importeImpuestoInterno;
    this.subtotal.setValue(this.appService.establecerDecimales(subtotal, 2));
  }
  //Agrega un item a la lista de items
  public agregarItem() {
    this.controlarCamposVacios();
    this.listaItems.push(this.formulario.value);
    this.toastr.success("Item agregado con éxito.");
    this.reestablecerFormulario();
    //incrementa el contador 
    this.data.cantidadItem += 1;
  }
  //Controla campso vacios. Establece en cero los nulos
  private controlarCamposVacios() {
    !this.formulario.value.cantidad || this.formulario.value.cantidad == undefined ?
      this.formulario.get('cantidad').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.precioUnitario || this.formulario.value.precioUnitario == undefined ?
      this.formulario.get('precioUnitario').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeNetoGravado || this.formulario.value.importeNetoGravado == undefined ?
      this.formulario.get('importeNetoGravado').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeNoGravado || this.formulario.value.importeNoGravado == undefined ?
      this.formulario.get('importeNoGravado').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeExento || this.formulario.value.importeExento == undefined ?
      this.formulario.get('importeExento').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeImpuestoInterno || this.formulario.value.importeImpuestoInterno == undefined ?
      this.formulario.get('importeImpuestoInterno').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeITC || this.formulario.value.importeITC == undefined ?
      this.formulario.get('importeITC').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.importeIva || this.formulario.value.importeIva == undefined ?
      this.formulario.get('importeIva').setValue(this.appService.establecerDecimales('0.00', 2)) : '';
    !this.formulario.value.afipAlicuotaIva || this.formulario.value.afipAlicuotaIva == undefined ?
      this.formulario.get('afipAlicuotaIva').setValue(this.data.proveedor.afipCondicionIva) : '';
  }
  //Reestablece el Formulario y los FormControls
  private reestablecerFormulario() {
    this.netoITC.reset();
    this.formulario.reset();
    this.importeITC.reset();
    this.unidadMedida.reset();
    this.netoNoGravado.reset();
    this.importeNoGravado.reset();
    this.deducirDeNoGravado.reset();
    this.deducirDeNoGravado.reset();
    this.establecerAfipAlicuotaIva();
    this.formulario.get('afipAlicuotaIva').setValue(this.data.proveedor.afipCondicionIva);
    this.condicionIva.setValue(this.data.proveedor.afipCondicionIva.nombre);
    this.subtotal.setValue(this.appService.establecerDecimales('0.00', 2));
    setTimeout(function () {
      document.getElementById('idInsumoProducto').focus();
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
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appService.mascararEnterosConDecimales(limit);
  }
  //Mascara para cuatro decimales
  public mascararCuatroDecimales(limit) {
    return this.appService.mascararEnterosCon4Decimales(limit);
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
    } else {
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Agregar Item Dialogo
@Component({
  selector: 'detalle-percepciones-dialogo',
  templateUrl: 'detalle-percepciones-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class DetallePercepcionesDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define un formulario para validaciones de campos
  public formularioPorJurisdiccion: FormGroup;
  //Define la lista de Años 
  public anios: Array<any> = [];
  //Define la lista de Meses 
  public meses: Array<any> = [];
  //Define la lista de provincias 
  public provincias: Array<any> = [];
  //Define la lista de resultados de busqueda para insumoProducto
  public resultados: Array<any> = [];
  //Define la lista de tipos de percepciones
  public tiposPercepciones: Array<any> = [];
  //Define un boolean para controlar vista de campos Percepción por Jurisdicción
  public mostrarCamposPorJurisdiccion: boolean = false;
  //Define el campo Condicion de Iva como FormControl
  public provincia: FormControl = new FormControl();
  //Define el campo Importe de Jurisdiccion FormControl
  public importeJurisdiccion: FormControl = new FormControl();
  //Define la lista completa de registros para la primera tabla
  public listaCompletaPorJurisdiccion = new MatTableDataSource([]);
  //Define la lista completa de registros para la segunda tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la primer tabla (percepciones por jurisdiccion)
  public columnasPercepcionPorJurisdiccion: string[] = ['provincia', 'importe', 'eliminar'];
  //Define las columnas de la segunda tabla (percepciones)
  public columnasPercepcion: string[] = ['tipoPercepcion', 'anio', 'mes', 'importe', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetallePercepcionesDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobantePercepcion, private modeloPorJurisdiccion: CompraComprobantePercepcionJurisdiccion,
    private appService: AppService, private tipoPercepcionService: TipoPercepcionService,
    private fechaService: FechaService, private mesService: MesService, private provinciaService: ProvinciaService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario General (sin detalle por jurisdicción)
    this.formulario = this.modelo.formulario;
    //Establece el formulario Por Jurisdiccion 
    this.formularioPorJurisdiccion = this.modeloPorJurisdiccion.formulario;
    //Establece la lista de percepciones
    if (this.data.detallePercepcion) {
      this.listaCompleta = new MatTableDataSource(this.data.detallePercepcion);
      this.listaCompleta.sort = this.sort;
    }
    //Obtiene la lista de recepciones
    this.listarPercepciones();
    //Obtiene la lista de anios mas menos uno
    this.listarAniosMasMenosUno();
    //Obtiene la lista de meses
    this.listarMeses();
    //Obtiene la lista de provincias
    this.listarProvincias();
    //Reestablece el formulario general
    this.reestablecerFormularioGeneral();
    //Controla si los campos son de soloLectura
    this.establecerCampos();
  }
  //Carga la lista de tipos de percepciones
  public listarPercepciones() {
    this.tipoPercepcionService.listar().subscribe(
      res => {
        this.tiposPercepciones = res.json();
      },
      err => {
      }
    )
  }
  //Carga la lista de anios
  private listarAniosMasMenosUno() {
    this.fechaService.listarAniosMasMenosUno().subscribe(
      res => {
        this.anios = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de años");
      }
    )
  }
  //Carga la lista de meses
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
  //Carga la lista de provincias
  private listarProvincias() {
    this.provinciaService.listar().subscribe(
      res => {
        this.provincias = res.json();
      },
      err => {
        this.toastr.error("Error al obtener la lista de provincias");
      }
    )
  }
  //Controla el cambio en el campo de selecicon Tipo de Percepción
  public cambioTipoPercepcion() {
    let elemento = this.formulario.get('tipoPercepcion').value;
    if (elemento.detallePorJurisdiccion) {
      this.mostrarCamposPorJurisdiccion = true;
    } else {
      this.mostrarCamposPorJurisdiccion = false;
    }
  }
  //Agrega una precepcion a la primera tabla (percepcion por jurisdiccion)
  public agregarPercepcionPorJurisdiccion() {
    if (this.listaCompletaPorJurisdiccion.data.length == 0) {
      this.listaCompletaPorJurisdiccion = new MatTableDataSource([this.formularioPorJurisdiccion.value]);
      this.listaCompletaPorJurisdiccion.sort = this.sort;
      this.toastr.success("Percepción por jurisdicción agregada con éxito.");
      this.reestablecerFormularioPorJurisdiccion();
    } else {
      //Controla unicidad de la provincia en la tabla
      let indice = this.listaCompletaPorJurisdiccion.data.findIndex(
        item => item.provincia.id === this.formularioPorJurisdiccion.value.provincia.id);
      if (indice >= 0) { //La provincia ya fue cargada anteriormente
        this.toastr.error("La provincia seleccionada ya fue agregada a la tabla.");
        this.formularioPorJurisdiccion.get('provincia').reset();
        document.getElementById('idProvincia').focus();
      } else { //La provincia no se encuentra en la tabla (devuelve -1)
        this.listaCompletaPorJurisdiccion.data.push(this.formularioPorJurisdiccion.value);
        this.listaCompletaPorJurisdiccion.sort = this.sort;
        this.toastr.success("Percepción por jurisdicción agregada con éxito.");
        this.reestablecerFormularioPorJurisdiccion();
      }
    }
  }
  //Controla antes de Agregar Percepcion
  public controlarAgregarPercepcion() {
    if (this.mostrarCamposPorJurisdiccion) { //Controla que los importes coincidan cuando es por jurisdiccion
      let importe = null;
      this.listaCompletaPorJurisdiccion.data.forEach(
        item => {
          importe += Number(item.importe);
        }
      );
      if (importe == Number(this.formulario.value.importe)) { //Controla igualdad de importes
        this.agregarPercepcion();
      } else {
        this.toastr.error("La suma de importes por jurisdicción es diferente al importe de cabecera.");
      }
    }
    if (!this.mostrarCamposPorJurisdiccion) {
      this.agregarPercepcion();
    }
  }
  //Agrega una percepcion a la segunda tabla
  private agregarPercepcion() {
    this.formulario.get('compraCptePercepcionJurisdicciones').setValue(this.listaCompletaPorJurisdiccion.data);
    if (this.listaCompleta.data.length == 0) {
      this.listaCompleta = new MatTableDataSource([this.formulario.value]);
      this.listaCompleta.sort = this.sort;
    } else {
      this.listaCompleta.data.push(this.formulario.value);
      this.listaCompleta.sort = this.sort;
    }
    this.toastr.success("Percepción agregada con éxito.");
    this.reestablecerFormularioGeneral();
  }
  //Elimina un item de la primera tabla
  public activarEliminarPorJurisdiccion(indice) {
    this.listaCompletaPorJurisdiccion.data.splice(indice, 1);
    this.listaCompletaPorJurisdiccion.sort = this.sort;
  }
  //Elimina un item de segunda la tabla
  public activarEliminarPercepcion(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
  }
  //Reestablece el Formulario general
  private reestablecerFormularioPorJurisdiccion() {
    this.formularioPorJurisdiccion.reset();
    document.getElementById('idProvincia').focus();
  }
  //Reestablece el Formulario percepciones por jurisdiccion
  private reestablecerFormularioGeneral() {
    this.formulario.reset();
    this.listaCompletaPorJurisdiccion = new MatTableDataSource([]);
    document.getElementById('idTipoPercepcion').focus();
  }
  //Maneja los campos cuando es soloLectura
  private establecerCampos() {
    this.soloLectura = this.data.soloLectura;
    this.soloLectura ?
      this.formulario.disable() : this.formulario.enable();
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
  //Mascara para cuatro decimales
  public mascararCuatroDecimales(limit) {
    return this.appService.mascararEnterosCon4Decimales(limit);
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
    } else {
    }
  }
  closeDialog(opcion) {
    if (opcion == 'aceptar') {
      this.dialogRef.close(this.listaCompleta.data);
    }
    if (opcion == 'cancelar') {
      this.dialogRef.close(null);
    }
  }
}


//Componente Agregar Item Dialogo
@Component({
  selector: 'detalle-vencimientos-dialogo',
  templateUrl: 'detalle-vencimientos-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class DetalleVencimientosDialogo {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si habilita el boton Aceptar
  public btnAceptar: boolean = null;
  //Define un formulario para validaciones de campos
  public formularioPorJurisdiccion: FormGroup;
  //Define la lista de Fechas de Vencimientos
  public fechasVencimiento: Array<any> = [];
  //Define la lista de condiciones de compra
  public condicionesCompra: Array<any> = [];
  //Define el campo Total Comprobante como FormControl
  public totalComprobante: FormControl = new FormControl();
  //Define el campo Condicion de Compra como FormControl
  public condicionCompra: FormControl = new FormControl();
  //Define el campo Cantidad Cuotas como FormControl
  public cantidadCuotas: FormControl = new FormControl();
  //Define el campo N° de Cuota como FormControl
  public numeroCuota: FormControl = new FormControl();
  //Define el id del registro a modificar
  public idMod: number = null;
  //Define el importe total de la tabla
  public importeTotalTabla: number = null;
  //Define el campo Diferencia como FormControl
  public diferencia: FormControl = new FormControl();
  //Define la lista completa de registros para la tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnasPercepcion: string[] = ['numeroCuota', 'fechaVencimiento', 'importe', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetallePercepcionesDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private loaderService: LoaderService, private modelo: CompraComprobanteVencimiento, private modeloPorJurisdiccion: CompraComprobantePercepcionJurisdiccion,
    private condicionCompraService: CondicionCompraService, private appService: AppService,
    private servicio: CompraComprobanteVencimientoService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el formulario General (sin detalle por jurisdicción)
    this.formulario = this.modelo.formulario;
    //Establece el formulario Por Jurisdiccion 
    this.formularioPorJurisdiccion = this.modeloPorJurisdiccion.formulario;
    //Obtiene la lista de recepciones
    this.listarCondicionesCompra();
    //Inicializa valores por defecto
    this.establecerPorDefecto();
    //Controla si los campos son de soloLectura
    this.establecerCampos();
  }
  //Carga la lista de condiciones de compra
  public listarCondicionesCompra() {
    this.condicionCompraService.listar().subscribe(
      res => {
        this.condicionesCompra = res.json();
      },
      err => {
      }
    )
  }
  //Establece valores por defecto
  private establecerPorDefecto() {
    this.importeTotalTabla = null;
    this.totalComprobante.reset();
    this.condicionCompra.reset();
    this.cantidadCuotas.reset();
    this.diferencia.reset();
    this.btnAceptar = true;
    this.cantidadCuotas.setValue(this.data.proveedor.condicionCompra.cuotas);
    this.condicionCompra.setValue(this.data.condicionCompra);
    this.cantidadCuotas.setValue(this.data.proveedor.condicionCompra.cuotas);
    Number(this.data.importeTotal) > 0 ?
      this.totalComprobante.setValue(this.appService.establecerDecimales(this.data.importeTotal, 2)) :
      this.totalComprobante.setValue(this.appService.establecerDecimales('0.00', 2));
    this.data.detalleVencimientos ?
      [this.listaCompleta = new MatTableDataSource(this.data.detalleVencimientos), this.listaCompleta.sort = this.sort] :
      this.listaCompleta = new MatTableDataSource([]);
  }
  //Maneja los campos cuando es soloLectura
  private establecerCampos() {
    this.soloLectura = this.data.soloLectura;
    this.soloLectura ?
      [this.formulario.disable(), this.condicionCompra.disable(), this.cantidadCuotas.disable()] :
      [this.formulario.enable(), this.condicionCompra.enable(), this.cantidadCuotas.enable()];
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
  //Confirma y genera tabla de vencimientos
  public confirmar() {
    this.loaderService.show();
    let totalImporteComprobante = this.totalComprobante.value;
    this.servicio.generarTablaVencimientos(
      this.cantidadCuotas.value, this.totalComprobante.value, this.condicionCompra.value.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.establecerTotalImporteACuotas(totalImporteComprobante);
          this.diferencia.setValue(this.appService.establecerDecimales('0.00', 2));
          this.btnAceptar = true;
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.mensaje);
          this.loaderService.hide();
        }
      );
  }
  //Establece a cada registro, de la lista de cuotas, el prestamo total 
  private establecerTotalImporteACuotas(totalImporteComprobante) {
    this.listaCompleta.data.forEach(
      item => {
        item.importeTotal = totalImporteComprobante;
      }
    );
  }
  //Actualiza un registro de la tabla
  public actualizar() {
    this.formulario.value.importeTotal = this.listaCompleta.data[this.idMod].importeTotal;
    this.listaCompleta.data[this.idMod] = this.formulario.value;
    this.listaCompleta.sort = this.sort;
    this.calcularDiferenciaImporte();
    this.formulario.reset();
    this.numeroCuota.setValue(null);
    this.idMod = null;
  }
  //Limpia los campos del formulario - cancela el actualizar
  public cancelar() {
    this.idMod = null;
    this.formulario.reset();
    this.numeroCuota.setValue(null);
  }
  //Completa los campos del formulario con los datos del registro a modificar
  public activarActualizar(elemento, indice) {
    this.formulario.patchValue(elemento);
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(elemento.importe, 2));
    this.numeroCuota.setValue(indice + 1);

    /* Cuando el indice es 0, se le suma 1, porque el html considera null al 0 
    (por ello el primer registro no se podria modificar) */
    indice == 0 ? this.idMod = indice + 1 : this.idMod = indice;
  }
  //Activar Eliminar
  public activarEliminar(indice) {
    this.listaCompleta.data.splice(indice, 1);
    this.listaCompleta.sort = this.sort;
    this.calcularDiferenciaImporte();
  }
  //Calcula la diferencia entre el total comprobante y la suma de los importes de las cuotas
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
  //Maneja el cambio en el campo de seleccion 'Condicion de compra'
  public cambioCondicionCompra() {
    this.condicionCompra.value.nombre == 'CONTADO' ? this.cantidadCuotas.setValue(1) : '';
  }
  //Valida que cantidad de cuotas sea mayor a 0
  public validarCantidadCuotas() {
    this.cantidadCuotas.value == 0 ?
      [this.cantidadCuotas.reset(), this.toastr.error("Cantidad de cuotas debe ser mayor a 0.")] : '';
  }
  //Mascara decimales
  public mascararDecimales(limit) {
    return this.appService.mascararEnterosConDecimales(limit);
  }
  //Mascara para cuatro decimales
  public mascararCuatroDecimales(limit) {
    return this.appService.mascararEnterosCon4Decimales(limit);
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
    } else {
    }
  }
  closeDialog(opcion) {
    if (opcion == 'aceptar') {
      if (this.btnAceptar)
        this.dialogRef.close(this.listaCompleta.data);
      else
        this.toastr.warning("Campo Diferencia debe ser cero.");
    }
    if (opcion == 'cancelar') {
      this.dialogRef.close(null);
    }
  }
}

//Componente Agregar Item Dialogo
@Component({
  selector: 'detalle-compra-comprobante-dialogo',
  templateUrl: 'detalle-compra-comprobante-dialogo.html',
  styleUrls: ['./factura-debito-credito.component.css']
})
export class DetalleCompraComprobantesDialogo {
  //Define el registro seleccionado
  public compraComprobante: FormControl = new FormControl();
  //Define la lista completa de registros para la tabla
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla para la pestaña Listar
  public columnas: string[] = ['id', 'empresa', 'sucursal', 'proveedor', 'tipoCpte', 'puntoVenta', 'letra', 'numero', 'fechaEmision',
    'fechaContable', 'fechaRegistracion', 'importe', 'saldo', 'elige'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<DetalleCompraComprobantesDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private appService: AppService) {
    dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Inicializa valores por defecto
    this.establecerPorDefecto();
  }
  //Establece valores por defecto
  private establecerPorDefecto() {
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCompleta = new MatTableDataSource(this.data.listaCompleta);
    this.listaCompleta.sort = this.sort;
  }
  //Controla el elemento seleccionado
  public activarSeleccionar(elemento) {
    this.compraComprobante.setValue(elemento);
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
  //Mascara para cuatro decimales
  public mascararCuatroDecimales(limit) {
    return this.appService.mascararEnterosCon4Decimales(limit);
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
    } else {
    }
  }
  //Imprime la cantidad de ceros correspondientes a la izquierda del numero 
  public establecerCerosIzqEnVista(elemento, string, cantidad) {
    if (elemento) {
      return elemento = ((string + elemento).slice(cantidad));
    }
  }
  closeDialog(opcion) {
    if (opcion == 'aceptar') {
      this.dialogRef.close(this.compraComprobante.value);
    }
    if (opcion == 'cerrar') {
      this.dialogRef.close(null);
    }
  }
}