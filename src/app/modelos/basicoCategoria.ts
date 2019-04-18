import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class BasicoCategoria {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            categoria: new FormControl('', Validators.required),
            anio: new FormControl('', Validators.required),
            mes: new FormControl('',Validators.required),
            basico: new FormControl('', Validators.required)
        })
    }
}