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
  public formularioCuenta: FormGroup;
  
  //Datos con los que se carga la tabla de Aplica a Comprobante
  public listaComprobantes = [];

  //Datos con lo que se carga la tabla de Aplica a la Cuenta
  public listaCuenta = [];
  //Define como un FormControl
  public tipoComprobante:FormControl = new FormControl();
  //Define al campo puntoVenta (de solo lectura) como un FormControl
  public puntoVenta:FormControl = new FormControl();
  //Define la opcion elegida como un formControl
  public opcionCheck:FormControl = new FormControl();
  //Define el Comprobante seleccionado de la tabla Aplica a Comprobante
  public comprobanteSeleccionado = null;
  //Define la Cuenta seleccionada de la tabla Aplica a Cuenta
  public cuentaSeleccionada = null;
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
    this.formularioCuenta= this.notaCredito.formularioComprobante;
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
      if(typeof data == 'string'&& data.length>2) {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultadosClientes = res;
        })
      }
    });
  }
  public cambioTabla(opcion){
    switch(opcion){
      case 1:
        this.tablaVisible=true;
        this.limpiarClienteYTabla();
        break;

      case 2:
        this.tablaVisible=false;
        this.limpiarClienteYTabla();
        break;
    }
  }
  //Limpia los campos correspondientes al Cliente
  private limpiarClienteYTabla(){
    this.formulario.get('cli').reset();
    this.formulario.get('cliente').reset();
    this.formulario.get('letra').reset();
    this.formulario.get('codigoAfip').reset();
    this.formulario.get('numero').reset();
    this.resultadosClientes = [];
    this.listaComprobantes = [];
    this.listaCuenta = [];
    this.reestablecerFormularioComprobante();
    this.reestablecerFormularioCuenta();
    setTimeout(function() {
      document.getElementById('idCliente').focus();
    }, 20);
  }
  // Carga datos (filas) en la tabla correspondiente
  private cargarTabla(){
    this.ventaComprobanteService.listarPorClienteYEmpresa(this.formulario.get('cliente').value.id, this.empresa.value.id).subscribe(
      res=>{
        let respuesta = res.json();
        this.listaComprobantes = respuesta; //Filtramos por comprobanteItemFAs -> respuesta.comprobanteItemFAs
      }
    );
  }
  //Reestablece el formulario completo
  public reestablecerFormulario(){
    this.formulario.reset();
    this.reestablecerFormularioComprobante();
    this.reestablecerFormularioCuenta();
    let valorDefecto= '0';
    this.formulario.get('importeIva').setValue(this.appService.setDecimales(valorDefecto, 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.setDecimales(valorDefecto, 2));
    this.formulario.get('importeExento').setValue(this.appService.setDecimales(valorDefecto, 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(valorDefecto, 2));
    this.formulario.get('importeTotal').setValue(this.appService.setDecimales(valorDefecto, 2));

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
        this.formulario.get('tipoComprobante').setValue(res.json());
        this.tipoComprobante.setValue(respuesta.nombre);
      },
      err=>{
        this.toastr.error('Error al obtener el Tipo de Comprobante');
      }
    );
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('provincia').setValue(this.appComponent.getUsuario().sucursal['localidad']['provincia']);
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
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
    this.puntoVentaService.listarPorEmpresaYSucursalYAfipComprobante(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id, 3).subscribe(
      res=>{
        this.resultadosPuntoVenta= res.json();
        console.log(res.json());
        // this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0]['puntoVenta'].value);
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
    if(this.formulario.get('puntoVenta').value!=null || this.formulario.get('puntoVenta').value>0){
      this.formulario.get('cli.domicilio').setValue(this.formulario.get('cliente').value.domicilio);
      this.formulario.get('cli.localidad').setValue(this.formulario.get('cliente').value.localidad.nombre);
      this.formulario.get('cli.condicionVenta').setValue(this.formulario.get('cliente').value.condicionVenta.nombre);
      this.formulario.get('cli.afipCondicionIva').setValue(this.formulario.get('cliente').value.afipCondicionIva.nombre);
      this.formulario.get('cli.tipoDocumento').setValue(this.formulario.get('cliente').value.tipoDocumento.abreviatura);
      this.formulario.get('cli.numeroDocumento').setValue(this.formulario.get('cliente').value.numeroDocumento);
      this.establecerCabecera();
    }
    else{
      this.formulario.get('cliente').setValue(null);
      this.resultadosClientes = [];
      this.toastr.error('Debe seleccionar un PUNTO DE VENTA');
      setTimeout(function() {
        document.getElementById('idPuntoVenta').focus();
      }, 20);
    }

    if(this.formulario.get('numero').value>0){
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
    this.comprobanteSeleccionado = indice;
    this.formularioComprobante.patchValue(comprobante);
    this.subtotalCIVA = this.formularioComprobante.get('importeTotal').value;
    setTimeout(function() {
      document.getElementById('idMotivo').focus();
    }, 20);
  }
  //Controla el cambio de estilos al seleccionar un Comprobante de la tabla
  public seleccionarCuenta(indice, comprobante){
    this.cuentaSeleccionada = indice;
    this.formularioCuenta.patchValue(comprobante);
    this.subtotalCIVA = this.formularioCuenta.get('importeTotal').value;
    setTimeout(function() {
      document.getElementById('idMotivo').focus();
    }, 20);
  }
  //Elimina una cuenta de la lista (tabla)
  public eliminarCuenta(indice){
    this.listaCuenta.splice(indice, 1);
    this.calcularImportesCuenta(indice);
  }
  //Agrega el cambio a la lista de Comprobantes
  public modificarComprobante(){
    this.formularioComprobante.get('checked').setValue(true);
    let indice= this.comprobanteSeleccionado;
    var id = "mat-checkbox-" + indice;
    document.getElementById(id).className = "checkBoxSelected";
    this.listaComprobantes[this.comprobanteSeleccionado] = this.formularioComprobante.value;
    this.calcularImportesComprobante(indice);
    this.reestablecerFormularioComprobante();
  }
  //Agrega un item a la Nota de Credito (aplica a la cuenta)
  public modificarCuenta(){
    if(this.cuentaSeleccionada!=null){
      this.listaCuenta[this.cuentaSeleccionada] = this.formularioCuenta.value;
      this.calcularImportesCuenta(this.listaCuenta.length-1);
      this.reestablecerFormularioCuenta();
    }else{
      this.listaCuenta.push(this.formularioCuenta.value);
      this.calcularImportesCuenta(this.listaCuenta.length-1);
      this.reestablecerFormularioCuenta();
    }
  }
  //METODO PRINCIPAL - EMITIR NOTA DE CREDITO
  public emitir(){
    this.formulario.get('puntoVenta').setValue(this.formulario.get('puntoVenta').value.puntoVenta);
    if(this.listaComprobantes.length>0){
      let listaCompCheckeados = [];
      for(let i =0; i< this.listaComprobantes.length; i++){
        if(this.listaComprobantes[i]['checked']==true)
        listaCompCheckeados.push(this.listaComprobantes[i]);
      }
      console.log(listaCompCheckeados[0]['itemTipo']['afipConcepto']['id']);
      this.formulario.get('ventaComprobanteItemNC').setValue(listaCompCheckeados);
      this.formulario.get('afipConcepto').setValue({id: listaCompCheckeados[0]['itemTipo']['afipConcepto']['id']});//guardamos el id de afipConcepto del primer item de la tabla
    }
    if(this.listaCuenta.length>0){
      this.formulario.get('ventaComprobanteItemNC').setValue(this.listaCuenta);
      this.formulario.get('afipConcepto').setValue({id: this.listaCuenta[0].itemTipo.afipConcepto.id});//guardamos el id de afipConcepto del primer item de la tabla

    }
    console.log(this.formulario.value);
    this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
      res=>{
        let respuesta= res.json();
        this.toastr.success(respuesta.mensaje);
        this.reestablecerFormulario();
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
  //Calcula los Importes del pie de la transaccion
  private calcularImportesComprobante(indice){
    let importeNetoGravado=0;
    let importeIvaTotal=0;
    let importeTotal=0;
    for(let i=0; i<this.listaComprobantes.length; i++){
      importeNetoGravado= this.returnDecimales(importeNetoGravado + this.listaComprobantes[i]['subtotalNC'],2);
    }
    for(let i=0; i<this.listaComprobantes.length; i++){
      importeIvaTotal= this.returnDecimales(importeIvaTotal + this.listaComprobantes[i]['importeIva'],2);
    }
    for(let i=0; i<this.listaComprobantes.length; i++){
      importeTotal= this.returnDecimales(importeTotal + this.listaComprobantes[i]['importeTotal'],2);
    }
    this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(importeNetoGravado, 2));
    this.formulario.get('importeIva').setValue(this.appService.setDecimales(importeIvaTotal, 2));
    this.formulario.get('importeTotal').setValue(this.appService.setDecimales(importeTotal, 2));
  }
  //Calcula los Importes Totales
  private calcularImportesCuenta(indice){
    let importeNetoGravado=0;
    let importeIvaTotal=0;
    let importeTotal=0;
    for(let i=0; i<this.listaCuenta.length; i++){
      importeNetoGravado= this.returnDecimales((importeNetoGravado + this.listaCuenta[i]['subtotalNC']), 2);
    }
    for(let i=0; i<this.listaCuenta.length; i++){
      importeIvaTotal= this.returnDecimales((importeIvaTotal + this.listaCuenta[i]['importeIva']), 2);
    }
    for(let i=0; i<this.listaCuenta.length; i++){
      importeTotal= this.returnDecimales((importeTotal + this.listaCuenta[i]['importeTotal']), 2);
    }
    this.formulario.get('importeNetoGravado').setValue(this.returnDecimales(importeNetoGravado, 2));
    this.formulario.get('importeIva').setValue(this.returnDecimales(importeIvaTotal, 2));
    this.formulario.get('importeTotal').setValue(this.returnDecimales(importeTotal, 2));
  }
  //Controla los checkbox
  public controlCheckbox($event, comprobante, indice){
    var id = "mat-checkbox-" + indice;
    if($event.checked==true){
      document.getElementById(id).className = "checkBoxSelected";
      this.listaComprobantes[indice]['checked']=true;
      this.calcularImportesComprobante(indice);
    }else{
      document.getElementById(id).className = "checkBoxNotSelected";
      this.listaComprobantes[indice]['checked']=false;
      //Resta los Importes, de la Nota de Credito, el valor correspondiente al comprobante descheckeado
      let subtotal=this.listaComprobantes[indice]['subtotalNC'];
      let importeIva=this.listaComprobantes[indice]['importeIva'];
      let importeTotal= this.listaComprobantes[indice]['importeTotal']; 
      this.formulario.get('importeIva').setValue(this.formulario.get('importeIva').value - importeIva);
      this.formulario.get('importeTotal').setValue(this.formulario.get('importeTotal').value - importeTotal);
      this.formulario.get('importeNetoGravado').setValue(this.formulario.get('importeNetoGravado').value - subtotal);
    }
  }
  //Calcula el campo SubtotalNC del comprobante que se modifica
  public calcularSubtotalNC(){
    if(this.subtotalCIVA< this.formularioComprobante.get('importeTotal').value){
      setTimeout(function() {
        document.getElementById('idSubtotalCIVA').focus();
      }, 20);
      this.toastr.error("El SUBTOTAL C/IVA ingresado debe ser MENOR");
    }
    let iva= String(this.formularioComprobante.get('alicuotaIva').value).split('.');
    let ivaDisvisor = "1.";
    for(let i=0; i< iva.length; i++){
      ivaDisvisor = ivaDisvisor + iva[i];
    }
    let subtotal = this.returnDecimales(this.formularioComprobante.get('importeTotal').value/Number(ivaDisvisor), 2); 
    this.formularioComprobante.get('subtotalNC').setValue(subtotal);
    let importeIva=this.returnDecimales(subtotal*(this.formularioComprobante.get('alicuotaIva').value/100), 2);
    this.formularioComprobante.get('importeIva').setValue(importeIva);
  }
  //Calcula el campo SubtotalNC del comprobante que se modifica
  public calcularSubtotalNCC(){
    let iva= String(this.formularioCuenta.get('alicuotaIva').value).split('.');
    let ivaDisvisor = "1.";
    for(let i=0; i< iva.length; i++){
      ivaDisvisor = ivaDisvisor + iva[i];
    }
    let subtotal = this.returnDecimales(this.formularioCuenta.get('importeTotal').value/Number(ivaDisvisor), 2); 
    this.formularioCuenta.get('subtotalNC').setValue(subtotal);
    let importeIva=this.returnDecimales(subtotal*(this.formularioCuenta.get('alicuotaIva').value/100), 2);
    this.formularioCuenta.get('importeIva').setValue(importeIva);
  }
  //Reestablece el formulario de aplica a Comprobante
  private reestablecerFormularioComprobante(){
    this.comprobanteSeleccionado = null;
    this.formularioComprobante.reset();
    this.listarItemsTipo();
    this.listarAlicuotaIva();
  }
  //Reestablece el formulario de aplica a la Cuenta
  private reestablecerFormularioCuenta(){
    this.cuentaSeleccionada = null;
    this.formularioCuenta.reset();
    this.listarItemsTipo();
    this.listarAlicuotaIva();
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor, cantidad) {
    return Number(this.appService.setDecimales(valor, cantidad));
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
