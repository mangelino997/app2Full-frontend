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
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
//Define la entidad de la base de datos.
var ViajeRemito = /** @class */ (function () {
    //constructor
    function ViajeRemito(fb) {
        this.fb = fb;
        this.formulario = this.fb.group({
            tipoRemito: new forms_1.FormControl,
            tramo: new forms_1.FormControl(),
            numeroCamion: new forms_1.FormControl(),
            sucursalDestino: new forms_1.FormControl(),
            remitos: this.fb.array([])
        });
    }
    //Crea el array de remitos
    ViajeRemito.prototype.crearRemitos = function (elemento) {
        return this.fb.group({
            id: elemento.id,
            version: elemento.version,
            sucursalEmision: elemento.sucursalEmision,
            empresaEmision: elemento.empresaEmision,
            usuario: elemento.usuario,
            fecha: elemento.fecha,
            numeroCamion: elemento.numeroCamion,
            sucursalDestino: elemento.sucursalDestino,
            tipoComprobante: elemento.tipoComprobante,
            puntoVenta: elemento.puntoVenta,
            letra: elemento.letra,
            numero: elemento.numero,
            clienteRemitente: elemento.clienteRemitente,
            clienteDestinatario: elemento.clienteDestinatario,
            clienteDestinatarioSuc: elemento.clienteDestinatarioSuc,
            bultos: elemento.bultos,
            kilosEfectivo: elemento.kilosEfectivo,
            kilosAforado: elemento.kilosAforado,
            m3: elemento.m3,
            valorDeclarado: elemento.valorDeclarado,
            importeRetiro: elemento.importeRetiro,
            importeEntrega: elemento.importeEntrega,
            estaPendiente: elemento.estaPendiente,
            viajePropioTramo: elemento.viajePropioTramo,
            viajeTerceroTramo: elemento.viajeTerceroTramo,
            observaciones: elemento.observacion,
            estaFacturado: elemento.estaFacturado,
            seguimiento: elemento.seguimiento,
            estaEnReparto: elemento.estaEnReparto,
            alias: elemento.alias
        });
    };
    ViajeRemito = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], ViajeRemito);
    return ViajeRemito;
}());
exports.ViajeRemito = ViajeRemito;
//# sourceMappingURL=viajeRemito.js.map