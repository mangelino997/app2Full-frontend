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
var sucursal_cliente_service_1 = require("../../servicios/sucursal-cliente.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var cliente_service_1 = require("../../servicios/cliente.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var SucursalClienteComponent = /** @class */ (function () {
    //Constructor
    function SucursalClienteComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, clienteServicio, barrioServicio, localidadServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.clienteServicio = clienteServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
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
        //Define el autocompletado para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados del autocompletado
        this.resultados = [];
        //Define la lista de resultados de busqueda cliente
        this.resultadosClientes = [];
        //Define la lista de resultados de busqueda barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda localidad
        this.resultadosLocalidades = [];
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
    SucursalClienteComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            domicilio: new forms_1.FormControl('', forms_1.Validators.maxLength(60)),
            barrio: new forms_1.FormControl(),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            cliente: new forms_1.FormControl('', forms_1.Validators.required),
            localidad: new forms_1.FormControl('', forms_1.Validators.required)
        });
        //Autocompletado - Buscar por alias cliente
        this.formulario.get('cliente').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClientes = response;
                });
            }
        });
        //Autocompletado - Buscar por nombre barrio
        this.formulario.get('barrio').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBarrios = response;
                });
            }
        });
        //Autocompletado - Buscar por nombre localidad
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Vacia la lista de resultados de autocompletados
    SucursalClienteComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosClientes = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
    };
    //Funcion para establecer los valores de las pestañas
    SucursalClienteComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    SucursalClienteComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario('');
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.vaciarListas();
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerValoresPestania(nombre, false, false, true, 'idCliente');
                break;
            case 2:
                this.establecerValoresPestania(nombre, true, true, false, 'idCliente');
                break;
            case 3:
                this.establecerValoresPestania(nombre, true, false, true, 'idCliente');
                break;
            case 4:
                this.establecerValoresPestania(nombre, true, true, true, 'idCliente');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    SucursalClienteComponent.prototype.accion = function (indice) {
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
    SucursalClienteComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    SucursalClienteComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene una lista por cliente
    SucursalClienteComponent.prototype.listarPorCliente = function (elemento) {
        var _this = this;
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorCliente(elemento.id).subscribe(function (res) {
                _this.sucursales = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    SucursalClienteComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idCliente').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    SucursalClienteComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario('');
                setTimeout(function () {
                    document.getElementById('idCliente').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    SucursalClienteComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    SucursalClienteComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    SucursalClienteComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11002) {
            document.getElementById("labelNombre").classList.add('label-error');
            document.getElementById("idNombre").classList.add('is-invalid');
            document.getElementById("idNombre").focus();
        }
        else if (respuesta.codigo == 11013) {
            document.getElementById("labelTelefonoFijo").classList.add('label-error');
            document.getElementById("idTelefonoFijo").classList.add('is-invalid');
            document.getElementById("idTelefonoFijo").focus();
        }
        else if (respuesta.codigo == 11014) {
            document.getElementById("labelTelefonoMovil").classList.add('label-error');
            document.getElementById("idTelefonoMovil").classList.add('is-invalid');
            document.getElementById("idTelefonoMovil").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels con patron erroneo
    SucursalClienteComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'telefonoFijo') {
                    document.getElementById("labelTelefonoFijo").classList.add('label-error');
                    document.getElementById("idTelefonoFijo").classList.add('is-invalid');
                    this.toastr.error('Telefono Fijo incorrecto');
                }
                else if (campo == 'telefonoMovil') {
                    document.getElementById("labelTelefonoMovil").classList.add('label-error');
                    document.getElementById("idTelefonoMovil").classList.add('is-invalid');
                    this.toastr.error('Telefono Movil incorrecto');
                }
            }
        }
    };
    //Manejo de colores de campos y labels
    SucursalClienteComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    SucursalClienteComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    SucursalClienteComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    SucursalClienteComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    SucursalClienteComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ' - ' + elemento.cliente.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    SucursalClienteComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    SucursalClienteComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    SucursalClienteComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    SucursalClienteComponent.prototype.manejarEvento = function (keycode) {
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
    SucursalClienteComponent = __decorate([
        core_1.Component({
            selector: 'app-sucursal-cliente',
            templateUrl: './sucursal-cliente.component.html',
            styleUrls: ['./sucursal-cliente.component.css']
        }),
        __metadata("design:paramtypes", [sucursal_cliente_service_1.SucursalClienteService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            cliente_service_1.ClienteService, barrio_service_1.BarrioService,
            localidad_service_1.LocalidadService])
    ], SucursalClienteComponent);
    return SucursalClienteComponent;
}());
exports.SucursalClienteComponent = SucursalClienteComponent;
//# sourceMappingURL=sucursal-cliente.component.js.map