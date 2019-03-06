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
var agenda_telefonica_service_1 = require("../../servicios/agenda-telefonica.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var AgendaTelefonicaComponent = /** @class */ (function () {
    //Constructor
    function AgendaTelefonicaComponent(servicio, subopcionPestaniaService, localidadServicio, appComponent, toastr) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.localidadServicio = localidadServicio;
        this.appComponent = appComponent;
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
        //Define los resultados del autocompletado
        this.resultados = [];
        //Define los resultados de autocompletado localidad
        this.resultadosLocalidades = [];
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
        //Defiene autocompletado
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultados = res;
                });
            }
        });
    }
    //Al iniciarse el componente
    AgendaTelefonicaComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define el formulario y validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            domicilio: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            correoelectronico: new forms_1.FormControl('', forms_1.Validators.maxLength(30)),
            localidad: new forms_1.FormControl('', forms_1.Validators.required)
        });
        //Defiene autocompletado localidad
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultadosLocalidades = res;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Establece el formulario al seleccionar elemento de autocompletado
    AgendaTelefonicaComponent.prototype.cambioAutocompletado = function (elemento) {
        this.formulario.patchValue(elemento);
        //this.autoLocalidad.setValue(elemento.localidad);
    };
    //Formatea el valor del autocompletado
    AgendaTelefonicaComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Formatea el valor del autocompletado a
    AgendaTelefonicaComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Vacia la lista de autocompletados
    AgendaTelefonicaComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosLocalidades = [];
    };
    //Funcion para establecer los valores de las pestañas
    AgendaTelefonicaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    AgendaTelefonicaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario(undefined);
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
    AgendaTelefonicaComponent.prototype.accion = function (indice) {
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
    AgendaTelefonicaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    AgendaTelefonicaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    AgendaTelefonicaComponent.prototype.agregar = function () {
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
            if (respuesta.codigo == 11003) {
                document.getElementById("labelCorreoelectronico").classList.add('label-error');
                document.getElementById("idCorreoelectronico").classList.add('is-invalid');
                document.getElementById("idCorreoelectronico").focus();
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Actualiza un registro
    AgendaTelefonicaComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
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
    AgendaTelefonicaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    AgendaTelefonicaComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Manejo de colores de campos y labels
    AgendaTelefonicaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Manejo de colores de campos y labels con patron erroneo
    AgendaTelefonicaComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'telefonoFijo') {
                    document.getElementById("labelTelefonoFijo").classList.add('label-error');
                    document.getElementById("idTelefonoFijo").classList.add('is-invalid');
                    this.toastr.error('Telefono Fijo Incorrecto');
                }
                else if (campo == 'telefonoMovil') {
                    document.getElementById("labelTelefonoMovil").classList.add('label-error');
                    document.getElementById("idTelefonoMovil").classList.add('is-invalid');
                    this.toastr.error('Telefono Movil Incorrecto');
                }
                else if (campo == 'correoelectronico') {
                    document.getElementById("labelCorreoelectronico").classList.add('label-error');
                    document.getElementById("idCorreoelectronico").classList.add('is-invalid');
                    this.toastr.error('Correo Electronico Incorrecto');
                }
            }
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    AgendaTelefonicaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    AgendaTelefonicaComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    AgendaTelefonicaComponent.prototype.manejarEvento = function (keycode) {
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
    AgendaTelefonicaComponent = __decorate([
        core_1.Component({
            selector: 'app-agendatelefonica',
            templateUrl: './agenda-telefonica.component.html'
        }),
        __metadata("design:paramtypes", [agenda_telefonica_service_1.AgendaTelefonicaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            localidad_service_1.LocalidadService, app_component_1.AppComponent,
            ngx_toastr_1.ToastrService])
    ], AgendaTelefonicaComponent);
    return AgendaTelefonicaComponent;
}());
exports.AgendaTelefonicaComponent = AgendaTelefonicaComponent;
//# sourceMappingURL=agenda-telefonica.component.js.map