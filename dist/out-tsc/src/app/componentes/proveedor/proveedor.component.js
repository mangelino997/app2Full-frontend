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
var proveedor_service_1 = require("../../servicios/proveedor.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var rol_opcion_service_1 = require("../../servicios/rol-opcion.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var afip_condicion_iva_service_1 = require("../../servicios/afip-condicion-iva.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var tipo_proveedor_service_1 = require("../../servicios/tipo-proveedor.service");
var condicion_compra_service_1 = require("../../servicios/condicion-compra.service");
var banco_service_1 = require("../../servicios/banco.service");
var tipo_cuenta_bancaria_service_1 = require("../../servicios/tipo-cuenta-bancaria.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var proveedor_1 = require("src/app/modelos/proveedor");
var ProveedorComponent = /** @class */ (function () {
    //Constructor
    function ProveedorComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, rolOpcionServicio, barrioServicio, localidadServicio, afipCondicionIvaServicio, tipoDocumentoServicio, tipoProveedorServicio, condicionCompraServicio, bancoServicio, tipoCuentaBancariaServicio, proveedorModelo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.rolOpcionServicio = rolOpcionServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.afipCondicionIvaServicio = afipCondicionIvaServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
        this.tipoProveedorServicio = tipoProveedorServicio;
        this.condicionCompraServicio = condicionCompraServicio;
        this.bancoServicio = bancoServicio;
        this.tipoCuentaBancariaServicio = tipoCuentaBancariaServicio;
        this.proveedorModelo = proveedorModelo;
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
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define la lista de tipos de proveedores
        this.tiposProveedores = [];
        //Define la lista de condiciones de compra
        this.condicionesCompras = [];
        //Define la lista de tipos de cuentas bancarias
        this.tiposCuentasBancarias = [];
        //Define la opcion activa
        this.botonOpcionActivo = null;
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de barrios
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de localidades
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda de bancos
        this.resultadosBancos = [];
        //Define el mostrado de datos y comparacion en campo select
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
    ProveedorComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.proveedorModelo.formulario;
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
        //Autocompletado Banco - Buscar por nombre
        this.formulario.get('banco').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.bancoServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBancos = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Establece la primera opcion seleccionada
        this.seleccionarOpcion(8, 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de tipos de proveedores
        this.listarTiposProveedores();
        //Obtiene la lista de condiciones de iva
        this.listarCondicionesIva();
        //Obtiene la lista de tipos de documentos
        this.listarTiposDocumentos();
        //Obtiene la lista de condiciones de compra
        this.listarCondicionesCompras();
        //Obtiene la lista de tipos de cuentas bancarias
        this.listarTiposCuentasBancarias();
        //Establece valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Obtiene el listado de tipos de proveedores
    ProveedorComponent.prototype.listarTiposProveedores = function () {
        var _this = this;
        this.tipoProveedorServicio.listar().subscribe(function (res) {
            _this.tiposProveedores = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de condiciones de iva
    ProveedorComponent.prototype.listarCondicionesIva = function () {
        var _this = this;
        this.afipCondicionIvaServicio.listar().subscribe(function (res) {
            _this.condicionesIva = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de documentos
    ProveedorComponent.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de condiciones de compras
    ProveedorComponent.prototype.listarCondicionesCompras = function () {
        var _this = this;
        this.condicionCompraServicio.listar().subscribe(function (res) {
            _this.condicionesCompras = res.json();
            _this.formulario.get('condicionCompra').setValue(_this.condicionesCompras[0]);
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de cuentas bancarias
    ProveedorComponent.prototype.listarTiposCuentasBancarias = function () {
        var _this = this;
        this.tipoCuentaBancariaServicio.listar().subscribe(function (res) {
            _this.tiposCuentasBancarias = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece valores por defecto
    ProveedorComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('estaActivo').setValue(true);
    };
    //Vacia la lista de resultados de autocompletados
    ProveedorComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
        this.resultadosBancos = [];
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    ProveedorComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('tipoProveedor').enabled;
            this.formulario.get('afipCondicionIva').enabled;
            this.formulario.get('tipoDocumento').enabled;
            this.formulario.get('condicionCompra').enabled;
            this.formulario.get('estaActivo').enabled;
            this.formulario.get('tipoCuentaBancaria').enabled;
        }
        else {
            this.formulario.get('tipoProveedor').disabled;
            this.formulario.get('afipCondicionIva').disabled;
            this.formulario.get('tipoDocumento').disabled;
            this.formulario.get('condicionCompra').disabled;
            this.formulario.get('estaActivo').disabled;
            this.formulario.get('tipoCuentaBancaria').disabled;
        }
    };
    //Funcion para establecer los valores de las pestañas
    ProveedorComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarListas();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Establece valores al seleccionar una pestania
    ProveedorComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario('');
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
    ProveedorComponent.prototype.seleccionarOpcion = function (opcion, indice) {
        this.opcionSeleccionada = opcion;
        this.botonOpcionActivo = indice;
        switch (opcion) {
            case 8:
                setTimeout(function () {
                    document.getElementById('idRazonSocial').focus();
                }, 20);
                break;
            case 9:
                setTimeout(function () {
                    document.getElementById('idCondicionCompra').focus();
                }, 20);
                break;
            case 10:
                setTimeout(function () {
                    document.getElementById('idBanco').focus();
                }, 20);
                break;
            case 11:
                setTimeout(function () {
                    document.getElementById('idObservaciones').focus();
                }, 20);
                break;
            case 12:
                setTimeout(function () {
                    document.getElementById('idIngresarComprobante').focus();
                }, 20);
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ProveedorComponent.prototype.accion = function (indice) {
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
    ProveedorComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ProveedorComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    ProveedorComponent.prototype.agregar = function () {
        var _this = this;
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
    ProveedorComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario('');
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
    ProveedorComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ProveedorComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ProveedorComponent.prototype.lanzarError = function (err) {
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
        else if (respuesta.codigo == 11011) {
            document.getElementById("labelNumeroCBU").classList.add('label-error');
            document.getElementById("idNumeroCBU").classList.add('is-invalid');
            document.getElementById("idNumeroCBU").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    ProveedorComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Formatea el numero a x decimales
    ProveedorComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
    };
    //Manejo de colores de campos y labels con patron erroneo
    ProveedorComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'telefonoFijo') {
                    document.getElementById("labelSitioWeb").classList.add('label-error');
                    document.getElementById("idSitioWeb").classList.add('is-invalid');
                    this.toastr.error('Sitio Web incorrecto');
                }
            }
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ProveedorComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ProveedorComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    ProveedorComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ProveedorComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ProveedorComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ProveedorComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ProveedorComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Suspendida' : 'Activa';
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ProveedorComponent.prototype.manejarEvento = function (keycode) {
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
            if (opcion < this.opciones[(this.opciones.length - 1)].id) {
                this.seleccionarOpcion(opcion + 1, opcion - 7);
            }
            else {
                this.seleccionarOpcion(8, 0);
            }
        }
    };
    ProveedorComponent = __decorate([
        core_1.Component({
            selector: 'app-proveedor',
            templateUrl: './proveedor.component.html',
            styleUrls: ['./proveedor.component.css']
        }),
        __metadata("design:paramtypes", [proveedor_service_1.ProveedorService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            rol_opcion_service_1.RolOpcionService, barrio_service_1.BarrioService,
            localidad_service_1.LocalidadService, afip_condicion_iva_service_1.AfipCondicionIvaService,
            tipo_documento_service_1.TipoDocumentoService, tipo_proveedor_service_1.TipoProveedorService,
            condicion_compra_service_1.CondicionCompraService, banco_service_1.BancoService,
            tipo_cuenta_bancaria_service_1.TipoCuentaBancariaService, proveedor_1.Proveedor])
    ], ProveedorComponent);
    return ProveedorComponent;
}());
exports.ProveedorComponent = ProveedorComponent;
//# sourceMappingURL=proveedor.component.js.map