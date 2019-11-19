import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class EscalaTarifa {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            valor: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(45)]),
            descripcion: new FormControl()
        })
    }
}