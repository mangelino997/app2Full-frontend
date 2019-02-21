import { Component, OnInit } from '@angular/core';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
@Component({
  selector: 'app-orden-recoleccion',
  templateUrl: './orden-recoleccion.component.html',
  styleUrls: ['./orden-recoleccion.component.css']
})
export class OrdenRecoleccionComponent implements OnInit {
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
  public tiposTarifas:any = [];
  //Define la lista de tramos para la segunda tabla
  public listaTramos:any = [];
  //Define el form control para las busquedas
  public buscar:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define el form control para el precioDesde de cada registro
  public precioDesde:FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define el form control para las busquedas vendedor
  public buscarVendedor:FormControl = new FormControl();
  //Define la lista de resultados de busqueda vendedor
  public resultadosVendedores = [];
  //Define el form control para las busquedas tramo
  public buscarTramo:FormControl = new FormControl();
  //Define el form control para el combo ordenes de venta
  public ordenventa:FormControl = new FormControl();
  //Define la lista de ordenes de ventas
  public ordenesVentas:Array<any>=[];
  //Define la lista de resultados de busqueda tramo
  public resultadosTramos = [];
  //Define la lista de vendedores
  public vendedores:Array<any>=[];
  //Define la lista de escalas
  public escalas:Array<any>=[];
  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private appComponent: AppComponent, private fechaServicio: FechaService,
    private toastr: ToastrService, private appService: AppService) {
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
   }

  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      fecha: new FormControl('', Validators.maxLength(45)),
      telefonoFijo: new FormControl('', Validators.maxLength(45)),
      telefonoMovil: new FormControl('', Validators.maxLength(45)),
      correoelectronico: new FormControl('', Validators.maxLength(30)),
      localidad: new FormControl('', Validators.required)
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    
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
    // switch (indice) {
    //   case 1:
    //     this.agregar();
    //     break;
    //   case 3:
    //     this.actualizar();
    //     break;
    //   case 4:
    //     this.eliminar();
    //     break;
    //   default:
    //     break;
    // }
  }
  //Agrega un Cliente Eventual
  public agregarClienteEventual(){

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
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    // this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    // this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
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
