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
var compania_seguro_poliza_service_1 = require("../../servicios/compania-seguro-poliza.service");
var compania_seguro_service_1 = require("../../servicios/compania-seguro.service");
var empresa_service_1 = require("../../servicios/empresa.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var companiaSeguroPoliza_1 = require("src/app/modelos/companiaSeguroPoliza");
var CompaniaSeguroPolizaComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function CompaniaSeguroPolizaComponent(servicio, subopcionPestaniaService, appComponent, toastr, companiaSeguroServicio, empresaServicio, companiaSeguroPolizaModelo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.companiaSeguroServicio = companiaSeguroServicio;
        this.empresaServicio = empresaServicio;
        this.companiaSeguroPolizaModelo = companiaSeguroPolizaModelo;
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
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(1, 195)
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
    CompaniaSeguroPolizaComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define el formulario y validaciones
        this.formulario = this.companiaSeguroPolizaModelo.formulario;
        //Autocompletado Compania Seguro - Buscar por nombre
        this.formulario.get('companiaSeguro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string' && data != '') {
                _this.companiaSeguroServicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultadosCompaniasSeguros = res;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista de empresas
        this.listarEmpresas();
    };
    //Obtiene la lista de empresas
    CompaniaSeguroPolizaComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        });
    };
    //Vacia la listas de resultados autocompletados
    CompaniaSeguroPolizaComponent.prototype.vaciarListas = function () {
        this.listaCompleta = [];
        this.resultadosCompaniasSeguros = [];
    };
    //Funcion para establecer los valores de las pestañas
    CompaniaSeguroPolizaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    ;
    //Habilita o deshabilita los campos dependiendo de la pestaña
    CompaniaSeguroPolizaComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('empresa').enable();
        }
        else {
            this.formulario.get('empresa').disable();
        }
    };
    //Establece valores al seleccionar una pestania
    CompaniaSeguroPolizaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.empresaBusqueda.setValue(undefined);
            this.vaciarListas();
        }
        this.formulario.reset();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idCompaniaSeguro');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idCompaniaSeguro');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idCompaniaSeguro');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idCompaniaSeguro');
                break;
            case 5:
                setTimeout(function () {
                    document.getElementById('idCompaniaSeguro').focus();
                }, 20);
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    CompaniaSeguroPolizaComponent.prototype.accion = function (indice) {
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
    CompaniaSeguroPolizaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    CompaniaSeguroPolizaComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idCompaniaSeguro').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    CompaniaSeguroPolizaComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
                setTimeout(function () {
                    document.getElementById('idCompaniaSeguro').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un registro
    CompaniaSeguroPolizaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Obtiene un listado por empresa
    CompaniaSeguroPolizaComponent.prototype.listarPorEmpresa = function (elemento) {
        var _this = this;
        this.resultados = [];
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorEmpresa(elemento.id).subscribe(function (res) {
                _this.resultados = res.json();
            });
        }
    };
    //Obtiene un listado por compania de seguro
    CompaniaSeguroPolizaComponent.prototype.listarPorCompaniaSeguro = function () {
        var _this = this;
        var companiaSeguro = this.formulario.get('companiaSeguro').value;
        this.servicio.listarPorCompaniaSeguro(companiaSeguro.id).subscribe(function (res) {
            _this.listaCompleta = res.json();
        });
    };
    //Obtiene un listado por compania de seguro
    CompaniaSeguroPolizaComponent.prototype.obtenerPorCompaniaSeguroYEmpresa = function () {
        var _this = this;
        var companiaSeguro = this.formulario.get('companiaSeguro').value;
        var empresa = this.formulario.get('empresa').value;
        if (companiaSeguro != null && empresa != null) {
            this.servicio.obtenerPorCompaniaSeguroYEmpresa(companiaSeguro.id, empresa.id).subscribe(function (res) {
                try {
                    _this.formulario.patchValue(res.json());
                }
                catch (e) {
                    _this.formulario.get('numeroPoliza').reset();
                    _this.formulario.get('vtoPoliza').reset();
                }
            });
        }
    };
    //Reestablece los campos formularios
    CompaniaSeguroPolizaComponent.prototype.reestablecerFormulario = function (id) {
        this.empresaBusqueda.setValue(undefined);
        this.autocompletado.setValue(undefined);
        this.formulario.reset();
        this.vaciarListas();
    };
    //Manejo de colores de campos y labels
    CompaniaSeguroPolizaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Muestra en la pestania buscar el elemento seleccionado de listar
    CompaniaSeguroPolizaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.empresaBusqueda.setValue(elemento.empresa);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    CompaniaSeguroPolizaComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.empresaBusqueda.setValue(elemento.empresa);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    CompaniaSeguroPolizaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Formatea el valor del autocompletado
    CompaniaSeguroPolizaComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Formatea el valor del autocompletado a
    CompaniaSeguroPolizaComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.razonSocial ? elemento.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Formatea el valor del autocompletado b
    CompaniaSeguroPolizaComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.numeroPoliza ? elemento.numeroPoliza + ' - ' + elemento.companiaSeguro.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    CompaniaSeguroPolizaComponent.prototype.manejarEvento = function (keycode) {
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
    CompaniaSeguroPolizaComponent = __decorate([
        core_1.Component({
            selector: 'app-compania-seguro-poliza',
            templateUrl: './compania-seguro-poliza.component.html',
            styleUrls: ['./compania-seguro-poliza.component.css']
        }),
        __metadata("design:paramtypes", [compania_seguro_poliza_service_1.CompaniaSeguroPolizaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            compania_seguro_service_1.CompaniaSeguroService, empresa_service_1.EmpresaService,
            companiaSeguroPoliza_1.CompaniaSeguroPoliza])
    ], CompaniaSeguroPolizaComponent);
    return CompaniaSeguroPolizaComponent;
}());
exports.CompaniaSeguroPolizaComponent = CompaniaSeguroPolizaComponent;
//# sourceMappingURL=compania-seguro-poliza.component.js.map