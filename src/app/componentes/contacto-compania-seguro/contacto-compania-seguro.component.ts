import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactoCompaniaSeguroService } from '../../servicios/contacto-compania-seguro.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { TipoContactoService } from '../../servicios/tipo-contacto.service';
import { AppService } from '../../servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatTableDataSource } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacto-compania-seguro',
  templateUrl: './contacto-compania-seguro.component.html',
  styleUrls: ['./contacto-compania-seguro.component.css']
})
export class ContactoCompaniaSeguroComponent implements OnInit {
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
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define la lista de tipos de contactos
  public tiposContactos: Array<any> = [];
  //Define la lista de contactos
  public contactos: Array<any> = [];
  //Define el form control para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['id', 'nombre', 'tipoContacto', 'telefonoFijo', 'telefonoMovil', 'correoElectronico', 'ver', 'mod'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: ContactoCompaniaSeguroService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appServicio: AppService, private toastr: ToastrService,
    private companiaSeguroServicio: CompaniaSeguroService, private tipoContactoServicio: TipoContactoService,
    private loaderService: LoaderService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appServicio.getRol(), this.appServicio.getSubopcion())
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
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      companiaSeguro: new FormControl('', Validators.required),
      tipoContacto: new FormControl('', Validators.required),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      telefonoFijo: new FormControl('', Validators.maxLength(45)),
      telefonoMovil: new FormControl('', Validators.maxLength(45)),
      correoelectronico: new FormControl('', Validators.maxLength(60)),
      usuarioAlta: new FormControl(),
      usuarioMod: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado - Buscar por nombre compania seguro
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCompaniasSeguros = response;
        })
      }
    })
    //Obtiene la lista completa de registros
    //this.listar();
    //Obtiene la lista de tipos de contactos
    this.listarTiposContactos();
  }
  //Establecer el formulario al cambiar elemento de autocompletado
  public cambioAutocompletado() {
    this.formulario.setValue(this.autocompletado.value);
  }
  //Obtiene el listado de tipos de proveedores
  private listarTiposContactos() {
    this.tipoContactoServicio.listar().subscribe(
      res => {
        this.tiposContactos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarListas() {
    this.resultadosCompaniasSeguros = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Habilita o deshabilita los campos select dependiendo de la pestania actual
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('tipoContacto').enable();
    } else {
      this.formulario.get('tipoContacto').disable();
    }
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarListas();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultadosCompaniasSeguros = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idCompaniaSeguro');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idCompaniaSeguro');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idCompaniaSeguro');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idCompaniaSeguro');
        break;
      case 5:
        this.mostrarAutocompletado = true;
        setTimeout(function () {
          document.getElementById('idCompaniaSeguro').focus();
        }, 20);
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
  //Obtiene la lista por compania seguro
  public listarPorCompaniaSeguro() {
    this.loaderService.show();
    let elemento = this.formulario.get('companiaSeguro').value;
    this.listaCompleta = new MatTableDataSource([]);
    if (this.mostrarAutocompletado) {
      this.servicio.listarPorCompaniaSeguro(elemento.id).subscribe(
        res => {
          this.listaCompleta = new MatTableDataSource(res.json());
          this.listaCompleta.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          console.log(err);
          this.loaderService.hide();
        }
      )
    }
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idCompaniaSeguro').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioAlta').setValue(this.appServicio.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          setTimeout(function () {
            document.getElementById('idCompaniaSeguro').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Reestablece el formulario
  private reestablecerFormulario() {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    if (respuesta.codigo == 11003) {
      document.getElementById("labelCorreoelectronico").classList.add('label-error');
      document.getElementById("idCorreoelectronico").classList.add('is-invalid');
      document.getElementById("idCorreoelectronico").focus();
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
    this.listarPorCompaniaSeguro();
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.listarPorCompaniaSeguro();
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ' - ' + elemento.tipoContacto.nombre : elemento;
    } else {
      return elemento;
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
}