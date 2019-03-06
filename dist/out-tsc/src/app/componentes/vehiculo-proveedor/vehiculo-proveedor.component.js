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
var vehiculo_proveedor_service_1 = require("../../servicios/vehiculo-proveedor.service");
var chofer_proveedor_service_1 = require("../../servicios/chofer-proveedor.service");
var configuracion_vehiculo_service_1 = require("../../servicios/configuracion-vehiculo.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var proveedor_service_1 = require("../../servicios/proveedor.service");
var tipo_vehiculo_service_1 = require("../../servicios/tipo-vehiculo.service");
var marca_vehiculo_service_1 = require("../../servicios/marca-vehiculo.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var compania_seguro_service_1 = require("../../servicios/compania-seguro.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var VehiculoProveedorComponent = /** @class */ (function () {
    //Constructor
    function VehiculoProveedorComponent(servicio, subopcionPestaniaService, appComponent, toastr, tipoVehiculoServicio, marcaVehiculoServicio, localidadServicio, proveedorServicio, companiaSeguroServicio, choferProveedorServicio, configuracionVehiculoServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.tipoVehiculoServicio = tipoVehiculoServicio;
        this.marcaVehiculoServicio = marcaVehiculoServicio;
        this.localidadServicio = localidadServicio;
        this.proveedorServicio = proveedorServicio;
        this.companiaSeguroServicio = companiaSeguroServicio;
        this.choferProveedorServicio = choferProveedorServicio;
        this.configuracionVehiculoServicio = configuracionVehiculoServicio;
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
        //Define la lista de tipos de vehiculos
        this.tiposVehiculos = [];
        //Define la lista de marcas de vehiculos
        this.marcasVehiculos = [];
        //Define el autocompletado para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de proveedores
        this.resultadosProveedores = [];
        //Define la lista de resultados de choferes proveedores
        this.resultadosChoferesProveedores = [];
        //Define la lista de resultados de busqueda vehiculo remolque
        this.resultadosVehiculosRemolques = [];
        //Define la lista de resultados de busqueda compania seguro
        this.resultadosCompaniasSeguros = [];
        //Define la lista de resultados de configuraciones vehiculos
        this.configuracionesVehiculos = [];
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
        //Autocompletado - Buscar por alias
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAlias(data).subscribe(function (res) {
                    _this.resultados = res;
                });
            }
        });
    }
    //Al iniciarse el componente
    VehiculoProveedorComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            dominio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(10)]),
            proveedor: new forms_1.FormControl('', forms_1.Validators.required),
            tipoVehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            marcaVehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            choferProveedor: new forms_1.FormControl(),
            vehiculoRemolque: new forms_1.FormControl(),
            anioFabricacion: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(4)]),
            numeroMotor: new forms_1.FormControl('', forms_1.Validators.maxLength(25)),
            numeroChasis: new forms_1.FormControl('', forms_1.Validators.maxLength(25)),
            companiaSeguro: new forms_1.FormControl('', forms_1.Validators.required),
            numeroPoliza: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(15)]),
            vtoPoliza: new forms_1.FormControl('', forms_1.Validators.required),
            vtoRTO: new forms_1.FormControl('', forms_1.Validators.required),
            numeroRuta: new forms_1.FormControl('', forms_1.Validators.required),
            vtoRuta: new forms_1.FormControl('', forms_1.Validators.required),
            vtoSenasa: new forms_1.FormControl(),
            vtoHabBromatologica: new forms_1.FormControl(),
            usuarioAlta: new forms_1.FormControl(),
            fechaAlta: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            fechaBaja: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            fechaUltimaMod: new forms_1.FormControl(),
            alias: new forms_1.FormControl('', forms_1.Validators.maxLength(100))
        });
        //Autocompletado Proveedor - Buscar por alias
        this.formulario.get('proveedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.proveedorServicio.listarPorAlias(data).subscribe(function (res) {
                    _this.resultadosProveedores = res;
                });
            }
        });
        //Autocompletado Chofer Proveedor - Buscar por alias
        this.formulario.get('choferProveedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.choferProveedorServicio.listarPorAlias(data).subscribe(function (res) {
                    _this.resultadosChoferesProveedores = res;
                });
            }
        });
        //Autocompletado - Buscar por alias filtro remolque
        this.formulario.get('vehiculoRemolque').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAliasFiltroRemolque(data).subscribe(function (response) {
                    _this.resultadosVehiculosRemolques = response;
                });
            }
        });
        //Autocompletado Compania Seguro - Buscar por nombre
        this.formulario.get('companiaSeguro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.companiaSeguroServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCompaniasSeguros = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista de tipos de vehiculos
        this.listarTiposVehiculos();
        //Obtiene la lista de marcas de vehiculos
        this.listarMarcasVehiculos();
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Obtiene la lista de tipos de vehiculos
    VehiculoProveedorComponent.prototype.listarTiposVehiculos = function () {
        var _this = this;
        this.tipoVehiculoServicio.listar().subscribe(function (res) {
            _this.tiposVehiculos = res.json();
        });
    };
    //Obtiene la lista de marcas de vehiculos
    VehiculoProveedorComponent.prototype.listarMarcasVehiculos = function () {
        var _this = this;
        this.marcaVehiculoServicio.listar().subscribe(function (res) {
            _this.marcasVehiculos = res.json();
        });
    };
    //Vacia la lista de resultados de autocompletados
    VehiculoProveedorComponent.prototype.vaciarLista = function () {
        this.resultados = [];
        this.resultadosProveedores = [];
        this.resultadosChoferesProveedores = [];
        this.resultadosVehiculosRemolques = [];
        this.resultadosCompaniasSeguros = [];
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    VehiculoProveedorComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('estaActivo').enabled;
        }
        else {
            this.formulario.get('estaActivo').disabled;
        }
    };
    //Funcion para establecer los valores de las pestañas
    VehiculoProveedorComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    VehiculoProveedorComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario('');
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultados = [];
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
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
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    VehiculoProveedorComponent.prototype.accion = function (indice) {
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
    VehiculoProveedorComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    VehiculoProveedorComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    VehiculoProveedorComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idProveedor').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11017) {
                document.getElementById("labelDominio").classList.add('label-error');
                document.getElementById("idDominio").classList.add('is-invalid');
                document.getElementById("idDominio").focus();
            }
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    VehiculoProveedorComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
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
            if (respuesta.codigo == 11017) {
                document.getElementById("labelDominio").classList.add('label-error');
                document.getElementById("idDominio").classList.add('is-invalid');
                document.getElementById("idDominio").focus();
            }
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un registro
    VehiculoProveedorComponent.prototype.eliminar = function () {
        console.log();
    };
    //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
    VehiculoProveedorComponent.prototype.listarConfiguracionesPorTipoVehiculoMarcaVehiculo = function () {
        var _this = this;
        var tipoVehiculo = this.formulario.get('tipoVehiculo').value;
        var marcaVehiculo = this.formulario.get('marcaVehiculo').value;
        if (tipoVehiculo != null && marcaVehiculo != null) {
            this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
                .subscribe(function (res) {
                _this.configuracionesVehiculos = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Reestablece el formulario
    VehiculoProveedorComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarLista();
    };
    //Manejo de colores de campos y labels
    VehiculoProveedorComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    VehiculoProveedorComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    VehiculoProveedorComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
    };
    VehiculoProveedorComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Muestra el valor en los autocompletados
    VehiculoProveedorComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados a
    VehiculoProveedorComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor de otro autocompletado b
    VehiculoProveedorComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    VehiculoProveedorComponent.prototype.manejarEvento = function (keycode) {
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
    VehiculoProveedorComponent = __decorate([
        core_1.Component({
            selector: 'app-vehiculo-proveedor',
            templateUrl: './vehiculo-proveedor.component.html',
            styleUrls: ['./vehiculo-proveedor.component.css']
        }),
        __metadata("design:paramtypes", [vehiculo_proveedor_service_1.VehiculoProveedorService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            tipo_vehiculo_service_1.TipoVehiculoService, marca_vehiculo_service_1.MarcaVehiculoService,
            localidad_service_1.LocalidadService, proveedor_service_1.ProveedorService,
            compania_seguro_service_1.CompaniaSeguroService, chofer_proveedor_service_1.ChoferProveedorService,
            configuracion_vehiculo_service_1.ConfiguracionVehiculoService])
    ], VehiculoProveedorComponent);
    return VehiculoProveedorComponent;
}());
exports.VehiculoProveedorComponent = VehiculoProveedorComponent;
//# sourceMappingURL=vehiculo-proveedor.component.js.map