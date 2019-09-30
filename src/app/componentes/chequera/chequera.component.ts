import { Component, OnInit, ViewChild } from '@angular/core';
import { Chequera } from 'src/app/modelos/chequera';
import { ChequeraService } from 'src/app/servicios/chequera.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { TipoChequeraService } from 'src/app/servicios/tipo-chequera.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AppService } from 'src/app/servicios/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { LoaderState } from 'src/app/modelos/loader';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-chequera',
  templateUrl: './chequera.component.html',
  styleUrls: ['./chequera.component.css']
})
export class ChequeraComponent implements OnInit {
  //Define la lista de Cuentas Bancarias
  public cuentasBancarias: Array<any> = [];
  //Define la lista de Cuentas Bancarias para las Consultas
  public listaCuentasBancariasEmpresa: Array<any> = [];
  //Define la lista de Cuentas Bancarias con chequeras para las Consultas
  public listaCuentasConChequeraEmpresa: Array<any> = [];
  //Define la lista de chequeras por Cuenta Bancaria para las Consultas
  public listaChequerasCuentaBancaria: Array<any> = [];
  //Define la lista de Tipos de Chequeras
  public tiposChequeras: Array<any> = [];
  //Define la pestania activa
  public activeLink: any = null;
  //Define los datos de la empresa
  public empresa: any = null;
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
  //Define el campo empresa como un FormControl
  public empresaDatos: FormControl = new FormControl();
  //Define la cuenta Seleccionada como un FormControl
  public cuentaSeleccionada: FormControl = new FormControl();
  //Define la chequera Seleccionada como un FormControl
  public chequeraSeleccionada: FormControl = new FormControl();
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'EMPRESA', 'CUENTA_BANCARIA', 'TIPO_CHEQUERA', 'DESDE', 'HASTA', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(private chequera: Chequera, private servicio: ChequeraService, private tipoChequeraService: TipoChequeraService,
    private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private toastr: ToastrService,
    private loaderService: LoaderService, private cuentaBancariaService: CuentaBancariaService, private reporteServicio: ReporteService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
          this.pestanias.splice(2, 1);
        },
        err => {
        }
      );
  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define los campos para validaciones
    this.formulario = this.chequera.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Establece la empresa por defecto
    this.establecerEmpresa();
    //Obtiene la lista completa de registros
    this.listar();
    //Obtiene la lista de Cuentas Bancarias
    this.listarCuentasBancarias();
    //Obtiene las diferentes cuentas bancarias de la empresa para realizar la Consultas
    this.listarCuentasBancariasConsultas();
    //Obtiene las diferentes cuentas bancarias de la empresa con chequeras para realizar la Consultas
    this.listarCuentasConChequerasConsultas();
    //Obtiene la lista de Tipos de Chequeras
    this.listarTiposChequeras();
  }
  //Establece la empresa por defecto
  private establecerEmpresa() {
    this.empresa = this.appService.getEmpresa();
    this.empresaDatos.setValue(this.empresa.razonSocial);
  }
  //Obtiene la lista de Cuentas Bancarias
  private listarCuentasBancarias() {
    this.cuentaBancariaService.listarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.cuentasBancarias = res.json();
      }
    )
  }
  private listarCuentasBancariasConsultas() {
    this.empresa = this.appService.getEmpresa();
    this.servicio.listarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.listaCuentasBancariasEmpresa = res.json();
      }
    )
  }
  private listarCuentasConChequerasConsultas() {
    this.empresa = this.appService.getEmpresa();
    this.cuentaBancariaService.listarConChequerasPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.listaCuentasConChequeraEmpresa = res.json();
      }
    )
  }
  private listarChequerasConsultas(idCuentaBancaria) {
    this.servicio.listarPorCuentaBancaria(idCuentaBancaria).subscribe(
      res => {
        this.listaChequerasCuentaBancaria = res.json();
      }
    )
  }
  //Obtiene la lista de Tipos de Chequeras
  private listarTiposChequeras() {
    this.tipoChequeraService.listar().subscribe(
      res => {
        this.tiposChequeras = res.json();
      }
    )
  }
  //Obtiene los datos de la cuenta bancaria seleccionada
  public cambioCuentaBancaria() {
    let elemento = this.cuentaSeleccionada.value;
    this.listarChequerasConsultas(elemento.id);
  }
  //Obtiene los datos de la cuenta bancaria seleccionada
  public cambioChequera() {
    this.formulario.patchValue(this.chequeraSeleccionada.value);
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    if (soloLectura) {
      this.formulario.get('tipoChequera').disable();
    } else {
      this.formulario.get('tipoChequera').enable();
    }
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.establecerEmpresa();
    this.reestablecerFormulario('');
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.cuentaSeleccionada.reset();
      this.chequeraSeleccionada.reset();
      this.listaChequerasCuentaBancaria = [];
    }
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerValoresPestania(nombre, false, false, true, 'idCuentaBancaria');
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
    this.servicio.listarPorEmpresa(this.empresa.id).subscribe(
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
    let usuario = this.appService.getUsuario();
    this.formulario.get('usuarioAlta').setValue(usuario);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idCuentaBancaria').focus();
          this.empresaDatos.setValue(this.empresa.abreviatura);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.empresaDatos.setValue(this.empresa.abreviatura);
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.get('empresa').setValue(this.empresa);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario('');
          document.getElementById('idAutocompletado').focus();
          this.empresaDatos.setValue(this.empresa.abreviatura);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        this.empresaDatos.setValue(this.empresa.abreviatura);
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    );
  }
  //Elimina un registro
  private eliminar() {
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Valida si el campo "Hasta" es mayor al campo "Desde"
  public validarMayor() {
    this.establecerCerosIzq(this.formulario.get('hasta'), "0000000", -8);
    if (this.formulario.value.hasta < this.formulario.value.desde) {
      this.formulario.get('desde').setValue(null);
      this.toastr.error("El campo 'Desde' debe ser MENOR que el campo 'Hasta' ");
      document.getElementById('idDesde').focus();
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Controla el Autocompletado
  public cambioAutocompletado(elemento) {
    this.formulario.patchValue(elemento);
    this.establecerCerosIzq(this.formulario.get('desde'), "0000000", -8);
    this.establecerCerosIzq(this.formulario.get('hasta'), "0000000", -8);
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.cuentaSeleccionada.reset();
  }
  //Manejo de colores de campos y labels con error
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if (valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {

      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.cuentaSeleccionada.setValue(elemento.cuentaBancaria);
    this.listarChequerasConsultas(this.cuentaSeleccionada.value.id)
    this.chequeraSeleccionada.setValue(elemento);
    this.empresaDatos.setValue(this.empresa.abreviatura);
    this.formulario.patchValue(elemento);
    this.establecerCerosIzq(this.formulario.get('desde'), "0000000", -8);
    this.establecerCerosIzq(this.formulario.get('hasta'), "0000000", -8);

  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.cuentaSeleccionada.setValue(elemento.cuentaBancaria);
    this.listarChequerasConsultas(this.cuentaSeleccionada.value.id)
    this.chequeraSeleccionada.setValue(elemento);
    this.empresaDatos.setValue(this.empresa.abreviatura);
    this.formulario.patchValue(elemento);
    this.establecerCerosIzq(this.formulario.get('desde'), "0000000", -8);
    this.establecerCerosIzq(this.formulario.get('hasta'), "0000000", -8);
  }
  //Define como se muestra los datos en el autcompletado
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
      return elemento.alias ? elemento.alias : elemento;
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
        empresa: elemento.cuentaBancaria.empresa.razonSocial,
        cuenta_bancaria: elemento.cuentaBancaria.sucursalBanco.banco.nombre + '-' + elemento.cuentaBancaria.sucursalBanco.nombre + '-' + elemento.cuentaBancaria.numeroCuenta,
        tipo_chequera: elemento.tipoChequera.nombre,
        desde: elemento.desde,
        hasta: elemento.hasta
      }
      datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Chequeras',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
}
