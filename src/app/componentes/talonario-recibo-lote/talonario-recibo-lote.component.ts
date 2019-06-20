import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { TalonarioReciboService } from 'src/app/servicios/talonario-recibo.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { TalonarioReciboLoteService } from 'src/app/servicios/talonario-recibo-lote.service';
import { TalonarioReciboLote } from 'src/app/modelos/talonarioReciboLote';
import { AppComponent } from 'src/app/app.component';
import { LoaderState } from 'src/app/modelos/loader';

@Component({
  selector: 'app-talonario-recibo-lote',
  templateUrl: './talonario-recibo-lote.component.html',
  styleUrls: ['./talonario-recibo-lote.component.css']
})
export class TalonarioReciboLoteComponent implements OnInit {

  //Define los datos de la Empresa como un formControl
  public empresa: FormControl = new FormControl();
  //Define a Letra como un formControl
  public letra: FormControl = new FormControl();
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define los resultados del buscador
  public resultados: Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades: Array<any> = [];
  //Define la lista para Talonarios Recibos Lote
  public listaTalRecLote: Array<any>= [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'empresa', 'pVenta', 'letra', 'desde', 'hasta', 'cai', 'caiVencimiento', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Constructor
  constructor(private servicio: TalonarioReciboLoteService, private subopcionPestaniaService: SubopcionPestaniaService, private appComponent: AppComponent,
    private talonarioReciboLoteService: TalonarioReciboLoteService, private appService: AppService, private modelo: TalonarioReciboLote,
    private toastr: ToastrService, private loaderService: LoaderService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
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
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Iniciliza los campos
    this.inicializarCampos();
    //Obtiene la lista completa de registros
    this.listar();
  }
  //Establece el formulario al seleccionar elemento de autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.patchValue(elemento);
    //this.autoLocalidad.setValue(elemento.localidad);
  }
  //iniciliza los campos
  private inicializarCampos(){
    this.loaderService.show();
    let empresa = this.appService.getEmpresa();
    this.empresa.setValue(empresa.razonSocial);
    this.formulario.get('empresa').setValue(empresa);
    this.letra.setValue("X");
    this.loaderService.hide();
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if(elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
    if(elemento>=0){
      return elemento = (string + elemento).slice(cantidad);
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
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idPuntoVenta');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        this.listarTalonariosRecLotes();
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        this.listarTalonariosRecLotes();
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        this.listarTalonariosRecLotes();
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Completa el Buscador 
  private listarTalonariosRecLotes(){
    let empresa = this.appComponent.getEmpresa();
    this.servicio.listarPorEmpresa(empresa.id).subscribe(
      res=>{
        console.log(res.json());
        this.resultados = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener la lista de Talonarios Recibos Lotes");
      }
    )
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
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let usuario= this.appComponent.getUsuario();
    this.formulario.get('usuarioAlta').setValue(usuario);
    this.formulario.get('letra').setValue(this.letra.value);
    this.formulario.get('loteEntregado').setValue(false);
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idPuntoVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11003) {
          document.getElementById("idPuntoVenta").classList.add('is-invalid');
          document.getElementById("idPuntoVenta").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function () {
            document.getElementById('idAutocompletado').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("idAutocompletado").classList.add('is-invalid');
          document.getElementById("idAutocompletado").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
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
    this.resultados = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Obtiene la mascara de enteros SIN decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Valida longitud
  public validarLongitud(elemento, intLimite) {
    switch(elemento){
      case 'desde':
        return this.appService.validarLongitud(intLimite, this.formulario.value.desde);
      case 'hasta':
        if(!this.formulario.value.desde){
          setTimeout(function () {
            document.getElementById('idDesde').focus();
          }, 20);
          this.toastr.warning("El campo Desde es requerido");
        }else{
          this.validarMayor();
        }
      default:
        break;
    }
  }
  //Valida que el campo Hasta sea mayor al campo Desde
  private validarMayor(){
    if(this.formulario.value.desde < this.formulario.value.hasta){
      return this.appService.validarLongitud(8, this.formulario.value.hasta);
    }else{
      this.formulario.get('desde').setValue(null);
      this.formulario.get('hasta').setValue(null);
      setTimeout(function () {
        document.getElementById('idDesde').focus();
      }, 20);
      this.toastr.warning("El campo Hasta debe ser Mayor que el campo Desde");
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Maneja el cambio en Buscador
  public cambioTalRecLote(){
    let elemento = this.autocompletado.value;
    this.establecerElemento(elemento);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.establecerElemento(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.establecerElemento(elemento);
  }
  //Establece el elemento en el formulario
  private establecerElemento(elemento){
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.empresa.setValue(elemento.empresa.razonSocial);
    this.letra.setValue(elemento.letra);
    this.establecerCerosIzq(this.formulario.get('puntoVenta'), '0000', -5);
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  } 

}