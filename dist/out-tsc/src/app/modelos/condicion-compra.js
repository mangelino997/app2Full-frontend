"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var CondicionCompra = /** @class */ (function () {
    //constructor
    function CondicionCompra() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            esContado: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    return CondicionCompra;
}());
exports.CondicionCompra = CondicionCompra;
//# sourceMappingURL=condicion-compra.js.map