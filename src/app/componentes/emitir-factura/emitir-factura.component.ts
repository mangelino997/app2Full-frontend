import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';
import { AppService } from 'src/app/servicios/app.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ViajePropioTramoService } from 'src/app/servicios/viaje-propio-tramo.service';
import { ViajeTerceroTramoService } from 'src/app/servicios/viaje-tercero-tramo.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { AforoComponent } from '../aforo/aforo.component';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
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
  //Define una lista
  public lista = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define un formulario para la tabla items
  public formularioItem:FormGroup;
  //Define un formulario para el contrareembolso
  public formularioCR:FormGroup;
  //Define el siguiente id
  public siguienteId:number = null;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define el combo de items como un formControl
  public item: FormControl = new FormControl();
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
  //Define la lista de items
  public resultadosItems = [];
  //Define la lista de Remitos
  public resultadosRemitos = [];
  //Define la lista de Tarifas O. Vta.
  public resultadosTarifas = [];
  //Define la lista de Conceptos Varios
  public resultadosConceptosVarios = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public resultadosAlicuotasIva = [];
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual:string=null;
  //Define el array de los items-viajes para la tabla
  public listaItemViaje:Array<any> = [];
  //Define el array del Contra Reembolso
  public listaCR:Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura:boolean= true;
  //Define si los campos para el formulario de Contra reembolso son visibles
  public soloLecturaCR:boolean= true;
  //Define los datos de la Empresa
  public empresa:FormControl = new FormControl();
  //Define el importeTotal como la suma de cada subtotal de cada item
  public subtotalSuma:FormControl = new FormControl();
  //Cuenta la cantidad de items agregados a la lista
  public contador:FormControl = new FormControl();
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  constructor(
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService, private ventaComprobanteService: VentaComprobanteService,
    public clienteService: ClienteService, private toastr: ToastrService, private factura: EmitirFactura, private appService: AppService, 
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService, private tipoComprobanteservice: TipoComprobanteService,
    private afipComprobanteService: AfipComprobanteService, private ventaTipoItemService: VentaTipoItemService, private viajeRemitoServicio: ViajeRemitoService,
    private ordenVentaServicio: OrdenVentaService, private viajePropioTramoService: ViajePropioTramoService, private viajeTerceroTramoServicio: ViajeTerceroTramoService,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ventaItemConceptoService: VentaItemConceptoService, private alicuotasIvaService: AfipAlicuotaIvaService
    ) {}
  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.factura.formulario; // formulario general (engloba los demás)
    this.formularioItem= this.factura.formularioViaje; // formulario para los item de tabla
    this.formularioCR= this.factura.formularioContraReembolso; // formulario para contrareembolso
    this.reestablecerFormulario(undefined);
    //Lista los puntos de venta 
    this.listarPuntoVenta();
    //Lista los items
    this.listarItems();
    //Lista las alicuotas afip iva
    this.listarAlicuotaIva();
    //Carga el tipo de comprobante
    this.tipoComprobanteservice.obtenerPorId(1).subscribe(
      res=>{
        this.formulario.get('tipoComprobante').setValue(res.json());
        this.tipoComprobante.setValue(this.formulario.get('tipoComprobante').value.nombre);
      }
    )
    //Autcompletado - Buscar por Remitente
    this.formulario.get('clienteRemitente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosReminentes = res;
        })
      }
    });
    //Autcompletado - Buscar por Destinatario
    this.formulario.get('clienteDestinatario').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosDestinatarios = res;
        })
      }
    });
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntoVenta(){
    this.puntoVentaService.listarPorEmpresaYSucursal(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id, 1).subscribe(
      res=>{
        this.resultadosPuntoVenta= res.json();
        this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0].puntoVenta);
      }
    );
  }
  //Obtiene la lista de Items
  public listarItems(){
    this.ventaTipoItemService.listarItems().subscribe(
      res=>{
        this.resultadosItems= res.json();
      }
    );
  }
  //Maneja el cambio en el combo Items
  public cambioItem(){
    this.resetearItem();
    this.formularioItem.get('ventaTipoItem').setValue(this.item.value);
    switch(this.item.value.id){
      case 4: //el item con id=4 es Contrareembolso
        this.manejarContrareembolso();
      break;

      case 1: 
      case 2:
        this.resetearItem();
        this.abrirDialogoTramo();
        this.manejarItems();
        break;

      case 4: 
      case 5:
        this.manejarItems();
        break;
    }
  }
  //Con cada click sobre la lista "Item *" se debe resetear 
  private resetearItem(){

    this.formulario.get('rem').reset();
    this.formulario.get('clienteRemitente').setValue(null);
    this.formulario.get('des').reset();
    this.formulario.get('clienteDestinatario').setValue(null);
    this.formulario.get('clienteDestinatario').reset();
    this.formulario.get('pagoEnOrigen').reset();
    this.formulario.get('letra').reset();
    this.formulario.get('numero').reset();
    this.formulario.get('codigoAfip').reset();
    if(this.formularioItem!=null){
      this.reestablecerFormularioItemViaje();
    }
    
  }
  //Maneja los cambios cuando el item seleccionado es Contrareembolso
  private manejarContrareembolso(){
    this.soloLecturaCR = false;
      this.soloLectura=true;
      this.formularioItem.get('viajeRemito').disable();
      this.formularioItem.get('ordenVenta').disable();
      this.formularioItem.get('conceptosVarios').disable();
      this.formularioItem.get('importeVentaItemConcepto').disable();
      this.formularioItem.get('alicuotaIva').disable();
      this.formularioCR.get('ordenVenta').enable();
      this.formularioCR.get('alicuotaIva').enable();
      this.formularioCR.get('item').setValue(this.formularioItem.get('ventaTipoItem').value);
      this.formularioItem.get('ventaTipoItem').setValue(null); //reestablece
      setTimeout(function() {
        document.getElementById('idContraReembolso').focus();
      }, 20);
  }
  //Maneja los cambios cuando el item seleccionado es diferente de Contrareembolso
  private manejarItems(){
    this.soloLecturaCR = true;
    this.soloLectura=false;
    this.formularioItem.get('viajeRemito').enable();
    this.formularioItem.get('ordenVenta').enable();
    this.formularioItem.get('conceptosVarios').enable();
    this.formularioItem.get('importeVentaItemConcepto').enable();
    this.formularioItem.get('alicuotaIva').enable();
    this.formularioCR.get('ordenVenta').disable();
    this.formularioCR.get('alicuotaIva').disable();
    this.listarConceptos();
    // setTimeout(function() {
    //   document.getElementById('idViaje').focus();
    // }, 20);
  }
  //Abre el dialogo para seleccionar un Tramo
  public abrirDialogoTramo(): void {
    const dialogRef = this.dialog.open(ViajeDialogo, {
      width: '1200px',
      data: {
        tipoItem: this.item.value.id //le pasa 1 si es propio, 2 si es de tercero
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      //setea los valores en cliente remitente
      console.log(resultado);
      this.formulario.get('clienteRemitente').setValue(resultado.remito.clienteRemitente);
      this.listarSucursalesRemitente();
      this.formulario.get('rem.sucursal').setValue(resultado.remito.clienteRemitente.sucursalLugarPago);
      //setea los valores en cliente destinatario
      this.formulario.get('clienteDestinatario').setValue(resultado.remito.clienteDestinatario);
      this.listarSucursalesDestinatario();
      this.formulario.get('des.sucursal').setValue(resultado.remito.clienteDestinatario.sucursalLugarPago);      
      //Setea los valores en el formulario item
      this.formularioItem.get('viajeRemito').setValue(resultado.remito);
      this.formularioItem.get('bultos').setValue(resultado.remito.bultos);
      this.formularioItem.get('kilosEfectivo').setValue(resultado.remito.kilosEfectivo);
      this.formularioItem.get('kilosAforado').setValue(resultado.remito.kilosAforado);
      this.formularioItem.get('m3').setValue(resultado.remito.m3);
      this.formularioItem.get('valorDeclarado').setValue(resultado.remito.valorDeclarado);
      this.formularioItem.get('importeRetiro').setValue(resultado.remito.importeRetiro);
      this.formularioItem.get('importeEntrega').setValue(resultado.remito.importeEntrega);
      this.formularioItem.get('numeroViaje').setValue(resultado.viaje);
      this.formularioItem.get('viajeRemito').setValue(resultado.remito.id);
      setTimeout(function() {
        document.getElementById('idPagoOrigen').focus();
      }, 20);
      // this.listarRemitos();
    });
    //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
    // this.viajePropioTramoService.listarTramos(this.formularioItem.get('numeroViaje').value).subscribe(
    //   res=>{
    //     const dialogRef = this.dialog.open(ViajeDialogo, {
    //       width: '1200px',
    //       data: {
    //         tipoItem: this.formularioItem.get('ventaTipoItem').value.id, //le pasa 1 si es propio, 2 si es de tercero
    //         idViaje: this.formularioItem.get('numeroViaje').value
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(resultado => {
    //       this.formularioItem.get('idTramo').setValue(resultado);
    //       setTimeout(function() {
    //         document.getElementById('idRemito').focus();
    //       }, 20);
    //       this.listarRemitos();
    //     });
    //   },
    // err=>{
    //   this.toastr.error("No existen Tramos para el N° de viaje ingresado.");
    // }
    // );
  }
  //Obtiene el listado de Sucursales por Remitente
  public listarSucursalesRemitente() {
    this.formulario.get('rem.domicilio').setValue(this.formulario.get('clienteRemitente').value.domicilio);
    this.formulario.get('rem.localidad').setValue(this.formulario.get('clienteRemitente').value.localidad.nombre);
    this.formulario.get('rem.condicionVenta').setValue(this.formulario.get('clienteRemitente').value.condicionVenta.nombre);
    this.formulario.get('rem.afipCondicionIva').setValue(this.formulario.get('clienteRemitente').value.afipCondicionIva.nombre);
    this.sucursalService.listarPorCliente(this.formulario.get('clienteRemitente').value.id).subscribe(
      res => {
        this.resultadosSucursalesRem = res.json();
        console.log(res.json());
        this.formulario.get('rem.sucursal').setValue(this.resultadosSucursalesRem[0]);
      },
      err => {
        this.toastr.error("El Remitente no tiene asignada una sucursal de entrega.");
      }
    );
  }
  //Obtiene el listado de Sucursales por Remitente
  public listarSucursalesDestinatario() {
    this.formulario.get('des.domicilio').setValue(this.formulario.get('clienteDestinatario').value.domicilio);
    this.formulario.get('des.localidad').setValue(this.formulario.get('clienteDestinatario').value.localidad.nombre);
    this.formulario.get('des.condicionVenta').setValue(this.formulario.get('clienteDestinatario').value.condicionVenta.nombre);
    this.formulario.get('des.afipCondicionIva').setValue(this.formulario.get('clienteDestinatario').value.afipCondicionIva.nombre);
    this.sucursalService.listarPorCliente(this.formulario.get('clienteDestinatario').value.id).subscribe(
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
  //Reestablece el formulario completo
  public reestablecerFormulario(id){
    this.resultadosReminentes = [];
    this.resultadosDestinatarios = []; 
    this.resultadosSucursalesRem = [];
    this.resultadosSucursalesDes = [];   
    this.resultadosRemitos = [];
    this.autocompletado.setValue(undefined);
    this.formulario.reset(); 
    this.soloLectura= true;
    this.soloLecturaCR = true;
    this.empresa.setValue(this.appComponent.getEmpresa());
    this.formularioItem.get('viajeRemito').disable();
    this.formularioItem.get('ordenVenta').disable();
    this.formularioItem.get('conceptosVarios').disable();
    this.formularioItem.get('importeVentaItemConcepto').disable();
    this.formularioItem.get('alicuotaIva').disable();
    this.formularioCR.get('ordenVenta').disable();
    this.formularioCR.get('alicuotaIva').disable();
    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fechaEmision').setValue(res.json());
      this.formulario.get('fechaVtoPago').setValue(res.json());
      this.fechaActual= res.json();
    });
    setTimeout(function() {
      document.getElementById('idFecha').focus();
    }, 20);
  }
  //Reestablecer formulario item-viaje
  public reestablecerFormularioItemViaje(){
    this.formularioItem.get('viajeRemito').reset();
    this.formularioItem.get('bultos').reset();
    this.formularioItem.get('kilosEfectivo').reset();
    this.formularioItem.get('kilosAforado').reset();
    this.formularioItem.get('m3').reset();
    this.formularioItem.get('descripcionCarga').reset();
    this.formularioItem.get('valorDeclarado').reset();
    this.formularioItem.get('flete').reset();
    this.formularioItem.get('descuento').reset();
    this.formularioItem.get('importeSeguro').reset();
    this.formularioItem.get('importeRetiro').reset();
    this.formularioItem.get('importeEntrega').reset();
    this.formularioItem.get('importeVentaItemConcepto').reset();
    this.formularioItem.get('importeNetoGravado').reset();
    this.formularioItem.get('alicuotaIva').reset();
    this.formularioItem.get('ordenVenta').reset();
    this.formularioItem.get('conceptosVarios').reset();
    this.formularioItem.get('importeVentaItemConcepto').reset();
    this.soloLectura= false;
    setTimeout(function() {
      document.getElementById('idRemito').focus();
    }, 20);
  }
  //Reestablecer formulario ContraReembolso
  public reestablecerFormularioCR(){
    this.formularioCR.get('item').disable();
    this.formularioCR.get('importeContraReembolso').disable();
    this.formularioCR.get('ordenVenta').disable();
    this.formularioCR.get('alicuotaIva').disable();
    this.formularioCR.get('pComision').disable();
    this.soloLecturaCR= false;
    setTimeout(function() {
      document.getElementById('idItem').focus();
    }, 20);
  }
  //Controla que un remito agregado a la tabla no se pueda volver a seleccionar
  public remitosDisponibles(opcion, remito){
    //opcion = 1 (saca de la lista de Remitos) opcion = 2 (agrega a la lista de Remitos) 
    switch(opcion){
      case 1:
        for(let i=0; i< this.resultadosRemitos.length; i++){
          if(remito.id==this.resultadosRemitos[i].id){
            this.resultadosRemitos.splice(i, 1);
          }
        }
        break;
      case 2:
        this.resultadosRemitos.push(remito);
        break;
    }
  }
  //Controla que un item CR agregado no se pueda volver a seleccionar (solo puede haber un contra reembolso)
  public itemsDisponibles(opcion, item){
    //opcion = 1 (saca de la lista de Remitos) opcion = 2 (agrega a la lista de Remitos) 
    switch(opcion){
      case 1:
        for(let i=0; i< this.resultadosItems.length; i++){
          if(item.id==this.resultadosItems[i].id){
            this.resultadosItems.splice(i, 1);
          }
        }
        break;
      case 2:
        this.resultadosItems.push(item);
        break;
    }
  }
  //Controla los checkbox
  public pagoEnOrigen(){
    if(this.formulario.get('pagoEnOrigen').value==true){
      document.getElementById('Remitente').className="border has-float-label pagaSeleccionado";
      document.getElementById('Destinatario').className="border has-float-label";
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteRemitente').value.afipCondicionIva);
      this.formulario.get('cliente').setValue(this.formulario.get('clienteRemitente').value);
      this.afipComprobanteService.obtenerLetra(this.formulario.get('clienteRemitente').value.afipCondicionIva.id, 1).subscribe(
        res=>{
          this.formulario.get('letra').setValue(res.text());
          this.cargarCodigoAfip(res.text());  
          this.listarTarifaOVenta();

        }
      )
    }
    else{
      document.getElementById('Remitente').className="border has-float-label";
      document.getElementById('Destinatario').className="border has-float-label pagaSeleccionado";
      this.formulario.get('afipCondicionIva').setValue(this.formulario.get('clienteDestinatario').value.afipCondicionIva);
      this.formulario.get('cliente').setValue(this.formulario.get('clienteDestinatario').value);
      this.afipComprobanteService.obtenerLetra(this.formulario.get('clienteDestinatario').value.afipCondicionIva.id, 1).subscribe(
        res=>{
          this.formulario.get('letra').setValue(res.text());
          this.cargarCodigoAfip(res.text());
          this.listarTarifaOVenta();

        }
      )
    };
  }
  //Setea el codigo de Afip por el tipo de comprobante y la letra
  public cargarCodigoAfip(letra){
    this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('tipoComprobante').value.id, letra).subscribe(
      res=>{
        this.formulario.get('codigoAfip').setValue(res.text());
        this.cargarNumero(res.text());
      }
    );
  }
  //Setea el numero por el punto de venta y el codigo de Afip
  public cargarNumero(codigoAfip){
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res=>{
        this.formulario.get('numero').setValue(res.text());
      }
    );
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public comprobarCodAfip(){
    if(this.formulario.get('codigoAfip').value!=null || this.formulario.get('codigoAfip').value>0)
      this.cargarNumero(this.formulario.get('codigoAfip').value);
  }
  //Agrega al Array un item-viaje 
  public agregarItemViaje(){
    console.log(this.formulario.value, this.formularioItem.value, this.formularioItem.get('importeNetoGravado').value);
    let subtotal=0;
    subtotal=this.formularioItem.get('importeNetoGravado').value;
    this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value + subtotal);
    let importeIva=0;
    if(this.formularioItem.get('alicuotaIva').value==0||this.formularioItem.get('alicuotaIva').value==null){
      this.formularioItem.get('subtotalCIva').setValue(0);
    }
    else{
      importeIva =subtotal*(this.formularioItem.get('alicuotaIva').value/100);
      this.formularioItem.get('subtotalCIva').setValue(this.returnDecimales(importeIva, 2) ); //guardo en cada item el importe extra (iva)
      let importeIvaTotal= this.formulario.get('importeIva').value + importeIva;
      this.formulario.get('importeIva').setValue(this.returnDecimales(importeIvaTotal, 2)); //sumo en el formulario general (cabecera de la factura)
    }
    this.listaItemViaje.push(this.formularioItem.value);
    this.contador.setValue(this.contador.value+1);
    let importeTotal= this.formulario.get('importeNetoGravado').value + this.formulario.get('importeIva').value;
    this.formulario.get('importeTotal').setValue(this.returnDecimales(importeTotal, 2));
    this.reestablecerFormularioItemViaje();
    this.remitosDisponibles(1, this.listaItemViaje[this.listaItemViaje.length-1].viajeRemito);
  }
  //eliminar un item del Array item-viaje 
  public eliminarItemViaje(subtotal, subtotalIva, index){
    this.listaItemViaje.splice(index, 1);
    console.log(subtotal, subtotalIva);
    if(this.listaItemViaje.length==0){
      this.formulario.get('importeNetoGravado').setValue(0.00);
      this.formulario.get('importeIva').setValue(0.00);
      this.formulario.get('importeTotal').setValue(0.00);
    }else{
      this.formulario.get('importeNetoGravado').setValue(this.returnDecimales(this.formulario.get('importeNetoGravado').value - subtotal, 2));
      this.formulario.get('importeIva').setValue(this.returnDecimales(this.formulario.get('importeIva').value - subtotalIva, 2));
      let importeTotal=subtotal + subtotalIva;
      this.formulario.get('importeTotal').setValue(this.returnDecimales(this.formulario.get('importeTotal').value - importeTotal, 2));
      this.remitosDisponibles(2, this.listaItemViaje[index].viajeRemito);
    }
    this.contador.setValue(this.contador.value-1);
    setTimeout(function() {
      document.getElementById('idItem').focus();
    }, 20);
  }
  //Agrega un Contra Reembolso
  public agregarCR(){
    if(this.formularioCR.get('importeContraReembolso').value>0||this.formularioCR.get('importeContraReembolso').value!=null){
      this.listaCR.push(this.formularioCR.value);
      this.reestablecerFormularioCR();
      let importeIva=0;
      if(this.formularioCR.get('alicuotaIva').value==0||this.formularioCR.get('alicuotaIva').value==null){
        this.formularioCR.get('subtotalCIva').setValue(0);
      }
      else{
        importeIva = this.formularioCR.get('importeContraReembolso').value*(this.formularioCR.get('alicuotaIva').value.alicuota/100);
        this.formularioCR.get('subtotalCIva').setValue(importeIva); //guardo en cada item el importe extra (iva)
        let importeIvaTotal= this.formulario.get('importeIva').value + importeIva;
        this.formulario.get('importeIva').setValue(importeIvaTotal); //sumo en el formulario general (cabecera de la factura)
      }
      this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value + this.formularioCR.get('importeContraReembolso').value);
      let importeTotal= this.formulario.get('importeNetoGravado').value + this.formulario.get('importeIva').value;
      this.formulario.get('importeTotal').setValue(importeTotal.toFixed(2));
      this.itemsDisponibles(1, this.listaCR[this.listaCR.length-1].item);
    }
  }
  //Elimina un Contra Reembolso
  public eliminarCR(){
    this.soloLecturaCR = false;
    this.formularioCR.get('ordenVenta').disable();
    this.formularioCR.get('alicuotaIva').disable();
    let subtotal=this.formularioCR.get('importeContraReembolso').value;
    let subtotalIva=this.formularioCR.get('subtotalCIva').value;
    this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value - subtotal);
    this.formulario.get('importeIva').setValue(this.formulario.get('importeIva').value - subtotalIva);
    let importeTotal=subtotal + subtotalIva;
    this.formulario.get('importeTotal').setValue(this.formulario.get('importeTotal').value - importeTotal);
    this.formularioCR.reset();
    this.itemsDisponibles(2, this.listaCR[0].item);
    this.listaCR.splice(0, 1);
  }
  //Habilita y carga los campos una vez que se selecciono el item
  public habilitarCamposItem(){
    if(this.formularioItem.get('ventaTipoItem').value.id==4){ //el item con id=4 es Contrareembolso
      this.soloLecturaCR = false;
      this.soloLectura=true;
      this.formularioItem.get('viajeRemito').disable();
      this.formularioItem.get('ordenVenta').disable();
      this.formularioItem.get('conceptosVarios').disable();
      this.formularioItem.get('importeVentaItemConcepto').disable();
      this.formularioItem.get('alicuotaIva').disable();
      this.formularioCR.get('ordenVenta').enable();
      this.formularioCR.get('alicuotaIva').enable();
      this.formularioCR.get('item').setValue(this.formularioItem.get('ventaTipoItem').value);
      this.formularioItem.get('ventaTipoItem').setValue(null); //reestablece
      setTimeout(function() {
        document.getElementById('idContraReembolso').focus();
      }, 20);
    }else{
      this.soloLecturaCR = true;
      this.soloLectura=false;
      this.formularioItem.get('viajeRemito').enable();
      this.formularioItem.get('ordenVenta').enable();
      this.formularioItem.get('conceptosVarios').enable();
      this.formularioItem.get('importeVentaItemConcepto').enable();
      this.formularioItem.get('alicuotaIva').enable();
      this.formularioCR.get('ordenVenta').disable();
      this.formularioCR.get('alicuotaIva').disable();
      this.listarConceptos();
      setTimeout(function() {
        document.getElementById('idViaje').focus();
      }, 20);
    }
  }
  // Habilita el campo Precio de Concepto Venta
  public habilitarPrecioCV(){
    this.formularioItem.get('importeVentaItemConcepto').enable();
  }
  //Obtiene la lista de Tarifas Orden Venta por Cliente
  public listarTarifaOVenta(){
    console.log(this.formulario.get('pagoEnOrigen').value, this.formulario.get('clienteRemitente').value.id);
    if(this.formulario.get('pagoEnOrigen').value==true) //si paga el remitente
    {
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('clienteRemitente').value.id).subscribe(
        res=>{
          this.resultadosTarifas = res.json();
          if(this.resultadosTarifas.length==0)
            this.listarTarifasOVentaEmpresa();
        }
      );
    }
    else{ //si paga el destinatario
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('clienteDestinatario').value.id).subscribe(
        res=>{
          this.resultadosTarifas = res.json();
          if(this.resultadosTarifas.length==0)
            this.listarTarifasOVentaEmpresa();
        }
      )
    }
  }
  //Obtiene una lista de Conceptos Varios
  public listarConceptos(){
    this.ventaItemConceptoService.listarPorTipoComprobante(1).subscribe(
      res=>{
        this.resultadosConceptosVarios = res.json();
      }
    );
  }
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva(){
    this.alicuotasIvaService.listarActivas().subscribe(
      res=>{
        this.resultadosAlicuotasIva = res.json();
        for(let i=0; i<this.resultadosAlicuotasIva.length; i++){
          if(this.resultadosAlicuotasIva[i].porDefecto==true){
            this.formularioItem.get('alicuotaIva').setValue(this.resultadosAlicuotasIva[i].alicuota);
            this.formularioItem.get('afipAlicuotaIva').setValue(this.resultadosAlicuotasIva[i]);
            //para el formulario del Contrareembolso 
            this.formularioCR.get('alicuotaIva').setValue(this.resultadosAlicuotasIva[i].alicuota);
          }
        }
      }
    );
  }
  //Obtiene la lista de Tarifas Orden Venta por Empresa cuando en el Cliente no tiene asignada una lista de Orden Venta
  public listarTarifasOVentaEmpresa(){
    this.ordenVentaServicio.listar().subscribe(
      res=>{
        this.resultadosTarifas = res.json();
      }
    )
  }
  // //Abre el dialogo para seleccionar un Tramo
  // public abrirDialogoTramo(): void {
  //   //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
  //   this.viajePropioTramoService.listarTramos(this.formularioItem.get('numeroViaje').value).subscribe(
  //     res=>{
  //       const dialogRef = this.dialog.open(ViajeDialogo, {
  //         width: '1200px',
  //         data: {
  //           tipoItem: this.formularioItem.get('ventaTipoItem').value.id, //le pasa 1 si es propio, 2 si es de tercero
  //           idViaje: this.formularioItem.get('numeroViaje').value
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe(resultado => {
  //         this.formularioItem.get('idTramo').setValue(resultado);
  //         setTimeout(function() {
  //           document.getElementById('idRemito').focus();
  //         }, 20);
  //         this.listarRemitos();
  //       });
  //     },
  //   err=>{
  //     this.toastr.error("No existen Tramos para el N° de viaje ingresado.");
  //   }
  //   );
  // }
  //Obtiene la Lista de Remitos por el id del tramo seleccionado
  public listarRemitos(){
    this.viajeRemitoServicio.listarRemitos(this.formularioItem.get('idTramo').value.id, this.formularioItem.get('ventaTipoItem').value.id).subscribe(
      res=>{
        this.resultadosRemitos = res.json();
        if(this.resultadosRemitos.length==0){
          this.toastr.error("No existen Remitos para el Tramo seleccionado.");
          this.formularioItem.get('idTramo').setValue(null);
          this.formularioItem.get('numeroViaje').setValue(null);
          setTimeout(function() {
            document.getElementById('idViaje').focus();
          }, 20);
        }else{
          this.formularioItem.get('idTramo').setValue(this.resultadosRemitos[0].id);
        }
      },
      err=>{
        this.formularioItem.get('idTramo').setValue(null);
        this.formularioItem.get('numeroViaje').setValue(null);
        setTimeout(function() {
          document.getElementById('idViaje').focus();
        }, 20);
      }
    );
  }
  //Completa los input segun el remito seleccionado
  public cambioRemito(){
    this.formularioItem.get('kilosAforado').setValue(this.formularioItem.get('viajeRemito').value.kilosAforado);
    this.formularioItem.get('kilosEfectivo').setValue(this.formularioItem.get('viajeRemito').value.kilosEfectivo);
    this.formularioItem.get('bultos').setValue(this.formularioItem.get('viajeRemito').value.bultos);
    this.formularioItem.get('m3').setValue(this.formularioItem.get('viajeRemito').value.m3);
    this.formularioItem.get('valorDeclarado').setValue(this.formularioItem.get('viajeRemito').value.valorDeclarado);
    this.formularioItem.get('importeEntrega').setValue(this.formularioItem.get('viajeRemito').value.importeEntrega);
    this.formularioItem.get('importeRetiro').setValue(this.formularioItem.get('viajeRemito').value.importeRetiro);
  }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada 
  public cambioOVta(){
    this.formularioItem.get('importeSeguro').setValue(this.formularioItem.get('ordenVenta').value.seguro);
    this.obtenerPrecioFlete();
  }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada en Contra Reembolso
  public cambioOVtaCR(){
    this.formularioCR.get('porcentajeCC').setValue(this.formularioCR.get('ordenVenta').value.comisionCR);
    let comision=(this.formularioCR.get('porcentajeCC').value/100)*this.formularioCR.get('importeContraReembolso').value;
    this.formularioCR.get('pComision').setValue(comision);
  }
  //Obtiene el Precio del Flete seleccionado
  public obtenerPrecioFlete(){
    let tipoTarifa = this.formularioItem.get('ordenVenta').value.tipoTarifa.id;
    let idOrdenVta = this.formularioItem.get('ordenVenta').value.id;
    let respuesta;
    switch(tipoTarifa){
      case 1:
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioItem.get('bultos').value).subscribe(
          res=>{
            respuesta = res.json();
            this.formularioItem.get('flete').setValue(respuesta);
          }
        );
        break;
      case 2:
        let kgMayor;
        if(this.formularioItem.get('kilosEfectivo').value>this.formularioItem.get('kilosAforado').value)
          kgMayor= this.formularioItem.get('kilosEfectivo').value;
        else
          kgMayor= this.formularioItem.get('kilosAforado').value;
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, kgMayor).subscribe(
          res=>{
            respuesta = res.json();
            this.formularioItem.get('flete').setValue(respuesta);
          }
        );
        break;
      case 3:
        let toneladas;
        if(this.formularioItem.get('kilosEfectivo').value>this.formularioItem.get('kilosAforado').value)
          toneladas= this.formularioItem.get('kilosEfectivo').value;
        else
          toneladas= this.formularioItem.get('kilosAforado').value;
        toneladas = toneladas/1000;
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, toneladas).subscribe(
          res=>{
            respuesta = res.json();
            this.formularioItem.get('flete').setValue(respuesta);
          }
        );  
        break;
      case 4:
        this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioItem.get('m3').value).subscribe(
          res=>{
            respuesta = res.json();
            this.formularioItem.get('flete').setValue(respuesta);
          }
        );
        break;
    }
  }
  //Calcular el Subtotal del item agregado
  public calcularSubtotal($event){
    let subtotal=0;
    this.formulario.get('importeNoGravado').setValue(0.00);
    this.formulario.get('importeOtrosTributos').setValue(0.00);
    this.formulario.get('importeExento').setValue(0.00);
    this.formularioItem.get('importeNetoGravado').setValue(subtotal);
    let vdeclaradoNeto = this.formularioItem.get('valorDeclarado').value*(this.formularioItem.get('importeSeguro').value/1000);
    let descuento = this.formularioItem.get('descuento').value;
    let flete = this.formularioItem.get('flete').value;
    if(descuento>0){
      flete = flete-flete*(descuento/100); //valor neto del flete con el descuento
      this.formularioItem.get('importeFlete').setValue(flete);
    }else{
      this.formularioItem.get('importeFlete').setValue(flete);
    }
    let retiro = this.formularioItem.get('importeRetiro').value;
    let entrega = this.formularioItem.get('importeEntrega').value;
    let concepto = this.formularioItem.get('importeVentaItemConcepto').value;
    subtotal = vdeclaradoNeto + flete + retiro + entrega + concepto;
    console.log("subtotal: " + this.returnDecimales(subtotal, 2));
    this.formularioItem.get('importeNetoGravado').setValue(this.returnDecimales(subtotal, 2));
    this.setDecimales($event, 2);
  }
  //Abre un modal para agregar un aforo
  public agregarAforo(): void {
    const dialogRef = this.dialog.open(AforoComponent, {
      width: '1200px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(resultado => {
      this.formularioItem.get('kilosAforado').setValue(resultado);
    });
  }
  //Abre un modal ver la nota Impresion Comprobante del cliente que paga
  public abrirObervacion(): void {
    let nota; //guarad la nota de impresion comprobante
    if(this.formulario.get('pagoEnOrigen').value==true){
      nota= this.formulario.get('clienteRemitente').value.notaImpresionComprobante;
    }
    else{
      nota= this.formulario.get('clienteDestinatario').value.notaImpresionComprobante;
    }
    const dialogRef = this.dialog.open(ObservacionDialogo, {
      width: '1200px',
      data: { nota: nota }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalCarga(): void {
    const dialogRef = this.dialog.open(TotalCargaDialogo, {
      width: '1200px',
      data: { items: this.listaItemViaje }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //Abre un modal ver los Totales de Carga
  public abrirTotalConcepto(): void {
    const dialogRef = this.dialog.open(TotalConceptoDialogo, {
      width: '1200px',
      data: { items: this.listaItemViaje }
    });
    dialogRef.afterClosed().subscribe(resultado => {
    });
  }
  //METODO PRINCIPAL - EMITE LA FACTURA
  public emitirFactura(){
    let afipConcepto = this.listaItemViaje[0].ventaTipoItem.afipConcepto.id; //guardamos el id de afipConcepto del primer item de la tabla
    this.formulario.get('afipConcepto').setValue({
      id: afipConcepto
    });
    this.formulario.get('importeSaldo').setValue(this.formulario.get('importeTotal').value);
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('esCAEA').setValue(this.appComponent.getEmpresa().feCAEA);
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    this.formulario.get('ventaComprobanteItemFAs').setValue(this.listaItemViaje);
    this.formulario.get('ventaComprobanteItemCR').setValue(this.listaCR);
    this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0].puntoVenta);
    console.log(this.formulario.value);
    this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
      res=>{
        let respuesta= res.json();
        document.getElementById("idFecha").classList.add('label-error');
        document.getElementById("idFecha").classList.add('is-invalid');
        document.getElementById("idFecha").focus();
        this.toastr.success(respuesta.mensaje);
      },
      err=>{
        var respuesta = err.json();
        document.getElementById("idFecha").classList.add('label-error');
        document.getElementById("idFecha").classList.add('is-invalid');
        document.getElementById("idFecha").focus();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.setDecimales(valor, cantidad);
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
@Component({
  selector: 'viaje-dialogo',
  templateUrl: 'viaje-dialogo.html',
  styleUrls: ['./emitir-factura.component.css']

})
export class ViajeDialogo{
  //Define la empresa 
  public empresa: string;
  //Define el Tram y Remito
  public tramo: any;
  public remito: any;
  //Define la lista de remitos
  public resultadosRemitos = [];
  //Define la lista de tramos
  public resultadosTramos = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  constructor(public dialogRef: MatDialogRef<ViajeDialogo>, @Inject(MAT_DIALOG_DATA) public data,
  private viajePropioTramoService: ViajePropioTramoService, private viajeTerceroTramoServicio: ViajeTerceroTramoService,
  private viajeRemitoServicio: ViajeRemitoService, private toastr: ToastrService) {}
   ngOnInit() {
     this.formulario = new FormGroup({
       viaje: new FormControl('', Validators.required),
       remito: new FormControl('', Validators.required),
       tramo: new FormControl('', Validators.required)
     });
   }
   //obtiene la lista de tramos por tipo y por el idViaje 
   public listarTramos(){
     let item = this.data.tipoItem;
    if(item==1){
      this.viajePropioTramoService.listarTramos(this.formulario.get('viaje').value).subscribe(
        res=>{
          let respuesta= res.json();
          this.resultadosTramos= respuesta[0].viajeRemitos;
          this.formulario.get('tramo').setValue(respuesta[0].tramo);
          this.tramo = respuesta[0].tramo;
        }
      );
    }
    if(item==2){
      this.viajeTerceroTramoServicio.listarTramos(this.formulario.get('viaje').value).subscribe(
        res=>{
          let respuesta= res.json();
          this.resultadosTramos= respuesta[0].viajeRemitos;
          this.formulario.get('tramo').setValue(respuesta[0].tramo);
          this.tramo = respuesta[0].tramo;        }
      );
    }
   }
  //Controla la seleccion en tabla
  public cambioRemito(idFila ,remito){
    let fila='fila'+idFila;
    let filaSeleccionada=document.getElementsByClassName('planilla-seleccionada');
    for(let i=0; i< filaSeleccionada.length; i++){
      filaSeleccionada[i].className="planilla-no-seleccionada";
    }
    document.getElementById(fila).className="planilla-seleccionada";
    console.log("remito seleccionado "+ remito);
    this.formulario.get('remito').setValue(remito);
  }
  //Obtiene la Lista de Remitos por el id del tramo seleccionado
  // public listarRemitos(item){
  //   this.viajeRemitoServicio.listarRemitos(this.formulario.get('tramo').value.id, item).subscribe(
  //     res=>{
  //       this.resultadosRemitos = res.json();
  //       if(this.resultadosRemitos.length==0){
  //         this.toastr.error("No existen Remitos para el Tramo seleccionado.");
  //         // setTimeout(function() {
  //         //   document.getElementById('idViaje').focus();
  //         // }, 20);
  //       }else{
  //         this.formulario.get('tramo').setValue(this.resultadosRemitos[0].id);
  //       }
  //     },
  //     err=>{
  //       // this.formularioItem.get('idTramo').setValue(null);
  //       // this.formularioItem.get('numeroViaje').setValue(null);
  //       // setTimeout(function() {
  //       //   document.getElementById('idViaje').focus();
  //       // }, 20);
  //     }
  //   );
  // }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'observacion-dialogo',
  templateUrl: 'observacion-dialogo.html',
})
export class ObservacionDialogo{
  //Define la notaImpresionComprobante
  public observacion:string;
  //Define el check
  public check:boolean=false;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  constructor(public dialogRef: MatDialogRef<ObservacionDialogo>, @Inject(MAT_DIALOG_DATA) public data) {}
   ngOnInit() {
     this.formulario = new FormGroup({});
     this.observacion = this.data.nota;
  }      
  //Controla los checkbox
  public agregarObs($event){
    if($event.checked==true){
      this.check=true;
      document.getElementById('check').className="checkBoxSelected";
    }
    else{
      this.check=false;
      document.getElementById('check').className="checkBoxNotSelected";
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'total-carga-dialogo',
  templateUrl: 'total-carga-dialogo.html',
})
export class TotalCargaDialogo{
  //Define el check
  public check:boolean=false;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  constructor(public dialogRef: MatDialogRef<TotalCargaDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
   private servicio: ClienteService) {}
   ngOnInit() {
     this.formulario = new FormGroup({});
     this.listaCompleta = this.data.items;
  } 
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'total-concepto-dialogo',
  templateUrl: 'total-concepto-dialogo.html',
})
export class TotalConceptoDialogo{
  //Define el check
  public check:boolean=false;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  constructor(public dialogRef: MatDialogRef<TotalConceptoDialogo>, @Inject(MAT_DIALOG_DATA) public data) {}
   ngOnInit() {
     this.formulario = new FormGroup({});
     this.listaCompleta = this.data.items;
  } 
  onNoClick(): void {
    this.dialogRef.close();
  }
}