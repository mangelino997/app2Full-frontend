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
var app_service_1 = require("./servicios/app.service");
var router_1 = require("@angular/router");
require("rxjs/Rx");
var AppComponent = /** @class */ (function () {
    function AppComponent(appService, router) {
        var _this = this;
        this.appService = appService;
        this.router = router;
        this.visible = false;
        this.modulos = null;
        this.usuario = { rol: { id: null }, sucursal: { id: null }, nombre: null };
        this.empresa = {};
        this.subopcion = null;
        this.rol = null;
        //Se subscribe al servicio de lista de registros
        this.appService.listaCompleta.subscribe(function (res) {
            _this.obtenerMenu(_this.getRol());
        });
    }
    AppComponent.prototype.setVisible = function (valor) {
        this.visible = valor;
    };
    //Obtiene el usuario
    AppComponent.prototype.getUsuario = function () {
        return this.usuario;
    };
    //Establece el usuario
    AppComponent.prototype.setUsuario = function (usuario) {
        this.usuario = usuario;
    };
    //Obtiene el rol del usuario actual
    AppComponent.prototype.getRol = function () {
        return this.usuario.rol.id;
    };
    //Obtiene la empresa
    AppComponent.prototype.getEmpresa = function () {
        return this.empresa;
    };
    //Establece la empresa
    AppComponent.prototype.setEmpresa = function (empresa) {
        this.empresa = empresa;
    };
    //Obtiene la subopcion
    AppComponent.prototype.getSubopcion = function () {
        return this.subopcion;
    };
    //Establece la subopcion
    AppComponent.prototype.setSubopcion = function (subopcion) {
        this.subopcion = subopcion;
    };
    //Obtiene el tema
    AppComponent.prototype.getTema = function () {
        return this.tema;
    };
    //Establece el tema
    AppComponent.prototype.setTema = function (tema) {
        this.tema = tema;
    };
    //Obtiene la lista de modulos para armar el menu
    AppComponent.prototype.obtenerMenu = function (id) {
        var _this = this;
        this.appService.obtenerMenu(id).subscribe(function (res) {
            _this.modulos = res.json().modulos;
        }, function (err) {
            console.log(err);
        });
    };
    AppComponent.prototype.navegar = function (submodulo, subopcion, idSubopcion) {
        this.setSubopcion(idSubopcion);
        var pag = submodulo + subopcion;
        var pagina = pag.toLowerCase();
        pagina = pagina.replace(new RegExp(/\s/g), "");
        pagina = pagina.replace(new RegExp(/[àá]/g), "a");
        pagina = pagina.replace(new RegExp(/[èé]/g), "e");
        pagina = pagina.replace(new RegExp(/[ìí]/g), "i");
        pagina = pagina.replace(new RegExp(/ñ/g), "n");
        pagina = pagina.replace(new RegExp(/[òó]/g), "o");
        pagina = pagina.replace(new RegExp(/[ùú]/g), "u");
        pagina = pagina.replace(new RegExp(/ /g), "");
        pagina = pagina.replace(new RegExp(/[-]/g), "");
        pagina = pagina.replace(new RegExp(/[,]/g), "");
        pagina = pagina.replace(new RegExp(/[.]/g), "");
        pagina = pagina.replace(new RegExp(/[/]/g), "");
        this.router.navigate([pagina]);
    };
    //Establece los ceros en los numero flotantes
    AppComponent.prototype.establecerCeros = function (valor) {
        return parseFloat(valor).toFixed(2);
    };
    //Establece la cantidad de ceros correspondientes a la izquierda del numero
    AppComponent.prototype.establecerCerosIzq = function (elemento, string, cantidad) {
        elemento.setValue((string + elemento.value).slice(cantidad));
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html'
        }),
        __metadata("design:paramtypes", [app_service_1.AppService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map