import { Component, OnInit } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { TipoTarifaService } from '../../servicios/tipo-tarifa.service';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { TramoService } from '../../servicios/tramo.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {
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
  //Define una lista
  public lista = null;
  //Define la lista para las Escalas agregadas
  public listaDeEscalas:Array<any> = [];
  //Define la lista para los tramos agregados
  public listaDeTramos:Array<any> = [];
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define un formulario para validaciones de campos
  public formularioEscala:FormGroup;
  //Define un formulario para validaciones de campos
  public formularioTramo:FormGroup;
  //Define el elemento de autocompletado
  public elemAutocompletado:any = null;
  //Define el siguiente id
  public siguienteId:number = null;
  //Define el id de la Escala que se quiere modificar
  public idModEscala:number = null;
  //Define el id del Tramo que se quiere modificar
  public idModTramo:number = null;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  //Define la lista de empresas
  public empresas:any = null;
  //Define la lista de tipos de tarifas
  public tiposTarifas:any = null;
  //Define la lista de tramos para la segunda tabla
  public listaTramos:any = [];
  //Define el form control para las busquedas
  public buscar:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define el form control para las busquedas vendedor
  public buscarVendedor:FormControl = new FormControl();
  //Define la lista de resultados de busqueda vendedor
  public resultadosVendedores = [];
  //Define el form control para las busquedas tramo
  public buscarTramo:FormControl = new FormControl();
  //Define la lista de resultados de busqueda tramo
  public resultadosTramos = [];
  //Define la lista de vendedores
  public vendedores:Array<any>=[];
  //Define la lista de escalas
  public escalas:Array<any>=[];
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, private formBuilder: FormBuilder,
    private empresaSevicio: EmpresaService, private clienteServicio: ClienteService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService,
    private escalaTarifaServicio: EscalaTarifaService, private appService: AppService,
    private tramoServicio: TramoService, private ordenVenta: OrdenVenta, private ordenVentaServicio: OrdenVentaService,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo) {
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
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Autocompletado - Buscar por nombre
    this.buscar.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.servicio.listarPorNombre(data).subscribe(response =>{
            this.resultados = response;
          })
        }
    })
    //Autocompletado - Buscar por nombre cliente
    this.buscarCliente.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.clienteServicio.listarPorAlias(data).subscribe(response =>{
            this.resultadosClientes = response;
          })
        }
    })
    //Autocompletado - Buscar por nombre vendedor
    // this.buscarVendedor.valueChanges
    //   .subscribe(data => {
    //     if(typeof data == 'string') {
    //       this.vendedorServicio.listarPorNombre(data).subscribe(response =>{
    //         this.resultadosVendedores = response;
    //       })
    //     }
    // })
    
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.ordenVenta.formulario;
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de tipos de tarifas
    this.listarTiposTarifas();
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Obtiene la lista de escalas tarifas
    this.listarEscalaTarifa();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
    //Autocompletado Tramo - Buscar por nombre
    this.formularioTramo.get('tramo').valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.tramoServicio.listarPorOrigen(data).subscribe(response =>{
            console.log(response);
            this.resultadosTramos = response;
          })
        }
    });
    //Controla el cambio de Tabla, borrando lo que hay en una si se elige la otra
    // if(this.formulario.get('tipoTarifa').value.porEscala){
    //   this.formularioTramo.reset();
    //   this.listaDeTramos=[];
    // }
    // if(!this.formulario.get('tipoTarifa').value.porEscala){
    //   this.formularioEscala.reset();
    //   this.listaDeEscalas=[];
    // }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('seguro').setValue('0.00');
    this.formulario.get('comisionCR').setValue('0.00');
  }
  //Obtiene la lista de empresas
  private listarEmpresas() {
    this.empresaSevicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  //Obtiene la lista de tipos de tarifas
  private listarTiposTarifas() {
    this.tipoTarifaServicio.listar().subscribe(
      res => {
        this.tiposTarifas = res.json();
        this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
      },
      err => {
        console.log(err);
      }
    )
  }
  //Obtiene la lista de vendedores
  private listarVendedores() {
    this.vendedorServicio.listar().subscribe(response =>{
      this.vendedores = response.json();
    },
      err => {
        console.log(err);
      }
    )
  }
  //Obtiene una lista de escalas tarifas
  private listarEscalaTarifa() {
    this.escalaTarifaServicio.listar().subscribe(
      res => {
        this.escalas=res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosClientes = [];
    this.resultadosVendedores = [];
    this.resultadosTramos = [];
  }
  //Cambio en elemento autocompletado
  public cambioAutocompletado(elemAutocompletado) {
   //this.elemento = elemAutocompletado;
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
  public seleccionarPestania(id, nombre, opcion) {
    //this.formulario.reset();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoOrdenVenta');
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
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA ESCALA
  public controlPrecios(tipoPrecio){
    console.log(this.formularioEscala.value);
    switch(tipoPrecio){
      case 1:
        if(this.formularioEscala.get('importeFijo').value>0){
          this.formularioEscala.get('precioUnitario').setValue('0.00');
        }
        break;
      case 2:
        if(this.formularioEscala.get('precioUnitario').value>0){
          this.formularioEscala.get('importeFijo').setValue('0.00');
        }
        break;
    }
  }
  //Agrega una Escala a listaDeEscalas
  public agregarEscalaLista(){
    this.formulario.disable();
    if(this.idModEscala!=null){
      this.listaDeEscalas[this.idModEscala]=this.formularioEscala.value;
      this.formularioEscala.reset();
      this.idModEscala=null;
    }else{
      this.listaDeEscalas.push(this.formularioEscala.value);
      this.formularioEscala.reset();
    }
    setTimeout(function() {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Elimina una Escala a listaDeEscalas
  public eliminarEscalaLista(indice){
    this.listaDeEscalas.splice(indice, 1);
    if(this.listaDeEscalas.length==0){
      this.formulario.enable();
    }
  }
  //Modifica una Escala de listaDeEscalas
  public modificarEscalaLista(escala, indice){
    this.formularioEscala.patchValue(escala);
    setTimeout(function() {
      document.getElementById('idEscala').focus();
    }, 20);
    this.idModEscala=indice;
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramo(tipoPrecio){
    console.log(this.formularioTramo.value);
    switch(tipoPrecio){
      case 1:
        if(this.formularioTramo.get('importeFijoSeco').value>0){
          this.formularioTramo.get('precioUnitarioSeco').setValue('0.00');
        }
        break;
      case 2:
        if(this.formularioTramo.get('precioUnitarioSeco').value>0){
          this.formularioTramo.get('importeFijoSeco').setValue('0.00');
        }
        break;
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramoRef(tipoPrecio){
    console.log(this.formularioTramo.value);
    switch(tipoPrecio){
      case 1:
        if(this.formularioTramo.get('importeFijoRef').value>0){
          this.formularioTramo.get('precioUnitarioRef').setValue('0.00');
        }
        break;
      case 2:
        if(this.formularioTramo.get('precioUnitarioRef').value>0){
          this.formularioTramo.get('importeFijoRef').setValue('0.00');
        }
        break;
    }
  }
  //Agrega un Tramo a listaDeTramos
  public agregarTramoLista(){
    this.formulario.disable();
    if(this.idModTramo!=null){
      this.listaDeTramos[this.idModTramo]=this.formularioTramo.value;
      this.formularioTramo.reset();
      this.idModTramo=null;
    }else{
      this.listaDeTramos.push(this.formularioTramo.value);
      this.formularioTramo.reset();
    }
    setTimeout(function() {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Elimina un Tramo a listaDeTramos
  public eliminarTramoLista(indice){
    this.listaDeTramos.splice(indice, 1);
    if(this.listaDeTramos.length==0){
      this.formulario.enable();
    }
  }
  //Modifica un Tramo de listaDeTramos
  public modificarTramoLista(tramo, indice){
    this.formularioTramo.patchValue(tramo);
    setTimeout(function() {
      document.getElementById('idTramo').focus();
    }, 20);
    this.idModTramo=indice;
  }
  //Establece ceros a la derecha de los campos (decimales)
  public establecerCeros(campo){
    campo.setValue(this.appComponent.establecerCeros(campo.value));
    console.log(this.appComponent.establecerCeros(campo.value));
  }
  //Agrega un registro
  private agregar() {
    this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas); 
    this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos); 
    console.log(this.formulario.value);
    this.ordenVentaServicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCampos(undefined);
          setTimeout(function() {
            document.getElementById('idNombre').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro agregado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.formulario.reset();
          setTimeout(function() {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if(respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro actualizado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
      }
    );
  }
  //Reestablecer campos
  private reestablecerCampos(valor){
    this.formulario.disable();
    this.formulario.reset();
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.listaDeEscalas=[];
    this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de cambio de autocompletado tramo
  public cambioAutocompletadoTramo() {
    this.formularioTramo.get('kmTramo').setValue(this.formularioTramo.get('tramo').value.km);
  }
  public cambioImporte(valor, elemento, i) {
    
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
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
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if(elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ' - ' + elemento.destino.nombre : elemento;
    } else {
      return elemento;
    }
  }
}
