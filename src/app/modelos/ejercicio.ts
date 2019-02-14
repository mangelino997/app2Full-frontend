import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Ejercicio {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            anioInicio: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            mesInicio: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            cantidadMeses: new FormControl('', Validators.required),
            porDefecto: new FormControl('', Validators.required),
            empresa: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl()
        })
    }
}