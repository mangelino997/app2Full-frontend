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
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { isNumber } from 'util';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';

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
  public formularioComprobante: FormGroup;
  //Define las listas 
  public listaCuenta = [];
  //Datos con los que se cargan las tablas
  public listaComprobantes = [];
  //Define como un FormControl
  public tipoComprobante:FormControl = new FormControl();
  //Define al campo puntoVenta (de solo lectura) como un FormControl
  public puntoVenta:FormControl = new FormControl();
  //Define la opcion elegida como un formControl
  public opcionCheck:FormControl = new FormControl();
  //Define el Comprobante seleccionado de la tabla
  public comprobanteSeleccionado = 0;
  //Define la lista de resultados de busqueda para clientes
  public resultadosClientes = [];
  //Define los datos de la Empresa
  public empresa:FormControl = new FormControl();
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];
  //Define la lista de resultados para Provincias
  public resultadosProvincias = [];
  //Define la lista de items tipo
  public resultadosItems = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public resultadosAlicuotasIva = [];
  //Define el check
  public check:boolean=false;
  //Define el subtotal c/iva del comprobante seleccionado
  public subtotalCIVA = 0;
  //Define las variables de la cabecera
  public letra: string;
  public codigoAfip: string;
  public numero: string;

  constructor(private notaCredito: NotaCredito, private fechaService: FechaService, private tipoComprobanteService: TipoComprobanteService,private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService, private puntoVentaService: PuntoVentaService, private clienteService: ClienteService, 
    private appService: AppService, private provinciaService: ProvinciaService ,private toastr: ToastrService, private ventaComprobanteService: VentaComprobanteService,
    private ventaTipoItemervice: VentaTipoItemService, private alicuotasIvaService: AfipAlicuotaIvaService ) { }

  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible=true;
    this.checkboxComp=true;   
    //inicializa el formulario y sus elementos
    this.formulario= this.notaCredito.formulario;
    this.formularioComprobante= this.notaCredito.formularioComprobante;
    
    //Reestablece el Formularios
    this.reestablecerFormulario();
    //Obtiene los puntos de venta 
    this.listarPuntoVenta();
    //Obtiene las Provincias - origen de la carga 
    this.listarProvincias(); 
    //Obtiene los Motivos por el cual se desea modificar el comprobante
    this.listarItemsTipo();
    //Lista las alicuotas afip iva
    this.listarAlicuotaIva();
    //Autcompletado - Buscar por Cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosClientes = res;
        })
      }
    });
  }
  public cambioTabla(opcion){
    console.log(this.opcionCheck.value);
    switch(opcion){
      case 1:
        this.tablaVisible=true;
        this.limpiarCliente();
        break;

      case 2:
        this.tablaVisible=false;
        this.limpiarCliente();
        break;
    }
  }
  //Limpia los campos correspondientes al Cliente
  private limpiarCliente(){
    this.formulario.get('cli').reset();
    this.formulario.get('cliente').reset();
    this.formulario.get('letra').reset();
    this.formulario.get('codigoAfip').reset();
    this.formulario.get('numero').reset();
    this.resultadosClientes = [];
    setTimeout(function() {
      document.getElementById('idCliente').focus();
    }, 20);
  }
  // Carga datos (filas) en la tabla correspondiente
  private cargarTabla(){
    console.log("entra");
    console.log(this.formulario.get('cliente').value.id, this.empresa.value.id);
    this.ventaComprobanteService.listarPorClienteYEmpresa(this.formulario.get('cliente').value.id, this.empresa.value.id).subscribe(
      res=>{
        console.log(res.json());
        let respuesta = res.json();
        this.listaComprobantes = respuesta; //Filtramos por comprobanteItemFAs -> respuesta.comprobanteItemFAs
      }
    );
  }
  //Reestablece el formulario completo
  public reestablecerFormulario(){
    this.formulario.reset(); 
    this.resultadosClientes = [];
    this.empresa.setValue(this.appComponent.getEmpresa());
    this.opcionCheck.setValue('1');
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
  //Obtiene una lista de Conceptos Varios
  public listarItemsTipo(){
    this.ventaTipoItemervice.listarItems(3).subscribe(
      res=>{
        this.resultadosItems = res.json();
      }
    );
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntoVenta(){
    this.puntoVentaService.listarPorEmpresaYSucursalYTipoComprobante(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id, 3).subscribe(
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
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva(){
    this.alicuotasIvaService.listarActivas().subscribe(
      res=>{
        this.resultadosAlicuotasIva = res.json();
        for(let i=0; i<this.resultadosAlicuotasIva.length; i++){
          if(this.resultadosAlicuotasIva[i].porDefecto==true){
            this.formularioComprobante.get('alicuotaIva').setValue(this.resultadosAlicuotasIva[i].alicuota);
            this.formularioComprobante.get('afipAlicuotaIva').setValue(this.resultadosAlicuotasIva[i]);
          }
        }
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
    if(this.formulario.get('numero').value>0){
      console.log("entra");
      this.cambioTabla(1);
    }
  }
  //Establece Letra
  public establecerCabecera(){
    this.afipComprobanteService.obtenerLetra(this.formulario.get('cliente').value.condicionVenta.id, 3).subscribe(
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
        this.comprobarCodAfip();
      }
    );
  }
  //Establece Codigo Afip
  public establecerNumero(codigoAfip){
    console.log(this.formulario.value);
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res=>{
        this.formulario.get('numero').setValue(res.text());
        this.cargarTabla();
      }
    );
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public comprobarCodAfip(){
    let puntoVentaCeros = this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5);
    this.puntoVenta.setValue(puntoVentaCeros);
    if(this.formulario.get('codigoAfip').value!=null || this.formulario.get('codigoAfip').value>0)
      this.establecerNumero(this.formulario.get('codigoAfip').value);
  }
  //Controla el cambio de estilos al seleccionar un Comprobante de la tabla
  public seleccionarComprobante(indice, comprobante){
    let fila='fila'+indice;
    console.log(comprobante);
    this.comprobanteSeleccionado = indice;
    let filaSeleccionada=document.getElementsByClassName('ordenVta-seleccionada');
    for(let i=0; i< filaSeleccionada.length; i++){
      filaSeleccionada[i].className="ordenVta-no-seleccionada";
    }
    document.getElementById(fila).className="ordenVta-seleccionada";
    console.log(comprobante);
    this.formularioComprobante.patchValue(comprobante);
    this.subtotalCIVA = this.formularioComprobante.get('importeSaldo').value;
    setTimeout(function() {
      document.getElementById('idMotivo').focus();
    }, 20);
  }
  //Agrega el cambio a la lista de Comprobantes
  public modificarComprobante(){
    this.formularioComprobante.get('checked').setValue(true);
    this.listaComprobantes[this.comprobanteSeleccionado] = this.formularioComprobante.value;
    // this.formularioComprobante.get('checked').setValue(true);
    console.log(this.listaComprobantes);

    this.reestablecerFormularioComprobante();
  }
  //METODO PRINCIPAL - EMITIR NOTA DE CREDITO
  public emitir(){
    let afipConcepto = this.listaComprobantes[0].afipConcepto.id; //guardamos el id de afipConcepto del primer item de la tabla

  }
  //Controla los checkbox
  public controlCheckbox($event, indice){
    // if($event.checked==true){
    //   console.log("esta check");
    //   this.check=true;
    //   document.getElementById('check').className="checkBoxSelected";
    // }
    // else{
    //   console.log("no esta check");
    //   this.check=false;
    //   document.getElementById('check').className="checkBoxNotSelected";
    // }

    var checkboxs = document.getElementsByTagName('mat-checkbox');
        for (var i = 0; i < checkboxs.length; i++) {
            var id = "mat-checkbox-" + (i);
            if (i == indice && $event.checked == true) {
                document.getElementById(id).className = "checkBoxSelected";
            }
            else {
                document.getElementById(id).className = "checkBoxNotSelected";
                document.getElementById(id)['checked'] = false;
            }
        }


  }
  //Calcula el campo SubtotalNC del comprobante que se modifica
  public calcularSubtotalNC(){
    if(this.subtotalCIVA< this.formularioComprobante.get('importeSaldo').value){
      this.formularioComprobante.get('importeSaldo').setValue(this.subtotalCIVA);
      setTimeout(function() {
        document.getElementById('idSubtotalCIVA').focus();
      }, 20);
      this.toastr.error("El SUBTOTAL C/IVA ingresado debe ser MENOR");
    }
    let iva= String(this.formularioComprobante.get('alicuotaIva').value).split('.');
    console.log(iva);
    let ivaDisvisor = "1.";
    for(let i=0; i< iva.length; i++){
      ivaDisvisor = ivaDisvisor + iva[i];
    }
    console.log(ivaDisvisor);

    let subtotal = this.formularioComprobante.get('importeSaldo').value/Number(ivaDisvisor); 
    this.formularioComprobante.get('subtotalNC').setValue(subtotal);
    

  }
  //Reestablece el formulario de modificar Comprobante
  private reestablecerFormularioComprobante(){
    this.comprobanteSeleccionado = 0;
    this.formularioComprobante.reset();
    this.listarItemsTipo();
    this.listarAlicuotaIva();
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor, cantidad) {
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
