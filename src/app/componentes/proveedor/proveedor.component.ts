import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from '../../servicios/proveedor.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AfipCondicionIvaService } from '../../servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { TipoProveedorService } from '../../servicios/tipo-proveedor.service';
import { CondicionCompraService } from '../../servicios/condicion-compra.service';
import { BancoService } from '../../servicios/banco.service';
import { TipoCuentaBancariaService } from '../../servicios/tipo-cuenta-bancaria.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Proveedor } from 'src/app/modelos/proveedor';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { PlanCuentaDialogo } from '../plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
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
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
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
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda de barrios
  public resultadosBarrios: Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de bancos
  public resultadosBancos: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'RAZON_SOCIAL', 'TIPO_DOCUMENTO', 'NUMERO_DOCUMENTO', 'TELEFONO', 'DOMICILIO', 'LOCALIDAD', 'EDITAR'];
  //Define las columnas de la tabla
  public columnasPlanCuenta: string[] = ['empresa', 'cuentaContable', 'planCuenta', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: ProveedorService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private afipCondicionIvaServicio: AfipCondicionIvaService,
    private tipoDocumentoServicio: TipoDocumentoService, private tipoProveedorServicio: TipoProveedorService,
    private condicionCompraServicio: CondicionCompraService, private bancoServicio: BancoService,
    private tipoCuentaBancariaServicio: TipoCuentaBancariaService, private proveedorModelo: Proveedor,
    private loaderService: LoaderService, private usuarioEmpresaService: UsuarioEmpresaService, private dialog: MatDialog,
    private reporteServicio: ReporteService) {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    this.loaderService.show();
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
    //Obtiene la lista de opciones por rol y subopcion
    this.rolOpcionServicio.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.opciones = res.json();
          this.loaderService.hide();
        },
        err => {
          this.loaderService.hide();
        }
      );
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultados = response;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.proveedorModelo.formulario;
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Banco - Buscar por nombre
    this.formulario.get('banco').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.bancoServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBancos = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(8, 0);
    //Obtiene la lista de tipos de proveedores
    this.listarTiposProveedores();
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de condiciones de compra
    this.listarCondicionesCompras();
    //Obtiene la lista de tipos de cuentas bancarias
    this.listarTiposCuentasBancarias();
  }
  //Establece el formulario
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
    if (elemento.proveedorCuentasContables.length == 0) {
      this.crearCuentasContables();
    } else {
      this.planesCuentas = new MatTableDataSource(elemento.proveedorCuentasContables);
      this.planesCuentas.sort = this.sort;
    }
  }
  //Crea la lista de planes de cuenta
  public crearCuentasContables(): void {
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    let token = localStorage.getItem('token');
    this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(usuario.id, token).subscribe(
      res => {
        let planesCuentas = [];
        let empresas = res.json();
        let formulario = null;
        for (let i = 0; i < empresas.length; i++) {
          formulario = {
            empresa: empresas[i],
            planCuenta: null
          }
          planesCuentas.push(formulario);
        }
        this.planesCuentas = new MatTableDataSource(planesCuentas);
        this.planesCuentas.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
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
        elemento.planCuenta = planCuenta;
      }
    });
  }
  //Elimina la cuenta contable de la empresa
  public eliminarPlanCuenta(elemento) {
    elemento.planCuenta = null;
  }
  //Obtiene el listado de tipos de proveedores
  private listarTiposProveedores() {
    this.tipoProveedorServicio.listar().subscribe(
      res => {
        this.tiposProveedores = res.json();
      }
    );
  }
  //Obtiene el listado de condiciones de iva
  private listarCondicionesIva() {
    this.afipCondicionIvaServicio.listar().subscribe(
      res => {
        this.condicionesIva = res.json();
      }
    );
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
      }
    );
  }
  //Obtiene el listado de condiciones de compras
  private listarCondicionesCompras() {
    this.condicionCompraServicio.listar().subscribe(
      res => {
        this.condicionesCompras = res.json();
        this.formulario.get('condicionCompra').setValue(this.condicionesCompras[0]);
      }
    );
  }
  //Obtiene el listado de tipos de cuentas bancarias
  private listarTiposCuentasBancarias() {
    this.tipoCuentaBancariaServicio.listar().subscribe(
      res => {
        this.tiposCuentasBancarias = res.json();
      }
    );
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('estaActiva').setValue(true);
    this.formulario.get('condicionCompra').setValue(this.condicionesCompras[0]);
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosBancos = [];
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('tipoProveedor').enable();
      this.formulario.get('afipCondicionIva').enable();
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('condicionCompra').enable();
      this.formulario.get('estaActiva').enable();
      this.formulario.get('tipoCuentaBancaria').enable();
    } else {
      this.formulario.get('tipoProveedor').disable();
      this.formulario.get('afipCondicionIva').disable();
      this.formulario.get('tipoDocumento').disable();
      this.formulario.get('condicionCompra').disable();
      this.formulario.get('estaActiva').disable();
      this.formulario.get('tipoCuentaBancaria').disable();
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
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(undefined);
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
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
        this.listar();
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
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formulario.get('proveedorCuentasContables').setValue(this.planesCuentas.data);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
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
    this.formulario.get('proveedorCuentasContables').setValue(this.planesCuentas.data);
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
        this.reestablecerFormulario(undefined);
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
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
    this.crearCuentasContables();
    this.establecerValoresPorDefecto();
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
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.formulario.get('numeroDocumento').reset();
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if (!respuesta2) {
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.formulario.get('numeroDocumento').reset();
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if (!respuesta8) {
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.formulario.get('numeroDocumento').reset();
            this.lanzarError(err);
          }
          break;
      }
    }
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
    this.formulario.setValue(elemento);
    this.planesCuentas = new MatTableDataSource(elemento.proveedorCuentasContables);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.planesCuentas = new MatTableDataSource(elemento.proveedorCuentasContables);
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