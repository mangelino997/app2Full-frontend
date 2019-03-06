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
var AfipLocalidadService = /** @class */ (function () {
    //Constructor
    function AfipLocalidadService(http, appService, stompService) {
        var _this = this;
        this.http = http;
        this.appService = appService;
        this.stompService = stompService;
        //Define la ruta al servicio web
        this.ruta = "/afiplocalidad";
        //Define la url base
        this.url = null;
        //Define la url para subcripcion a socket
        this.topic = null;
        //Define el headers y token de autenticacion
        this.options = null;
        //Define la lista obtenida por nombre
        this.listaPorNombre = null;
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
    AfipLocalidadService.prototype.obtenerSiguienteId = function () {
        return this.http.get(this.url + '/obtenerSiguienteId', this.options);
    };
    //Obtiene la lista de registros
    AfipLocalidadService.prototype.listar = function () {
        return this.http.get(this.url, this.options);
    };
    //Obtiene un listado por nombre
    AfipLocalidadService.prototype.listarPorNombre = function (nombre) {
        return this.http.get(this.url + '/listarPorNombre/' + nombre, this.options).map(function (res) {
            return res.json().map(function (data) {
                return data;
            });
        });
    };
    //Agrega un registro
    AfipLocalidadService.prototype.agregar = function (elemento) {
        return this.http.post(this.url, elemento, this.options);
    };
    //Actualiza un registro
    AfipLocalidadService.prototype.actualizar = function (elemento) {
        return this.http.put(this.url, elemento, this.options);
    };
    //Elimina un registro
    AfipLocalidadService.prototype.eliminar = function (id) {
        return this.http.delete(this.url + '/' + id, this.options);
    };
    AfipLocalidadService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, ng2_stompjs_1.StompService])
    ], AfipLocalidadService);
    return AfipLocalidadService;
}());
exports.AfipLocalidadService = AfipLocalidadService;
//# sourceMappingURL=afip-localidad.service.js.map