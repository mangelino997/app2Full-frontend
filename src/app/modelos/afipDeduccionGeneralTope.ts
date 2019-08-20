import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class AfipDeduccionGeneralTope {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            anio: new FormControl('', Validators.required),
            descripcion: new FormControl(),
            afipDeduccionGeneral: new FormControl('', [Validators.required, Validators.maxLength(80)]),
            importe: new FormControl(),
            porcentajeGananciaNeta: new FormControl(),
        })
    }
}