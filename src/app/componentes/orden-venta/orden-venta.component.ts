import { Component, OnInit } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { TipoTarifaService } from '../../servicios/tipo-tarifa.service';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { OrdenVentaEscalaService } from '../../servicios/orden-venta-escala.service';
import { TramoService } from '../../servicios/tramo.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../servicios/app.service';

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
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define el elemento de autocompletado
  public elemAutocompletado:any = null;
  //Define el siguiente id
  public siguienteId:number = null;
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
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, private formBuilder: FormBuilder,
    private empresaSevicio: EmpresaService, private clienteServicio: ClienteService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService,
    private escalaTarifaServicio: EscalaTarifaService, private appService: AppService,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService,
    private tramoServicio: TramoService) {
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
    this.buscarVendedor.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.vendedorServicio.listarPorNombre(data).subscribe(response =>{
            this.resultadosVendedores = response;
          })
        }
    })
    //Autocompletado Tramo - Buscar por nombre
    this.buscarTramo.valueChanges
      .subscribe(data => {
        if(typeof data == 'string') {
          this.tramoServicio.listarPorOrigen(data).subscribe(response =>{
            this.resultadosTramos = response;
          })
        }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required),
      cliente: new FormControl('', Validators.required),
      vendedor: new FormControl('', Validators.required),
      fechaAlta: new FormControl(),
      tipoTarifa: new FormControl('', Validators.required),
      seguro: new FormControl('8.00', Validators.required),
      aforo: new FormControl('350', Validators.required),
      comisionCR: new FormControl('', Validators.required),
      observaciones: new FormControl(),
      estaActiva: new FormControl(),
      activaDesde: new FormControl(),
      tipoOrdenVenta: new FormControl(false, Validators.required),
      preciosDesde: new FormControl(),
      escala: new FormControl(),
      importeFijo: new FormControl(),
      precioUnitario: new FormControl(),
      segunTarifa: new FormControl(),
      minimo: new FormControl()
    });
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de tipos de tarifas
    this.listarTiposTarifas();
    //Obtiene la lista de escalas tarifas
    this.listarEscalaTarifa();
    //Establece los valores por defecto
    this.establecerValoresPorDefecto();
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('seguro').setValue('0.00');
    this.formulario.get('comisionCR').setValue('0.00');
  }
  //Crea el elemento A (form) para la primera tabla
  private crearElementoA(valor): FormGroup {
    return this.formBuilder.group({
      escala: valor,
      importeFijo: '',
      precioUnitario: '',
      segunTarifa: '',
      minimo: ''
    })
  }
  //Crea el elemento B (form) para la segunda tabla
  private crearElementoB(): FormGroup {
    return this.formBuilder.group({
      tramo: '',
      kmTramo: '',
      kmPactado: '',
      importeFijoSeco: '',
      importeFijoRef: '',
      precioUnitarioSeco: '',
      precioUnitarioRef: ''
    })
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
  //Obtiene una lista de escalas tarifas
  private listarEscalaTarifa() {
    this.escalaTarifaServicio.listar().subscribe(
      res => {
        let escalasTarifas = res.json();
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
  //Agrega un registro
  private agregar() {
    console.log(this.formulario.value);
    /*elemento.ordenesVentasEscalas = lista;
    this.servicio.agregar(elemento).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerCamposAgregar(respuesta.id);
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
    );*/
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
  public cambioAutocompletadoTramo(elemento, indice) {
    (<FormArray>this.formulario.get('elementosB')).at(indice).get('tramo').setValue(elemento);
    (<FormArray>this.formulario.get('elementosB')).at(indice).get('kmTramo').setValue(elemento.km);
  }
  public cambioImporte(valor, elemento, i) {
    if(valor != undefined) {
      (<FormArray>this.formulario.get('elementosA')).at(i).get(elemento).patchValue(undefined);
    }
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
