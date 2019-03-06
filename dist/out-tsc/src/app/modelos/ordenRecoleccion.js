"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var OrdenRecoleccion = /** @class */ (function () {
    //constructor
    function OrdenRecoleccion() {
        // crear el formulario general
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            fechaEmision: new forms_1.FormControl('', forms_1.Validators.required),
            cliente: new forms_1.FormControl(null, forms_1.Validators.required),
            fecha: new forms_1.FormControl('', forms_1.Validators.required),
            domicilio: new forms_1.FormControl(),
            localidad: new forms_1.FormControl(),
            barrio: new forms_1.FormControl(),
            horaDesde: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(11)]),
            horaHasta: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(11)]),
            solicitadoPor: new forms_1.FormControl('', forms_1.Validators.required),
            telefonoContacto: new forms_1.FormControl('', forms_1.Validators.required),
            descripcionCarga: new forms_1.FormControl('', forms_1.Validators.required),
            bultos: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(5)]),
            kilosEfectivo: new forms_1.FormControl(),
            m3: new forms_1.FormControl(false, forms_1.Validators.maxLength(3)),
            valorDeclarado: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(12)]),
            sucursalDestino: new forms_1.FormControl(),
            entregarEnDomicilio: new forms_1.FormControl(),
            pagoEnOrigen: new forms_1.FormControl(),
            estaEnReparto: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl(),
            tipoComprobante: new forms_1.FormControl(),
            sucursal: new forms_1.FormControl(),
            empresa: new forms_1.FormControl(),
            usuario: new forms_1.FormControl()
        });
    }
    return OrdenRecoleccion;
}());
exports.OrdenRecoleccion = OrdenRecoleccion;
//# sourceMappingURL=ordenRecoleccion.js.map