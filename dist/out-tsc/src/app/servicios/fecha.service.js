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
var ng2_stompjs_1 = require("@stomp/ng2-stompjs");
var FechaService = /** @class */ (function () {
    //Constructor
    function FechaService(http, appService, stompService) {
        this.http = http;
        this.appService = appService;
        this.stompService = stompService;
        //Define la ruta al servicio web
        this.ruta = "/fecha";
        //Define la url base
        this.url = null;
        //Define el headers y token de autenticacion
        this.options = null;
        //Establece la url base
        this.url = this.appService.getUrlBase() + this.ruta;
        //Establece los headers y el token
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', localStorage.getItem('token'));
        this.options = new http_1.RequestOptions({ headers: headers });
    }
    //Obtiene la fecha actual
    FechaService.prototype.obtenerFecha = function () {
        return this.http.get(this.url, this.options);
    };
    //Obtiene la fecha actual
    FechaService.prototype.obtenerFechaYHora = function () {
        return this.http.get(this.url + '/obtenerFechaYHora', this.options);
    };
    FechaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, ng2_stompjs_1.StompService])
    ], FechaService);
    return FechaService;
}());
exports.FechaService = FechaService;
//# sourceMappingURL=fecha.service.js.map