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
var viaje_propio_service_1 = require("../../servicios/viaje-propio.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var rol_opcion_service_1 = require("../../servicios/rol-opcion.service");
var fecha_service_1 = require("../../servicios/fecha.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var vehiculo_service_1 = require("../../servicios/vehiculo.service");
var personal_service_1 = require("../../servicios/personal.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var viajePropio_1 = require("src/app/modelos/viajePropio");
var viaje_tramo_component_1 = require("./viaje-tramo/viaje-tramo.component");
var viaje_combustible_component_1 = require("./viaje-combustible/viaje-combustible.component");
var viaje_efectivo_component_1 = require("./viaje-efectivo/viaje-efectivo.component");
var viaje_gasto_component_1 = require("./viaje-gasto/viaje-gasto.component");
var viaje_insumo_component_1 = require("./viaje-insumo/viaje-insumo.component");
var viaje_peaje_component_1 = require("./viaje-peaje/viaje-peaje.component");
var ViajeComponent = /** @class */ (function () {
    //Constructor
    function ViajeComponent(servicio, subopcionPestaniaService, appComponent, toastr, rolOpcionServicio, fechaServicio, sucursalServicio, vehiculoServicio, personalServicio, viajePropioModelo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.rolOpcionServicio = rolOpcionServicio;
        this.fechaServicio = fechaServicio;
        this.sucursalServicio = sucursalServicio;
        this.vehiculoServicio = vehiculoServicio;
        this.personalServicio = personalServicio;
        this.viajePropioModelo = viajePropioModelo;
        //Define la pestania activa
        this.activeLink = null;
        //Define el indice seleccionado de pestania
        this.indiceSeleccionado = null;
        //Define la pestania actual seleccionada
        this.pestaniaActual = null;
        //Define si mostrar el autocompletado
        this.mostrarAutocompletado = null;
        //Define si los campos de la cebecera son de solo lectura
        this.soloLecturaCabecera = false;
        //Define si el campo es de solo lectura
        this.soloLectura = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista de opciones
        this.opciones = [];
        //Define un formulario viaje propio tramo para validaciones de campos
        this.formularioViajePropioTramo = new forms_1.FormGroup({});
        //Define un formulario viaje propio combustible para validaciones de campos
        this.formularioViajePropioCombustible = new forms_1.FormGroup({});
        //Define un formulario viaje propio efectivo para validaciones de campos
        this.formularioViajePropioEfectivo = new forms_1.FormGroup({});
        //Define un formulario viaje propio insumo para validaciones de campos
        this.formularioViajePropioInsumo = new forms_1.FormGroup({});
        //Define un formulario viaje remitos dadores de carga para validaciones de campos
        this.formularioViajeRemitoDC = new forms_1.FormGroup({});
        //Define un formulario viaje remito para validaciones de campos
        this.formularioViajeRemito = new forms_1.FormGroup({});
        //Define un formulario viaje propio gasto para validaciones de campos
        this.formularioViajePropioGasto = new forms_1.FormGroup({});
        //Define un formulario viaje propio peaje para validaciones de campos
        this.formularioViajePropioPeaje = new forms_1.FormGroup({});
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la opcion seleccionada
        this.opcionSeleccionada = null;
        //Define la opcion activa
        this.botonOpcionActivo = null;
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de vehiculos
        this.resultadosVehiculos = [];
        //Define la lista de resultados de vehiculos remolques
        this.resultadosVehiculosRemolques = [];
        //Define la lista de resultados de choferes
        this.resultadosChoferes = [];
        //Define el tipo de viaje (Propio o Tercero)
        this.tipoViaje = new forms_1.FormControl();
        //Define el nombre del usuario logueado
        this.usuarioNombre = new forms_1.FormControl();
        //Define la lista de sucursales
        this.sucursales = [];
        //Define una bandera para campos solo lectura de componentes hijos
        this.banderaSoloLectura = false;
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
    ViajeComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio
        this.formularioViajePropio = this.viajePropioModelo.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Establece la primera opcion seleccionada
        this.seleccionarOpcion(22, 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de sucursales
        this.listarSucursales();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
        //Autocompletado Vehiculo - Buscar por alias
        this.formularioViajePropio.get('vehiculo').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.vehiculoServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosVehiculos = response;
                });
            }
        });
        //Autocompletado Vehiculo Remolque - Buscar por alias
        this.formularioViajePropio.get('vehiculoRemolque').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.vehiculoServicio.listarPorAliasFiltroRemolque(data).subscribe(function (response) {
                    _this.resultadosVehiculosRemolques = response;
                });
            }
        });
        //Autocompletado Personal - Buscar por alias
        this.formularioViajePropio.get('personal').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.personalServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosChoferes = response;
                });
            }
        });
    };
    //Establece el formulario y listas al seleccionar un elemento del autocompletado
    ViajeComponent.prototype.cambioAutocompletado = function () {
        var _this = this;
        var viaje = this.autocompletado.value;
        this.servicio.obtenerPorId(viaje.id).subscribe(function (res) {
            var viajePropio = res.json();
            _this.formularioViajePropio.setValue(viajePropio);
            _this.viajeTramoComponente.establecerLista(viajePropio.viajePropioTramos);
            _this.viajeCombustibleComponente.establecerLista(viajePropio.viajePropioCombustibles);
            _this.viajeEfectivoComponente.establecerLista(viajePropio.viajePropioEfectivos);
            _this.viajeInsumoComponente.establecerLista(viajePropio.viajePropioInsumos);
            _this.viajeGastoComponente.establecerLista(viajePropio.viajePropioGastos);
            _this.viajePeajeComponente.establecerLista(viajePropio.viajePropioPeajes);
        });
    };
    //Establece los valores por defecto
    ViajeComponent.prototype.establecerValoresPorDefecto = function () {
        var _this = this;
        var usuario = this.appComponent.getUsuario();
        this.formularioViajePropio.get('usuario').setValue(usuario);
        this.usuarioNombre.setValue(usuario.nombre);
        this.tipoViaje.setValue(true);
        this.formularioViajePropio.get('esRemolquePropio').setValue(true);
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropio.get('fecha').setValue(res.json());
        });
    };
    //Vacia la lista de resultados de autocompletados
    ViajeComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosVehiculos = [];
        this.resultadosVehiculosRemolques = [];
        this.resultadosChoferes = [];
    };
    //Vacia la lista de componentes hijos
    ViajeComponent.prototype.vaciarListasHijos = function () {
        this.viajeCombustibleComponente.vaciarListas();
        this.viajeEfectivoComponente.vaciarListas();
        this.viajeGastoComponente.vaciarListas();
        this.viajeInsumoComponente.vaciarListas();
        this.viajePeajeComponente.vaciarListas();
        this.viajeTramoComponente.vaciarListas();
    };
    //Obtiene el listado de sucursales
    ViajeComponent.prototype.listarSucursales = function () {
        var _this = this;
        this.sucursalServicio.listar().subscribe(function (res) {
            _this.sucursales = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece los campos select en solo lectura
    ViajeComponent.prototype.establecerCamposSoloLectura = function (opcion) {
        if (opcion) {
            this.tipoViaje.disable();
            this.formularioViajePropio.get('esRemolquePropio').disable();
            this.formularioViajePropio.get('sucursal').disable();
        }
        else {
            this.tipoViaje.enable();
            this.formularioViajePropio.get('esRemolquePropio').enable();
            this.formularioViajePropio.get('sucursal').enable();
        }
    };
    //Funcion para establecer los valores de las pestañas
    ViajeComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLecturaCabecera, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLecturaCabecera = soloLecturaCabecera;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarListas();
        this.establecerValoresPorDefecto();
        if (this.banderaSoloLectura) {
            this.viajeTramoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajeTramoComponente.reestablecerFormularioYLista();
            this.viajeCombustibleComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajeCombustibleComponente.reestablecerFormularioYLista();
            this.viajeEfectivoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajeEfectivoComponente.reestablecerFormularioYLista();
            this.viajeInsumoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajeInsumoComponente.reestablecerFormularioYLista();
            this.viajeGastoComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajeGastoComponente.reestablecerFormularioYLista();
            this.viajePeajeComponente.establecerCamposSoloLectura(this.indiceSeleccionado);
            this.viajePeajeComponente.reestablecerFormularioYLista();
        }
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Establece valores al seleccionar una pestania
    ViajeComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
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
                this.establecerCamposSoloLectura(false);
                this.establecerValoresPestania(nombre, false, false, false, true, 'idFecha');
                break;
            case 2:
                this.banderaSoloLectura = true;
                this.establecerCamposSoloLectura(true);
                this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
                break;
            case 3:
                this.banderaSoloLectura = true;
                this.establecerCamposSoloLectura(true);
                this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
                break;
            case 4:
                this.banderaSoloLectura = true;
                this.establecerCamposSoloLectura(true);
                this.establecerValoresPestania(nombre, true, true, true, true, 'idAutocompletado');
                break;
            case 5:
                this.banderaSoloLectura = true;
                break;
            default:
                break;
        }
    };
    //Establece la opcion seleccionada
    ViajeComponent.prototype.seleccionarOpcion = function (opcion, indice) {
        this.opcionSeleccionada = opcion;
        this.botonOpcionActivo = indice;
        switch (opcion) {
            case 1:
                setTimeout(function () {
                    document.getElementById('idFecha').focus();
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
    //Obtiene el siguiente id
    ViajeComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formularioViajePropio.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ViajeComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Recibe la lista de tramos de Viaje Tramos
    ViajeComponent.prototype.recibirTramos = function ($event) {
        this.formularioViajePropio.get('viajePropioTramos').setValue($event);
    };
    //Recibe la lista de combustibles de Viaje Combustible
    ViajeComponent.prototype.recibirCombustibles = function ($event) {
        this.formularioViajePropio.get('viajePropioCombustibles').setValue($event);
    };
    //Recibe la lista de adelantos de efectivo de Viaje Efectivo
    ViajeComponent.prototype.recibirEfectivos = function ($event) {
        this.formularioViajePropio.get('viajePropioEfectivos').setValue($event);
    };
    //Recibe la lista de ordenes de insumo de Viaje Insumo
    ViajeComponent.prototype.recibirInsumos = function ($event) {
        this.formularioViajePropio.get('viajePropioInsumos').setValue($event);
    };
    //Recibe la lista de gastos de Viaje Gasto
    ViajeComponent.prototype.recibirGastos = function ($event) {
        this.formularioViajePropio.get('viajePropioGastos').setValue($event);
    };
    //Recibe la lista de peajes de Viaje Peaje
    ViajeComponent.prototype.recibirPeajes = function ($event) {
        this.formularioViajePropio.get('viajePropioPeajes').setValue($event);
    };
    //Recibe la lista de remitos de Viaje Remito
    ViajeComponent.prototype.recibirRemitos = function ($event) {
        console.log($event);
    };
    //Dependiendo en que pestaña esta, es la acción que realiza
    ViajeComponent.prototype.accion = function () {
        switch (this.indiceSeleccionado) {
            case 1:
                this.agregar();
                break;
            case 2:
                break;
            case 3:
                this.actualizar();
                break;
            case 4:
                break;
        }
    };
    //Agregar el viaje propio
    ViajeComponent.prototype.agregar = function () {
        var _this = this;
        var vehiculo = this.formularioViajePropio.get('vehiculo').value;
        this.formularioViajePropio.get('empresa').setValue(vehiculo.empresa);
        this.formularioViajePropio.get('empresaEmision').setValue(this.appComponent.getEmpresa());
        var empresa = this.formularioViajePropio.get('empresa').value;
        this.formularioViajePropio.get('afipCondicionIva').setValue(empresa.afipCondicionIva);
        this.servicio.agregar(this.formularioViajePropio.value).subscribe(function (res) {
            var resultado = res.json();
            if (resultado.codigo == 201) {
                _this.reestablecerFormulario(resultado.id);
                _this.vaciarListasHijos();
                _this.establecerValoresPorDefecto();
                document.getElementById('idFecha').focus();
                _this.toastr.success(resultado.mensaje);
            }
        }, function (err) {
            var resultado = err.json();
            _this.toastr.error(resultado.mensaje);
        });
    };
    //Actualiza el viaje propio
    ViajeComponent.prototype.actualizar = function () {
        var _this = this;
        this.establecerCamposSoloLectura(false);
        this.servicio.actualizar(this.formularioViajePropio.value).subscribe(function (res) {
            var resultado = res.json();
            if (resultado.codigo == 200) {
                _this.establecerCamposSoloLectura(true);
                _this.reestablecerFormulario(resultado.id);
                _this.vaciarListasHijos();
                _this.establecerValoresPorDefecto();
                document.getElementById('idAutocompletado').focus();
                _this.toastr.success(resultado.mensaje);
            }
        }, function (err) {
            var resultado = err.json();
            _this.toastr.error(resultado.mensaje);
        });
    };
    //Reestablece el formulario
    ViajeComponent.prototype.reestablecerFormulario = function (id) {
        this.formularioViajePropio.reset();
        this.formularioViajePropio.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ViajeComponent.prototype.lanzarError = function (err) {
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
    ViajeComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Manejo de colores de campos y labels con patron erroneo
    ViajeComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formularioViajePropio.get(campo).value;
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
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ViajeComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formularioViajePropio.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ViajeComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formularioViajePropio.patchValue(elemento);
    };
    ViajeComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ViajeComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ViajeComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.dominio ? elemento.dominio : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ViajeComponent.prototype.manejarEvento = function (keycode) {
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
    __decorate([
        core_1.ViewChild(viaje_tramo_component_1.ViajeTramoComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajeTramoComponente", void 0);
    __decorate([
        core_1.ViewChild(viaje_combustible_component_1.ViajeCombustibleComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajeCombustibleComponente", void 0);
    __decorate([
        core_1.ViewChild(viaje_efectivo_component_1.ViajeEfectivoComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajeEfectivoComponente", void 0);
    __decorate([
        core_1.ViewChild(viaje_gasto_component_1.ViajeGastoComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajeGastoComponente", void 0);
    __decorate([
        core_1.ViewChild(viaje_insumo_component_1.ViajeInsumoComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajeInsumoComponente", void 0);
    __decorate([
        core_1.ViewChild(viaje_peaje_component_1.ViajePeajeComponent),
        __metadata("design:type", Object)
    ], ViajeComponent.prototype, "viajePeajeComponente", void 0);
    ViajeComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje',
            templateUrl: './viaje.component.html',
            styleUrls: ['./viaje.component.css']
        }),
        __metadata("design:paramtypes", [viaje_propio_service_1.ViajePropioService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            rol_opcion_service_1.RolOpcionService, fecha_service_1.FechaService,
            sucursal_service_1.SucursalService, vehiculo_service_1.VehiculoService,
            personal_service_1.PersonalService, viajePropio_1.ViajePropio])
    ], ViajeComponent);
    return ViajeComponent;
}());
exports.ViajeComponent = ViajeComponent;
//# sourceMappingURL=viaje.component.js.map