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
var rxjs_1 = require("rxjs");
var ng2_stompjs_1 = require("@stomp/ng2-stompjs");
var PersonalService = /** @class */ (function () {
    //Constructor
    function PersonalService(http, appService, stompService) {
        var _this = this;
        this.http = http;
        this.appService = appService;
        this.stompService = stompService;
        //Define la ruta al servicio web
        this.ruta = "/personal";
        //Define la url base
        this.url = null;
        //Define la url para subcripcion a socket
        this.topic = null;
        //Define el headers y token de autenticacion
        this.options = null;
        //Define la lista completa
        this.listaCompleta = new rxjs_1.Subject();
        //Resfresca la lista completa si hay cambios
        this.subscribirse = function (m) {
            _this.listaCompleta.next(JSON.parse(m.body));
        };
        //Establece la url base
        this.url = this.appService.getUrlBase() + this.ruta;
        //Establece la url de subcripcion a socket
        this.topic = this.appService.getTopic();
        //Establece los headers y el token
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', localStorage.getItem('token'));
        this.options = new http_1.RequestOptions({ headers: headers });
        //Subcribe al usuario a la lista completa
        this.mensaje = this.stompService.subscribe(this.topic + this.ruta + '/lista');
        this.subcripcion = this.mensaje.subscribe(this.subscribirse);
    }
    //Obtiene el siguiente id
    PersonalService.prototype.obtenerSiguienteId = function () {
        return this.http.get(this.url + '/obtenerSiguienteId', this.options);
    };
    //Obtiene la lista de registros
    PersonalService.prototype.listar = function () {
        return this.http.get(this.url, this.options);
    };
    //Obtiene un listado por alias
    PersonalService.prototype.listarPorAlias = function (alias) {
        return this.http.get(this.url + '/listarPorAlias/' + alias, this.options).map(function (res) {
            return res.json().map(function (data) {
                return data;
            });
        });
    };
    //Obtiene un listado de choferes por alias
    PersonalService.prototype.listarChoferPorAlias = function (alias) {
        return this.http.get(this.url + '/listarChoferPorAlias/' + alias, this.options).map(function (res) {
            return res.json().map(function (data) {
                return data;
            });
        });
    };
    //Agrega un registro
    PersonalService.prototype.agregar = function (elemento) {
        return this.http.post(this.url, elemento, this.options);
    };
    //Actualiza un registro
    PersonalService.prototype.actualizar = function (elemento) {
        return this.http.put(this.url, elemento, this.options);
    };
    //Elimina un registro
    PersonalService.prototype.eliminar = function (id) {
        return this.http.delete(this.url + '/' + id, this.options);
    };
    PersonalService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, ng2_stompjs_1.StompService])
    ], PersonalService);
    return PersonalService;
}());
exports.PersonalService = PersonalService;
//# sourceMappingURL=personal.service.js.map