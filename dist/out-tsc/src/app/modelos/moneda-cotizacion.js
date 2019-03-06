"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var MonedaCotizacion = /** @class */ (function () {
    //constructor
    function MonedaCotizacion() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            moneda: new forms_1.FormControl('', forms_1.Validators.required),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            valor: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(10)]),
            usuarioAlta: new forms_1.FormControl()
        });
    }
    return MonedaCotizacion;
}());
exports.MonedaCotizacion = MonedaCotizacion;
//# sourceMappingURL=moneda-cotizacion.js.map