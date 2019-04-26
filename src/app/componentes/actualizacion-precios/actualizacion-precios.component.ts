import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ActualizacionPrecios } from 'src/app/modelos/actualizacionPrecios';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-actualizacion-precios',
  templateUrl: './actualizacion-precios.component.html',
  styleUrls: ['./actualizacion-precios.component.css']
})
export class ActualizacionPreciosComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define el id de la Orden Venta seleccionada
  public idOrdenVta: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define la variable como un boolean
  public porEscala: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define que campo muestra
  public buscarPorCliente: boolean = true;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta: Array<any> = [];
  //Define la lista completa de registros (ordenes de venta) filtrados por la fecha de precio desde
  public listaFiltrada: Array<any> = [];
  //Define la lista completa de registros
  public empresas: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define como formControl
  public precioDesde: FormControl = new FormControl();
  //Define el porcentaje como 
  public porcentaje: any;
  //Define el campo como un formControl
  public buscarPor: FormControl = new FormControl();
  //Define el campo como un formControl
  public aumento: FormControl = new FormControl();
  //Define el campo como un formControl
  public empresa: FormControl = new FormControl();
  //Define los datos de la tabla OrdenVentaTramo/OrdenVentaEscala segun la orden venta seleccionada
  public ordenVenta: Array<any> = [];
  //Define los resultados del autocompletado
  public resultados: Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades: Array<any> = [];
  //Define la mascara de porcentaje
  public porcentajeMascara: any;
  //Constructor
  constructor(private servicio: OrdenVentaService, private actualizacionPrecios: ActualizacionPrecios, 
    private clienteService: ClienteService, private appService: AppService,
    private ordenVentaTramoServicio: OrdenVentaTramoService, private ordenVentaEscalaServicio: OrdenVentaEscalaService, 
    private empresaServicio: EmpresaService, private ordenVentaServicio: OrdenVentaService,
    private toastr: ToastrService, public dialog: MatDialog) {
    //Defiene autocompletado de Clientes
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.actualizacionPrecios.formulario;
    //Setea el campo a buscar por defecto
    this.buscarPor.setValue(0);
    //Obtiene la lista completa de registros
    this.listarEmpresas();
    //Setea por defecto que el combo sea un aumento de precio
    this.aumento.setValue(1);
    //Obtiene la mascara de porcentaje
    this.porcentajeMascara = this.appService.mascararPorcentaje();
    //Establece la empresa por defecto y disable
    this.empresa.setValue(this.appService.getEmpresa());
    this.empresa.disable();
    setTimeout(function() {
      document.getElementById('idBuscarPor').focus();
    }, 20);
  }
  //Obtiene el listado de registros
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
      }
    );
  }
  //Realiza el cambio de campo a buscar
  public cambioDeCampo() {
    this.reestablecerFormulario(undefined);
    if (this.buscarPor.value == 0) {
      this.buscarPorCliente = true;
    } else {
      this.buscarPorCliente = false;
      this.cargarTabla(1, null);
    }
  }
  //Carga la Tabla 
  public cargarTabla(opcion, id) {
    this.listaCompleta = [];
    if (opcion == 0) {
      this.ordenVentaServicio.listarPorCliente(id).subscribe(
        res => {
          this.listaCompleta = res.json();
        },
        err => {
        }
      );
    } else {
      this.ordenVentaServicio.listarPorEmpresa(this.empresa.value.id).subscribe(
        res => {
          this.listaCompleta = res.json();
        },
        err => {
        }
      );
    }
  }
  //Controla el cambio de estilos al seleccionar una orden Venta de la tabla
  public seleccionOrdenVta(indice, idOrdenVta) {
    let fila = 'fila' + indice;
    this.indiceSeleccionado = indice;
    this.idOrdenVta = idOrdenVta;
    let filaSeleccionada = document.getElementsByClassName('ordenVta-seleccionada');
    for (let i = 0; i < filaSeleccionada.length; i++) {
      filaSeleccionada[i].className = "ordenVta-no-seleccionada";
    }
    document.getElementById(fila).className = "ordenVta-seleccionada";
    this.buscarPorOrdenPrecios(indice);
  }
  //Busca los datos segun la Orden seleccionada
  public buscarPorOrdenPrecios(indice) {
    this.ordenVenta = [];
    this.porEscala = this.listaCompleta[indice].tipoTarifa.porEscala;
    this.indiceSeleccionado = indice;
    if (this.listaCompleta[indice].tipoTarifa.porEscala == true) {
      this.ordenVentaEscalaServicio.listarFechasPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res => {
          this.ordenVenta = res.json();
          this.formulario.get('fechaDesde').setValue(this.ordenVenta[0].preciosDesde);
          this.filtrarPorPrecioDesde();
        },
        err => {
        }
      );
    } else {
      this.ordenVentaTramoServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res => {
          this.ordenVenta = res.json();
          this.formulario.get('fechaDesde').setValue(this.ordenVenta[0].preciosDesde);
          this.filtrarPorPrecioDesde();
        },
        err => {
        }
      );
    }
  }
  //Abre un Modal con la lista de precios para la fecha de precioDesde
  public filtrarPorPrecioDesde() {
    this.listaFiltrada = [];
    this.ordenVentaEscalaServicio.listarPorOrdenVentaYPreciosDesde(this.idOrdenVta, this.formulario.get('fechaDesde').value).subscribe(
      res => {
        let respuesta = res.json();
        this.listaFiltrada = respuesta;
        // this.openListaPrecioDialogo();
      }
    );
  }
  //Modal Lista de Precios para determinada Fecha
  public openListaPrecioDialogo() {
    const dialogRef = this.dialog.open(ListaPreciosDialogo, {
      width: '1100px',
      data: {
        fecha: this.formulario.get('fechaDesde').value,
        listaFiltrada: this.listaFiltrada,
        porEscala: this.porEscala
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(function () {
        document.getElementById('idActualizacion').focus();
      }, 20);
    });
  }
  //Abre un modal con los datos actualizados antes de confirmar 
  public confirmar() {
    const dialogRef = this.dialog.open(ConfimarDialogo, {
      width: '1100px',
      data: {
        // formulario: this.ordenVenta, 
        formulario: this.listaFiltrada,
        porEscala: this.porEscala,
        ordenVenta: this.listaCompleta[this.indiceSeleccionado]
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.reestablecerFormulario(undefined);
        this.buscarPor.setValue(0);
        this.buscarPorCliente = true;
        setTimeout(function() {
          document.getElementById('idBuscarPor').focus();
        }, 20);
      }
    });
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.listaCompleta = [];
    this.listaFiltrada = [];
    this.formulario.reset();
    this.formulario.get('precioDesde').setValue(null);
    this.formulario.get('porcentaje').setValue(null);
    this.empresa.setValue(this.appService.getEmpresa());
    this.empresa.disable();
    this.autocompletado.setValue(null);
  }
  //Realiza la actualizacion del precio de la orden seleccionada
  public aplicarActualizacion() {
    this.establecerPorcentaje(this.formulario.get('porcentaje'), 2)
    if (this.formulario.get('porcentaje').value < 0) {
      this.toastr.error('El porcentaje no puede ser un valor Negativo');
      this.formulario.get('porcentaje').reset();
      document.getElementById('idPorcentaje').focus();
    } else {
      switch (this.aumento.value) {
        case 0:
          this.aplicarAnulacion();
          break;
        case 1:
          this.aplicarAumento();
          break;
      }
    }
  }
  //Aplica un aumento de porcentaje en los precios de la orden venta seleccionada
  public aplicarAumento() {
    let porcentaje = this.formulario.get('porcentaje').value;
    if (this.porEscala == true) {
      for (let i = 0; i < this.listaFiltrada.length; i++) {
        if (this.listaFiltrada[i].importeFijo != 0 && this.listaFiltrada[i].importeFijo != null)
          this.listaFiltrada[i].importeFijo = this.listaFiltrada[i].importeFijo + this.listaFiltrada[i].importeFijo * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijo = 0;

        if (this.listaFiltrada[i].precioUnitario != 0 && this.listaFiltrada[i].precioUnitario != null)
          this.listaFiltrada[i].precioUnitario = this.listaFiltrada[i].precioUnitario + this.listaFiltrada[i].precioUnitario * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitario = 0;
      }
    }
    else {
      for (let i = 0; i < this.listaFiltrada.length; i++) {
        if (this.listaFiltrada[i].importeFijoSeco != 0 && this.listaFiltrada[i].importeFijoSeco != null)
          this.listaFiltrada[i].importeFijoSeco = this.listaFiltrada[i].importeFijoSeco + this.listaFiltrada[i].importeFijoSeco * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijoSeco = 0;

        if (this.listaFiltrada[i].importeFijoRef != 0 && this.listaFiltrada[i].importeFijoRef != null)
          this.listaFiltrada[i].importeFijoRef = this.listaFiltrada[i].importeFijoRef + this.listaFiltrada[i].importeFijoRef * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijoRef = 0;

        if (this.listaFiltrada[i].precioUnitarioRef != 0 && this.listaFiltrada[i].precioUnitarioRef != null)
          this.listaFiltrada[i].precioUnitarioRef = this.listaFiltrada[i].precioUnitarioRef + this.listaFiltrada[i].precioUnitarioRef * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitarioRef = 0;

        if (this.listaFiltrada[i].precioUnitarioSeco != 0 && this.listaFiltrada[i].precioUnitarioSeco != null)
          this.listaFiltrada[i].precioUnitarioSeco = this.listaFiltrada[i].precioUnitarioSeco + this.listaFiltrada[i].precioUnitarioSeco * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitarioSeco = 0;
      }
    }
  }
  //Aplica una anulacion de porcentaje en los precios de la orden de venta seleccionada
  public aplicarAnulacion() {
    let porcentaje = this.formulario.get('porcentaje').value;
    if (this.porEscala == true) {
      for (let i = 0; i < this.listaFiltrada.length; i++) {
        if (this.listaFiltrada[i].importeFijo != 0 && this.listaFiltrada[i].importeFijo != null)
          this.listaFiltrada[i].importeFijo = this.listaFiltrada[i].importeFijo - this.listaFiltrada[i].importeFijo * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijo = 0;

        if (this.listaFiltrada[i].precioUnitario != 0 && this.listaFiltrada[i].precioUnitario != null)
          this.listaFiltrada[i].precioUnitario = this.listaFiltrada[i].precioUnitario - this.listaFiltrada[i].precioUnitario * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitario = 0;
      }
    }
    else {
      for (let i = 0; i < this.listaFiltrada.length; i++) {
        if (this.listaFiltrada[i].importeFijoSeco != 0 && this.listaFiltrada[i].importeFijoSeco != null)
          this.listaFiltrada[i].importeFijoSeco = this.listaFiltrada[i].importeFijoSeco - this.listaFiltrada[i].importeFijoSeco * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijoSeco = 0;

        if (this.listaFiltrada[i].importeFijoRef != 0 && this.listaFiltrada[i].importeFijoRef != null)
          this.listaFiltrada[i].importeFijoRef = this.listaFiltrada[i].importeFijoRef - this.listaFiltrada[i].importeFijoRef * (porcentaje / 100);
        else
          this.listaFiltrada[i].importeFijoRef = 0;

        if (this.listaFiltrada[i].precioUnitarioRef != 0 && this.listaFiltrada[i].precioUnitarioRef != null)
          this.listaFiltrada[i].precioUnitarioRef = this.listaFiltrada[i].precioUnitarioRef - this.listaFiltrada[i].precioUnitarioRef * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitarioRef = 0;

        if (this.listaFiltrada[i].precioUnitarioSeco != 0 && this.listaFiltrada[i].precioUnitarioSeco != null)
          this.listaFiltrada[i].precioUnitarioSeco = this.listaFiltrada[i].precioUnitarioSeco - this.listaFiltrada[i].precioUnitarioSeco * (porcentaje / 100);
        else
          this.listaFiltrada[i].precioUnitarioSeco = 0;
      }
    }
  }
  //Valida que la nueva fechaDesde sea mayor a la de precioDesde
  public validarNuevaFechaDesde() {
    if (Date.parse(this.formulario.get('precioDesde').value) > Date.parse(this.formulario.get('fechaDesde').value)) {
      document.getElementById('btn-confirm').focus();
      if (this.porEscala == true) {
        for (let i = 0; i < this.listaFiltrada.length; i++) {
          this.listaFiltrada[i].preciosDesde = this.formulario.get('precioDesde').value;
        }
      }
      else {
        for (let i = 0; i < this.listaFiltrada.length; i++) {
          this.listaFiltrada[i].preciosDesde = this.formulario.get('precioDesde').value;
        }
      }
    }
    else {
      this.formulario.get('precioDesde').setValue(null);
      document.getElementById('idNuevoPrecioDesde').focus();
      this.toastr.error("¡La nueva fecha debe ser mayor a la anterior!");
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
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
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.setDecimales(valor, cantidad);
  }
}
//Componente Lista de Precios
@Component({
  selector: 'lista-precios-dialogo',
  templateUrl: 'lista-precios.html',
})
export class ListaPreciosDialogo {
  //Define la empresa 
  public fecha: string;
  //Define la variable como un booleano
  public porEscala: boolean;
  //Define la lista de usuarios activos de la empresa
  public listaPrecios: Array<any> = [];
  //Constructor
  constructor(public dialogRef: MatDialogRef<ListaPreciosDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.listaPrecios = this.data.listaFiltrada;
    this.fecha = this.data.fecha;
    this.porEscala = this.data.porEscala; //controlo que tabla muestro en el modal
  }
  onNoClick(): void {
    this.dialogRef.close();
    document.getElementById('idActualizacion').focus();
  }
}
//Componente Confirmar
@Component({
  selector: 'confirmar-dialogo',
  templateUrl: 'confirmar-modal.html',
})
export class ConfimarDialogo {
  //Define el formulario que envía a la base de datos
  public formulario: Array<any> = [];
  //Define la variable como un booleano
  public porEscala: boolean;
  //Define la Orden Venta seleccionada
  public ordenVenta: FormControl = new FormControl();
  //Constructor
  constructor(public dialogRef: MatDialogRef<ConfimarDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
    private ordenVentaTramoServicio: OrdenVentaTramoService, private ordenVentaEscalaServicio: OrdenVentaEscalaService) { }
  //Al inicializarse el componente
  ngOnInit() {
    this.formulario = this.data.formulario;
    //Controlo que tabla muestro en el modal
    this.porEscala = this.data.porEscala;
    this.ordenVenta.setValue(this.data.ordenVenta);
  }
  //Actualiza
  public actualizar() {
    //Agrega a cada registro los datos de la orden venta seleccionada
    for (let i = 0; i < this.formulario.length; i++) {
      this.formulario[i]['ordenVenta'] = this.ordenVenta.value;
      this.formulario[i]['id'] = 0;
      this.formulario[i]['version'] = 0;
    }
    if (this.porEscala == true) {
      this.ordenVentaEscalaServicio.agregarLista(this.formulario).subscribe(
        res => {
          var respuesta = res.json();
          if (respuesta.codigo == 201) {
            setTimeout(function () {
              document.getElementById('idBuscarPor').focus();
            }, 20);
            this.toastr.success(respuesta.mensaje);
          }
        },
        err => {
          var respuesta = err.json();
          if (respuesta.codigo == 11002) {
            document.getElementById("labelNombre").classList.add('label-error');
            document.getElementById("idNombre").classList.add('is-invalid');
            document.getElementById("idNombre").focus();
            this.toastr.error(respuesta.mensaje);
          }
        }
      );
    } else {
      this.ordenVentaTramoServicio.agregarLista(this.formulario).subscribe(
        res => {
          var respuesta = res.json();
          if (respuesta.codigo == 201) {
            setTimeout(function () {
              document.getElementById('idBuscarPor').focus();
            }, 20);
            this.toastr.success(respuesta.mensaje);
          }
        },
        err => {
          var respuesta = err.json();
          if (respuesta.codigo == 11002) {
            document.getElementById("labelNombre").classList.add('label-error');
            document.getElementById("idNombre").classList.add('is-invalid');
            document.getElementById("idNombre").focus();
            this.toastr.error(respuesta.mensaje);
          }
        }
      );
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}