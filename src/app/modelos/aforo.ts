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
            aforo: new FormControl('', Validators.required),
            cantidad: new FormControl(1, Validators.required),
            alto: new FormControl(0.00, Validators.required),
            ancho: new FormControl(0.00, Validators.required),
            largo: new FormControl(0.00, Validators.required),
            kiloAforadoTotal: new FormControl('', Validators.required)
        })
    }
}