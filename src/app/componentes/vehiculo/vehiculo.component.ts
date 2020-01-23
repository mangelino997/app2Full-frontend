import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { LocalidadService } from '../../servicios/localidad.service';
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
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

export interface IPdf {
  id: null,
  version: null,
  nombre: null,
  tipo: null,
  tamanio: null,
  datos: null,
  tabla: null
}

const PDF: IPdf = {
  id: null,
  version: null,
  nombre: null,
  tipo: null,
  tamanio: null,
  datos: null,
  tabla: null
};

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
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
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda vehiculo remolque
  public resultadosVehiculosRemolques = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
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
  //Defiene el render
  public render: boolean = false;
  //Define las columnas de la tabla
  public columnas: string[] = ['DOMINIO', 'ID', 'TIPO_VEHICULO', 'MARCA_VEHICULO', 'CONFIGURACION', 'COMPAÑIA_SEGURO', 'POLIZA', 'PDF_TITULO',
    'PDF_CEDULA_IDENT', 'PDF_VTO_RUTA', 'PDF_INSP_TECNICA', 'PDF_VTO_SENASA', 'PDF_HAB_BROMAT', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort; _
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: VehiculoService, private toastr: ToastrService, private loaderService: LoaderService,
    private localidadServicio: LocalidadService, private companiaSeguroPolizaServicio: CompaniaSeguroPolizaService,
    private companiaSeguroService: CompaniaSeguroService, private configuracionVehiculoServicio: ConfiguracionVehiculoService,
    private pdfServicio: PdfService, public dialog: MatDialog, private personalServicio: PersonalService,
    private vehiculoModelo: Vehiculo, private appService: AppService, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorAlias(data).subscribe(response => {
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
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado - Buscar por alias filtro remolque
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorAliasYRemolqueTrue(data).subscribe(response => {
            this.resultadosVehiculosRemolques = response;
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
    //Autocompletado Personal - Buscar chofer por alias
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.personalServicio.listarChoferActivoPorAlias(data).subscribe(response => {
            this.resultadosPersonales = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    let empresa = this.appService.getEmpresa();
    this.servicio.inicializar(idRol, idSubopcion, empresa.id).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        this.activeLink = this.pestanias[0].nombre;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.empresas = respuesta.empresas;
        this.tiposVehiculos = respuesta.tipoVehiculos;
        this.marcasVehiculos = respuesta.marcaVehiculos;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Obtiene la lista de compania de seguros poliza por empresa
  public listarCompaniasSeguroPorEmpresa(empresa, companiaSeguroPoliza): void {
    this.companiaSeguro.reset();
    this.companiasSeguros = [];
    this.formulario.get('companiaSeguroPoliza').reset();
    if (empresa) {
      this.loaderService.show();
      this.companiaSeguroService.listarPorEmpresa(empresa.id).subscribe(
        res => {
          this.companiasSeguros = res.json();
          this.companiasSeguros.length == 0 ? this.toastr.warning("El Titular no tiene Compañía de Seguro asigandas.") : '';
          this.loaderService.hide();
          if(companiaSeguroPoliza) {
            this.listarPolizas(companiaSeguroPoliza);
          }
        },
        err => {
          this.loaderService.hide();
        })
    }
  }
  /*Obtiene la lista de polizas por compania de seguro. Puede recibir como parámetro la 'companiaSeguroPoliza'
   (caso Actualizar o Listar) */
  public listarPolizas(companiaSeguroPoliza): void {
    this.loaderService.show();
    let companiaSeguro = this.companiaSeguro.value;
    let empresa = this.formulario.get('empresa').value;
    this.companiaSeguroPolizaServicio.listarPorCompaniaSeguroYEmpresa(companiaSeguro.id, empresa.id).subscribe(
      res => {
        this.companiasSegurosPolizas = res.json();
        if (companiaSeguroPoliza) {
          this.formulario.get('companiaSeguroPoliza').setValue(companiaSeguroPoliza);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
      });
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerElemento() {
    this.limpiarCampos();
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(this.esteblecerPDFs(elemento));
    //Establece los formControls
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    //Llama a métodos para completar las listas
    this.listarCompaniasSeguroPorEmpresa(elemento.empresa, elemento.companiaSeguroPoliza);
    this.establecerConfiguracion();
    this.listarConfiguracionesPorTipoVehiculoMarcaVehiculo(false);
    //Establece compañia de seguro
    this.companiaSeguro.patchValue(elemento.companiaSeguroPoliza.companiaSeguro);
  }
  //Establece el formulario
  private esteblecerPDFs(elemento): any {
    elemento.pdfTitulo = elemento.pdfTitulo ? elemento.pdfTitulo : PDF;
    elemento.pdfCedulaIdent = elemento.pdfCedulaIdent ? elemento.pdfCedulaIdent : PDF;
    elemento.pdfVtoRuta = elemento.pdfVtoRuta ? elemento.pdfVtoRuta : PDF;
    elemento.pdfVtoInspTecnica = elemento.pdfVtoInspTecnica ? elemento.pdfVtoInspTecnica : PDF;
    elemento.pdfVtoSenasa = elemento.pdfVtoSenasa ? elemento.pdfVtoSenasa : PDF;
    elemento.pdfHabBromat = elemento.pdfHabBromat ? elemento.pdfHabBromat : PDF;
    return elemento;
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
    /* Limpia el formulario para no mostrar valores en campos cuando 
    la pestaña es != 1 */
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
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
    this.reestablecerFormulario();
    switch (id) {
      case 1:
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
        this.listaCompleta.data.length == 0 ? this.toastr.warning("Sin registros para mostrar") : '';
      },
      err => {
        this.toastr.error(err.json().message);
        this.loaderService.hide();
      });
  }
  //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
  public listarConfiguracionesPorTipoVehiculoMarcaVehiculo(reestablecer) {
    this.loaderService.show();
    if(reestablecer) {
      this.reestablecerCamposFormulario();
    }
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
      this.formulario.get('numeroMotor').setValidators([]);
    } else {
      this.formulario.get('numeroMotor').setValidators(Validators.required);
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
    this.formulario.get('numeroMotor').updateValueAndValidity();
    this.formulario.get('vtoSenasa').updateValueAndValidity();
    this.formulario.get('vtoHabBromatologica').updateValueAndValidity();
    if (tipoVehiculo != null && marcaVehiculo != null) {
      this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
        .subscribe(
          res => {
            this.loaderService.hide();
            this.configuracionesVehiculos = res.json()
            if (this.configuracionesVehiculos.length == 0) {
              this.configuracion.reset();
              this.formulario.get('configuracionVehiculo').reset();
              this.toastr.warning(MensajeExcepcion.SIN_REGISTROS);
            } else {
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
            this.ultimoId = data.id;
            this.reestablecerFormulario();
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
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(MensajeExcepcion.ACTUALIZADO);
        } else {
          this.toastr.error(respuesta.mensaje);
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
          this.reestablecerFormulario();
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
  //Verifica que el año de fabricación sea menor al año actual
  public verificarAnioFabricacion() {
    let anio = this.formulario.get('anioFabricacion').value;
    if (anio) {
      if(Number(anio) > 2020) {
        document.getElementById("labelAnioFabricacion").classList.add('label-error');
        document.getElementById("idAnioFabricacion").classList.add('is-invalid');
        document.getElementById("idAnioFabricacion").focus();
        this.toastr.error(MensajeExcepcion.ANIO_MENOR_ACTUAL);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.vaciarLista();
    this.formulario.reset();
    this.autocompletado.reset();
    this.tipoVehiculo.reset();
    this.marcaVehiculo.reset();
    this.configuracion.reset();
    this.companiaSeguro.reset();
    /*Deshabilita el control'Lista de Configuraciones'*/
    this.formulario.get('configuracionVehiculo').disable();
  }
  //Reestablece ciertos campos del formulario
  private reestablecerCamposFormulario(): void {
    this.vaciarLista();
    this.formulario.reset();
    this.autocompletado.reset();
    this.configuracion.reset();
    this.companiaSeguro.reset();
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
    let extension = event.target.files[0].type;
    if (extension == 'application/pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : 0,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get(campo).patchValue(pdf);
        event.target.value = null;
        if(this.indiceSeleccionado == 3) {
          this.actualizarPDF(campo, pdf);
        }
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .pdf");
    }
  }
  //Actualiza un pdf de un vehiculo
  private actualizarPDF(campo, pdf): void {
    this.loaderService.show();
    let idVehiculo = this.formulario.get('id').value;
    this.servicio.actualizarPDF(idVehiculo, campo, pdf).then(
      res => {
        if(res.status == 200) {
          res.json().then(
            data => {
              this.formulario.get('version').setValue(data.version);
              this.formulario.get(campo + '.id').setValue(data.pdfTitulo.id);
              this.formulario.get(campo + '.version').setValue(data.pdfTitulo.version);
            }
          );
          this.toastr.success(MensajeExcepcion.ACTUALIZADO);
        } else {
          this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un pdf ya cargado, se pasa el campo como parametro
  public eliminarPdf(campoNombre, campo) {
    if(this.indiceSeleccionado == 3) {
      this.eliminarPdfVehiculo(campoNombre, campo);
    } else {
      if (!this.formulario.get(campoNombre).value) {
        this.toastr.success("Sin archivo adjunto");
      } else {
        this.formulario.get(campo).reset();
      }
    }
  }
  //Elimina un pdf
  private eliminarPdfVehiculo(campoNombre, campo): void {
    this.loaderService.show();
    let idVehiculo = this.formulario.get('id').value;
    let idPdf = this.formulario.get(campo).value.id;
    this.servicio.eliminarPdf(idVehiculo, idPdf, campo).subscribe(
      res => {
        if(res.status == 200) {
          this.formulario.get('version').setValue(res.json());
          if (!this.formulario.get(campoNombre).value) {
            this.toastr.success("Sin archivo adjunto");
          } else {
            this.formulario.get(campo).reset();
          }
          this.toastr.success(MensajeExcepcion.ELIMINADO);
        } else {
          this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
        this.loaderService.hide();
      }
    );
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(campo) {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      maxWidth: '95%',
      maxHeight: '95%',
      data: {
        id: this.formulario.get(campo + '.id').value,
        datos: this.formulario.get(campo + '.datos').value,
        nombre: this.formulario.get(campo + '.nombre').value,
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