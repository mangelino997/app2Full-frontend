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
var contacto_banco_service_1 = require("../../servicios/contacto-banco.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var sucursal_banco_service_1 = require("../../servicios/sucursal-banco.service");
var tipo_contacto_service_1 = require("../../servicios/tipo-contacto.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var ContactoBancoComponent = /** @class */ (function () {
    //Constructor
    function ContactoBancoComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, sucursalBancoServicio, tipoContactoServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.sucursalBancoServicio = sucursalBancoServicio;
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
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de sucursales bancos
        this.resultadosSucursalesBancos = [];
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
    ContactoBancoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            sucursalBanco: new forms_1.FormControl('', forms_1.Validators.required),
            tipoContacto: new forms_1.FormControl('', forms_1.Validators.required),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            correoelectronico: new forms_1.FormControl('', forms_1.Validators.maxLength(30)),
            usuarioAlta: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl()
        });
        //Autocompletado Sucursal Banco - Buscar por nombre
        this.formulario.get('sucursalBanco').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.sucursalBancoServicio.listarPorNombreBanco(data).subscribe(function (response) {
                    _this.resultadosSucursalesBancos = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de tipos de contactos
        this.listarTiposContactos();
    };
    //Establecer el formulario al cambiar elemento de autocompletado
    ContactoBancoComponent.prototype.cambioAutocompletado = function () {
        this.formulario.setValue(this.autocompletado.value);
    };
    //Obtiene el listado de tipos de proveedores
    ContactoBancoComponent.prototype.listarTiposContactos = function () {
        var _this = this;
        this.tipoContactoServicio.listar().subscribe(function (res) {
            _this.tiposContactos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Vacia la lista de resultados de autocompletados
    ContactoBancoComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosSucursalesBancos = [];
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    ContactoBancoComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('tipoContacto').enable();
        }
        else {
            this.formulario.get('tipoContacto').disable();
        }
    };
    //Funcion para establecer los valores de las pestañas
    ContactoBancoComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    ContactoBancoComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.vaciarListas();
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idSucursalBanco');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idSucursalBanco');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idSucursalBanco');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idSucursalBanco');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ContactoBancoComponent.prototype.accion = function (indice) {
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
    ContactoBancoComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ContactoBancoComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista de contactos por sucursal banco
    ContactoBancoComponent.prototype.listarPorSucursalBanco = function (elemento) {
        var _this = this;
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorSucursalBanco(elemento.id).subscribe(function (res) {
                _this.contactos = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    ContactoBancoComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idSucursalBanco').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    ContactoBancoComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idSucursalBanco').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    ContactoBancoComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ContactoBancoComponent.prototype.reestablecerFormulario = function () {
        this.formulario.reset();
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ContactoBancoComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11003) {
            document.getElementById("labelCorreoelectronico").classList.add('label-error');
            document.getElementById("idCorreoelectronico").classList.add('is-invalid');
            document.getElementById("idCorreoelectronico").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    ContactoBancoComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ContactoBancoComponent.prototype.activarConsultar = function (elemento) {
        this.listarPorSucursalBanco(elemento.sucursalBanco);
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ContactoBancoComponent.prototype.activarActualizar = function (elemento) {
        this.listarPorSucursalBanco(elemento.sucursalBanco);
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    ContactoBancoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autocompletado
    ContactoBancoComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ' - ' + elemento.banco.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autocompletado a
    ContactoBancoComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + '' : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autocompletado b
    ContactoBancoComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ' - ' + elemento.tipoContacto.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ContactoBancoComponent.prototype.manejarEvento = function (keycode) {
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
    ContactoBancoComponent = __decorate([
        core_1.Component({
            selector: 'app-contacto-banco',
            templateUrl: './contacto-banco.component.html',
            styleUrls: ['./contacto-banco.component.css']
        }),
        __metadata("design:paramtypes", [contacto_banco_service_1.ContactoBancoService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            sucursal_banco_service_1.SucursalBancoService, tipo_contacto_service_1.TipoContactoService])
    ], ContactoBancoComponent);
    return ContactoBancoComponent;
}());
exports.ContactoBancoComponent = ContactoBancoComponent;
//# sourceMappingURL=contacto-banco.component.js.map