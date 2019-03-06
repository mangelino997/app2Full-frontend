"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioTramoCliente = /** @class */ (function () {
    //Constructor
    function ViajePropioTramoCliente() {
        //Crear el formulario
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            clienteDador: new forms_1.FormControl('', forms_1.Validators.required),
            clienteDestinatario: new forms_1.FormControl('', forms_1.Validators.required),
            viajePropioTramo: new forms_1.FormControl()
        });
    }
    return ViajePropioTramoCliente;
}());
exports.ViajePropioTramoCliente = ViajePropioTramoCliente;
//# sourceMappingURL=viajePropioTramoCliente.js.map