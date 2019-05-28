import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CuentaBancaria {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl('', Validators.required),
            banco: new FormControl('', Validators.required),
            sucursalBanco: new FormControl('', Validators.required),
            tipoCuentaBancaria: new FormControl('', Validators.required),
            numeroCuenta: new FormControl('', Validators.required),
            moneda: new FormControl('', Validators.required),
            CBU: new FormControl(),
            aliasCBU: new FormControl(),
            estaActiva: new FormControl('', Validators.required),
            fechaApertura: new FormControl(),
            fechaAlta: new FormControl(),
            usuarioAlta: new FormControl(),
            fechaBaja: new FormControl(),
            usuarioBaja: new FormControl(),
            fechaCierre: new FormControl()
        })
    }
}