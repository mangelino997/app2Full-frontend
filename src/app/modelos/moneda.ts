import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Moneda {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            codigo: new FormControl(),
            nombre: new FormControl('', Validators.required),
            estaActiva: new FormControl('', Validators.required)
            
        })
    }
}