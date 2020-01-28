import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../../servicios/proveedor.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { BancoService } from '../../servicios/banco.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/modelos/proveedor';
import { LoaderService } from 'src/app/servicios/loader.service';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { PlanCuentaDialogo } from '../plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ProveedorCuentaContableService } from 'src/app/servicios/proveedor-cuenta-contable.service';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';
import { LoaderState } from 'src/app/modelos/loader';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { ProveedorCuentaBancariaService } from 'src/app/servicios/proveedor-cuenta-bancaria.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
  //Define el id del registro a modificar
  public idMod: string = null;
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
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para proveedor-cuentaBancaria
  public formularioCuentaBancaria: FormGroup;
  //Define un formulario para realizar el filtro en pestaña Listar
  public formularioFiltro: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista para las Cuentas Bancarias del proveedor
  public listaCuentaBancaria = new MatTableDataSource([]);
  //Define la lista de planes de cuentas
  public planesCuentas = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de condiciones de iva
  public condicionesIva: Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la lista de tipos de proveedores
  public tiposProveedores: Array<any> = [];
  //Define la lista de condiciones de compra
  public condicionesCompras: Array<any> = [];
  //Define la lista de tipos de cuentas bancarias
  public tiposCuentasBancarias: Array<any> = [];
  //Define la lista de empresas para Plan de Cuentas
  public empresasPlanCuenta: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define el banco de la opcion Banco, como un formControl
  public banco: FormControl = new FormControl();
  //Define el campo opcionLocalidadFiltro como un formControl
  public opcionLocalidadFiltro: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda de barrios
  public resultadosBarrios: Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades: Array<any> = [];
  //Define las listas de Sucursales
  public sucursales: Array<any> = [];
  //Define las listas de Monedas
  public monedas: Array<any> = [];
  //Define las listas de Bancos
  public bancos: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene el render
  public render: boolean = false;
  //Define las columnas de la tabla general - pestaña Listar
  public columnas: string[] = ['ID', 'RAZON_SOCIAL', 'TIPO_DOCUMENTO',
    'NUMERO_DOCUMENTO', 'TELEFONO', 'DOMICILIO', 'LOCALIDAD', 'EDITAR'];
  //Define las columnas de la tabla para la opcion Bancos - lista de Cuentas Bancarias
  public columnasCuentaBancaria: string[] = ['BANCO', 'TIPO_CUENTA', 'TITULAR', 'NUMERO_CUENTA', 'CBU', 'MONEDA',
    'ACTIVA', 'CUENTA_PPAL', 'EDITAR'];
  //Define las columnas de la tabla
  public columnasPlanCuenta: string[] = ['empresa', 'cuentaContable', 'planCuenta', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(
    private servicio: ProveedorService, private appService: AppService,
    private toastr: ToastrService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private bancoService: BancoService,
    private proveedorModelo: Proveedor, private loaderService: LoaderService,
    private dialog: MatDialog, private reporteServicio: ReporteService,
    private proveedorCuentaContableService: ProveedorCuentaContableService,
    private sucursalService: SucursalBancoService,
    private proveedorCuentaBancariaService: ProveedorCuentaBancariaService) {
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorAlias(data).subscribe(
            res => {
              this.resultados = res;
              this.loaderService.hide();
            },
            err => {
              this.loaderService.hide();
            });
        }
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.proveedorModelo.formulario;
    //Define los campos para proveedor-cuentaBancaria
    this.formularioCuentaBancaria = this.proveedorModelo.formularioCuentaBancaria;
    //Define los campos para filtrar la tabla 
    this.formularioFiltro = new FormGroup({
      localidad: new FormControl(),
      tipoProveedor: new FormControl('', Validators.required),
      condicionCompra: new FormControl('', Validators.required)
    });
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(8, 0);
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getUsuario().id, this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Autocompletado Localidad - Buscar por nombre - Enn formularioFiltro
    this.formularioFiltro.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Autocompletado - Buscar Bancos por nombre
    this.banco.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.bancoService.listarPorNombre(data).subscribe(response => {
            this.bancos = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene la lista de Sucursales por Banco 
  public cambioAutocompletadoBanco() {
    //Busca lista de sucursales solo si seleccionó un Banco
    if (this.banco.value) {
      this.sucursalService.listarPorBanco(this.banco.value.id).subscribe(
        res => {
          this.sucursales = res.json();
          this.sucursales.length == 0 ? this.toastr.warning("El Banco no tiene sucursales asignadas.") : '';
        }
      )
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccionBanco(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
      this.formularioCuentaBancaria.get('sucursalBanco').reset();
      this.sucursales = [];
    }
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idUsuario, idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idUsuario, idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece las opciones verticales
        this.opciones = respuesta.opciones;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.tiposProveedores = respuesta.tipoProveedores;
        this.condicionesIva = respuesta.afipCondicionesIva;
        this.tiposDocumentos = respuesta.tipoDocumentos;
        this.condicionesCompras = respuesta.condicionCompras;
        this.tiposCuentasBancarias = respuesta.tipoCuentaBancarias;
        this.empresasPlanCuenta = respuesta.empresas;
        this.monedas = respuesta.monedas;
        this.formulario.get('id').setValue(this.ultimoId);
        this.formulario.get('condicionCompra').setValue(this.condicionesCompras[0]);
        //Crea cuenta bancaria
        this.crearCuentasContables(respuesta.empresas);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Establece el formulario
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
    this.indiceSeleccionado == 3 ? this.verificarCBU() : '';


    /* Establece las cuentas bancarias del Proveedor */
    this.listaCuentaBancaria.data = elemento.proveedorCuentasBancarias;
    this.listaCuentaBancaria.sort = this.sort;

    /* Establece las cuentas contables del Proveedor */
    if (elemento.proveedorCuentasContables.length > 0) {
      elemento.proveedorCuentasContables.forEach(
        item => {
          this.establecerCuentasContablesProveedor(item);
        }
      )
    }
  }
  // Establece las cuentas contables del proveedor en la empresa correspondiente
  private establecerCuentasContablesProveedor(proveedorCuentaContable) {
    for (let i = 0; i < this.planesCuentas.data.length; i++) {
      if (this.planesCuentas.data[i].empresa.id == proveedorCuentaContable.empresa.id) {
        this.planesCuentas.data[i] = proveedorCuentaContable;
      }
    }
  }
  //Crea la lista de planes de cuenta
  public crearCuentasContables(empresas): void {
    this.loaderService.show();
    let planesCuentas = [];
    let formulario = null;
    for (let i = 0; i < empresas.length; i++) {
      formulario = {
        empresa: empresas[i],
        planCuentaCompra: null
      }
      planesCuentas.push(formulario);
    }
    this.planesCuentas = new MatTableDataSource(planesCuentas);
    this.planesCuentas.sort = this.sort;
    this.loaderService.hide();
  }
  //Abre el dialogo Plan de Cuenta
  public asignarPlanCuenta(elemento) {
    const dialogRef = this.dialog.open(PlanCuentaDialogo, {
      width: '95%',
      height: '70%',
      data: {
        empresa: elemento.empresa,
        grupoCuentaContable: 4
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        let planCuenta = {
          id: resultado.id,
          version: resultado.version,
          nombre: resultado.nombre
        }
        elemento.planCuentaCompra = planCuenta;
        if (this.indiceSeleccionado == 3) {
          elemento.proveedor = {
            id: this.formulario.get('id').value,
            version: this.formulario.get('version').value
          }
          this.actualizarCuentaContable(elemento);
        }
      }
    });
  }
  //Actualiza una cuenta contable
  private actualizarCuentaContable(elemento) {
    this.loaderService.show();
    this.proveedorCuentaContableService.actualizar(elemento).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.toastr.success(MensajeExcepcion.ACTUALIZADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
        this.loaderService.hide();
      }
    );
  }
  //Elimina la cuenta contable de la empresa
  public eliminarPlanCuenta(elemento) {
    const id = elemento.id;
    if (this.indiceSeleccionado == 3) {
      this.eliminarCuentaContablePorId(id);
    }
    elemento.planCuentaCompra = null;
  }
  //Elimina la cuenta contable seleccionada
  private eliminarCuentaContablePorId(id) {
    this.loaderService.show();
    this.proveedorCuentaContableService.eliminar(id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.establecerFormulario();
          this.toastr.success(MensajeExcepcion.ELIMINADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        this.loaderService.hide();
      }
    );
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('estaActiva').setValue(true);
    this.condicionesCompras.length > 0 ?
      this.formulario.get('condicionCompra').setValue(this.condicionesCompras[0]) : '';
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.idMod = null;
    this.resultados = [];
    this.sucursales = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.listaCompleta = new MatTableDataSource([]);
    this.listaCuentaBancaria = new MatTableDataSource([]);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('tipoProveedor').enable();
      this.formulario.get('afipCondicionIva').enable();
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('condicionCompra').enable();
      this.formulario.get('estaActiva').enable();
      //Deshabilita los campos del formulario de Cuenta Bancaria en pestaña Actualizar
      this.banco.enable();
      this.formularioCuentaBancaria.get('moneda').enable();
      this.formularioCuentaBancaria.get('sucursalBanco').enable();
      this.formularioCuentaBancaria.get('tipoCuentaBancaria').enable();
      this.formularioCuentaBancaria.get('cbu').enable();
      this.formularioCuentaBancaria.get('titular').enable();
      this.formularioCuentaBancaria.get('aliasCBU').enable();
      this.formularioCuentaBancaria.get('numeroCuenta').enable();
      this.formularioCuentaBancaria.get('porDefecto').enable();
      this.formularioCuentaBancaria.get('estaActiva').enable();
    } else {
      this.formulario.get('tipoProveedor').disable();
      this.formulario.get('afipCondicionIva').disable();
      this.formulario.get('tipoDocumento').disable();
      this.formulario.get('condicionCompra').disable();
      this.formulario.get('estaActiva').disable();
      //Habilita los campos del formulario de Cuenta Bancaria
      this.banco.disable();
      this.formularioCuentaBancaria.get('moneda').disable();
      this.formularioCuentaBancaria.get('sucursalBanco').disable();
      this.formularioCuentaBancaria.get('tipoCuentaBancaria').disable();
      this.formularioCuentaBancaria.get('cbu').disable();
      this.formularioCuentaBancaria.get('titular').disable();
      this.formularioCuentaBancaria.get('aliasCBU').disable();
      this.formularioCuentaBancaria.get('numeroCuenta').disable();
      this.formularioCuentaBancaria.get('porDefecto').disable();
      this.formularioCuentaBancaria.get('estaActiva').disable();
    }
  }
  /* Habilita o deshabilita los campos del formulario de Cuenta Bancaria 
    cuando se presiona en actualizar un registro de la tabla de Liquidacion*/
  private establecerModCamposCuentaBancaria() {
    this.banco.disable();
    this.formularioCuentaBancaria.get('moneda').disable();
    this.formularioCuentaBancaria.get('sucursalBanco').disable();
    this.formularioCuentaBancaria.get('tipoCuentaBancaria').disable();
    this.formularioCuentaBancaria.get('cbu').disable();
    this.formularioCuentaBancaria.get('titular').disable();
    this.formularioCuentaBancaria.get('aliasCBU').disable();
    this.formularioCuentaBancaria.get('numeroCuenta').disable();
    this.formularioCuentaBancaria.get('porDefecto').enable();
    this.formularioCuentaBancaria.get('estaActiva').enable();
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    /* Limpia el formulario para no mostrar valores en campos cuando 
      la pestaña es != 1 */
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idRazonSocial');
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
        this.establecerFormularioFiltro();
        break;
      default:
        break;
    }
  }
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch (opcion) {
      case 8:
        setTimeout(function () {
          document.getElementById('idRazonSocial').focus();
        }, 20);
        break;
      case 9:
        setTimeout(function () {
          document.getElementById('idCondicionCompra').focus();
        }, 20);
        break;
      case 10:
        setTimeout(function () {
          document.getElementById('idBanco').focus();
        }, 20);
        break;
      case 11:
        setTimeout(function () {
          document.getElementById('idObservaciones').focus();
        }, 20);
        break;
      case 12:
        setTimeout(function () {
          document.getElementById('idIngresarComprobante').focus();
        }, 20);
        break;
      default:
        setTimeout(function () {
          document.getElementById('idTipoProveedorFiltro').focus();
        }, 20);
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
      case 5:
        this.listarPorFiltros();
        break;
      default:
        break;
    }
  }
  //Lista los registros por el formularioFiltro
  private listarPorFiltros() {
    this.loaderService.show();
    let condicionCompra = this.formularioFiltro.get('condicionCompra').value;
    let tipoProveedor = this.formularioFiltro.get('tipoProveedor').value;
    let formularioConsulta = {
      idLocalidad: this.opcionLocalidadFiltro.value == 0 ? 0 : this.formularioFiltro.value.localidad.id,
      idTipoProveedor: tipoProveedor == 0 ? 0 : this.formularioFiltro.value.tipoProveedor.id,
      idCondicionCompra: condicionCompra == 0 ? 0 : this.formularioFiltro.value.condicionCompra.id,
    }
    this.servicio.listarPorFiltros(formularioConsulta).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        if (this.listaCompleta.data.length == 0) {
          this.toastr.warning("Sin registros para mostrar.");
        }
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
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formulario.get('proveedorCuentasContables').setValue(this.planesCuentas.data);
    this.formulario.get('proveedorCuentasBancarias').setValue(this.listaCuentaBancaria.data);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idRazonSocial').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.formulario.get('proveedorCuentasContables').setValue(null);
    this.formulario.get('proveedorCuentasBancarias').setValue(this.listaCuentaBancaria.data);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario(null);
        document.getElementById('idAutocompletado').focus();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Reestablece el formulario General
  private reestablecerFormulario(id) {
    this.vaciarListas();
    this.formulario.reset();
    this.autocompletado.reset();
    this.establecerValoresPorDefecto();
    this.reestablecerFormularioCB();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);

    /* Limpia la tabla de Cuentas Contables */
    this.limpiarCuentasContables();
    /* Establece la primera opcion del sidenav */
    if (this.indiceSeleccionado != 5)
      this.seleccionarOpcion(8, 0);
    else
      this.seleccionarOpcion(null, 0);

  }
  //Limpia la tabla de Cuentas Contables
  private limpiarCuentasContables() {
    this.planesCuentas.data.forEach(
      item => {
        /* limpia las cuentas bancarias asignadas  */
        if (item.planCuentaCompra) {
          item.id = null;
          item.planCuentaCompra = null;
        }
      }
    )
  }
  //Reestablece el formulario de Cuenta Bancaria
  private reestablecerFormularioCB() {
    this.banco.enable();
    this.banco.reset();
    this.idMod = null;
    this.sucursales = [];
    this.formularioCuentaBancaria.reset();
  }
  //Obtiene las sucursales del banco seleccionado y setea la correcta
  private establecerSucursal(idBanco, sucursal) {
    this.sucursalService.listarPorBanco(idBanco).subscribe(
      res => {
        this.sucursales = res.json();
      }
    )
    this.formulario.value.sucursalBanco = sucursal; //Setea el banco
  }
  //Reestablece e inicializa el formulario filtro
  private establecerFormularioFiltro() {
    this.formularioFiltro.reset();
    this.opcionLocalidadFiltro.setValue(0);
    this.formularioFiltro.get('tipoProveedor').setValue(0);
    this.formularioFiltro.get('condicionCompra').setValue(0);
    setTimeout(function () {
      document.getElementById('idTipoProveedorFiltro').focus();
    }, 20);
  }
  //Recorre la lista de Cuentas Bancarias y determina si ya fue asignado anteriormente 
  private verificarListaCB(elemento) {
    //Establece un boolean como control
    let bandera = false;
    for (let i = 0; i < this.listaCuentaBancaria.data.length; i++) {
      let cbuLista = this.listaCuentaBancaria.data[i].cbu;
      let numeroCuentaLista = this.listaCuentaBancaria.data[i].numeroCuenta;
      /*Por proveedor no controlo porque es siempre el mismo a quien se agregan las distinas
        cuentas bancarias */
      if (elemento.cbu == cbuLista && elemento.numeroCuenta == numeroCuentaLista) {
        bandera = true;
        break;
      }
    }
    return bandera;
  }
  //Agrega una cuenta banaria a la tabla - lista
  public agregarCuentaBancaria() {
    let elemento = this.formularioCuentaBancaria.value;
    if (!this.verificarListaCB(elemento)) {
      this.listaCuentaBancaria.data.push(this.formularioCuentaBancaria.value);
      this.listaCuentaBancaria.sort = this.sort;
      this.reestablecerFormularioCB();
      document.getElementById("idBanco").focus();
    } else {
      this.toastr.error(MensajeExcepcion.REGISTRO_EXISTENTE_LISTA);
      document.getElementById("idBanco").focus();
    }
  }
  //Elimina un registro de la lista y tabla de Cuentas Bancarias
  public eliminarCuentaBancaria(indice, idCuentaBancaria) {
    if (idCuentaBancaria) {
      this.eliminarCuentaBancariaPorId(idCuentaBancaria);
    } else {
      this.listaCuentaBancaria.data.splice(indice, 1);
      this.listaCuentaBancaria.sort = this.sort;
    }
  }
  //Elimina la cuenta bancaria seleccionada
  private eliminarCuentaBancariaPorId(id) {
    this.loaderService.show();
    this.proveedorCuentaBancariaService.eliminar(id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          //Establece la nueva lista de cuentas bancarias del proveedor
          this.listarCuentaBancariaPorPersonal(this.formulario.value.id);
          this.toastr.success(MensajeExcepcion.ELIMINADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        this.loaderService.hide();
      }
    )
  }
  //Obtiene la nueva lista de cuentas bancarias para un proveedor
  private listarCuentaBancariaPorPersonal(idProveedor) {
    this.proveedorCuentaBancariaService.listarPorProveedor(idProveedor).subscribe(
      res => {
        let respuesta = res.json();
        this.listaCuentaBancaria.data = respuesta;
        this.listaCuentaBancaria.sort = this.sort;
        respuesta.length == 0 ? this.toastr.warning("Sin cuentas bancarias para mostrar.") : '';
      },
      err => {
        let error = err.json();
        this.toastr.error(err.mensaje);
      }
    )
  }
  //Prepara los datos del registro seleccionado para poder actualizar
  public activarModCuentaBancaria(elemento, indice) {
    this.idMod = indice;
    this.banco.setValue(elemento.sucursalBanco.banco);
    this.formularioCuentaBancaria.patchValue(elemento);
    this.establecerSucursal(elemento.sucursalBanco.banco.id, elemento.sucursalBanco);
    document.getElementById("idBanco").focus();
  }
  //Actualiza el registro, seleccionado, en la lista - tabla
  public actualizarCuentaBancaria() {
    this.loaderService.show();
    //En pestaña 'Actualizar' se habilita el formulario porque hay campos deshabilitados
    this.formularioCuentaBancaria.enable();
    //si el registro a modificar tiene asignado un 'id' entonces actualiza en el back
    if (this.formularioCuentaBancaria.value.id) {
      //establezco el Personal a Cuenta Bancaria
      this.formularioCuentaBancaria.value.proveedor = { id: this.autocompletado.value.id }
      this.proveedorCuentaBancariaService.actualizar(this.formularioCuentaBancaria.value).subscribe(
        res => {
          let respuesta = res.json();
          if (respuesta.codigo == 200) {
            //establece la lista de cuentas bancarias, actualizada, del personal
            this.listarCuentaBancariaPorProveedor(this.formulario.value.id);
            this.toastr.success("Registro actualizado con éxito.");
          }
        },
        err => {
          let error = err.json();
          this.toastr.error(error.mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      /* limpia el registro que se actualizo en la posicion idMod para luego agregarlo
      y poder controlar la unicidad del numeroCuenta y cbu */
      this.listaCuentaBancaria.data[this.idMod] = {};
      let registroActualizado = this.formularioCuentaBancaria.value;
      if (!this.verificarListaCB(registroActualizado)) {
        this.listaCuentaBancaria.data[this.idMod] = registroActualizado;
        this.listaCuentaBancaria.sort = this.sort;
        this.reestablecerFormularioCB();
        document.getElementById("idBanco").focus();
      } else {
        this.toastr.error("Cuenta Bancaria ya agregada a la lista.");
        document.getElementById("idBanco").focus();
      }
      this.loaderService.hide();
    }
  }
  //Obtiene la nueva lista de cuentas bancarias para un personal
  private listarCuentaBancariaPorProveedor(idProveedor) {
    this.proveedorCuentaBancariaService.listarPorProveedor(idProveedor).subscribe(
      res => {
        let respuesta = res.json();
        this.listaCuentaBancaria.data = respuesta;
        this.listaCuentaBancaria.sort = this.sort;
        respuesta.length == 0 ? this.toastr.warning("Sin cuentas bancarias para mostrar.") : '';
        this.reestablecerFormularioCB();
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Lanza error (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err;
    if (respuesta.codigo == 11006) {
      document.getElementById("labelRazonSocial").classList.add('label-error');
      document.getElementById("idRazonSocial").classList.add('is-invalid');
      document.getElementById("idRazonSocial").focus();
    } else if (respuesta.codigo == 11009) {
      document.getElementById("labelTelefono").classList.add('label-error');
      document.getElementById("idTelefono").classList.add('is-invalid');
      document.getElementById("idTelefono").focus();
    } else if (respuesta.codigo == 11008) {
      document.getElementById("labelSitioWeb").classList.add('label-error');
      document.getElementById("idSitioWeb").classList.add('is-invalid');
      document.getElementById("idSitioWeb").focus();
    } else if (respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    } else if (respuesta.codigo == 11011) {
      document.getElementById("labelNumeroCBU").classList.add('label-error');
      document.getElementById("idNumeroCBU").classList.add('is-invalid');
      document.getElementById("idNumeroCBU").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Cambio en el campo Localidad del formulario filtro en pestaña Listar
  public cambioLocalidadFiltro() {
    this.formularioFiltro.get('localidad').reset();
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'telefonoFijo') {
          document.getElementById("labelSitioWeb").classList.add('label-error');
          document.getElementById("idSitioWeb").classList.add('is-invalid');
          this.toastr.error('Sitio Web incorrecto');
        }
      }
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if (!respuesta2) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if (!respuesta8) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Verifica que el CBU sea de 22 carácteres obligatorios
  public verificarCBU() {
    let elemento = this.formulario.value.numeroCBU;
    elemento && elemento.length < 22 ?
      [
        this.toastr.error("El N° de CBU debe ser de 22 carácteres. Se reseteó el campo."),
        this.formulario.get('numeroCBU').reset(),
      ] : '';
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento ? 'Suspendida' : 'Activa';
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    var opcion = this.opcionSeleccionada;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    } else if (keycode == 115) {
      if (opcion < this.opciones[(this.opciones.length - 1)].id) {
        this.seleccionarOpcion(opcion + 1, opcion - 7);
      } else {
        this.seleccionarOpcion(8, 0);
      }
    }
  }
  //Mascara numeros enteros
  public mascararEnteros(limit) {
    return this.appService.mascararEnteros(limit);
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        razon_social: elemento.razonSocial,
        tipodo_cumento: elemento.tipoDocumento.nombre,
        numero_documento: elemento.numeroDocumento,
        telefono: elemento.telefono,
        domicilio: elemento.domicilio,
        localidad: elemento.localidad.nombre + ', ' + elemento.localidad.provincia.nombre
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Proveedores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}