"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Proveedor = /** @class */ (function () {
    //constructor
    function Proveedor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            razonSocial: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            nombreFantasia: new forms_1.FormControl('', [forms_1.Validators.maxLength(45)]),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            barrio: new forms_1.FormControl(),
            localidad: new forms_1.FormControl('', forms_1.Validators.required),
            tipoDocumento: new forms_1.FormControl('', forms_1.Validators.required),
            numeroDocumento: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(15)]),
            numeroIIBB: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(15)]),
            sitioWeb: new forms_1.FormControl('', forms_1.Validators.maxLength(60)),
            telefono: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            afipCondicionIva: new forms_1.FormControl('', forms_1.Validators.required),
            condicionCompra: new forms_1.FormControl('', forms_1.Validators.required),
            usuarioAlta: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            fechaUltimaMod: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(400)),
            notaIngresarComprobante: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            notaImpresionOrdenPago: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            banco: new forms_1.FormControl(),
            tipoCuentaBancaria: new forms_1.FormControl(),
            numeroCuenta: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(20)]),
            titular: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            numeroCBU: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.minLength(22), forms_1.Validators.maxLength(22)]),
            aliasCBU: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            tipoProveedor: new forms_1.FormControl('', forms_1.Validators.required),
            estaActivo: new forms_1.FormControl('', forms_1.Validators.required),
            alias: new forms_1.FormControl('', forms_1.Validators.maxLength(100))
        });
    }
    return Proveedor;
}());
exports.Proveedor = Proveedor;
//# sourceMappingURL=proveedor.js.map