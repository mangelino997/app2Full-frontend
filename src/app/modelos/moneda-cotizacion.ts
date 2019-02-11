import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class MonedaCotizacion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            moneda: new FormControl('', Validators.required),
            fechaCotizacion: new FormControl('', Validators.required),
            valor: new FormControl('', [Validators.required, Validators.maxLength(10)])
        })
    }
}