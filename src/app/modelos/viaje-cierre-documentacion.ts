import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajeCierreDocumentacion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fechaRegistracion: new FormControl(),
            fecha: new FormControl('', Validators.required),
            kmInicio: new FormControl('', Validators.required),
            kmFinal: new FormControl('', Validators.required),
            kmAjuste: new FormControl(),
            usuarioAlta: new FormControl(),
            litrosRendidos: new FormControl('', Validators.required),
        })
    }
}