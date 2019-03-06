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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var cliente_service_1 = require("../../servicios/cliente.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var rol_opcion_service_1 = require("../../servicios/rol-opcion.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var cobrador_service_1 = require("../../servicios/cobrador.service");
var vendedor_service_1 = require("../../servicios/vendedor.service");
var zona_service_1 = require("../../servicios/zona.service");
var rubro_service_1 = require("../../servicios/rubro.service");
var afip_condicion_iva_service_1 = require("../../servicios/afip-condicion-iva.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var resumen_cliente_service_1 = require("../../servicios/resumen-cliente.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var situacion_cliente_service_1 = require("../../servicios/situacion-cliente.service");
var compania_seguro_service_1 = require("../../servicios/compania-seguro.service");
var orden_venta_service_1 = require("../../servicios/orden-venta.service");
var condicion_venta_service_1 = require("../../servicios/condicion-venta.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var cliente_1 = require("src/app/modelos/cliente");
var ClienteComponent = /** @class */ (function () {
    //Constructor
    function ClienteComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, rolOpcionServicio, barrioServicio, localidadServicio, cobradorServicio, vendedorServicio, zonaServicio, rubroServicio, afipCondicionIvaServicio, tipoDocumentoServicio, resumenClienteServicio, sucursalServicio, situacionClienteServicio, companiaSeguroServicio, ordenVentaServicio, condicionVentaServicio, clienteModelo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.rolOpcionServicio = rolOpcionServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.cobradorServicio = cobradorServicio;
        this.vendedorServicio = vendedorServicio;
        this.zonaServicio = zonaServicio;
        this.rubroServicio = rubroServicio;
        this.afipCondicionIvaServicio = afipCondicionIvaServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
        this.resumenClienteServicio = resumenClienteServicio;
        this.sucursalServicio = sucursalServicio;
        this.situacionClienteServicio = situacionClienteServicio;
        this.companiaSeguroServicio = companiaSeguroServicio;
        this.ordenVentaServicio = ordenVentaServicio;
        this.condicionVentaServicio = condicionVentaServicio;
        this.clienteModelo = clienteModelo;
        //Define la pestania activa
        this.activeLink = null;
        //Define el indice seleccionado de pestania
        this.indiceSeleccionado = null;
        //Define la pestania actual seleccionada
        this.pestaniaActual = null;
        //Define si mostrar el autocompletado
        this.mostrarAutocompletado = null;
        //Define si el campo es de solo lectura
        this.soloLectura = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista de opciones
        this.opciones = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la opcion seleccionada
        this.opcionSeleccionada = null;
        //Define la lista de condiciones de iva
        this.condicionesIva = [];
        //Define la lista de condiciones de venta
        this.condicionesVentas = [];
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define la lista de resumenes de clientes
        this.resumenesClientes = [];
        //Define la lista de situaciones de clientes
        this.situacionesClientes = [];
        //Define la opcion activa
        this.botonOpcionActivo = null;
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda de cobrador
        this.resultadosCobradores = [];
        //Define la lista de resultados de busqueda de vendedor
        this.resultadosVendedores = [];
        //Define la lista de resultados de busqueda de zona
        this.resultadosZonas = [];
        //Define la lista de resultados de busqueda de rubro
        this.resultadosRubros = [];
        //Define la lista de resultados de busqueda de orden venta
        this.resultadosOrdenesVentas = [];
        //Define la lista de resultados de busqueda de cuenta principal
        this.resultadosCuentasGrupos = [];
        //Define la lista de resultados de busqueda de sucursal lugar pago
        this.resultadosSucursalesPago = [];
        //Define la lista de resultados de busqueda de compania seguro
        this.resultadosCompaniasSeguros = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
        }, function (err) {
            console.log(err);
        });
        //Obtiene la lista de opciones por rol y subopcion
        this.rolOpcionServicio.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.opciones = res.json();
        }, function (err) {
            console.log(err);
        });
        //Se subscribe al servicio de lista de registros
        this.servicio.listaCompleta.subscribe(function (res) {
            _this.listaCompleta = res;
        });
        //Autocompletado - Buscar por alias
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultados = response;
                });
            }
        });
    }
    //Al iniciarse el componente
    ClienteComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.clienteModelo.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Establece la primera opcion seleccionada
        this.seleccionarOpcion(1, 0);
        //Autocompletado Barrio - Buscar por nombre
        this.formulario.get('barrio').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBarrios = response;
                });
            }
        });
        //Autocompletado Localidad - Buscar por nombre
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Autocompletado Cobrador - Buscar por nombre
        this.formulario.get('cobrador').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.cobradorServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCobradores = response;
                });
            }
        });
        //Autocompletado Vendedor - Buscar por nombre
        this.formulario.get('vendedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.vendedorServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosVendedores = response;
                });
            }
        });
        //Autocompletado Zona - Buscar por nombre
        this.formulario.get('zona').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.zonaServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosZonas = response;
                });
            }
        });
        //Autocompletado Rubro - Buscar por nombre
        this.formulario.get('rubro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.rubroServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosRubros = response;
                });
            }
        });
        //Autocompletado Orden Venta - Buscar por nombre
        this.formulario.get('ordenVenta').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.ordenVentaServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosOrdenesVentas = response;
                });
            }
        });
        //Autocompletado Cuenta Grupo - Buscar por nombre
        this.formulario.get('cuentaGrupo').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosCuentasGrupos = response;
                });
            }
        });
        //Autocompletado Sucursal Lugar Pago - Buscar por nombre
        this.formulario.get('sucursalLugarPago').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.sucursalServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosSucursalesPago = response;
                });
            }
        });
        //Autocompletado Compania Seguro - Buscar por nombre
        this.formulario.get('companiaSeguro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.companiaSeguroServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCompaniasSeguros = response;
                });
            }
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de condiciones de iva
        this.listarCondicionesIva();
        //Obtiene la lista de tipos de documentos
        this.listarTiposDocumentos();
        //Obtiene la lista de resumenes de clientes
        this.listarResumenesClientes();
        //Obtiene la lista de situaciones de clientes
        this.listarSituacionesClientes();
        //Obtiene la lista de condiciones de venta
        this.listarCondicionesVentas();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto
    ClienteComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('creditoLimite').setValue('0.00');
        this.formulario.get('descuentoFlete').setValue('0.00');
        this.formulario.get('esSeguroPropio').setValue(false);
        this.formulario.get('imprimirControlDeuda').setValue(false);
        this.formulario.get('companiaSeguro').disable();
        this.formulario.get('numeroPolizaSeguro').disable();
        this.formulario.get('vencimientoPolizaSeguro').disable();
        this.formulario.get('resumenCliente').disable();
    };
    //Vacia la lista de resultados de autocompletados
    ClienteComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
        this.resultadosCobradores = [];
        this.resultadosVendedores = [];
        this.resultadosZonas = [];
        this.resultadosRubros = [];
        this.resultadosOrdenesVentas = [];
        this.resultadosCuentasGrupos = [];
        this.resultadosSucursalesPago = [];
        this.resultadosCompaniasSeguros = [];
    };
    //Obtiene el listado de condiciones de iva
    ClienteComponent.prototype.listarCondicionesIva = function () {
        var _this = this;
        this.afipCondicionIvaServicio.listar().subscribe(function (res) {
            _this.condicionesIva = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de documentos
    ClienteComponent.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de resumenes de clientes
    ClienteComponent.prototype.listarResumenesClientes = function () {
        var _this = this;
        this.resumenClienteServicio.listar().subscribe(function (res) {
            _this.resumenesClientes = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de situaciones de clientes
    ClienteComponent.prototype.listarSituacionesClientes = function () {
        var _this = this;
        this.situacionClienteServicio.listar().subscribe(function (res) {
            _this.situacionesClientes = res.json();
            _this.formulario.get('situacionCliente').setValue(_this.situacionesClientes[0]);
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de condiciones de ventas
    ClienteComponent.prototype.listarCondicionesVentas = function () {
        var _this = this;
        this.condicionVentaServicio.listar().subscribe(function (res) {
            _this.condicionesVentas = res.json();
            _this.formulario.get('condicionVenta').setValue(_this.condicionesVentas[0]);
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    ClienteComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarListas();
        this.establecerValoresPorDefecto();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Habilita o deshabilita los campos dependiendo de la pestaña
    ClienteComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('afipCondicionIva').enable();
            this.formulario.get('tipoDocumento').enable();
            this.formulario.get('condicionVenta').enable();
            this.formulario.get('resumenCliente').enable();
            this.formulario.get('situacionCliente').enable();
            this.formulario.get('esSeguroPropio').enable();
            this.formulario.get('imprimirControlDeuda').enable();
        }
        else {
            this.formulario.get('afipCondicionIva').disable();
            this.formulario.get('tipoDocumento').disable();
            this.formulario.get('condicionVenta').disable();
            this.formulario.get('resumenCliente').disable();
            this.formulario.get('situacionCliente').disable();
            this.formulario.get('esSeguroPropio').disable();
            this.formulario.get('imprimirControlDeuda').disable();
        }
    };
    //Establece valores al seleccionar una pestania
    ClienteComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario(undefined);
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultados = [];
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idRazonSocial');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Establece la opcion seleccionada
    ClienteComponent.prototype.seleccionarOpcion = function (opcion, indice) {
        this.opcionSeleccionada = opcion;
        this.botonOpcionActivo = indice;
        switch (opcion) {
            case 1:
                setTimeout(function () {
                    document.getElementById('idRazonSocial').focus();
                }, 20);
                break;
            case 2:
                setTimeout(function () {
                    document.getElementById('idCondicionVenta').focus();
                }, 20);
                break;
            case 3:
                setTimeout(function () {
                    document.getElementById('idEsSeguroPropio').focus();
                }, 20);
                break;
            case 4:
                setTimeout(function () {
                    document.getElementById('idObservaciones').focus();
                }, 20);
                break;
            case 5:
                setTimeout(function () {
                    document.getElementById('idEmitirComprobante').focus();
                }, 20);
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ClienteComponent.prototype.accion = function (indice) {
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
    };
    //Obtiene el siguiente id
    ClienteComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ClienteComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    ClienteComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('esCuentaCorriente').setValue(true);
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idRazonSocial').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    ClienteComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('esCuentaCorriente').setValue(true);
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
                setTimeout(function () {
                    document.getElementById('idAutocompletado').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    ClienteComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ClienteComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ClienteComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11006) {
            document.getElementById("labelRazonSocial").classList.add('label-error');
            document.getElementById("idRazonSocial").classList.add('is-invalid');
            document.getElementById("idRazonSocial").focus();
        }
        else if (respuesta.codigo == 11009) {
            document.getElementById("labelTelefono").classList.add('label-error');
            document.getElementById("idTelefono").classList.add('is-invalid');
            document.getElementById("idTelefono").focus();
        }
        else if (respuesta.codigo == 11008) {
            document.getElementById("labelSitioWeb").classList.add('label-error');
            document.getElementById("idSitioWeb").classList.add('is-invalid');
            document.getElementById("idSitioWeb").focus();
        }
        else if (respuesta.codigo == 11010) {
            document.getElementById("labelNumeroDocumento").classList.add('label-error');
            document.getElementById("idNumeroDocumento").classList.add('is-invalid');
            document.getElementById("idNumeroDocumento").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    ClienteComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Formatea el numero a x decimales
    ClienteComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
    };
    //Manejo de colores de campos y labels con patron erroneo
    ClienteComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'sitioWeb') {
                    document.getElementById("labelSitioWeb").classList.add('label-error');
                    document.getElementById("idSitioWeb").classList.add('is-invalid');
                    this.toastr.error('Sitio Web Incorrecto');
                }
            }
        }
    };
    //Verifica si se selecciono un elemento del autocompletado
    ClienteComponent.prototype.verificarSeleccion = function (valor) {
        if (typeof valor.value != 'object') {
            valor.setValue(null);
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ClienteComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ClienteComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Cambio de elemento seleccionado en condicion venta
    ClienteComponent.prototype.cambioCondicionVenta = function () {
        if (this.formulario.get('condicionVenta').value.nombre == "CONTADO") {
            this.formulario.get('resumenCliente').disable();
            this.formulario.get('resumenCliente').clearValidators();
        }
        else {
            // this.formulario.controls['resumenCliente'].setValidators(Validators.required);
            this.formulario.get('resumenCliente').setValidators(forms_1.Validators.required);
            this.formulario.get('resumenCliente').enable();
        }
    };
    //Cambio de elemento seleccionado en tipo de seguro
    ClienteComponent.prototype.cambioTipoSeguro = function () {
        if (this.formulario.get('esSeguroPropio').value) {
            this.formulario.get('companiaSeguro').setValidators(forms_1.Validators.required);
            this.formulario.get('companiaSeguro').enable();
            this.formulario.get('numeroPolizaSeguro').setValidators(forms_1.Validators.required);
            this.formulario.get('numeroPolizaSeguro').enable();
            this.formulario.get('vencimientoPolizaSeguro').setValidators(forms_1.Validators.required);
            this.formulario.get('vencimientoPolizaSeguro').enable();
        }
        else {
            this.formulario.get('companiaSeguro').disable();
            this.formulario.get('companiaSeguro').clearValidators();
            this.formulario.get('numeroPolizaSeguro').disable();
            this.formulario.get('numeroPolizaSeguro').clearValidators();
            this.formulario.get('vencimientoPolizaSeguro').disable();
            this.formulario.get('vencimientoPolizaSeguro').clearValidators();
        }
    };
    ClienteComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ClienteComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ClienteComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ClienteComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ClienteComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado d
    ClienteComponent.prototype.displayFd = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Cuenta Corriente' : 'Contado';
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado e
    ClienteComponent.prototype.displayFe = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Con Seguro Propio' : 'Sin Seguro Propio';
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado f
    ClienteComponent.prototype.displayFf = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Si' : 'No';
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ClienteComponent.prototype.manejarEvento = function (keycode) {
        var indice = this.indiceSeleccionado;
        var opcion = this.opcionSeleccionada;
        if (keycode == 113) {
            if (indice < this.pestanias.length) {
                this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
            }
            else {
                this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
            }
        }
        else if (keycode == 115) {
            if (opcion < this.opciones.length) {
                this.seleccionarOpcion(opcion + 1, opcion);
            }
            else {
                this.seleccionarOpcion(1, 0);
            }
        }
    };
    ClienteComponent = __decorate([
        core_1.Component({
            selector: 'app-cliente',
            templateUrl: './cliente.component.html',
            styleUrls: ['./cliente.component.css']
        }),
        __metadata("design:paramtypes", [cliente_service_1.ClienteService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            rol_opcion_service_1.RolOpcionService, barrio_service_1.BarrioService,
            localidad_service_1.LocalidadService, cobrador_service_1.CobradorService,
            vendedor_service_1.VendedorService, zona_service_1.ZonaService,
            rubro_service_1.RubroService, afip_condicion_iva_service_1.AfipCondicionIvaService,
            tipo_documento_service_1.TipoDocumentoService, resumen_cliente_service_1.ResumenClienteService,
            sucursal_service_1.SucursalService, situacion_cliente_service_1.SituacionClienteService,
            compania_seguro_service_1.CompaniaSeguroService, orden_venta_service_1.OrdenVentaService,
            condicion_venta_service_1.CondicionVentaService, cliente_1.Cliente])
    ], ClienteComponent);
    return ClienteComponent;
}());
exports.ClienteComponent = ClienteComponent;
//# sourceMappingURL=cliente.component.js.map