import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from '../../servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { OrdenRecoleccion } from 'src/app/modelos/ordenRecoleccion';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';

@Component({
  selector: 'app-orden-recoleccion',
  templateUrl: './orden-recoleccion.component.html',
  styleUrls: ['./orden-recoleccion.component.css']
})
export class OrdenRecoleccionComponent implements OnInit {
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
  //Define si los campos de seleccion son de solo lectura
  public selectSoloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define si muestra los datos (localidad-barrio-provincia) del cliente
  public mostrarCliente: boolean = false;
  //Define una lista
  public lista = null;
  //Define la lista para las Escalas agregadas
  public listaDeEscalas: Array<any> = [];
  //Define la lista para los tramos agregados
  public listaDeTramos: Array<any> = [];
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para la pestaña Listar
  public formularioListar: FormGroup;
  //Define el siguiente id
  public siguienteId: number = null;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el form control para el remitente
  public cliente: FormControl = new FormControl();
  public domicilioBarrio: FormControl = new FormControl();
  public localidadProvincia: FormControl = new FormControl();
  public fechaEmisionFormatoNuevo: FormControl = new FormControl();
  public fechaEmisionFormatoOrig: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente: FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de sucursales
  public resultadosSucursales = [];
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'fechaEmision', 'cliente', 'domicilio', 'horaDesde', 'horaHasta', 'bultos', 'kgEfectivo', 'pagoEnOrigen', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(
    private ordenRecoleccion: OrdenRecoleccion, private subopcionPestaniaService: SubopcionPestaniaService,
    private fechaServicio: FechaService, private localidadService: LocalidadService, private clienteService: ClienteService, private toastr: ToastrService,
    private barrioService: BarrioService, private appService: AppService, private servicio: OrdenRecoleccionService,
    private sucursalService: SucursalService, public dialog: MatDialog, public clienteServicio: ClienteService, private loaderService: LoaderService) {
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
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario de orden venta
    this.formulario = this.ordenRecoleccion.formulario;
    //Define el formulario para la pestña Listar
    this.formularioListar = new FormGroup({
      fechaDesde: new FormControl(),
      fechaHasta: new FormControl(),
      remitente: new FormControl()
    });
    this.reestablecerFormulario(undefined);
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Lista todos los registros
    this.listar();
    //Lista todas las sucursales
    this.listarSucursales();
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAlias(data).subscribe(res => {
          this.formulario.patchValue(res.json());
        })
      }
    })
    //Autcompletado - Buscar por Remitente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosClientes = res;
        })
      }
    });
    //Autcompletado - Buscar por Localidad
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.localidadService.listarPorNombre(data).subscribe(res => {
          this.resultadosLocalidades = res;
        })
      }
    });
    //Autcompletado - Buscar por Barrio
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.barrioService.listarPorNombre(data).subscribe(res => {
          this.resultadosBarrios = res;
        })
      }
    })
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Obtiene el listado de Sucursales
  private listarSucursales() {
    this.loaderService.show();
    this.sucursalService.listar().subscribe(
      res => {
        this.resultadosSucursales = res.json();
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Controla el cambio del autocompletado para el Remitente
  public cambioRemitente() {
    let cliente = this.formulario.get('cliente').value;
    let domicilio = null;
    let barrio = null;
    let provincia = null;
    let localidad = null;
    let domicilioYBarrio = null;
    let localidadYProvincia = null;
    if (cliente.domicilio)
      domicilio = cliente.domicilio;
    if (cliente.barrio)
      barrio = cliente.barrio;
    if (cliente.localidad)
      localidad = cliente.localidad;
    if (cliente.localidad.provincia)
      provincia = cliente.localidad.provincia.nombre;
    if (barrio)
      domicilioYBarrio = domicilio + ' - ' + barrio['nombre'];
    else
      domicilioYBarrio = domicilio + ' - ';
    if (localidad)
      localidadYProvincia = localidad['nombre'] + ' - ' + provincia;
    else
      localidadYProvincia = provincia;
    this.mostrarCliente = true;
    this.domicilioBarrio.setValue(domicilioYBarrio);
    this.localidadProvincia.setValue(localidadYProvincia);
    this.formulario.get('localidad').setValue(localidad);
    this.formulario.get('barrio').setValue(barrio);
    this.formulario.get('domicilio').setValue(domicilio);
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, selectSoloLectura, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    if (selectSoloLectura == true) {
      this.formulario.get('entregarEnDomicilio').disable();
      this.formulario.get('pagoEnOrigen').disable();
      this.formulario.get('sucursalDestino').disable();
      this.formulario.get('entregarEnDomicilio').disable();
      this.formulario.get('localidad').disable();
      this.formulario.get('barrio').disable();
      this.formulario.get('cliente').disable();
      setTimeout(function () {
        document.getElementById('btnAgregar').setAttribute("disabled", "disabled");
      }, 20);
    } else {
      this.formulario.get('entregarEnDomicilio').enable();
      this.formulario.get('pagoEnOrigen').enable();
      this.formulario.get('sucursalDestino').enable();
      this.formulario.get('entregarEnDomicilio').enable();
      this.formulario.get('localidad').enable();
      this.formulario.get('barrio').enable();
      this.formulario.get('cliente').enable();
      setTimeout(function () {
        document.getElementById('btnAgregar').removeAttribute("disabled");
      }, 20);
    }
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.listar();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, false, 'idCliente');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, false, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, true, 'idAutocompletado');
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
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('usuario').setValue(this.appService.getUsuario());
    this.formulario.get('tipoComprobante').setValue({ id: 3 });
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idCliente').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        document.getElementById("idCliente").focus();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appService.getUsuario().sucursal);
    this.formulario.get('usuario').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("idCliente").focus();
          this.toastr.error(respuesta.mensaje);
          this.loaderService.hide();
        }
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Abre el dialogo para agregar un cliente eventual
  public agregarClienteEventual(): void {
    const dialogRef = this.dialog.open(ClienteEventualComponent, {
      width: '1200px',
      data: {
        formulario: null,
        usuario: this.appService.getUsuario()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      this.clienteServicio.obtenerPorId(resultado).subscribe(res => {
        var cliente = res.json();
        this.formulario.get('cliente').setValue(cliente);
        this.cambioRemitente();
      })
    });
  }
  //Comprueba que la fecha de Recolección sea igual o mayor a la fecha actual 
  public verificarFecha() {
    if (this.formulario.get('fecha').value < this.fechaEmisionFormatoOrig.value) {
      this.formulario.get('fecha').reset();
      this.toastr.error("La Fecha de recolección no puede ser menor a la fecha actual");
      setTimeout(function () {
        document.getElementById('idFecha').focus();
      }, 20);
    }
  }
  //Verifica que el formato de las horas sea el correcto
  public verificarHora() {
    let horaDesde = this.formulario.get('horaDesde').value;
    let horaHasta = this.formulario.get('horaHasta').value;
    let splitHoraDesde = horaDesde.split(":");
    let splitHoraHasta = horaHasta.split(":");
    //Si el array del horario es vacio significa que en el front no es correcto (--:00 || 00:-- || --:--)
    if (splitHoraDesde[0] == "") {
      this.toastr.error("El formato del horario no es el adecuado. No puede haber '--'");
      setTimeout(function () {
        document.getElementById('idHoraDesde').focus();
      }, 20);
      return false;
    }
    else if (splitHoraHasta[0] == "") {
      this.toastr.error("El formato del horario no es el adecuado. No puede haber '--'");
      setTimeout(function () {
        document.getElementById('idHoraHasta').focus();
      }, 20);
      return false
    }
    else {
      this.validarHoraHastaDesde();
    }
  }
  //Valida que la Hora Hasta no sea menor a Hora Desde
  public validarHoraHastaDesde() {
    if (!this.formulario.value.horaDesde) {
      this.toastr.error("Debe ingresar una Hora Desde");
      document.getElementById('idHoraDesde').focus();
    } else {
      if (this.formulario.value.horaHasta < this.formulario.value.horaDesde) {
        this.toastr.error("Hora Hasta no puede ser menor a Hora Desde");
        document.getElementById('idHoraHasta').focus();
      }
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Establece los decimales
  public establecerDecimales(formulario, cantidad): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Establece los enteros
  public establecerEnteros(formulario): void {
    let valor = formulario.value;
    if (valor) {
      formulario.setValue(this.appService.establecerEnteros(valor));
    }
  }
  //Obtiene la mascara de importe
  public mascararEnterosConDecimales(intLimite) {
    return this.appService.mascararEnterosConDecimales(intLimite);
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Obtiene la mascara de enteros con separador de miles
  public mascararEnterosSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Reestablece el formulario
  public reestablecerFormulario(id) {
    this.resultadosClientes = [];
    this.mostrarCliente = false;
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.domicilioBarrio.setValue(null);
    this.localidadProvincia.setValue(null);
    //Setea la fecha actual en los campos correspondientes
    this.fechaServicio.obtenerFecha().subscribe(res => {
      let respuesta = res.json();
      let anio = respuesta.split('-');
      this.fechaEmisionFormatoOrig.setValue(respuesta);
      this.fechaEmisionFormatoNuevo.setValue(anio[2] + '-' + anio[1] + '-' + anio[0]);
      this.formulario.get('fecha').setValue(respuesta);
      //Inicializo los valores para las horas
      this.formulario.get('horaDesde').setValue('00:00');
      this.formulario.get('horaHasta').setValue('00:00');
    });

  }
  //Funcion para comparar y mostrar elemento de campo select
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
  public displayFn(elemento) {
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
      return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
    } else {
      return '';
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    let domicilioYBarrio = this.formulario.get('cliente').value.domicilio + ' - ' + this.formulario.get('cliente').value.barrio.nombre;
    let localidadYProvincia = this.formulario.get('cliente').value.localidad.nombre + ' - ' + this.formulario.get('cliente').value.localidad.provincia.nombre;
    this.domicilioBarrio.setValue(domicilioYBarrio);
    this.localidadProvincia.setValue(localidadYProvincia);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    let domicilioYBarrio = this.formulario.get('cliente').value.domicilio + ' - ' + this.formulario.get('cliente').value.barrio.nombre;
    let localidadYProvincia = this.formulario.get('cliente').value.localidad.nombre + ' - ' + this.formulario.get('cliente').value.localidad.provincia.nombre;
    this.domicilioBarrio.setValue(domicilioYBarrio);
    this.localidadProvincia.setValue(localidadYProvincia);
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}