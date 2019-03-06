"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var OrdenVenta = /** @class */ (function () {
    //constructor
    function OrdenVenta() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', forms_1.Validators.required),
            cliente: new forms_1.FormControl(null, forms_1.Validators.required),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            vendedor: new forms_1.FormControl('', forms_1.Validators.required),
            fechaAlta: new forms_1.FormControl(),
            tipoTarifa: new forms_1.FormControl('', forms_1.Validators.required),
            seguro: new forms_1.FormControl('8.00', forms_1.Validators.required),
            comisionCR: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl(),
            estaActiva: new forms_1.FormControl(),
            activaDesde: new forms_1.FormControl(),
            tipoOrdenVenta: new forms_1.FormControl(false, forms_1.Validators.required),
            ordenesVentasEscalas: new forms_1.FormControl(),
            ordenesVentasTramos: new forms_1.FormControl()
        });
    }
    return OrdenVenta;
}());
exports.OrdenVenta = OrdenVenta;
//# sourceMappingURL=ordenVenta.js.map