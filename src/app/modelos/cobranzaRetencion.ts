import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CobranzaRetencion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            cobranza: new FormControl(),
            tipoRetencion: new FormControl('', Validators.required),
            anio: new FormControl('', Validators.required),
            mes: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl(),
            numero: new FormControl('', Validators.required),
            provincia: new FormControl(),
        });
    }
}