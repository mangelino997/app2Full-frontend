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
var viajeRemito_1 = require("src/app/modelos/viajeRemito");
var viaje_remito_service_1 = require("src/app/servicios/viaje-remito.service");
var app_component_1 = require("src/app/app.component");
var ViajeRemitoGSComponent = /** @class */ (function () {
    //Constructor
    function ViajeRemitoGSComponent(viajeRemito, viajeRemitoServicio, appComponent) {
        this.viajeRemito = viajeRemito;
        this.viajeRemitoServicio = viajeRemitoServicio;
        this.appComponent = appComponent;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de remitos pendientes
        this.listaRemitosPendientes = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    //Al inicializarse el componente
    ViajeRemitoGSComponent.prototype.ngOnInit = function () {
        //Establece el formulario viaje remito
        this.formularioViajeRemito = this.viajeRemito.formulario;
    };
    //Obtiene la lista de remitos pendiente por filtro (sucursal, sucursal destino y numero de camion)
    ViajeRemitoGSComponent.prototype.listarRemitosPorFiltro = function () {
        var _this = this;
        var tipo = this.formularioViajeRemito.get('tipoRemito').value;
        var sucursal = this.appComponent.getUsuario().sucursal;
        var sucursalDestino = this.formularioViajeRemito.get('sucursalDestino').value;
        var numeroCamion = this.formularioViajeRemito.get('numeroCamion').value;
        if (tipo) {
        }
        else {
            this.viajeRemitoServicio.listarPendientesPorFiltro(sucursal.id, sucursalDestino.id, numeroCamion).subscribe(function (res) {
                var listaRemitosPendientes = res.json();
                for (var i = 0; i < listaRemitosPendientes.length; i++) {
                    _this.remitos = _this.formularioViajeRemito.get('remitos');
                    _this.remitos.push(_this.viajeRemito.crearRemitos(listaRemitosPendientes[i]));
                }
            });
        }
    };
    //Asigna los remitos a un tramo
    ViajeRemitoGSComponent.prototype.asignarRemitos = function () {
        console.log(this.formularioViajeRemito.value.remitos);
    };
    //Envia la lista de tramos a Viaje
    ViajeRemitoGSComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit();
    };
    //Define como se muestran los ceros a la izquierda en tablas
    ViajeRemitoGSComponent.prototype.mostrarCeros = function (elemento, string, cantidad) {
        return elemento ? (string + elemento).slice(cantidad) : elemento;
    };
    ViajeRemitoGSComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViajeRemitoGSComponent.prototype, "dataEvent", void 0);
    ViajeRemitoGSComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-remito-gs',
            templateUrl: './viaje-remito-gs.component.html',
            styleUrls: ['./viaje-remito-gs.component.css']
        }),
        __metadata("design:paramtypes", [viajeRemito_1.ViajeRemito, viaje_remito_service_1.ViajeRemitoService,
            app_component_1.AppComponent])
    ], ViajeRemitoGSComponent);
    return ViajeRemitoGSComponent;
}());
exports.ViajeRemitoGSComponent = ViajeRemitoGSComponent;
//# sourceMappingURL=viaje-remito-gs.component.js.map