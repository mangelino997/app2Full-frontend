import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class AfipGananciaNeta {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            anio: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            importeFijo: new FormControl('', Validators.required),
            afipAlicuotaGanancia: new FormControl('', Validators.required),
        })
    }
}