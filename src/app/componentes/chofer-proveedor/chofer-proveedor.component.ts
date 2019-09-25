import { Component, OnInit, ViewChild } from '@angular/core';
import { ChoferProveedorService } from '../../servicios/chofer-proveedor.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ChoferProveedor } from 'src/app/modelos/choferProveedor';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-chofer-proveedor',
  templateUrl: './chofer-proveedor.component.html',
  styleUrls: ['./chofer-proveedor.component.css']
})
export class ChoferProveedorComponent implements OnInit {
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
  public listaCompleta=new MatTableDataSource([]);
  //Define la lista de tipos de documentos
  public tiposDocumentos:Array<any> = [];
  //Define el form control para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:any;
  //Define la lista de resultados de busqueda de barrio
  public resultadosBarrios:Array<any> = [];
  //Define la lista de resultados de busqueda de localidad
  public resultadosLocalidades:Array<any> = [];
  //Define la lista de resultados de proveedores
  public resultadosProveedores:Array<any> = [];
  //Define la lista de resultados de choferes
  public resultadosChoferes:Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas:string[] = ['ID', 'NOMBRE', 'PROVEEDOR', 'TIPO_DOCUMENTO', 'NUMERO_DOCUMENTO', 'LOCALIDAD', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Constructor
  constructor(private servicio: ChoferProveedorService, private subopcionPestaniaService: SubopcionPestaniaService,
    private choferProveedor: ChoferProveedor, private appService: AppService, private toastr: ToastrService, 
    private proveedorServicio: ProveedorService, private barrioServicio: BarrioService,
    private localidadServicio: LocalidadService, private tipoDocumentoServicio: TipoDocumentoService,
    private loaderService: LoaderService, private reporteServicio: ReporteService) {
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
    //Define los campos para validaciones
    this.formulario = this.choferProveedor.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado Proveedor - Buscar por nombre
    this.formulario.get('proveedor').valueChanges
      .subscribe(data => {
        if(typeof data == 'string'&& data.length>2) {
          this.proveedorServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosProveedores = response;
          })
        }
    })
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges
      .subscribe(data => {
        if(typeof data == 'string'&& data.length>2) {
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
          })
        }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges
      .subscribe(data => {
        if(typeof data == 'string'&& data.length>2) {
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
          })
        }
    })
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
  }
  //Establece los valores al seleccionar un elemento del autocompletado
  public establecerValores(): void {
    this.formulario.patchValue(this.autocompletado.value);
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarLista() {
    this.resultados = new MatTableDataSource([]);
    this.resultadosProveedores = [];
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    this.vaciarLista();
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.vaciarLista();
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
        break;
      case 2:
        this.establecerValoresPestania(nombre, true, true, false, 'idProveedor');
        break;
      case 3:
        this.establecerValoresPestania(nombre, true, false, true, 'idProveedor');
        break;
      case 4:
        this.establecerValoresPestania(nombre, true, true, true, 'idProveedor');
        break;
      case 5:
        this.resultados = new MatTableDataSource([]);
        this.mostrarAutocompletado = true;
        setTimeout(function() {
          document.getElementById('idProveedor').focus();
        }, 20);
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
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Obtiene una lista de choferes por proveedor
  public listarPorProveedor() {
    this.loaderService.show();
    let proveedor = this.formulario.get('proveedor').value;
    if(this.mostrarAutocompletado) {
      this.servicio.listarPorProveedor(proveedor.id).subscribe(
        res => {
          this.resultadosChoferes = res.json();
          this.resultados = new MatTableDataSource(res.json());
          this.resultados.sort = this.sort;
          this.loaderService.hide();
        },
        err => {
          console.log(err);
          this.loaderService.hide();
        }
      )
    } else {
      this.loaderService.hide();
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
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function() {
            document.getElementById('idProveedor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function() {
            document.getElementById('idProveedor').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        this.lanzarError(err.json());
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    let formulario = this.formulario.value;
    this.servicio.eliminar(formulario.id).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(null);
          setTimeout(function () {
            document.getElementById('idNombre').focus();
          }, 20);
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
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarLista();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    this.formulario.get('numeroDocumento').setErrors({'incorrect': true});
    var respuesta = err;
    if(respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    } else if(respuesta.codigo == 11013) {
      document.getElementById("labelTelefonoFijo").classList.add('label-error');
      document.getElementById("idTelefonoFijo").classList.add('is-invalid');
      document.getElementById("idTelefonoFijo").focus();
    } else if(respuesta.codigo == 11014) {
      document.getElementById("labelTelefonoMovil").classList.add('label-error');
      document.getElementById("idTelefonoMovil").classList.add('is-invalid');
      document.getElementById("idTelefonoMovil").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if(valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if(campo == 'sitioWeb') {
          document.getElementById("labelSitioWeb").classList.add('label-error');
          document.getElementById("idSitioWeb").classList.add('is-invalid');
          this.toastr.error('Sitio Web incorrecto');
        }
      }
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if(documento) {
      switch(tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if(!respuesta) {
            let err = {codigo: 11010, mensaje: 'CUIT Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if(!respuesta2) {
            let err = {codigo: 11010, mensaje: 'CUIL Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if(!respuesta8) {
            let err = {codigo: 11010, mensaje: 'DNI Incorrecto!'};
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
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
  //Maneja los evento al presionar una tacla (para pestanias)
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
  //Prepara los datos para exportar
  private prepararDatos(resultados): Array<any> {
    let lista = resultados;
    let datos = [];
    lista.forEach(elemento => {
        let f = {
          id: elemento.id,
          nombre: elemento.nombre,
          proveedor: elemento.proveedor.razonSocial,
          tipo_documento: elemento.tipoDocumento.nombre,
          numero_documento: elemento.numeroDocumento,
          localidad: elemento.localidad.nombre + ', ' + elemento.localidad.provincia.nombre
        }
        datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.resultados.data);
    let datos = {
      nombre: 'Choferes Proveedores',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    console.log(lista);
    this.reporteServicio.abrirDialogo(datos);
  } 
}
