"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioGasto = /** @class */ (function () {
    //constructor
    function ViajePropioGasto() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            viajePropio: new forms_1.FormControl(),
            repartoPropio: new forms_1.FormControl(),
            sucursal: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            tipoComprobante: new forms_1.FormControl(),
            rubroProducto: new forms_1.FormControl('', forms_1.Validators.required),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            cantidad: new forms_1.FormControl('', forms_1.Validators.required),
            precioUnitario: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(60)),
            estaAnulado: new forms_1.FormControl(),
            observacionesAnulado: new forms_1.FormControl('', forms_1.Validators.maxLength(60)),
            importe: new forms_1.FormControl(),
            importeTotal: new forms_1.FormControl()
        });
    }
    return ViajePropioGasto;
}());
exports.ViajePropioGasto = ViajePropioGasto;
//# sourceMappingURL=viajePropioGasto.js.map