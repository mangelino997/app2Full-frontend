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
var reparto_1 = require("src/app/modelos/reparto");
var RepartoComponent = /** @class */ (function () {
    //Constructor
    function RepartoComponent(repartoModelo) {
        this.repartoModelo = repartoModelo;
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    RepartoComponent.prototype.ngOnInit = function () {
        //Establece el formulario
        this.formulario = this.repartoModelo.formulario;
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto
    RepartoComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('tipoViaje').setValue(1);
    };
    RepartoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    RepartoComponent = __decorate([
        core_1.Component({
            selector: 'app-reparto',
            templateUrl: './reparto.component.html',
            styleUrls: ['./reparto.component.css']
        }),
        __metadata("design:paramtypes", [reparto_1.Reparto])
    ], RepartoComponent);
    return RepartoComponent;
}());
exports.RepartoComponent = RepartoComponent;
//# sourceMappingURL=reparto.component.js.map