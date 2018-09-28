import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../servicios/proveedor.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { RolOpcionService } from '../../servicios/rol-opcion.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CondicionIvaService } from '../../servicios/condicion-iva.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { TipoProveedorService } from '../../servicios/tipo-proveedor.service';
import { CondicionCompraService } from '../../servicios/condicion-compra.service';
import { BancoService } from '../../servicios/banco.service';
import { TipoCuentaBancariaService } from '../../servicios/tipo-cuenta-bancaria.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html'
})
export class ProveedorComponent implements OnInit {
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
  private lista = null;
  //Define la lista de pestanias
  private pestanias = null;
  //Define la lista de opciones
  private opciones = null;
  //Define un formulario para validaciones de campos
  private formulario = null;
  //Define el elemento
  private elemento:any = {};
  //Define el elemento de autocompletado
  private elemAutocompletado:any = null;
  //Define el siguiente id
  private siguienteId:number = null;
  //Define la lista completa de registros
  private listaCompleta:any = null;
  //Define la opcion seleccionada
  private opcionSeleccionada:number = null;
  //Define la lista de condiciones de iva
  private condicionesIva:any = null;
  //Define la lista de tipos de documentos
  private tiposDocumentos:any = null;
  //Define la lista de tipos de proveedores
  private tiposProveedores:any = null;
  //Define la lista de condiciones de compra
  private condicionesCompras:any = null;
  //Define la lista de tipos de cuentas bancarias
  private tiposCuentasBancarias:any = null;
  //Define la opcion activa
  private botonOpcionActivo:any = null;
  //Define el form control para las busquedas
  private buscar:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados = [];
  //Define el form control para autocompletado barrio
  private buscarBarrio:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de barrios
  private resultadosBarrios = [];
  //Define el form control para autocompletado localidad
  private buscarLocalidad:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de localidades
  private resultadosLocalidades = [];
  //Define el form control para autocompletado banco
  private buscarBanco:FormControl = new FormControl();
  //Define la lista de resultados de busqueda de bancos
  private resultadosBancos = [];
  //Constructor
  constructor(private servicio: ProveedorService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private condicionIvaServicio: CondicionIvaService,
    private tipoDocumentoServicio: TipoDocumentoService, private tipoProveedorServicio: TipoProveedorService,
    private condicionCompraServicio: CondicionCompraService, private bancoServicio: BancoService,
    private tipoCuentaBancariaServicio: TipoCuentaBancariaService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      razonSocial: new FormControl(),
      nombreFantasia: new FormControl(),
      domicilio: new FormControl(),
      barrio: new FormControl(),
      localidad: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl(),
      numeroIIBB: new FormControl(),
      sitioWeb: new FormControl(),
      telefono: new FormControl(),
      condicionIva: new FormControl(),
      condicionCompra: new FormControl(),
      usuarioAlta: new FormControl(),
      usuarioBaja: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      observaciones: new FormControl(),
      notaIngresarComprobante: new FormControl(),
      notaImpresionOrdenPago: new FormControl(),
      banco: new FormControl(),
      tipoCuentaBancaria: new FormControl(),
      numeroCuenta: new FormControl(),
      titular: new FormControl(),
      numeroCBU: new FormControl(),
      aliasCBU: new FormControl(),
      tipoProveedor: new FormControl(),
      estaActivo: new FormControl(),
      alias: new FormControl(),
      cuentaGasto: new FormControl(),//Revisar
      cuentaPasivo: new FormControl()//Revisar
    });
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
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(8, 0);
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    this.buscar.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.servicio.listarPorAlias(data).subscribe(response =>{
            this.resultados = response;
          })
        }
    })
    //Autocompletado Barrio - Buscar por nombre
    this.buscarBarrio.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
          })
        }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.buscarLocalidad.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
          })
        }
    })
    //Autocompletado Banco - Buscar por nombre
    this.buscarBanco.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.bancoServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBancos = response;
          })
        }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de tipos de proveedores
    this.listarTiposProveedores();
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene la lista de condiciones de compra
    this.listarCondicionesCompras();
    //Obtiene la lista de tipos de cuentas bancarias
    this.listarTiposCuentasBancarias();
  }
  //Obtiene el listado de tipos de proveedores
  private listarTiposProveedores() {
    this.tipoProveedorServicio.listar().subscribe(
      res => {
        this.tiposProveedores = res.json();
      },
      err => {
        console.log(err);
      }
    );
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
  //Obtiene el listado de condiciones de compras
  private listarCondicionesCompras() {
    this.condicionCompraServicio.listar().subscribe(
      res => {
        this.condicionesCompras = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos de cuentas bancarias
  private listarTiposCuentasBancarias() {
    this.tipoCuentaBancariaServicio.listar().subscribe(
      res => {
        this.tiposCuentasBancarias = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
    this.resultadosBancos = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.elemento = elemAutocompletado;
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarLista();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.elemAutocompletado = null;
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
      case 8:
        setTimeout(function () {
          document.getElementById('idRazonSocial').focus();
        }, 20);
        break;
      case 9:
        setTimeout(function () {
          document.getElementById('idCondicionCompra').focus();
        }, 20);
        break;
      case 10:
        setTimeout(function () {
          document.getElementById('idBanco').focus();
        }, 20);
        break;
      case 11:
        setTimeout(function () {
          document.getElementById('idObservaciones').focus();
        }, 20);
        break;
      case 12:
        setTimeout(function () {
          document.getElementById('idIngresarComprobante').focus();
        }, 20);
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice, elemento) {
    switch (indice) {
      case 1:
        this.agregar(elemento);
        break;
      case 3:
        this.actualizar(elemento);
        break;
      case 4:
        this.eliminar(elemento);
        break;
      default:
        break;
    }
  }
  //Reestablece los campos agregar
  private reestablecerCamposAgregar(id) {
    this.elemento = {};
    this.elemento.id = id;
    this.vaciarLista();
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
    this.elemAutocompletado = null;
    this.vaciarLista();
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.servicio.obtenerSiguienteId().subscribe(
      res => {
        this.elemento.id = res.json();
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
  private agregar(elemento) {
    elemento.usuarioAlta = this.appComponent.getUsuario();
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
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
  private actualizar(elemento) {
    this.servicio.actualizar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerCampos();
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
  private eliminar(elemento) {
    console.log(elemento);
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
    } else if(respuesta.codigo == 11011) {
      document.getElementById("labelNumeroCBU").classList.add('label-error');
      document.getElementById("idNumeroCBU").classList.add('is-invalid');
      document.getElementById("idNumeroCBU").focus();
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
  public validarPatron(patron, valor, campo) {
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
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.elemAutocompletado = elemento;
    this.elemento = elemento;
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
    } else if(keycode == 114) {
      if(opcion < this.opciones[(this.opciones.length-1)].id) {
        this.seleccionarOpcion(opcion+1, opcion-7);
      } else {
        this.seleccionarOpcion(8, 0);
      }
    }
  }
}
