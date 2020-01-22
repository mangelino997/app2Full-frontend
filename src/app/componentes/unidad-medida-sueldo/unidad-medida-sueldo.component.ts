import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ReporteService } from 'src/app/servicios/reporte.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unidad-medida-sueldo',
  templateUrl: './unidad-medida-sueldo.component.html',
  styleUrls: ['./unidad-medida-sueldo.component.css']
})
export class UnidadMedidaSueldoComponent implements OnInit {
  //Define el ultimo id
  public ultimoId: string = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania activa
  public activeLink: any = null;
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Defiene el render
  public render: boolean = false;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'CODIGOAFIP','EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private unidadMedidaSueldoService: UnidadMedidaSueldoService, private appService: AppService, 
    private loaderService: LoaderService, private reporteServicio: ReporteService, private toastr: ToastrService) {
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      nombre: new FormControl(),
      codigoAfip: new FormControl(),
    })
  }
  ngOnInit() {
    //Obtiene los datos principales para el componente
    this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Autocompletado - Buscar por nombre
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.unidadMedidaSueldoService.listarPorNombre(data).subscribe(res => {
            this.resultados = res;
            console.log(this.resultados)
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  
}
  //Obtiene los listados
  private inicializar(idRol, idSubopcion){
  this.render = true;
  this.unidadMedidaSueldoService.inicializar(idRol, idSubopcion).subscribe(
    res => {
      let respuesta = res.json();
      this.pestanias = respuesta.pestanias;
      this.ultimoId = respuesta.ultimoId;
      this.formulario.get('id').setValue(this.ultimoId);
      this.render = false;
    },
    err => {

    }
  )
}
  // //Lista las unidades medidas sueldos
  // public listar(){
  //   this.unidadMedidaSueldoService.listar().subscribe(
  //     res=>{
  //       this.lista(ver en html como se llamara la lista) = res.json();
  //     },
  //     err=>{

  //     }
  //   )
  // }

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
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado(elemento) {
  this.formulario.setValue(elemento);
}
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
  if (elemento != undefined) {
    return elemento.nombre ? elemento.nombre : elemento;
  } else {
    return elemento;
  }
}
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
  /* Limpia el formulario para no mostrar valores en campos cuando 
    la pestaña es != 1 */
  this.indiceSeleccionado != 1 ? this.formulario.reset() : '';
  this.pestaniaActual = nombrePestania;
  this.mostrarAutocompletado = autocompletado;
  this.soloLectura = soloLectura;
  this.mostrarBoton = boton;
  setTimeout(function () {
    document.getElementById(componente).focus();
  }, 20);
};
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
  this.indiceSeleccionado = id;
  this.activeLink = nombre;
  this.reestablecerFormulario();
  switch (id) {
    case 1:
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
  //Reestablece los campos formularios
  private reestablecerFormulario() {
  this.resultados = [];
  this.formulario.reset();
  this.autocompletado.reset();
  this.formulario.get('id').setValue(this.ultimoId);
}
  public agregar(){
    this.loaderService.show();
    this.unidadMedidaSueldoService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.ultimoId = respuesta.id;
          this.reestablecerFormulario();
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 11002) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        } else {
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  public actualizar(){
  this.loaderService.show();
  console.log(this.formulario.value);
  this.unidadMedidaSueldoService.actualizar(this.formulario.value).subscribe(
    res => {
      let respuesta = res.json();
      if (respuesta.codigo == 200) {
        this.reestablecerFormulario();
        document.getElementById('idAutocompletado').focus();
        this.toastr.success(respuesta.mensaje);
        this.loaderService.hide();
      }
    },
    err => {
      let respuesta = err.json();
      if (respuesta.codigo == 11002) {
        document.getElementById("labelNombre").classList.add('label-error');
        document.getElementById("idNombre").classList.add('is-invalid');
        document.getElementById("idNombre").focus();
        this.toastr.error(respuesta.mensaje);
      } else {
        this.toastr.error(respuesta.mensaje);
      }
      this.loaderService.hide();
    }
  );
 }
  public eliminar(){
    this.loaderService.show();
    let formulario = this.formulario.value;
    this.unidadMedidaSueldoService.eliminar(formulario.id).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario();
          document.getElementById('idNombre').focus();
          this.toastr.success(respuesta.mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        let respuesta = err.json();
        if (respuesta.codigo == 500) {
          document.getElementById("labelNombre").classList.add('label-error');
          document.getElementById("idNombre").classList.add('is-invalid');
          document.getElementById("idNombre").focus();
          this.toastr.error(respuesta.mensaje);
        } else {
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
 }
//Obtiene el listado de registros
private listar() {
  this.loaderService.show();
  this.unidadMedidaSueldoService.listar().subscribe(
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
//Verifica si se selecciono un elemento del autocompletado
public verificarSeleccion(valor): void {
  if (typeof valor.value != 'object') {
    valor.setValue(null);
  }
}
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
  private prepararDatos(listaCompleta): Array<any> {
    let lista = listaCompleta;
    let datos = [];
    lista.forEach(elemento => {
      let f = {
        id: elemento.id,
        nombre: elemento.nombre,
      }
      datos.push(f);
    });
    return datos;
  }
  public abrirReporte(){
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Unidades Medidas Sueldos',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
