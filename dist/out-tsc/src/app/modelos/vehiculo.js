"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var Vehiculo = /** @class */ (function () {
    //constructor
    function Vehiculo() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            configuracionVehiculo: new forms_1.FormControl('', forms_1.Validators.required),
            dominio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(10)]),
            numeroInterno: new forms_1.FormControl('', forms_1.Validators.maxLength(5)),
            localidad: new forms_1.FormControl('', forms_1.Validators.required),
            anioFabricacion: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(4)]),
            numeroMotor: new forms_1.FormControl('', [forms_1.Validators.min(5), forms_1.Validators.maxLength(25)]),
            numeroChasis: new forms_1.FormControl('', [forms_1.Validators.min(5), forms_1.Validators.maxLength(25)]),
            empresa: new forms_1.FormControl('', forms_1.Validators.required),
            personal: new forms_1.FormControl(),
            vehiculoRemolque: new forms_1.FormControl(),
            companiaSeguroPoliza: new forms_1.FormControl(),
            vtoRTO: new forms_1.FormControl('', forms_1.Validators.required),
            numeroRuta: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(5), forms_1.Validators.maxLength(25)]),
            vtoRuta: new forms_1.FormControl('', forms_1.Validators.required),
            vtoSenasa: new forms_1.FormControl(),
            vtoHabBromatologica: new forms_1.FormControl(),
            usuarioAlta: new forms_1.FormControl(),
            fechaAlta: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            fechaBaja: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            fechaUltimaMod: new forms_1.FormControl(),
            alias: new forms_1.FormControl('', forms_1.Validators.maxLength(100))
        });
    }
    return Vehiculo;
}());
exports.Vehiculo = Vehiculo;
//# sourceMappingURL=vehiculo.js.map