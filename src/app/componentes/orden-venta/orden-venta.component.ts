import { Component, OnInit } from '@angular/core';
import { OrdenVentaService } from '../../servicios/orden-venta.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VendedorService } from '../../servicios/vendedor.service';
import { TipoTarifaService } from '../../servicios/tipo-tarifa.service';
import { EscalaTarifaService } from '../../servicios/escala-tarifa.service';
import { TramoService } from '../../servicios/tramo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../servicios/app.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

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
  //Define el form control para el preciosDesde de cada registro
  public preciosDesde: FormControl = new FormControl('', Validators.required);
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define la lista de resultados de busqueda vendedor
  public resultadosVendedores = [];
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
  //Define el estado de tipo tarifa
  public tipoTarifaEstado: boolean = false;
  //Define el id de la tabla escala para las actualizaciones
  public idModEscala: any;
  //Define la lista de precios desde
  public preciosDesdeLista: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define importes por
  public importePor:FormControl = new FormControl();
  //Define importes seco por
  public importeSecoPor:FormControl = new FormControl();
  //Define importes ref por
  public importeRefPor:FormControl = new FormControl();
  //Define la escala actual
  public escalaActual:any;
  //Constructor
  constructor(private servicio: OrdenVentaService, private subopcionPestaniaService: SubopcionPestaniaService,
    private toastr: ToastrService, private empresaSevicio: EmpresaService, private clienteServicio: ClienteService,
    private vendedorServicio: VendedorService, private tipoTarifaServicio: TipoTarifaService,
    private escalaTarifaServicio: EscalaTarifaService, private appService: AppService,
    private tramoServicio: TramoService, private ordenVenta: OrdenVenta, private ordenVentaServicio: OrdenVentaService,
    private ordenVentaEscala: OrdenVentaEscala, private ordenVentaTramo: OrdenVentaTramo,
    private ordenVentaEscalaServicio: OrdenVentaEscalaService, private ordenVentaTramoServicio: OrdenVentaTramoService,
    private loaderService: LoaderService) {
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
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
    // this.servicio.listaCompleta.subscribe(res => {
    //   this.listaCompleta = res;
    // });
    //Se subscribe al servicio de lista por orden venta
    // this.ordenVentaEscalaServicio.listaEscalas.subscribe(res => {
    //   this.listaDeEscalas = res;
    // });
    //Autocompletado - Buscar por nombre
    this.buscar.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.servicio.listarPorNombre(data).subscribe(response => {
          this.resultados = response;
        })
      }
    });
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario de orden venta
    this.formulario = this.ordenVenta.formulario;
    //Define el formulario de orden venta escala
    this.formularioEscala = this.ordenVentaEscala.formulario;
    //Define el formulario de orden venta tramo
    this.formularioTramo = this.ordenVentaTramo.formulario;
    //Obtiene la lista de tipos de tarifa
    this.listarTiposTarifas();
    //Obtiene la lista de empresas
    this.listarEmpresas();
    //Obtiene la lista de Vendedores
    this.listarVendedores();
    //Selecciona la pestania agregar por defecto
    this.seleccionarPestania(1, 'Agregar', 0);
    //Autocompletado - Buscar por nombre cliente
    this.formulario.get('cliente').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.clienteServicio.listarPorAlias(data).subscribe(response => {
          this.resultadosClientes = response;
        })
      }
    });
    //Autocompletado Tramo - Buscar por nombre
    this.formularioTramo.get('tramo').valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.tramoServicio.listarPorOrigen(data).subscribe(response => {
          this.resultadosTramos = response;
        })
      }
    });
  }
  //Obtiene la mascara de importe
  public mascaraImporte(intLimite, decimalLimite) {
    return this.appService.mascararImporte(intLimite, decimalLimite);
  }
  //Obtiene la mascara de porcentaje
  public mascararPorcentaje() {
    return this.appService.mascararPorcentaje();
  }
  //Obtiene la mascara de km
  public obtenerMascaraKm(intLimite) {
    return this.appService.mascararKm(intLimite);
  }
  //Obtiene la lista de precios desde
  private obtenerPreciosDesde() {
    this.loaderService.show();
    let opcion = this.formulario.get('tipoTarifa').value.porEscala;
    if (opcion) {
      this.ordenVentaEscalaServicio.listarFechasPorOrdenVenta(this.ordenventa.value.id).subscribe(
        res => {
          this.preciosDesdeLista = res.json();
          this.loaderService.hide();
        }
      );
    } else {
      this.ordenVentaTramoServicio.listarFechasPorOrdenVenta(this.ordenventa.value.id).subscribe(
        res => {
          this.preciosDesdeLista = res.json();
          this.loaderService.hide();
        }
      );
    }
  }
  //Obtiene la lista de orden venta escala o orden venta tramo
  public cambioPreciosDesde(): void {
    this.loaderService.show();
    let tipoTarifa = this.formulario.get('tipoTarifa').value.porEscala;
    let ordenVenta = this.ordenventa.value.id;
    let precioDesde = this.preciosDesde.value;
    if (tipoTarifa) {
      this.ordenVentaEscalaServicio.listarPorOrdenVentaYPreciosDesde(ordenVenta, precioDesde).subscribe(res => {
        this.listaDeEscalas = res.json();
        for (let i = 0; i < this.listaDeEscalas.length; i++) {
          this.eliminarElementoEscalas(this.listaDeEscalas[i].escalaTarifa.valor);
        }
        this.listaDeEscalas.sort((a, b) => (a.escalaTarifa.valor > b.escalaTarifa.valor) ? 1 : -1);
        this.loaderService.hide();
      });
    } else {
      this.ordenVentaTramoServicio.listarPorOrdenVentaYPreciosDesde(ordenVenta, precioDesde).subscribe(res => {
        this.listaDeTramos = res.json();
        this.loaderService.hide();
      });
    }
  }
  //Cambio tipo tarifa
  public cambioTipoTarifa(): void {
    let tipoTarifa = this.formulario.get('tipoTarifa').value;
    if (tipoTarifa) {
      if (!tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
        this.formularioEscala.get('porcentaje').setValue(null);
        this.formularioEscala.get('porcentaje').disable();
        this.tipoTarifaEstado = false;
      } else if (tipoTarifa.porPorcentaje && tipoTarifa.porEscala) {
        this.formularioEscala.get('importeFijo').setValue(null);
        this.formularioEscala.get('precioUnitario').setValue(null);
        this.formularioEscala.get('importeFijo').disable();
        this.formularioEscala.get('precioUnitario').disable();
        this.formularioEscala.get('porcentaje').enable();
        this.tipoTarifaEstado = true;
      } else if(!tipoTarifa.porPorcentaje && !tipoTarifa.porEscala) {
        this.importeSecoPor.setValue(false);
        this.importeRefPor.setValue(false);
        this.cambioImportesSecoPor();
        this.cambioImportesRefPor();
      }
    }
  }
  //Establece los valores por defecto
  private establecerValoresPorDefecto(tipoOrdenVenta) {
    this.formulario.get('tipoOrdenVenta').setValue(tipoOrdenVenta);
    this.formulario.get('seguro').setValue(this.appService.desenmascararPorcentaje('8', 2));
    this.formulario.get('comisionCR').setValue(this.appService.establecerDecimales('0', 2));
    this.formulario.get('esContado').setValue(false);
    this.importePor.setValue(false);
    this.cambioImportesPor();
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
        this.establecerValoresPorDefecto(true);
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
    this.loaderService.show();
    switch (tipo) {
      case 'empresa':
        this.ordenVentaServicio.listarPorEmpresa(this.formulario.get('empresa').value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
          }
        );
        break;
      case 'cliente':
        this.reestablecerCampos(this.formulario.get('cliente').value);
        this.formulario.get('cliente').setValue(this.formulario.get('cliente').value);
        this.formulario.get('empresa').setValue(null);
        this.ordenVentaServicio.listarPorCliente(this.formulario.get('cliente').value.id).subscribe(
          res => {
            this.ordenesVentas = res.json();
            this.loaderService.hide();
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
    this.reestablecerCampos(null);
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    if (opcion == 0) {
      this.elemAutocompletado = null;
      this.resultados = [];
    }
    this.listarEscalaTarifa();
    switch (id) {
      case 1:
        this.establecerCamposSoloLectura(1);
        this.establecerValoresPorDefecto(true);
        this.cambioTipoTarifa();
        this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
        break;
      case 2:
        this.establecerCamposSoloLectura(2);
        this.establecerValoresPorDefecto(true);
        this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
        break;
      case 3:
        this.establecerCamposSoloLectura(3);
        this.establecerValoresPorDefecto(true);
        this.cambioTipoTarifa();
        this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
        break;
      case 4:
        this.establecerCamposSoloLectura(4);
        this.establecerValoresPorDefecto(true);
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
        this.formulario.enable();
        this.preciosDesde.enable();
        if(this.formulario.valid && this.preciosDesde.valid) {
          if(this.listaDeEscalas.length > 0 || this.listaDeTramos.length > 0) {
            this.agregar();
          } else {
            this.toastr.error('La lista no puede estar vacia');
          }
        } else {
          this.toastr.error('Falta completar datos de formulario');
        }
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
    switch (pestania) {
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
        this.formulario.get('tipoTarifa').disable();
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
  //Al cambiar select importes por
  public cambioImportesPor(): void {
    let importesPor = this.importePor.value;
    if(importesPor) {
      this.formularioEscala.get('precioUnitario').enable();
      this.formularioEscala.get('precioUnitario').setValidators([Validators.required]);
      this.formularioEscala.get('importeFijo').setValidators([]);
      this.formularioEscala.get('importeFijo').setValue(null);
      this.formularioEscala.get('importeFijo').disable();
      this.formularioEscala.get('minimo').enable();
    } else {
      this.formularioEscala.get('importeFijo').enable();
      this.formularioEscala.get('importeFijo').setValidators([Validators.required]);
      this.formularioEscala.get('precioUnitario').setValidators([]);
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.formularioEscala.get('precioUnitario').disable();
      this.formularioEscala.get('minimo').disable();
    }
  }
  //Agrega un elemento a la lista de escalas
  private agregarElementoEscalas(elemento): void {
    this.escalas.push(elemento);
    this.escalas.sort((a, b) => (a.valor > b.valor) ? 1 : -1);
  }
  //Elimina un elemento de la lista de escalas
  private eliminarElementoEscalas(valor): void {
    for (let i = 0; i < this.escalas.length; i++) {
      if (this.escalas[i].valor == valor) {
        this.escalas.splice(i, 1);
        break;
      }
    }
  }
  //Contrala campos vacios
  public controlarCamposVaciosEscala(formulario) {
    if(formulario.get('importeFijo').value == 'NaN') {
      formulario.get('importeFijo').setValue('0.00');
    } 
    if(formulario.get('precioUnitario').value == 'NaN') {
      formulario.get('precioUnitario').setValue('0.00');
    }
    if(formulario.get('minimo').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
  }
  //Vacia el campo
  public vaciarCampo(opcion): void {
    if(opcion == 1) {
      this.formularioEscala.get('precioUnitario').reset();
    } else {
      this.formularioEscala.get('importeFijo').reset();
    }
  }
  //Agrega una Escala a listaDeEscalas
  public agregarEscalaLista() {
    this.idModEscala = null;
    this.eliminarElementoEscalas(this.formularioEscala.get('escalaTarifa').value.valor);
    this.formularioEscala.get('preciosDesde').setValue(this.preciosDesde.value);
    this.controlarCamposVaciosEscala(this.formularioEscala);
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      this.formularioEscala.get('id').setValue(null);
      this.formularioEscala.get('ordenVenta').setValue({ id: this.ordenventa.value.id });
      this.ordenVentaEscalaServicio.agregar(this.formularioEscala.value).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.formulario.disable();
      this.preciosDesde.disable();
      this.listaDeEscalas.push(this.formularioEscala.value);
      this.listaDeEscalas.sort((a, b) => (a.escalaTarifa.valor > b.escalaTarifa.valor) ? 1 : -1);
    }
    this.formularioEscala.reset();
    this.importePor.setValue(false);
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Actualiza una Escala a listaDeEscalas
  public actualizarEscalaLista() {
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      this.ordenVentaEscalaServicio.actualizar(this.formularioEscala.value).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.listaDeEscalas[this.idModEscala] = this.formularioEscala.value;
    }
    this.formularioEscala.reset();
    this.idModEscala = null;
    this.importePor.setValue(false);
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Cancela una Escala a listaDeEscalas
  public cancelarEscalaLista() {
    this.formularioEscala.reset();
    this.idModEscala = null;
    this.importePor.setValue(false);
    this.eliminarElementoEscalas(this.escalaActual.valor);
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Elimina una Escala a listaDeEscalas
  public eliminarEscalaLista(indice, elemento) {
    this.agregarElementoEscalas(elemento.escalaTarifa);
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      elemento.ordenVenta = { id: this.ordenventa.value.id };
      this.ordenVentaEscalaServicio.eliminar(elemento).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.listaDeEscalas.splice(indice, 1);
    }
    if (this.listaDeEscalas.length == 0) {
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
    this.escalaActual = escala.escalaTarifa;
    this.agregarElementoEscalas(escala.escalaTarifa);
    if(this.indiceSeleccionado != 1) {
      escala.ordenVenta = { id: this.ordenventa.value.id };
    }
    this.formularioEscala.patchValue(escala);
    if (escala.importeFijo) {
      this.formularioEscala.get('importeFijo').setValue(parseFloat(escala.importeFijo).toFixed(2));
      this.formularioEscala.get('precioUnitario').setValue(null);
      this.importePor.setValue(false);
      this.cambioImportesPor();
    } 
    if(escala.precioUnitario) {
      this.formularioEscala.get('precioUnitario').setValue(parseFloat(escala.precioUnitario).toFixed(2));
      this.formularioEscala.get('importeFijo').setValue(null);
      this.importePor.setValue(true);
      this.cambioImportesPor();
    }
    this.formularioEscala.get('porcentaje').setValue(parseFloat(escala.porcentaje).toFixed(2));
    this.formularioEscala.get('minimo').setValue(parseFloat(escala.minimo).toFixed(2));
    setTimeout(function () {
      document.getElementById('idEscala').focus();
    }, 20);
  }
  //Al cambiar select importes seco por
  public cambioImportesSecoPor(): void {
    let importesPor = this.importeSecoPor.value;
    if(!importesPor) {
      this.formularioTramo.get('importeFijoSeco').enable();
      this.formularioTramo.get('importeFijoSeco').setValidators([Validators.required]);
      this.formularioTramo.get('precioUnitarioSeco').setValidators([]);
      this.formularioTramo.get('precioUnitarioSeco').setValue(null);
      this.formularioTramo.get('precioUnitarioSeco').disable();
    } else {
      this.formularioTramo.get('precioUnitarioSeco').enable();
      this.formularioTramo.get('precioUnitarioSeco').setValidators([Validators.required]);
      this.formularioTramo.get('importeFijoSeco').setValidators([]);
      this.formularioTramo.get('importeFijoSeco').setValue(null);
      this.formularioTramo.get('importeFijoSeco').disable();
    }
  }
  //Al cambiar select importes ref por
  public cambioImportesRefPor(): void {
    let importesPor = this.importeRefPor.value;
    if(!importesPor) {
      this.formularioTramo.get('importeFijoRef').enable();
      this.formularioTramo.get('importeFijoRef').setValidators([Validators.required]);
      this.formularioTramo.get('precioUnitarioRef').setValidators([]);
      this.formularioTramo.get('precioUnitarioRef').setValue(null);
      this.formularioTramo.get('precioUnitarioRef').disable();
    } else {
      this.formularioTramo.get('precioUnitarioRef').enable();
      this.formularioTramo.get('precioUnitarioRef').setValidators([Validators.required]);
      this.formularioTramo.get('importeFijoRef').setValidators([]);
      this.formularioTramo.get('importeFijoRef').setValue(null);
      this.formularioTramo.get('importeFijoRef').disable();
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramo(tipoPrecio) {
    switch (tipoPrecio) {
      case 1:
        let importeFijoSeco = this.formularioTramo.get('importeFijoSeco').value;
        if (importeFijoSeco) {
          this.formularioTramo.get('importeFijoSeco').setValue(this.appService.establecerDecimales(importeFijoSeco, 2));
          this.formularioTramo.get('importeFijoSeco').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioSeco').setValidators([]);
          this.formularioTramo.get('precioUnitarioSeco').setValue(null);
        }
        break;
      case 2:
        let precioUnitarioSeco = this.formularioTramo.get('precioUnitarioSeco').value;
        if (precioUnitarioSeco) {
          this.formularioTramo.get('precioUnitarioSeco').setValue(this.appService.establecerDecimales(precioUnitarioSeco, 2));
          this.formularioTramo.get('precioUnitarioSeco').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoSeco').setValidators([]);
          this.formularioTramo.get('importeFijoSeco').setValue(null);
        }
        break;
    }
  }
  //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
  public controlPreciosTramoRef(tipoPrecio) {
    switch (tipoPrecio) {
      case 1:
        let importeFijoRef = this.formularioTramo.get('importeFijoRef').value;
        if (importeFijoRef) {
          this.formularioTramo.get('importeFijoRef').setValue(this.appService.establecerDecimales(importeFijoRef, 2));
          this.formularioTramo.get('importeFijoRef').setValidators([Validators.required]);
          this.formularioTramo.get('precioUnitarioRef').setValidators([]);
          this.formularioTramo.get('precioUnitarioRef').setValue(null);
        }
        break;
      case 2:
        let precioUnitarioRef = this.formularioTramo.get('precioUnitarioRef').value;
        if (precioUnitarioRef) {
          this.formularioTramo.get('precioUnitarioRef').setValue(this.appService.establecerDecimales(precioUnitarioRef, 2));
          this.formularioTramo.get('precioUnitarioRef').setValidators([Validators.required]);
          this.formularioTramo.get('importeFijoRef').setValidators([]);
          this.formularioTramo.get('importeFijoRef').setValue(null);
        }
        break;
    }
  }
  //Contrala campos vacios
  public controlarCamposVaciosTramo(formulario) {
    if(formulario.get('importeFijoSeco').value == 'NaN') {
      formulario.get('importeFijo').setValue('0.00');
    } 
    if(formulario.get('precioUnitarioSeco').value == 'NaN') {
      formulario.get('precioUnitario').setValue('0.00');
    }
    if(formulario.get('importeFijoRef').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
    if(formulario.get('precioUnitarioRef').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
    if(formulario.get('kmPactado').value == 'NaN') {
      formulario.get('minimo').setValue('0.00');
    }
  }
  //Agrega un Tramo a listaDeTramos
  public agregarTramoLista() {
    this.idModTramo = null;
    if (this.indiceSeleccionado != 3) {
      this.formulario.disable();
      this.preciosDesde.disable();
    }
    this.formularioTramo.get('preciosDesde').setValue(this.preciosDesde.value);
    this.controlarCamposVaciosTramo(this.formularioTramo);
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      this.formularioTramo.get('id').setValue(null);
      this.formularioTramo.get('ordenVenta').setValue({ id: this.ordenventa.value.id });
      this.ordenVentaTramoServicio.agregar(this.formularioTramo.value).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.listaDeTramos.push(this.formularioTramo.value);
    }
    this.formularioTramo.reset();
    this.resultadosTramos = [];
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Actualiza un tramo de lista de tramos
  public actualizarTramoLista() {
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      this.ordenVentaTramoServicio.actualizar(this.formularioTramo.value).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.listaDeTramos[this.idModTramo] = this.formularioTramo.value;
    }
    this.formularioTramo.reset();
    this.idModTramo = null;
    this.resultadosTramos = [];
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Cancela una Escala a listaDeEscalas
  public cancelarTramoLista() {
    this.formularioTramo.reset();
    this.idModTramo = null;
    this.resultadosTramos = [];
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Elimina un Tramo a listaDeTramos
  public eliminarTramoLista(indice, elemento) {
    if (this.indiceSeleccionado == 3) {
      this.loaderService.show();
      elemento.ordenVenta = { id: this.ordenventa.value.id };
      this.ordenVentaTramoServicio.eliminar(elemento).subscribe(res => {
        this.loaderService.hide();
        this.cambioPreciosDesde();
      });
    } else {
      this.listaDeTramos.splice(indice, 1);
    }
    if (this.listaDeTramos.length == 0) {
      this.formulario.enable();
      this.preciosDesde.enable();
      this.ordenventa.enable();
    }
    this.resultadosTramos = [];
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Modifica un Tramo de listaDeTramos
  public modificarTramoLista(tramo, indice) {
    this.idModTramo = indice;
    if(this.indiceSeleccionado != 1) {
      tramo.ordenVenta = { id: this.ordenventa.value.id };
    }
    this.formularioTramo.patchValue(tramo);
    if(tramo.importeFijoSeco) {
      this.formularioTramo.get('importeFijoSeco').setValue(parseFloat(tramo.importeFijoSeco).toFixed(2));
      this.importeSecoPor.setValue(false);
      this.cambioImportesSecoPor();
    } 
    if(tramo.precioUnitarioSeco) {
      this.formularioTramo.get('precioUnitarioSeco').setValue(parseFloat(tramo.precioUnitarioSeco).toFixed(2));
      this.importeSecoPor.setValue(true);
      this.cambioImportesSecoPor();
    }
    if(tramo.importeFijoRef) {
      this.formularioTramo.get('importeFijoRef').setValue(parseFloat(tramo.importeFijoRef).toFixed(2));
      this.importeRefPor.setValue(false);
      this.cambioImportesRefPor();
    }
    if(tramo.precioUnitarioRef) {
      this.formularioTramo.get('precioUnitarioRef').setValue(parseFloat(tramo.precioUnitarioRef).toFixed(2));
      this.importeRefPor.setValue(true);
      this.cambioImportesRefPor();
    }
    setTimeout(function () {
      document.getElementById('idTramo').focus();
    }, 20);
  }
  //Agrega un registro
  private agregar() {
    this.loaderService.show();
    this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas);
    this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos);
    this.ordenVentaServicio.agregar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 201) {
          this.reestablecerCampos(null);
          this.listarEscalaTarifa();
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro agregado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Actualiza un registro
  private actualizar() {
    this.loaderService.show();
    this.formulario.enable();
    this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas);
    this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos);
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        var respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.reestablecerCampos(null);
          this.establecerValoresPorDefecto(true);
          setTimeout(function () {
            document.getElementById('idTipoOrdenVenta').focus();
          }, 20);
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        var respuesta = err.json();
        if (respuesta.codigo == 5001) {
          this.toastr.warning(respuesta.mensaje, 'Registro actualizado con éxito');
        } else {
          this.toastr.error(respuesta.mensaje);
        }
        this.loaderService.hide();
      }
    );
  }
  //Carga los datos de la orden de venta seleccionada en los input
  public cargarDatosOrden() {
    this.listarEscalaTarifa();
    let orden = this.ordenventa.value;
    this.formulario.patchValue(orden);
    this.formulario.get('seguro').setValue(parseFloat(orden.seguro).toFixed(2));
    this.formulario.get('comisionCR').setValue(parseFloat(orden.comisionCR).toFixed(2));
    this.preciosDesde.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.obtenerPreciosDesde();
  }
  //Establece el tipo (empresa o cliente)
  public establecerTipo(): void {
    this.reestablecerCampos(null);
    let tipoOrdenVenta = this.formulario.get('tipoOrdenVenta').value;
    if (!tipoOrdenVenta) {
      this.listarOrdenesVentas('empresa');
    }
  }
  //Reestablecer campos
  private reestablecerCampos(cliente) {
    let tipoOrdenVenta = this.formulario.get('tipoOrdenVenta').value;
    this.preciosDesde.enable();
    this.preciosDesde.reset();
    this.formulario.enable();
    this.formulario.reset();
    this.formularioEscala.reset();
    this.formularioTramo.reset();
    this.ordenventa.reset();
    this.listaDeEscalas = [];
    this.listaDeTramos = [];
    this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
    this.establecerValoresPorDefecto(tipoOrdenVenta);
    this.formulario.get('empresa').setValue(this.appService.getEmpresa());
    this.formulario.get('empresa').disable();
    if (cliente != null) {
      this.formulario.get('cliente').setValue(cliente);
    }
    if (this.indiceSeleccionado != 1) {
      this.formulario.get('tipoTarifa').disable();
    }
    if (this.indiceSeleccionado == 2 || this.indiceSeleccionado == 4) {
      this.formulario.get('vendedor').disable();
    }
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
    if (valor) {
      formulario.setValue(this.appService.establecerDecimales(valor, cantidad));
    }
  }
  //Formatea el numero a x decimales
  public establecerDecimales(valor, cantidad) {
    if (valor != '') {
      return this.appService.setDecimales(valor, cantidad);
    }
  }
  //Establece los decimales de porcentaje
  public establecerPorcentaje(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararPorcentaje(formulario.value, cantidad));
  }
  //Desenmascara km
  public establecerKm(formulario, cantidad): void {
    formulario.setValue(this.appService.desenmascararKm(formulario.value));
  }
  //Habilita el boton agregar a tabla
  public habilitarBoton(formA, formB): boolean {
    if (this.listaDeEscalas.length != 0) {
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
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }  
}