import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../servicios/cliente.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CobradorService } from '../../servicios/cobrador.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { ZonaService } from '../../servicios/zona.service';
import { RubroService } from '../../servicios/rubro.service';
import { CondicionIvaService } from '../../servicios/condicion-iva.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { ResumenClienteService } from '../../servicios/resumen-cliente.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { SituacionClienteService } from '../../servicios/situacion-cliente.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  //Define la pestania activa
  private activeLink:any = null;
  //Define el indice seleccionado de pestania
  private indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  private pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  private mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  private soloLectura:boolean = false;
  //Define si mostrar el boton
  private mostrarBoton:boolean = null;
  //Define una lista
  private lista:Array<any> = [];
  //Define la lista de pestanias
  private pestanias:Array<any> = [];
  //Define la lista de opciones
  private opciones:Array<any> = [];
  //Define un formulario para validaciones de campos
  private formulario:FormGroup;
  //Define la lista completa de registros
  private listaCompleta:Array<any> = [];
  //Define la opcion seleccionada
  private opcionSeleccionada:number = null;
  //Define la lista de condiciones de iva
  private condicionesIva:Array<any> = [];
  //Define la lista de tipos de documentos
  private tiposDocumentos:Array<any> = [];
  //Define la lista de resumenes de clientes
  private resumenesClientes:Array<any> = [];
  //Define la lista de situaciones de clientes
  private situacionesClientes:Array<any> = [];
  //Define la opcion activa
  private botonOpcionActivo:boolean = null;
  //Define el form control para las busquedas
  private autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados:Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  private resultadosBarrios:Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  private resultadosLocalidades:Array<any> = [];
  //Define la lista de resultados de busqueda de cobrador
  private resultadosCobradores:Array<any> = [];
  //Define la lista de resultados de busqueda de vendedor
  private resultadosVendedores:Array<any> = [];
  //Define la lista de resultados de busqueda de zona
  private resultadosZonas:Array<any> = [];
  //Define la lista de resultados de busqueda de rubro
  private resultadosRubros:Array<any> = [];
  //Define la lista de resultados de busqueda de orden venta
  private resultadosOrdenesVentas:Array<any> = [];
  //Define la lista de resultados de busqueda de cuenta principal
  private resultadosCuentasPrincipales:Array<any> = [];
  //Define la lista de resultados de busqueda de sucursal lugar pago
  private resultadosSucursalesPago:Array<any> = [];
  //Define la lista de resultados de busqueda de compania seguro
  private resultadosCompaniasSeguros:Array<any> = [];
  //Constructor
  constructor(private servicio: ClienteService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private cobradorServicio: CobradorService,
    private vendedorServicio: VendedorService, private zonaServicio: ZonaService,
    private rubroServicio: RubroService, private condicionIvaServicio: CondicionIvaService,
    private tipoDocumentoServicio: TipoDocumentoService, private resumenClienteServicio: ResumenClienteService,
    private sucursalServicio: SucursalService, private situacionClienteServicio: SituacionClienteService,
    private companiaSeguroServicio: CompaniaSeguroService, private ordenVentaServicio: OrdenVentaService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.pestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
      },
      err => {
        console.log(err);
      }
    );
    //Obtiene la lista de opciones por rol y subopcion
    this.rolOpcionServicio.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
    .subscribe(
      res => {
        this.opciones = res.json();
      },
      err => {
        console.log(err);
      }
    );
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(1, 0);
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
      razonSocial: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      nombreFantasia: new FormControl('', Validators.maxLength(45)),
      cuentaPrincipal: new FormControl(),
      domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      localidad: new FormControl('', [Validators.required]),
      barrio: new FormControl(),
      telefono: new FormControl('', [Validators.maxLength(45)]),
      sitioWeb: new FormControl('', [Validators.maxLength(60)]),
      zona: new FormControl(),
      rubro: new FormControl(),
      cobrador: new FormControl(),
      vendedor: new FormControl(),
      condicionIva: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      numeroIIBB: new FormControl('', Validators.maxLength(15)),
      esCuentaCorriente: new FormControl('', [Validators.required]),
      resumenCliente: new FormControl(),
      situacionCliente: new FormControl(),
      ordenVenta: new FormControl(),
      sucursalLugarPago: new FormControl(),
      creditoLimite: new FormControl('', [Validators.min(1), Validators.maxLength(12)]),
      descuentoFlete: new FormControl('', [Validators.min(1), Validators.maxLength(4)]),
      descuentoSubtotal: new FormControl('', [Validators.min(1), Validators.maxLength(4)]),
      esSeguroPropio: new FormControl(),
      companiaSeguro: new FormControl(),
      numeroPolizaSeguro: new FormControl('', Validators.maxLength(20)),
      vencimientoPolizaSeguro: new FormControl(),
      observaciones: new FormControl('', Validators.maxLength(400)),
      notaEmisionComprobante: new FormControl('', Validators.maxLength(200)),
      notaImpresionComprobante: new FormControl('', Validators.maxLength(200)),
      notaImpresionRemito: new FormControl('', Validators.maxLength(200)),
      imprimirControlDeuda: new FormControl('', Validators.required),
      usuarioAlta: new FormControl(),
      usuarioBaja: new FormControl(),
      fechaBaja: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      alias: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Cobrador - Buscar por nombre
    this.formulario.get('cobrador').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.cobradorServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCobradores = response;
        })
      }
    })
    //Autocompletado Vendedor - Buscar por nombre
    this.formulario.get('vendedor').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.vendedorServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosVendedores = response;
        })
      }
    })
    //Autocompletado Zona - Buscar por nombre
    this.formulario.get('zona').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.zonaServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosZonas = response;
        })
      }
    })
    //Autocompletado Rubro - Buscar por nombre
    this.formulario.get('rubro').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.rubroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosRubros = response;
        })
      }
    })
    //Autocompletado Orden Venta - Buscar por nombre
    this.formulario.get('ordenVenta').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.ordenVentaServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosOrdenesVentas = response;
        })
      }
    })
    //Autocompletado Cuenta Principal - Buscar por nombre
    this.formulario.get('cuentaPrincipal').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorAlias(data).subscribe(response => {
          this.resultadosCuentasPrincipales = response;
        })
      }
    })
    //Autocompletado Sucursal Lugar Pago - Buscar por nombre
    this.formulario.get('sucursalLugarPago').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.sucursalServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosSucursalesPago = response;
        })
      }
    })
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCompaniasSeguros = response;
        })
      }
    })
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de resumenes de clientes
    this.listarResumenesClientes();
    //Obtiene la lista de situaciones de clientes
    this.listarSituacionesClientes();
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
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
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosCobradores = [];
    this.resultadosVendedores = [];
    this.resultadosZonas = [];
    this.resultadosRubros = [];
    this.resultadosOrdenesVentas = [];
    this.resultadosCuentasPrincipales = [];
    this.resultadosSucursalesPago = [];
    this.resultadosCompaniasSeguros = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.formulario.patchValue(elemAutocompletado);
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
        this.establecerValoresPestania(nombre, false, false, true, 'idRazonSocial');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      default:
        break;
    }
  }
  //Establece la opcion seleccionada
  public seleccionarOpcion(opcion, indice) {
    this.opcionSeleccionada = opcion;
    this.botonOpcionActivo = indice;
    switch(opcion) {
      case 1:
        setTimeout(function () {
          document.getElementById('idRazonSocial').focus();
        }, 20);
        break;
      case 2:
        setTimeout(function () {
          document.getElementById('idEsCuentaCorriente').focus();
        }, 20);
        break;
      case 3:
        setTimeout(function () {
          document.getElementById('idEsSeguroPropio').focus();
        }, 20);
        break;
      case 4:
        setTimeout(function () {
          document.getElementById('idObservaciones').focus();
        }, 20);
        break;
      case 5:
        setTimeout(function () {
          document.getElementById('idEmitirComprobante').focus();
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
  //Obtiene el listado de condiciones de iva
  private listarCondicionesIva() {
    this.condicionIvaServicio.listar().subscribe(
      res => {
        this.condicionesIva = res.json();
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
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de resumenes de clientes
  private listarResumenesClientes() {
    this.resumenClienteServicio.listar().subscribe(
      res => {
        this.resumenesClientes = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de situaciones de clientes
  private listarSituacionesClientes() {
    this.situacionClienteServicio.listar().subscribe(
      res => {
        this.situacionesClientes = res.json();
      },
      err => {
        console.log(err);
      }
    );
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
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function() {
            document.getElementById('idRazonSocial').focus();
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
    this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
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
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if(respuesta.codigo == 11006) {
      document.getElementById("labelRazonSocial").classList.add('label-error');
      document.getElementById("idRazonSocial").classList.add('is-invalid');
      document.getElementById("idRazonSocial").focus();
    } else if(respuesta.codigo == 11009) {
      document.getElementById("labelTelefono").classList.add('label-error');
      document.getElementById("idTelefono").classList.add('is-invalid');
      document.getElementById("idTelefono").focus();
    } else if(respuesta.codigo == 11008) {
      document.getElementById("labelSitioWeb").classList.add('label-error');
      document.getElementById("idSitioWeb").classList.add('is-invalid');
      document.getElementById("idSitioWeb").focus();
    } else if(respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    }
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
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if(valor != undefined) {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if(campo == 'sitioWeb') {
          document.getElementById("labelSitioWeb").classList.add('label-error');
          document.getElementById("idSitioWeb").classList.add('is-invalid');
          this.toastr.error('Sitio Web incorrecto');
        }
      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    var opcion = this.opcionSeleccionada;
    if(keycode == 113) {
      if(indice < this.pestanias.length) {
        this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    } else if(keycode == 115) {
      if(opcion < this.opciones.length) {
        this.seleccionarOpcion(opcion+1, opcion);
      } else {
        this.seleccionarOpcion(1, 0);
      }
    }
  }
}
