import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Chequera {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            cuentaBancaria: new FormControl('', Validators.required),
            tipoChequera: new FormControl('', Validators.required),
            desde: new FormControl('', Validators.required),
            hasta: new FormControl('', Validators.required),
            usuarioAlta: new FormControl()
        })
    }
}