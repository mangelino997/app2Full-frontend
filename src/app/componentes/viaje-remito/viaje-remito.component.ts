import { Component, OnInit } from '@angular/core';
import { ViajeRemitoService } from '../../servicios/viaje-remito.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { ClienteService } from '../../servicios/cliente.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { TipoComprobanteService } from '../../servicios/tipo-comprobante.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viaje-remito',
  templateUrl: './viaje-remito.component.html',
  styleUrls: ['./viaje-remito.component.css']
})
export class ViajeRemitoComponent implements OnInit {
  //Define la pestania activa
  public activeLink:any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define el form control para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda cliente remitente
  public resultadosClienteRemitente:Array<any> = [];
  //Define la lista de resultados de busqueda cliente destinatario
  public resultadosClienteDestinatario:Array<any> = [];
  //Define la lista de sucursales
  public sucursales:Array<any> = [];
  //Define la lista de tipos de comprobantes
  public tiposComprobantes:Array<any> = [];
  //Define la lista de letras
  public letras:Array<any> = [];
  //Constructor
  constructor(private servicio: ViajeRemitoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private sucursalServicio: SucursalService, private clienteServicio: ClienteService,
    private tipoComprobanteServicio: TipoComprobanteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
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
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorAlias(data).subscribe(response =>{
          this.resultados = response;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      sucursalEmision: new FormControl(),
      empresaEmision: new FormControl(),
      usuario: new FormControl(),
      fecha: new FormControl('', Validators.required),
      numeroCamion: new FormControl('', Validators.required),
      sucursalDestino: new FormControl('', Validators.required),
      tipoComprobante: new FormControl('', Validators.required),
      puntoVenta: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      letra: new FormControl('', Validators.required),
      numero: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      clienteRemitente: new FormControl('', Validators.required),
      clienteDestinatario: new FormControl('', Validators.required),
      clienteDestinatarioSuc: new FormControl(),
      bultos: new FormControl('', Validators.required),
      kilosEfectivo: new FormControl(),
      kilosAforado: new FormControl(),
      m3: new FormControl(),
      valorDeclarado: new FormControl(),
      importeRetiro: new FormControl(),
      importeEntrega: new FormControl(),
      estaPendiente: new FormControl(),
      viajePropioTramo: new FormControl(),
      viajeTerceroTramo: new FormControl(),
      observaciones: new FormControl(),
      estaFacturado: new FormControl(),
      seguimiento: new FormControl(''),
      estaEnReparto: new FormControl(),
      alias: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado ClienteRemitente - Buscar por nombre
    this.formulario.get('clienteRemitente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClienteRemitente = response;
        })
      }
    })
    //Autocompletado ClienteDestinatario - Buscar por nombre
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClienteDestinatario = response;
        })
      }
    })
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de condiciones de iva
    this.listarSucursales();
    //Obtiene la lista de tipos de comprobantes
    this.listarTiposComprobantes();
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
    //Crea la lista de letras
    this.letras = ['A', 'B', 'C', 'R'];
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario(elemento) {
    this.formulario.patchValue(elemento);
    this.formulario.get('puntoVenta').setValue(this.displayCeros(elemento));
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('fecha').setValue(new Date().toISOString().substring(0, 10));
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultados = [];
    this.resultadosClienteRemitente = [];
    this.resultadosClienteDestinatario = [];
  }
  //Obtiene el listado de sucursales
  private listarSucursales() {
    this.sucursalServicio.listar().subscribe(
      res => {
        this.sucursales = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos comprobantes
  private listarTiposComprobantes() {
    this.tipoComprobanteServicio.listarPorEstaActivoIngresoCargaTrue().subscribe(
      res => {
        this.tiposComprobantes = res.json();
        this.establecerTipoComprobantePorDefecto();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece el tipo comprobante por defecto
  private establecerTipoComprobantePorDefecto() {
    this.formulario.get('tipoComprobante').setValue(this.tiposComprobantes[1]);
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('sucursalDestino').enable();
      this.formulario.get('tipoComprobante').enable();
      this.formulario.get('letra').enable();
    } else {
      this.formulario.get('sucursalDestino').disable();
      this.formulario.get('tipoComprobante').disable();
      this.formulario.get('letra').disable();
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPorDefecto();
        this.establecerValoresPestania(nombre, false, false, true, 'idFecha');
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
  private listar() {
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.formulario.get('letra').enable();
    this.formulario.get('sucursalEmision').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('empresaEmision').setValue(this.appComponent.getEmpresa());
    this.formulario.get('usuario').setValue(this.appComponent.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          this.establecerTipoComprobantePorDefecto();
          setTimeout(function() {
            document.getElementById('idFecha').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.formulario.get('letra').enable();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function() {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('fecha').setValue(undefined);
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario(elemento);
    this.establecerEstadoCampos(false);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.establecerEstadoCampos(true);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario(elemento);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos con ceros a la izquierda
  public displayCeros(elemento) {
    if(elemento != undefined) {
      return elemento.puntoVenta ? ("00000" + elemento.puntoVenta).slice(-5) : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if(keycode == 113) {
      if(indice < this.pestanias.length) {
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
}