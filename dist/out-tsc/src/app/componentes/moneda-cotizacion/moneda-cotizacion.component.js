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
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var moneda_cotizacion_1 = require("src/app/modelos/moneda-cotizacion");
var moneda_cotizacion_service_1 = require("src/app/servicios/moneda-cotizacion.service");
var moneda_service_1 = require("src/app/servicios/moneda.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var MonedaCotizacionComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function MonedaCotizacionComponent(appComponent, monedaCotizacion, monedaCotizacionServicio, monedaServicio, subopcionPestaniaService, toastr, fechaServicio) {
        var _this = this;
        this.appComponent = appComponent;
        this.monedaCotizacion = monedaCotizacion;
        this.monedaCotizacionServicio = monedaCotizacionServicio;
        this.monedaServicio = monedaServicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.toastr = toastr;
        this.fechaServicio = fechaServicio;
        //Define la pestania activa
        this.activeLink = null;
        //Define el indice seleccionado de pestania
        this.indiceSeleccionado = null;
        //Define la pestania actual seleccionada
        this.pestaniaActual = null;
        //Define el nombre del Boton
        this.nombreBtn = null;
        //Define si mostrar el autocompletado
        this.mostrarAutocompletado = null;
        //Define si el campo es de solo lectura
        this.soloLectura = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define si mostrar el boton
        this.mostrarAgregar = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la lista completa de Monedas
        this.listaMonedas = [];
        //Define la lista completa de Monedas
        this.listaMonedaCotizacion = [];
        //Define el autocompletado
        this.autocompletado = new forms_1.FormControl();
        //Define el id que se muestra en el campo Codigo
        this.id = new forms_1.FormControl();
        //Define empresa para las busquedas
        this.empresaBusqueda = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda companias seguros
        this.resultadosCompaniasSeguros = [];
        //Defien la lista de empresas
        this.empresas = [];
        //Define el mostrado de datos y comparacion en campo select
        this.compareFn = this.compararFn.bind(this);
        //Actualiza en tiempo real la tabla
        this.monedaCotizacionServicio.listaCompleta.subscribe(function (res) {
            _this.listaMonedaCotizacion = res;
            console.log(_this.listaMonedaCotizacion);
        });
        //Controla el autocompletado
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.monedaCotizacionServicio.listarPorMoneda(data).subscribe(function (res) {
                    _this.resultados = res.json();
                    console.log(res.json());
                });
            }
        });
    }
    MonedaCotizacionComponent.prototype.ngOnInit = function () {
        //Inicializa el boton en Agregar
        this.mostrarAgregar = true;
        //Define el formulario y validaciones
        this.formulario = this.monedaCotizacion.formulario;
        //Lista las Monedas
        this.listarMonedas();
        //Inicializamos con la fecha actual
        this.establecerFecha();
        console.log(this.mostrarAgregar);
    };
    //Establecer Fecha
    MonedaCotizacionComponent.prototype.establecerFecha = function () {
        var _this = this;
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formulario.get('fecha').setValue(res.json());
        }, function (err) {
            _this.toastr.error(err.mensaje);
        });
    };
    //Obtiene el listado de Monedas
    MonedaCotizacionComponent.prototype.listarMonedas = function () {
        var _this = this;
        this.monedaServicio.listar().subscribe(function (res) {
            _this.listaMonedas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    MonedaCotizacionComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.monedaCotizacionServicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            _this.reestablecerFormulario(respuesta.id);
            setTimeout(function () {
                document.getElementById('idNombre').focus();
            }, 20);
            _this.toastr.success(respuesta.mensaje);
        }, function (err) {
            _this.toastr.error(err.json().mensaje);
        });
    };
    //Actualiza un registro
    MonedaCotizacionComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        console.log(this.formulario.value);
        this.monedaCotizacionServicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            _this.reestablecerFormulario(respuesta.id);
            setTimeout(function () {
                document.getElementById('idNombre').focus();
            }, 20);
            _this.toastr.success(respuesta.mensaje);
        }, function (err) {
            _this.toastr.error(err.json().mensaje);
        });
    };
    //Carga la tabla con los datos de la moneda seleccionada
    MonedaCotizacionComponent.prototype.cambioSeleccionado = function () {
        var _this = this;
        console.log(this.formulario.value);
        this.monedaCotizacionServicio.listarPorMoneda(this.formulario.get('moneda').value.id).subscribe(function (res) {
            _this.listaMonedaCotizacion = res.json();
            console.log(res.json());
        }, function (err) {
        });
    };
    //Reestablece los campos formularios
    MonedaCotizacionComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.get('fecha').reset();
        this.formulario.get('valor').reset();
        this.autocompletado.setValue(undefined);
        this.resultados = [];
        this.establecerFecha();
        this.mostrarAgregar = true;
    };
    //Establece el formulario al seleccionar elemento del autocompletado
    MonedaCotizacionComponent.prototype.cambioAutocompletado = function () {
        var elemento = this.autocompletado.value;
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Manejo de colores de campos y labels
    MonedaCotizacionComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Muestra en la pestania buscar el elemento seleccionado de listar
    MonedaCotizacionComponent.prototype.activarConsultar = function (elemento) {
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    MonedaCotizacionComponent.prototype.activarActualizar = function (elemento) {
        this.mostrarAgregar = false;
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
        this.formulario.get('fecha').setValue(elemento.fecha);
        this.formulario.get('valor').setValue(elemento.valor);
    };
    MonedaCotizacionComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Formatea el valor del autocompletado
    MonedaCotizacionComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    MonedaCotizacionComponent = __decorate([
        core_1.Component({
            selector: 'app-moneda-cotizacion',
            templateUrl: './moneda-cotizacion.component.html',
            styleUrls: ['./moneda-cotizacion.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, moneda_cotizacion_1.MonedaCotizacion, moneda_cotizacion_service_1.MonedaCotizacionService, moneda_service_1.MonedaService,
            subopcion_pestania_service_1.SubopcionPestaniaService, ngx_toastr_1.ToastrService, fecha_service_1.FechaService])
    ], MonedaCotizacionComponent);
    return MonedaCotizacionComponent;
}());
exports.MonedaCotizacionComponent = MonedaCotizacionComponent;
//# sourceMappingURL=moneda-cotizacion.component.js.map