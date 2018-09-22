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
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html'
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
  private lista = null;
  //Define la lista de pestanias
  private pestanias = null;
  //Define la lista de opciones
  private opciones = null;
  //Define un formulario para validaciones de campos
  private formulario = null;
  //Define el elemento
  private elemento:any = {};
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
  //Define la opcion activa
  private botonOpcionActivo:any = null;
  //Constructor
  constructor(private servicio: ClienteService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private rolOpcionServicio: RolOpcionService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private cobradorServicio: CobradorService,
    private vendedorServicio: VendedorService, private zonaServicio: ZonaService,
    private rubroServicio: RubroService, private condicionIvaServicio: CondicionIvaService,
    private tipoDocumentoServicio: TipoDocumentoService) {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      autocompletado: new FormControl(),
      id: new FormControl(),
      razonSocial: new FormControl(),
      nombreFantasia: new FormControl(),
      cuentaPrincipal: new FormControl(),
      domicilio: new FormControl(),
      localidad: new FormControl(),
      barrio: new FormControl(),
      telefono: new FormControl(),
      sitioWeb: new FormControl(),
      zona: new FormControl(),
      rubro: new FormControl(),
      cobrador: new FormControl(),
      vendedor: new FormControl(),
      condicionIva: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl(),
      numeroIIBB: new FormControl(),
      esCuentaCorriente: new FormControl(),
      resumenCliente: new FormControl(),
      situacionCliente: new FormControl(),
      ordenVenta: new FormControl(),
      sucursalLugarPago: new FormControl(),
      creditoLimite: new FormControl(),
      descuentoFlete: new FormControl(),
      descuentoSubtotal: new FormControl(),
      esSeguroPropio: new FormControl(),
      companiaSeguro: new FormControl(),
      numeroPolizaSeguro: new FormControl(),
      vencimientoPolizaSeguro: new FormControl(),
      observaciones: new FormControl(),
      notaEmisionComprobante: new FormControl(),
      notaImpresionComprobante: new FormControl(),
      notaImpresionRemito: new FormControl(),
      imprimirControlDeuda: new FormControl()
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
    this.seleccionarPestania(1, 'Agregar');
    //Establece la primera opcion seleccionada
    this.seleccionarOpcion(1, 0);
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
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
  }
  //Reestablece los campos
  private reestablecerCampos() {
    this.elemento = {};
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
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Funcion para listar por alias
  buscar = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.servicio.listarPorAlias(term))
  )
  formatear = (x: {alias: string}) => x.alias;
  //Funcion para listar barrios por nombre
  buscarBarrio = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.barrioServicio.listarPorNombre(term))
  )
  formatearBarrio = (x: {nombre: string}) => x.nombre;
  //Funcion para listar localidades por nombre
  buscarLocalidad = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.localidadServicio.listarPorNombre(term))
  )
  formatearLocalidad = (x: {nombre: string, provincia:any}) => x.nombre + ', '
    + x.provincia.nombre + ' - ' + x.provincia.pais.nombre;
  //Funcion para listar cobradores por nombre
  buscarCobrador = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.cobradorServicio.listarPorNombre(term))
  )
  formatearCobrador = (x: {nombre: string}) => x.nombre;
  //Funcion para listar vendedores por nombre
  buscarVendedor = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.vendedorServicio.listarPorNombre(term))
  )
  formatearVendedor = (x: {nombre: string}) => x.nombre;
  //Funcion para listar zonas por nombre
  buscarZona = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.zonaServicio.listarPorNombre(term))
  )
  formatearZona = (x: {nombre: string}) => x.nombre;
  //Funcion para listar rubros por nombre
  buscarRubro = (text$: Observable<string>) => text$.pipe(
    map(term => term.length < 2 ? [] : this.rubroServicio.listarPorNombre(term))
  )
  formatearRubro = (x: {nombre: string}) => x.nombre;
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.elemento = elemento;
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.elemento = elemento;
  }
}
