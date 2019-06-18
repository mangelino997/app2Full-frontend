import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class TalonarioReciboCobrador {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            codigo: new FormControl(),
            empresa: new FormControl(),
            cobrador: new FormControl('', Validators.required),
            personal: new FormControl(),
            talonarioReciboLote: new FormControl('', Validators.required),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            desde: new FormControl('', Validators.required),
            hasta: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            usuarioAlta: new FormControl(),

        });
    }
}