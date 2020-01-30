import { Component, OnInit, Inject } from '@angular/core';
import { ClienteService } from '../../servicios/cliente.service';
import { SucursalService } from '../../servicios/sucursal.service';
import { AfipCondicionIvaService } from '../../servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { BarrioService } from '../../servicios/barrio.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { CobradorService } from '../../servicios/cobrador.service';
import { ZonaService } from '../../servicios/zona.service';
import { RubroService } from '../../servicios/rubro.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';
import { AppService } from 'src/app/servicios/app.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

@Component({
  selector: 'app-cliente-eventual',
  templateUrl: './cliente-eventual.component.html',
  styleUrls: ['./cliente-eventual.component.css']
})
export class ClienteEventualComponent implements OnInit {
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista de condiciones de iva
  public condicionesIva: Array<any> = [];
  //Define la lista de tipos de documentos
  public tiposDocumentos: Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  public resultadosBarrios: Array<any> = [];
  //Define la lista de resultados de busqueda de barrio
  public resultadosLocalidades: Array<any> = [];
  //Define la lista de resultados de busqueda de cobrador
  public cobrador: FormControl = new FormControl();
  //Define la lista de resultados de busqueda de zona
  public zonas: Array<any> = [];
  //Define la lista de resultados de busqueda de rubro
  public rubros: Array<any> = [];
  //Define la lista de resultados de busqueda de sucursal lugar pago
  public sucursalesPago: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<ClienteEventualComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private afipCondicionIvaServicio: AfipCondicionIvaService, private tipoDocumentoServicio: TipoDocumentoService,
    private barrioServicio: BarrioService, private localidadServicio: LocalidadService,
    private cobradorServicio: CobradorService, private zonaServicio: ZonaService,
    private rubroServicio: RubroService, private sucursalServicio: SucursalService,
    private clienteServicio: ClienteService, private toastr: ToastrService, public clienteEventual: ClienteEventual,
    private appService: AppService, private loaderService: LoaderService) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene el siguiente id
    this.obtenerSiguienteId();
    //Obtiene la lista de cobradore
    this.obtenerCobrador();
    //Obtiene la lista de zonas
    this.listarZonas();
    //Obtiene la lista de rubros
    this.listarRubros();
    //Obtiene la lista de sucursales de pagos
    this.listarSucursales();
    //Establece el foco en condicion de iva
    setTimeout(function () {
      document.getElementById('idCondicionIva').focus();
    }, 20);
    //Define los campos para validaciones
    this.formulario = this.clienteEventual.formulario;
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.barrioServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosBarrios = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        data = data.trim();
        if (data == '*' || data.length > 0) {
          this.loaderService.show();
          this.localidadServicio.listarPorNombre(data).subscribe(response => {
            this.resultadosLocalidades = response;
            this.loaderService.hide();
          },
            err => {
              this.loaderService.hide();
            })
        }
      }
    })
  }
  //Obtiene la lista de sucursales
  private listarSucursales(): void {
    this.sucursalServicio.listar().subscribe(res => {
      this.sucursalesPago = res.json();
    });
  }
  //Obtiene el listado de cobradores
  private obtenerCobrador() {
    this.cobradorServicio.obtenerPorDefecto().subscribe(
      res => {
        this.cobrador.setValue(res.json().nombre);
        this.formulario.get('cobrador').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Obtiene el listado de Zonas
  private listarZonas() {
    this.zonaServicio.listar().subscribe(
      res => {
        this.zonas = res.json();
        this.formulario.get('zona').setValue(this.zonas[0]);
      },
      err => {
      }
    );
  }
  //Obtiene el listado de Rubros
  private listarRubros() {
    this.rubroServicio.listar().subscribe(
      res => {
        this.rubros = res.json();
      },
      err => {
      }
    );
  }
  //Controla el cambio en el campo barrio
  public cambioBarrio() {
    this.verificarSeleccion(this.formulario.get('barrio'));
    if (this.formulario.value.barrio) {
      this.formulario.value.barrio.zona ? [this.formulario.get('zona').setValue({ id: this.formulario.value.barrio.zona.id }),
      this.formulario.get('zona').disable()] : [this.formulario.get('zona').enable()];
    } else {
      this.formulario.get('zona').enable();
    }
  }
  //Obtiene la mascara de enteros
  public mascararEnteros(limite) {
    return this.appService.mascararEnteros(limite);
  }
  //Obtiene la mascara de enteros CON decimales
  public mascararEnteroSinDecimales(intLimite) {
    return this.appService.mascararEnterosSinDecimales(intLimite);
  }
  //Obtiene el listado de condiciones de iva
  private listarCondicionesIva() {
    this.afipCondicionIvaServicio.listar().subscribe(
      res => {
        this.condicionesIva = res.json();
      },
      err => {
      }
    );
  }
  //Obtiene el listado de tipos de documentos
  private listarTiposDocumentos() {
    this.tipoDocumentoServicio.listar().subscribe(
      res => {
        this.tiposDocumentos = res.json();
      },
      err => {
      }
    );
  }
  //Cierra el mat dialog
  private closeDialog(respuesta) {
    this.dialogRef.close(respuesta);
  }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.clienteServicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
      }
    );
  }
  //Agrega un cliente eventual
  public agregarClienteEventual(): void {
    this.loaderService.show();
    this.formulario.get('zona').enable();
    this.formulario.get('id').setValue(null);
    this.formulario.get('usuarioAlta').setValue(this.data.usuario);
    this.clienteServicio.agregarClienteEventual(this.formulario.value).subscribe(
      res => {
        if (res.status == 201) {
          let respuesta = res.json();
          this.data.formulario = this.formulario.value;
          this.toastr.success(MensajeExcepcion.AGREGADO);
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idCondicionIva').focus();
          }, 20);
          this.loaderService.hide();
          this.closeDialog(respuesta);
        }
      },
      err => {
        this.lanzarError(err);
        this.loaderService.hide();
      }
    )
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if (documento) {
      switch (tipoDocumento.id) {
        case 1:
          let respuesta = this.appService.validarCUIT(documento.toString());
          if (!respuesta) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'CUIT Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appService.validarCUIT(documento.toString());
          if (!respuesta2) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'CUIL Incorrecto!' };
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appService.validarDNI(documento.toString());
          if (!respuesta8) {
            this.formulario.get('numeroDocumento').reset();
            let err = { codigo: 11010, mensaje: 'DNI Incorrecto!' };
            this.lanzarError(err);
          }
          break;
      }
    }
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.vaciarListas();
  }
  //Vacia la lista de resultados de autocompletados
  private vaciarListas() {
    this.resultadosBarrios = [];
    this.resultadosLocalidades = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Maneja el cambio en Condicion Iva
  public cambioCondicionIva() {
    if (this.formulario.value.afipCondicionIva.nombre == 'Consumidor Final') {
      this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[7]); //la posicion 7 pertenece a DNI
    } else {
      this.formulario.get('tipoDocumento').setValue(this.tiposDocumentos[0]); //la posicion 7 pertenece a CUIT
    }
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err;
    if (respuesta.codigo == 11006) {
      document.getElementById("labelRazonSocial").classList.add('label-error');
      document.getElementById("idRazonSocial").classList.add('is-invalid');
      document.getElementById("idRazonSocial").focus();
    } else if (respuesta.codigo == 11009) {
      document.getElementById("labelTelefono").classList.add('label-error');
      document.getElementById("idTelefono").classList.add('is-invalid');
      document.getElementById("idTelefono").focus();
    } else if (respuesta.codigo == 11010) {
      document.getElementById("labelNumeroDocumento").classList.add('label-error');
      document.getElementById("idNumeroDocumento").classList.add('is-invalid');
      document.getElementById("idNumeroDocumento").focus();
    }
    this.toastr.error(respuesta.mensaje);
  }
  //Obtiene la mascara de importe
  public obtenerMascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if (valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Define como se muestra los datos en el autcompletado a
  public displayFa(elemento) {
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
      return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
    } else {
      return elemento;
    }
  }
}