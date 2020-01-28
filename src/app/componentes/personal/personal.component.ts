import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonalService } from '../../servicios/personal.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Personal } from 'src/app/modelos/personal';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { FotoService } from 'src/app/servicios/foto.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { PdfDialogoComponent } from '../pdf-dialogo/pdf-dialogo.component';
import { BugImagenDialogoComponent } from '../bugImagen-dialogo/bug-imagen-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { BancoService } from 'src/app/servicios/banco.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { PersonalCuentaBancariaService } from 'src/app/servicios/personal-cuenta-bancaria.service';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
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
  //Define un formulario para filtrar (Listar)
  public formularioFiltro: FormGroup;
  //Define un formulario para personal-cuentaBancaria
  public formularioCuentaBancaria: FormGroup;
  //Define un formulario para validaciones de campos
  public personalActualizar: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista para las Cuentas Bancarias del proveedor
  public listaCuentaBancaria = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la fecha de hoy
  public fechaActual: string = null;
  //Define la lista de areas
  public areas: Array<any> = [];
  //Define la lista de sexos
  public sexos: Array<any> = [];
  //Define las listas de Monedas
  public monedas: Array<any> = [];
  //Define la lista de sucursales
  public sucursales: Array<any> = [];
  //Define la lista de sucursales donde el personal trabaja
  public sucursalesTrabajo: Array<any> = [];
  //Define la lista de sindicatos
  public sindicatos: Array<any> = [];
  //Define la lista de estados civiles
  public estadosCiviles: Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento: FormControl = new FormControl();
  //Define el banco de la opcion Banco, como un formControl
  public banco: FormControl = new FormControl();
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define las listas de Bancos
  public bancos: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda de barrios
  public resultadosBarrios: Array<any> = [];
  //Define la lista de tipos de cuentas bancarias
  public tiposCuentasBancarias: Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de categorias
  public resultadosCategorias: Array<any> = [];
  //Define la lista de resultados de busqueda de seguridad social
  public resultadosSeguridadesSociales: Array<any> = [];
  //Define la lista de resultados de busqueda de obra social
  public resultadosObrasSociales: Array<any> = [];
  //Define la lista de resultados de busqueda de afip actividad
  public resultadosAfipActividades: Array<any> = [];
  //Define la lista de resultados de busqueda de afip condicion
  public resultadosAfipCondiciones: Array<any> = [];
  //Define la lista de resultados de busqueda de afip localidad
  public resultadosAfipLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de afip mod contratacion
  public resultadosAfipModContrataciones: Array<any> = [];
  //Define la lista de resultados de busqueda de afip siniestrado
  public resultadosAfipSiniestrados: Array<any> = [];
  //Define la lista de resultados de busqueda de afip situacion
  public resultadosAfipSituaciones: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'TIPO DOCUMENTO', 'DOCUMENTO', 'TELEFONO MOVIL', 'DOMICILIO', 'LOCALIDAD', 'EDITAR'];
  //Define las columnas de la tabla para la opcion Bancos - lista de Cuentas Bancarias
  public columnasCuentaBancaria: string[] = ['BANCO', 'TIPO_CUENTA', 'TITULAR', 'NUMERO_CUENTA', 'CBU', 'MONEDA',
    'ACTIVA', 'CUENTA_PPAL', 'EDITAR'];
  //Define la lista de tipos de imagenes
  private tiposImagenes = ['image/png', 'image/jpg', 'image/jpeg'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define los botones para los pdf
  public btnPdfLicConducir: boolean = null;
  public btnPdfLibSanidad: boolean = null;
  public btnPdflinti: boolean = null;
  //Defiene el render
  public render: boolean = false;
  //Constructor
  constructor(private servicio: PersonalService,
    private appServicio: AppService, private toastr: ToastrService,
    private personal: Personal, private appService: AppService,
    private barrioServicio: BarrioService, private localidadServicio: LocalidadService,
    private loaderService: LoaderService, private fotoService: FotoService,
    private pdfServicio: PdfService, private bancoService: BancoService,
    public dialog: MatDialog, private reporteServicio: ReporteService,
    private sucursalService: SucursalBancoService,
    private personalCuentaBancariaService: PersonalCuentaBancariaService) {
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      let empresa = this.appServicio.getEmpresa();
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorActivosAliasYEmpresa(data, empresa.id).subscribe(
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
    this.formulario = this.personal.formulario;
    //Define los campos para validaciones cuenta bancaria
    this.formularioCuentaBancaria = this.personal.formularioCuentaBancaria;
    //Define los campos para filtrar la tabla 
    this.formularioFiltro = new FormGroup({
      idSucursal: new FormControl('', Validators.required),
      idArea: new FormControl('', Validators.required),
      idModContratacion: new FormControl('', Validators.required),
      idCategoria: new FormControl('', Validators.required),
      tipoEmpleado: new FormControl('', Validators.required)
    });
    this.formularioFiltro.get('idSucursal').setValue(0);
    this.formularioFiltro.get('idArea').setValue(0);
    this.formularioFiltro.get('idModContratacion').setValue(0);
    this.formularioFiltro.get('idCategoria').setValue(0);
    this.formularioFiltro.get('tipoEmpleado').setValue(0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(15, 0);
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getUsuario().id, this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
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
    //Autocompletado Localidad Nacimiento - Buscar por nombre
    this.formulario.get('localidadNacimiento').valueChanges.subscribe(data => {
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
        this.activeLink = this.pestanias[0].nombre;
        //Establece las opciones verticales
        this.opciones = respuesta.opciones;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.sexos = respuesta.sexos;
        this.areas = respuesta.areas;
        this.fechaActual = respuesta.fecha;
        this.monedas = respuesta.monedas;
        this.sindicatos = respuesta.sindicatos;
        this.sucursalesTrabajo = respuesta.sucursales;
        this.estadosCiviles = respuesta.estadoCiviles;
        this.tiposDocumentos = respuesta.tipoDocumentos;
        this.resultadosCategorias = respuesta.categorias;
        this.resultadosObrasSociales = respuesta.obraSociales;
        this.resultadosAfipSituaciones = respuesta.afipSituacion;
        this.resultadosAfipActividades = respuesta.afipActividades;
        this.tiposCuentasBancarias = respuesta.tipoCuentaBancarias;
        this.resultadosAfipCondiciones = respuesta.afipCondiciones;
        this.resultadosAfipLocalidades = respuesta.afipLocalidades;
        this.resultadosAfipSiniestrados = respuesta.afipSiniestrados;
        this.resultadosSeguridadesSociales = respuesta.seguridadSociales;
        this.resultadosAfipModContrataciones = respuesta.afipModContrataciones;

        this.formulario.get('fechaInicio').setValue(respuesta.fecha);
        this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
        this.formulario.get('id').setValue(respuesta.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appServicio.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de importe
  public mascararImporte(intLimite, decimalLimite) {
    return this.appServicio.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appServicio.mascararPorcentajeDosEnteros();
  }
  //Obtiene la mascara de hora-minuto
  public mascararHora() {
    return this.appServicio.mascararHora();
  }
  //Obtiene la mascara de hora-minuto
  public desenmascararHora(formulario) {
    let valor = formulario.value;
    if (valor) {
      valor = valor.replace(new RegExp(/[_]/g), "0");
      formulario.setValue(this.appServicio.desenmascararHora(valor));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.establecerDecimales(valor, cantidad));
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appServicio.desenmascararPorcentaje(valor, cantidad));
    } else {
      formulario.setValue(this.appServicio.desenmascararPorcentaje('00.00', cantidad));
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('estaActiva').setValue(true);
    this.formulario.get('esAcompReparto').setValue(false);
    this.formulario.get('recibeAdelanto').setValue(false);
    this.formulario.get('recibePrestamo').setValue(false);
    this.formulario.get('cuotasPrestamo').setValue(1);
    this.formulario.get('esChofer').setValue(false);
    this.formulario.get('esChoferLargaDistancia').setValue(false);
    this.formulario.get('esChoferLargaDistancia').disable();
    this.formulario.get('enConvenioColectivo').setValue(true);
    this.formulario.get('conCoberturaSCVO').setValue(true);
    this.formulario.get('vtoLicenciaConducir').disable();
    this.formulario.get('vtoCurso').disable();
    this.formulario.get('vtoCursoCargaPeligrosa').disable();
    this.formulario.get('vtoLINTI').disable();
    this.formulario.get('vtoLibretaSanidad').disable();
    this.formulario.get('vtoPsicoFisico').disable();
    this.cambioEsChofer();
  }
  //Al cambiar elemento de select esChofer
  public cambioEsChofer(): void {
    let esChofer = this.formulario.get('esChofer').value;
    let esChoferLargaDistancia = this.formulario.get('esChoferLargaDistancia').value;
    if (esChofer && esChoferLargaDistancia) {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').enable();
      this.formulario.get('vtoLibretaSanidad').enable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('pdfLicConducir').enable();
      this.formulario.get('pdfLibSanidad').enable();
      this.formulario.get('pdfLinti').enable();
      this.btnPdfLibSanidad = true;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = true;
    } else if (esChofer && !esChoferLargaDistancia) {
      this.formulario.get('vtoLicenciaConducir').enable();
      this.formulario.get('vtoCurso').enable();
      this.formulario.get('vtoCursoCargaPeligrosa').enable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
      this.formulario.get('vtoPsicoFisico').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
      this.formulario.get('pdfLicConducir').enable();
      this.btnPdfLibSanidad = false;
      this.btnPdfLicConducir = true;
      this.btnPdflinti = false;
    } else {
      this.formulario.get('vtoLicenciaConducir').disable();
      this.formulario.get('vtoCurso').disable();
      this.formulario.get('vtoCursoCargaPeligrosa').disable();
      this.formulario.get('vtoLINTI').disable();
      this.formulario.get('vtoLibretaSanidad').disable();
      this.formulario.get('vtoPsicoFisico').disable();
      this.formulario.get('esChoferLargaDistancia').disable();
      this.btnPdfLibSanidad = false;
      this.btnPdfLicConducir = false;
      this.btnPdflinti = false;
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
  //Controla el rango valido para la fecha de emision cuando el punto de venta es feCAEA
  public verificarFecha(opcion) {
    switch (opcion) {
      /* opcion == 1 para validar Fecha de Nacimiento */
      case 1:
        if (this.formulario.value.fechaNacimiento < this.fechaActual) {
          document.getElementById('idLocalidadNacimiento').focus();
        } else {
          this.toastr.error("Debe ser menor a fecha actual", "Fecha no válida");
          this.formulario.get('fechaNacimiento').reset();
          document.getElementById('idFechaNacimiento').focus();
        }
        break;
      /* opcion == 2 para validar Fecha de Inicio */
      case 2:
        let fechaInicio = this.formulario.value.fechaInicio;
        if (fechaInicio <= this.generarFecha(10) && fechaInicio > this.formulario.value.fechaNacimiento) {
          document.getElementById('idFechaFin').focus();
        } else {
          this.toastr.error("Debe ser entre Fecha Nacimiento y Fecha Actual + 10 días", "Fecha de Inicio no válida");
          this.formulario.get('fechaInicio').reset();
          document.getElementById('idFechaInicio').focus();
        }
        break;
      /* opcion == 3 para validar Fecha Fin */
      case 3:
        if (this.formulario.value.fechaFin > this.formulario.value.fechaInicio) {
          document.getElementById('idCategoria').focus();
        } else {
          this.toastr.error("Fecha fin debe ser superior a fecha de inicio.");
          this.formulario.get('fechaFin').reset();
        }
        break;
      // opcion == 4 -> Valida telefonoMovilFechaDevolucion
      case 4:
        if (this.formulario.value.telefonoMovilFechaEntrega > this.formulario.value.telefonoMovilFechaDevolucion) {
          this.toastr.error("Debe ser mayor a Fecha de Entrega", "Fecha de Devolución no válida");
          document.getElementById('idTelefonoMovilFechaDevolucion').focus();
        }
        break;
    }
  }
  //Genera y retorna una fecha segun los parametros que recibe (dias - puede ser + ó -)
  private generarFecha(dias) {
    let fechaActual = new Date(this.fechaActual);
    let date = fechaActual.getDate() + dias;
    let fechaGenerada = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + date; //Al mes se le debe sumar 1
    return fechaGenerada;
  }
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        if (res.text() != "") {
          let elemento = res.json();
          this.establecerFotoYPdfs(elemento);
        }
      },
      err => {
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosCategorias = [];
    this.resultadosSeguridadesSociales = [];
    this.resultadosObrasSociales = [];
    this.resultadosAfipActividades = [];
    this.resultadosAfipCondiciones = [];
    this.resultadosAfipLocalidades = [];
    this.resultadosAfipModContrataciones = [];
    this.resultadosAfipSiniestrados = [];
    this.resultadosAfipSituaciones = [];
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado, opcionPestania) {
    if (estado) {
      this.formulario.get('sexo').enable();
      this.formulario.get('estadoCivil').enable();
      this.formulario.get('tipoDocumento').enable();
      this.formulario.get('sucursal').enable();
      this.formulario.get('area').enable();
      this.formulario.get('sindicato').enable();
      this.formulario.get('categoria').enable();
      this.formulario.get('esAcompReparto').enable();
      this.formulario.get('enConvenioColectivo').enable();
      this.formulario.get('conCoberturaSCVO').enable();
      this.formulario.get('recibeAdelanto').enable();
      this.formulario.get('recibePrestamo').enable();
      this.formulario.get('esChofer').enable();
      this.formulario.get('esChoferLargaDistancia').enable();
      this.formulario.get('turnoRotativo').enable();
      this.formulario.get('turnoFueraConvenio').enable();
      this.formulario.get('seguridadSocial').enable();
      this.formulario.get('afipSituacion').enable();
      this.formulario.get('afipCondicion').enable();
      this.formulario.get('afipActividad').enable();
      this.formulario.get('afipModContratacion').enable();
      this.formulario.get('afipSiniestrado').enable();
      this.formulario.get('afipLocalidad').enable();
      this.formulario.get('obraSocial').enable();
      this.formulario.get('estaActiva').enable();
      //Controla el estado de los campos para el formulario de Cuenta Bancaria
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
      if (opcionPestania == 3) {
        this.formulario.get('fechaFin').enable();
      } else {
        this.formulario.get('fechaFin').disable();
      }
    } else {
      this.formulario.get('sexo').disable();
      this.formulario.get('estadoCivil').disable();
      this.formulario.get('tipoDocumento').disable();
      this.formulario.get('sucursal').disable();
      this.formulario.get('area').disable();
      this.formulario.get('sindicato').disable();
      this.formulario.get('categoria').disable();
      this.formulario.get('esAcompReparto').disable();
      this.formulario.get('enConvenioColectivo').disable();
      this.formulario.get('conCoberturaSCVO').disable();
      this.formulario.get('recibeAdelanto').disable();
      this.formulario.get('recibePrestamo').disable();
      this.formulario.get('esChofer').disable();
      this.formulario.get('esChoferLargaDistancia').disable();
      this.formulario.get('turnoRotativo').disable();
      this.formulario.get('turnoFueraConvenio').disable();
      this.formulario.get('seguridadSocial').disable();
      this.formulario.get('afipSituacion').disable();
      this.formulario.get('afipCondicion').disable();
      this.formulario.get('afipActividad').disable();
      this.formulario.get('afipModContratacion').disable();
      this.formulario.get('afipSiniestrado').disable();
      this.formulario.get('afipLocalidad').disable();
      this.formulario.get('obraSocial').disable();
      this.formulario.get('estaActiva').disable();
      //Controla el estado de los campos para el formulario de Cuenta Bancaria
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
    if (this.indiceSeleccionado == 3) {
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
    } else {
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
    }
  }
  //Cambio en elemento autocompletado - formatea los valores en campos
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
    this.obtenerPorId(elemento.id);
    //Establece los campos para Cuenta Bancaria (opcion 'Liquidacion')
    this.indiceSeleccionado == 3 ? this.verificarCBU() : '';
    this.listaCuentaBancaria.data = elemento.personalCuentaBancarias;
    this.listaCuentaBancaria.sort = this.sort;
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
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(true, 1);
        this.establecerValoresPestania(nombre, false, false, true, 'idApellido');
        break;
      case 2:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(false, 2);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(true, 3);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPorDefecto();
        this.establecerEstadoCampos(false, 4);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        /* si la lista completa ya mostraba registros, lo que hago es actualizarla */
        if (this.listaCompleta.data.length > 0) {
          this.listaCompleta.data = [];
          this.listarPorFiltros();
        }
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
      case 15:
        setTimeout(function () {
          document.getElementById('idApellido').focus();
        }, 20);
        break;
      case 16:
        setTimeout(function () {
          document.getElementById('idSucursal').focus();
        }, 20);
        break;
      case 17:
        setTimeout(function () {
          document.getElementById('idCuil').focus();
        }, 20);
        break;
      case 18:
        setTimeout(function () {
          document.getElementById('idRecibeAdelanto').focus();
        }, 20);
        break;
      case 19:
        setTimeout(function () {
          document.getElementById('idEsChofer').focus();
        }, 20);
        break;
      case 20:
        setTimeout(function () {
          document.getElementById('idTalleCamisa').focus();
        }, 20);
        break;
      case 21:
        setTimeout(function () {
          document.getElementById('idCorreoelectronico').focus();
        }, 20);
        break;
      default:
        setTimeout(function () {
          document.getElementById('idSucursalFiltro').focus();
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
  // private obtenerSiguienteId() {
  //   this.servicio.obtenerSiguienteId().subscribe(
  //     res => {
  //       this.formulario.get('id').setValue(res.json());
  //     },
  //     err => {
  //     }
  //   );
  // }
  //Obtiene el listado de registros
  // private listar() {
  //   this.loaderService.show();
  //   this.servicio.listar().subscribe(
  //     res => {
  //       this.listaCompleta = new MatTableDataSource(res.json());
  //       this.listaCompleta.sort = this.sort;
  //       this.listaCompleta.paginator = this.paginator;
  //       this.loaderService.hide();
  //     },
  //     err => {
  //       this.loaderService.hide();
  //     }
  //   );
  // }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.formulario.get('empresa').setValue(this.appServicio.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
    this.formulario.get('personalCuentaBancarias').setValue(this.listaCuentaBancaria.data);
    this.servicio.agregar(this.formulario.value).then(
      res => {
        let respuesta = res.json();
        if (res.status == 201) {
          respuesta.then(data => {
            this.ultimoId = data.id;
            this.reestablecerFormulario(data.id);
            this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
            document.getElementById('idApellido').focus();
            this.toastr.success(data.mensaje);
          },
            err => {
              let error = err.json();
              this.toastr.error(error.mensaje);
              this.loaderService.hide();
            })
        } else {
          respuesta.then(err => {
            this.toastr.error(err.mensaje);
          })
        }
        this.loaderService.hide();
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
    this.formulario.get('usuarioMod').setValue(this.appServicio.getUsuario());
    this.formulario.get('empresa').setValue(this.appServicio.getEmpresa());
    this.formulario.get('esJubilado').setValue(false);
    this.formulario.get('esMensualizado').setValue(true);
    this.formulario.get('personalCuentaBancarias').setValue(this.listaCuentaBancaria.data);
    this.servicio.actualizar(this.formulario.value).then(
      res => {
        let respuesta = res.json();
        if (res.status == 200) {
          respuesta.then(data => {
            this.reestablecerFormulario(null);
            document.getElementById('idAutocompletado').focus();
            this.toastr.success(data.mensaje);
            this.loaderService.hide();
          })
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
        if (res.status == 200) {
          this.reestablecerFormulario(null);
          this.toastr.success(respuesta.mensaje);
          document.getElementById('idAutocompletado').focus();
        }
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    this.reestablecerFormularioCB();
    this.nacionalidadNacimiento.reset();
    this.listaCuentaBancaria = new MatTableDataSource([]);
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
    /* Establece la primera opcion del sidenav */
    if (this.indiceSeleccionado != 5)
      this.seleccionarOpcion(15, 0);
    else
      this.seleccionarOpcion(null, 0);
  }
  //Reestablece el formulario de Cuenta Bancaria
  private reestablecerFormularioCB() {
    this.banco.reset();
    this.banco.enable();
    this.idMod = null;
    this.sucursales = [];
    this.formularioCuentaBancaria.reset();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err;
    if (respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    } else if (respuesta.codigo == 11012) {
      document.getElementById("labelCuil").classList.add('label-error');
      document.getElementById("idCuil").classList.add('is-invalid');
      document.getElementById("idCuil").focus();
    } else if (respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    } else if (respuesta.codigo == 11014) {
      document.getElementById("labelTelefonoMovil").classList.add('label-error');
      document.getElementById("idTelefonoMovil").classList.add('is-invalid');
      document.getElementById("idTelefonoMovil").focus();
    } else if (respuesta.codigo == 11003) {
      document.getElementById("labelCorreoelectronico").classList.add('label-error');
      document.getElementById("idCorreoelectronico").classList.add('is-invalid');
      document.getElementById("idCorreoelectronico").focus();
    } else if (respuesta.codigo == 11015) {
      document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
      document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
      document.getElementById("idTelefonoMovilEmpresa").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      let patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'telefonoFijo') {
          document.getElementById("labelTelefonoFijo").classList.add('label-error');
          document.getElementById("idTelefonoFijo").classList.add('is-invalid');
          this.toastr.error('Telefono Fijo incorrecto');
        } else if (campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil incorrecto');
        } else if (campo == 'telefonoMovilEmpresa') {
          document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
          document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Empresa incorrecto');
        } else if (campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico incorrecto');
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
          let respuesta = this.appServicio.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11007, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appServicio.validarCUIT(documento.toString());
          if (!respuesta2) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appServicio.validarDNI(documento.toString());
          if (!respuesta8) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
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
  //Recorre la lista de Cuentas Bancarias y determina si ya fue asignado anteriormente 
  private verificarListaCB(elemento) {
    //Establece un boolean como control
    let bandera = false;
    for (let i = 0; i < this.listaCuentaBancaria.data.length; i++) {
      let cbuLista = this.listaCuentaBancaria.data[i].cbu;
      let numeroCuentaLista = this.listaCuentaBancaria.data[i].numeroCuenta;
      /*Por proveedor no controlo porque es siempre el mismo a quien se agregan las distinas
        cuentas bancarias*/
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
    this.personalCuentaBancariaService.eliminar(id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          //establece la nueva lista de cuentas bancarias del personal
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
  //Obtiene la nueva lista de cuentas bancarias para un personal
  private listarCuentaBancariaPorPersonal(idPersonal) {
    this.personalCuentaBancariaService.listarPorPersonal(idPersonal).subscribe(
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
  //Prepara los datos del registro seleccionado para poder actualizar
  public activarModCuentaBancaria(elemento, indice) {
    this.idMod = indice;
    this.banco.setValue(elemento.sucursalBanco.banco);
    this.formularioCuentaBancaria.patchValue(elemento);
    this.establecerSucursal(elemento.sucursalBanco.banco.id, elemento.sucursalBanco);
    document.getElementById("idCuentaPrincipal").focus();
  }
  //Actualiza el registro, seleccionado, en la lista - tabla
  public actualizarCuentaBancaria() {
    this.loaderService.show();
    //En pestaña 'Actualizar' se habilita el formulario porque hay campos deshabilitados
    this.formularioCuentaBancaria.enable();
    //si el registro a modificar tiene asignado un 'id' entonces actualiza en el back
    if (this.formularioCuentaBancaria.value.id) {
      //establezco el Personal a Cuenta Bancaria
      this.formularioCuentaBancaria.value.personal = { id: this.autocompletado.value.id }
      this.personalCuentaBancariaService.actualizar(this.formularioCuentaBancaria.value).subscribe(
        res => {
          let respuesta = res.json();
          if (respuesta.codigo == 200) {
            //establece la lista de cuentas bancarias, actualizada, del personal
            this.listarCuentaBancariaPorPersonal(this.formulario.value.id);
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
  //Cancela el modificar cuenta bancaria
  public cancelarModCuentaBancaria() {
    this.formularioCuentaBancaria.reset();
    this.formularioCuentaBancaria.enable();
    this.banco.enable();
    this.idMod = null;
    document.getElementById("idBanco").focus();
  }
  //Valida el CUIL
  public validarCUIL(): void {
    let cuil = this.formulario.get('cuil').value;
    if (cuil) {
      let respuesta = this.appServicio.validarCUIT(cuil + '');
      if (!respuesta) {
        this.formulario.get('cuil').reset();
        let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
        this.lanzarError(err);
      }
    }
  }
  //Valida que Antiguedad Anterior Años sea menor a 60
  public validarAntiguedadAnios() {
    let elemento = Number(this.formulario.value.antiguedadAntAnio);
    if (elemento > 59 && elemento) {
      this.formulario.get('antiguedadAntAnio').reset();
      this.toastr.error("El campo Antigüedad Anterior Años debe ser menor a 60.");
    }
  }
  //Valida que Antiguedad Anterior Meses sea menor a 12
  public validarAntiguedadMeses() {
    let elemento = Number(this.formulario.value.antiguedadAntMes);
    if (elemento > 11 && elemento) {
      this.formulario.get('antiguedadAntMes').reset();
      this.toastr.error("El campo Antigüedad Anterior Meses debe ser menor a 60.");
    }
  }
  //Controla si el adjunto es un PDF o JPEG y llama al readURL apropiado
  public controlAdjunto(event) {
    // let extension = this.formulario.get('pdfDni').value.tipo;
    let extension = event.target.files[0].type;
    if (extension == 'application/pdf') {
      this.readPdfURL(event, 'pdfDni');
    } else {
      this.readImageURL(event, 'pdfDni');
    }
  }
  //Carga la imagen del personal
  public readImageURL(event, campo): void {
    if (event.target.files && event.target.files[0] && this.tiposImagenes.includes(event.target.files[0].type)) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let foto = {
          id: this.formulario.get(campo + '.id').value ? this.formulario.get(campo + '.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get(campo).patchValue(foto);
        event.target.value = null;
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .jpeg .png .jpg");
    }
  }
  //Carga el archivo PDF 
  public readPdfURL(event, campo): void {
    let extension = event.target.files[0].type;
    if (event.target.files && event.target.files[0] && extension == 'application/pdf') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let pdf = {
          id: this.formulario.get(campo + ".id").value ? this.formulario.get(campo + ".id").value : null,
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
  //Elimina un pdf/imagen ya cargado, se pasa el campo como parametro
  public eliminarAdjunto(campo) {
    if (!this.formulario.get(campo).value) {
      this.toastr.success("Sin archivo adjunto");
    } else {
      this.formulario.get(campo + '.nombre').setValue('');
      this.formulario.get(campo + '.datos').setValue('');
    }
  }
  //Obtiene el pdf para mostrarlo
  public obtenerPDF(elemento) {
    let resultadoPdf = {
      id: null,
      version: null,
      nombre: null,
      tipo: null,
      tamanio: null,
      datos: null,
      tabla: null
    };
    if (elemento.id) {
      this.pdfServicio.obtenerPorId(elemento.id).subscribe(res => {
        let resultado = res.json();
        let pdf = {
          id: resultado.id,
          version: resultado.version,
          nombre: resultado.nombre,
          tamanio: resultado.tamanio,
          tipo: resultado.tipo,
          tabla: resultado.tabla,
          datos: atob(resultado.datos)
        }
        resultadoPdf = pdf;
      })
    }
    return resultadoPdf;
  }
  //Obtiene el pdf para mostrarlo
  public obtenerFoto(elemento) {
    let resultadoFoto = {
      id: null,
      version: null,
      nombre: null,
      tipo: null,
      tamanio: null,
      datos: null,
      tabla: null
    };
    if (elemento.id) {
      this.fotoService.obtenerPorId(elemento.id).subscribe(res => {
        let resultado = res.json();
        let foto = {
          id: resultado.id,
          version: resultado.version,
          nombre: resultado.nombre,
          tamanio: resultado.tamanio,
          tipo: resultado.tipo,
          tabla: resultado.tabla,
          datos: atob(resultado.datos)
        }
        resultadoFoto = foto;
      })
    }
    return resultadoFoto;
  }
  //Obtiene el dni para mostrarlo
  public verDni() {
    let tipo;
    this.formulario.value.pdfDni.tipo ? tipo = this.formulario.value.pdfDni.tipo : tipo = this.formulario.value.pdfDni.nombre;
    if (tipo) {
      let extension;
      this.formulario.value.pdfDni.tipo ? extension = tipo.split('/') : extension = tipo.split('.');
      extension[1] == 'pdf' ? this.verPDF('pdfDni') : this.verFoto('pdfDni');
    }
  }
  //Obtiene la foto para mostrarlo
  public verFoto(campo) {
    const dialogRef = this.dialog.open(BugImagenDialogoComponent, {
      width: '95%',
      height: '95%',
      data: {
        nombre: this.formulario.get(campo + '.nombre').value,
        datos: this.formulario.get(campo + '.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Muestra el pdf en una pestana nueva
  public verPDF(pdf) {
    const dialogRef = this.dialog.open(PdfDialogoComponent, {
      width: '95%',
      height: '95%',
      data: {
        nombre: this.formulario.get(pdf + '.nombre').value,
        datos: this.formulario.get(pdf + '.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.obtenerPorId(elemento.id);
    this.autocompletado.setValue(elemento);
    this.establecerNacionalidad(elemento.localidad);
    this.listaCuentaBancaria.data = elemento.personalCuentaBancarias;
    this.listaCuentaBancaria.sort = this.sort;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.obtenerPorId(elemento.id);
    this.autocompletado.setValue(elemento);
    this.establecerNacionalidad(elemento.localidad);
    this.listaCuentaBancaria.data = elemento.personalCuentaBancarias;
    this.listaCuentaBancaria.sort = this.sort;
    this.verificarCBU();
  }
  //Establece la foto y pdf (actilet consultar/actualizar)
  private establecerFotoYPdfs(elemento): void {
    elemento.foto ? elemento.foto.datos = atob(elemento.foto.datos) : '';
    elemento.pdfLicConducir ? elemento.pdfLicConducir.datos = atob(elemento.pdfLicConducir.datos) : '';
    elemento.pdfLinti ? elemento.pdfLinti.datos = atob(elemento.pdfLinti.datos) : '';
    elemento.pdfLibSanidad ? elemento.pdfLibSanidad.datos = atob(elemento.pdfLibSanidad.datos) : '';
    elemento.pdfDni ? elemento.pdfDni.datos = atob(elemento.pdfDni.datos) : '';
    elemento.pdfAltaTemprana ? elemento.pdfAltaTemprana.datos = atob(elemento.pdfAltaTemprana.datos) : '';
    this.formulario.patchValue(elemento);
    this.establecerValoresPersonal();
    this.cambioEsChofer();
  }
  //Formatea los valores en los campos
  private establecerValoresPersonal() {
    this.formulario.get('aporteAdicSegSoc').setValue(this.formulario.get('aporteAdicSegSoc').value ?
      this.appServicio.desenmascararPorcentaje(this.formulario.get('aporteAdicSegSoc').value.toString(), 2) : null);
    this.formulario.get('aporteDifSegSoc').setValue(this.formulario.get('aporteDifSegSoc').value ?
      this.appServicio.desenmascararPorcentaje(this.formulario.get('aporteDifSegSoc').value.toString(), 2) : null);
    this.formulario.get('contribTareaDifSegSoc').setValue(this.formulario.get('contribTareaDifSegSoc').value ?
      this.appServicio.desenmascararPorcentaje(this.formulario.get('contribTareaDifSegSoc').value.toString(), 2) : null);
    this.formulario.get('aporteAdicObraSocial').setValue(this.formulario.get('aporteAdicObraSocial').value ?
      this.establecerDecimales(this.formulario.get('aporteAdicObraSocial'), 2) : null);
    this.formulario.get('contribAdicObraSocial').setValue(this.formulario.get('contribAdicObraSocial').value ?
      this.establecerDecimales(this.formulario.get('contribAdicObraSocial'), 2) : null);
  }
  //Establece la nacionalidad
  public establecerNacionalidad(localidad) {
    this.nacionalidadNacimiento.setValue(localidad.provincia.pais.nombre);
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
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFd(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.codigoAfip + ' - ' + elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFe(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    let opcion = this.opcionSeleccionada;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    } else if (keycode == 115) {
      if (opcion < this.opciones[(this.opciones.length - 1)].id) {
        this.seleccionarOpcion(opcion + 1, opcion - 14);
      } else {
        this.seleccionarOpcion(15, 0);
      }
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre,
        tipodocumento: elemento.tipoDocumento.nombre,
        documento: elemento.numeroDocumento,
        telefonomovil: elemento.telefonoMovil,
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
      nombre: 'Personal',
      empresa: this.appServicio.getEmpresa().razonSocial,
      usuario: this.appServicio.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
  //obtiene la lista por filtros
  public listarPorFiltros(): void {
    this.loaderService.show();
    this.servicio.listarPorFiltros(this.formularioFiltro.value).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    )
  }
}