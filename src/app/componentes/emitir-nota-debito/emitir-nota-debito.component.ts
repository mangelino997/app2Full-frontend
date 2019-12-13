import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FechaService } from 'src/app/servicios/fecha.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { AppService } from 'src/app/servicios/app.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { MatDialog } from '@angular/material';
import { ChequesRechazadosComponent } from '../cheques-rechazados/cheques-rechazados.component';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { NotaDebito } from 'src/app/modelos/notaDebito';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { ErrorPuntoVentaComponent } from '../error-punto-venta/error-punto-venta.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emitir-nota-debito',
  templateUrl: './emitir-nota-debito.component.html',
  styleUrls: ['./emitir-nota-debito.component.css']
})
export class EmitirNotaDebitoComponent implements OnInit {
  public checkboxComp: boolean = null;
  public checkboxCuenta: boolean = null;
  public tablaVisible: boolean = null;
  public formulario: FormGroup;
  public formularioItem: FormGroup;
  //Define las listas 
  public listaItem = [];
  //Define como un FormControl
  public tipoComprobante: FormControl = new FormControl();
  //Define el campo puntoVenta (el de solo lectura) como un FormControl
  public puntoVenta: FormControl = new FormControl();
  //Define la lista de resultados de busqueda para clientes
  public resultadosClientes = [];
  //Define los datos de la Empresa
  public empresa: FormControl = new FormControl();
  //Define la lista de resultados para Puntos de Venta
  public resultadosPuntoVenta = [];
  //Define la lista de resultados para Provincias
  public resultadosProvincias = [];
  //Define la lista de Alicuotas Afip Iva que estan activas
  public resultadosAlicuotasIva = [];
  //Define la lista de items tipo
  public resultadosItems = [];
  //Define el Item seleccionadao de la segunda tabla
  public itemSeleccionado = null;
  //Define el subtotal c/iva del item seleccionado
  public subtotalCIVA = 0;
  //Define las variables de la cabecera
  public letra: string;
  public codigoAfip: string;
  public numero: string;
  //Constructor
  constructor(private notaDebito: NotaDebito, private fechaService: FechaService, private tipoComprobanteService: TipoComprobanteService, private appComponent: AppComponent,
    private afipComprobanteService: AfipComprobanteService, private puntoVentaService: PuntoVentaService, private clienteService: ClienteService,
    private appService: AppService, private provinciaService: ProvinciaService, private toastr: ToastrService, public dialog: MatDialog, private route: Router,
    private ventaTipoItemervice: VentaTipoItemService, private alicuotasIvaService: AfipAlicuotaIvaService, private ventaComprobanteService: VentaComprobanteService) {
  }
  //Al incializarse el componente
  ngOnInit() {
    //Define el formulario y validaciones
    this.tablaVisible = true;
    this.checkboxComp = true;
    //inicializa el formulario y sus elementos
    this.formulario = this.notaDebito.formulario;
    this.formularioItem = this.notaDebito.formularioComprobante;
    //Reestablece el Formularios
    this.reestablecerFormulario();
    //Obtiene los puntos de venta 
    this.listarPuntoVenta();
    //Obtiene las Provincias - origen de la carga 
    this.listarProvincias();
    //Obtiene los motivos 
    this.listarItemsTipo();
    //Obtiene la lista de alcuotas iva
    this.listarAlicuotaIva();
    //Autcompletado - Buscar por Cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.clienteService.listarPorAlias(data).subscribe(res => {
            this.resultadosClientes = res.json();
          })
        }
      }
    });
  }
  public cambiarTablaCuenta() {
    this.tablaVisible = false;
  }
  public cambiarTablaComp() {
    this.tablaVisible = true;
  }
  //Reestablece el formulario completo
  public reestablecerFormulario() {
    let defecto = '0';
    this.formulario.reset();
    this.reestablecerFormularioItem();
    this.formulario.get('importeExento').setValue(this.appService.setDecimales(defecto, 2));
    this.formulario.get('importeNoGravado').setValue(this.appService.setDecimales(defecto, 2));
    this.formulario.get('importeTotal').setValue(this.appService.setDecimales(defecto, 2));
    this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(defecto, 2));
    this.resultadosClientes = [];
    this.empresa.setValue(this.appComponent.getEmpresa());
    this.listaItem = [];
    //Establece la fecha actual
    this.fechaService.obtenerFecha().subscribe(res => {
      this.formulario.get('fechaEmision').setValue(res.json());
    });
    //Establece el Tipo de Comprobante
    this.tipoComprobanteService.obtenerPorId(2).subscribe(
      res => {
        let respuesta = res.json();
        this.formulario.get('ventaComprobante').setValue(res.json());
        this.tipoComprobante.setValue(respuesta.nombre);
      },
      err => {
        this.toastr.error('Error al obtener el Tipo de Comprobante');
      }
    );
    this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
    this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
    this.formulario.get('jurisdiccion').setValue(this.appComponent.getUsuario().sucursal['localidad']['provincia']);
    this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
    setTimeout(function () {
      document.getElementById('idFecha').focus();
    }, 20);
  }
  //Obtiene la lista de Puntos de Venta
  public listarPuntoVenta() {
    this.puntoVentaService.listarPorEmpresaYSucursalYTipoComprobante(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id, 2).subscribe(
      res => {
        this.resultadosPuntoVenta = res.json();
        this.formulario.get('puntoVenta').setValue(this.resultadosPuntoVenta[0]);
        if (this.resultadosPuntoVenta.length == 0) {
          const dialogRef = this.dialog.open(ErrorPuntoVentaComponent, {
            width: '700px'
          });
          dialogRef.afterClosed().subscribe(resultado => {
            this.route.navigate(['/home']);
          });
        }
      }
    );
  }
  //Obtiene una lista de las Provincias 
  public listarProvincias() {
    this.provinciaService.listar().subscribe(
      res => {
        this.resultadosProvincias = res.json();
      },
      err => {
        this.toastr.error("Error al obtener las Provincias");
      }
    );
  }
  //Obtiene una lista de Conceptos Varios
  public listarItemsTipo() {
    this.ventaTipoItemervice.listarItems(2).subscribe(
      res => {
        this.resultadosItems = res.json();
      }
    );
  }
  //Obtiene una lista con las Alicuotas Iva
  public listarAlicuotaIva() {
    this.alicuotasIvaService.listarActivas().subscribe(
      res => {
        this.resultadosAlicuotasIva = res.json();
        for (let i = 0; i < this.resultadosAlicuotasIva.length; i++) {
          if (this.resultadosAlicuotasIva[i].porDefecto == true) {
            this.formularioItem.get('alicuotaIva').setValue(this.resultadosAlicuotasIva[i].alicuota);
            this.formularioItem.get('afipAlicuotaIva').setValue(this.resultadosAlicuotasIva[i]);
          }
        }
      }
    );
  }
  //Establece los datos del cliente seleccionado
  public cargarDatosCliente() {
    if (this.formulario.get('puntoVenta').value != null || this.formulario.get('puntoVenta').value > 0) {
      this.formulario.get('cli.domicilio').setValue(this.formulario.get('cliente').value.domicilio);
      this.formulario.get('cli.localidad').setValue(this.formulario.get('cliente').value.localidad.nombre);
      this.formulario.get('cli.condicionVenta').setValue(this.formulario.get('cliente').value.condicionVenta.nombre);
      this.formulario.get('cli.afipCondicionIva').setValue(this.formulario.get('cliente').value.afipCondicionIva.nombre);
      this.formulario.get('cli.tipoDocumento').setValue(this.formulario.get('cliente').value.tipoDocumento.abreviatura);
      this.formulario.get('cli.numeroDocumento').setValue(this.formulario.get('cliente').value.numeroDocumento);
      this.establecerCabecera();
      document.getElementById('idMotivo').focus();
    }
    else {
      this.formulario.get('cliente').setValue(null);
      this.resultadosClientes = [];
      this.toastr.error('Debe seleccionar un PUNTO DE VENTA');
      document.getElementById('idPuntoVenta').focus();
    }
  }
  //Establece Letra
  public establecerCabecera() {
    this.afipComprobanteService.obtenerLetra(this.formulario.get('cliente').value.id, 2).subscribe(
      res => {
        this.formulario.get('letra').setValue(res.text());
        this.establecerCodAfip(res.text());
      }
    );
  }
  //Establece Numero
  public establecerCodAfip(letra) {
    this.afipComprobanteService.obtenerCodigoAfip(3, letra).subscribe(
      res => {
        this.formulario.get('codigoAfip').setValue(res.text());
        this.establecerNumero(res.text());
      }
    );
  }
  //Establece Codigo Afip
  public establecerNumero(codigoAfip) {
    this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(
      res => {
        this.formulario.get('numero').setValue(res.text());
      }
    );
  }
  //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
  public comprobarCodAfip() {
    let puntoVentaCeros = this.establecerCerosIzq(this.formulario.get('puntoVenta').value.puntoVenta, "0000", -5);
    this.puntoVenta.setValue(puntoVentaCeros);
    if (this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0)
      this.establecerNumero(this.formulario.get('codigoAfip').value);
  }
  //Calcula el campo SubtotalND del item que se agrega
  public calcularSubtotalND() {
    let subtotalND = Number(this.appService.setDecimales(this.formularioItem.get('subtotalND').value, 2));
    this.formularioItem.get('subtotalND').setValue(subtotalND);
    let ivaDisvisor = this.formularioItem.get('alicuotaIva').value / 100;
    let importeIva = this.returnDecimales(this.formularioItem.get('subtotalND').value * Number(ivaDisvisor), 2)
    let importeTotal = this.returnDecimales((this.formularioItem.get('subtotalND').value + Number(importeIva)), 2);
    this.formularioItem.get('importeIva').setValue(Number(this.appService.setDecimales(importeIva, 2)));
    this.formularioItem.get('importeTotal').setValue(Number(this.appService.setDecimales(importeTotal, 2)));
    this.formularioItem.get('importeNetoGravado').setValue(this.formularioItem.get('subtotalND').value);
  }
  //Agrega un item a la Lista de Items 
  public agregarItem() {
    if (this.itemSeleccionado != null) {
      this.listaItem[this.itemSeleccionado] = this.formularioItem.value;
      this.calcularImportesItem();
      this.reestablecerFormularioItem();
      document.getElementById('idMotivo').focus();
    } else {
      this.listaItem.push(this.formularioItem.value);
      this.calcularImportesItem();
      this.reestablecerFormularioItem();
      document.getElementById('idMotivo').focus();
    }
  }
  //Calcula los Importes Totales de los Items que se agregan mediante el formulario
  private calcularImportesItem() {
    let importeNetoGravado = 0;
    let importeIvaTotal = 0;
    let importeTotal = 0;
    for (let i = 0; i < this.listaItem.length; i++) {
      importeNetoGravado = importeNetoGravado + this.listaItem[i]['subtotalND'];
    }
    for (let i = 0; i < this.listaItem.length; i++) {
      importeIvaTotal = importeIvaTotal + this.listaItem[i]['importeIva'];
    }
    for (let i = 0; i < this.listaItem.length; i++) {
      importeTotal = importeTotal + this.listaItem[i]['importeTotal'];
    }
    this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(importeNetoGravado, 2));
    this.formulario.get('importeIva').setValue(this.appService.setDecimales(importeIvaTotal, 2));
    this.formulario.get('importeTotal').setValue(this.appService.setDecimales(importeTotal, 2));
  }
  //Reestablece el formulario de aplica a Comprobante
  private reestablecerFormularioItem() {
    this.formularioItem.reset();
    this.formularioItem.get('importeExento').setValue(this.appService.setDecimales('0', 2));
    this.formularioItem.get('subtotalND').setValue(this.appService.setDecimales('0', 2));
    this.listarItemsTipo();
    this.listarAlicuotaIva();
    this.itemSeleccionado = null;
    this.subtotalCIVA = 0;
  }
  //Carga en el formulario item el item seleccionado de la tabla (para modificarlo)
  public seleccionarItem(indice, item) {
    this.itemSeleccionado = indice;
    this.formularioItem.patchValue(item);
    this.subtotalCIVA = this.formularioItem.get('importeTotal').value;
    document.getElementById('idMotivo').focus();
  }
  //Eliminar un item de la Lista de items
  public eliminarItem(indice) {
    this.listaItem.splice(indice, 1);
    if (this.listaItem.length == 0) {
      let defecto = "0";
      this.formulario.get('importeNetoGravado').setValue(this.appService.setDecimales(defecto, 2));
      this.formulario.get('importeIva').setValue(this.appService.setDecimales(defecto, 2));
      this.formulario.get('importeTotal').setValue(this.appService.setDecimales(defecto, 2));
    } else {
      this.calcularImportesItem();
    }
  }
  //METODO PRINCIPAL - EMITIR NOTA DE CREDITO
  public emitir() {
    this.formulario.get('puntoVenta').setValue(this.formulario.get('puntoVenta').value.puntoVenta);
    this.formulario.get('ventaComprobanteItem').setValue(this.listaItem);
    //Guarda el id de afipConceptoVenta del primer item de la tabla
    this.formulario.get('afipConceptoVenta').setValue({ id: this.listaItem[0].itemTipo.afipConceptoVenta.id });
    this.ventaComprobanteService.agregar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        this.toastr.success(respuesta.mensaje);
        this.reestablecerFormulario();
      },
      err => {
        var respuesta = err.json();
        document.getElementById("idCliente").classList.add('label-error');
        document.getElementById("idCliente").classList.add('is-invalid');
        document.getElementById("idCliente").focus();
        this.toastr.error(respuesta.mensaje);
      }
    );
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
  //Retorna el numero a x decimales
  public returnDecimales(valor, cantidad) {
    return Number(this.appService.setDecimales(valor, cantidad));
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
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
        + ', ' + elemento.provincia.pais.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Define como se muestra los datos en el autcompletado c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
    } else {
      return '';
    }
  }
}