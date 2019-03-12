import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotaCredito } from 'src/app/modelos/notaCredito';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';

@Component({
  selector: 'app-emitir-nota-credito',
  templateUrl: './emitir-nota-credito.component.html',
  styleUrls: ['./emitir-nota-credito.component.css']
})
export class EmitirNotaCreditoComponent implements OnInit {
  public checkboxComp: boolean=null;
  public checkboxCuenta: boolean=null;
  public tablaVisible: boolean=null;
  public formulario: FormGroup;
  //Define las listas 
  public listaCuenta = [];
  public listaComprobante = [];
  //Define como un FormControl
  public tipoComprobante:FormControl = new FormControl();
  //Define la lista de resultados de busqueda para clientes
  public resultadosClientes = [];
  //Define los datos de la Empresa
  public empresa:FormControl = new FormControl();
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];

  constructor(private notaCredito: NotaCredito, private fechaService: FechaService, private tipoComprobanteService: TipoComprobanteService,private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService, private puntoVentaService: PuntoVentaService, private clienteService: ClienteService, private toastr: ToastrService ) { }

  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible=true;
    this.checkboxComp=true;   
    //inicializa el formulario y sus elementos
    this.formulario= this.notaCredito.formulario;
    //Reestablece el Formularios
    this.reestablecerFormulario();
    //Lista los puntos de venta 
    this.listarPuntoVenta();
    //Autcompletado - Buscar por Cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosClientes = res;
        })
      }
    });
  }
  public cambiarTablaCuenta(){
    this.tablaVisible=false;
  }
  public cambiarTablaComp(){
    this.tablaVisible=true;
  }
  //Reestablece el formulario completo
  public reestablecerFormulario(){
    this.formulario.reset(); 
    this.resultadosClientes = [];
    this.empresa.setValue(this.appComponent.getEmpresa());

    //Establece la fecha actual
    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fechaEmision').setValue(res.json());
    });
    //Establece el Tipo de Comprobante
    this.tipoComprobanteService.obtenerPorId(3).subscribe(
      res=>{
        let respuesta = res.json();
        this.formulario.get('ventaComprobante').setValue(res.json());
        this.tipoComprobante.setValue(respuesta.abreviatura);
      },
      err=>{
        this.toastr.error('Error al obtener el Tipo de Comprobante');
      }
    );
    setTimeout(function() {
      document.getElementById('idFecha').focus();
    }, 20);
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntoVenta(){
    this.puntoVentaService.listarPorEmpresaYSucursal(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id).subscribe(
      res=>{
        this.resultadosPuntoVenta= res.json();
        this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0].puntoVenta);
      }
    );
  }
  //Establece los datos del cliente seleccionado
  public cargarDatosCliente(){
    this.formulario.get('cli.domicilio').setValue(this.formulario.get('cliente').value.domicilio);
    this.formulario.get('cli.localidad').setValue(this.formulario.get('cliente').value.localidad.nombre);
    this.formulario.get('cli.condicionVenta').setValue(this.formulario.get('cliente').value.condicionVenta.nombre);
    this.formulario.get('cli.afipCondicionIva').setValue(this.formulario.get('cliente').value.afipCondicionIva.nombre);
    this.formulario.get('cli.tipoDocumento').setValue(this.formulario.get('cliente').value.tipoDocumento.abreviatura);
    this.formulario.get('cli.numeroDocumento').setValue(this.formulario.get('cliente').value.numeroDocumento);
    this.establecerCabecera();
  }
  //Establece Letra, Numero, Codigo Afip
  public establecerCabecera(){
    this.afipComprobanteService.obtenerLetra(this.formulario.get('cliente').value.id).subscribe(
      res=>{
        this.formulario.get('letra').setValue(res.text());
      }
    );
    console.log(this.formulario.value, this.formulario.get('letra').value);
    this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('ventaComprobante').value.id, this.formulario.get('letra').value).subscribe(
      res=>{
        this.formulario.get('codigoAfip').setValue(res.text());
      }
    );
    console.log(this.formulario.get('puntoVenta').value, this.formulario.get('codigoAfip').value, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id);

    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value, this.formulario.get('codigoAfip').value, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res=>{
        this.formulario.get('numero').setValue(res.text());
      }
    );
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
  public displayFn(elemento) {
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
      return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
    } else {
      return '';
    }
  }
  

}
