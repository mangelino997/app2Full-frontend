import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonalService } from '../../servicios/personal.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { SexoService } from '../../servicios/sexo.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { PersonalFamiliar } from 'src/app/modelos/personal-familiar';
import { FechaService } from 'src/app/servicios/fecha.service';
import { MesService } from 'src/app/servicios/mes.service';
import { TipoFamiliarService } from 'src/app/servicios/tipo-familiar.service';
import { PersonalFamiliarService } from 'src/app/servicios/personal-familiar.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-personal-familiar',
  templateUrl: './personal-familiar.component.html'
})
export class PersonalFamiliarComponent implements OnInit {
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
  public listaCompletaArray: Array<any> = [];
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de sexos
  public sexos: Array<any> = [];
  //Define la lista de tipos de familiares
  public familiares: Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la lista de anios
  public anios: Array<any> = [];
  //Define la lista de meses
  public meses: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define la nacionalidad de nacimiento
  public nacionalidadNacimiento: FormControl = new FormControl();
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  public autocompletadoListar: FormControl = new FormControl();
  //Define el Familiar seleccionado control para las busquedas
  public familiar: FormControl = new FormControl();
  //Define el form control para las busquedas
  public autocompletadopersonal: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda para el campo Personal
  public resultadosPersonal: Array<any> = [];
  //Define la lista de resultados de busqueda de localidades
  public resultadosLocalidades: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['LEGAJO', 'FAMILIAR', 'APELLIDO', 'NOMBRE', 'FECHA_NACIMIENTO', 'CUIL', 'LUGAR_NACIMIENTO', 'NACIONALIDAD', 'SEXO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define la lista para los Familiares del Personal que se seleccione
  public personasFamiliares: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: PersonalFamiliarService, private personalServicio: PersonalService, 
    private subopcionPestaniaService: SubopcionPestaniaService,
    private personalFamiliar: PersonalFamiliar, private appServicio: AppService,
    private toastr: ToastrService, private localidadServicio: LocalidadService, private sexoServicio: SexoService,
    private loaderService: LoaderService, private tipoDocumentoServicio: TipoDocumentoService, 
    private anio: FechaService, private mes: MesService, private tipoFamiliar: TipoFamiliarService, 
    private reporteServicio: ReporteService) {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    this.loaderService.show();
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appServicio.getRol().id, this.appServicio.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
          this.loaderService.hide();
        },
        err => {
          console.log(err);
        }
      );
    let empresa = this.appServicio.getEmpresa();
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarActivosPorAliasYEmpresa(data, empresa.id).subscribe(response => {
          this.resultados = response;
        })
      }
    })
    //Autocompletado - Buscar personal por alias
    this.autocompletadoListar.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarActivosPorAliasYEmpresa(data, empresa.id).subscribe(response => {
          this.resultadosPersonal = response;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    let empresa = this.appServicio.getEmpresa();
    //Define los campos para validaciones
    this.formulario = this.personalFamiliar.formulario;
    //Autocompletado Localidad Nacimiento - Buscar por nombre
    this.formulario.get('localidadNacimiento').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(15, 0);
    //Obtiene la lista de sexos
    this.listarSexos();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de meses
    this.listarMeses();
    //Obtiene la lista de años
    this.listarAnios();
    //Obtiene la lista de tipos de familiares
    this.listarTiposFamiliares();
    //Autocompletado - Buscar personal por alias
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.personalServicio.listarActivosPorAliasYEmpresa(data, empresa.id).subscribe(response => {
          this.resultadosPersonal = response;
        })
      }
    })
  }
  //Obtiene el listado de tipos de familiares
  private listarTiposFamiliares() {
    this.tipoFamiliar.listar().subscribe(
      res => {
        this.familiares = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de sexos
  private listarSexos() {
    this.sexoServicio.listar().subscribe(
      res => {
        this.sexos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
        this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene la lista de meses
  private listarMeses() {
    this.mes.listar().subscribe(
      res => {
        this.meses = res.json();
      }
    );
  }
  //Obtiene la lista de años
  private listarAnios() {
    this.anio.listarAnios().subscribe(
      res => {
        this.anios = res.json();
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosLocalidades = [];
    this.resultadosPersonal = [];
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado, opcionPestania) {
    if (estado) {
      this.formulario.get('tipoFamiliar').enable();
      // this.formulario.get('fechaNacimiento').enable();
      this.formulario.get('localidadNacimiento').enable();
      this.formulario.get('sexo').enable();
      this.formulario.get('tipoDocumento').enable();
      // this.formulario.get('numeroDocumento').enable();
      this.formulario.get('mesBajaImpGan').enable();
      this.formulario.get('mesAltaImpGan').enable();
      this.formulario.get('anioBajaImpGan').enable();
      this.formulario.get('anioAltaImpGan').enable();
    } else {
      this.formulario.get('tipoFamiliar').disable();
      // this.formulario.get('fechaNacimiento').disable();
      this.formulario.get('localidadNacimiento').disable();
      this.formulario.get('sexo').disable();
      this.formulario.get('tipoDocumento').disable();
      // this.formulario.get('numeroDocumento').disable();
      this.formulario.get('mesBajaImpGan').disable();
      this.formulario.get('mesAltaImpGan').disable();
      this.formulario.get('anioBajaImpGan').disable();
      this.formulario.get('anioAltaImpGan').disable();

    }
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appServicio.mascararEnteros(intLimite);
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado() {
    let elemAutocompletado = this.autocompletado.value;
    this.formulario.setValue(elemAutocompletado);
    this.nacionalidadNacimiento.setValue(elemAutocompletado.localidadNacimiento.provincia.pais.nombre);
    this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
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
        this.establecerEstadoCampos(true, 1);
        this.establecerValoresPestania(nombre, false, false, true, 'idPersonal');
        break;
      case 2:
        this.establecerEstadoCampos(false, 2);
        this.establecerValoresPestania(nombre, true, true, false, 'idPersonal');
        break;
      case 3:
        this.establecerEstadoCampos(true, 3);
        this.establecerValoresPestania(nombre, true, true, true, 'idPersonal');
        break;
      case 4:
        this.establecerEstadoCampos(false, 4);
        this.establecerValoresPestania(nombre, true, false, true, 'idPersonal');
        break;
      case 5:
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
          document.getElementById('idPersonal').focus();
        }, 20);
        break;
      case 17:
        setTimeout(function () {
          document.getElementById('idCuil').focus();
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
  //Obtiene la lista de contactos de un cliente
  // public listarPorPersonal() {
  //   this.servicio.listarPorPersonal(elemento.id).subscribe(res => {
  //     if(this.indiceSeleccionado == 5) {
  //       this.listaCompleta = new MatTableDataSource(res.json());
  //       this.listaCompleta.sort = this.sort;
  //     } else {
  //       this.personales = res.json();
  //     }
  //   })
  // }
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
  //Obtiene el listado de registros en la Pestaña Listar
  public listarPorPersonal() {
    this.loaderService.show();
    this.servicio.listarPorPersonal(this.autocompletadoListar.value.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.listaCompletaArray = res.json();
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    // this.formulario.get('mesAltaImpGan').setValue(this.formulario.value.mesAltaImpGan.numero);
    // this.formulario.get('mesBajaImpGan').setValue(this.formulario.value.mesBajaImpGan.numero);
    this.loaderService.show();
    // this.formulario.get('id').setValue(null);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        this.reestablecerFormulario(respuesta.id);
        this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]);
        setTimeout(function () {
          document.getElementById('idApellido').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      },
      err => {
        let error = err;
        document.getElementById("idApellido").focus();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
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
        let error = err;
        if (error.codigo == 11007) {
          this.toastr.error(error.mensaje);
          setTimeout(function () {
            document.getElementById("labelCuil").classList.add('label-error');
            document.getElementById("idCuil").classList.add('is-invalid');
            document.getElementById("idCuil").focus();
          }, 20);
        }
        if (error.codigo == 11012) {
          this.toastr.error(error.mensaje);
          setTimeout(function () {
            document.getElementById("labelCuil").classList.add('label-error');
            document.getElementById("idCuil").classList.add('is-invalid');
            document.getElementById("idCuil").focus();
          }, 20);
        }
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
    if (this.indiceSeleccionado == 2 || this.indiceSeleccionado == 3 || this.indiceSeleccionado == 4) {
      this.obtenerFamiliaresPersonal();
    }
  }
  //Obtiene una lista de familiares del Personal seleccionado
  private obtenerFamiliaresPersonal() {
    this.loaderService.show();
    this.servicio.listarPorPersonal(this.formulario.get('personal').value.id).subscribe(
      res => {
        this.personasFamiliares = res.json();
        this.loaderService.hide();
      },
      err => {
        this.toastr.warning("El Personal seleccionado no tiene ningún Familiar asociado.");
        this.loaderService.hide();
      }
    )
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.familiar.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.autocompletadoListar.setValue(undefined);
    this.nacionalidadNacimiento.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarErrorDocumento(err) {
    this.formulario.get('numeroDocumento').setValue(null);
    document.getElementById("labelNumeroDocumento").classList.add('label-error');
    document.getElementById("idNumeroDocumento").classList.add('is-invalid');
    document.getElementById("idNumeroDocumento").focus();
    var respuesta = err;
    this.toastr.error(respuesta.mensaje);

  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err;
    this.formulario.get('cuil').setValue(null);
    document.getElementById("labelCuil").classList.add('label-error');
    document.getElementById("idCuil").classList.add('is-invalid');
    document.getElementById("idCuil").focus();
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
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
            let err = { codigo: 11007, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appServicio.validarCUIT(documento.toString());
          if (!respuesta2) {
            let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appServicio.validarDNI(documento.toString());
          if (!respuesta8) {
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarErrorDocumento(err);
          }
          break;
      }
    }
  }
  //Valida el CUIL
  public validarCUIL(): void {
    let cuil = this.formulario.get('cuil').value;
    //Primero valida que la cantidad de numeros sean validos
    if (cuil) {
      let respuesta = this.appServicio.validarCUIT(cuil + '');
      if (!respuesta) {
        let err = { codigo: 11012, mensaje: 'CUIL Incorrecto!' };
        this.lanzarError(err);
      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
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
  //Define como se muestra los datos en el autcompletado a
  public displayFd(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.codigoAfip + ' - ' + elemento.nombre : elemento;
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
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
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
          legajo: elemento.id,
          familiar: elemento.tipoFamiliar.nombre,
          apellido: elemento.apellido,
          nombre: elemento.nombre,
          fecha_nacimiento: elemento.fechaNacimiento,
          cuil: elemento.cuil,
          lugar_nacimiento: elemento.localidadNacimiento.nombre,
          nacionalidad: elemento.localidadNacimiento.provincia.pais.nombre,
          sexo: elemento.sexo.nombre
        }
        datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Familiares Personal',
      empresa: this.appServicio.getEmpresa().razonSocial,
      usuario: this.appServicio.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  } 
}