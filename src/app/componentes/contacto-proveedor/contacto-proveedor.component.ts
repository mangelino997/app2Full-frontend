import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoProveedorService } from '../../servicios/contacto-proveedor.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ContactoProveedor } from 'src/app/modelos/contactoProveedor';

@Component({
  selector: 'app-contacto-proveedor',
  templateUrl: './contacto-proveedor.component.html',
  styleUrls: ['./contacto-proveedor.component.css']
})
export class ContactoProveedorComponent implements OnInit {
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
  public resultadosProveedores: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'TIPO_CONTACTO', 'NOMBRE_CONTACTO', 'TELEFONO_FIJO', 'TELEFONO_MOVIL', 'CORREO_ELECTRONICO', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: ContactoProveedorService,
    private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService,
    private proveedorServicio: ProveedorService, private modelo: ContactoProveedor, private reporteServicio: ReporteService) {
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
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado Sucursal Banco - Buscar por nombre
    this.formulario.get('proveedor').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.proveedorServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosProveedores = response;
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
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.tiposContactos = respuesta.tipoContactos;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Establecer el formulario al cambiar elemento de autocompletado
  public cambioAutocompletado() {
    this.formulario.patchValue(this.autocompletado.value);
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.contactos = [];
    this.resultados = [];
    this.resultadosProveedores = [];
    this.listaCompleta = new MatTableDataSource([]);
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
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idProveedor');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idProveedor');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idProveedor');
        break;
      case 5:
        this.mostrarAutocompletado = true;
        setTimeout(function () {
          document.getElementById('idProveedor').focus();
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
  //Obtiene la lista de contactos por proveedor
  public listarPorProveedor() {
    if (this.mostrarAutocompletado) {
      this.loaderService.show();
      let elemento = this.formulario.get('proveedor').value;
      this.servicio.listarPorProveedor(elemento.id).subscribe(
        res => {
          let r = res.text();

          // this.listaCompleta = new MatTableDataSource(res.json());
          // this.listaCompleta.paginator = this.paginator;
          // this.listaCompleta.sort = this.sort;
          // this.listaCompleta.data.length == 0 ? this.toastr.error("El Proveedor no tiene contactos asignados.") : '';
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        }
      )
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    let proveedor = this.formulario.value.proveedor;
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario(respuesta.id);
          this.formulario.get('proveedor').setValue(proveedor);
          document.getElementById('idTipoContacto').focus();
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
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idProveedor').focus();
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
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idProveedor').focus();
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
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.vaciarListas();
    this.formulario.reset();
    this.autocompletado.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
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
        } else if (campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Incorrecto');
        } else if (campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electrónico Incorrecto');
        }
      }
    }
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
    this.listarPorProveedor();
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.listarPorProveedor();
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
  //Define como se muestra los datos en el autocompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
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
    if (this.formulario.value.proveedor) {
      let datos = {
        nombre: 'Contactos - Proveedor: ' + this.formulario.value.proveedor.id + ' - ' + this.formulario.value.proveedor.razonSocial,
        empresa: this.appService.getEmpresa().razonSocial,
        usuario: this.appService.getUsuario().nombre,
        datos: lista,
        columnas: this.columnas
      }
      this.reporteServicio.abrirDialogo(datos);
    } else {
      this.toastr.error("Complete el campo Proveedor para filtrar los registros.");
    }
  }
}