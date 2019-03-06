"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var UsuarioEmpresa = /** @class */ (function () {
    //constructor
    function UsuarioEmpresa() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            usuario: new forms_1.FormControl(),
            empresa: new forms_1.FormControl(),
            mostrar: new forms_1.FormControl()
        });
    }
    return UsuarioEmpresa;
}());
exports.UsuarioEmpresa = UsuarioEmpresa;
//# sourceMappingURL=usuarioEmpresa.js.map