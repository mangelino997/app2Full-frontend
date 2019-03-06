"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var OrdenVentaEscala = /** @class */ (function () {
    //constructor
    function OrdenVentaEscala() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            ordenVenta: new forms_1.FormControl(),
            escalaTarifa: new forms_1.FormControl(),
            importeFijo: new forms_1.FormControl('0.00'),
            precioUnitario: new forms_1.FormControl('0.00'),
            porcentaje: new forms_1.FormControl(),
            minimo: new forms_1.FormControl(),
            preciosDesde: new forms_1.FormControl()
        });
    }
    return OrdenVentaEscala;
}());
exports.OrdenVentaEscala = OrdenVentaEscala;
//# sourceMappingURL=ordenVentaEscala.js.map