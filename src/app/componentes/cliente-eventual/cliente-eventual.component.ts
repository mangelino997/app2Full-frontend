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
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';
import { AppService } from 'src/app/servicios/app.service';

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
  public resultadosCobradores: Array<any> = [];
  //Define la lista de resultados de busqueda de zona
  public resultadosZonas: Array<any> = [];
  //Define la lista de resultados de busqueda de rubro
  public resultadosRubros: Array<any> = [];
  //Define la lista de resultados de busqueda de sucursal lugar pago
  public resultadosSucursalesPago: Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<ClienteEventualComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private afipCondicionIvaServicio: AfipCondicionIvaService, private tipoDocumentoServicio: TipoDocumentoService,
    private barrioServicio: BarrioService, private localidadServicio: LocalidadService,
    private cobradorServicio: CobradorService, private zonaServicio: ZonaService,
    private rubroServicio: RubroService, private sucursalServicio: SucursalService,
    private clienteServicio: ClienteService, private toastr: ToastrService, public clienteEventual: ClienteEventual,
    private appServicio: AppService) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Define los campos para validaciones
    this.formulario = this.clienteEventual.formulario;
    //Autocompletado Barrio - Buscar por nombre
    this.formulario.get('barrio').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.barrioServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosBarrios = response;
        })
      }
    })
    //Autocompletado Localidad - Buscar por nombre
    this.formulario.get('localidad').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.localidadServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosLocalidades = response;
        })
      }
    })
    //Autocompletado Cobrador - Buscar por nombre
    this.formulario.get('cobrador').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.cobradorServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosCobradores = response;
        })
      }
    })
    //Autocompletado Zona - Buscar por nombre
    this.formulario.get('zona').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.zonaServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosZonas = response;
        })
      }
    })
    //Autocompletado Rubro - Buscar por nombre
    this.formulario.get('rubro').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.rubroServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosRubros = response;
        })
      }
    })
    //Autocompletado Sucursal Lugar Pago - Buscar por nombre
    this.formulario.get('sucursalLugarPago').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.sucursalServicio.listarPorNombre(data).subscribe(response => {
          this.resultadosSucursalesPago = response;
        })
      }
    })
    //Obtiene la lista de condiciones de iva
    this.listarCondicionesIva();
    //Obtiene la lista de tipos de documentos
    this.listarTiposDocumentos();
    //Obtiene el siguiente id
    this.obtenerSiguienteId();
    //Establece el foco en condicion de iva
    setTimeout(function () {
      document.getElementById('idCondicionIva').focus();
    }, 20);
  }
  //Obtiene el listado de condiciones de iva
  private listarCondicionesIva() {
    this.afipCondicionIvaServicio.listar().subscribe(
      res => {
        this.condicionesIva = res.json();
      },
      err => {
        console.log(err);
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
        console.log(err);
      }
    );
  }
  onNoClick(): void { }
  //Obtiene el siguiente id
  private obtenerSiguienteId() {
    this.clienteServicio.obtenerSiguienteId().subscribe(
      res => {
        this.formulario.get('id').setValue(res.json());
      },
      err => {
        console.log(err);
      }
    );
  }
  //Agrega un cliente eventual
  public agregarClienteEventual(): void {
    this.formulario.get('usuarioAlta').setValue(this.data.usuario);
    this.clienteServicio.agregarClienteEventual(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerFormulario(respuesta.id);
          setTimeout(function () {
            document.getElementById('idCondicionIva').focus();
          }, 20);
          this.data.formulario = respuesta.id - 1;
          console.log(this.data.formulario);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        this.lanzarError(err);
      }
    )
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if(typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Validad el numero de documento
  public validarDocumento(): void {
    let documento = this.formulario.get('numeroDocumento').value;
    let tipoDocumento = this.formulario.get('tipoDocumento').value;
    if(documento) {
      switch(tipoDocumento.id) {
        case 1:
          let respuesta = this.appServicio.validarCUIT(documento.toString());
          if(!respuesta) {
            let err = {codigo: 11010, mensaje: 'CUIT Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 2:
          let respuesta2 = this.appServicio.validarCUIT(documento.toString());
          if(!respuesta2) {
            let err = {codigo: 11010, mensaje: 'CUIL Incorrecto!'};
            this.lanzarError(err);
          }
          break;
        case 8:
          let respuesta8 = this.appServicio.validarDNI(documento.toString());
          if(!respuesta8) {
            let err = {codigo: 11010, mensaje: 'DNI Incorrecto!'};
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
    this.resultadosCobradores = [];
    this.resultadosZonas = [];
    this.resultadosRubros = [];
    this.resultadosSucursalesPago = [];
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
  private lanzarError(err) {
    var respuesta = err.json();
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
