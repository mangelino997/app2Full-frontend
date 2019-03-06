"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioPeaje = /** @class */ (function () {
    //Constructor
    function ViajePropioPeaje() {
        //Crear el formulario
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            viajePropio: new forms_1.FormControl(),
            proveedor: new forms_1.FormControl('', forms_1.Validators.required),
            tipoComprobante: new forms_1.FormControl(),
            puntoVenta: new forms_1.FormControl('', forms_1.Validators.required),
            letra: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(1)]),
            numeroComprobante: new forms_1.FormControl('', forms_1.Validators.required),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            importe: new forms_1.FormControl('', forms_1.Validators.required),
            empresaCFiscal: new forms_1.FormControl(),
            registroCFiscal: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            importeTotal: new forms_1.FormControl()
        });
    }
    return ViajePropioPeaje;
}());
exports.ViajePropioPeaje = ViajePropioPeaje;
//# sourceMappingURL=viajePropioPeaje.js.map