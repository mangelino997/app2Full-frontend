import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Provincia {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            codigoIIBB: new FormControl('', [Validators.min(0), Validators.maxLength(10)]),
            codigoAfip: new FormControl('', Validators.maxLength(3)),
            pais: new FormControl('', Validators.required)
        })
    }
}