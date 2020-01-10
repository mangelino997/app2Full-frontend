import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Cobranza {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            tipoComprobante: new FormControl(),
            fechaEmision: new FormControl(),
            fechaRegistracion: new FormControl(),
            cliente: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            usuarioMod: new FormControl(),
            cobranzaItems: new FormControl(),
            cobranzaRetenciones: new FormControl(),
        });
    }
}