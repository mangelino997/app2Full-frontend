"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var cliente_service_1 = require("src/app/servicios/cliente.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var cliente_eventual_component_1 = require("../cliente-eventual/cliente-eventual.component");
var emitirFactura_1 = require("src/app/modelos/emitirFactura");
var app_service_1 = require("src/app/servicios/app.service");
var sucursal_cliente_service_1 = require("src/app/servicios/sucursal-cliente.service");
var punto_venta_service_1 = require("src/app/servicios/punto-venta.service");
var tipo_comprobante_service_1 = require("src/app/servicios/tipo-comprobante.service");
var afip_comprobante_service_1 = require("src/app/servicios/afip-comprobante.service");
var venta_tipo_item_service_1 = require("src/app/servicios/venta-tipo-item.service");
var material_1 = require("@angular/material");
var viaje_propio_tramo_service_1 = require("src/app/servicios/viaje-propio-tramo.service");
var viaje_tercero_tramo_service_1 = require("src/app/servicios/viaje-tercero-tramo.service");
var viaje_remito_service_1 = require("src/app/servicios/viaje-remito.service");
var orden_venta_service_1 = require("src/app/servicios/orden-venta.service");
var orden_venta_escala_service_1 = require("src/app/servicios/orden-venta-escala.service");
var venta_item_concepto_service_1 = require("src/app/servicios/venta-item-concepto.service");
var EmitirFacturaComponent = /** @class */ (function () {
    function EmitirFacturaComponent(appComponent, dialog, fechaService, clienteService, toastr, factura, appService, sucursalService, puntoVentaService, tipoComprobanteservice, afipComprobanteService, ventaTipoItemService, viajeRemitoServicio, ordenVentaServicio, viajePropioTramoService, viajeTerceroTramoServicio, ordenVentaEscalaServicio, ventaItemConceptoService) {
        this.appComponent = appComponent;
        this.dialog = dialog;
        this.fechaService = fechaService;
        this.clienteService = clienteService;
        this.toastr = toastr;
        this.factura = factura;
        this.appService = appService;
        this.sucursalService = sucursalService;
        this.puntoVentaService = puntoVentaService;
        this.tipoComprobanteservice = tipoComprobanteservice;
        this.afipComprobanteService = afipComprobanteService;
        this.ventaTipoItemService = ventaTipoItemService;
        this.viajeRemitoServicio = viajeRemitoServicio;
        this.ordenVentaServicio = ordenVentaServicio;
        this.viajePropioTramoService = viajePropioTramoService;
        this.viajeTerceroTramoServicio = viajeTerceroTramoServicio;
        this.ordenVentaEscalaServicio = ordenVentaEscalaServicio;
        this.ventaItemConceptoService = ventaItemConceptoService;
        this.checked = false;
        this.indeterminate = false;
        this.labelPosition = 'after';
        this.disabled = false;
        //Define una lista
        this.lista = null;
        //Define el siguiente id
        this.siguienteId = null;
        //Define la lista completa de registros
        this.listaCompleta = null;
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define el form control para las busquedas cliente
        this.buscarCliente = new forms_1.FormControl();
        //Define el form control para los combos de Sucursales Remitente y Destinatario
        this.sucursalDestinatario = new forms_1.FormControl();
        this.sucursalRemitente = new forms_1.FormControl();
        //Define el form control para tipo de comprobante
        this.tipoComprobante = new forms_1.FormControl();
        //Define la lista de resultados de busqueda para Reminentes y Destinatarios
        this.resultadosReminentes = [];
        this.resultadosDestinatarios = [];
        //Define la lista de resultados para Puntos de Venta
        this.resultadosPuntoVenta = [];
        //Define la lista de resultados de busqueda localidad
        this.resultadosLocalidades = [];
        //Define la lista de resultados de sucursales para el Remitente y Destinatario
        this.resultadosSucursalesRem = [];
        this.resultadosSucursalesDes = [];
        //Define la lista de items
        this.resultadosItems = [];
        //Define la lista de Remitos
        this.resultadosRemitos = [];
        //Define la lista de Tarifas O. Vta.
        this.resultadosTarifas = [];
        //Define la lista de Conceptos Varios
        this.resultadosConceptosVarios = [];
        //Define el autocompletado para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la fecha actual
        this.fechaActual = null;
        //Define el array de los items-viajes para la tabla
        this.listaItemViaje = [];
        //Define si los campos son de solo lectura
        this.soloLectura = true;
        //Define los datos de la Empresa
        this.empresa = new forms_1.FormControl();
        //Define la lista de resultados de busqueda barrio
        this.resultadosBarrios = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    EmitirFacturaComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define el formulario de orden venta
        this.formulario = this.factura.formulario;
        this.formularioItem = this.factura.formularioViaje;
        this.reestablecerFormulario(undefined);
        //Lista los puntos de venta 
        this.listarPuntoVenta();
        //Lista los items
        this.listarItems();
        //Lista Tarifa 
        //Carga el tipo de comprobante
        this.tipoComprobanteservice.obtenerPorId(1).subscribe(function (res) {
            _this.formulario.get('tipoComprobante').setValue(res.json());
            _this.tipoComprobante.setValue(_this.formulario.get('tipoComprobante').value.nombre);
        });
        //Autcompletado - Buscar por Remitente
        this.formulario.get('remitente').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteService.listarPorAlias(data).subscribe(function (res) {
                    _this.resultadosReminentes = res;
                });
            }
        });
        //Autcompletado - Buscar por Destinatario
        this.formulario.get('destinatario').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteService.listarPorAlias(data).subscribe(function (res) {
                    _this.resultadosDestinatarios = res;
                });
            }
        });
    };
    //Obtiene la lista de Puntos de Venta
    EmitirFacturaComponent.prototype.listarPuntoVenta = function () {
        var _this = this;
        // let empresa= this.appComponent.getEmpresa();
        this.puntoVentaService.listarPorEmpresaYSucursal(this.empresa.value.id, this.appComponent.getUsuario().sucursal.id).subscribe(function (res) {
            _this.resultadosPuntoVenta = res.json();
            for (var i = 0; i < _this.resultadosPuntoVenta.length; i++) {
                if (_this.resultadosPuntoVenta[i].porDefecto == true) {
                    _this.formulario.get('puntoVenta').setValue(_this.resultadosPuntoVenta[i]);
                }
            }
        });
    };
    //Obtiene la lista de Items
    EmitirFacturaComponent.prototype.listarItems = function () {
        var _this = this;
        this.ventaTipoItemService.listarItems().subscribe(function (res) {
            console.log(res.json());
            _this.resultadosItems = res.json();
        });
    };
    //Obtiene el listado de Sucursales por Remitente
    EmitirFacturaComponent.prototype.listarSucursalesRemitente = function () {
        var _this = this;
        this.formulario.get('rem.domicilio').setValue(this.formulario.get('remitente').value.domicilio);
        this.formulario.get('rem.localidad').setValue(this.formulario.get('remitente').value.localidad.nombre);
        this.formulario.get('rem.condicionVenta').setValue(this.formulario.get('remitente').value.condicionVenta.nombre);
        this.formulario.get('rem.afipCondicionIva').setValue(this.formulario.get('remitente').value.afipCondicionIva.nombre);
        this.sucursalService.listarPorCliente(this.formulario.get('remitente').value.id).subscribe(function (res) {
            _this.resultadosSucursalesRem = res.json();
            _this.formulario.get('rem.sucursal').setValue(_this.resultadosSucursalesRem[0]);
        }, function (err) {
            _this.toastr.error("El Remitente no tiene asignada una sucursal de entrega.");
        });
    };
    //Obtiene el listado de Sucursales por Remitente
    EmitirFacturaComponent.prototype.listarSucursalesDestinatario = function () {
        var _this = this;
        this.formulario.get('des.domicilio').setValue(this.formulario.get('destinatario').value.domicilio);
        this.formulario.get('des.localidad').setValue(this.formulario.get('destinatario').value.localidad.nombre);
        this.formulario.get('des.condicionVenta').setValue(this.formulario.get('destinatario').value.condicionVenta.nombre);
        this.formulario.get('des.afipCondicionIva').setValue(this.formulario.get('destinatario').value.afipCondicionIva.nombre);
        this.sucursalService.listarPorCliente(this.formulario.get('destinatario').value.id).subscribe(function (res) {
            _this.resultadosSucursalesDes = res.json();
            _this.formulario.get('des.sucursal').setValue(_this.resultadosSucursalesDes[0]);
        }, function (err) {
            _this.toastr.error("El Destinatario no tiene asignada una sucursal de entrega.");
        });
    };
    //Abre el dialogo para agregar un cliente eventual
    EmitirFacturaComponent.prototype.agregarClienteEventual = function () {
        var _this = this;
        var dialogRef = this.dialog.open(cliente_eventual_component_1.ClienteEventualComponent, {
            width: '1200px',
            data: {
                formulario: null,
                usuario: this.appComponent.getUsuario()
            }
        });
        dialogRef.afterClosed().subscribe(function (resultado) {
            _this.clienteService.obtenerPorId(resultado).subscribe(function (res) {
                var cliente = res.json();
                _this.formulario.get('cliente').setValue(cliente);
            });
        });
    };
    //Reestablece el formulario completo
    EmitirFacturaComponent.prototype.reestablecerFormulario = function (id) {
        var _this = this;
        this.resultadosReminentes = [];
        this.resultadosDestinatarios = [];
        this.resultadosSucursalesRem = [];
        this.resultadosSucursalesDes = [];
        this.autocompletado.setValue(undefined);
        this.formulario.reset();
        this.soloLectura = true;
        this.empresa.setValue(this.appComponent.getEmpresa());
        this.formularioItem.get('remito').disable();
        this.formularioItem.get('tarifaOVta').disable();
        this.formularioItem.get('conceptosVarios').disable();
        this.formularioItem.get('importeConcepto').disable();
        this.fechaService.obtenerFecha().subscribe(function (res) {
            _this.formulario.get('fecha').setValue(res.json());
            _this.fechaActual = res.json();
        });
        setTimeout(function () {
            document.getElementById('idFecha').focus();
        }, 20);
    };
    //Reestablecer formulario item-viaje
    EmitirFacturaComponent.prototype.reestablecerFormularioItemViaje = function () {
        this.resultadosRemitos = [];
        this.formularioItem.reset();
        this.soloLectura = true;
        this.formularioItem.get('remito').disable();
        this.formularioItem.get('tarifaOVta').disable();
        this.formularioItem.get('conceptosVarios').disable();
        this.formularioItem.get('importeConcepto').disable();
        setTimeout(function () {
            document.getElementById('idItem').focus();
        }, 20);
        this.formularioItem.get('importeConcepto').disable();
    };
    //Controla los checkbox
    EmitirFacturaComponent.prototype.pagoEnOrigen = function () {
        var _this = this;
        if (this.formulario.get('pagoEnOrigen').value == true) {
            document.getElementById('Remitente').className = "border has-float-label pagaSeleccionado";
            document.getElementById('Destinatario').className = "border has-float-label";
            this.afipComprobanteService.obtenerLetra(this.formulario.get('remitente').value.id).subscribe(function (res) {
                _this.formulario.get('letra').setValue(res.text());
                _this.cargarCodigoAfip(res.text());
            });
        }
        else {
            document.getElementById('Remitente').className = "border has-float-label";
            document.getElementById('Destinatario').className = "border has-float-label pagaSeleccionado";
            this.afipComprobanteService.obtenerLetra(this.formulario.get('destinatario').value.id).subscribe(function (res) {
                _this.formulario.get('letra').setValue(res.text());
                _this.cargarCodigoAfip(res.text());
            });
        }
    };
    //Setea el codigo de Afip por el tipo de comprobante y la letra
    EmitirFacturaComponent.prototype.cargarCodigoAfip = function (letra) {
        var _this = this;
        this.afipComprobanteService.obtenerCodigoAfip(this.formulario.get('tipoComprobante').value.id, letra).subscribe(function (res) {
            _this.formulario.get('codigoAfip').setValue(res.text());
            _this.cargarNumero(res.text());
        });
    };
    //Setea el numero por el punto de venta y el codigo de Afip
    EmitirFacturaComponent.prototype.cargarNumero = function (codigoAfip) {
        var _this = this;
        console.log(this.formulario.value);
        this.puntoVentaService.obtenerNumero(this.formulario.get('puntoVenta').value.puntoVenta, codigoAfip, this.appComponent.getUsuario().sucursal.id, this.empresa.value.id).subscribe(function (res) {
            _this.formulario.get('numero').setValue(res.text());
        });
    };
    //Comprueba si ya existe un codigo de afip entonces vuelve a llamar a la funcion que obtiene el valor del campo Numero
    EmitirFacturaComponent.prototype.comprobarCodAfip = function () {
        console.log(this.formulario.value.codigoAfip);
        if (this.formulario.get('codigoAfip').value != null || this.formulario.get('codigoAfip').value > 0)
            this.cargarNumero(this.formulario.get('codigoAfip').value);
    };
    //Agrega al Array un item-viaje 
    EmitirFacturaComponent.prototype.agregarItemViaje = function () {
        console.log(this.listaItemViaje);
        this.listaItemViaje.push(this.formularioItem.value);
        this.reestablecerFormularioItemViaje();
    };
    //eliminar un item del Array item-viaje 
    EmitirFacturaComponent.prototype.eliminarItemViaje = function (index) {
        this.listaItemViaje.splice(index, 1);
        setTimeout(function () {
            document.getElementById('idItem').focus();
        }, 20);
    };
    //Habilita y carga los campos una vez que se selecciono el item
    EmitirFacturaComponent.prototype.habilitarCamposItem = function () {
        this.soloLectura = false;
        this.formularioItem.get('remito').enable();
        this.formularioItem.get('tarifaOVta').enable();
        this.formularioItem.get('conceptosVarios').enable();
        this.listarTarifaOVenta();
        this.listarConceptos();
    };
    // Habilita el campo Precio de Concepto Venta
    EmitirFacturaComponent.prototype.habilitarPrecioCV = function () {
        this.formularioItem.get('importeConcepto').enable();
    };
    //Obtiene la lista de Tarifas Orden Venta por Cliente
    EmitirFacturaComponent.prototype.listarTarifaOVenta = function () {
        var _this = this;
        console.log(this.formulario.value);
        if (this.formulario.get('pagoEnOrigen').value == true) {
            this.ordenVentaServicio.listarPorCliente(this.formulario.get('remitente').value.id).subscribe(function (res) {
                _this.resultadosTarifas = res.json();
                if (_this.resultadosTarifas.length == 0)
                    _this.listarTarifasOVentaEmpresa();
            });
        }
        else {
            this.ordenVentaServicio.listarPorCliente(this.formulario.get('destinatario').value.id).subscribe(function (res) {
                _this.resultadosTarifas = res.json();
                if (_this.resultadosTarifas.length == 0)
                    _this.listarTarifasOVentaEmpresa();
            });
        }
    };
    //Obtiene una lista de Conceptos Varios
    EmitirFacturaComponent.prototype.listarConceptos = function () {
        var _this = this;
        this.ventaItemConceptoService.listarPorTipoComprobante(1).subscribe(function (res) {
            _this.resultadosConceptosVarios = res.json();
        });
    };
    //Obtiene la lista de Tarifas Orden Venta por Empresa cuando en el Cliente no tiene asignada una lista de Orden Venta
    EmitirFacturaComponent.prototype.listarTarifasOVentaEmpresa = function () {
        var _this = this;
        this.ordenVentaServicio.listar().subscribe(function (res) {
            _this.resultadosTarifas = res.json();
        });
    };
    //Abre el dialogo para seleccionar un Tramo
    EmitirFacturaComponent.prototype.abrirDialogoTramo = function () {
        var _this = this;
        //Primero comprobar que ese numero de viaje exista y depsues abrir la ventana emergente
        console.log(this.formularioItem.get('numeroViaje').value);
        this.viajePropioTramoService.listarTramos(this.formularioItem.get('numeroViaje').value).subscribe(function (res) {
            var dialogRef = _this.dialog.open(ViajeDialogo, {
                width: '1200px',
                data: {
                    tipoItem: _this.formularioItem.get('item').value.id,
                    idViaje: _this.formularioItem.get('numeroViaje').value
                }
            });
            dialogRef.afterClosed().subscribe(function (resultado) {
                console.log(resultado);
                _this.formularioItem.get('idTramo').setValue(resultado);
                setTimeout(function () {
                    document.getElementById('idRemito').focus();
                }, 20);
                _this.listarRemitos();
            });
        }, function (err) {
            _this.toastr.error("No existen Tramos para el N° de viaje ingresado.");
        });
    };
    //Obtiene la Lista de Remitos por el id del tramo seleccionado
    EmitirFacturaComponent.prototype.listarRemitos = function () {
        var _this = this;
        this.viajeRemitoServicio.listarRemitos(this.formularioItem.get('idTramo').value.id, this.formularioItem.get('item').value.id).subscribe(function (res) {
            console.log(res.json());
            _this.resultadosRemitos = res.json();
            if (_this.resultadosRemitos.length == 0) {
                _this.toastr.error("No existen Remitos para el Tramo seleccionado.");
                _this.formularioItem.get('idTramo').setValue(null);
                _this.formularioItem.get('numeroViaje').setValue(null);
                setTimeout(function () {
                    document.getElementById('idViaje').focus();
                }, 20);
            }
            else {
                _this.formularioItem.get('idTramo').setValue(_this.resultadosRemitos[0].id);
            }
        }, function (err) {
            _this.formularioItem.get('idTramo').setValue(null);
            _this.formularioItem.get('numeroViaje').setValue(null);
            setTimeout(function () {
                document.getElementById('idViaje').focus();
            }, 20);
        });
    };
    //Completa los input segun el remito seleccionado
    EmitirFacturaComponent.prototype.cambioRemito = function () {
        this.formularioItem.get('kilosAforado').setValue(this.formularioItem.get('remito').value.kilosAforado);
        this.formularioItem.get('kilosEfectivo').setValue(this.formularioItem.get('remito').value.kilosEfectivo);
        this.formularioItem.get('bultos').setValue(this.formularioItem.get('remito').value.bultos);
        this.formularioItem.get('m3').setValue(this.formularioItem.get('remito').value.m3);
        this.formularioItem.get('valorDeclarado').setValue(this.formularioItem.get('remito').value.valorDeclarado);
        this.formularioItem.get('importeEntrega').setValue(this.formularioItem.get('remito').value.importeEntrega);
        this.formularioItem.get('importeRetiro').setValue(this.formularioItem.get('remito').value.importeRetiro);
    };
    //Completa el input "porcentaje" segun la Orden Venta seleccionada 
    EmitirFacturaComponent.prototype.cambioOVta = function () {
        this.formularioItem.get('seguro').setValue(this.formularioItem.get('tarifaOVta').value.seguro);
        console.log(this.formularioItem.value);
        this.obtenerPrecioFlete();
    };
    //Obtiene el Precio del Flete seleccionado
    EmitirFacturaComponent.prototype.obtenerPrecioFlete = function () {
        var tipoTarifa = this.formularioItem.get('tarifaOVta').value.tipoTarifa.id;
        var idOrdenVta = this.formularioItem.get('tarifaOVta').value.id;
        var respuesta;
        switch (tipoTarifa) {
            case 1:
                this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioItem.get('bultos').value).subscribe(function (res) {
                    respuesta = res.json();
                });
                break;
            case 2:
                var kgMayor = void 0;
                if (this.formularioItem.get('kilosEfectivo').value > this.formularioItem.get('kilosAforado').value)
                    kgMayor = this.formularioItem.get('kilosEfectivo').value;
                else
                    kgMayor = this.formularioItem.get('kilosAforado').value;
                this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, kgMayor).subscribe(function (res) {
                    respuesta = res.json();
                });
                break;
            case 3:
                var toneladas = void 0;
                if (this.formularioItem.get('kilosEfectivo').value > this.formularioItem.get('kilosAforado').value)
                    toneladas = this.formularioItem.get('kilosEfectivo').value;
                else
                    toneladas = this.formularioItem.get('kilosAforado').value;
                toneladas = toneladas / 1000;
                this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, toneladas).subscribe(function (res) {
                    respuesta = res.json();
                });
                break;
            case 4:
                this.ordenVentaEscalaServicio.obtenerPrecioFlete(idOrdenVta, this.formularioItem.get('m3').value).subscribe(function (res) {
                    respuesta = res.json();
                });
                break;
        }
        console.log(respuesta);
    };
    //Calcular el Subtotal del item agregado
    EmitirFacturaComponent.prototype.calcularSubtotal = function () {
        var subtotal = 0;
        var vdeclaradoNeto = this.formularioItem.get('valorDeclarado').value * (this.formularioItem.get('seguro').value / 1000);
        var flete = this.formularioItem.get('flete').value;
        var descuento = this.formularioItem.get('descuento').value;
        var retiro = this.formularioItem.get('importeRetiro').value;
        var entrega = this.formularioItem.get('importeEntrega').value;
        subtotal = vdeclaradoNeto + flete - descuento + retiro + entrega;
        this.formularioItem.get('subtotal').setValue(subtotal);
        this.formularioItem.get('importeIva').setValue(subtotal * this.formularioItem.get('alicuotaIva').value);
    };
    //Formatea el numero a x decimales
    EmitirFacturaComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
    };
    //Establece la cantidad de ceros correspondientes a la izquierda del numero
    EmitirFacturaComponent.prototype.establecerCerosIzq = function (elemento, string, cantidad) {
        return (string + elemento).slice(cantidad);
    };
    EmitirFacturaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    EmitirFacturaComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    EmitirFacturaComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    EmitirFacturaComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    EmitirFacturaComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
        }
        else {
            return '';
        }
    };
    EmitirFacturaComponent = __decorate([
        core_1.Component({
            selector: 'app-emitir-factura',
            templateUrl: './emitir-factura.component.html',
            styleUrls: ['./emitir-factura.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, material_1.MatDialog, fecha_service_1.FechaService,
            cliente_service_1.ClienteService, ngx_toastr_1.ToastrService, emitirFactura_1.EmitirFactura, app_service_1.AppService,
            sucursal_cliente_service_1.SucursalClienteService, punto_venta_service_1.PuntoVentaService, tipo_comprobante_service_1.TipoComprobanteService,
            afip_comprobante_service_1.AfipComprobanteService, venta_tipo_item_service_1.VentaTipoItemService, viaje_remito_service_1.ViajeRemitoService,
            orden_venta_service_1.OrdenVentaService, viaje_propio_tramo_service_1.ViajePropioTramoService, viaje_tercero_tramo_service_1.ViajeTerceroTramoService,
            orden_venta_escala_service_1.OrdenVentaEscalaService, venta_item_concepto_service_1.VentaItemConceptoService])
    ], EmitirFacturaComponent);
    return EmitirFacturaComponent;
}());
exports.EmitirFacturaComponent = EmitirFacturaComponent;
var ViajeDialogo = /** @class */ (function () {
    function ViajeDialogo(dialogRef, data, toastr, viajePropioTramoService, viajeTerceroTramoServicio) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastr = toastr;
        this.viajePropioTramoService = viajePropioTramoService;
        this.viajeTerceroTramoServicio = viajeTerceroTramoServicio;
        //Define la lista de tramos
        this.resultadosTramos = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    ViajeDialogo.prototype.ngOnInit = function () {
        this.formulario = new forms_1.FormGroup({
            tramo: new forms_1.FormControl('', forms_1.Validators.required)
        });
        //Obtiene la lista de tramos por tipo de item (propio/tercero)
        console.log(this.data.tipoItem, this.data.idViaje);
        this.listarTramos(this.data.tipoItem, this.data.idViaje);
    };
    //obtiene la lista de tramos por tipo y por el idViaje 
    ViajeDialogo.prototype.listarTramos = function (tipo, viaje) {
        var _this = this;
        if (tipo == 1) {
            this.viajePropioTramoService.listarTramos(viaje).subscribe(function (res) {
                console.log(res.json());
                _this.resultadosTramos = res.json();
            });
        }
        if (tipo == 2) {
            this.viajeTerceroTramoServicio.listarTramos(viaje).subscribe(function (res) {
                console.log(res.json());
                _this.resultadosTramos = res.json();
            });
        }
    };
    ViajeDialogo.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    ViajeDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ViajeDialogo = __decorate([
        core_1.Component({
            selector: 'viaje-dialogo',
            templateUrl: 'viaje-dialogo.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, ngx_toastr_1.ToastrService,
            viaje_propio_tramo_service_1.ViajePropioTramoService, viaje_tercero_tramo_service_1.ViajeTerceroTramoService])
    ], ViajeDialogo);
    return ViajeDialogo;
}());
exports.ViajeDialogo = ViajeDialogo;
//# sourceMappingURL=emitir-factura.component.js.map