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
var configuracion_vehiculo_service_1 = require("../../servicios/configuracion-vehiculo.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var tipo_vehiculo_service_1 = require("../../servicios/tipo-vehiculo.service");
var marca_vehiculo_service_1 = require("../../servicios/marca-vehiculo.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var ConfiguracionVehiculoComponent = /** @class */ (function () {
    //Constructor
    function ConfiguracionVehiculoComponent(servicio, subopcionPestaniaService, appComponent, toastr, tipoVehiculoServicio, marcaVehiculoServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.tipoVehiculoServicio = tipoVehiculoServicio;
        this.marcaVehiculoServicio = marcaVehiculoServicio;
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
        //Define el autocompletado
        this.autocompletado = new forms_1.FormControl();
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la lista de configuraciones de vehiculo
        this.configuraciones = [];
        //Define la lista de tipos de vehiculos
        this.tiposVehiculos = [];
        //Define la lista de marcas de vehiculos
        this.marcasVehiculos = [];
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
    ConfiguracionVehiculoComponent.prototype.ngOnInit = function () {
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            tipoVehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            marcaVehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            modelo: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            descripcion: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            cantidadEjes: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(2)]),
            capacidadCarga: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(5)]),
            tara: new forms_1.FormControl('', forms_1.Validators.maxLength(5)),
            altura: new forms_1.FormControl('', forms_1.Validators.maxLength(5)),
            largo: new forms_1.FormControl('', forms_1.Validators.maxLength(5)),
            ancho: new forms_1.FormControl('', forms_1.Validators.maxLength(5)),
            m3: new forms_1.FormControl('', forms_1.Validators.maxLength(5))
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar');
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de tipos de vehiculos
        this.listarTiposVehiculos();
        //Obtiene la lista de marcas de vehiculos
        this.listarMarcasVehiculos();
    };
    //Obtiene la lista de tipos de vehiculos
    ConfiguracionVehiculoComponent.prototype.listarTiposVehiculos = function () {
        var _this = this;
        this.tipoVehiculoServicio.listar().subscribe(function (res) {
            _this.tiposVehiculos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    ConfiguracionVehiculoComponent.prototype.listarMarcasVehiculos = function () {
        var _this = this;
        this.marcaVehiculoServicio.listar().subscribe(function (res) {
            _this.marcasVehiculos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    ConfiguracionVehiculoComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('cantidadEjes').enabled;
        }
        else {
            this.formulario.get('cantidadEjes').disabled;
        }
    };
    //Funcion para establecer los valores de las pestañas
    ConfiguracionVehiculoComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    ConfiguracionVehiculoComponent.prototype.seleccionarPestania = function (id, nombre) {
        this.reestablecerFormulario();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idTipoVehiculo');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idTipoVehiculo');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idTipoVehiculo');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idTipoVehiculo');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ConfiguracionVehiculoComponent.prototype.accion = function (indice) {
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
    ConfiguracionVehiculoComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ConfiguracionVehiculoComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista de configuracion de vehiculos por tipo y marca
    ConfiguracionVehiculoComponent.prototype.listarPorTipoVehiculoMarcaVehiculo = function () {
        var _this = this;
        var tipoVehiculo = this.formulario.get('tipoVehiculo').value;
        var marcaVehiculo = this.formulario.get('marcaVehiculo').value;
        if (tipoVehiculo && marcaVehiculo && this.mostrarAutocompletado) {
            this.servicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id).subscribe(function (res) {
                _this.configuraciones = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    ConfiguracionVehiculoComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idTipoVehiculo').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    ConfiguracionVehiculoComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idTipoVehiculo').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un registro
    ConfiguracionVehiculoComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    ConfiguracionVehiculoComponent.prototype.reestablecerFormulario = function () {
        this.formulario.reset();
        this.autocompletado.setValue(undefined);
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ConfiguracionVehiculoComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ConfiguracionVehiculoComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    ConfiguracionVehiculoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ConfiguracionVehiculoComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ConfiguracionVehiculoComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: '
                + elemento.cantidadEjes + ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ConfiguracionVehiculoComponent.prototype.manejarEvento = function (keycode) {
        var indice = this.indiceSeleccionado;
        if (keycode == 113) {
            if (indice < this.pestanias.length) {
                this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre);
            }
            else {
                this.seleccionarPestania(1, this.pestanias[0].nombre);
            }
        }
    };
    ConfiguracionVehiculoComponent = __decorate([
        core_1.Component({
            selector: 'app-configuracion-vehiculo',
            templateUrl: './configuracion-vehiculo.component.html',
            styleUrls: ['./configuracion-vehiculo.component.css']
        }),
        __metadata("design:paramtypes", [configuracion_vehiculo_service_1.ConfiguracionVehiculoService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            tipo_vehiculo_service_1.TipoVehiculoService, marca_vehiculo_service_1.MarcaVehiculoService])
    ], ConfiguracionVehiculoComponent);
    return ConfiguracionVehiculoComponent;
}());
exports.ConfiguracionVehiculoComponent = ConfiguracionVehiculoComponent;
//# sourceMappingURL=configuracion-vehiculo.component.js.map