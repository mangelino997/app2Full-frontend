"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajeUnidadNegocio = /** @class */ (function () {
    //Constructor
    function ViajeUnidadNegocio() {
        //Crear el formulario
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    return ViajeUnidadNegocio;
}());
exports.ViajeUnidadNegocio = ViajeUnidadNegocio;
//# sourceMappingURL=viajeUnidadNegocio.js.map