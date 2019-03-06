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
var notaCredito_1 = require("src/app/modelos/notaCredito");
var EmitirNotaCreditoComponent = /** @class */ (function () {
    function EmitirNotaCreditoComponent(notaCredito) {
        this.notaCredito = notaCredito;
        this.checkboxComp = null;
        this.checkboxCuenta = null;
        this.tablaVisible = null;
    }
    EmitirNotaCreditoComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.tablaVisible = true;
        this.checkboxComp = true;
        console.log(this.tablaVisible + "///");
        //inicializa el formulario y sus elementos
        this.formulario = this.notaCredito.formulario;
    };
    EmitirNotaCreditoComponent.prototype.cambiarTablaCuenta = function () {
        this.tablaVisible = false;
    };
    EmitirNotaCreditoComponent.prototype.cambiarTablaComp = function () {
        this.tablaVisible = true;
    };
    EmitirNotaCreditoComponent = __decorate([
        core_1.Component({
            selector: 'app-emitir-nota-credito',
            templateUrl: './emitir-nota-credito.component.html',
            styleUrls: ['./emitir-nota-credito.component.css']
        }),
        __metadata("design:paramtypes", [notaCredito_1.NotaCredito])
    ], EmitirNotaCreditoComponent);
    return EmitirNotaCreditoComponent;
}());
exports.EmitirNotaCreditoComponent = EmitirNotaCreditoComponent;
//# sourceMappingURL=emitir-nota-credito.component.js.map