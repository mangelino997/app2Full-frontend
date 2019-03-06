"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ClienteEventual = /** @class */ (function () {
    //constructor
    function ClienteEventual() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            razonSocial: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            nombreFantasia: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]),
            localidad: new forms_1.FormControl('', [forms_1.Validators.required]),
            barrio: new forms_1.FormControl(),
            telefono: new forms_1.FormControl('', [forms_1.Validators.maxLength(45)]),
            zona: new forms_1.FormControl(),
            rubro: new forms_1.FormControl(),
            cobrador: new forms_1.FormControl(),
            afipCondicionIva: new forms_1.FormControl(),
            tipoDocumento: new forms_1.FormControl(),
            numeroDocumento: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(15)]),
            numeroIIBB: new forms_1.FormControl('', forms_1.Validators.maxLength(15)),
            sucursalLugarPago: new forms_1.FormControl(),
            usuarioAlta: new forms_1.FormControl()
        });
    }
    return ClienteEventual;
}());
exports.ClienteEventual = ClienteEventual;
//# sourceMappingURL=clienteEventual.js.map