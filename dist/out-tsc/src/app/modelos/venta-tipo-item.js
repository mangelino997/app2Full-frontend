"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var VentaTipoItem = /** @class */ (function () {
    //constructor
    function VentaTipoItem() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', forms_1.Validators.required),
            tipoComprobante: new forms_1.FormControl('', forms_1.Validators.required),
            esContrareembolso: new forms_1.FormControl('', forms_1.Validators.required),
            afipConcepto: new forms_1.FormControl('', forms_1.Validators.required),
            esChequeRechazado: new forms_1.FormControl('', forms_1.Validators.required),
            estaHabilitado: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    return VentaTipoItem;
}());
exports.VentaTipoItem = VentaTipoItem;
//# sourceMappingURL=venta-tipo-item.js.map