import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoBancoService } from '../../servicios/contacto-banco.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { SucursalBancoService } from '../../servicios/sucursal-banco.service';
import { TipoContactoService } from '../../servicios/tipo-contacto.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-contacto-banco',
  templateUrl: './contacto-banco.component.html',
  styleUrls: ['./contacto-banco.component.css']
})
export class ContactoBancoComponent implements OnInit {
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
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de tipos de contactos
  public tiposContactos: Array<any> = [];
  //Define la lista de contactos
  public contactos: Array<any> = [];
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda de sucursales bancos
  public resultadosSucursalesBancos: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'TIPO_CONTACTO', 'NOMBRE_CONTACTO', 'TELEFONO_FIJO', 'TELEFONO_MOVIL', 'CORREO_ELECTRONICO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la variable para guardar el valor de un campo
  public guardarCampo: any;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: ContactoBancoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appServicio: AppService, private toastr: ToastrService,
    private sucursalBancoServicio: SucursalBancoService, private tipoContactoServicio: TipoContactoService,
    private loaderService: LoaderService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appServicio.getRol().id, this.appServicio.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      sucursalBanco: new FormControl('', Validators.required),
      tipoContacto: new FormControl('', Validators.required),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      telefonoFijo: new FormControl('', Validators.maxLength(45)),
      telefonoMovil: new FormControl('', Validators.maxLength(45)),
      correoelectronico: new FormControl('', Validators.maxLength(60)),
      usuarioAlta: new FormControl(),
      usuarioMod: new FormControl()
    });
    //Autocompletado Sucursal Banco - Buscar por nombre
    this.formulario.get('sucursalBanco').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.sucursalBancoServicio.listarPorNombreBanco(data).subscribe(response => {
          this.resultadosSucursalesBancos = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de tipos de contactos
    this.listarTiposContactos();
  }
  //Establecer el formulario al cambiar elemento de autocompletado
  public cambioAutocompletado() {
    this.formulario.setValue(this.autocompletado.value);
  }
  //Obtiene el listado de tipos de proveedores
  private listarTiposContactos() {
    this.tipoContactoServicio.listar().subscribe(
      res => {
        this.tiposContactos = res.json();
      },
      err => {
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.listaCompleta = new MatTableDataSource([]);
    this.resultadosSucursalesBancos = [];
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('tipoContacto').enable();
    } else {
      this.formulario.get('tipoContacto').disable();
    }
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
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.vaciarListas();
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursalBanco');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idSucursalBanco');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idSucursalBanco');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idSucursalBanco');
        break;
      case 5:
        this.contactos = [];
        this.listaCompleta = new MatTableDataSource([]);
        this.mostrarAutocompletado = true;
        setTimeout(function () {
          document.getElementById('idSucursalBanco').focus();
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
  //Obtiene la lista de contactos por sucursal banco
  public listarPorSucursalBanco(elemento) {
    if (this.mostrarAutocompletado) {
      this.servicio.listarPorSucursalBanco(elemento.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          if (this.indiceSeleccionado == 5)
            this.listaCompleta.sort = this.sort,
              this.listaCompleta.paginator = this.paginator;
          else
            this.contactos = res.json();
        },
        err => {
        }
      )
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          var guardarCampo = this.formulario.value.sucursalBanco;
          this.reestablecerFormulario();
          document.getElementById('idSucursalBanco').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appServicio.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idSucursalBanco').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    let formulario = this.formulario.value;
    this.servicio.eliminar(formulario.id).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 500) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Reestablece el formulario
  private reestablecerFormularioAgregar() {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11003) {
      document.getElementById("labelCorreoelectronico").classList.add('label-error');
      document.getElementById("idCorreoelectronico").classList.add('is-invalid');
      document.getElementById("idCorreoelectronico").focus();
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
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'telefonoFijo') {
          document.getElementById("labelTelefonoFijo").classList.add('label-error');
          document.getElementById("idTelefonoFijo").classList.add('is-invalid');
          this.toastr.error('Telefono Fijo Incorrecto');
        } else if (campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Incorrecto');
        } else if (campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico Incorrecto');
        }
      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.listarPorSucursalBanco(elemento.sucursalBanco);
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.listarPorSucursalBanco(elemento.sucursalBanco);
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
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
  //Define como se muestra los datos en el autocompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ' - ' + elemento.banco.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + '' : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autocompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ' - ' + elemento.tipoContacto.nombre : elemento;
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
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        tipo_contacto: elemento.tipoContacto.nombre,
        nombre_contacto: elemento.nombre,
        telefono_fijo: elemento.telefonoFijo,
        telefono_movil: elemento.telefonoMovil,
        correo_electronico: elemento.correoelectronico
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Contactos Bancos',
      empresa: this.appServicio.getEmpresa().razonSocial,
      usuario: this.appServicio.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}