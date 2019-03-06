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
var chofer_proveedor_service_1 = require("../../servicios/chofer-proveedor.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var proveedor_service_1 = require("../../servicios/proveedor.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var ChoferProveedorComponent = /** @class */ (function () {
    //Constructor
    function ChoferProveedorComponent(servicio, subopcionPestaniaService, appComponent, toastr, proveedorServicio, barrioServicio, localidadServicio, tipoDocumentoServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.proveedorServicio = proveedorServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
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
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de localidad
        this.resultadosLocalidades = [];
        //Define la lista de resultados de proveedores
        this.resultadosProveedores = [];
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
    ChoferProveedorComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]),
            proveedor: new forms_1.FormControl('', forms_1.Validators.required),
            barrio: new forms_1.FormControl(),
            localidad: new forms_1.FormControl('', forms_1.Validators.required),
            tipoDocumento: new forms_1.FormControl('', forms_1.Validators.required),
            numeroDocumento: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            fechaNacimiento: new forms_1.FormControl('', forms_1.Validators.required),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            vtoCarnet: new forms_1.FormControl('', forms_1.Validators.required),
            vtoCurso: new forms_1.FormControl('', forms_1.Validators.required),
            vtoLNH: new forms_1.FormControl('', forms_1.Validators.required),
            vtoLibretaSanidad: new forms_1.FormControl(),
            usuarioAlta: new forms_1.FormControl(),
            fechaAlta: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            fechaUltimaMod: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            fechaBaja: new forms_1.FormControl(),
            alias: new forms_1.FormControl()
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Autocompletado Proveedor - Buscar por nombre
        this.formulario.get('proveedor').valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.proveedorServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosProveedores = response;
                });
            }
        });
        //Autocompletado Barrio - Buscar por nombre
        this.formulario.get('barrio').valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBarrios = response;
                });
            }
        });
        //Autocompletado Localidad - Buscar por nombre
        this.formulario.get('localidad').valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de tipos de documentos
        this.listarTiposDocumentos();
    };
    //Vacia la lista de resultados de autocompletados
    ChoferProveedorComponent.prototype.vaciarLista = function () {
        this.resultados = [];
        this.resultadosProveedores = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
    };
    //Funcion para establecer los valores de las pestañas
    ChoferProveedorComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarLista();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Establece valores al seleccionar una pestania
    ChoferProveedorComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario(undefined);
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.vaciarLista();
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerValoresPestania(nombre, false, false, true, 'idProveedor');
                break;
            case 2:
                this.establecerValoresPestania(nombre, true, true, false, 'idProveedor');
                break;
            case 3:
                this.establecerValoresPestania(nombre, true, false, true, 'idProveedor');
                break;
            case 4:
                this.establecerValoresPestania(nombre, true, true, true, 'idProveedor');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ChoferProveedorComponent.prototype.accion = function (indice) {
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
    //Obtiene el listado de tipos de documentos
    ChoferProveedorComponent.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene una lista de choferes por proveedor
    ChoferProveedorComponent.prototype.listarPorProveedor = function (proveedor) {
        var _this = this;
        if (this.mostrarAutocompletado) {
            this.servicio.listarPorProveedor(proveedor.id).subscribe(function (res) {
                _this.resultados = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Obtiene el siguiente id
    ChoferProveedorComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    ChoferProveedorComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    ChoferProveedorComponent.prototype.agregar = function () {
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
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    ChoferProveedorComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
                setTimeout(function () {
                    document.getElementById('idProveedor').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    ChoferProveedorComponent.prototype.eliminar = function () {
        console.log();
    };
    ChoferProveedorComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarLista();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ChoferProveedorComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11010) {
            document.getElementById("labelNumeroDocumento").classList.add('label-error');
            document.getElementById("idNumeroDocumento").classList.add('is-invalid');
            document.getElementById("idNumeroDocumento").focus();
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
    //Manejo de colores de campos y labels
    ChoferProveedorComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Manejo de colores de campos y labels con patron erroneo
    ChoferProveedorComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'sitioWeb') {
                    document.getElementById("labelSitioWeb").classList.add('label-error');
                    document.getElementById("idSitioWeb").classList.add('is-invalid');
                    this.toastr.error('Sitio Web incorrecto');
                }
            }
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ChoferProveedorComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ChoferProveedorComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Define como se muestra los datos en el autcompletado
    ChoferProveedorComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ChoferProveedorComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ChoferProveedorComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ChoferProveedorComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias)
    ChoferProveedorComponent.prototype.manejarEvento = function (keycode) {
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
    ChoferProveedorComponent = __decorate([
        core_1.Component({
            selector: 'app-chofer-proveedor',
            templateUrl: './chofer-proveedor.component.html',
            styleUrls: ['./chofer-proveedor.component.css']
        }),
        __metadata("design:paramtypes", [chofer_proveedor_service_1.ChoferProveedorService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            proveedor_service_1.ProveedorService, barrio_service_1.BarrioService,
            localidad_service_1.LocalidadService, tipo_documento_service_1.TipoDocumentoService])
    ], ChoferProveedorComponent);
    return ChoferProveedorComponent;
}());
exports.ChoferProveedorComponent = ChoferProveedorComponent;
//# sourceMappingURL=chofer-proveedor.component.js.map