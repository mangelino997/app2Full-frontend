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
var usuario_empresa_service_1 = require("src/app/servicios/usuario-empresa.service");
var forms_1 = require("@angular/forms");
var usuarioEmpresa_1 = require("src/app/modelos/usuarioEmpresa");
var usuario_service_1 = require("src/app/servicios/usuario.service");
var ngx_toastr_1 = require("ngx-toastr");
var UsuarioEmpresasComponent = /** @class */ (function () {
    //Constructor
    function UsuarioEmpresasComponent(usuarioEmpresaServicio, usuarioEmpresaModelo, usuarioServicio, fb, toastr) {
        this.usuarioEmpresaServicio = usuarioEmpresaServicio;
        this.usuarioEmpresaModelo = usuarioEmpresaModelo;
        this.usuarioServicio = usuarioServicio;
        this.fb = fb;
        this.toastr = toastr;
        //Define la lista de resultados usuarios
        this.resultadosUsuarios = [];
        //Define la lista de empresas del usuario
        this.listaEmpresas = [];
    }
    UsuarioEmpresasComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario
        this.formulario = this.fb.group({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            empresas: this.fb.array([])
        });
        //Establece la pestania actual activa por defecto
        this.seleccionarPestania(1, 'Actualizar');
        //Autocompleta Usuario - Buscar por nombre
        this.formulario.get('usuario').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.usuarioServicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultadosUsuarios = res;
                });
            }
        });
    };
    //Crea el elemento B (form) para la segunda tabla
    UsuarioEmpresasComponent.prototype.crearEmpresa = function (elemento) {
        return this.fb.group({
            id: elemento.empresa.id,
            version: elemento.empresa.version,
            razonSocial: elemento.empresa.razonSocial,
            abreviatura: elemento.empresa.abreviatura,
            mostrar: elemento.mostrar
        });
    };
    //Establece la pestania actual
    UsuarioEmpresasComponent.prototype.seleccionarPestania = function (indice, pestania) {
        //Establece el indice
        this.indiceSeleccionado = indice;
        //Establece la pestania activa
        this.pestaniaActiva = pestania;
    };
    //Obtiene las empresas del usuario
    UsuarioEmpresasComponent.prototype.obtenerEmpresas = function () {
        var _this = this;
        this.vaciarEmpresas();
        if (this.formulario.get('empresas').value.length == 0) {
            var idUsuario = this.formulario.get('usuario').value.id;
            this.usuarioEmpresaServicio.listarPorUsuario(idUsuario).subscribe(function (res) {
                _this.listaEmpresas = res.json();
                for (var i = 0; i < _this.listaEmpresas.length; i++) {
                    _this.empresas = _this.formulario.get('empresas');
                    _this.empresas.push(_this.crearEmpresa(_this.listaEmpresas[i]));
                }
            });
        }
    };
    //Actualiza la lista de empresas del usuario
    UsuarioEmpresasComponent.prototype.actualizar = function () {
        var _this = this;
        var usuario = this.formulario.value.usuario;
        usuario.empresas = this.formulario.value.empresas;
        this.usuarioEmpresaServicio.actualizar(usuario).subscribe(function (res) {
            var respuesta = res.json();
            _this.resultadosUsuarios = [];
            _this.formulario.reset();
            _this.vaciarEmpresas();
            document.getElementById('idUsuario').focus();
            _this.toastr.success(respuesta.mensaje);
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.success(respuesta.mensaje);
        });
    };
    //Vacia la lista de empresas
    UsuarioEmpresasComponent.prototype.vaciarEmpresas = function () {
        this.empresas = this.formulario.get('empresas');
        while (this.empresas.length != 0) {
            this.empresas.removeAt(0);
        }
    };
    //Define como se muestra los datos en el autcompletado
    UsuarioEmpresasComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    UsuarioEmpresasComponent.prototype.manejarEvento = function (keycode) {
        // var indice = this.indiceSeleccionado;
        // if(keycode == 113) {
        //   if(indice < this.pestanias.length) {
        //     this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
        //   } else {
        //     this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
        //   }
        // }
    };
    UsuarioEmpresasComponent = __decorate([
        core_1.Component({
            selector: 'app-usuario-empresas',
            templateUrl: './usuario-empresas.component.html',
            styleUrls: ['./usuario-empresas.component.css']
        }),
        __metadata("design:paramtypes", [usuario_empresa_service_1.UsuarioEmpresaService, usuarioEmpresa_1.UsuarioEmpresa,
            usuario_service_1.UsuarioService, forms_1.FormBuilder, ngx_toastr_1.ToastrService])
    ], UsuarioEmpresasComponent);
    return UsuarioEmpresasComponent;
}());
exports.UsuarioEmpresasComponent = UsuarioEmpresasComponent;
//# sourceMappingURL=usuario-empresas.component.js.map