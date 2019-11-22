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
import { ToastrService } from 'ngx-toastr'
import { Vehiculo } from 'src/app/modelos/vehiculo';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { PdfDialogoComponent } from '../pdf-dialogo/pdf-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';

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
  //Define la lista de tipos de imagenes
  private tiposImagenes = ['image/png', 'image/jpg', 'image/jpeg'];
  //Define si el tipo vehiculo es vtoSanidadAlimenticia
  public esVtoSanidadAlimenticia: boolean = false;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['DOMINIO', 'ID', 'TIPO_VEHICULO', 'MARCA_VEHICULO', 'CONFIGURACION', 'COMPAÑIA_SEGURO', 'POLIZA', 'PDF_TITULO',
    'PDF_CEDULA_IDENT', 'PDF_VTO_RUTA', 'PDF_INSP_TECNICA', 'PDF_VTO_SENASA', 'PDF_HAB_BROMAT', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort; _
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: VehiculoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private loaderService: LoaderService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private localidadServicio: LocalidadService, private empresaServicio: EmpresaService,
    private companiaSeguroPolizaServicio: CompaniaSeguroPolizaService, private companiaSeguroService: CompaniaSeguroService,
    private configuracionVehiculoServicio: ConfiguracionVehiculoService, private pdfServicio: PdfService, public dialog: MatDialog,
    private personalServicio: PersonalService, private vehiculoModelo: Vehiculo, private appService: AppService, private reporteServicio: ReporteService) {
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
        this.personalServicio.listarChoferActivoPorAlias(data).subscribe(response => {
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
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de Compania de Seguro
    this.listarCompaniasSeguroPorEmpresa();
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
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.loaderService.show();
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        this.loaderService.hide();
        let elemento = res.json();
        this.formulario.patchValue(elemento);
        this.establecerFotoYPdfs(elemento);
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Establece la foto y pdf (actilet consultar/actualizar)
  private establecerFotoYPdfs(elemento): void {
    this.autocompletado.setValue(elemento);
    if (elemento.pdfTitulo) {
      this.formulario.get('pdfTitulo').patchValue(elemento.pdfTitulo);
      this.formulario.get('pdfTitulo.datos').setValue(atob(elemento.pdfTitulo.datos));
    }
    if (elemento.pdfCedulaIdent) {
      this.formulario.get('pdfCedulaIdent').patchValue(elemento.pdfCedulaIdent);
      this.formulario.get('pdfCedulaIdent.datos').setValue(atob(elemento.pdfCedulaIdent.datos));
    }
    if (elemento.pdfVtoRuta) {
      this.formulario.get('pdfVtoRuta').patchValue(elemento.pdfVtoRuta);
      this.formulario.get('pdfVtoRuta.datos').setValue(atob(elemento.pdfVtoRuta.datos));
    }
    if (elemento.pdfVtoInspTecnica) {
      this.formulario.get('pdfVtoInspTecnica').patchValue(elemento.pdfVtoInspTecnica);
      this.formulario.get('pdfVtoInspTecnica.datos').setValue(atob(elemento.pdfVtoInspTecnica.datos));
    }
    if (elemento.pdfVtoSenasa) {
      this.formulario.get('pdfVtoSenasa').patchValue(elemento.pdfVtoSenasa);
      this.formulario.get('pdfVtoSenasa.datos').setValue(atob(elemento.pdfVtoSenasa.datos));
    }
    if (elemento.pdfHabBromat) {
      this.formulario.get('pdfHabBromat').patchValue(elemento.pdfHabBromat);
      this.formulario.get('pdfHabBromat.datos').setValue(atob(elemento.pdfHabBromat.datos));
    }
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    this.listarConfiguracionesPorTipoVehiculoMarcaVehiculo();
    this.listarCompaniasSeguroPorEmpresa();
    let companiaSeguroPoliza = elemento.companiaSeguroPoliza;
    this.companiaSeguro.patchValue(companiaSeguroPoliza.companiaSeguro);
    this.listarPolizas();
    this.formulario.get('companiaSeguroPoliza').setValue(elemento.companiaSeguroPoliza);
    this.establecerConfiguracion();
  }
  //Obtiene la lista de compania de seguros poliza por empresa
  public listarCompaniasSeguroPorEmpresa(): void {
    this.loaderService.show();
    this.formulario.get('companiaSeguroPoliza').reset();
    this.companiaSeguro.reset();
    this.companiasSeguros = [];
    this.companiasSegurosPolizas = [];
    let empresa = this.appService.getEmpresa();
    this.companiaSeguroService.listarPorEmpresa(empresa.id).subscribe(res => {
      this.loaderService.hide();
      this.companiasSeguros = res.json();
    })
  }
  //Obtiene la lista de polizas por compania de seguro
  public listarPolizas(): void {
    this.loaderService.show();
    let companiaSeguro = this.companiaSeguro.value;
    this.companiaSeguroPolizaServicio.listarPorCompaniaSeguro(companiaSeguro.id).subscribe(res => {
      this.loaderService.hide();
      this.companiasSegurosPolizas = res.json();
    });
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerElemento() {
    this.limpiarCampos();
    let elemento = this.autocompletado.value;
    this.obtenerPorId(elemento.id);
  }
  //Limpia los campos en cada seleccion de vehiculo (campo buscar)
  private limpiarCampos() {
    this.formulario.reset();
    this.tipoVehiculo.reset();
    this.marcaVehiculo.reset();
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarLista() {
    this.resultados = [];
    this.companiasSeguros = [];
    this.resultadosPersonales = [];
    this.resultadosLocalidades = [];
    this.companiasSegurosPolizas = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosCompaniasSegurosPolizas = [];
    this.listaCompleta = new MatTableDataSource([]);
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
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(undefined);
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
  public listarVehiculosFiltro() {
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
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().message);
        this.loaderService.hide();
      });
  }
  //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
  public listarConfiguracionesPorTipoVehiculoMarcaVehiculo() {
    this.loaderService.show();
    let tipoVehiculo = this.tipoVehiculo.value;
    let marcaVehiculo = this.marcaVehiculo.value;
    this.configuracionesVehiculos = [];
    this.esVehiculoRemolque = tipoVehiculo.esRemolque ? true : false;
    if (this.esVehiculoRemolque) {
      this.formulario.get('personal').disable();
      this.formulario.get('personal').setValue(null);
      this.formulario.get('vehiculoRemolque').disable();
      this.formulario.get('vehiculoRemolque').setValue(null);
      this.formulario.get('numeroMotor').setValue(null);
    }
    else {
      this.formulario.get('personal').enable();
      this.formulario.get('vehiculoRemolque').enable();
    }
    if (tipoVehiculo.vtoSanidadAlimenticia) {
      this.esVtoSanidadAlimenticia = false;
      this.formulario.get('vtoSenasa').setValidators(Validators.required);
      this.formulario.get('vtoHabBromatologica').setValidators(Validators.required);
    } else {
      this.esVtoSanidadAlimenticia = true;
      this.formulario.get('vtoSenasa').setValidators([]);
      this.formulario.get('vtoHabBromatologica').setValidators([]);
    }
    this.formulario.get('vtoSenasa').updateValueAndValidity();
    this.formulario.get('vtoHabBromatologica').updateValueAndValidity();
    if (tipoVehiculo != null && marcaVehiculo != null) {
      this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
        .subscribe(
          res => {
            this.loaderService.hide();
            this.configuracionesVehiculos = res.json()
            if(this.configuracionesVehiculos.length == 0){
              this.configuracion.reset();
              this.formulario.get('configuracionVehiculo').reset();
              this.toastr.error("Sin registros en Lista de Configuraciones para el Tipo y Marca de Vehículo.");
            }else{
              this.formulario.get('configuracionVehiculo').enable();
            }
          }, err => { this.loaderService.hide(); }
        )
    } else {
      this.loaderService.hide();
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).then(
      res => {
        let respuesta = res.json();
        if (res.status == 201) {
          respuesta.then(data => {
            this.reestablecerFormulario(data.id);
            document.getElementById('idTipoVehiculo').focus();
            this.toastr.success(data.mensaje);
          }, err => { })
        } else {
          respuesta.then(err => {
            this.toastr.error(err.mensaje);
          })
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        //11017 el de domimio, 11018 numero interno (duplicado)
        if (error.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        }
        if (error.codigo == 11018) {
          document.getElementById("labelNumeroInterno").classList.add('label-error');
          document.getElementById("idNumeroInterno").classList.add('is-invalid');
          document.getElementById("idNumeroInterno").focus();
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
    this.servicio.actualizar(this.formulario.value).then(
      res => {
        let respuesta = res.json();
        if (res.status == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success('Registro actualizado con éxito');
        } else if (res.status == 500) {
          respuesta.then(data => {
            this.toastr.error(data.mensaje);
          });
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
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
    this.loaderService.show();
    let elemento = this.formulario.value;
    this.servicio.eliminar(elemento.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
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
    this.autocompletado.reset();
    this.tipoVehiculo.setValue(undefined);
    this.marcaVehiculo.setValue(undefined);
    this.configuracion.setValue(undefined);

    /* deshabilita el control'Lista de Configuraciones' */
    this.formulario.get('configuracionVehiculo').disable();
    this.vaciarLista();
  }
  /*
  * Establece la configuracion de vehiculo al seleccionar un item de la lista
  * configuraciones de vehiculos
  */
  public establecerConfiguracion() {
    let elemento = this.formulario.get('configuracionVehiculo').value;
    this.configuracion.reset();
    let tara = elemento.tara ? parseFloat(elemento.tara).toFixed(2) : '0.00';
    let altura = elemento.altura ? parseFloat(elemento.altura).toFixed(2) : '0.00';
    let largo = elemento.largo ? parseFloat(elemento.largo).toFixed(2) : '0.00';
    let ancho = elemento.ancho ? parseFloat(elemento.ancho).toFixed(2) : '0.00';
    this.configuracion.setValue('Modelo: ' + elemento.modelo +
      ' - Cantidad de Ejes: ' + elemento.cantidadEjes +
      ' - Capacidad de Carga: ' + elemento.capacidadCarga + '\n' +
      'Descripcion: ' + elemento.descripcion + '\n' +
      'Tara: ' + tara + ' - Altura: ' + altura + ' - Largo: ' + largo + ' - Ancho: ' + ancho);
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
    this.establecerElemento();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.establecerElemento();
  }
  //Obtiene el pdf para mostrarlo en la Tabla
  public obtenerPDFTabla(id, nombre) {
    if (id) {
      this.pdfServicio.obtenerPorId(id).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          nombre: resultado.nombre,
          datos: atob(resultado.datos)
        }
        this.formulario.get(nombre).patchValue(pdf);
        this.verPDF(nombre);
      })
    }
  }
  //Carga el archivo PDF 
  public readURL(event, campo): void {
    let extension = event.target.files[0].name.split('.');
    extension = extension[extension.length - 1];
    if (event.target.files && event.target.files[0] && extension == 'pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get(campo).patchValue(pdf);
        event.target.value = null;
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .pdf");
    }
  }
  //Elimina un pdf ya cargado, se pasa el campo como parametro
  public eliminarPdf(campo) {
    if (!this.formulario.get(campo).value) {
      this.toastr.success("Sin archivo adjunto");
    } else {
      this.formulario.get(campo).setValue('');
    }
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(campo) {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      maxWidth: '95%',
      maxHeight: '95%',
      data: {
        nombre: this.formulario.get(campo + '.nombre').value,
        datos: this.formulario.get(campo + '.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
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
        tipo_vehiculo: elemento.configuracionVehiculo.tipoVehiculo.nombre,
        dominio: elemento.dominio,
        marca_vehiculo: elemento.configuracionVehiculo.marcaVehiculo.nombre,
        configuracion: elemento.configuracionVehiculo.descripcion,
        compañia_seguro: elemento.companiaSeguroPoliza.companiaSeguro.nombre,
        poliza: elemento.companiaSeguroPoliza.numeroPoliza,
        pdf_titulo: elemento.pdfTitulo ? elemento.pdfTitulo.nombre : '',
        pdf_cedula_ident: elemento.pdfCedulaIdent ? elemento.pdfCedulaIdent.nombre : '',
        pdf_vto_ruta: elemento.pdfVtoRuta ? elemento.pdfVtoRuta.nombre : '',
        pdf_insp_tecnica: elemento.pdfVtoInspTecnica ? elemento.pdfVtoInspTecnica.nombre : '',
        pdf_vto_senasa: elemento.pdfVtoSenasa ? elemento.pdfVtoSenasa.nombre : '',
        pdf_hab_bromat: elemento.pdfHabBromat ? elemento.pdfHabBromat.nombre : ''
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Vehiculos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}