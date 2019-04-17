import { Component, OnInit, isDevMode } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { TipoTarifaService } from '../../servicios/tipo-tarifa.service';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { TramoService } from '../../servicios/tramo.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define una lista
  public lista = null;
  //Define la lista para las Escalas agregadas
  public listaDeEscalas: Array<any> = [];
  //Define la lista para los tramos agregados
  public listaDeTramos: Array<any> = [];
  //Define la lista de pestanias
  public pestanias = null;
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioEscala: FormGroup;
  //Define un formulario para validaciones de campos
  public formularioTramo: FormGroup;
  //Define el elemento de autocompletado
  public elemAutocompletado: any = null;
  //Define el siguiente id
  public siguienteId: number = null;
  //Define el id del Tramo que se quiere modificar
  public idModTramo: number = null;
  //Define la lista completa de registros
  public listaCompleta: any = null;
  //Define la lista de empresas
  public empresas: any = null;
  //Define la lista de tipos de tarifas
  public tiposTarifas: any = [];
  //Define la lista de tramos para la segunda tabla
  public listaTramos: any = [];
  //Define el form control para las busquedas
  public buscar: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente: FormControl = new FormControl();
  //Define el form control para el preciosDesde de cada registro
  public preciosDesde: FormControl = new FormControl('', Validators.required);
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define el form control para las busquedas vendedor
  public buscarVendedor: FormControl = new FormControl();
  //Define la lista de resultados de busqueda vendedor
  public resultadosVendedores = [];
  //Define el form control para las busquedas tramo
  public buscarTramo: FormControl = new FormControl();
  //Define el form control para el combo ordenes de venta
  public ordenventa: FormControl = new FormControl();
  //Define la lista de ordenes de ventas
  public ordenesVentas: Array<any> = [];
  //Define la lista de resultados de busqueda tramo
  public resultadosTramos = [];
  //Define la lista de vendedores
  public vendedores: Array<any> = [];
  //Define la lista de escalas
  public escalas: Array<any> = [];
  //Define la mascara de porcentaje
  public porcentajeMascara:any;
  //Define el estado de tipo tarifa
  public tipoTarifaEstado:boolean = false;
  //Define el id de la tabla escala para las actualizaciones
  public idModEscala:any;
  //Define la lista de precios desde
  public preciosDesdeLista:Array<any> = [];
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private appComponent: AppComponent, private toastr: ToastrService, 
    private empresaSevicio: EmpresaService, private clienteServicio: ClienteService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService,
    private escalaTarifaServicio: EscalaTarifaService, private appService: AppService,
    private tramoServicio: TramoService, private ordenVenta: OrdenVenta, private ordenVentaServicio: OrdenVentaService,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ordenVentaTramoServicio: OrdenVentaTramoService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
          console.log(err);
        }
      );
    //Se subscribe al servicio de lista de registros
    this.servicio.listaCompleta.subscribe(res => {
      this.listaCompleta = res;
    });
    //Se subscribe al servicio de lista por orden venta
    this.ordenVentaEscalaServicio.listaEscalas.subscribe(res => {
      this.listaDeEscalas = res;
    });
    //Autocompletado - Buscar por nombre
    this.buscar.valueChanges
      .subscribe(data => {
        if (typeof data == 'string') {
          this.servicio.listarPorNombre(data).subscribe(response => {
            this.resultados = response;
          })
        }
      })
    //Autocompletado - Buscar por nombre cliente
    this.buscarCliente.valueChanges
      .subscribe(data => {
        if (typeof data == 'string') {
          this.clienteServicio.listarPorAlias(data).subscribe(response => {
            this.resultadosClientes = response;
          })
        }
      })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.ordenVenta.formulario;
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Obtiene la lista de escalas tarifas
    this.listarEscalaTarifa();
    //Obtiene la lista de tipos de tarifa
    this.listarTiposTarifas();
    //Selecciona la pestania agregar por defecto
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado Tramo - Buscar por nombre
    this.formularioTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.tramoServicio.listarPorOrigen(data).subscribe(response => {
          this.resultadosTramos = response;
        })
      }
    });
    //Obtiene la mascara de porcentaje
    this.porcentajeMascara = this.appService.mascararPorcentaje();
  }
  //Obtiene la mascara de importe
  public obtenerMascaraImporte(intLimite) {
    return this.appService.mascararImporte(intLimite);
  }
  //Obtiene la mascara de km
  public obtenerMascaraKm(intLimite) {
    return this.appService.mascararKm(intLimite);
  }
  //Obtiene la lista de precios desde
  private obtenerPreciosDesde() {
    let opcion = this.formulario.get('tipoTarifa').value.porEscala;
    if (opcion) {
      this.ordenVentaEscalaServicio.listarFechasPorOrdenVenta(this.ordenventa.value.id).subscribe(
        res => {
          this.preciosDesdeLista = res.json();
        }
      );
    } else {
      this.ordenVentaTramoServicio.listarPorOrdenVenta(this.ordenventa.value.id).subscribe(
        res => {
          this.preciosDesdeLista = res.json();
        }
      );
    }
  }
  //Obtiene la lista de orden venta escala o orden venta tramo
  public cambioPreciosDesde(): void {
    let tipoTarifa = this.formulario.get('tipoTarifa').value.porEscala;
    let ordenVenta = this.ordenventa.value.id;
    let precioDesde = this.preciosDesde.value;
    if(tipoTarifa) {
      this.ordenVentaEscalaServicio.listarPorOrdenVentaYPreciosDesde(ordenVenta, precioDesde).subscribe(res => {
        this.listaDeEscalas = res.json();
      });
    } else {
      this.ordenVentaTramoServicio.listarPorOrdenVentaYPreciosDesde(ordenVenta, precioDesde).subscribe(res => {
        this.listaDeTramos = res.json();
      });
    }
  }
  //Cambio tipo tarifa
  public cambioTipoTarifa(): void {
    let tipoTarifa = this.formulario.get('tipoTarifa').value;
    if(!tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
      this.formularioEscala.get('porcentaje').setValue(null);
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('porcentaje').disable();
      this.tipoTarifaEstado = false;
    } else if(tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('porcentaje').enable();
      this.tipoTarifaEstado = true;
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto() {
    this.formulario.get('tipoOrdenVenta').setValue(true);
    this.formulario.get('seguro').setValue(this.appService.desenmascararPorcentaje('8', 2));
    this.formulario.get('comisionCR').setValue(this.appService.establecerDecimales('0', 2));
  }
  //Obtiene la lista de empresas
  private listarEmpresas() {
    this.empresaSevicio.listar().subscribe(
      res => {
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    )
  }
  //Obtiene la lista de tipos de tarifas
  private listarTiposTarifas() {
    this.tipoTarifaServicio.listar().subscribe(
      res => {
        this.tiposTarifas = res.json();
        this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
        this.establecerValoresPorDefecto();
        this.cambioTipoTarifa();
      },
      err => {
        console.log(err);
      }
    )
  }
  //Obtiene la lista de vendedores
  private listarVendedores() {
    this.vendedorServicio.listar().subscribe(res => {
      this.vendedores = res.json();
    });
  }
  //Obtiene una lista de escalas tarifas
  private listarEscalaTarifa() {
    this.escalaTarifaServicio.listar().subscribe(res => {
      this.escalas = res.json();
    });
  }
  //Listar ordenes de ventas por Empresa/Cliente
  public listarOrdenesVentas(tipo) {
    switch (tipo) {
      case 'empresa':
        this.ordenVentaServicio.listarPorEmpresa(this.formulario.get('empresa').value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
          }
        );
        break;
      case 'cliente':
        this.formulario.get('cliente').setValue(this.buscarCliente.value);
        this.formulario.get('empresa').setValue(null);
        this.ordenVentaServicio.listarPorCliente(this.buscarCliente.value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
          }
        );
        break;
    }
  }
  //Vacia la lista de resultados de autocompletados
  public vaciarLista() {
    this.resultados = [];
    this.resultadosClientes = [];
    this.resultadosVendedores = [];
    this.resultadosTramos = [];
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.reestablecerCampos();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
    }
    switch (id) {
      case 1:
        this.establecerCamposSoloLectura(1);
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
        break;
      case 2:
        this.establecerCamposSoloLectura(2);
        this.establecerValoresPorDefecto();
        this.cambioTipoTarifa();
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
        break;
      case 3:
        this.establecerCamposSoloLectura(3);
        this.establecerValoresPorDefecto();
        this.cambioTipoTarifa();
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
        break;
      case 4:
        this.establecerCamposSoloLectura(4);
        this.establecerValoresPorDefecto();
        this.cambioTipoTarifa();
        this.establecerValoresPestania(nombre, true, true, true, 'idTipoOrdenVenta');
        break;
      default:
        break;
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  public accion(indice) {
    switch (indice) {
      case 1:
        this.agregar();
        break;
      case 3:
        this.actualizar();
        break;
      case 4:
        this.eliminar();
        break;
      default:
        break;
    }
  }
  //Establece campos solo lectura
  private establecerCamposSoloLectura(pestania): void {
    switch(pestania) {
      case 1:
        this.formulario.get('vendedor').enable();
        this.formulario.get('tipoTarifa').enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        break;
      case 2:
        this.formulario.get('vendedor').disable();
        this.formulario.get('tipoTarifa').disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        break;
      case 3:
        this.formulario.get('vendedor').enable();
        this.formulario.get('tipoTarifa').enable();
        this.formularioEscala.enable();
        this.formularioTramo.enable();
        break;
      case 4:
        this.formulario.get('vendedor').disable();
        this.formulario.get('tipoTarifa').disable();
        this.formularioEscala.disable();
        this.formularioTramo.disable();
        break;
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA ESCALA
  public controlPrecios(tipoPrecio) {
    let importeFijo = this.formularioEscala.get('importeFijo').value;
    importeFijo = this.appService.establecerDecimales(importeFijo, 2);
    let precioUnitario = this.formularioEscala.get('precioUnitario').value;
    precioUnitario = this.appService.establecerDecimales(precioUnitario, 2);
    switch (tipoPrecio) {
      case 1:
        if (importeFijo) {
          this.formularioEscala.get('importeFijo').setValidators([Validators.required]);
          this.formularioEscala.get('precioUnitario').setValidators([]);
          this.formularioEscala.get('precioUnitario').setValue(null);
        }
        break;
      case 2:
        if (precioUnitario) {
          this.formularioEscala.get('precioUnitario').setValidators([Validators.required]);
          this.formularioEscala.get('importeFijo').setValidators([]);
          this.formularioEscala.get('importeFijo').setValue(null);
        }
        break;
    }
  }
  //Agrega una Escala a listaDeEscalas
  public agregarEscalaLista() {
    this.idModEscala = null;
    this.formulario.disable();
    this.preciosDesde.disable();
    this.formularioEscala.get('preciosDesde').setValue(this.preciosDesde.value);
    if(this.indiceSeleccionado == 3) {
      this.ordenventa.disable();
      this.formularioEscala.get('ordenVenta').setValue({id: this.ordenventa.value.id});
      this.ordenVentaEscalaServicio.agregar(this.formularioEscala.value).subscribe(res => {});
    } else {
      this.listaDeEscalas.push(this.formularioEscala.value);
      this.listaDeEscalas.sort((a, b) => (a.escalaTarifa.valor > b.escalaTarifa.valor) ? 1 : -1)
    }
    this.formularioEscala.reset();
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Actualiza una Escala a listaDeEscalas
  public actualizarEscalaLista() {
    if(this.indiceSeleccionado == 3) {
      this.ordenVentaEscalaServicio.actualizar(this.formularioEscala.value).subscribe(res => {});
    } else {
      this.listaDeEscalas[this.idModEscala] = this.formularioEscala.value;
    }
    this.formularioEscala.reset();
    this.idModEscala = null;
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Cancela una Escala a listaDeEscalas
  public cancelarEscalaLista() {
    this.formularioEscala.reset();
    this.idModEscala = null;
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Elimina una Escala a listaDeEscalas
  public eliminarEscalaLista(indice, elemento) {
    if(this.indiceSeleccionado == 3) {
      elemento.ordenVenta = {id: this.ordenventa.value.id};
      this.ordenVentaEscalaServicio.eliminar(elemento).subscribe(res => {});
    } else {
      this.listaDeEscalas.splice(indice, 1);
    }
    if(this.listaDeEscalas.length == 0) {
      this.preciosDesde.enable();
      this.formulario.enable();
      this.ordenventa.enable();
    }
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Modifica una Escala de listaDeEscalas
  public modificarEscalaLista(escala, id) {
    this.idModEscala = id;
    escala.ordenVenta = {id: this.ordenventa.value.id};
    this.formularioEscala.patchValue(escala);
    if(escala.importeFijo != 0) {
      this.formularioEscala.get('importeFijo').setValue(parseFloat(escala.importeFijo).toFixed(2));
      this.formularioEscala.get('precioUnitario').setValue(null);
    } else {
      this.formularioEscala.get('precioUnitario').setValue(parseFloat(escala.precioUnitario).toFixed(2));
      this.formularioEscala.get('importeFijo').setValue(null);
    }
    this.formularioEscala.get('porcentaje').setValue(parseFloat(escala.porcentaje).toFixed(2));
    this.formularioEscala.get('minimo').setValue(parseFloat(escala.minimo).toFixed(2));
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramo(tipoPrecio) {
    let importeFijoSeco = this.formularioTramo.get('importeFijoSeco').value;
    importeFijoSeco = this.appService.establecerDecimales(importeFijoSeco, 2);
    let precioUnitarioSeco = this.formularioTramo.get('precioUnitarioSeco').value;
    precioUnitarioSeco = this.appService.establecerDecimales(precioUnitarioSeco, 2);
    switch (tipoPrecio) {
      case 1:
        if (importeFijoSeco != null) {
          this.formularioTramo.get('importeFijoSeco').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioSeco').setValidators([]);
          this.formularioTramo.get('precioUnitarioSeco').setValue(null);
        }
        break;
      case 2:
        if (precioUnitarioSeco != null) {
          this.formularioTramo.get('precioUnitarioSeco').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoSeco').setValidators([]);
          this.formularioTramo.get('importeFijoSeco').setValue(null);
        }
        break;
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramoRef(tipoPrecio) {
    let importeFijoRef = this.formularioTramo.get('importeFijoRef').value;
    importeFijoRef = this.appService.establecerDecimales(importeFijoRef, 2);
    let precioUnitarioRef = this.formularioTramo.get('precioUnitarioRef').value;
    precioUnitarioRef = this.appService.establecerDecimales(precioUnitarioRef, 2);
    switch (tipoPrecio) {
      case 1:
        if (importeFijoRef != null) {
          this.formularioTramo.get('importeFijoRef').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioRef').setValidators([]);
          this.formularioTramo.get('precioUnitarioRef').setValue(null);
        }
        break;
      case 2:
        if (precioUnitarioRef != null) {
          this.formularioTramo.get('precioUnitarioRef').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoRef').setValidators([]);
          this.formularioTramo.get('importeFijoRef').setValue(null);
        }
        break;
    }
  }
  //Agrega un Tramo a listaDeTramos
  public agregarTramoLista() {
    this.idModTramo = null;
    this.formulario.disable();
    this.preciosDesde.disable();
    this.formularioTramo.get('preciosDesde').setValue(this.preciosDesde.value);
    if(this.indiceSeleccionado == 3) {
      this.ordenventa.disable();
      this.formularioTramo.get('ordenVenta').setValue({id: this.ordenventa.value.id});
      this.ordenVentaTramoServicio.agregar(this.formularioTramo.value).subscribe(res => {});
    } else {
      this.listaDeTramos.push(this.formularioTramo.value);
    }
    this.formularioTramo.reset();
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Actualiza un tramo de lista de tramos
  public actualizarTramoLista() {
    if(this.indiceSeleccionado == 3) {
      this.ordenVentaTramoServicio.actualizar(this.formularioTramo.value).subscribe(res => {});
    } else {
      this.listaDeTramos[this.idModTramo] = this.formularioTramo.value;
    }
    this.formularioTramo.reset();
    this.idModTramo = null;
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Cancela una Escala a listaDeEscalas
  public cancelarTramoLista() {
    this.formularioTramo.reset();
    this.idModTramo = null;
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Elimina un Tramo a listaDeTramos
  public eliminarTramoLista(indice, elemento) {
    if(this.indiceSeleccionado == 3) {
      elemento.ordenVenta = {id: this.ordenventa.value.id};
      this.ordenVentaTramoServicio.eliminar(elemento).subscribe(res => {});
    } else {
      this.listaDeTramos.splice(indice, 1);
    }
    if (this.listaDeTramos.length == 0) {
      this.formulario.enable();
      this.preciosDesde.enable();
      this.ordenventa.enable();
    }
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Modifica un Tramo de listaDeTramos
  public modificarTramoLista(tramo, indice) {
    this.idModTramo = indice;
    this.formularioTramo.patchValue(tramo);
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Agrega un registro
  private agregar() {
    this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas);
    this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos);
    this.ordenVentaServicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerCampos();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro agregado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas);
    this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerCampos();
          this.establecerValoresPorDefecto();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro actualizado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
      }
    );
  }
  //Carga los datos de la orden de venta seleccionada en los input
  public cargarDatosOrden() {
    let orden = this.ordenventa.value;
    this.formulario.patchValue(orden);
    this.formulario.get('seguro').setValue(parseFloat(orden.seguro).toFixed(2));
    this.formulario.get('comisionCR').setValue(parseFloat(orden.comisionCR).toFixed(2));
    this.preciosDesde.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.obtenerPreciosDesde();
  }
  //Reestablecer campos
  private reestablecerCampos() {
    this.preciosDesde.reset();
    this.formulario.reset();
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.ordenventa.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
  }
  //Elimina un registro
  private eliminar() {
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  }
  //Manejo de cambio de autocompletado tramo
  public cambioAutocompletadoTramo() {
    this.formularioTramo.get('kmTramo').setValue(this.formularioTramo.get('tramo').value.km);
  }
  //Formatea el numero a x decimales
  public setDecimales(formulario, cantidad) {
    let valor = formulario.value;
    if(valor != '') {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if(valor != '') {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararKm(formulario.value, cantidad));
  }
  //Habilita el boton agregar a tabla
  public habilitarBoton(formA, formB):boolean {
    if(this.listaDeEscalas.length != 0) {
      return formB;
    } else {
      return formA && formB;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Muestra el valor en los autocompletados
  public displayF(elemento) {
    if (elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados a
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.razonSocial ? elemento.razonSocial : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados b
  public displayFb(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Muestra el valor en los autocompletados c
  public displayFc(elemento) {
    if (elemento != undefined) {
      return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre 
        + ' - ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
}