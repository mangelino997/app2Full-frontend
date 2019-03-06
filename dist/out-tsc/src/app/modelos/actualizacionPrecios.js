"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ActualizacionPrecios = /** @class */ (function () {
    //Constructor
    function ActualizacionPrecios() {
        //Crear el formulario
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            precioDesde: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            listaPrecios: new forms_1.FormControl(),
            aumento: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            porcentaje: new forms_1.FormControl(),
            fechaDesde: new forms_1.FormControl('', forms_1.Validators.maxLength(30)) //la ultima fecha
        });
    }
    return ActualizacionPrecios;
}());
exports.ActualizacionPrecios = ActualizacionPrecios;
//# sourceMappingURL=actualizacionPrecios.js.map