"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Cliente = /** @class */ (function () {
    //constructor
    function Cliente() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            razonSocial: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(45)]),
            nombreFantasia: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            cuentaGrupo: new forms_1.FormControl(),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]),
            localidad: new forms_1.FormControl('', [forms_1.Validators.required]),
            barrio: new forms_1.FormControl(),
            telefono: new forms_1.FormControl('', [forms_1.Validators.maxLength(45)]),
            sitioWeb: new forms_1.FormControl('', [forms_1.Validators.maxLength(60)]),
            zona: new forms_1.FormControl('', [forms_1.Validators.required]),
            rubro: new forms_1.FormControl('', [forms_1.Validators.required]),
            cobrador: new forms_1.FormControl('', [forms_1.Validators.required]),
            vendedor: new forms_1.FormControl(),
            afipCondicionIva: new forms_1.FormControl('', [forms_1.Validators.required]),
            tipoDocumento: new forms_1.FormControl('', [forms_1.Validators.required]),
            numeroDocumento: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(15)]),
            numeroIIBB: new forms_1.FormControl('', forms_1.Validators.maxLength(15)),
            esCuentaCorriente: new forms_1.FormControl(),
            condicionVenta: new forms_1.FormControl('', forms_1.Validators.required),
            resumenCliente: new forms_1.FormControl(),
            situacionCliente: new forms_1.FormControl(),
            ordenVenta: new forms_1.FormControl(),
            sucursalLugarPago: new forms_1.FormControl(),
            creditoLimite: new forms_1.FormControl('', [forms_1.Validators.min(0), forms_1.Validators.maxLength(12)]),
            descuentoFlete: new forms_1.FormControl('', [forms_1.Validators.min(0), forms_1.Validators.maxLength(4)]),
            descuentoSubtotal: new forms_1.FormControl('', [forms_1.Validators.min(0), forms_1.Validators.maxLength(4)]),
            esSeguroPropio: new forms_1.FormControl(),
            companiaSeguro: new forms_1.FormControl(),
            numeroPolizaSeguro: new forms_1.FormControl('', forms_1.Validators.maxLength(20)),
            vencimientoPolizaSeguro: new forms_1.FormControl(),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(400)),
            notaEmisionComprobante: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            notaImpresionComprobante: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            notaImpresionRemito: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            imprimirControlDeuda: new forms_1.FormControl('', forms_1.Validators.required),
            usuarioAlta: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            fechaBaja: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            fechaUltimaMod: new forms_1.FormControl(),
            alias: new forms_1.FormControl()
        });
    }
    return Cliente;
}());
exports.Cliente = Cliente;
//# sourceMappingURL=cliente.js.map