import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class AfipConceptoSueldo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(140)]),
            afipConceptoSueldoGrupo: new FormControl('', Validators.required),
            codigoAfip: new FormControl('', [Validators.required, Validators.maxLength(6)])
        })
    }
}