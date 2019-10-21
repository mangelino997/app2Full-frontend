import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Reparto } from 'src/app/modelos/reparto';
import { FormGroup, FormControl } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/servicios/app.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { SeguimientoVentaComprobante } from 'src/app/modelos/seguimientoVentaComprobante';
import { SeguimientoOrdenRecoleccion } from 'src/app/modelos/seguimientoOrdenRecoleccion';
import { SeguimientoViajeRemito } from 'src/app/modelos/seguimientoViajeRemito';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';

@Component({
  selector: 'app-reparto-entrante',
  templateUrl: './reparto-entrante.component.html',
  styleUrls: ['./reparto-entrante.component.css']
})
export class RepartoEntranteComponent implements OnInit {
  //Define el formulario General
  public formulario: FormGroup;
  //Define como un formControl
  public tipoViaje: FormControl = new FormControl();
  //Define el formulario Comrpobante
  // public formularioComprobante:FormGroup;
  // //Define el Id de la Planilla seleccionada en la primer Tabla
  // public idPlanillaSeleciconada: number;

  // //Define como un formControl
  // public tipoItem:FormControl = new FormControl();
  // //Define la lista de resultados para Zonas, Comprobantes, Letras
  // public resultadosZona = [];
  // public resultadosComprobante = [];
  // public resultadosLetra = [];
  // //Define la lista de resultados para vehiculo o vehiculoProveedor
  // public resultadosVehiculo = [];
  // //Define la lista de resultados para remolque
  // public resultadosRemolque = [];
  // //Define la lista de resultados para chofer
  // public resultadosChofer = [];
  // //Define la lista de que muestra en la primer tabla (planilla pendientes de cerrar)
  // public planillasPendientesPropio = [];
  // public planillasPendientesTercero = [];
  // public planillasPendientesDeposito = [];
  // //Define la lista de comprobantes para la planilla seleccionada
  // public comprobantesPropio = [];
  // public comprobantesTercero = [];
  // public comprobantesDeposito = [];
  // //Define la lista de acompañantes
  // public listaAcompaniantes = [];
  // //Define la lista de tipo comprobantes Activos 
  // public listaTipoComprobantes = [];
  // //Define una bandera para control
  // public bandera:boolean=false;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla general
  public columnas: string[] = ['numeroReparto', 'fechaRegistracion', 'zona', 'vehiculo', 'chofer', 'fechaSalida', 'horaSalida', 'fechaRegreso', 'horaRegreso',
    'ordenesCombustibles', 'adelantosEfectivos', 'entrar', 'descargar'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  constructor(
    private modelo: Reparto, private toastr: ToastrService, private appService: AppService,
    private appComponent: AppComponent, public dialog: MatDialog, private loaderService: LoaderService,
    private seguimientoOrdenRecoleccionService: SeguimientoOrdenRecoleccionService, private servicio: RepartoService,
    private seguimientoViajeRemitoService: SeguimientoViajeRemitoService, private seguimientoVentaCpteService: SeguimientoVentaComprobanteService,
    private seguimientoVentaComprobante: SeguimientoVentaComprobante, private seguimientoOrdenRecoleccion: SeguimientoOrdenRecoleccion,
    private seguimientoViajeRemito: SeguimientoViajeRemito
  ) {

  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.modelo.formulario;
    // //Reestablece los valores
    // this.reestablecerFormulario(undefined);
    // //Establece los valores por defecto
    // this.establecerValoresPorDefecto();
  }

  //Controla el cambio en el select TipoViaje
  public cambioTipoViaje() {
    this.loaderService.show();
    this.listaCompleta = new MatTableDataSource([]);
    if (this.tipoViaje.value) {
      this.servicio.listarAbiertosPropios().subscribe(
        res => {
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        }
      )
    } else {
      this.servicio.listarAbiertosTerceros().subscribe(
        res => {
          console.log(res.json());
          this.listaCompleta = new MatTableDataSource(res.json());
          this.loaderService.hide();
        },
        err => {
          this.toastr.error(err.json().mensaje);
          this.loaderService.hide();
        }
      )
    }
  }

  // //Reestablece el formulario completo
  // public reestablecerFormulario(id){
  //   this.resultadosChofer = [];
  //   this.resultadosComprobante = [];
  //   this.resultadosLetra = [];
  //   this.resultadosRemolque = [];
  //   this.resultadosVehiculo = [];
  //   this.resultadosZona = [];
  //   this.formulario.reset(); 
  //   this.planillasPendientesPropio = [];
  //   this.planillasPendientesTercero = [];
  //   this.planillasPendientesDeposito = [];
  //   this.comprobantesPropio = [];
  //   this.comprobantesTercero = [];
  //   this.comprobantesDeposito = [];
  //   this.idPlanillaSeleciconada = null;
  //   setTimeout(function() {
  //     document.getElementById('idTipoViaje').focus();
  //   }, 20);
  // }
  // //Establece los valores por defecto
  // private establecerValoresPorDefecto(): void {
  //   this.fechaService.obtenerFecha().subscribe(res=>{
  //     this.formulario.get('fechaRegreso').setValue(res.json());
  //   });
  //   this.fechaService.obtenerHora().subscribe(res=>{
  //     let hora = res.json();
  //     this.formatearHora(hora);
  //   });
  //   this.tipoViaje.setValue(1);
  //   // this.cambioTipoViaje();
  //   this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
  //   this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
  //   this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
  //   this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
  //   this.formulario.get('tipoComprobante').setValue( {id:12});
  // }
  // //Formatea la Hora
  // public formatearHora(hora){
  //   let split = hora.split(':');
  //   let horaFormateada = split[0] + ':' + split[1] + ':00';
  //   this.formulario.get('horaRegreso').setValue(horaFormateada);
  // }
  //Controla el cambio en Tipo de Viaje
  // public cambioTipoViaje(){
  //   this.listarPrimerTabla();
  //   if(this.tipoViaje.value==3){
  //     this.formulario.get('fechaRegreso').disable();
  //     this.formulario.get('horaRegreso').disable();
  //   }else{
  //     this.formulario.get('fechaRegreso').enable();
  //     this.formulario.get('horaRegreso').enable();
  //   }
  // }
  // //Obtiene la lista de planillas correspondiente
  // public listarPrimerTabla(){
  //   switch(this.tipoViaje.value){
  //     case 1:
  //       this.repartoPropioService.listarPorEstaCerrada(false).subscribe(
  //         res=>{
  //           this.planillasPendientesTercero = [];
  //           this.planillasPendientesDeposito = [];
  //           this.planillasPendientesPropio = res.json();
  //         },
  //         err=>{
  //           let error = err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       )
  //       break;

  //     case 2:
  //       this.repartoTerceroService.listarPorEstaCerrada(false).subscribe(
  //         res=>{
  //           this.planillasPendientesPropio = [];
  //           this.planillasPendientesDeposito = [];
  //           this.planillasPendientesTercero = res.json();
  //         },
  //         err=>{
  //           let error = err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       )
  //       break;

  //     case 3:
  //       this.retiroDepositoService.listarPorEstaCerrada(false).subscribe(
  //         res=>{
  //           this.planillasPendientesPropio = [];
  //           this.planillasPendientesTercero = [];
  //           this.planillasPendientesDeposito = res.json();
  //         },
  //         err=>{
  //           let error = err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       )
  //       break;
  //   }
  // }
  // //Controla el cambio de Planillas en la primer tabla
  // public cambioPlanilla(id){
  //   let fila='fila'+id;
  //   let filaSeleccionada=document.getElementsByClassName('planilla-seleccionada');
  //   for(let i=0; i< filaSeleccionada.length; i++){
  //     filaSeleccionada[i].className="planilla-no-seleccionada";
  //   }
  //   document.getElementById(fila).className="planilla-seleccionada";
  //   this.listarSegundaTabla(id);
  // }
  // //Lista la segunda tabla segun la planilla seleccionada y el tipo de Viaje
  // private listarSegundaTabla(id){
  //   switch(this.tipoViaje.value){
  //     case 1:
  //       for(let i=0; i< this.planillasPendientesPropio.length;i++){
  //         if(id==i){
  //           this.idPlanillaSeleciconada = this.planillasPendientesPropio[i].id;
  //           this.repartoPropioComp.listarComprobantes(this.planillasPendientesPropio[i].id).subscribe(
  //             res=>{
  //               this.comprobantesPropio = res.json();
  //               this.comprobantesTercero = [];
  //               this.comprobantesDeposito = [];
  //             },
  //             err=>{
  //               let error= err.json();
  //               this.toastr.error(error.mensaje);
  //             }
  //           );
  //         }
  //       }
  //       break;

  //     case 2:
  //       this.repartoTerceroComp.listarComprobantes(id).subscribe(
  //         res=>{
  //           this.comprobantesPropio = [];
  //           this.comprobantesTercero = res.json();
  //           this.comprobantesDeposito = [];          
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;

  //     case 3:
  //       this.retiroDepositoComp.listarComprobantes(id).subscribe(
  //         res=>{
  //           this.comprobantesPropio = [];
  //           this.comprobantesTercero = [];
  //           this.comprobantesDeposito = res.json();          
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;
  //   }
  // }
  // //Quitar - Cerrar Reparto
  // public cerrarReparto(idReparto){
  //   switch(this.tipoViaje.value){
  //     case 1:
  //       this.repartoPropioService.cerrarReparto(idReparto).subscribe(
  //       res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje);
  //           this.comprobantesPropio = [];
  //           },
  //           err=>{
  //             let error= err.json();
  //             this.toastr.error(error.mensaje);
  //           }
  //         );
  //       break;

  //     case 2:
  //       this.repartoTerceroService.cerrarReparto(idReparto).subscribe(
  //         res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje);
  //           this.comprobantesTercero = [];          
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;

  //     case 3:
  //       this.retiroDepositoService.cerrarReparto(idReparto).subscribe(
  //         res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje); 
  //           this.comprobantesDeposito = [];       
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;
  //   }
  // } 
  // //Quita un comprobante de la segunda tabla
  // public quitarComprobante(tipoViaje, idComprobante){
  //   switch(tipoViaje){
  //     case 'propio':
  //       this.repartoPropioComp.quitarComprobantes(idComprobante).subscribe(
  //         res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje);
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;

  //     case 'tercero':
  //       this.repartoTerceroComp.quitarComprobantes(idComprobante).subscribe(
  //         res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje);
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;

  //     case 'retiro':
  //       this.retiroDepositoComp.quitarComprobantes(idComprobante).subscribe(
  //         res=>{
  //           let respuesta= res.json();
  //           this.toastr.success(respuesta.mensaje);
  //         },
  //         err=>{
  //           let error= err.json();
  //           this.toastr.error(error.mensaje);
  //         }
  //       );
  //       break;

  //   }
  // }
}


