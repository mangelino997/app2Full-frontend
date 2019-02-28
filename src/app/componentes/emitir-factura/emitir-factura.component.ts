import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { MatDialog } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';
import { AppService } from 'src/app/servicios/app.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';

@Component({
  selector: 'app-emitir-factura',
  templateUrl: './emitir-factura.component.html',
  styleUrls: ['./emitir-factura.component.css']
})
export class EmitirFacturaComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;
  //Define la pestania activa
  public activeLink:any = null;
  //Define una lista
  public lista = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define el siguiente id
  public siguienteId:number = null;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define el form control para los combos de Sucursales Remitente y Destinatario
  public sucursalDestinatario:FormControl = new FormControl();
  public sucursalRemitente:FormControl = new FormControl();
  //Define el form control para tipo de comprobante
  public tipoComprobante:FormControl = new FormControl();
  //Define la lista de resultados de busqueda para Reminentes y Destinatarios
  public resultadosReminentes = [];
  public resultadosDestinatarios = [];
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de sucursales para el Remitente y Destinatario
  public resultadosSucursalesRem = [];
  public resultadosSucursalesDes = [];
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual:string=null;
  
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  constructor(
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService,
    public clienteService: ClienteService, private toastr: ToastrService, private factura: EmitirFactura, private appService: AppService, 
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService, private tipoComprobanteservice: TipoComprobanteService,
    private afipComprobanteService: AfipComprobanteService

    ) {}

  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.factura.formulario;
    this.reestablecerFormulario(undefined);
    //Lista los puntos de venta 
    this.listarPuntoVenta();
    //Carga el tipo de comprobante
    this.tipoComprobanteservice.obtenerPorId(1).subscribe(
      res=>{
        this.formulario.get('tipoComprobante').setValue(res.json());
        this.tipoComprobante.setValue(this.formulario.get('tipoComprobante').value.nombre);
      }
    )
    //Autcompletado - Buscar por Remitente
    this.formulario.get('remitente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          console.log(res);

          this.resultadosReminentes = res;
        })
      }
    });
    //Autcompletado - Buscar por Destinatario
    this.formulario.get('destinatario').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosDestinatarios = res;
        })
      }
    });
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntoVenta(){
    let empresa= this.appComponent.getEmpresa();
    this.puntoVentaService.listarPorEmpresaYSucursal(empresa['id'], this.appComponent.getUsuario().sucursal.id).subscribe(
      res=>{
        console.log(res.json());
        this.resultadosPuntoVenta= res.json();
        for(let i=0; i< this.resultadosPuntoVenta.length; i++){
          if(this.resultadosPuntoVenta[i].porDefecto== true){
            this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[i]);
          }
        }
      }
    );
  }
  //Obtiene el listado de Sucursales por Remitente
  public listarSucursalesRemitente() {
    console.log(this.formulario.get('remitente').value);
    this.formulario.get('rem.domicilio').setValue(this.formulario.get('remitente').value.domicilio);
    this.formulario.get('rem.localidad').setValue(this.formulario.get('remitente').value.localidad.nombre);
    this.formulario.get('rem.condicionVenta').setValue(this.formulario.get('remitente').value.condicionVenta.nombre);
    this.formulario.get('rem.afipCondicionIva').setValue(this.formulario.get('remitente').value.afipCondicionIva.nombre);
    this.sucursalService.listarPorCliente(this.formulario.get('remitente').value.id).subscribe(
      res => {
        console.log(res.json());
        this.resultadosSucursalesRem = res.json();
        this.formulario.get('rem.sucursal').setValue(this.resultadosSucursalesRem[0]);
      },
      err => {
        this.toastr.error("El Remitente no tiene asignada una sucursal de entrega.");
      }
    );
  }
  //Obtiene el listado de Sucursales por Remitente
  public listarSucursalesDestinatario() {
    console.log(this.formulario.get('destinatario').value);
    this.formulario.get('des.domicilio').setValue(this.formulario.get('destinatario').value.domicilio);
    this.formulario.get('des.localidad').setValue(this.formulario.get('destinatario').value.localidad.nombre);
    this.formulario.get('des.condicionVenta').setValue(this.formulario.get('destinatario').value.condicionVenta.nombre);
    this.formulario.get('des.afipCondicionIva').setValue(this.formulario.get('destinatario').value.afipCondicionIva.nombre);
    this.sucursalService.listarPorCliente(this.formulario.get('destinatario').value.id).subscribe(
      res => {
        this.resultadosSucursalesDes = res.json();
        this.formulario.get('des.sucursal').setValue(this.resultadosSucursalesDes[0]);
      },
      err => {
        this.toastr.error("El Destinatario no tiene asignada una sucursal de entrega.");
      }
    );
  }
  //Abre el dialogo para agregar un cliente eventual
  public agregarClienteEventual(): void {
    const dialogRef = this.dialog.open(ClienteEventualComponent, {
      width: '1200px',
      data: {
        formulario: null,
        usuario: this.appComponent.getUsuario()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      this.clienteService.obtenerPorId(resultado).subscribe(res => {
        var cliente = res.json();
        this.formulario.get('cliente').setValue(cliente);
      })
    });
  }
  //Reestablece el formulario
  public reestablecerFormulario(id){
    this.resultadosReminentes = [];
    this.resultadosDestinatarios = []; 
    this.resultadosSucursalesRem = [];
    this.resultadosSucursalesDes = [];   
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fecha').setValue(res.json());
      this.fechaActual= res.json();
    });
    // setTimeout(function() {
    //   document.getElementById('idCliente').focus();
    // }, 20);
  }
  //Controla los checkbox
  public pagoEnOrigen(){
    if(this.formulario.get('pagoEnOrigen').value==true){
      document.getElementById('Remitente').className="border has-float-label pagaSeleccionado";
      document.getElementById('Destinatario').className="border has-float-label";
      this.afipComprobanteService.obtenerLetra(this.formulario.get('remitente').value.id).subscribe(
        res=>{
          this.formulario.get('letra').setValue(res.text());
          this.cargarCodigoAfip(res.text());  
        }
      )
    }
    else{
      document.getElementById('Remitente').className="border has-float-label";
      document.getElementById('Destinatario').className="border has-float-label pagaSeleccionado";
      this.afipComprobanteService.obtenerLetra(this.formulario.get('destinatario').value.id).subscribe(
        res=>{
          this.formulario.get('letra').setValue(res.text());
          this.cargarCodigoAfip(res.text());  
        }
      )
    }
  }
  //Setea el codigo de Afip por el tipo de comprobante y la letra
  public cargarCodigoAfip(letra){
    this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('tipoComprobante').value.id, letra).subscribe(
      res=>{
        this.formulario.get('codigoAfip').setValue(res.text());
        this.cargarNumero(res.text());
      }
    )
  }
  //Setea el numero por el punto de venta y el codigo de Afip
  public cargarNumero(codigoAfip){
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value, codigoAfip).subscribe();
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    console.log(string , elemento ,cantidad);
    return (string + elemento.value).slice(cantidad);
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
