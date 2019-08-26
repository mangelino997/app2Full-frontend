import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompraComprobanteVencimiento {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl('', Validators.required),
            version: new FormControl('', Validators.required),
            compraComprobante: new FormControl('', Validators.required), //se establece en backend
            fecha: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required)
        })
    }
}