import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Localidad {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            codigoPostal: new FormControl('', [Validators.min(1), Validators.maxLength(10)]),
            provincia: new FormControl('', Validators.required)
        })
    }
}