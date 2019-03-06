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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var login_service_1 = require("../../servicios/login.service");
var usuario_service_1 = require("../../servicios/usuario.service");
var usuario_empresa_service_1 = require("../../servicios/usuario-empresa.service");
var app_component_1 = require("../../app.component");
var LoginComponent = /** @class */ (function () {
    //Constructor
    function LoginComponent(loginService, usuarioService, appComponent, usuarioEmpresaService, router) {
        this.loginService = loginService;
        this.usuarioService = usuarioService;
        this.appComponent = appComponent;
        this.usuarioEmpresaService = usuarioEmpresaService;
        this.router = router;
        this.elemento = {};
        this.formulario = null;
        //Define si esta autenticado
        this.estaAutenticado = false;
        //Define el listado de empresas
        this.empresas = null;
        this.formulario = new forms_1.FormGroup({
            username: new forms_1.FormControl(),
            password: new forms_1.FormControl(),
            empresa: new forms_1.FormControl()
        });
    }
    //Loguea un usuario
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loginService.login(this.elemento.username, this.elemento.password)
            .subscribe(function (res) {
            if (res.headers.get('authorization')) {
                //Almacena el token en el local storage
                localStorage.setItem('token', res.headers.get('authorization'));
                //Establece logueado en true
                _this.loginService.setLogueado(true);
                _this.estaAutenticado = true;
                //Obtiene el usuario por username
                _this.usuarioService.obtenerPorUsername(_this.elemento.username).subscribe(function (res) {
                    var usuario = res.json();
                    _this.appComponent.setUsuario(usuario);
                    //Obtiene el menu
                    _this.appComponent.obtenerMenu(usuario.rol.id);
                    //Obtiene el listado de empresas activas por usuario
                    _this.usuarioEmpresaService.listarEmpresasActivasDeUsuario(res.json().id).subscribe(function (res) {
                        _this.empresas = res.json();
                        setTimeout(function () {
                            document.getElementById('idEmpresa').focus();
                        }, 20);
                    }, function (err) {
                        console.log(err);
                    });
                }, function (err) {
                    console.log(err);
                });
            }
            else {
                _this.loginService.setLogueado(false);
            }
        });
    };
    //Define un metodo para ingreso una vez logueado el usuario y seleccionado una empresa
    LoginComponent.prototype.ingresar = function () {
        if (this.estaAutenticado === true) {
            //Establece la empresa
            this.appComponent.setEmpresa(this.elemento.empresa);
            //Establece el tema
            this.appComponent.setTema(this.establecerTema(this.elemento.empresa));
            //Navega a la pagina principal (home)
            this.router.navigate(['/home']);
        }
    };
    LoginComponent.prototype.establecerTema = function (empresa) {
        switch (empresa.id) {
            case 1:
                return 'blue-theme';
            case 2:
                return 'red-theme';
            case 3:
                return 'orange-theme';
            case 4:
                return 'purple-theme';
            case 5:
                return 'green-theme';
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html'
        }),
        __metadata("design:paramtypes", [login_service_1.LoginService, usuario_service_1.UsuarioService,
            app_component_1.AppComponent, usuario_empresa_service_1.UsuarioEmpresaService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map