import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class AgendaTelefonica {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            domicilio: new FormControl('', Validators.maxLength(45)),
            telefonoFijo: new FormControl('', Validators.maxLength(11)),
            telefonoMovil: new FormControl('', Validators.maxLength(13)),
            correoelectronico: new FormControl('', Validators.maxLength(30)),
            localidad: new FormControl('', Validators.required)
        })
    }
}