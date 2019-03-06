"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Producto = /** @class */ (function () {
    //constructor
    function Producto() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            marcaProducto: new forms_1.FormControl('', forms_1.Validators.required),
            unidadMedida: new forms_1.FormControl('', forms_1.Validators.required),
            modelo: new forms_1.FormControl('', forms_1.Validators.required),
            rubroProducto: new forms_1.FormControl('', forms_1.Validators.required),
            esAsignable: new forms_1.FormControl('', forms_1.Validators.required),
            esSerializable: new forms_1.FormControl('', forms_1.Validators.required),
            esCritico: new forms_1.FormControl('', forms_1.Validators.required),
            stockMinimo: new forms_1.FormControl('', forms_1.Validators.required),
            precioUnitarioVenta: new forms_1.FormControl('', forms_1.Validators.required),
            coeficienteITC: new forms_1.FormControl('', forms_1.Validators.required),
            usuario: new forms_1.FormControl()
        });
    }
    return Producto;
}());
exports.Producto = Producto;
//# sourceMappingURL=producto.js.map