"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioInsumo = /** @class */ (function () {
    //constructor
    function ViajePropioInsumo() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            viajePropio: new forms_1.FormControl(),
            repartoPropio: new forms_1.FormControl(),
            proveedor: new forms_1.FormControl('', forms_1.Validators.required),
            sucursal: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            tipoComprobante: new forms_1.FormControl(),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            insumoProducto: new forms_1.FormControl('', forms_1.Validators.required),
            cantidad: new forms_1.FormControl('', forms_1.Validators.required),
            precioUnitario: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl(),
            estaAnulado: new forms_1.FormControl(),
            observacionesAnulado: new forms_1.FormControl(),
            importe: new forms_1.FormControl(),
            importeTotal: new forms_1.FormControl()
        });
    }
    return ViajePropioInsumo;
}());
exports.ViajePropioInsumo = ViajePropioInsumo;
//# sourceMappingURL=viajePropioInsumo.js.map