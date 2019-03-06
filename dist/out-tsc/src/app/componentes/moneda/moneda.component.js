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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var moneda_service_1 = require("src/app/servicios/moneda.service");
var moneda_1 = require("src/app/modelos/moneda");
var material_1 = require("@angular/material");
var MonedaComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function MonedaComponent(moneda, monedaServicios, subopcionPestaniaService, toastr, dialog) {
        var _this = this;
        this.moneda = moneda;
        this.monedaServicios = monedaServicios;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.toastr = toastr;
        this.dialog = dialog;
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
        //Define el id que se muestra en el campo Codigo
        this.id = new forms_1.FormControl();
        //Define empresa para las busquedas
        this.empresaBusqueda = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda companias seguros
        this.resultadosCompaniasSeguros = [];
        //Defien la lista de empresas
        this.empresas = [];
        //Define el mostrado de datos y comparacion en campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestanias
        this.subopcionPestaniaService.listarPorRolSubopcion(1, 19)
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
            console.log(res.json());
        }, function (err) {
            console.log(err);
        });
        //Controla el autocompletado
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.monedaServicios.listarPorNombre(data).subscribe(function (res) {
                    _this.resultados = res.json();
                    console.log(res.json());
                });
            }
        });
    }
    MonedaComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.moneda.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //El campo codigo del formulario siempre se mantiene deshabilitado
        this.formulario.get('codigo').disable();
        //Obtenemos el siguiente Id y lo mostramos
        this.obtenerSiguienteId();
        //Cargamos la lista de Monedas
        this.listar();
    };
    //Funcion para establecer los valores de las pestañas
    MonedaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
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
    MonedaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.formulario.reset();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        this.resultados = [];
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
                // this.obtenerSiguienteId();
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
    //Habilita o deshabilita los campos dependiendo de la pestaña
    MonedaComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('nombre').enable();
            this.formulario.get('estaActivo').enable();
            this.formulario.get('porDefecto').enable();
        }
        else {
            this.formulario.get('nombre').disable();
            this.formulario.get('estaActivo').disable();
            this.formulario.get('porDefecto').disable();
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    MonedaComponent.prototype.accion = function (indice) {
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
    MonedaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.monedaServicios.obtenerSiguienteId().subscribe(function (res) {
            _this.id.setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    MonedaComponent.prototype.listar = function () {
        var _this = this;
        this.monedaServicios.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    MonedaComponent.prototype.agregar = function () {
        var _this = this;
        // this.formulario.get('id').setValue(this.id.value);
        this.monedaServicios.listarPorNombre(this.formulario.get('nombre').value).subscribe(function (res) {
            if (res.json().length >= 1) {
                _this.toastr.error("Ya existe la Moneda que se desea cargar");
                _this.reestablecerFormulario(undefined);
            }
            else {
                if (_this.formulario.get('porDefecto').value == "true") {
                    _this.monedaServicios.obtenerPorDefecto().subscribe(function (res) {
                        var respuesta = res.json();
                        //open modal reemplazar moneda
                        _this.cambiarPrincipal(respuesta, _this.formulario.value);
                    }, function (err) {
                        _this.toastr.error(err.json().mensaje);
                    });
                }
                else {
                    _this.monedaServicios.agregar(_this.formulario.value).subscribe(function (res) {
                        var respuesta = res.json();
                        _this.reestablecerFormulario(respuesta.id);
                        setTimeout(function () {
                            document.getElementById('idNombre').focus();
                        }, 20);
                        _this.toastr.success(respuesta.mensaje);
                    }, function (err) {
                        _this.toastr.error(err.json().mensaje);
                    });
                }
            }
        }, function (err) {
            _this.toastr.error(err.json().mensaje);
        });
    };
    //Actualiza un registro
    MonedaComponent.prototype.actualizar = function () {
        var _this = this;
        this.monedaServicios.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
                setTimeout(function () {
                    document.getElementById('idAutocompletado').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    MonedaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    MonedaComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        // if(respuesta.codigo == 11006) {
        //   document.getElementById("labelRazonSocial").classList.add('label-error');
        //   document.getElementById("idRazonSocial").classList.add('is-invalid');
        //   document.getElementById("idRazonSocial").focus();
        // } else if(respuesta.codigo == 11007) {
        //   document.getElementById("labelCUIT").classList.add('label-error');
        //   document.getElementById("idCUIT").classList.add('is-invalid');
        //   document.getElementById("idCUIT").focus();
        // }
        this.toastr.error(respuesta.mensaje);
    };
    //Reestablece los campos formularios
    MonedaComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
        setTimeout(function () {
            document.getElementById('idNombre').focus();
        }, 20);
        this.obtenerSiguienteId();
    };
    //Manejo de colores de campos y labels
    MonedaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    //Establece el formulario al seleccionar elemento del autocompletado
    MonedaComponent.prototype.cambioAutocompletado = function () {
        var elemento = this.autocompletado.value;
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    MonedaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
        this.id.setValue(elemento.id);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    MonedaComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
        this.id.setValue(elemento.id);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    MonedaComponent.prototype.manejarEvento = function (keycode) {
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
    //Abre ventana Dialog nueva Moneda Principal
    MonedaComponent.prototype.cambiarPrincipal = function (monedaPrincipal, monedaAgregar) {
        var _this = this;
        var dialogRef = this.dialog.open(CambiarMonedaPrincipalDialogo, {
            width: '750px',
            data: { monedaPrincipal: monedaPrincipal, monedaAgregar: monedaAgregar },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.reestablecerFormulario(undefined);
        });
    };
    MonedaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Formatea el valor del autocompletado
    MonedaComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    MonedaComponent = __decorate([
        core_1.Component({
            selector: 'app-moneda',
            templateUrl: './moneda.component.html',
            styleUrls: ['./moneda.component.css']
        }),
        __metadata("design:paramtypes", [moneda_1.Moneda, moneda_service_1.MonedaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            ngx_toastr_1.ToastrService, material_1.MatDialog])
    ], MonedaComponent);
    return MonedaComponent;
}());
exports.MonedaComponent = MonedaComponent;
var CambiarMonedaPrincipalDialogo = /** @class */ (function () {
    function CambiarMonedaPrincipalDialogo(dialogRef, data, monedaServicios, toastr) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.monedaServicios = monedaServicios;
        this.toastr = toastr;
    }
    CambiarMonedaPrincipalDialogo.prototype.ngOnInit = function () {
        this.monedaAgregar = this.data.monedaAgregar;
        this.monedaPrincipal = this.data.monedaPrincipal;
    };
    //La nueva Moneda cambia a Principal
    CambiarMonedaPrincipalDialogo.prototype.agregar = function (cambiaPorDefecto) {
        var _this = this;
        if (cambiaPorDefecto == true) {
            this.monedaAgregar['porDefecto'] = "true";
        }
        else {
            this.monedaAgregar['porDefecto'] = "false";
        }
        console.log(this.monedaAgregar);
        this.monedaServicios.agregar(this.monedaAgregar).subscribe(function (res) {
            var respuesta = res.json();
            setTimeout(function () {
                document.getElementById('idNombre').focus();
            }, 20);
            _this.toastr.success(respuesta.mensaje);
            _this.dialogRef.close();
        }, function (err) {
            _this.toastr.error(err.respuesta);
        });
    };
    CambiarMonedaPrincipalDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    CambiarMonedaPrincipalDialogo = __decorate([
        core_1.Component({
            selector: 'cambiar-principal-dialogo',
            templateUrl: 'cambiar-principal-dialogo.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, moneda_service_1.MonedaService,
            ngx_toastr_1.ToastrService])
    ], CambiarMonedaPrincipalDialogo);
    return CambiarMonedaPrincipalDialogo;
}());
exports.CambiarMonedaPrincipalDialogo = CambiarMonedaPrincipalDialogo;
//# sourceMappingURL=moneda.component.js.map