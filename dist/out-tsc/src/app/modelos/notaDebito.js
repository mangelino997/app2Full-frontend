"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var NotaDebito = /** @class */ (function () {
    //constructor
    function NotaDebito() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            puntoVenta: new forms_1.FormControl('', forms_1.Validators.required),
            letra: new forms_1.FormControl(),
            numero: new forms_1.FormControl(),
            codigoAfip: new forms_1.FormControl('', forms_1.Validators.required),
            tipoComprobante: new forms_1.FormControl('', forms_1.Validators.required),
            jurisdiccion: new forms_1.FormControl('', forms_1.Validators.required),
            cuenta: new forms_1.FormControl('', forms_1.Validators.required),
            cliente: new forms_1.FormControl(),
            tipoDocumento: new forms_1.FormControl(),
            numeroDocumento: new forms_1.FormControl('', forms_1.Validators.required),
            domicilio: new forms_1.FormControl(),
            condicionIVA: new forms_1.FormControl('', forms_1.Validators.required),
            localidad: new forms_1.FormControl(),
            condicionesVenta: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            importeExento: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            importeGravado: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            importeIVA: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            importeTotal: new forms_1.FormControl()
        });
    }
    return NotaDebito;
}());
exports.NotaDebito = NotaDebito;
//# sourceMappingURL=notaDebito.js.map