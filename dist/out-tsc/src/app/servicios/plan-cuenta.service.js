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
var Arbol = /** @class */ (function () {
    function Arbol() {
    }
    return Arbol;
}());
exports.Arbol = Arbol;
var PlanCuentaService = /** @class */ (function () {
    //Constructor
    function PlanCuentaService(http, appService, stompService) {
        var _this = this;
        this.http = http;
        this.appService = appService;
        this.stompService = stompService;
        //Define la ruta al servicio web
        this.ruta = "/plandecuenta";
        //Define la url base
        this.url = null;
        //Define la url para subcripcion a socket
        this.topic = null;
        //Define el headers y token de autenticacion
        this.options = null;
        //Define la lista completa
        this.listaCompleta = new rxjs_1.BehaviorSubject([]);
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
        //Obtiene el plan de cuentas
        this.obtenerPlanCuenta().subscribe(function (res) {
            _this.inicializar(res.json());
        });
    }
    Object.defineProperty(PlanCuentaService.prototype, "data", {
        //Obtiene el arbol
        get: function () { return this.listaCompleta.value; },
        enumerable: true,
        configurable: true
    });
    //Inicializa el arbol
    PlanCuentaService.prototype.inicializar = function (planCuenta) {
        // const d = this.buildFileTree(TREE_DATA, 0);
        var data = this.crearArbol(planCuenta);
        var arbol = [];
        arbol.push(data);
        this.listaCompleta.next(arbol);
    };
    //Crea el arbol
    PlanCuentaService.prototype.crearArbol = function (elemento) {
        var arbol = new Arbol();
        arbol.id = elemento.id;
        arbol.nombre = elemento.nombre;
        arbol.esImputable = elemento.esImputable;
        arbol.estaActivo = elemento.estaActivo;
        arbol.hijos = elemento.hijos;
        for (var i in arbol.hijos) {
            arbol.hijos[i] = this.crearArbol(arbol.hijos[i]);
        }
        return arbol;
    };
    //Obtiene el siguiente id
    PlanCuentaService.prototype.obtenerSiguienteId = function () {
        return this.http.get(this.url + '/obtenerSiguienteId', this.options);
    };
    //Obtiene la lista de registros
    PlanCuentaService.prototype.listar = function () {
        return this.http.get(this.url, this.options);
    };
    //Obtiene un registros por nombre
    PlanCuentaService.prototype.listarPorNombre = function (nombre) {
        return this.http.get(this.url + '/listarPorNombre/' + nombre, this.options);
    };
    //Obtiene un registros por Grupo Activo
    PlanCuentaService.prototype.listarGrupoActivo = function (idGrupo) {
        return this.http.get(this.url + '/listarGrupoActivo/' + idGrupo, this.options);
    };
    //Obtiene el plan de cuenta
    PlanCuentaService.prototype.obtenerPlanCuenta = function () {
        return this.http.get(this.url + '/obtenerPlanCuenta', this.options);
    };
    PlanCuentaService.prototype.agregarElemento = function (padre, nombre) {
        if (padre.hijos) {
            var p = new Arbol();
            p.id = padre.id;
            padre.hijos.push({ nombre: nombre, padre: p });
            this.listaCompleta.next(this.data);
        }
    };
    //Agrega un registro
    PlanCuentaService.prototype.agregar = function (elemento) {
        var _this = this;
        this.http.post(this.url, elemento, this.options).subscribe(function (res) {
            if (res.status == 201) {
                var respuesta = res.json();
                elemento.id = respuesta.id;
                _this.listaCompleta.next(_this.data);
            }
        }, function (err) {
            console.log('ERROR');
        });
    };
    //Actualiza un registro
    PlanCuentaService.prototype.actualizar = function (elemento) {
        return this.http.put(this.url, elemento, this.options);
    };
    //Elimina un registro
    PlanCuentaService.prototype.eliminar = function (id, nodoPadre) {
        var _this = this;
        return this.http.delete(this.url + '/' + id, this.options).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                for (var i in nodoPadre.hijos) {
                    if (nodoPadre.hijos[i].id == id) {
                        nodoPadre.hijos.splice(i, 1);
                        _this.listaCompleta.next(_this.data);
                    }
                }
            }
        }, function (err) {
            console.log('ERROR');
        });
    };
    PlanCuentaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.Http, app_service_1.AppService, ng2_stompjs_1.StompService])
    ], PlanCuentaService);
    return PlanCuentaService;
}());
exports.PlanCuentaService = PlanCuentaService;
//# sourceMappingURL=plan-cuenta.service.js.map