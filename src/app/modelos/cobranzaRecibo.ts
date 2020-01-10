import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CobranzaRecibo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            cobranza: new FormControl(),
            numeroRecibo: new FormControl(),
            talonarioRecibo: new FormControl(),
            cobranzaAnticipo: new FormControl(),
        });
    }
}