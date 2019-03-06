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
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var condicion_venta_service_1 = require("src/app/servicios/condicion-venta.service");
var condicion_venta_1 = require("src/app/modelos/condicion-venta");
var CondicionVentaComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function CondicionVentaComponent(appComponent, condicionVenta, servicio, subopcionPestaniaService, toastr) {
        var _this = this;
        this.appComponent = appComponent;
        this.condicionVenta = condicionVenta;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
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
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestanias
        this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
        }, function (err) {
        });
        //Controla el autocompletado
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultados = res;
                });
            }
        });
    }
    CondicionVentaComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.condicionVenta.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Obtiene el listado de registros
    CondicionVentaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            console.log(res.json());
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    CondicionVentaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    CondicionVentaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.formulario.reset();
        this.listar();
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
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
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
    CondicionVentaComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('esContado').enable();
        }
        else {
            this.formulario.get('esContado').disable();
        }
    };
    //Obtiene el siguiente id
    CondicionVentaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    CondicionVentaComponent.prototype.accion = function (indice) {
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
    //Agrega un registro
    CondicionVentaComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idNombre').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11002) {
                document.getElementById("labelNombre").classList.add('label-error');
                document.getElementById("idNombre").classList.add('is-invalid');
                document.getElementById("idNombre").focus();
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Actualiza un registro
    CondicionVentaComponent.prototype.actualizar = function () {
        var _this = this;
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
            var respuesta = err.json();
            if (respuesta.codigo == 11002) {
                document.getElementById("labelNombre").classList.add('label-error');
                document.getElementById("idNombre").classList.add('is-invalid');
                document.getElementById("idNombre").focus();
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Elimina un registro
    CondicionVentaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece los campos formularios
    CondicionVentaComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
    };
    //Manejo de colores de campos y labels
    CondicionVentaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Muestra en la pestania buscar el elemento seleccionado de listar
    CondicionVentaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    CondicionVentaComponent.prototype.activarActualizar = function (elemento) {
        console.log(elemento);
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    CondicionVentaComponent.prototype.manejarEvento = function (keycode) {
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
    CondicionVentaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    CondicionVentaComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    CondicionVentaComponent = __decorate([
        core_1.Component({
            selector: 'app-condicion-venta',
            templateUrl: './condicion-venta.component.html',
            styleUrls: ['./condicion-venta.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, condicion_venta_1.CondicionVenta, condicion_venta_service_1.CondicionVentaService, subopcion_pestania_service_1.SubopcionPestaniaService, ngx_toastr_1.ToastrService])
    ], CondicionVentaComponent);
    return CondicionVentaComponent;
}());
exports.CondicionVentaComponent = CondicionVentaComponent;
//# sourceMappingURL=condicion-venta.component.js.map