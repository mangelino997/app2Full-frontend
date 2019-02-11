import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { Moneda } from 'src/app/modelos/moneda';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.css']
})
export class MonedaComponent implements OnInit {
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
  public listaCompleta:Array<any> = [];
  //Define el autocompletado
  public autocompletado:FormControl = new FormControl();
  //Define el id que se muestra en el campo Codigo
  public id:FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros:Array<any> = [];
  //Defien la lista de empresas
  public empresas:Array<any> = [];
  // public compereFn:any;
  //Constructor
  constructor(private moneda: Moneda, private monedaServicios: MonedaService, private subopcionPestaniaService: SubopcionPestaniaService, 
    private toastr: ToastrService, public dialog: MatDialog) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(1, 19)
    .subscribe(
      res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
        console.log(res.json());
      },
      err => {
        console.log(err);
      }
    );
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.monedaServicios.listarPorNombre(data).subscribe(res => {
          this.resultados = res.json();
          console.log(res.json());
        })
      }
    });
   }

  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.moneda.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //El campo codigo del formulario siempre se mantiene deshabilitado
    this.formulario.get('codigo').disable();
    //Obtenemos el siguiente Id y lo mostramos
    this.obtenerSiguienteId();
    //Cargamos la lista de Monedas
    this.listar();
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
    this.formulario.reset();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.resultados=[];
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        // this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      default:
        break;
    }
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('nombre').enable();
      this.formulario.get('estaActivo').enable();
      this.formulario.get('porDefecto').enable();
    } else {
      this.formulario.get('nombre').disable();
      this.formulario.get('estaActivo').disable();
      this.formulario.get('porDefecto').disable();
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
    this.monedaServicios.obtenerSiguienteId().subscribe(
      res => {
        this.id.setValue(res.json());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene el listado de registros
  private listar() {
    this.monedaServicios.listar().subscribe(
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
    // this.formulario.get('id').setValue(this.id.value);
    this.monedaServicios.listarPorNombre(this.formulario.get('nombre').value).subscribe(
      res=>{
        if(res.json().length>=1){
          this.toastr.error("Ya existe la Moneda que se desea cargar");
          this.reestablecerFormulario(undefined);
        }else{
          if(this.formulario.get('porDefecto').value=="true"){
            this.monedaServicios.obtenerPorDefecto().subscribe(
              res=>{
                var respuesta=res.json();
                  //open modal reemplazar moneda
                  this.cambiarPrincipal(respuesta, this.formulario.value);
              },
              err=>{
                this.toastr.error(err.mensaje);
              }
            );
          }
          else{
            this.monedaServicios.agregar(this.formulario.value).subscribe(
              res=>{
                var respuesta = res.json();
                this.reestablecerFormulario(respuesta.id);
                setTimeout(function() {
                  document.getElementById('idNombre').focus();
                }, 20);
                this.toastr.success(respuesta.mensaje);
              },
              err=>{
                this.toastr.error(err.mensaje);
              }
            );
          }
        }
      },
      err=>{
        this.toastr.error(err.mensaje);
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.monedaServicios.actualizar(this.formulario.value).subscribe(
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
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    // if(respuesta.codigo == 11006) {
    //   document.getElementById("labelRazonSocial").classList.add('label-error');
    //   document.getElementById("idRazonSocial").classList.add('is-invalid');
    //   document.getElementById("idRazonSocial").focus();
    // } else if(respuesta.codigo == 11007) {
    //   document.getElementById("labelCUIT").classList.add('label-error');
    //   document.getElementById("idCUIT").classList.add('is-invalid');
    //   document.getElementById("idCUIT").focus();
    // }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    setTimeout(function() {
      document.getElementById('idNombre').focus();
    }, 20);
    this.obtenerSiguienteId();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    var elemento= this.autocompletado.value;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.id.setValue(elemento.id);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
    this.id.setValue(elemento.id);

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
  //Abre ventana Dialog nueva Moneda Principal
  public cambiarPrincipal(monedaPrincipal, monedaAgregar): void {
    const dialogRef = this.dialog.open(CambiarMonedaPrincipalDialogo, {
      width: '750px',
      data: {monedaPrincipal: monedaPrincipal, monedaAgregar: monedaAgregar},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.reestablecerFormulario(undefined);
    });
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
}
@Component({
  selector: 'cambiar-principal-dialogo',
  templateUrl: 'cambiar-principal-dialogo.html',
})
export class CambiarMonedaPrincipalDialogo{
  //Define la moneda que se desea agregar
  public monedaAgregar:string;
  //Define la moneda principal actual
  public monedaPrincipal:string;
  constructor(public dialogRef: MatDialogRef<CambiarMonedaPrincipalDialogo>, @Inject(MAT_DIALOG_DATA) public data, private monedaServicios: MonedaService,
  private toastr: ToastrService) {}
   ngOnInit() {
    this.monedaAgregar=this.data.monedaAgregar;
    this.monedaPrincipal=this.data.monedaPrincipal;
   }
   //La nueva Moneda cambia a Principal
   public agregar(cambiaPorDefecto){
     if(cambiaPorDefecto==true){
      this.monedaAgregar['porDefecto']="true";
     }else{
       this.monedaAgregar['porDefecto']="false";
     }
    console.log(this.monedaAgregar);
    this.monedaServicios.agregar(this.monedaAgregar).subscribe(
      res=>{
        var respuesta = res.json();
        setTimeout(function() {
          document.getElementById('idNombre').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
        this.dialogRef.close();
      },
      err=>{
        this.toastr.error(err.respuesta);
        }
    );
   }
  onNoClick(): void {
    this.dialogRef.close();
  }
}