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
var viaje_remito_service_1 = require("../../servicios/viaje-remito.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var cliente_service_1 = require("../../servicios/cliente.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var tipo_comprobante_service_1 = require("../../servicios/tipo-comprobante.service");
var afip_condicion_iva_service_1 = require("../../servicios/afip-condicion-iva.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var cobrador_service_1 = require("../../servicios/cobrador.service");
var zona_service_1 = require("../../servicios/zona.service");
var rubro_service_1 = require("../../servicios/rubro.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var material_1 = require("@angular/material");
var clienteEventual_1 = require("src/app/modelos/clienteEventual");
var ViajeRemitoComponent = /** @class */ (function () {
    //Constructor
    function ViajeRemitoComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, sucursalServicio, clienteServicio, tipoComprobanteServicio, dialog) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.sucursalServicio = sucursalServicio;
        this.clienteServicio = clienteServicio;
        this.tipoComprobanteServicio = tipoComprobanteServicio;
        this.dialog = dialog;
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
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda cliente remitente
        this.resultadosClienteRemitente = [];
        //Define la lista de resultados de busqueda cliente destinatario
        this.resultadosClienteDestinatario = [];
        //Define la lista de sucursales
        this.sucursales = [];
        //Define la lista de tipos de comprobantes
        this.tiposComprobantes = [];
        //Define la lista de letras
        this.letras = [];
        //Define el estado de la letra
        this.estadoLetra = false;
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
    ViajeRemitoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            sucursalEmision: new forms_1.FormControl(),
            empresaEmision: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            numeroCamion: new forms_1.FormControl('', forms_1.Validators.required),
            sucursalDestino: new forms_1.FormControl('', forms_1.Validators.required),
            tipoComprobante: new forms_1.FormControl('', forms_1.Validators.required),
            puntoVenta: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(5)]),
            letra: new forms_1.FormControl('', forms_1.Validators.required),
            numero: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(8)]),
            clienteRemitente: new forms_1.FormControl('', forms_1.Validators.required),
            clienteDestinatario: new forms_1.FormControl('', forms_1.Validators.required),
            clienteDestinatarioSuc: new forms_1.FormControl(),
            bultos: new forms_1.FormControl('', forms_1.Validators.required),
            kilosEfectivo: new forms_1.FormControl(),
            kilosAforado: new forms_1.FormControl(),
            m3: new forms_1.FormControl(),
            valorDeclarado: new forms_1.FormControl(),
            importeRetiro: new forms_1.FormControl(),
            importeEntrega: new forms_1.FormControl(),
            estaPendiente: new forms_1.FormControl(),
            viajePropioTramo: new forms_1.FormControl(),
            viajeTerceroTramo: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl(),
            estaFacturado: new forms_1.FormControl(),
            seguimiento: new forms_1.FormControl(''),
            estaEnReparto: new forms_1.FormControl(),
            alias: new forms_1.FormControl()
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Autocompletado ClienteRemitente - Buscar por nombre
        this.formulario.get('clienteRemitente').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClienteRemitente = response;
                });
            }
        });
        //Autocompletado ClienteDestinatario - Buscar por nombre
        this.formulario.get('clienteDestinatario').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClienteDestinatario = response;
                });
            }
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de condiciones de iva
        this.listarSucursales();
        //Obtiene la lista de tipos de comprobantes
        this.listarTiposComprobantes();
        //Establece valores por defecto
        this.establecerValoresPorDefecto();
        //Crea la lista de letras
        this.letras = ['A', 'B', 'C'];
    };
    //Establece el formulario al seleccionar elemento de autocompletado
    ViajeRemitoComponent.prototype.establecerFormulario = function (elemento) {
        this.formulario.patchValue(elemento);
        this.formulario.get('puntoVenta').setValue(this.displayCeros(elemento.puntoVenta, '0000', -5));
    };
    //Establece los valores por defecto
    ViajeRemitoComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('fecha').setValue(new Date().toISOString().substring(0, 10));
    };
    //Vacia la lista de resultados de autocompletados
    ViajeRemitoComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosClienteRemitente = [];
        this.resultadosClienteDestinatario = [];
    };
    //Obtiene el listado de sucursales
    ViajeRemitoComponent.prototype.listarSucursales = function () {
        var _this = this;
        this.sucursalServicio.listar().subscribe(function (res) {
            _this.sucursales = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos comprobantes
    ViajeRemitoComponent.prototype.listarTiposComprobantes = function () {
        var _this = this;
        this.tipoComprobanteServicio.listarPorEstaActivoIngresoCargaTrue().subscribe(function (res) {
            _this.tiposComprobantes = res.json();
            _this.establecerTipoComprobantePorDefecto();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece el tipo comprobante por defecto
    ViajeRemitoComponent.prototype.establecerTipoComprobantePorDefecto = function () {
        this.formulario.get('tipoComprobante').setValue(this.tiposComprobantes[1]);
        this.formulario.get('letra').setValue('R');
    };
    //Funcion para establecer los valores de las pestañas
    ViajeRemitoComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarListas();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Habilita o deshabilita los campos dependiendo de la pestaña
    ViajeRemitoComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('sucursalDestino').enable();
            this.formulario.get('tipoComprobante').enable();
            this.formulario.get('letra').enable();
        }
        else {
            this.formulario.get('sucursalDestino').disable();
            this.formulario.get('tipoComprobante').disable();
            this.formulario.get('letra').disable();
        }
    };
    //Establece valores al seleccionar una pestania
    ViajeRemitoComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
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
                this.establecerValoresPorDefecto();
                this.establecerValoresPestania(nombre, false, false, true, 'idFecha');
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
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ViajeRemitoComponent.prototype.accion = function (indice) {
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
    ViajeRemitoComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ViajeRemitoComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    ViajeRemitoComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('letra').enable();
        this.formulario.get('sucursalEmision').setValue(this.appComponent.getUsuario().sucursal);
        this.formulario.get('empresaEmision').setValue(this.appComponent.getEmpresa());
        this.formulario.get('usuario').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                _this.establecerValoresPorDefecto();
                _this.establecerTipoComprobantePorDefecto();
                setTimeout(function () {
                    document.getElementById('idFecha').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    ViajeRemitoComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('letra').enable();
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
    ViajeRemitoComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ViajeRemitoComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('fecha').setValue(undefined);
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ViajeRemitoComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    ViajeRemitoComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Establece la letra al cambiar el tipo de comprobante
    ViajeRemitoComponent.prototype.cambioTipoComprobante = function () {
        var id = this.formulario.get('tipoComprobante').value.id;
        if (id == 5) {
            this.formulario.get('letra').setValue('R');
            this.estadoLetra = false;
        }
        else {
            this.estadoLetra = true;
            this.formulario.get('letra').setValue(this.letras[0]);
        }
    };
    //Formatea el numero a x decimales
    ViajeRemitoComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ViajeRemitoComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.establecerFormulario(elemento);
        this.establecerEstadoCampos(false);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ViajeRemitoComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.establecerEstadoCampos(true);
        this.autocompletado.setValue(elemento);
        this.establecerFormulario(elemento);
    };
    //Abre el dialogo para agregar un cliente eventual
    ViajeRemitoComponent.prototype.agregarCliente = function (tipo) {
        var _this = this;
        var dialogRef = this.dialog.open(ClienteEventualDialogo, {
            width: '1200px',
            data: {
                formulario: null,
                usuario: this.appComponent.getUsuario()
            }
        });
        dialogRef.afterClosed().subscribe(function (resultado) {
            _this.clienteServicio.obtenerPorId(resultado).subscribe(function (res) {
                var cliente = res.json();
                if (tipo == 1) {
                    _this.formulario.get('clienteRemitente').setValue(cliente);
                }
                else {
                    _this.formulario.get('clienteDestinatario').setValue(cliente);
                }
            });
        });
    };
    ViajeRemitoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ViajeRemitoComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ViajeRemitoComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos con ceros a la izquierda
    ViajeRemitoComponent.prototype.displayCeros = function (elemento, string, cantidad) {
        if (elemento != undefined) {
            return elemento ? (string + elemento).slice(cantidad) : elemento;
        }
        else {
            return elemento;
        }
    };
    //Establece la cantidad de ceros correspondientes a la izquierda del numero
    ViajeRemitoComponent.prototype.establecerCerosIzq = function (elemento, string, cantidad) {
        elemento.setValue((string + elemento.value).slice(cantidad));
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ViajeRemitoComponent.prototype.manejarEvento = function (keycode) {
        var indice = this.indiceSeleccionado;
        if (keycode == 113) {
            if (indice < this.pestanias.length) {
                this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
            }
            else {
                this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
            }
        }
    };
    ViajeRemitoComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-remito',
            templateUrl: './viaje-remito.component.html',
            styleUrls: ['./viaje-remito.component.css']
        }),
        __metadata("design:paramtypes", [viaje_remito_service_1.ViajeRemitoService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            sucursal_service_1.SucursalService, cliente_service_1.ClienteService,
            tipo_comprobante_service_1.TipoComprobanteService, material_1.MatDialog])
    ], ViajeRemitoComponent);
    return ViajeRemitoComponent;
}());
exports.ViajeRemitoComponent = ViajeRemitoComponent;
//Componente Cliente Eventual
var ClienteEventualDialogo = /** @class */ (function () {
    //Constructor
    function ClienteEventualDialogo(dialogRef, data, afipCondicionIvaServicio, tipoDocumentoServicio, barrioServicio, localidadServicio, cobradorServicio, zonaServicio, rubroServicio, sucursalServicio, clienteServicio, toastr, clienteEventual) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.afipCondicionIvaServicio = afipCondicionIvaServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.cobradorServicio = cobradorServicio;
        this.zonaServicio = zonaServicio;
        this.rubroServicio = rubroServicio;
        this.sucursalServicio = sucursalServicio;
        this.clienteServicio = clienteServicio;
        this.toastr = toastr;
        this.clienteEventual = clienteEventual;
        //Define la lista de condiciones de iva
        this.condicionesIva = [];
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda de cobrador
        this.resultadosCobradores = [];
        //Define la lista de resultados de busqueda de zona
        this.resultadosZonas = [];
        //Define la lista de resultados de busqueda de rubro
        this.resultadosRubros = [];
        //Define la lista de resultados de busqueda de sucursal lugar pago
        this.resultadosSucursalesPago = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    ClienteEventualDialogo.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.clienteEventual.formulario;
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
        //Autocompletado Sucursal Lugar Pago - Buscar por nombre
        this.formulario.get('sucursalLugarPago').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.sucursalServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosSucursalesPago = response;
                });
            }
        });
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
    };
    //Obtiene el listado de condiciones de iva
    ClienteEventualDialogo.prototype.listarCondicionesIva = function () {
        var _this = this;
        this.afipCondicionIvaServicio.listar().subscribe(function (res) {
            _this.condicionesIva = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de documentos
    ClienteEventualDialogo.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    ClienteEventualDialogo.prototype.onNoClick = function () {
        this.data.formulario = this.formulario;
        console.log(this.data.formulario);
        this.dialogRef.close();
    };
    ClienteEventualDialogo.prototype.cerrar = function () {
        this.data.formulario = this.formulario;
        console.log(this.data.formulario);
    };
    //Obtiene el siguiente id
    ClienteEventualDialogo.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.clienteServicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un cliente eventual
    ClienteEventualDialogo.prototype.agregarClienteEventual = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.data.usuario);
        this.clienteServicio.agregarClienteEventual(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idCondicionIva').focus();
                }, 20);
                _this.data.formulario = respuesta.id - 1;
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Reestablece el formulario
    ClienteEventualDialogo.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.vaciarListas();
    };
    //Vacia la lista de resultados de autocompletados
    ClienteEventualDialogo.prototype.vaciarListas = function () {
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
        this.resultadosCobradores = [];
        this.resultadosZonas = [];
        this.resultadosRubros = [];
        this.resultadosSucursalesPago = [];
    };
    //Manejo de colores de campos y labels
    ClienteEventualDialogo.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ClienteEventualDialogo.prototype.lanzarError = function (err) {
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
        else if (respuesta.codigo == 11010) {
            document.getElementById("labelNumeroDocumento").classList.add('label-error');
            document.getElementById("idNumeroDocumento").classList.add('is-invalid');
            document.getElementById("idNumeroDocumento").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    ClienteEventualDialogo.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ClienteEventualDialogo.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ClienteEventualDialogo.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ClienteEventualDialogo.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    ClienteEventualDialogo = __decorate([
        core_1.Component({
            selector: 'cliente-eventual-dialogo',
            templateUrl: '../cliente/cliente-eventual.component.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, afip_condicion_iva_service_1.AfipCondicionIvaService, tipo_documento_service_1.TipoDocumentoService,
            barrio_service_1.BarrioService, localidad_service_1.LocalidadService,
            cobrador_service_1.CobradorService, zona_service_1.ZonaService,
            rubro_service_1.RubroService, sucursal_service_1.SucursalService,
            cliente_service_1.ClienteService, ngx_toastr_1.ToastrService, clienteEventual_1.ClienteEventual])
    ], ClienteEventualDialogo);
    return ClienteEventualDialogo;
}());
exports.ClienteEventualDialogo = ClienteEventualDialogo;
//# sourceMappingURL=viaje-remito.component.js.map