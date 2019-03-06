"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Ejercicio = /** @class */ (function () {
    //constructor
    function Ejercicio() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            anioInicio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            mesInicio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            cantidadMeses: new forms_1.FormControl('', forms_1.Validators.required),
            porDefecto: new forms_1.FormControl('', forms_1.Validators.required),
            empresa: new forms_1.FormControl(),
            usuarioAlta: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl()
        });
    }
    return Ejercicio;
}());
exports.Ejercicio = Ejercicio;
//# sourceMappingURL=ejercicio.js.map