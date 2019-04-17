import { Component, OnInit, ViewChild } from '@angular/core';
import { PuntoVentaService } from '../../servicios/punto-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { AppService } from '../../servicios/app.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteTrigger } from '@angular/material';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { PuntoVenta } from 'src/app/modelos/puntoVenta';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.css']
})
export class PuntoVentaComponent implements OnInit {
  //Obtiene el componente autocompletado sucursal del dom
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
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta= new MatTableDataSource([]);
  //Define la lista completa de registros Codigos de Afip
  public listaAfipComprobante:Array<any> = [];
  //Define la lista de sucursales
  public sucursales:Array<any> = [];
  //Define la lista de empresas
  public empresas:Array<any> = [];
  //Define la lista de Tipos de comprobantes
  public tipoComprobante:Array<any> = [];
  //Define la lista de puntos de ventas de sucursal
  public puntosVentas:Array<any> = [];
  //Define la lista de puntos de ventas como autocompletado
  public autocompletado:FormControl = new FormControl();
  //Define sucursal para la lista
  public sucursal:FormControl = new FormControl();
  //Define empresa para la lista
  public empresa:FormControl = new FormControl();
  //Define las columnas de la tabla
  public columnas:string[] = ['sucursal', 'empresa', 'punto venta', 'fe', 'fe en linea', 'cae', 'cuenta orden', 'numero', 'copia', 'imprime', 'habilitada', 'defecto', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: PuntoVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, private puntoVenta: PuntoVenta,
    private sucursalServicio: SucursalService, private empresaServicio: EmpresaService, private afipComprobanteService: AfipComprobanteService,
    private tipoComprobanteService: TipoComprobanteService) {
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
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.puntoVenta.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de sucursales
    this.listarSucursales();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de tipos de comprobantes
    this.listarTiposComprobantes();
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
  //Obtiene el listado de empresas
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de tipos de comprobantes
  private listarTiposComprobantes(){
    this.tipoComprobanteService.listarPorNumeracionPuntoVentaTrue().subscribe(
      res => {
        console.log(res.json());
        this.tipoComprobante = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Establece el Codigo de Afip
  public establecerCodigoAfip(){
    console.log(this.formulario.get('tipoComprobante').value.id);
    this.afipComprobanteService.listarPorTipoComprobante(this.formulario.get('tipoComprobante').value.id).subscribe(
      res=>{
        console.log(res.json());
        this.listaAfipComprobante = res.json();
      }
    )
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
    this.formulario.get('puntoVenta').setValue(this.displayFe(elemento));
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('fe').enable();
      this.formulario.get('feEnLinea').enable();
      this.formulario.get('feCAEA').enable();
      this.formulario.get('esCuentaOrden').enable();
      this.formulario.get('imprime').enable();
      this.formulario.get('estaHabilitado').enable();
    } else {
      this.formulario.get('fe').disable();
      this.formulario.get('feEnLinea').disable();
      this.formulario.get('feCAEA').disable();
      this.formulario.get('esCuentaOrden').disable();
      this.formulario.get('imprime').disable();
      this.formulario.get('estaHabilitado').disable();
    }
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
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
        break;
      case 2:
        try {
          this.autoComplete.closePanel();
        } catch(e) {}
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idSucursal');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idSucursal');
        break;
      case 4:
        try {
          this.autoComplete.closePanel();
        } catch(e) {}
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idSucursal');
        break;
      default:
        this.listaCompleta= new MatTableDataSource([]);
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
  //Obtiene la lista por sucursal y empresa
  public listarPorSucursalYEmpresa() {
    if(this.mostrarAutocompletado) {
      let sucursal = this.formulario.get('sucursal').value;
      let empresa = this.formulario.get('empresa').value;
      if(sucursal && empresa) {
        this.servicio.listarPorSucursalYEmpresaLetra(sucursal.id, empresa.id).subscribe(res => {
          this.puntosVentas = res.json();
        });
      }
    }
  }
  //Obtiene la lista por sucursal y empresa
  public listarPorSucursalYEmpresaLista(sucursal, empresa) {
    this.servicio.listarPorSucursalYEmpresaLetra(sucursal.value.id, empresa.value.id).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
   });
  }
  //Agrega un registro
  private agregar() {
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario();
          setTimeout(function() {
            document.getElementById('idSucursal').focus();
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
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario();
          setTimeout(function() {
            document.getElementById('idSucursal').focus();
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
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    elemento.setValue((string + elemento.value).slice(cantidad));
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.listaAfipComprobante = [];
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if(respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
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
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
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
      return elemento.puntoVenta ? ('00000' + elemento.puntoVenta).slice(-5) 
      + ' | ' + elemento.codigoAfip + ' | ' + elemento.usointerno : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado d
  public displayFd(elemento) {
    if(elemento != undefined) {
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFe(elemento) {
    if(elemento != undefined) {
      return elemento.puntoVenta ? ('00000' + elemento.puntoVenta).slice(-5) : elemento;
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
