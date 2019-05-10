import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { ConfiguracionVehiculoService } from '../../servicios/configuracion-vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Vehiculo } from 'src/app/modelos/vehiculo';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit {
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
  //Define si mostrar la lista de configuraciones de vehiculos
  public mostrarConfiguracionVehiculo: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario listar para validaciones de campos
  public formularioListar: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de tipos de vehiculos
  public tiposVehiculos: Array<any> = [];
  //Define la lista de marcas de vehiculos
  public marcasVehiculos: Array<any> = [];
  //Define la lista de empresas
  public empresas: Array<any> = [];
  //Define la lista de configuraciones de vehiculos
  public configuracionesVehiculos: Array<any> = [];
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define un campo control para tipo vehiculo
  public tipoVehiculo: FormControl = new FormControl();
  //Define un campo control para marca vehiculo
  public marcaVehiculo: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define la lista de resultados de busqueda vehiculo remolque
  public resultadosVehiculosRemolques = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de busqueda compania seguro
  public resultadosCompaniasSegurosPolizas = [];
  //Define la lista de resultados de busqueda personal
  public resultadosPersonales = [];
  //Define el campo de control configuracion
  public configuracion: FormControl = new FormControl();
  //Define la lista de companias de suguros
  public companiasSeguros: Array<any> = [];
  //Defiene la lista de compania seguro poliza
  public companiasSegurosPolizas: Array<any> = [];
  //Define la compania de seguro
  public companiaSeguro: FormControl = new FormControl();
  //Define si el tipo de vehiculo seleccionado es remolque
  public esVehiculoRemolque: boolean = false;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'tipoVehiculo', 'marcaVehiculo', 'dominio', 'titular', 'localidad', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: VehiculoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private loaderService: LoaderService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private localidadServicio: LocalidadService, private empresaServicio: EmpresaService,
    private companiaSeguroPolizaServicio: CompaniaSeguroPolizaService, private companiaSeguroService: CompaniaSeguroService,
    private configuracionVehiculoServicio: ConfiguracionVehiculoService,
    private personalServicio: PersonalService, private vehiculoModelo: Vehiculo, private appService: AppService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol(), this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
          console.log(err);
        }
      );
    //Se subscribe al servicio de lista de registros
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
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
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.vehiculoModelo.formulario;
    //Define el formulario listar
    this.formularioListar = new FormGroup({
      tipoVehiculo: new FormControl('', Validators.required),
      marcaVehiculo: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required)
    });
    //Autocompletado - Buscar por alias filtro remolque
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAliasYRemolqueTrue(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
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
    //Autocompletado Personal - Buscar chofer por alias
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarChoferPorAlias(data).subscribe(response => {
          this.resultadosPersonales = response;
        })
      }
    })
    //Autocompletado Compania de Seguro - Buscar por nombre
    this.formulario.get('companiaSeguroPoliza').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.companiaSeguroPolizaServicio.listarPorCompaniaSeguroNombre(data).subscribe(response => {
          this.resultadosCompaniasSegurosPolizas = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista completa de registros
    // this.listar();
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
  //Obtiene la lista de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(res => {
      this.empresas = res.json();
    })
  }
  //Obtiene la lista de compania de seguros poliza por empresa
  public listarCompaniasSeguroPorEmpresa(): void {
    this.formulario.get('companiaSeguroPoliza').reset();
    this.companiaSeguro.reset();
    this.companiasSeguros = [];
    this.companiasSegurosPolizas = [];
    let empresa = this.formulario.get('empresa').value;
    this.companiaSeguroService.listarPorEmpresa(empresa.id).subscribe(res => {
      this.companiasSeguros = res.json();
    })
  }
  //Obtiene la lista de polizas por compania de seguro
  public listarPolizas(): void {
    let companiaSeguro = this.companiaSeguro.value;
    this.companiaSeguroPolizaServicio.listarPorCompaniaSeguro(companiaSeguro.id).subscribe(res => {
      this.companiasSegurosPolizas = res.json();
    });
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    this.establecerConfiguracion(elemento);
    this.listarCompaniasSeguroPorEmpresa();
    let companiaSeguroPoliza = elemento.companiaSeguroPoliza;
    this.companiaSeguro.setValue(companiaSeguroPoliza.companiaSeguro);
    this.listarPolizas();
    this.formulario.get('companiaSeguroPoliza').setValue(elemento.companiaSeguroPoliza);
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarLista() {
    this.resultados = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosLocalidades = [];
    this.resultadosCompaniasSegurosPolizas = [];
    this.resultadosPersonales = [];
    this.companiasSeguros = [];
    this.companiasSegurosPolizas = [];
  }
  //Establece selects solo lectura
  private establecerCamposSoloLectura(opcion): void {
    if (opcion) {
      this.tipoVehiculo.disable();
      this.marcaVehiculo.disable();
      this.formulario.get('empresa').disable();
      this.formulario.get('companiaSeguroPoliza').disable();
      this.companiaSeguro.disable();
    } else {
      this.tipoVehiculo.enable();
      this.marcaVehiculo.enable();
      this.formulario.get('empresa').enable();
      this.formulario.get('companiaSeguroPoliza').enable();
      this.companiaSeguro.enable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura,
    boton, configuracionVehiculo, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.mostrarConfiguracionVehiculo = configuracionVehiculo;
    this.tipoVehiculo.setValue(undefined);
    this.marcaVehiculo.setValue(undefined);
    this.configuracion.setValue(undefined);
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerCamposSoloLectura(false);
        this.establecerValoresPestania(nombre, false, false, true, true, 'idTipoVehiculo');
        break;
      case 2:
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, false, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerCamposSoloLectura(false);
        this.establecerValoresPestania(nombre, true, false, true, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerCamposSoloLectura(true);
        this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
        break;
      case 5:
        this.formularioListar.reset();
        setTimeout(function () {
          document.getElementById('idTipoVehiculo').focus();
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
        console.log(err);
      }
    );
  }
  //Obtiene el listado de registros
  public listarTodos() {
    this.loaderService.show();
    this.formularioListar.reset();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      });
  }
  //Obtiene el listado de registros por filtro
  public listar() {
    this.loaderService.show();
    let tipoVehiculo = this.formularioListar.get('tipoVehiculo').value;
    let marcaVehiculo = this.formularioListar.get('marcaVehiculo').value;
    let empresa = this.formularioListar.get('empresa').value;
    tipoVehiculo = tipoVehiculo == '1' ? 0 : tipoVehiculo.id;
    marcaVehiculo = marcaVehiculo == '1' ? 0 : marcaVehiculo.id;
    empresa = empresa == '1' ? 0 : empresa.id;
    this.servicio.listarFiltro(empresa, tipoVehiculo, marcaVehiculo).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      });
  }
  //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
  public listarConfiguracionesPorTipoVehiculoMarcaVehiculo() {
    let tipoVehiculo = this.tipoVehiculo.value;
    let marcaVehiculo = this.marcaVehiculo.value;
    this.esVehiculoRemolque = tipoVehiculo.esRemolque ? true : false;
    if (tipoVehiculo != null && marcaVehiculo != null) {
      this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
        .subscribe(
          res => {
            this.formulario.get('configuracionVehiculo').setValue(res.json());
            this.configuracionesVehiculos = res.json();
          },
          err => {
            console.log(err);
          }
        )
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        } else if (respuesta.codigo == 11018) {
          document.getElementById("labelNumeroInterno").classList.add('label-error');
          document.getElementById("idNumeroInterno").classList.add('is-invalid');
          document.getElementById("idNumeroInterno").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        } else if (respuesta.codigo == 11018) {
          document.getElementById("labelNumeroInterno").classList.add('label-error');
          document.getElementById("idNumeroInterno").classList.add('is-invalid');
          document.getElementById("idNumeroInterno").focus();
        }
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.tipoVehiculo.setValue(undefined);
    this.marcaVehiculo.setValue(undefined);
    this.configuracion.setValue(undefined);
    this.vaciarLista();
  }
  /*
  * Establece la configuracion de vehiculo al seleccionar un item de la lista
  * configuraciones de vehiculos
  */
  public establecerConfiguracion(elem) {
    let elemento = elem.configuracionVehiculo ? elem.configuracionVehiculo : elem;
    this.configuracion.setValue('Modelo: ' + elemento.modelo +
      ' - Cantidad de Ejes: ' + elemento.cantidadEjes +
      ' - Capacidad de Carga: ' + elemento.capacidadCarga + '\n' +
      'Descripcion: ' + elemento.descripcion + '\n' +
      'Tara: ' + parseFloat(elemento.tara).toFixed(2) +
      ' - Altura: ' + parseFloat(elemento.altura).toFixed(2) +
      ' - Largo: ' + parseFloat(elemento.largo).toFixed(2) +
      ' - Ancho: ' + parseFloat(elemento.ancho).toFixed(2));
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    // this.estableberValoresFormulario(elemento);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    // this.estableberValoresFormulario(elemento);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Establece los valores al "ver" o "modificar" desde la pestaña "lista"
  private estableberValoresFormulario(elemento) {
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    this.establecerConfiguracion(elemento);
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
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: ' + elemento.cantidadEjes +
        ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados d
  public displayFd(elemento) {
    if (elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados e
  public displayFe(elemento) {
    if (elemento != undefined) {
      return elemento.companiaSeguro ? elemento.companiaSeguro.nombre + ' - Empresa: ' + elemento.empresa.razonSocial +
        ' - N° Póliza: ' + elemento.numeroPoliza + ' - Vto. Póliza: ' + elemento.vtoPoliza : elemento;
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
  //Mascara un numero sin decimal
  public mascararNumero(limit) {
    return this.appService.mascararEnteros(limit);
  }
}