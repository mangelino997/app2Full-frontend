"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var MonedaCuentaContable = /** @class */ (function () {
    //constructor
    function MonedaCuentaContable() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            moneda: new forms_1.FormControl('', forms_1.Validators.required),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            cuentaContable: new forms_1.FormControl('', forms_1.Validators.required),
            usuarioAlta: new forms_1.FormControl()
        });
    }
    return MonedaCuentaContable;
}());
exports.MonedaCuentaContable = MonedaCuentaContable;
//# sourceMappingURL=moneda-cuenta-contable.js.map