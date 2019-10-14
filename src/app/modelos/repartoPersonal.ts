import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class RepartoPersonal {
    //define un formulario FormGroup
    public formulario: FormGroup;

    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            reparto: new FormControl(null, Validators.required),
            personal: new FormControl(),
        });
    }
}