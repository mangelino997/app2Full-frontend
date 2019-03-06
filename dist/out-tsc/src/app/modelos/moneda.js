"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Moneda = /** @class */ (function () {
    //constructor
    function Moneda() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            codigo: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', forms_1.Validators.required),
            estaActivo: new forms_1.FormControl('', forms_1.Validators.required),
            porDefecto: new forms_1.FormControl('', forms_1.Validators.required),
            codigoAfip: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(3)]),
            simbolo: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(5)])
        });
    }
    return Moneda;
}());
exports.Moneda = Moneda;
//# sourceMappingURL=moneda.js.map