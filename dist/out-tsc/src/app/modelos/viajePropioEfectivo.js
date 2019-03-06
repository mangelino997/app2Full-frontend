"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioEfectivo = /** @class */ (function () {
    //constructor
    function ViajePropioEfectivo() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            viajePropio: new forms_1.FormControl(),
            repartoPropio: new forms_1.FormControl(),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            sucursal: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            tipoComprobante: new forms_1.FormControl(),
            fecha: new forms_1.FormControl(),
            fechaCaja: new forms_1.FormControl('', forms_1.Validators.required),
            importe: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(60)),
            estaAnulado: new forms_1.FormControl(),
            observacionesAnulado: new forms_1.FormControl(),
            importeTotal: new forms_1.FormControl()
        });
    }
    return ViajePropioEfectivo;
}());
exports.ViajePropioEfectivo = ViajePropioEfectivo;
//# sourceMappingURL=viajePropioEfectivo.js.map