"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var OrdenVentaTramo = /** @class */ (function () {
    //constructor
    function OrdenVentaTramo() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            ordenVenta: new forms_1.FormControl(),
            tramo: new forms_1.FormControl(),
            kmTramo: new forms_1.FormControl('0'),
            kmPactado: new forms_1.FormControl(),
            importeFijoSeco: new forms_1.FormControl('0.00'),
            importeFijoRef: new forms_1.FormControl(),
            precioUnitarioSeco: new forms_1.FormControl('0.00'),
            precioUnitarioRef: new forms_1.FormControl(),
            preciosDesde: new forms_1.FormControl()
        });
    }
    return OrdenVentaTramo;
}());
exports.OrdenVentaTramo = OrdenVentaTramo;
//# sourceMappingURL=ordenVentaTramo.js.map