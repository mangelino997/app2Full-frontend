import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CobranzaMedioPago {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            cobranza: new FormControl(),
            cobranzaAnticipo: new FormControl(),
            importeCobranzaAnticipo: new FormControl(),
            efectivo: new FormControl(),
            chequeraCartera: new FormControl(),
            documentoCartera: new FormControl('', Validators.required),
            monedaCartera: new FormControl('', Validators.required),
            libroBanco: new FormControl(),
        });
    }
}