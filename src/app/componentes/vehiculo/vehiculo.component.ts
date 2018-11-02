import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PestaniaService } from '../../servicios/pestania.service';
import { TipoVehiculoService } from '../../servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from '../../servicios/marca-vehiculo.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { ConfiguracionVehiculoService } from '../../servicios/configuracion-vehiculo.service';
import { PersonalService } from '../../servicios/personal.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css']
})
export class VehiculoComponent implements OnInit {
  //Obtiene el componente autocompletado tipo vehiculo del dom
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) 
  autoComplete: MatAutocompleteTrigger;
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
  //Define si mostrar la lista de configuraciones de vehiculos
  public mostrarConfiguracionVehiculo:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define la lista de tipos de vehiculos
  public tiposVehiculos:Array<any> = [];
  //Define la lista de marcas de vehiculos
  public marcasVehiculos:Array<any> = [];
  //Define la lista de empresas
  public empresas:Array<any> = [];
  //Define la lista de configuraciones de vehiculos
  public configuracionesVehiculos:Array<any> = [];
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define un campo control para tipo vehiculo
  public tipoVehiculo:FormControl = new FormControl();
  //Define un campo control para marca vehiculo
  public marcaVehiculo:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define la lista de resultados de busqueda vehiculo remolque
  public resultadosVehiculosRemolques = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de busqueda compania seguro
  public resultadosCompaniasSeguros = [];
  //Define la lista de resultados de busqueda personal
  public resultadosPersonales = [];
  //Define el campo de control configuracion
  public configuracion:FormControl = new FormControl();
  //Defiene la lista de compania seguro poliza
  public companiasSegurosPolizas:Array<any> = [];
  //Constructor
  constructor(private servicio: VehiculoService, private pestaniaService: PestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService,
    private tipoVehiculoServicio: TipoVehiculoService, private marcaVehiculoServicio: MarcaVehiculoService,
    private localidadServicio: LocalidadService, private empresaServicio: EmpresaService,
    private companiaSeguroPolizaServicio: CompaniaSeguroPolizaService,
    private configuracionVehiculoServicio: ConfiguracionVehiculoService,
    private personalServicio: PersonalService) {
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
      if (typeof data == 'string') {
        this.servicio.listarPorAlias(data).subscribe(response => {
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
      configuracionVehiculo: new FormControl('', Validators.required),
      dominio: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      numeroInterno: new FormControl('', Validators.maxLength(5)),
      localidad: new FormControl('', Validators.required),
      anioFabricacion: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(4)]),
      numeroMotor: new FormControl('', [Validators.min(5), Validators.maxLength(25)]),
      numeroChasis: new FormControl('', [Validators.min(5), Validators.maxLength(25)]),
      empresa: new FormControl('', Validators.required),
      personal: new FormControl(),
      vehiculoRemolque: new FormControl(),
      companiaSeguroPoliza: new FormControl(),
      vtoRTO: new FormControl('', Validators.required),
      numeroRuta: new FormControl('', [Validators.required, Validators.min(5), Validators.maxLength(25)]),
      vtoRuta: new FormControl('', Validators.required),
      vtoSenasa: new FormControl(),
      vtoHabBromatologica: new FormControl(),
      usuarioAlta: new FormControl(),
      fechaAlta: new FormControl(),
      usuarioBaja: new FormControl(),
      fechaBaja: new FormControl(),
      usuarioMod: new FormControl(),
      fechaUltimaMod: new FormControl(),
      alias: new FormControl('', Validators.maxLength(100))
    });
    //Autocompletado - Buscar por alias filtro remolque
    this.formulario.get('vehiculoRemolque').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.servicio.listarPorAliasFiltroRemolque(data).subscribe(response => {
          this.resultadosVehiculosRemolques = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Personal - Buscar chofer por alias
    this.formulario.get('personal').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.personalServicio.listarChoferPorAlias(data).subscribe(response => {
          this.resultadosPersonales = response;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de tipos de vehiculos
    this.listarTiposVehiculos();
    //Obtiene la lista de marcas de vehiculos
    this.listarMarcasVehiculos();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Obtiene la lista de tipos de vehiculos
  private listarTiposVehiculos() {
    this.tipoVehiculoServicio.listar().subscribe(res => {
      this.tiposVehiculos = res.json();
    })
  }
  //Obtiene la lista de marcas de vehiculos
  private listarMarcasVehiculos() {
    this.marcaVehiculoServicio.listar().subscribe(res => {
      this.marcasVehiculos = res.json();
    })
  }
  //Obtiene la lista de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(res => {
      this.empresas = res.json();
    })
  }
  //Obtiene la lista de compania de seguros poliza por empresa
  private listarCompaniasSeguroPolizaPorEmpresa(empresa) {
    this.companiaSeguroPolizaServicio.listarPorEmpresa(empresa.id).subscribe(res => {
      this.companiasSegurosPolizas = res.json();
    })
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario(elemento) {
    this.formulario.setValue(elemento);
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    this.establecerConfiguracion(elemento);
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosVehiculosRemolques = [];
    this.resultadosLocalidades = [];
    this.resultadosCompaniasSeguros = [];
    this.resultadosPersonales = [];
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura,
    boton, configuracionVehiculo, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.mostrarConfiguracionVehiculo = configuracionVehiculo;
    this.tipoVehiculo.setValue(undefined);
    this.marcaVehiculo.setValue(undefined);
    this.configuracion.setValue(undefined);
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, true,'idTipoVehiculo');
        break;
      case 2:
        try {
          this.autoComplete.closePanel();
        } catch(e) {}
        this.establecerValoresPestania(nombre, true, true, false, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, true, 'idAutocompletado');
        break;
      case 4:
        try {
          this.autoComplete.closePanel();
        } catch(e) {}
        this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
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
  //Establece el tipo de vehiculo seleccionado de lista tipo vehiculos
  public establecerTipoVehiculo(elemento) {
    this.tipoVehiculo.setValue(elemento);
    this.listarConfiguracionesPorTipoVehiculoMarcaVehiculo();
  }
  //Establece la marca de vehiculo seleccionado de lista marca vehiculos
  public establecerMarcaVehiculo(elemento) {
    this.marcaVehiculo.setValue(elemento);
    this.listarConfiguracionesPorTipoVehiculoMarcaVehiculo();
  }
  //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
  private listarConfiguracionesPorTipoVehiculoMarcaVehiculo() {
    if(this.tipoVehiculo.value != null && this.marcaVehiculo.value != null) {
      this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(this.tipoVehiculo.value.id, this.marcaVehiculo.value.id)
        .subscribe(
          res => {
            this.configuracionesVehiculos = res.json();
          },
          err => {
            console.log(err);
          }
        )
    }
  }
  //Agrega un registro
  private agregar() {
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function() {
            document.getElementById('idTipoVehiculo').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 11017) {
          document.getElementById("labelDominio").classList.add('label-error');
          document.getElementById("idDominio").classList.add('is-invalid');
          document.getElementById("idDominio").focus();
        } else if(respuesta.codigo == 11018) {
          document.getElementById("labelNumeroInterno").classList.add('label-error');
          document.getElementById("idNumeroInterno").classList.add('is-invalid');
          document.getElementById("idNumeroInterno").focus();
        }
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
  this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
  this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
  this.servicio.actualizar(this.formulario.value).subscribe(
    res => {
      var respuesta = res.json();
      if(respuesta.codigo == 200) {
        this.reestablecerFormulario('');
        setTimeout(function() {
          document.getElementById('idAutocompletado').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
      }
    },
    err => {
      var respuesta = err.json();
      if(respuesta.codigo == 11017) {
        document.getElementById("labelDominio").classList.add('label-error');
        document.getElementById("idDominio").classList.add('is-invalid');
        document.getElementById("idDominio").focus();
      } else if(respuesta.codigo == 11018) {
        document.getElementById("labelNumeroInterno").classList.add('label-error');
        document.getElementById("idNumeroInterno").classList.add('is-invalid');
        document.getElementById("idNumeroInterno").focus();
      }
      this.toastr.error(respuesta.mensaje);
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
    this.tipoVehiculo.setValue(undefined);
    this.marcaVehiculo.setValue(undefined);
    this.vaciarLista();
  }
  /*
  * Establece la configuracion de vehiculo al seleccionar un item de la lista
  * configuraciones de vehiculos
  */
  public establecerConfiguracion(elemento) {
    this.configuracion.setValue('Modelo: ' + elemento.modelo +
      ' - Cantidad de Ejes: ' + elemento.cantidadEjes +
      ' - Capacidad de Carga: ' + elemento.capacidadCarga + '\n' +
      'Descripcion: ' + elemento.descripcion + '\n' +
      'Tara: ' + parseFloat(elemento.tara).toFixed(2) +
      ' - Altura: ' + parseFloat(elemento.altura).toFixed(2) +
      ' - Largo: ' + parseFloat(elemento.largo).toFixed(2) +
      ' - Ancho: ' + parseFloat(elemento.ancho).toFixed(2));
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.estableberValoresFormulario(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.estableberValoresFormulario(elemento);
  }
  //Establece los valores al "ver" o "modificar" desde la pestaña "lista"
  private estableberValoresFormulario(elemento) {
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
    this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
    this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
    this.establecerConfiguracion(elemento);
  }
  //Muestra el valor en los autocompletados
  public displayF(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor de otro autocompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: ' + elemento.cantidadEjes +
        ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados d
  public displayFd(elemento) {
    if(elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados e
  public displayFe(elemento) {
    if(elemento != undefined) {
      return elemento.companiaSeguro ? elemento.companiaSeguro.nombre + ' - N° Póliza: ' + elemento.numeroPoliza +
        ' - Vto. Póliza: ' + elemento.vtoPoliza : elemento;
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
