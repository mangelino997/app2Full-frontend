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
var forms_1 = require("@angular/forms");
var rol_subopcion_service_1 = require("src/app/servicios/rol-subopcion.service");
var rol_service_1 = require("src/app/servicios/rol.service");
var modulo_service_1 = require("src/app/servicios/modulo.service");
var submodulo_service_1 = require("src/app/servicios/submodulo.service");
var ngx_toastr_1 = require("ngx-toastr");
var material_1 = require("@angular/material");
var usuario_service_1 = require("src/app/servicios/usuario.service");
var app_service_1 = require("src/app/servicios/app.service");
var subopcion_pestania_service_1 = require("src/app/servicios/subopcion-pestania.service");
var RolSubopcionMenuComponent = /** @class */ (function () {
    //Constructor
    function RolSubopcionMenuComponent(servicio, fb, rolServicio, moduloServicio, submoduloServicio, toastr, dialog, subopcionPestaniaServicio) {
        this.servicio = servicio;
        this.fb = fb;
        this.rolServicio = rolServicio;
        this.moduloServicio = moduloServicio;
        this.submoduloServicio = submoduloServicio;
        this.toastr = toastr;
        this.dialog = dialog;
        this.subopcionPestaniaServicio = subopcionPestaniaServicio;
        //Define la lista de roles
        this.roles = [];
        //Define la lista de modulos
        this.modulos = [];
        //Define la lista de submodulos
        this.submodulos = [];
        //Define la lista de pestanias
        this.pestanias = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    RolSubopcionMenuComponent.prototype.ngOnInit = function () {
        //Establece el formulario
        this.formulario = this.fb.group({
            rol: new forms_1.FormControl(),
            submodulo: new forms_1.FormControl(),
            subopciones: this.fb.array([])
        });
        //Establece por defecto la muestra de la lista de modulo
        this.estadoSidenav = 1;
        //Establece el nombre del titulo
        this.nombreTitulo = 'MODULOS';
        //Establece como deshabilitado los botones modulos
        this.botonActivo = false;
        //Establece el boton actualizar en deshabilitado
        this.btnActualizarActivo = false;
        //Obtiene la lista de roles
        this.listarRoles();
        //Obtiene la lista de modulos
        this.listarModulos();
    };
    //Crea el array de subopciones
    RolSubopcionMenuComponent.prototype.crearSubopciones = function (elemento) {
        return this.fb.group({
            id: elemento.id,
            version: elemento.version,
            nombre: elemento.nombre,
            esABM: elemento.esABM,
            mostrar: elemento.mostrar
        });
    };
    //Obtiene la lista de roles
    RolSubopcionMenuComponent.prototype.listarRoles = function () {
        var _this = this;
        this.rolServicio.listar().subscribe(function (res) {
            _this.roles = res.json();
        });
    };
    //Obtiene la lista de modulos
    RolSubopcionMenuComponent.prototype.listarModulos = function () {
        var _this = this;
        this.moduloServicio.listar().subscribe(function (res) {
            _this.modulos = res.json();
        });
    };
    //Al seleccionar un modulo
    RolSubopcionMenuComponent.prototype.seleccionarModulo = function (id, indice) {
        var _this = this;
        this.submoduloServicio.listarPorModulo(id).subscribe(function (res) {
            _this.submodulos = res.json();
            _this.estadoSidenav = 2;
            _this.nombreTitulo = "SUBMODULOS";
        });
    };
    //Obtiene una lista por rol y submodulo
    RolSubopcionMenuComponent.prototype.listarPorRolYSubmodulo = function (submodulo, indice) {
        var _this = this;
        this.vaciarSubopciones();
        this.botonOpcionActivo = indice;
        this.btnActualizarActivo = true;
        this.formulario.get('submodulo').setValue(submodulo);
        var rol = this.formulario.get('rol').value;
        this.servicio.listarPorRolYSubopcion(rol.id, submodulo.id).subscribe(function (res) {
            var rolSubopciones = res.json();
            var subopciones = rolSubopciones.subopciones;
            for (var i = 0; i < subopciones.length; i++) {
                _this.subopciones = _this.formulario.get('subopciones');
                _this.subopciones.push(_this.crearSubopciones(subopciones[i]));
            }
        });
    };
    //Vacia la lista de subopciones
    RolSubopcionMenuComponent.prototype.vaciarSubopciones = function () {
        this.subopciones = this.formulario.get('subopciones');
        while (this.subopciones.length != 0) {
            this.subopciones.removeAt(0);
        }
    };
    //Vuelve a modulos
    RolSubopcionMenuComponent.prototype.atras = function () {
        this.estadoSidenav = 1;
        this.nombreTitulo = "MODULOS";
        this.submodulos = [];
        this.vaciarSubopciones();
        this.btnActualizarActivo = false;
        this.botonOpcionActivo = -1;
    };
    //Actualiza la lista de subopciones del rol
    RolSubopcionMenuComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Activa los botones de modulos al seleccionar un rol
    RolSubopcionMenuComponent.prototype.activarBotones = function () {
        this.botonActivo = true;
    };
    //Abre el dialogo usuario para ver los usuarios de un determinado rol
    RolSubopcionMenuComponent.prototype.verUsuariosDeRol = function () {
        var dialogRef = this.dialog.open(UsuarioDialogo, {
            width: '800px',
            data: { rol: this.formulario.get('rol') }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('Diálogo Usuarios Cerrado!');
        });
    };
    //Abre el dialogo vista previa para visualizar el menu del rol
    RolSubopcionMenuComponent.prototype.verVistaPrevia = function () {
        var dialogRef = this.dialog.open(VistaPreviaDialogo, {
            width: '1200px',
            data: { rol: this.formulario.get('rol') }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('Diálogo Vista Previa Cerrado!');
        });
    };
    //Abre el dialogo vista previa para visualizar el menu del rol
    RolSubopcionMenuComponent.prototype.verPestaniasDialogo = function (subopcion, pestanias) {
        var dialogRef = this.dialog.open(PestaniaDialogo, {
            width: '1200px',
            data: {
                rol: this.formulario.get('rol'),
                subopcion: subopcion,
                pestanias: pestanias
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('Diálogo Pestanias Cerrado!');
        });
    };
    //Visualiza las pestanias de una subopcion para actualizar estado
    RolSubopcionMenuComponent.prototype.verPestanias = function (subopcion) {
        var _this = this;
        var rol = this.formulario.get('rol').value;
        this.subopcionPestaniaServicio.obtenerPestaniasPorRolYSubopcion(rol.id, subopcion.id).subscribe(function (res) {
            _this.pestanias = res.json();
            _this.verPestaniasDialogo(subopcion, _this.pestanias);
        });
    };
    RolSubopcionMenuComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    RolSubopcionMenuComponent = __decorate([
        core_1.Component({
            selector: 'app-rol-subopcion-menu',
            templateUrl: './rol-subopcion-menu.component.html',
            styleUrls: ['./rol-subopcion-menu.component.css']
        }),
        __metadata("design:paramtypes", [rol_subopcion_service_1.RolSubopcionService, forms_1.FormBuilder,
            rol_service_1.RolService, modulo_service_1.ModuloService,
            submodulo_service_1.SubmoduloService, ngx_toastr_1.ToastrService,
            material_1.MatDialog, subopcion_pestania_service_1.SubopcionPestaniaService])
    ], RolSubopcionMenuComponent);
    return RolSubopcionMenuComponent;
}());
exports.RolSubopcionMenuComponent = RolSubopcionMenuComponent;
//Componente Usuarios
var UsuarioDialogo = /** @class */ (function () {
    //Constructor
    function UsuarioDialogo(dialogRef, data, usuarioServicio) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.usuarioServicio = usuarioServicio;
        //Define la lista de usuario del rol
        this.listaUsuarios = [];
    }
    UsuarioDialogo.prototype.ngOnInit = function () {
        var _this = this;
        var rol = this.data.rol.value;
        //Establece el nombre del rol
        this.nombreRol = rol.nombre;
        //Obtiene la lista de usuario por rol
        this.usuarioServicio.listarPorRol(rol.id).subscribe(function (res) {
            _this.listaUsuarios = res.json();
        });
    };
    UsuarioDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    UsuarioDialogo = __decorate([
        core_1.Component({
            selector: 'usuario-dialogo',
            templateUrl: 'usuario-dialogo.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, usuario_service_1.UsuarioService])
    ], UsuarioDialogo);
    return UsuarioDialogo;
}());
exports.UsuarioDialogo = UsuarioDialogo;
//Componente Vista Previa
var VistaPreviaDialogo = /** @class */ (function () {
    //Constructor
    function VistaPreviaDialogo(dialogRef, data, appServicio, subopcionPestaniaService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.appServicio = appServicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista de modulos del rol
        this.modulos = [];
    }
    VistaPreviaDialogo.prototype.ngOnInit = function () {
        var _this = this;
        this.rol = this.data.rol.value;
        this.nombreRol = this.rol.nombre;
        this.appServicio.obtenerMenu(this.rol.id).subscribe(function (res) {
            _this.modulos = res.json().modulos;
        });
    };
    VistaPreviaDialogo.prototype.obtenerPestanias = function (subopcion) {
        var _this = this;
        this.nombreSubopcion = subopcion.subopcion;
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(this.rol.id, subopcion.id).subscribe(function (res) {
            _this.pestanias = res.json();
        });
    };
    VistaPreviaDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    VistaPreviaDialogo = __decorate([
        core_1.Component({
            selector: 'vista-previa-dialogo',
            templateUrl: 'vista-previa-dialogo.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, app_service_1.AppService, subopcion_pestania_service_1.SubopcionPestaniaService])
    ], VistaPreviaDialogo);
    return VistaPreviaDialogo;
}());
exports.VistaPreviaDialogo = VistaPreviaDialogo;
//Componente Pestañas
var PestaniaDialogo = /** @class */ (function () {
    //Constructor
    function PestaniaDialogo(dialogRef, data, fb, servicio, toastr) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.fb = fb;
        this.servicio = servicio;
        this.toastr = toastr;
    }
    PestaniaDialogo.prototype.ngOnInit = function () {
        //Define datos pasado por parametro al dialogo
        var pestanias = this.data.pestanias.pestanias;
        var rol = this.data.rol.value;
        var subopcion = this.data.subopcion;
        //Establece el nombre de la subopcion
        this.nombreSubopcion = subopcion.nombre;
        //Establece el formulario
        this.formulario = this.fb.group({
            rol: new forms_1.FormControl,
            subopcion: new forms_1.FormControl,
            pestanias: this.fb.array([])
        });
        this.formulario.get('rol').setValue(rol);
        this.formulario.get('subopcion').setValue(subopcion);
        for (var i = 0; i < pestanias.length; i++) {
            this.pestanias = this.formulario.get('pestanias');
            this.pestanias.push(this.crearPestanias(pestanias[i]));
        }
    };
    PestaniaDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    //Crea el array de pestanias
    PestaniaDialogo.prototype.crearPestanias = function (elemento) {
        return this.fb.group({
            id: elemento.id,
            version: elemento.version,
            nombre: elemento.nombre,
            mostrar: elemento.mostrar
        });
    };
    //Actualiza la lista de pestanias de la subopcion
    PestaniaDialogo.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    PestaniaDialogo = __decorate([
        core_1.Component({
            selector: 'pestania-dialogo',
            templateUrl: 'pestania-dialogo.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, forms_1.FormBuilder, subopcion_pestania_service_1.SubopcionPestaniaService, ngx_toastr_1.ToastrService])
    ], PestaniaDialogo);
    return PestaniaDialogo;
}());
exports.PestaniaDialogo = PestaniaDialogo;
//# sourceMappingURL=rol-subopcion-menu.component.js.map