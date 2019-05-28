import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajeTipo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('',[ Validators.required, Validators.maxLength(45) ]),
            abreviatura: new FormControl('',[ Validators.required, Validators.maxLength(10)]),
            costoPorKmPropio: new FormControl(),
            costoPorKmTercero: new FormControl()
        })
    }
}