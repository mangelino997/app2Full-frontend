"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var VentaConcepto = /** @class */ (function () {
    //constructor
    function VentaConcepto() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', forms_1.Validators.required),
            tipoComprobante: new forms_1.FormControl('', forms_1.Validators.required),
            estaHabilitado: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    return VentaConcepto;
}());
exports.VentaConcepto = VentaConcepto;
//# sourceMappingURL=venta-concepto.js.map