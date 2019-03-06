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
var punto_venta_service_1 = require("../../servicios/punto-venta.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var empresa_service_1 = require("../../servicios/empresa.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var material_1 = require("@angular/material");
var PuntoVentaComponent = /** @class */ (function () {
    //Constructor
    function PuntoVentaComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, sucursalServicio, empresaServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.sucursalServicio = sucursalServicio;
        this.empresaServicio = empresaServicio;
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
        //Define la lista de sucursales
        this.sucursales = [];
        //Define la lista de empresas
        this.empresas = [];
        //Define la lista de puntos de ventas de sucursal
        this.puntosVentas = [];
        //Define la lista de puntos de ventas como autocompletado
        this.autocompletado = new forms_1.FormControl();
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
        //Se subscribe al servicio de lista de registros
        this.servicio.listaCompleta.subscribe(function (res) {
            _this.listaCompleta = res;
        });
    }
    //Al iniciarse el componente
    PuntoVentaComponent.prototype.ngOnInit = function () {
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            sucursal: new forms_1.FormControl('', forms_1.Validators.required),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            puntoVenta: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(5)]),
            fe: new forms_1.FormControl('', forms_1.Validators.required),
            codigoAfip: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(3)]),
            feEnLinea: new forms_1.FormControl('', forms_1.Validators.required),
            feCAEA: new forms_1.FormControl('', forms_1.Validators.required),
            esCuentaOrden: new forms_1.FormControl('', forms_1.Validators.required),
            ultimoNumero: new forms_1.FormControl(),
            copias: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(3)]),
            imprime: new forms_1.FormControl('', forms_1.Validators.required),
            estaHabilitado: new forms_1.FormControl('', forms_1.Validators.required),
            porDefecto: new forms_1.FormControl()
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de sucursales
        this.listarSucursales();
        //Obtiene la lista de empresas
        this.listarEmpresas();
    };
    //Obtiene el listado de sucursales
    PuntoVentaComponent.prototype.listarSucursales = function () {
        var _this = this;
        this.sucursalServicio.listar().subscribe(function (res) {
            _this.sucursales = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de empresas
    PuntoVentaComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece el formulario al seleccionar elemento de autocompletado
    PuntoVentaComponent.prototype.establecerFormulario = function (elemento) {
        this.formulario.setValue(elemento);
        this.formulario.get('puntoVenta').setValue(this.displayFb(elemento));
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    PuntoVentaComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('empresa').enabled;
            this.formulario.get('fe').enabled;
            this.formulario.get('feEnLinea').enabled;
            this.formulario.get('feCAEA').enabled;
            this.formulario.get('esCuentaOrden').enabled;
            this.formulario.get('imprime').enabled;
            this.formulario.get('estaHabilitado').enabled;
        }
        else {
            this.formulario.get('empresa').disabled;
            this.formulario.get('fe').disabled;
            this.formulario.get('feEnLinea').disabled;
            this.formulario.get('feCAEA').disabled;
            this.formulario.get('esCuentaOrden').disabled;
            this.formulario.get('imprime').disabled;
            this.formulario.get('estaHabilitado').disabled;
        }
    };
    //Funcion para establecer los valores de las pestañas
    PuntoVentaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Establece valores al seleccionar una pestania
    PuntoVentaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idSucursal');
                break;
            case 2:
                try {
                    this.autoComplete.closePanel();
                }
                catch (e) { }
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idSucursal');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idSucursal');
                break;
            case 4:
                try {
                    this.autoComplete.closePanel();
                }
                catch (e) { }
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idSucursal');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    PuntoVentaComponent.prototype.accion = function (indice) {
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
    PuntoVentaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    PuntoVentaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista por sucursal
    PuntoVentaComponent.prototype.listarPorSucursal = function (elemento) {
        var _this = this;
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorSucursal(elemento.id).subscribe(function (res) {
                _this.puntosVentas = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    PuntoVentaComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idSucursal').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    PuntoVentaComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idSucursal').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    PuntoVentaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    PuntoVentaComponent.prototype.reestablecerFormulario = function () {
        this.formulario.reset();
        this.autocompletado.setValue(undefined);
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    PuntoVentaComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11013) {
            document.getElementById("labelTelefonoFijo").classList.add('label-error');
            document.getElementById("idTelefonoFijo").classList.add('is-invalid');
            document.getElementById("idTelefonoFijo").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    PuntoVentaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    PuntoVentaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    PuntoVentaComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    PuntoVentaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    PuntoVentaComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    PuntoVentaComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.puntoVenta ? ("00000" + elemento.puntoVenta).slice(-5) : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    PuntoVentaComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.razonSocial ? elemento.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado d
    PuntoVentaComponent.prototype.displayFd = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Si' : 'No';
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    PuntoVentaComponent.prototype.manejarEvento = function (keycode) {
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
    __decorate([
        core_1.ViewChild('autoCompleteInput', { read: material_1.MatAutocompleteTrigger }),
        __metadata("design:type", material_1.MatAutocompleteTrigger)
    ], PuntoVentaComponent.prototype, "autoComplete", void 0);
    PuntoVentaComponent = __decorate([
        core_1.Component({
            selector: 'app-punto-venta',
            templateUrl: './punto-venta.component.html',
            styleUrls: ['./punto-venta.component.css']
        }),
        __metadata("design:paramtypes", [punto_venta_service_1.PuntoVentaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            sucursal_service_1.SucursalService, empresa_service_1.EmpresaService])
    ], PuntoVentaComponent);
    return PuntoVentaComponent;
}());
exports.PuntoVentaComponent = PuntoVentaComponent;
//# sourceMappingURL=punto-venta.component.js.map