import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiculoProveedorService } from '../../servicios/vehiculo-proveedor.service';
import { ChoferProveedorService } from '../../servicios/chofer-proveedor.service';
import { ConfiguracionVehiculoService } from '../../servicios/configuracion-vehiculo.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { VehiculoProveedor } from 'src/app/modelos/vehiculoProveedor';

@Component({
  selector: 'app-vehiculo-proveedor',
  templateUrl: './vehiculo-proveedor.component.html',
  styleUrls: ['./vehiculo-proveedor.component.css']
})
export class VehiculoProveedorComponent implements OnInit {
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
  //Define la lista de tipos de vehiculos
  public tiposVehiculos: Array<any> = [];
  //Define la lista de marcas de vehiculos
  public marcasVehiculos: Array<any> = [];
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de proveedores
  public resultadosProveedores: Array<any> = [];
  //Define la lista de resultados de choferes proveedores
  public resultadosChoferesProveedores: Array<any> = [];
  //Define la lista de resultados de busqueda vehiculo remolque
  public resultadosVehiculosRemolques: Array<any> = [];
  //Define la lista de resultados de busqueda compania seguro
  public resultadosCompaniasSeguros: Array<any> = [];
  //Define la lista de resultados de configuraciones vehiculos
  public configuracionesVehiculos: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'DOMINIO', 'TIPO_VEHICULO', 'MARCA_VEHICULO', 'COMPANIA_SEGURO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: VehiculoProveedorService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private loaderService: LoaderService, private modelo: VehiculoProveedor,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private proveedorServicio: ProveedorService,
    private companiaSeguroServicio: CompaniaSeguroService, private choferProveedorServicio: ChoferProveedorService,
    private configuracionVehiculoServicio: ConfiguracionVehiculoService, private appService: AppService,
    private reporteServicio: ReporteService) {
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
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
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
    this.formulario = this.modelo.formulario;
    //Autocompletado Proveedor - Buscar por alias
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.proveedorServicio.listarPorAlias(data).subscribe(res => {
          this.resultadosProveedores = res;
        })
      }
    })
    //Autocompletado Chofer Proveedor - Buscar por alias
    this.formulario.get('choferProveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.choferProveedorServicio.listarPorAlias(data).subscribe(res => {
          this.resultadosChoferesProveedores = res;
        })
      }
    })
    //Autocompletado - Buscar por alias filtro remolque
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCompaniasSeguros = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
  }
  //Obtiene la lista de tipos de vehiculos
  private listarTiposVehiculos() {
    this.tipoVehiculoServicio.listar().subscribe(res => {
      this.tiposVehiculos = res.json();
    })
  }
  //Obtiene la lista de marcas de vehiculos
  private listarMarcasVehiculos() {
    this.marcaVehiculoServicio.listar().subscribe(res => {
      this.marcasVehiculos = res.json();
    })
  }
  //Obtiene la lista por proveedor
  public listarPorProveedor(): void {
    this.loaderService.show();
    let proveedor = this.formulario.get('proveedor').value;
    this.servicio.listarPorProveedor(proveedor.id).subscribe(
      res => {
        let respuesta = res.json();
        this.listaCompleta = new MatTableDataSource(respuesta);
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        respuesta.length == 0? this.toastr.error("Sin registros para mostrar.") : '';
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosProveedores = [];
    this.resultadosChoferesProveedores = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosCompaniasSeguros = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('tipoVehiculo').enable();
      this.formulario.get('marcaVehiculo').enable();
    } else {
      this.formulario.get('tipoVehiculo').disable();
      this.formulario.get('marcaVehiculo').disable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura,
    boton, componente) {
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
    this.reestablecerFormulario(undefined);
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
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
          document.getElementById('idProveedor').focus();
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
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idProveedor').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        if (error.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        }
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error = err.json();
        if (error.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        }
        this.toastr.error(error.mensaje);
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
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          this.toastr.success(respuesta.mensaje);
          document.getElementById('idAutocompletado').focus();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        if (error.codigo == 500) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idAutocompletado").classList.add('is-invalid');
          document.getElementById("idAutocompletado").focus();
          this.toastr.error(error.mensaje);
        } else{
          this.toastr.error(error.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
  private listarConfiguracionesPorTipoVehiculoMarcaVehiculo() {
    let tipoVehiculo = this.formulario.get('tipoVehiculo').value;
    let marcaVehiculo = this.formulario.get('marcaVehiculo').value;
    if (tipoVehiculo != null && marcaVehiculo != null) {
      this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
        .subscribe(
          res => {
            this.configuracionesVehiculos = res.json();
          },
          err => {
          }
        )
    }
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
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
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
  //Muestra el valor en los autocompletados
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor de otro autocompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Mascara un numero sin decimal
  public mascararNumero(limit) {
    return this.appService.mascararEnteros(limit);
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        dominio: elemento.dominio,
        tipo_vehiculo: elemento.tipoVehiculo.nombre,
        marca_vehiculo: elemento.marcaVehiculo.nombre,
        compania_seguro: elemento.companiaSeguro.nombre
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Vehiculos Proveedores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}