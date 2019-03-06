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
var http_1 = require("@angular/http");
var app_service_1 = require("./app.service");
var LoginService = /** @class */ (function () {
    function LoginService(http, appServicio) {
        this.http = http;
        this.appServicio = appServicio;
        this.logueado = false;
        this.URL = this.appServicio.getIP();
    }
    LoginService.prototype.getLogueado = function () {
        return this.logueado;
    };
    LoginService.prototype.setLogueado = function (logueado) {
        this.logueado = logueado;
    };
    LoginService.prototype.login = function (username, password) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.setLogueado(true);
        return this.http.post(this.URL + '/login', { 'username': username, 'password': password }, { headers: headers });
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map