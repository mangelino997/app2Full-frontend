"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Reparto = /** @class */ (function () {
    //constructor
    function Reparto() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            tipoViaje: new forms_1.FormControl()
        });
    }
    return Reparto;
}());
exports.Reparto = Reparto;
//# sourceMappingURL=reparto.js.map