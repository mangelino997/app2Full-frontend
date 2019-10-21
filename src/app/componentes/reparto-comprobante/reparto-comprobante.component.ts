import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { Subscription } from 'rxjs';
import { MatSort, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { RepartoComprobante } from 'src/app/modelos/repartoComprobante';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderState } from 'src/app/modelos/loader';
import { LoaderService } from 'src/app/servicios/loader.service';
import { ToastrService } from 'ngx-toastr';
import { RepartoComprobanteService } from 'src/app/servicios/reparto-comprobante.service';
import { RepartoService } from 'src/app/servicios/reparto.service';

@Component({
  selector: 'app-reparto-comprobante',
  templateUrl: './reparto-comprobante.component.html',
  styleUrls: ['./reparto-comprobante.component.css']
})
export class RepartoComprobanteComponent implements OnInit {
  //Define el formulario para Comprobante
  public formulario: FormGroup;
  //Define el formulario para Comprobante
  public formularioComprobante: FormGroup;
  //Define el formulario para Seguimiento Venta Comprobante
  public formularioSegVtaCpte: FormGroup;
  //Define el formulario para Seguimiento Viaje Remito
  public formularioSegViajeRemito: FormGroup;
  //Define el formulario para Seguimiento Recoleccion
  public formularioSegOrdenRecoleccion: FormGroup;
  //Define el array para tipos de comprobantes
  public tipoComprobantes: Array<any> = [];
  //Define si muestra el boton CERRAR 
  public btnCerrar: boolean = false;
  //Define la lista de tramos (tabla)
  public listaCompleta = new MatTableDataSource([]);
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la lista de tipos de Letras 
  public letras: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['TIPOCPTE', 'PUNTOVENTA', 'LETRA', 'COMPROBANTE', 'DESTINATARIO', 'DOMICILIO', 'REMITENTE', 'CTACTE', 'CONTADO', 'BULTOS', 'CONTRAREEMBOLSO', 'KG', 'ELIMINAR'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  constructor(
    private modelo: RepartoComprobante, private tipoComprobanteService: TipoComprobanteService, private appService: AppService,
    private ordenRecoleccionService: OrdenRecoleccionService, private viajeRemitoService: ViajeRemitoService, private servicio: RepartoComprobanteService,
    private ventaComprobanteService: VentaComprobanteService, private loaderService: LoaderService, private toastr: ToastrService,
    private repartoService: RepartoService, public dialog: MatDialog, public dialogRef: MatDialogRef<RepartoComprobanteComponent>, @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario general y validaciones
    this.formulario = new FormGroup({
      tipoComprobante: new FormControl('', Validators.required),
      puntoVenta: new FormControl(),
      letra: new FormControl(),
      numero: new FormControl('', Validators.required),
    });
    //Define el formulario Comprobante y validaciones
    this.formularioComprobante = this.modelo.formulario;
    //Obtiene la lista de tipo de comprobantes
    this.listarTipoComprobantes();
    //Establece valores por defecto
    this.establecerValoresPorDefecto();
  }

  //Carga la lista para tipo de comprobantes
  private listarTipoComprobantes() {
    this.tipoComprobanteService.listarActivosReparto().subscribe(
      res => {
        this.tipoComprobantes = res.json();
        this.formulario.get('tipoComprobante').setValue(this.tipoComprobantes[0]);
        this.cambioTipoComprobante();
      }
    )
  }
  //Controla el cambio en el campo "Tipo de Comprobante"
  public cambioTipoComprobante() {
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    this.formulario.reset();
    this.formulario.enable();
    this.formulario.get('tipoComprobante').setValue(tipoComprobante);
    if (tipoComprobante.id == 1) {
      this.ventaComprobanteService.listarLetras().subscribe(
        res => {
          this.letras = res.json();
        },
        err => {
          this.toastr.error("Error al obtener la lista de Letras en Venta Comprobante.");
        }
      )
    } else if (tipoComprobante.id == 5) {
      this.viajeRemitoService.listarLetras().subscribe(
        res => {
          this.letras = res.json();
        },
        err => {
          this.toastr.error("Error al obtener la lista de Letras en Viaje Remito.");
        }
      )
    } else if (tipoComprobante.id == 13) {
      this.letras = [];
      this.formulario.get('puntoVenta').disable();
      this.formulario.get('letra').disable();
    }
  }
  //Agrega un registro a la tabla
  public agregar() {
    let tipoComprobante = this.formulario.get('tipoComprobante').value;
    let numero = this.formulario.get('numero').value;
    if (tipoComprobante.id == 13) {
      this.ordenRecoleccionService.obtenerPorId(numero).subscribe(
        res => {
          // this.formularioSegOrdenRecoleccion.get('ordenRecoleccion').setValue(res.json());
          this.formularioComprobante.get('ordenRecoleccion').setValue({ id: res.json().id });
          this.agregarComprobanteReparto(this.formularioComprobante.value);
        },
        err => {
          err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
        })
    } else if (tipoComprobante.id == 5) {
      this.viajeRemitoService.obtener(this.formulario.get('puntoVenta').value, this.formulario.get('letra').value,
        this.formulario.get('numero').value).subscribe(
          res => {
            let respuesta = res.json();
            // this.formularioSegViajeRemito.get('viajeRemito').setValue(res.json());
            let viajeRemito = {
              letra: respuesta.letra,
              puntoVenta: respuesta.puntoVenta,
              numero: respuesta.numero
            }
            this.formularioComprobante.get('viajeRemito').setValue(viajeRemito);
            this.agregarComprobanteReparto(this.formularioComprobante.value);
          },
          err => {
            err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
          })
    } else if (tipoComprobante.id == 1) {
      console.log(this.formulario.get('puntoVenta').value, this.formulario.get('letra').value,
        this.formulario.get('numero').value, tipoComprobante.id);
      this.ventaComprobanteService.obtener(this.formulario.get('puntoVenta').value, this.formulario.get('letra').value,
        this.formulario.get('numero').value, tipoComprobante.id).subscribe(
          res => {
            console.log(res);
            let respuesta = res.json();
            // this.formularioSegVtaCpte.get('ventaComprobante').setValue(res.json());
            let ventaComprobante = {
              letra: respuesta.letra,
              puntoVenta: respuesta.puntoVenta,
              numero: respuesta.numero,
              tipoComprobante: respuesta.tipoComprobante
            }
            this.formularioComprobante.get('ventaComprobante').setValue(ventaComprobante);
            this.agregarComprobanteReparto(this.formularioComprobante.value);
          },
          err => {
            err.status == 404 ? this.toastr.error("Registro no encontrado") : '';
          })
    }
  }
  //Agrega un Comprobante
  private agregarComprobanteReparto(formularioComprobante) {
    this.loaderService.show();
    formularioComprobante.reparto.repartoComprobantes = [];
    this.servicio.agregar(formularioComprobante).subscribe(
      res => {
        if (res.status == 201) {
          this.reestablecerFormulario();
          this.establecerValoresPorDefecto();
          this.toastr.success("Reparto Comprobante: " + res.json().mensaje);
        }
        this.loaderService.hide();
      },
      err => {
        this.toastr.error(err.json().mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Vacia la lista
  public vaciarListas(): void {
    this.letras = [];
    this.listaCompleta = new MatTableDataSource([]);
  }
  //Reestablece formulario y lista al cambiar de pestaña
  public reestablecerFormulario(): void {
    this.vaciarListas();
    this.formulario.reset();
    this.formularioComprobante.reset();
  }
  //Establece los valores por defecto del formulario viaje combustible
  public establecerValoresPorDefecto() {
    document.getElementById('idTipoComprobante').focus();
    this.formulario.get('tipoComprobante').setValue(this.tipoComprobantes[0]);
    if (this.data) {
      this.formularioComprobante.get('reparto').patchValue(this.data.elemento);
      this.btnCerrar = this.data.btnCerrar;
      this.listarPorReparto(this.data.elemento.id);
    }
  }
  //Obtiene los registros, para mostrar en la tabla, por idReparto
  private listarPorReparto(idReparto) {
    this.repartoService.obtenerPorId(idReparto).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json().repartoComprobantes);
        this.listaCompleta.sort = this.sort;
      },
      err => {
        this.toastr.error("Sin registros para mostrar.");
        this.loaderService.hide();
      }
    )
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(intLimite) {
    return this.appService.mascararEnteros(intLimite);
  }
  //Establece la cantidad de ceros correspondientes a la izquierda del numero
  public establecerCerosIzq(elemento, string, cantidad) {
    if (elemento.value) {
      elemento.setValue((string + elemento.value).slice(cantidad));
    }
  }
  //Imprime la suma de bultos VentaCpte de la lista VentaCpte ItemFAs 
  public sumaBultosVentaCpte(listaItemFAs) {
    let bultosTotal;
    listaItemFAs.array.forEach(elemento => {
      bultosTotal += elemento.bultos;
    });
    return bultosTotal;
  }
  //Imprime la suma de kilos efectivos de la lista VentaCpte ItemFAs 
  public sumaKiloEfectivoVentaCpte(listaItemFAs) {
    let kiloEfectivoTotal;
    listaItemFAs.array.forEach(elemento => {
      kiloEfectivoTotal += elemento.kiloEfectivo;
    });
    return kiloEfectivoTotal;
  }
  //Abre el modal para confirmar eliminar comprobante de reparto
  public activarEliminarCpteReparto(elemento) {
    const dialogRef = this.dialog.open(EliminarRepartoCpteDialogo, {
      width: '45%',
      maxWidth: '45%',
      data: {
        elemento: elemento,
        btnCerrar: true
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.establecerValoresPorDefecto();
    });
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.reset();
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
}

@Component({
  selector: 'eliminar-reparto-cpte-dialogo',
  templateUrl: 'eliminar-reparto-cpte-dialogo.html',
})
export class EliminarRepartoCpteDialogo {
  //Constructor
  constructor(public dialogRef: MatDialogRef<EliminarRepartoCpteDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private repartoCpteService: RepartoComprobanteService, private toastr: ToastrService) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {

  }
  public eliminarCpteReparto() {
    this.repartoCpteService.eliminar(this.data.elemento.id).subscribe(
      res => {
        if (res.status == 200) {
          this.toastr.success("Registro quitado exitosamente.");
          this.dialogRef.close();
        }
      },
      err => {
        if (err.status == 500) {
          this.toastr.success("Se produjo un erro en el sistema.");
          this.dialogRef.close();
        }
      }
    )
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
