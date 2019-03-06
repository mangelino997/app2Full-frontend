"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Empresa = /** @class */ (function () {
    //constructor
    function Empresa() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            razonSocial: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]),
            barrio: new forms_1.FormControl(),
            localidad: new forms_1.FormControl('', forms_1.Validators.required),
            afipCondicionIva: new forms_1.FormControl('', forms_1.Validators.required),
            cuit: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(11)]),
            numeroIIBB: new forms_1.FormControl('', forms_1.Validators.maxLength(15)),
            abreviatura: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(15)]),
            logoBin: new forms_1.FormControl(),
            estaActiva: new forms_1.FormControl('', forms_1.Validators.required),
            inicioActividad: new forms_1.FormControl(),
        });
    }
    return Empresa;
}());
exports.Empresa = Empresa;
//# sourceMappingURL=empresa.js.map