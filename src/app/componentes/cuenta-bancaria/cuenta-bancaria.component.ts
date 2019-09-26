import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { LoaderState } from 'src/app/modelos/loader';
import { CuentaBancaria } from 'src/app/modelos/cuentaBancaria';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { BancoService } from 'src/app/servicios/banco.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { TipoCuentaBancariaService } from 'src/app/servicios/tipo-cuenta-bancaria.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { ReporteService } from 'src/app/servicios/reporte.service';

@Component({
  selector: 'app-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.css']
})
export class CuentaBancariaComponent implements OnInit {
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
  //Define la lista de opciones
  public opciones: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la opcion seleccionada
  public opcionSeleccionada: number = null;
  //Define las listas de Empresas, Bancos, Sucursales, Tipo Cuenta Bancaria, Monedas
  public empresas: Array<any> = [];
  public sucursales: Array<any> = [];
  public tiposCuentaBancarias: Array<any> = [];
  public monedas: Array<any> = [];
  public cuentasBancarias: Array<any> = [];
  //Define la opcion activa
  public botonOpcionActivo: boolean = null;
  //Define el form control para las busquedas
  public bancos: Array<any> = [];
  //Define  el autocompletado como FormControl
  public autocompletado: FormControl = new FormControl();
  //Define  el filtro como FormControl
  public cuentaBan: FormControl = new FormControl();
  //Define  a Empresa como FormControl
  public empresa: FormControl = new FormControl();
  //Define la lista de resultados de busqueda para Cuentas Bancarias
  public resultados: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['ID','EMPRESA', 'BANCO', 'SUCURSAL', 'TIPO_CUENTA_BANCARIA', 'NUMERO_CUENTA', 'MONEDA', 'CBU', 'ALIAS_CBU', 'ESTA_ACTIVA', 'FECHA_APERTURA', 'EDITAR'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Define la lista de personales
  public personales: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private subopcionPestaniaService: SubopcionPestaniaService, private appService: AppService, private loaderService: LoaderService, 
    private cuentaBancaria: CuentaBancaria, private servicio: CuentaBancariaService, 
    private bancoService: BancoService, private sucursalService: SucursalBancoService, 
    private tipoCuentaBancariaService: TipoCuentaBancariaService, private monedaService:MonedaService, private toastr: ToastrService,
    private reporteServicio: ReporteService) {
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
          this.loaderService.hide();
        },
        err => {
        }
      );
   }

  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.cuentaBancaria.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
    //Obtiene la lista completa de Cuentas bancarias (campo "Buscar")
    this.inicializarValores();
    //Obtiene la lsita de Tipos de Cuentas Bancarias
    this.listarTiposCuentaBancaria();
    //Obtiene la lista de Monedas
    this.listarMonedas();
    //Autocompletado - Buscar Bancos por nombre
    this.formulario.get('banco').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.bancoService.listarPorNombre(data).subscribe(response => {
          this.bancos = response;
        })
      }
    })

  }
  //Inicializa valores por defecto
  private inicializarValores(){
    let empresa= this.appService.getEmpresa();
    this.empresa.setValue(empresa);
    this.formulario.get('empresa').setValue(empresa['razonSocial']);
    this.formulario.get('estaActiva').setValue(true);
  }
  public cambioAutocompletado(){
    this.sucursalService.listarPorBanco(this.formulario.value.banco.id).subscribe(
      res=>{
        this.sucursales = res.json();
      }
    )
  }
  //Obtiene la lista de empresas
  private listarTiposCuentaBancaria(){
    this.tipoCuentaBancariaService.listar().subscribe(
      res=>{
        this.tiposCuentaBancarias = res.json();
      }
    )
  }
  //Obtiene la lista de empresas
  private listarMonedas(){
    this.monedaService.listar().subscribe(
      res=>{
        this.monedas = res.json();
      }
    )
  }
  //Establece el estado de los cobos
  private establecerEstadoCampos(estado){
    if(estado){
      this.formulario.get('empresa').enable();
      this.formulario.get('sucursalBanco').enable();
      this.formulario.get('tipoCuentaBancaria').enable();
      this.formulario.get('moneda').enable();
      this.formulario.get('estaActiva').enable();
      this.formulario.get('banco').enable();
    }else{
      this.formulario.get('empresa').disable();
      this.formulario.get('sucursalBanco').disable();
      this.formulario.get('tipoCuentaBancaria').disable();
      this.formulario.get('moneda').disable();
      this.formulario.get('estaActiva').disable();
      this.formulario.get('banco').disable();
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
  }
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.reestablecerFormulario(undefined);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    this.listar();
    switch (id) {
      case 1:
        this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idAutocompletado');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idCuentasBancarias');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idCuentasBancarias');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idCuentasBancarias');
        break;
      case 5:
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
    this.servicio.listarPorEmpresa(this.appService.getEmpresa().id).subscribe(
      res => {
        this.cuentasBancarias = res.json();
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  //Cambio de cuenta bancaria 
  public cambioCuentaBancaria(){
    this.formulario.patchValue(this.cuentaBan.value);
    this.formulario.value.banco = this.cuentaBan.value.sucursalBanco.banco; //Setea el banco
    this.formulario.get('banco').setValue(this.cuentaBan.value.sucursalBanco.banco);//Setea el banco
    let empresa= this.appService.getEmpresa();
    this.empresa.setValue(empresa);
    this.formulario.get('empresa').setValue(empresa['razonSocial']);
    this.establecerSucursal(this.cuentaBan.value.sucursalBanco.banco.id, this.cuentaBan.value.sucursalBanco ); //Obtiene la lista de sucursales para que pueda hacer la comparacion

  }
  //Obtiene las sucursales del banco seleccionado y setea la correcta
  private establecerSucursal(idBanco,sucursal){
    this.sucursalService.listarPorBanco(idBanco).subscribe(
      res=>{
        this.sucursales = res.json();
      }
    )
    this.formulario.value.sucursalBanco = sucursal; //Setea el banco

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
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.appService.getUsuario());
    this.formulario.get('empresa').setValue(this.empresa.value);
    this.servicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idAutocompletado').focus();
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
    this.formulario.get('empresa').setValue(this.empresa.value);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerFormulario(undefined);
          document.getElementById('idCuentasBancarias').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let error= err;
        document.getElementById("idCuentasBancarias").focus();
        this.toastr.error(error.mensaje);
      }
    );
  }
  //Elimina un registro
  private eliminar() {
    this.loaderService.show();
    this.servicio.eliminar(this.formulario.value.id).subscribe(
      res => {
        var respuesta = res.json();
          this.reestablecerFormulario(respuesta.id);
          document.getElementById('idCuentasBancarias').focus();
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    );
  }
  //Reestablece los campos agregar
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    this.sucursales = [];
    this.cuentaBan.setValue(null);
    this.inicializarValores();
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
    document.getElementById("idAutocompletado").focus();
    this.toastr.error(respuesta.mensaje);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre);
    this.formulario.patchValue(elemento);
    this.cuentaBan.setValue(elemento);
    this.formulario.get('banco').setValue(elemento.sucursalBanco.banco);
    this.establecerSucursal(elemento.sucursalBanco.banco.id, elemento.sucursalBanco);
    this.inicializarValores();

  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre);
    this.formulario.patchValue(elemento);
    this.cuentaBan.setValue(elemento);
    this.formulario.get('banco').setValue(elemento.sucursalBanco.banco); //Setea el banco
    this.cambioAutocompletado(); //Obtiene la lista de sucursales para que pueda hacer la comparacion
    this.inicializarValores();
  }
  //Marcarar enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Valida el CBU
  public validarCBU(){
    let cbu = this.formulario.value.cbu;
    if(cbu){
      let respuesta = this.appService.validarCBU(cbu);
      if(!respuesta) {
        let err = {codigo: 11010, mensaje: 'CBU Incorrecto!'};
        document.getElementById('idCBU').focus();
        document.getElementById("idCBU").classList.add('label-error');
        document.getElementById("idCBU").classList.add('is-invalid');
        this.toastr.error(err.mensaje);
      }else{
        this.cambioCampo('idCBU', 'idCBU');
      }
    }else{
      this.cambioCampo('idCBU', 'idCBU');
    }
  }
   //Valida el Alias del CBU
   public validarAliasCBU(){
    let aliasCbu = this.formulario.value.aliasCBU;
    if(aliasCbu){
      let respuesta = this.appService.validarAliasCBU(aliasCbu);
      if(!respuesta) {
        let err = {codigo: 11010, mensaje: 'AliasCBU Incorrecto. Mínimo 6 carácteres, máximo 20 carácteres.'};
        document.getElementById("idAliasCBU").classList.add('label-error');
        document.getElementById("idAliasCBU").classList.add('is-invalid');
        this.toastr.error(err.mensaje);
      }else{
        this.cambioCampo('idAliasCBU', 'idAliasCBU');
      }
    }else{
      this.cambioCampo('idAliasCBU', 'idAliasCBU');
    }
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
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
          empresa: elemento.empresa.razonSocial,
          banco: elemento.sucursalBanco.banco.nombre,
          sucursal: elemento.sucursalBanco.nombre,
          tipo_cuenta_bancaria: elemento.tipoCuentaBancaria.nombre,
          numero_cuenta: elemento.numeroCuenta,
          moneda: elemento.moneda.nombre,
          cbu: elemento.cbu,
          alias_cbu: elemento.aliasCBU,
          esta_activa: elemento.estaActiva? 'Sí' : 'No',
          fecha_apertura: elemento.fechaApertura
        }
        datos.push(f);
    });
    return datos;
  }
  //Abre el dialogo de reporte
  public abrirReporte(): void {
    let lista = this.prepararDatos(this.listaCompleta.data);
    let datos = {
      nombre: 'Cuentas Bancarias',
      empresa: this.appService.getEmpresa().razonSocial,
      usuario: this.appService.getUsuario().nombre,
      datos: lista,
      columnas: this.columnas
    }
    this.reporteServicio.abrirDialogo(datos);
  }
  

}
