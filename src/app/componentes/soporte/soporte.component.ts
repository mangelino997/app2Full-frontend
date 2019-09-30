import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { SoporteService } from 'src/app/servicios/soporte.service';
import { Soporte } from 'src/app/modelos/soporte';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { AppService } from 'src/app/servicios/app.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubopcionService } from 'src/app/servicios/subopcion.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { LoaderState } from 'src/app/modelos/loader';
import { BugImagenService } from 'src/app/servicios/bug-imagen.service';
import { BugImagenDialogoComponent } from '../bugImagen-dialogo/bug-imagen-dialogo.component';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent implements OnInit {
  //Define los datos de la Empresa
  public empresa: FormControl = new FormControl();
  //Define el modulo como un formControl
  public modulo: FormControl = new FormControl();
  //Define el submodulo como un formControl
  public submodulo: FormControl = new FormControl();
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
  public pestanias: Array<any> = [
    { nombre: 'Agregar', id: 1 },
    { nombre: 'Consultar', id: 2 },
    { nombre: 'Actualizar', id: 3 },
    { nombre: 'Eliminar', id: 4 },
    { nombre: 'Listar', id: 5 },
  ]
  //Define la lista de Empresas
  public listaEmpresas: Array<any> = [];
  //Define la lista de modulos
  public listaModulos: Array<any> = [];
  //Define la lista de submodulos
  public listaSubmodulos: Array<any> = [];
  //Define la lista de subopciones
  public listaSubopciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define los resultados del autocompletado
  public resultados: Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de Cobradores
  public listaCobradores: Array<any> = [];
  //Define la lista para Talonarios Recibos Lote
  public listaTalRecLote: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la lista de tipos de imagenes
  private tiposImagenes = ['image/png', 'image/jpg', 'image/jpeg'];
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'fecha', 'empresa', 'modulo', 'submodulo', 'subopcion', 'mensaje', 'estado', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Constructor
  constructor(private servicio: SoporteService, private modelo: Soporte, private loaderService: LoaderService, private toastr: ToastrService,
    private appComponent: AppComponent, private appService: AppService,
    private empresaService: EmpresaService, private moduloService: ModuloService, private subopcionService: SubopcionService,
    private submoduloService: SubmoduloService, private bugServicio: BugImagenService, public dialog: MatDialog) {
    //Defiene autocompletado
    let usuario = this.appService.getUsuario();
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorAliasYUsuario(data, usuario.id).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el Formulario
    this.formulario = this.modelo.formulario;
    //Establece la primer pestaña
    this.activeLink = this.pestanias[0].nombre;
    //Establece los valores, activando la primera pestania 
    this.seleccionarPestania(1, 'Agregar', 0);
    //Reestablece el formulario
    this.reestablecerFormulario(undefined);
    //Obtiene la lista de Empresas
    this.listarEmpresas();
    //Obtiene la lista de Modulo
    this.listarModulo();
  }
  //Obtiene la lista de Empresas
  private listarEmpresas() {
    this.empresaService.listar().subscribe(
      res => {
        this.listaEmpresas = res.json();
      },
      err => {
      }
    )
  }
  //Obtiene la lista de Modulo
  private listarModulo() {
    this.moduloService.listar().subscribe(
      res => {
        this.listaModulos = res.json();
      },
      err => {
      }
    )
  }
  //Maneja el cambio de Módulos
  public cambioModulo() {
    this.submoduloService.listarPorModulo(this.modulo.value.id).subscribe(
      res => {
        this.listaSubmodulos = res.json();
      }
    )
  }
  //Maneja el cambio de SubMódulos
  public cambioSubmodulo() {
    this.subopcionService.listarPorSubmodulo(this.submodulo.value.id).subscribe(
      res => {
        this.listaSubopciones = res.json();
      }
    )
  }
  //Obtiene un registro por id
  private obtenerPorId(id) {
    this.servicio.obtenerPorId(id).subscribe(
      res => {
        let elemento = res.json();
        this.formulario.setValue(elemento);
        this.establecerBug(elemento);
      },
      err => {
      }
    );
  }
  //Establece los datos del elemento al formulario
  private establecerElemento() {
    let elemento = this.autocompletado.value;
    this.obtenerPorId(elemento.id);
    this.modulo.setValue(elemento.subopcion.submodulo.modulo);
    this.submodulo.setValue(elemento.subopcion.submodulo);
    this.cambioModulo();
    this.cambioSubmodulo();
  }
  //Establece el habilitado o deshabilitado de los campos
  private establecerCampos(estado) {
    if (estado) {
      this.modulo.enable();
      this.submodulo.enable();
      this.formulario.get('subopcion').enable();
      this.formulario.get('empresa').enable();
    } else {
      this.modulo.disable();
      this.submodulo.disable();
      this.formulario.get('subopcion').disable();
      this.formulario.get('empresa').disable();
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
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idCobrador');
        this.establecerCampos(true);
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        this.establecerCampos(false);
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        this.establecerCampos(true);
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        this.establecerCampos(false);
        break;
      case 5:
        this.listar();
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
      }
    );
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    this.servicio.listarPorUsuario(usuario.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res);
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    let usuario = this.appComponent.getUsuario();
    this.formulario.get('usuario').setValue(usuario);
    this.formulario.get('soporteEstado').setValue({ id: 1 });
    this.servicio.agregar(this.formulario.value).then(
      res => {
        var respuesta = res.json();
        if (res.status == 201) {
          respuesta.then(data => {
            this.reestablecerFormulario(data.id);
            setTimeout(function () {
              document.getElementById('idEmpresa').focus();
            }, 20);
            this.toastr.success('Registro agregado con éxito');
          })
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11003) {
          document.getElementById("idEmpresa").classList.add('label-error');
          document.getElementById("idEmpresa").classList.add('is-invalid');
          document.getElementById("idEmpresa").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).then(
      res => {
        if (res.status == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success('Registro actualizado con éxito');
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idEmpresa").classList.add('is-invalid');
          document.getElementById("idEmpresa").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
  }
  //Reestablece el formulario
  private reestablecerFormulario(estado) {
    this.formulario.reset();
    this.autocompletado.reset();
    this.modulo.setValue(null);
    this.submodulo.setValue(null);
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
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
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.obtenerPorId(elemento.id);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.obtenerPorId(elemento.id);
  }
  //Establece la foto y pdf (activar consultar/actualizar)
  private establecerBug(elemento): void {
    this.autocompletado.setValue(elemento);
    if (elemento.bugImagen) {
      this.formulario.get('bugImagen.datos').setValue(atob(elemento.bugImagen.datos));
    }
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
  //Obtiene el pdf para mostrarlo en la tabla
  public obtenerBugTabla(elemento) {
    if (elemento.bugImagen) {
      this.bugServicio.obtenerPorId(elemento.bugImagen.id).subscribe(res => {
        let resultado = res.json();
        let bug = {
          id: resultado.id,
          nombre: resultado.nombre,
          datos: atob(resultado.datos)
        }
        window.open(bug.datos, '_blank');
      })
    }
  }
  //Muestra el bugImagen en una pestana nueva
  public verBugTabla(elemento) {
    if (elemento.bugImagen) {
      this.toastr.success("Sin archivo adjunto");
    }
  }
  //Carga la imagen del paciente
  public readURL(event): void {
    if (event.target.files && event.target.files[0] && this.tiposImagenes.includes(event.target.files[0].type)) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        let bugImagen = {
          id: this.formulario.get('bugImagen.id').value ? this.formulario.get('bugImagen.id').value : null,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get('bugImagen').patchValue(bugImagen);
        event.target.value = null;
      }
      reader.readAsDataURL(file);
    } else {
      this.toastr.error("Debe adjuntar un archivo con extensión .jpeg .png o .jpg");
    }
  }
  //Elimina una imagen ya cargada
  public eliminarBug(campo, event) {
    if (!this.formulario.get(campo).value) {
      this.toastr.success("Sin archivo adjunto");
    } else {
      this.formulario.get(campo).setValue('');
    }
  }
  //Muestra la imagen en una pestana nueva
  public verBugImagen() {
    const dialogRef = this.dialog.open(BugImagenDialogoComponent, {
      width: '95%',
      height: '95%',
      data: {
        nombre: this.formulario.get('bugImagen.nombre').value,
        datos: this.formulario.get('bugImagen.datos').value
      }
    });
    dialogRef.afterClosed().subscribe(resultado => { });
  }
}