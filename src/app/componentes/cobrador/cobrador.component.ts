import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CobradorService } from '../../servicios/cobrador.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { Cobrador } from 'src/app/modelos/cobrador';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-cobrador',
  templateUrl: './cobrador.component.html',
  styleUrls: ['./cobrador.component.css']
})
export class CobradorComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
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
  //Define una lista
  public lista: Array<any> = [];
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Defiene el render
  public render: boolean = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'CUENTA_HABILITADA', 'CORREO_ELECTRONICO', 'POR_DEFECTO_EN_CLIENTE_EVENTUAL', 'EDITAR'];
  public columnasSeleccionadas: string[] = this.columnas.filter((item, i) => true);
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: CobradorService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService, private cobrador: Cobrador,
    public dialog: MatDialog, private reporteServicio: ReporteService) {
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.servicio.listarPorNombre(data).subscribe(res => {
            this.resultados = res;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      })
    //Define el formulario y validaciones
    this.formulario = this.cobrador.formulario;
    /* Obtiene todos los listados */
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece las pestanias
        this.pestanias = respuesta.pestanias;
        //Establece demas datos necesarios
        this.ultimoId = respuesta.ultimoId;
        this.formulario.get('id').setValue(this.ultimoId);
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    )
  }
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    let elemento = this.autocompletado.value;
    this.formulario.patchValue(elemento);
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('estaActivo').enable();
      this.formulario.get('porDefectoClienteEventual').enable();
    } else {
      this.formulario.get('estaActivo').disable();
      this.formulario.get('porDefectoClienteEventual').disable();
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.reestablecerFormulario(null);
    switch (id) {
      case 1:
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
        this.verificarPrincipal(1); //parametro 1 = agregar
        break;
      case 3:
        this.verificarPrincipal(3); //parametro 3 = actualizar
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Agrega/Actualiza un registro
  private verificarPrincipal(opcionPestania) {
    let elemento = this.formulario.value;
    this.listar();
    if (elemento.porDefectoClienteEventual && this.listaCompleta.data.length > 0) {
      this.servicio.obtenerPorDefecto().subscribe(
        res => {
          let respuesta = res.json(); //objeto con porDefectoClienteEventual=true (cobradorPrincipal)
          if (elemento.id == respuesta.id) // Si el cobrador principal es el mismo que se quiere actualizar saltea el modal 'cambiarPrincipal'
            this.controlaAccionPestania(opcionPestania);
          else
            this.cambiarPrincipal(respuesta, elemento, opcionPestania);
        },
        err => {
          this.toastr.warning("Ningún cobrador es por defecto en Cliente Eventual.");
          this.controlaAccionPestania(opcionPestania);
        }
      );
    }
    else {
      this.controlaAccionPestania(opcionPestania);
    }
  }
  //Abre ventana Dialog para cambiar por defecto ClienteEventual
  public cambiarPrincipal(cobradorPrincipal, cobradorAgregar, opcionPestania): void {
    const dialogRef = this.dialog.open(CambiarCobradorPrincipalDialogo, {
      width: '750px',
      data: {
        cobradorPrincipal: cobradorPrincipal,
        cobradorAgregar: cobradorAgregar
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.formulario.get('porDefectoClienteEventual').setValue(result);
      this.controlaAccionPestania(opcionPestania);
    });
  }
  //Controlar acción pestaña - Si el usuario está en la pestaña 'Agregar' o en 'Actualizar' llama a su método correspondiente.
  private controlaAccionPestania(opcionPestania) {
    if (opcionPestania == 1) {
      this.agregar(this.formulario.value);
    }
    if (opcionPestania == 3) {
      this.actualizar(this.formulario.value);
    }
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      let patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if (campo == 'correoElectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico Incorrecto');
        }
      }
    }
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
        this.loaderService.hide();
        if (this.listaCompleta.data.length == 0) {
          this.toastr.warning("Sin registros para mostrar.");
        }
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Agrega un registro
  private agregar(cobrador) {
    this.loaderService.show();
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(cobrador).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        this.lanzarError(respuesta);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar(cobrador) {
    this.loaderService.show();
    let esClienteEventual = this.formulario.value.porDefectoClienteEventual;
    this.servicio.actualizar(cobrador).subscribe(
      res => {
        let respuesta = res.json();
        if (res.status == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idAutocompletado').focus();
          this.toastr.success("Registro actualizado con éxito.");
          esClienteEventual != respuesta.porDefectoClienteEventual ?
            this.toastr.warning("El cobrador pasó a ser por defecto cliente eventual.") : '';
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        this.lanzarError(respuesta);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        let respuesta = res.json();
        this.reestablecerFormulario(null);
        this.toastr.success(respuesta.mensaje);
        document.getElementById('idAutocompletado').focus();
      },
      err => {
        let error = err.json();
        this.toastr.error(error.mensaje);
        document.getElementById('idAutocompletado').focus();
      }
    )
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(respuesta) {
    if (respuesta.codigo == 11003) {
      document.getElementById("labelCorreoelectronico").classList.add('label-error');
      document.getElementById("idCorreoelectronico").classList.add('is-invalid');
      document.getElementById("idCorreoelectronico").focus();
    } else if (respuesta.codigo == 11002) {
      document.getElementById("labelNombre").classList.add('label-error');
      document.getElementById("idNombre").classList.add('is-invalid');
      document.getElementById("idNombre").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.resultados = [];
    this.formulario.reset();
    this.autocompletado.reset();
    id ? this.formulario.get('id').setValue(id) : this.formulario.get('id').setValue(this.ultimoId);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
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
      return elemento ? 'Si' : 'No';
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre,
        cuenta_habilitada: elemento.estaActivo ? 'Si' : 'No',
        correo_electronico: elemento.correoElectronico ? elemento.correoElectronico : '',
        por_defecto_en_cliente_eventual: elemento.porDefectoClienteEventual ? 'Si' : 'No'
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Cobradores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
//Componente Cambiar Moneda Principal Dialogo
@Component({
  selector: 'cobrador-principal-dialogo',
  templateUrl: 'cobrador-principal-dialogo.html',
})
export class CambiarCobradorPrincipalDialogo {
  //Define la moneda que se desea agregar
  public cobradorAgregar: string;
  //Define el resultado devuelto
  public result: any;
  //Define la moneda principal actual
  public cobradorPrincipal: string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<CambiarCobradorPrincipalDialogo>, @Inject(MAT_DIALOG_DATA) public data, private servicio: CobradorService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.cobradorAgregar = this.data.cobradorAgregar;
    this.cobradorPrincipal = this.data.cobradorPrincipal;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
}