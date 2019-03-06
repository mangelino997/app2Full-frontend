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
var viaje_unidad_negocio_service_1 = require("src/app/servicios/viaje-unidad-negocio.service");
var viajeUnidadNegocio_1 = require("src/app/modelos/viajeUnidadNegocio");
var ViajeUnidadNegocioComponent = /** @class */ (function () {
    //Constructor
    function ViajeUnidadNegocioComponent(servicio, ventaConcepto, appComponent, subopcionPestaniaService, toastr) {
        var _this = this;
        this.servicio = servicio;
        this.ventaConcepto = ventaConcepto;
        this.appComponent = appComponent;
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
        //Defien la lista de empresas
        this.empresas = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
        }, function (err) {
        });
        //Autocompletado - Buscar por nombre
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultados = res;
                    console.log(res);
                });
            }
        });
    }
    ViajeUnidadNegocioComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.ventaConcepto.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Obtiene el listado de registros
    ViajeUnidadNegocioComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            console.log(res.json());
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    ViajeUnidadNegocioComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    ViajeUnidadNegocioComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
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
                this.establecerValoresPestania(nombre, false, false, true, 'idNombre');
                break;
            case 2:
                this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
                break;
            case 3:
                this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
                break;
            case 4:
                this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ViajeUnidadNegocioComponent.prototype.accion = function (indice) {
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
    ViajeUnidadNegocioComponent.prototype.agregar = function () {
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
            document.getElementById("labelNombre").classList.add('label-error');
            document.getElementById("idNombre").classList.add('is-invalid');
            document.getElementById("idNombre").focus();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    ViajeUnidadNegocioComponent.prototype.actualizar = function () {
        var _this = this;
        console.log(this.formulario.value);
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
            document.getElementById("labelNombre").classList.add('label-error');
            document.getElementById("idNombre").classList.add('is-invalid');
            document.getElementById("idNombre").focus();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un registro
    ViajeUnidadNegocioComponent.prototype.eliminar = function () {
        console.log();
    };
    //Obtiene el siguiente id
    ViajeUnidadNegocioComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Reestablece los campos formularios
    ViajeUnidadNegocioComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
    };
    //Manejo de colores de campos y labels
    ViajeUnidadNegocioComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ViajeUnidadNegocioComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ViajeUnidadNegocioComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Define como se muestra los datos en el autcompletado
    ViajeUnidadNegocioComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    ViajeUnidadNegocioComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ViajeUnidadNegocioComponent.prototype.manejarEvento = function (keycode) {
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
    ViajeUnidadNegocioComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-unidad-negocio',
            templateUrl: './viaje-unidad-negocio.component.html',
            styleUrls: ['./viaje-unidad-negocio.component.css']
        }),
        __metadata("design:paramtypes", [viaje_unidad_negocio_service_1.ViajeUnidadNegocioService, viajeUnidadNegocio_1.ViajeUnidadNegocio, app_component_1.AppComponent,
            subopcion_pestania_service_1.SubopcionPestaniaService, ngx_toastr_1.ToastrService])
    ], ViajeUnidadNegocioComponent);
    return ViajeUnidadNegocioComponent;
}());
exports.ViajeUnidadNegocioComponent = ViajeUnidadNegocioComponent;
//# sourceMappingURL=viaje-unidad-negocio.component.js.map