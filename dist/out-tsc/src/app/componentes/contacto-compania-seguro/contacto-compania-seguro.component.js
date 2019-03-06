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
var contacto_compania_seguro_service_1 = require("../../servicios/contacto-compania-seguro.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var compania_seguro_service_1 = require("../../servicios/compania-seguro.service");
var tipo_contacto_service_1 = require("../../servicios/tipo-contacto.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var ContactoCompaniaSeguroComponent = /** @class */ (function () {
    //Constructor
    function ContactoCompaniaSeguroComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, companiaSeguroServicio, tipoContactoServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.companiaSeguroServicio = companiaSeguroServicio;
        this.tipoContactoServicio = tipoContactoServicio;
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
        //Define la opcion seleccionada
        this.opcionSeleccionada = null;
        //Define la lista de tipos de contactos
        this.tiposContactos = [];
        //Define la lista de contactos
        this.contactos = [];
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda companias seguros
        this.resultadosCompaniasSeguros = [];
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
    ContactoCompaniaSeguroComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            companiaSeguro: new forms_1.FormControl('', forms_1.Validators.required),
            tipoContacto: new forms_1.FormControl('', forms_1.Validators.required),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            correoelectronico: new forms_1.FormControl('', forms_1.Validators.maxLength(30)),
            usuarioAlta: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl()
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Autocompletado - Buscar por nombre compania seguro
        this.formulario.get('companiaSeguro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.companiaSeguroServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCompaniasSeguros = response;
                });
            }
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de tipos de contactos
        this.listarTiposContactos();
    };
    //Establecer el formulario al cambiar elemento de autocompletado
    ContactoCompaniaSeguroComponent.prototype.cambioAutocompletado = function () {
        this.formulario.setValue(this.autocompletado.value);
    };
    //Obtiene el listado de tipos de proveedores
    ContactoCompaniaSeguroComponent.prototype.listarTiposContactos = function () {
        var _this = this;
        this.tipoContactoServicio.listar().subscribe(function (res) {
            _this.tiposContactos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Vacia la lista de resultados de autocompletados
    ContactoCompaniaSeguroComponent.prototype.vaciarListas = function () {
        this.resultadosCompaniasSeguros = [];
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    ContactoCompaniaSeguroComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('tipoContacto').enable();
        }
        else {
            this.formulario.get('tipoContacto').disable();
        }
    };
    //Funcion para establecer los valores de las pestañas
    ContactoCompaniaSeguroComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    ContactoCompaniaSeguroComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultadosCompaniasSeguros = [];
        }
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
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ContactoCompaniaSeguroComponent.prototype.accion = function (indice) {
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
    ContactoCompaniaSeguroComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ContactoCompaniaSeguroComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista por compania seguro
    ContactoCompaniaSeguroComponent.prototype.listarPorCompaniaSeguro = function (elemento) {
        var _this = this;
        this.contactos = [];
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorCompaniaSeguro(elemento.id).subscribe(function (res) {
                _this.contactos = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    ContactoCompaniaSeguroComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idCompaniaSeguro').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    ContactoCompaniaSeguroComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idCompaniaSeguro').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    ContactoCompaniaSeguroComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ContactoCompaniaSeguroComponent.prototype.reestablecerFormulario = function () {
        this.formulario.reset();
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ContactoCompaniaSeguroComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11003) {
            document.getElementById("labelCorreoelectronico").classList.add('label-error');
            document.getElementById("idCorreoelectronico").classList.add('is-invalid');
            document.getElementById("idCorreoelectronico").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    ContactoCompaniaSeguroComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ContactoCompaniaSeguroComponent.prototype.activarConsultar = function (elemento) {
        this.listarPorCompaniaSeguro(elemento.companiaSeguro);
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ContactoCompaniaSeguroComponent.prototype.activarActualizar = function (elemento) {
        this.listarPorCompaniaSeguro(elemento.companiaSeguro);
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    ContactoCompaniaSeguroComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ContactoCompaniaSeguroComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ContactoCompaniaSeguroComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ' - ' + elemento.tipoContacto.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ContactoCompaniaSeguroComponent.prototype.manejarEvento = function (keycode) {
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
    };
    ContactoCompaniaSeguroComponent = __decorate([
        core_1.Component({
            selector: 'app-contacto-compania-seguro',
            templateUrl: './contacto-compania-seguro.component.html',
            styleUrls: ['./contacto-compania-seguro.component.css']
        }),
        __metadata("design:paramtypes", [contacto_compania_seguro_service_1.ContactoCompaniaSeguroService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            compania_seguro_service_1.CompaniaSeguroService, tipo_contacto_service_1.TipoContactoService])
    ], ContactoCompaniaSeguroComponent);
    return ContactoCompaniaSeguroComponent;
}());
exports.ContactoCompaniaSeguroComponent = ContactoCompaniaSeguroComponent;
//# sourceMappingURL=contacto-compania-seguro.component.js.map