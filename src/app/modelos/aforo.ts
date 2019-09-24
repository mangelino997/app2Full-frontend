import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Aforo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            aforo: new FormControl(),
            cantidad: new FormControl('', Validators.required),
            alto: new FormControl('', Validators.required),
            ancho: new FormControl('', Validators.required),
            largo: new FormControl('', Validators.required),
            kiloAforadoTotal: new FormControl('', Validators.required)
        })
    }
}