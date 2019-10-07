import { Component, OnInit, ViewChild } from '@angular/core';
import { RubroProductoService } from '../../servicios/rubro-producto.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { PlanCuentaDialogo } from '../plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { RubroProductoCuentaContableService } from 'src/app/servicios/rubro-producto-cuenta-contable.service';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

@Component({
  selector: 'app-rubro-producto',
  templateUrl: './rubro-producto.component.html',
  styleUrls: ['./rubro-producto.component.css']
})
export class RubroProductoComponent implements OnInit {
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
  //Define la lista de planes de cuentas
  public planesCuentas = new MatTableDataSource([]);
  //Define el autocompletado para las busquedas
  public autocompletado: FormControl = new FormControl();
  //Define la lista de resultados del autocompletado
  public resultados: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'EDITAR'];
  //Define las columnas de la tabla
  public columnasPlanCuenta: string[] = ['empresa', 'cuentaContable', 'planCuenta', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: RubroProductoService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appService: AppService, private toastr: ToastrService, private loaderService: LoaderService,
    private usuarioEmpresaService: UsuarioEmpresaService, private dialog: MatDialog, private reporteServicio: ReporteService,
    private rubroProductoCuentaContableService: RubroProductoCuentaContableService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
        }
      );
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
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
      nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      esInsumo: new FormControl(),
      esCombustible: new FormControl(),
      rubrosProductosCuentasContables: new FormControl()
    });
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Crea la lista de cuentas contables
    this.crearCuentasContables();
    //Obtiene la lista completa de registros
    // this.listar();
  }
  //Establece el formulario
  public establecerFormulario() {
    let elemento = this.autocompletado.value;
    this.formulario.setValue(elemento);
    if (elemento.rubrosProductosCuentasContables.length == 0) {
      this.crearCuentasContables();
    } else {
      this.planesCuentas = new MatTableDataSource(elemento.rubrosProductosCuentasContables);
    }
  }
  //Crea la lista de planes de cuenta
  public crearCuentasContables(): void {
    this.loaderService.show();
    let usuario = this.appService.getUsuario();
    let token = localStorage.getItem('token');
    this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(usuario.id, token).subscribe(
      res => {
        let planesCuentas = [];
        let empresas = res.json();
        let formulario = null;
        for (let i = 0; i < empresas.length; i++) {
          formulario = {
            empresa: empresas[i],
            planCuentaCompra: null
          }
          planesCuentas.push(formulario);
        }
        this.planesCuentas = new MatTableDataSource(planesCuentas);
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Abre el dialogo Plan de Cuenta
  public asignarPlanCuenta(elemento) {
    const dialogRef = this.dialog.open(PlanCuentaDialogo, {
      width: '70%',
      height: '70%',
      data: {
        empresa: elemento.empresa,
        grupoCuentaContable: 4
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        let planCuenta = {
          id: resultado.id,
          version: resultado.version,
          nombre: resultado.nombre
        }
        elemento.planCuentaCompra = planCuenta;
        if(this.indiceSeleccionado == 3) {
          this.loaderService.show();
          elemento.rubroProducto = {
            id: this.formulario.get('id').value,
            version: this.formulario.get('version').value
          };
          this.rubroProductoCuentaContableService.actualizar(elemento).subscribe(
            res => {
              let respuesta = res.json();
              if(respuesta.codigo == 200) {
                this.toastr.success(MensajeExcepcion.ACTUALIZADO);
              } else {
                elemento.planCuentaCompra = null;
              }
              this.loaderService.hide();
            },
            err => {
              elemento.planCuentaCompra = null;
              this.toastr.error(MensajeExcepcion.NO_ACTUALIZADO);
              this.loaderService.hide();
            }
          );
        }
      }
    });
  }
  //Elimina la cuenta contable de la empresa
  public eliminarPlanCuenta(elemento) {
    const id = elemento.id;
    if(this.indiceSeleccionado == 3) {
      this.loaderService.show();
      this.rubroProductoCuentaContableService.eliminar(id).subscribe(
        res => {
          let respuesta = res.json();
          if(respuesta.codigo == 200) {
            elemento.planCuentaCompra = null;
            this.toastr.success(MensajeExcepcion.ELIMINADO);
          }
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(MensajeExcepcion.NO_ELIMINADO);
          this.loaderService.hide();
        }
      );
    } else {
      elemento.planCuentaCompra = null;
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
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.reestablecerFormulario('');
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
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
    this.servicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
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
    this.formulario.get('rubrosProductosCuentasContables').setValue(this.planesCuentas.data);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('rubrosProductosCuentasContables').setValue(null);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          document.getElementById('idAutocompletado').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 500) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.reset();
    this.resultados = [];
    this.crearCuentasContables();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.establecerFormulario();
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
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
  //Prepara los datos para exportar
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Rubros Productos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}