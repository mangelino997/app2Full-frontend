"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropio = /** @class */ (function () {
    //constructor
    function ViajePropio() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            empresaEmision: new forms_1.FormControl(),
            sucursal: new forms_1.FormControl('', forms_1.Validators.required),
            usuario: new forms_1.FormControl(),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            vehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            personal: new forms_1.FormControl('', forms_1.Validators.required),
            esRemolquePropio: new forms_1.FormControl('', forms_1.Validators.required),
            vehiculoRemolque: new forms_1.FormControl(),
            vehiculoProveedorRemolque: new forms_1.FormControl(),
            empresa: new forms_1.FormControl(),
            empresaRemolque: new forms_1.FormControl(),
            afipCondicionIva: new forms_1.FormControl(),
            numeroDocumentacion: new forms_1.FormControl(),
            fechaDocumentacion: new forms_1.FormControl(),
            usuarioDocumentacion: new forms_1.FormControl(),
            numeroLiquidacion: new forms_1.FormControl(),
            fechaLiquidacion: new forms_1.FormControl(),
            usuarioLiquidacion: new forms_1.FormControl(),
            usuarioVehiculoAutorizado: new forms_1.FormControl(),
            usuarioVehiculoRemAutorizado: new forms_1.FormControl(),
            usuarioChoferAutorizado: new forms_1.FormControl(),
            observacionVehiculo: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            observacionVehiculoRemolque: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            observacionChofer: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            alias: new forms_1.FormControl(),
            viajePropioTramos: new forms_1.FormControl('', forms_1.Validators.required),
            viajePropioCombustibles: new forms_1.FormControl(),
            viajePropioEfectivos: new forms_1.FormControl(),
            viajePropioInsumos: new forms_1.FormControl(),
            viajePropioGastos: new forms_1.FormControl(),
            viajePropioPeajes: new forms_1.FormControl()
        });
    }
    return ViajePropio;
}());
exports.ViajePropio = ViajePropio;
//# sourceMappingURL=viajePropio.js.map