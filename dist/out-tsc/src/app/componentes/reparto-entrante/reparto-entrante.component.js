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
var forms_1 = require("@angular/forms");
var RepartoEntranteComponent = /** @class */ (function () {
    function RepartoEntranteComponent() {
        //Define la lista completa de registros
        this.listaSegundaTabla = [];
    }
    RepartoEntranteComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            tipo: new forms_1.FormControl(),
            estado: new forms_1.FormControl(),
            cobranza: new forms_1.FormControl(),
            contado: new forms_1.FormControl(),
            cobranzaContraReembolso: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl()
        });
    };
    //Elimina una fila de la segunda tabla
    RepartoEntranteComponent.prototype.eliminarElemento = function (indice) {
        this.listaSegundaTabla.splice(indice, 1);
    };
    RepartoEntranteComponent = __decorate([
        core_1.Component({
            selector: 'app-reparto-entrante',
            templateUrl: './reparto-entrante.component.html',
            styleUrls: ['./reparto-entrante.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], RepartoEntranteComponent);
    return RepartoEntranteComponent;
}());
exports.RepartoEntranteComponent = RepartoEntranteComponent;
//# sourceMappingURL=reparto-entrante.component.js.map