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
var moneda_cuenta_contable_1 = require("src/app/modelos/moneda-cuenta-contable");
var moneda_cuenta_contable_service_1 = require("src/app/servicios/moneda-cuenta-contable.service");
var plan_cuenta_service_1 = require("src/app/servicios/plan-cuenta.service");
var moneda_service_1 = require("src/app/servicios/moneda.service");
var empresa_service_1 = require("src/app/servicios/empresa.service");
var MonedaCuentaContableComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function MonedaCuentaContableComponent(monedaCuentaContableServicio, monedaCuentaContable, planCuentaServicio, subopcionPestaniaService, monedaServicio, empresaServicio, toastr) {
        var _this = this;
        this.monedaCuentaContableServicio = monedaCuentaContableServicio;
        this.monedaCuentaContable = monedaCuentaContable;
        this.planCuentaServicio = planCuentaServicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.monedaServicio = monedaServicio;
        this.empresaServicio = empresaServicio;
        this.toastr = toastr;
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
        //Define la lista de Monedas
        this.listaMonedas = [];
        //Define la lista de Empresas
        this.listaEmpresas = [];
        //Define el autocompletado
        this.autocompletado = new forms_1.FormControl();
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
        //Obtiene la lista de pestanias
        this.subopcionPestaniaService.listarPorRolSubopcion(1, 19)
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
            console.log(res.json());
        }, function (err) {
            console.log(err);
        });
        //Controla el autocompletado
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.monedaCuentaContableServicio.listarPorMoneda(data).subscribe(function (res) {
                    _this.resultados = res.json();
                    console.log(res.json());
                });
            }
        });
    }
    MonedaCuentaContableComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.monedaCuentaContable.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Lista las Monedas Cuentas Contables
        this.listar();
        //Carga select con la lista de Monedas
        this.listarMonedas();
        //Carga select con la lista de Empresas
        this.listarEmpresas();
    };
    //Obtiene el listado de registros
    MonedaCuentaContableComponent.prototype.listar = function () {
        var _this = this;
        this.monedaCuentaContableServicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    MonedaCuentaContableComponent.prototype.listarMonedas = function () {
        var _this = this;
        this.monedaServicio.listar().subscribe(function (res) {
            _this.listaMonedas = res.json();
        }, function (err) {
            console.log(err);
        });
    }; //Obtiene el listado de registros
    MonedaCuentaContableComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.listaEmpresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    MonedaCuentaContableComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    ;
    //Establece valores al seleccionar una pestania
    MonedaCuentaContableComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.formulario.reset();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        /*
        * Se vacia el formulario solo cuando se cambia de pestania, no cuando
        * cuando se hace click en ver o mod de la pestania lista
        */
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultados = [];
        }
        switch (id) {
            case 1:
                // this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idMoneda');
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
    //Habilita o deshabilita los campos dependiendo de la pestaña
    MonedaCuentaContableComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('moneda').enable();
            this.formulario.get('empresa').enable();
            this.formulario.get('cuentaContable').enable();
        }
        else {
            this.formulario.get('moneda').disable();
            this.formulario.get('empresa').disable();
            this.formulario.get('cuentaContable').enable();
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    // public accion(indice) {
    //   switch (indice) {
    //     case 1:
    //       this.agregar();
    //       break;
    //     case 3:
    //       this.actualizar();
    //       break;
    //     case 4:
    //       this.eliminar();
    //       break;
    //     default:
    //       break;
    //   }
    // }
    //Reestablece los campos formularios
    MonedaCuentaContableComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
        setTimeout(function () {
            document.getElementById('idNombre').focus();
        }, 20);
    };
    //Manejo de colores de campos y labels
    MonedaCuentaContableComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Establece el formulario al seleccionar elemento del autocompletado
    MonedaCuentaContableComponent.prototype.cambioAutocompletado = function () {
        var elemento = this.autocompletado.value;
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    MonedaCuentaContableComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    MonedaCuentaContableComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    MonedaCuentaContableComponent.prototype.manejarEvento = function (keycode) {
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
    MonedaCuentaContableComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Formatea el valor del autocompletado
    MonedaCuentaContableComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    MonedaCuentaContableComponent = __decorate([
        core_1.Component({
            selector: 'app-moneda-cuenta-contable',
            templateUrl: './moneda-cuenta-contable.component.html',
            styleUrls: ['./moneda-cuenta-contable.component.css']
        }),
        __metadata("design:paramtypes", [moneda_cuenta_contable_service_1.MonedaCuentaContableService, moneda_cuenta_contable_1.MonedaCuentaContable,
            plan_cuenta_service_1.PlanCuentaService, subopcion_pestania_service_1.SubopcionPestaniaService, moneda_service_1.MonedaService,
            empresa_service_1.EmpresaService, ngx_toastr_1.ToastrService])
    ], MonedaCuentaContableComponent);
    return MonedaCuentaContableComponent;
}());
exports.MonedaCuentaContableComponent = MonedaCuentaContableComponent;
//# sourceMappingURL=moneda-cuenta-contable.component.js.map