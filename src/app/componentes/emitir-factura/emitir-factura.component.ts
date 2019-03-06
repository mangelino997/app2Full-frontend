import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
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
import { ViajePropioService } from 'src/app/servicios/viaje-propio.service';
import { ViajePropioTramoService } from 'src/app/servicios/viaje-propio-tramo.service';
import { ViajeTerceroTramoService } from 'src/app/servicios/viaje-tercero-tramo.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { AforoComponent } from '../aforo/aforo.component';


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
  //Define la lista de items
  public resultadosItems = [];
  //Define la lista de Remitos
  public resultadosRemitos = [];
  //Define la lista de Tarifas O. Vta.
  public resultadosTarifas = [];
  //Define la lista de Conceptos Varios
  public resultadosConceptosVarios = [];
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual:string=null;
  //Define el array de los items-viajes para la tabla
  public listaItemViaje:Array<any> = [];
  //Define si los campos son de solo lectura
  public soloLectura:boolean= true;
  //Define si los campos que dependen de tarifa Orden Venta son de solo lectura
  public soloLecturaOrden:boolean= true;
  //Define los datos de la Empresa
  public empresa:FormControl = new FormControl();
  //Define el importeTotal como la suma de cada subtotal de cada item
  public subtotalSuma:FormControl = new FormControl();
  //Cuenta la cantidad de items agregados a la lista
  public contador:FormControl = new FormControl();
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  constructor(
    private appComponent: AppComponent, public dialog: MatDialog, private fechaService: FechaService,
    public clienteService: ClienteService, private toastr: ToastrService, private factura: EmitirFactura, private appService: AppService, 
    private sucursalService: SucursalClienteService, private puntoVentaService: PuntoVentaService, private tipoComprobanteservice: TipoComprobanteService,
    private afipComprobanteService: AfipComprobanteService, private ventaTipoItemService: VentaTipoItemService, private viajeRemitoServicio: ViajeRemitoService,
    private ordenVentaServicio: OrdenVentaService, private viajePropioTramoService: ViajePropioTramoService, private viajeTerceroTramoServicio: ViajeTerceroTramoService,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ventaItemConceptoService: VentaItemConceptoService
    ) {}

  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.factura.formulario;
    this.formularioItem= this.factura.formularioViaje;
    this.reestablecerFormulario(undefined);
    //Lista los puntos de venta 
    this.listarPuntoVenta();
    //Lista los items
    this.listarItems();
    //Lista Tarifa 
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
    // let empresa= this.appComponent.getEmpresa();
    this.puntoVentaService.listarPorEmpresaYSucursal(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id).subscribe(
      res=>{
        this.resultadosPuntoVenta= res.json();
        for(let i=0; i<this.resultadosPuntoVenta.length; i++){
          if(this.resultadosPuntoVenta[i].porDefecto==true){
            this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[i]);
          }
        }
      }
    );
  }
  //Obtiene la lista de Items
  public listarItems(){
    this.ventaTipoItemService.listarItems().subscribe(
      res=>{
        console.log(res.json());
        this.resultadosItems= res.json();
      }
    );
  }
  //Obtiene el listado de Sucursales por Remitente
  public listarSucursalesRemitente() {
    this.formulario.get('rem.domicilio').setValue(this.formulario.get('remitente').value.domicilio);
    this.formulario.get('rem.localidad').setValue(this.formulario.get('remitente').value.localidad.nombre);
    this.formulario.get('rem.condicionVenta').setValue(this.formulario.get('remitente').value.condicionVenta.nombre);
    this.formulario.get('rem.afipCondicionIva').setValue(this.formulario.get('remitente').value.afipCondicionIva.nombre);
    this.sucursalService.listarPorCliente(this.formulario.get('remitente').value.id).subscribe(
      res => {
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
  //Reestablece el formulario completo
  public reestablecerFormulario(id){
    this.resultadosReminentes = [];
    this.resultadosDestinatarios = []; 
    this.resultadosSucursalesRem = [];
    this.resultadosSucursalesDes = [];   
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.soloLectura= true;
    this.soloLecturaOrden=false;
    this.empresa.setValue(this.appComponent.getEmpresa());
    this.formularioItem.get('remito').disable();
    this.formularioItem.get('tarifaOVta').disable();
    this.formularioItem.get('conceptosVarios').disable();
    this.formularioItem.get('importeConcepto').disable();

    this.fechaService.obtenerFecha().subscribe(res=>{
      this.formulario.get('fecha').setValue(res.json());
      this.fechaActual= res.json();
    });
    setTimeout(function() {
      document.getElementById('idFecha').focus();
    }, 20);
  }
  //Reestablecer formulario item-viaje
  public reestablecerFormularioItemViaje(){
    this.resultadosRemitos = [];   
    this.formularioItem.reset();
    this.soloLectura= true;
    this.soloLecturaOrden =false;
    this.formularioItem.get('remito').disable();
    this.formularioItem.get('tarifaOVta').disable();
    this.formularioItem.get('conceptosVarios').disable();
    this.formularioItem.get('importeConcepto').disable();
    setTimeout(function() {
      document.getElementById('idItem').focus();
    }, 20);
    this.formularioItem.get('importeConcepto').disable();

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
    let subtotal=this.formularioItem.get('subtotal').value;
    let subtotalNeto=0;
    if(this.formularioItem.get('alicuotaIva').value==0){
      this.formularioItem.get('subtotalNeto').setValue(subtotal);
    }
    else{
      subtotalNeto = subtotal + subtotal*(this.formularioItem.get('alicuotaIva').value/100)
      this.formularioItem.get('subtotalNeto').setValue(subtotalNeto);
    }
    this.listaItemViaje.push(this.formularioItem.value);
    this.contador.setValue(this.contador.value+1);
    this.subtotalSuma.setValue(this.subtotalSuma.value + this.formularioItem.get('subtotalNeto').value);
    this.reestablecerFormularioItemViaje();
    console.log(this.listaItemViaje);
  }
  //eliminar un item del Array item-viaje 
  public eliminarItemViaje(subtotalNeto, index){
    this.subtotalSuma.setValue(this.subtotalSuma.value - subtotalNeto);  ;
    this.listaItemViaje.splice(index, 1);
    this.contador.setValue(this.contador.value-1);
    setTimeout(function() {
      document.getElementById('idItem').focus();
    }, 20);
  }
  //Habilita y carga los campos una vez que se selecciono el item
  public habilitarCamposItem(){
    this.soloLectura=false;
    this.formularioItem.get('remito').enable();
    this.formularioItem.get('tarifaOVta').enable();
    this.formularioItem.get('conceptosVarios').enable();
    this.listarTarifaOVenta();
    this.listarConceptos();
  }
  // Habilita el campo Precio de Concepto Venta
  public habilitarPrecioCV(){
    this.formularioItem.get('importeConcepto').enable();
  }
  //Obtiene la lista de Tarifas Orden Venta por Cliente
  public listarTarifaOVenta(){
    console.log(this.formulario.value);
    if(this.formulario.get('pagoEnOrigen').value==true) //si paga el remitente
    {
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('remitente').value.id).subscribe(
        res=>{
          this.resultadosTarifas = res.json();
          if(this.resultadosTarifas.length==0)
            this.listarTarifasOVentaEmpresa();
        }
      );
    }
    else{ //si paga el destinatario
      this.ordenVentaServicio.listarPorCliente(this.formulario.get('destinatario').value.id).subscribe(
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
  //Obtiene la lista de Tarifas Orden Venta por Empresa cuando en el Cliente no tiene asignada una lista de Orden Venta
  public listarTarifasOVentaEmpresa(){
    this.ordenVentaServicio.listar().subscribe(
      res=>{
        this.resultadosTarifas = res.json();
      }
    )
  }

  //Abre el dialogo para seleccionar un Tramo
  public abrirDialogoTramo(): void {
    //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
    console.log(this.formularioItem.get('numeroViaje').value);
    this.viajePropioTramoService.listarTramos(this.formularioItem.get('numeroViaje').value).subscribe(
      res=>{
        const dialogRef = this.dialog.open(ViajeDialogo, {
          width: '1200px',
          data: {
            tipoItem: this.formularioItem.get('item').value.id, //le pasa 1 si es propio, 2 si es de tercero
            idViaje: this.formularioItem.get('numeroViaje').value
          }
        });
        dialogRef.afterClosed().subscribe(resultado => {
          console.log(resultado);
          this.formularioItem.get('idTramo').setValue(resultado);
          setTimeout(function() {
            document.getElementById('idRemito').focus();
          }, 20);
          this.listarRemitos();
        });
      },
    err=>{
      this.toastr.error("No existen Tramos para el N° de viaje ingresado.");
    }
    );
    
  }
  //Obtiene la Lista de Remitos por el id del tramo seleccionado
  public listarRemitos(){
    this.viajeRemitoServicio.listarRemitos(this.formularioItem.get('idTramo').value.id, this.formularioItem.get('item').value.id).subscribe(
      res=>{
        console.log(res.json());
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
    this.formularioItem.get('kilosAforado').setValue(this.formularioItem.get('remito').value.kilosAforado);
    this.formularioItem.get('kilosEfectivo').setValue(this.formularioItem.get('remito').value.kilosEfectivo);
    this.formularioItem.get('bultos').setValue(this.formularioItem.get('remito').value.bultos);
    this.formularioItem.get('m3').setValue(this.formularioItem.get('remito').value.m3);
    this.formularioItem.get('valorDeclarado').setValue(this.formularioItem.get('remito').value.valorDeclarado);
    this.formularioItem.get('importeEntrega').setValue(this.formularioItem.get('remito').value.importeEntrega);
    this.formularioItem.get('importeRetiro').setValue(this.formularioItem.get('remito').value.importeRetiro);
  }
  //Completa el input "porcentaje" segun la Orden Venta seleccionada 
  public cambioOVta(){
    this.soloLecturaOrden = false;
    this.formularioItem.get('seguro').setValue(this.formularioItem.get('tarifaOVta').value.seguro);
    console.log(this.formularioItem.value);
    this.obtenerPrecioFlete();
  }
  //Obtiene el Precio del Flete seleccionado
  public obtenerPrecioFlete(){
    let tipoTarifa = this.formularioItem.get('tarifaOVta').value.tipoTarifa.id;
    let idOrdenVta = this.formularioItem.get('tarifaOVta').value.id;
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
  public calcularSubtotal(){
    let subtotal=0;
    let vdeclaradoNeto = this.formularioItem.get('valorDeclarado').value*(this.formularioItem.get('seguro').value/1000);
    let descuento = this.formularioItem.get('descuento').value;
    let flete = this.formularioItem.get('flete').value;
    if(descuento>0)
    flete = flete-flete*(descuento/100); //valor neto del flete con el descuento
    let retiro = this.formularioItem.get('importeRetiro').value;
    let entrega = this.formularioItem.get('importeEntrega').value;
    let concepto = this.formularioItem.get('importeConcepto').value;
    subtotal = vdeclaradoNeto + flete + retiro + entrega + concepto;
    this.formularioItem.get('subtotal').setValue(subtotal);

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
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
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
})
export class ViajeDialogo{
  //Define la empresa 
  public empresa: string;
  //Define la lista de tramos
  public resultadosTramos = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;

  constructor(public dialogRef: MatDialogRef<ViajeDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService, 
  private viajePropioTramoService: ViajePropioTramoService, private viajeTerceroTramoServicio: ViajeTerceroTramoService) {}
   ngOnInit() {
     this.formulario = new FormGroup({
       tramo: new FormControl('', Validators.required)
     });
     //Obtiene la lista de tramos por tipo de item (propio/tercero)
     console.log(this.data.tipoItem, this.data.idViaje);
     this.listarTramos(this.data.tipoItem, this.data.idViaje);
   }
   //obtiene la lista de tramos por tipo y por el idViaje 
   public listarTramos(tipo, viaje){
    if(tipo==1){
      this.viajePropioTramoService.listarTramos(viaje).subscribe(
        res=>{
          console.log(res.json());
          this.resultadosTramos= res.json();
        }
      );
    }
    if(tipo==2){
      this.viajeTerceroTramoServicio.listarTramos(viaje).subscribe(
        res=>{
          console.log(res.json());
          this.resultadosTramos= res.json();
        }
      );
    }
   }
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

