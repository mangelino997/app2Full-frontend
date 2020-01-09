import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { AppService } from 'src/app/servicios/app.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { CobranzaService } from 'src/app/servicios/cobranza.service';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {
 //Define la pestania activa
 public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el formulario
  public formulario:FormGroup;
  //Define el select de medios de pagos
  public medioPago:FormControl = new FormControl();
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define los medios de pago
  public mediosPagos:Array<any> = [];
  //Define la lista de medios de pagos seleccionados
  public mediosPagosSeleccionados:Array<any> = [];
  //Define la lista de resultados de busqueda de cliente
  public resultadosClientes: Array<any> = [];
  public columnas:string[] = ['FECHA_EMISION','FECHA_VTO_PAGO','TIPO','PUNTO_VENTA','LETRA','NUMERO','SALDO','IMPORTE','IMPORTE_COBRO'];
  //Define la lista completa de registro
  public ventasComprobantes = new MatTableDataSource ([]);
   //Defiene el render
  public render: boolean = false;
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(private toastr: ToastrService, 
    private loaderService: LoaderService, private appService: AppService,private clienteServicio:ClienteService, 
    private ventaComprobanteService:VentaComprobanteService,private servicio: CobranzaService) { 
    this.formulario = new FormGroup({
      cliente: new FormControl(),
      integracion: new FormControl,
      pendienteDeIntegrar: new FormControl,
      retenciones: new FormControl,
      items: new FormControl,
      totalImporteSeleccionado: new FormControl,
      items2: new FormControl,
      totalDeuda: new FormControl,
      totalIntegrado: new FormControl
    })
  }

  ngOnInit() {
  //Obtiene los datos de inicializacion desde servicio web
   this.inicializar(this.appService.getRol().id, this.appService.getSubopcion());
  //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar');
   //Autocompletado Cliente - Buscar por nombre
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClientes = response.json();
            this.loaderService.hide();
          },  
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene los datos necesarios para el componente
  private inicializar(idRol, idSubopcion) {
    this.render = true;
    this.servicio.inicializar(idRol, idSubopcion).subscribe(
      res => {
        let respuesta = res.json();
        //Establece los datos de inicializacion
        this.pestanias = respuesta.pestanias;
        this.mediosPagos = respuesta.mediosPagos;
        this.render = false;
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.render = false;
      }
    );
  }
   //Funcion para establecer los valores de las pestañas
   private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre) {
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    switch (id) {
      case 1:
        this.establecerValoresPestania(nombre, false, false, true, 'idCliente');
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
  //Obtiene la lista de registros
  public listar(): void {

  }
  //Obtiene una lista de compras comprobantes por empresa y cliente
  public listarComprasPorEmpresaYCliente(): void {
    this.loaderService.show();
    let cliente = this.formulario.get('cliente').value;
    let empresa = this.appService.getEmpresa();
    this.ventaComprobanteService.listarParaCobranza(cliente.id, empresa.id).subscribe(
      res => {
        this.ventasComprobantes = new MatTableDataSource(res.json());
        this.ventasComprobantes.sort = this.sort;
        this.ventasComprobantes.data.length == 0 ? this.toastr.warning("El Cliente no tiene contactos asignados.") : '';
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      }
    );
  }
  // Maneja los evento al presionar una tecla (para pestanias y opciones)
  public manejarEvento(keycode) {
    let indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        // this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
      } else {
        // this.seleccionarPestania(1, this.pestanias[0].nombre);
      }
    }
  }

  //Abre el dialogo correspondientes al seleccionar una opcion del campo 'Ingregracion en'
  public determinarIntegracion(): void {}

  //Establece los ceros en los numeros flotantes en tablas
  public establecerCerosTabla(elemento) {
    return this.appService.establecerDecimales(elemento, 2);
  }
  
 //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
  if (typeof valor.value != 'object') {
    valor.setValue(null);
    }
  }
//Define como se muestra los datos con ceros a la izquierda
public completarCeros(elemento, string, cantidad) {
  if (elemento != undefined) {
    return elemento ? (string + elemento).slice(cantidad) : elemento;
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

  //Define como se muestra los datos en el autcompletado
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}
