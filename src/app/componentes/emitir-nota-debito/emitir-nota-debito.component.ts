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
import { AppService } from 'src/app/servicios/app.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ChequesRechazadosComponent } from '../cheques-rechazados/cheques-rechazados.component';


@Component({
  selector: 'app-emitir-nota-debito',
  templateUrl: './emitir-nota-debito.component.html',
  styleUrls: ['./emitir-nota-debito.component.css']
})
export class EmitirNotaDebitoComponent implements OnInit {
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
  //Define la lista de resultados para Provincias
  public resultadosProvincias = [];
  //Define las variables de la cabecera
  public letra: string;
  public codigoAfip: string;
  public numero: string;


  constructor(private notaCredito: NotaCredito, private fechaService: FechaService, private tipoComprobanteService: TipoComprobanteService,private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService, private puntoVentaService: PuntoVentaService, private clienteService: ClienteService, 
    private appService: AppService, private provinciaService: ProvinciaService ,private toastr: ToastrService, public dialog: MatDialog) { 
    
  }

  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible=true;
    this.checkboxComp=true;   
    //inicializa el formulario y sus elementos
    this.formulario= this.notaCredito.formulario;
    //Reestablece el Formularios
    this.reestablecerFormulario();
    //Obtiene los puntos de venta 
    this.listarPuntoVenta();
    //Obtiene las Provincias - origen de la carga 
    this.listarProvincias(); 
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
    this.puntoVentaService.listarPorEmpresaYSucursal(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id, 3).subscribe(
      res=>{
        this.resultadosPuntoVenta= res.json();
        this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0].puntoVenta);
      }
    );
  }
  //Obtiene una lista de las Provincias 
  public listarProvincias(){
    this.provinciaService.listar().subscribe(
      res=>{
        this.resultadosProvincias = res.json();
      },
      err=>{
        this.toastr.error("Error al obtener las Provincias");
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
  //Establece Letra
  public establecerCabecera(){
    this.afipComprobanteService.obtenerLetra(this.formulario.get('cliente').value.id).subscribe(
      res=>{
        this.formulario.get('letra').setValue(res.text());
        this.establecerCodAfip(res.text());
      }
    );
  }
  //Establece Numero
  public establecerCodAfip(letra){
    this.afipComprobanteService.obtenerCodigoAfip(3, letra).subscribe(
      res=>{
        this.formulario.get('codigoAfip').setValue(res.text());
        this.establecerNumero(res.text());
      }
    );
  }
  //Establece Codigo Afip
  public establecerNumero(codigoAfip){
    console.log(this.formulario.value);
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res=>{
        this.formulario.get('numero').setValue(res.text());
      }
    );
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor, cantidad) {
    return this.appService.setDecimales(valor, cantidad);
  }
  //Abre un modal para agregar un ver los Cheques Rechazados
  public verChequesRechazados(): void {
    const dialogRef = this.dialog.open(ChequesRechazadosComponent, {
      width: '1200px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {
      // this.formularioItem.get('kilosAforado').setValue(resultado);
    });
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    return (string + elemento).slice(cantidad);
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
