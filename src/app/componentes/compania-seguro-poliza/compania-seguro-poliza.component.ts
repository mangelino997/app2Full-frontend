import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompaniaSeguroPoliza } from 'src/app/modelos/companiaSeguroPoliza';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-compania-seguro-poliza',
  templateUrl: './compania-seguro-poliza.component.html',
  styleUrls: ['./compania-seguro-poliza.component.css']
})
export class CompaniaSeguroPolizaComponent implements OnInit {
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
  //Define la imagen 
  public imagen: any = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta=new MatTableDataSource([]);
  //Define el autocompletado
  public autocompletado:FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda:FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados:Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros:Array<any> = [];
  //Defien la lista de empresas
  public empresas:Array<any> = [];
  //Define las columnas de la tabla
  public columnas:string[] = ['id', 'empresa', 'numeroPoliza', 'vtoPoliza','pdf', 'ver', 'mod', 'eliminar'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Defiene la poliza
  public poliza:FormControl = new FormControl();
  //Define la lista de polizas de una compania seguro y empresa
  public polizas:Array<any> = [];
  //Constructor
  constructor(private servicio: CompaniaSeguroPolizaService,
     private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, private appService: AppService,
    private companiaSeguroServicio: CompaniaSeguroService, private empresaServicio: EmpresaService,
    private companiaSeguroPolizaModelo: CompaniaSeguroPoliza, private loaderService: LoaderService) {
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
      this.loaderService.show();
      //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
    .subscribe(
      res => {
        this.pestanias = res.json();
        this.activeLink = this.pestanias[0].nombre;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
      }
    );
    //Define el formulario y validaciones
    this.formulario = this.companiaSeguroPolizaModelo.formulario;
    //Autocompletado Compania Seguro - Buscar por nombre
    this.formulario.get('companiaSeguro').valueChanges.subscribe(data => {
      if(typeof data == 'string'&& data.length>2) {
        this.companiaSeguroServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosCompaniasSeguros = res;
        })
      }
    })
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Obtiene la lista de empresas
    this.listarEmpresas();
  }

  public readURL(event):void {
    if(event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload= e => {
        let foto = {
          id: this.formulario.value.id,
          nombre: file.name,
          datos: reader.result
        }
        this.formulario.get('pdf').setValue(foto);
      }
      reader.readAsDataURL(file);
    }
  }
  //Obtiene la lista de empresas
  private listarEmpresas() {
    this.loaderService.show();
    this.empresaServicio.listar().subscribe(res => {
      this.empresas = res.json();
      this.loaderService.hide();
    })
  }
  //Vacia la listas de resultados autocompletados
  private vaciarListas() {
    this.listaCompleta =new MatTableDataSource([]);
    this.resultadosCompaniasSeguros = [];
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
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if(estado) {
      this.formulario.get('empresa').enable();
    } else {
      this.formulario.get('empresa').disable();
    }
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    if(opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.empresaBusqueda.setValue(undefined);
      this.vaciarListas();
    }
    this.formulario.reset();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
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
        setTimeout(function() {
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
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    console.log(this.formulario.value);
    this.servicio.agregar(this.formulario.value).then(
      res => {
        var respuesta = res.json();
        if(res.status == 201) {
          respuesta.then(data => {
          this.reestablecerFormulario(data.id);
          setTimeout(function() {
            document.getElementById('idCompaniaSeguro').focus();
          }, 20);
          this.toastr.success('Registro agregado con éxito');
        })
      }
          this.loaderService.hide();
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.hide();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          setTimeout(function() {
            document.getElementById('idCompaniaSeguro').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    console.log();
  }
  //Obtiene un listado por empresa
  public listarPorEmpresa(elemento) {
    this.resultados = [];
    if(this.mostrarAutocompletado) {
      this.servicio.listarPorEmpresa(elemento.id).subscribe(res => {
        this.resultados = res.json();
      })
    }
  }
  //Obtiene un listado por compania de seguro
  public listarPorCompaniaSeguro() {
    let companiaSeguro = this.formulario.get('companiaSeguro').value;
    this.servicio.listarPorCompaniaSeguro(companiaSeguro.id).subscribe(res => {
      this.listaCompleta = new MatTableDataSource(res.json());
      this.listaCompleta.sort = this.sort;
    })
  }
  //Obtiene un listado por compania de seguro
  public listarPorCompaniaSeguroYEmpresa() {
    if(this.indiceSeleccionado != 1) {
      let companiaSeguro = this.formulario.get('companiaSeguro').value;
      let empresa = this.formulario.get('empresa').value;
      if(companiaSeguro != null && empresa != null) {
        this.servicio.listarPorCompaniaSeguroYEmpresa(companiaSeguro.id, empresa.id).subscribe(res => {
          this.polizas = res.json();
        })
      }
    }
  }
  //Establece los datos de la poliza seleccionada
  public establecerPoliza(): void {
    let poliza = this.poliza.value;
    this.formulario.setValue(poliza);
  }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.empresaBusqueda.setValue(undefined);
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.poliza.reset();
    this.vaciarListas();
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.empresaBusqueda.setValue(elemento.empresa);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.empresaBusqueda.setValue(elemento.empresa);
    this.autocompletado.setValue(elemento);
    this.formulario.setValue(elemento);
  }
  //Obtiene la mascara de enteros CON decimales
  public obtenerMascaraEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
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
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado b
  public displayFb(elemento) {
    if(elemento != undefined) {
      return elemento.numeroPoliza ? elemento.numeroPoliza + ' - ' + elemento.companiaSeguro.nombre : elemento;
    } else {
      return elemento;
    }
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}  