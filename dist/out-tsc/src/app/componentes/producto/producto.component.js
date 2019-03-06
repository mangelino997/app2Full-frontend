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
var producto_service_1 = require("src/app/servicios/producto.service");
var producto_1 = require("src/app/modelos/producto");
var unidad_medida_service_1 = require("src/app/servicios/unidad-medida.service");
var marca_producto_service_1 = require("src/app/servicios/marca-producto.service");
var rubro_producto_service_1 = require("src/app/servicios/rubro-producto.service");
var ProductoComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function ProductoComponent(appComponent, producto, servicio, subopcionPestaniaService, rubrosServicio, unidadMedidaServicio, marcaServicio, toastr) {
        var _this = this;
        this.appComponent = appComponent;
        this.producto = producto;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.rubrosServicio = rubrosServicio;
        this.unidadMedidaServicio = unidadMedidaServicio;
        this.marcaServicio = marcaServicio;
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
        //Define la lista completa de rubros
        this.rubros = [];
        //Define la lista completa de marcas
        this.marcas = [];
        //Define la lista completa de unidades de medida
        this.unidadesMedidas = [];
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
    ProductoComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.producto.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene los rubros
        this.listarRubros();
        //Obtiene las marcas
        this.listarMarcas();
        //Obtiene las unidades de medida
        this.listarUnidadesMedida();
    };
    //Obtiene el listado de registros
    ProductoComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            console.log(res.json());
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de rubros
    ProductoComponent.prototype.listarRubros = function () {
        var _this = this;
        this.rubrosServicio.listar().subscribe(function (res) {
            _this.rubros = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de marcas
    ProductoComponent.prototype.listarMarcas = function () {
        var _this = this;
        this.marcaServicio.listar().subscribe(function (res) {
            _this.marcas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de unidades de medida
    ProductoComponent.prototype.listarUnidadesMedida = function () {
        var _this = this;
        this.unidadMedidaServicio.listar().subscribe(function (res) {
            _this.unidadesMedidas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    ProductoComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    ProductoComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
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
    //Obtiene el siguiente id
    ProductoComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Habilita o deshabilita los campos dependiendo de la pestaña
    ProductoComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('rubroProducto').enable();
            this.formulario.get('marcaProducto').enable();
            this.formulario.get('unidadMedida').enable();
            this.formulario.get('esAsignable').enable();
            this.formulario.get('esSerializable').enable();
            this.formulario.get('esCritico').enable();
        }
        else {
            this.formulario.get('rubroProducto').disable();
            this.formulario.get('marcaProducto').disable();
            this.formulario.get('unidadMedida').disable();
            this.formulario.get('esAsignable').disable();
            this.formulario.get('esSerializable').disable();
            this.formulario.get('esCritico').disable();
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    ProductoComponent.prototype.accion = function (indice) {
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
    ProductoComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuario').setValue(this.appComponent.getUsuario());
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
    ProductoComponent.prototype.actualizar = function () {
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
    ProductoComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece los campos formularios
    ProductoComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
    };
    //Manejo de colores de campos y labels
    ProductoComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Muestra en la pestania buscar el elemento seleccionado de listar
    ProductoComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    ProductoComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    ProductoComponent.prototype.manejarEvento = function (keycode) {
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
    ProductoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    ProductoComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    ProductoComponent = __decorate([
        core_1.Component({
            selector: 'app-producto',
            templateUrl: './producto.component.html',
            styleUrls: ['./producto.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, producto_1.Producto, producto_service_1.ProductoService, subopcion_pestania_service_1.SubopcionPestaniaService,
            rubro_producto_service_1.RubroProductoService, unidad_medida_service_1.UnidadMedidaService, marca_producto_service_1.MarcaProductoService, ngx_toastr_1.ToastrService])
    ], ProductoComponent);
    return ProductoComponent;
}());
exports.ProductoComponent = ProductoComponent;
//# sourceMappingURL=producto.component.js.map