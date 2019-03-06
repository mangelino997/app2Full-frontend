"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var ViajePropioTramo = /** @class */ (function () {
    //Constructor
    function ViajePropioTramo() {
        //Crear el formulario
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            viajePropio: new forms_1.FormControl(),
            tramo: new forms_1.FormControl('', forms_1.Validators.required),
            numeroOrden: new forms_1.FormControl('', forms_1.Validators.required),
            fechaTramo: new forms_1.FormControl('', forms_1.Validators.required),
            fechaAlta: new forms_1.FormControl(),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            km: new forms_1.FormControl('', forms_1.Validators.required),
            usuario: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            viajeTipo: new forms_1.FormControl('', forms_1.Validators.required),
            viajeTipoCarga: new forms_1.FormControl('', forms_1.Validators.required),
            viajeTarifa: new forms_1.FormControl('', forms_1.Validators.required),
            viajeUnidadNegocio: new forms_1.FormControl('', forms_1.Validators.required),
            cantidad: new forms_1.FormControl('', forms_1.Validators.required),
            precioUnitario: new forms_1.FormControl('', forms_1.Validators.required),
            importe: new forms_1.FormControl('', forms_1.Validators.required),
            viajePropioTramoClientes: new forms_1.FormControl()
        });
    }
    return ViajePropioTramo;
}());
exports.ViajePropioTramo = ViajePropioTramo;
//# sourceMappingURL=viajePropioTramo.js.map