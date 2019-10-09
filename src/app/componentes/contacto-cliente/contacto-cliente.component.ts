import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoClienteService } from '../../servicios/contacto-cliente.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { ClienteService } from '../../servicios/cliente.service';
import { TipoContactoService } from '../../servicios/tipo-contacto.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ContactoCliente } from 'src/app/modelos/contactoCliente';

@Component({
  selector: 'app-contacto-cliente',
  templateUrl: './contacto-cliente.component.html',
  styleUrls: ['./contacto-cliente.component.css']
})
export class ContactoClienteComponent implements OnInit {
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
  public pestanias: Array<any> = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de tipos de contactos
  public tiposContactos: Array<any> = [];
  //Define la lista de contactos
  public contactos: Array<any> = [];
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda sucursales clientes
  public resultadosClientes: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'TIPO_CONTACTO', 'NOMBRE_CONTACTO', 'TELEFONO_FIJO', 'TELEFONO_MOVIL', 'CORREO_ELECTRONICO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: ContactoClienteService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private appService: AppService, private modelo: ContactoCliente,
    private clienteServicio: ClienteService, private tipoContactoServicio: TipoContactoService,
    private loaderService: LoaderService, private reporteServicio: ReporteService) {
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
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista de tipos de contactos
    this.listarTiposContactos();
    //Autocompletado Cliente - Buscar por alias
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    })
  }
  //Establecer el formulario al cambiar elemento de autocompletado
  public cambioAutocompletado() {
    this.formulario.patchValue(this.autocompletado.value);
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
    this.resultadosClientes = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
    } else {

    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    soloLectura ? this.formulario.get('tipoContacto').disable() : this.formulario.get('tipoContacto').enable();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario();
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idCliente');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idCliente');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idCliente');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idCliente');
        break;
      case 5:
        this.contactos = [];
        this.autocompletado.reset();
        this.formulario.reset();
        setTimeout(function () {
          document.getElementById('idCliente').focus();
        }, 20);
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
  //Obtiene la lista de contactos de un cliente
  public listarPorCliente() {
    let elemento = this.formulario.get('cliente').value;
    this.servicio.listarPorCliente(elemento.id).subscribe(res => {
      if (this.indiceSeleccionado == 5) {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.paginator = this.paginator;
        this.listaCompleta.sort = this.sort;
      } else {
        this.contactos = res.json();
      }
    })
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
    let cliente = this.formulario.value.cliente;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          this.formulario.get('cliente').setValue(cliente);
          document.getElementById('idTipoContacto').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
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
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idCliente').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
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
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
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
    this.autocompletado.reset();
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    let respuesta = err.json();
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
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.formulario.get('cliente').setValue(elemento);
    this.listarPorCliente();
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.formulario.get('cliente').setValue(elemento);
    this.listarPorCliente();
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
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
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
    if (this.formulario.value.cliente) {
      let datos = {
        nombre: 'Contactos - Cliente: ' + this.formulario.value.cliente.id + ' - ' + this.formulario.value.cliente.razonSocial,
        empresa: this.appService.getEmpresa().razonSocial,
        usuario: this.appService.getUsuario().nombre,
        datos: lista,
        columnas: this.columnas
      }
      this.reporteServicio.abrirDialogo(datos);
    }else{
      this.toastr.error("Complete el campo Cliente para filtrar los registros.");
    }
  }
}