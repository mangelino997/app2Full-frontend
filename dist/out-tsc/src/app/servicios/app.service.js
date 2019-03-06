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
var rxjs_1 = require("rxjs");
var ng2_stompjs_1 = require("@stomp/ng2-stompjs");
var AppService = /** @class */ (function () {
    //Constructor
    function AppService(http, stompService) {
        var _this = this;
        this.http = http;
        this.stompService = stompService;
        //Define la IP
        this.IP = 'http://192.168.0.156:8080'; //http://localhost:8080 -------http://192.168.0.99:8080
        //Define la url base
        this.URL_BASE = this.IP + '/jitws/auth';
        //Define la url de subcripcion a socket
        this.URL_TOPIC = '/jitws/auth/topic';
        //Define el headers y token de autenticacion
        this.options = null;
        //Define la lista completa
        this.listaCompleta = new rxjs_1.Subject();
        //Resfresca la lista completa si hay cambios
        this.subscribirse = function (m) {
            _this.listaCompleta.next(JSON.parse(m.body));
        };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', localStorage.getItem('token'));
        this.options = new http_1.RequestOptions({ headers: headers });
        //Subcribe al usuario a la lista completa
        this.mensaje = this.stompService.subscribe(this.URL_TOPIC + '/rolsubopcion/listarMenu');
        this.subcripcion = this.mensaje.subscribe(this.subscribirse);
    }
    //Obtiene el menu
    AppService.prototype.obtenerMenu = function (id) {
        return this.http.get(this.URL_BASE + '/menu/' + id, this.options);
    };
    //Obtiene la IP
    AppService.prototype.getIP = function () {
        return this.IP;
    };
    //Obtiene la url base
    AppService.prototype.getUrlBase = function () {
        return this.URL_BASE;
    };
    //Obtiene la url de subcripcion a socket
    AppService.prototype.getTopic = function () {
        return this.URL_TOPIC;
    };
    //Formatear numero a x decimales
    AppService.prototype.setDecimales = function (valor, cantidad) {
        return Number(valor).toFixed(cantidad);
    };
    AppService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, ng2_stompjs_1.StompService])
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map