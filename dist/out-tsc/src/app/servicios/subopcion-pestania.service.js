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
var SubopcionPestaniaService = /** @class */ (function () {
    //Constructor
    function SubopcionPestaniaService(http, appService) {
        this.http = http;
        this.appService = appService;
        //Define la ruta al servicio web
        this.ruta = "/subopcionpestania";
        //Define la url base
        this.url = null;
        //Define los valores de la cabecera
        this.options = null;
        //Establece la url base
        this.url = this.appService.getUrlBase() + this.ruta;
        //Inicializa el header con el token
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', localStorage.getItem('token'));
        this.options = new http_1.RequestOptions({ headers: headers });
    }
    //Obtiene las pestania por rol y subopcion
    SubopcionPestaniaService.prototype.listarPorRolSubopcion = function (idRol, idSubopcion) {
        return this.http.get(this.url + '/listarPorRolSubopcion/' + idRol + '/' + idSubopcion, this.options);
    };
    //Obtiene las pestanias por rol y subopcion para actualizar estado mostrar
    SubopcionPestaniaService.prototype.obtenerPestaniasPorRolYSubopcion = function (idRol, idSubopcion) {
        return this.http.get(this.url + '/obtenerPestaniasPorRolYSubopcion/' + idRol + '/' + idSubopcion, this.options);
    };
    //Actualiza un registro
    SubopcionPestaniaService.prototype.actualizar = function (elemento) {
        return this.http.put(this.url, elemento, this.options);
    };
    /*
    * Asigna todas las pestanias a cada una de las subopciones, eliminando todo los
    * datos y reestableciendo desde cero
    */
    SubopcionPestaniaService.prototype.reestablecerTablaDesdeCero = function () {
        return this.http.get(this.url + '/reestablecerTablaDesdeCero', this.options);
    };
    SubopcionPestaniaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService])
    ], SubopcionPestaniaService);
    return SubopcionPestaniaService;
}());
exports.SubopcionPestaniaService = SubopcionPestaniaService;
//# sourceMappingURL=subopcion-pestania.service.js.map