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
var empresa_service_1 = require("../../servicios/empresa.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var afip_condicion_iva_service_1 = require("../../servicios/afip-condicion-iva.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var empresa_1 = require("src/app/modelos/empresa");
var material_1 = require("@angular/material");
var usuario_service_1 = require("src/app/servicios/usuario.service");
var EmpresaComponent = /** @class */ (function () {
    //Constructor
    function EmpresaComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, barrioServicio, localidadServicio, afipCondicionIvaServicio, empresaModelo, dialog) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.afipCondicionIvaServicio = afipCondicionIvaServicio;
        this.empresaModelo = empresaModelo;
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
        this.mostrarUsuarios = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la lista de condiciones de iva
        this.condicionesIva = [];
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosLocalidades = [];
        //Funcion para comparar y mostrar elemento de campo select
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
                _this.servicio.listarPorRazonSocial(data).subscribe(function (response) {
                    _this.resultados = response;
                    console.log(_this.resultados);
                });
            }
        });
    }
    //Al iniciarse el componente
    EmpresaComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.empresaModelo.formulario;
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Autocompletado Barrio - Buscar por nombre
        this.formulario.get('barrio').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBarrios = response;
                });
            }
        });
        //Autocompletado Localidad - Buscar por nombre
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de condiciones de iva
        this.listarCondicionesIva();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto
    EmpresaComponent.prototype.establecerValoresPorDefecto = function () {
    };
    //Vacia la lista de resultados de autocompletados
    EmpresaComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
    };
    //Obtiene el listado de condiciones de iva
    EmpresaComponent.prototype.listarCondicionesIva = function () {
        var _this = this;
        this.afipCondicionIvaServicio.listar().subscribe(function (res) {
            _this.condicionesIva = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Funcion para establecer los valores de las pestañas
    EmpresaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, btnUsuarios, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.mostrarUsuarios = btnUsuarios;
        this.vaciarListas();
        this.establecerValoresPorDefecto();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Habilita o deshabilita los campos dependiendo de la pestaña
    EmpresaComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('afipCondicionIva').enable();
            this.formulario.get('estaActiva').enable();
        }
        else {
            this.formulario.get('afipCondicionIva').disable();
            this.formulario.get('estaActiva').disable();
        }
    };
    //Establece valores al seleccionar una pestania
    EmpresaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario(undefined);
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
                this.establecerValoresPestania(nombre, false, false, true, false, 'idRazonSocial');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, false, 'idAutocompletado');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    EmpresaComponent.prototype.accion = function (indice) {
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
    EmpresaComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    EmpresaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    EmpresaComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idRazonSocial').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    EmpresaComponent.prototype.actualizar = function () {
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
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    EmpresaComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    EmpresaComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    EmpresaComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11006) {
            document.getElementById("labelRazonSocial").classList.add('label-error');
            document.getElementById("idRazonSocial").classList.add('is-invalid');
            document.getElementById("idRazonSocial").focus();
        }
        else if (respuesta.codigo == 11007) {
            document.getElementById("labelCUIT").classList.add('label-error');
            document.getElementById("idCUIT").classList.add('is-invalid');
            document.getElementById("idCUIT").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    EmpresaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    EmpresaComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    EmpresaComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
    };
    EmpresaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    EmpresaComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.razonSocial ? elemento.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    EmpresaComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    EmpresaComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    EmpresaComponent.prototype.manejarEvento = function (keycode) {
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
    //Abre un Modal con la lista de Usuarios de la Empresa seleccionada
    EmpresaComponent.prototype.verActivos = function (datos) {
        console.log(datos);
        var dialogRef = this.dialog.open(ListaUsuariosDialogo, {
            width: '1000px',
            data: { empresa: datos },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            // var listaSocioDedudas= result;
        });
    };
    EmpresaComponent = __decorate([
        core_1.Component({
            selector: 'app-empresa',
            templateUrl: './empresa.component.html',
            styleUrls: ['./empresa.component.css']
        }),
        __metadata("design:paramtypes", [empresa_service_1.EmpresaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            barrio_service_1.BarrioService, localidad_service_1.LocalidadService,
            afip_condicion_iva_service_1.AfipCondicionIvaService, empresa_1.Empresa, material_1.MatDialog])
    ], EmpresaComponent);
    return EmpresaComponent;
}());
exports.EmpresaComponent = EmpresaComponent;
var ListaUsuariosDialogo = /** @class */ (function () {
    function ListaUsuariosDialogo(dialogRef, data, usuarioServicio, toastr) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.usuarioServicio = usuarioServicio;
        this.toastr = toastr;
        //Define la lista de usuarios activos de la empresa
        this.listaUsuarios = [];
    }
    ListaUsuariosDialogo.prototype.ngOnInit = function () {
        var _this = this;
        this.empresa = this.data.empresa;
        console.log(this.empresa['id']);
        this.usuarioServicio.listarUsuariosPorEmpresa(this.empresa['id']).subscribe(function (res) {
            _this.listaUsuarios = res.json();
        }, function (err) {
            _this.toastr.error(err.json().mensaje);
        });
    };
    ListaUsuariosDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ListaUsuariosDialogo = __decorate([
        core_1.Component({
            selector: 'lista-usuarios-dialogo',
            templateUrl: 'lista-usuarios-dialogo.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, usuario_service_1.UsuarioService, ngx_toastr_1.ToastrService])
    ], ListaUsuariosDialogo);
    return ListaUsuariosDialogo;
}());
exports.ListaUsuariosDialogo = ListaUsuariosDialogo;
//# sourceMappingURL=empresa.component.js.map