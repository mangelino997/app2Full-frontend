import { Component, OnInit } from '@angular/core';
import { ChoferProveedorService } from '../../servicios/chofer-proveedor.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-chofer-proveedor',
  templateUrl: './chofer-proveedor.component.html',
  styleUrls: ['/chofer-proveedor.component.css']
})
export class ChoferProveedorComponent implements OnInit {
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
  //Define un formulario para validaciones de campos
  private formulario:FormGroup;
  //Define la lista completa de registros
  private listaCompleta:Array<any> = [];
  //Define la lista de choferes por proveedor
  private resultadosChoferes:Array<any> = [];
  //Define la lista de tipos de documentos
  private tiposDocumentos:Array<any> = [];
  //Define el id de proveedor
  private idProveedor:FormControl = new FormControl();
  //Define la razon social del proveedor
  private razonSocial:FormControl = new FormControl();
  //Define los choferes
  private choferes:FormControl = new FormControl();
  //Define el form control para las busquedas
  private autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  private resultados:Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  private resultadosBarrios:Array<any> = [];
  //Define la lista de resultados de busqueda de localidad
  private resultadosLocalidades:Array<any> = [];
  //Constructor
  constructor(private servicio: ChoferProveedorService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private appServicio: AppService, private toastr: ToastrService,
    private proveedorServicio: ProveedorService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private tipoDocumentoServicio: TipoDocumentoService) {
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
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por alias
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.proveedorServicio.listarPorAlias(data).subscribe(response =>{
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
      nombre: new FormControl(),
      domicilio: new FormControl(),
      proveedor: new FormControl(),
      barrio: new FormControl(),
      localidad: new FormControl(),
      tipoDocumento: new FormControl(),
      numeroDocumento: new FormControl(),
      fechaNacimiento: new FormControl(),
      telefonoFijo: new FormControl(),
      telefonoMovil: new FormControl(),
      vtoCarnet: new FormControl(),
      vtoCurso: new FormControl(),
      vtoLNH: new FormControl(),
      vtoLibretaSanidad: new FormControl(),
      usuarioAlta: new FormControl(),
      fechaAlta: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      usuarioBaja: new FormControl(),
      fechaBaja: new FormControl(),
      alias: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
          })
        }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
          })
        }
    })
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
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
  public vaciarLista() {
    this.resultados = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   this.idProveedor.setValue(elemAutocompletado.id);
   this.razonSocial.setValue(elemAutocompletado.razonSocial);
   this.listarPorProveedor(elemAutocompletado.id);
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
        this.establecerValoresPestania(nombre, false, false, true, 'idAutocompletado');
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
  //Obtiene una lista de choferes por proveedor
  private listarPorProveedor(proveedor) {
    this.servicio.listarPorProveedor(proveedor.id).subscribe(
      res => {
        this.resultadosChoferes = res.json();
      },
      err => {
        console.log(err);
      }
    )
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
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarLista();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if(respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    } else if(respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    } else if(respuesta.codigo == 11014) {
      document.getElementById("labelTelefonoMovil").classList.add('label-error');
      document.getElementById("idTelefonoMovil").classList.add('is-invalid');
      document.getElementById("idTelefonoMovil").focus();
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
  //Maneja los evento al presionar una tacla (para pestanias)
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
