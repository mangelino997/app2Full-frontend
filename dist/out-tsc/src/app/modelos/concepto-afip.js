"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ConceptoAfip = /** @class */ (function () {
    //constructor
    function ConceptoAfip() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            codigoAfip: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(3)])
        });
    }
    return ConceptoAfip;
}());
exports.ConceptoAfip = ConceptoAfip;
//# sourceMappingURL=concepto-afip.js.map