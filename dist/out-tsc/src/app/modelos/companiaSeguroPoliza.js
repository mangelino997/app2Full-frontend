"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var CompaniaSeguroPoliza = /** @class */ (function () {
    //constructor
    function CompaniaSeguroPoliza() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            companiaSeguro: new forms_1.FormControl('', forms_1.Validators.required),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            numeroPoliza: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(15)]),
            vtoPoliza: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    return CompaniaSeguroPoliza;
}());
exports.CompaniaSeguroPoliza = CompaniaSeguroPoliza;
//# sourceMappingURL=companiaSeguroPoliza.js.map