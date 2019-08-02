import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompraComprobantePercepcion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl('', Validators.required),
            version: new FormControl('', Validators.required),
            compraComprobante: new FormControl('', Validators.required),
            tipoPercepcion: new FormControl('', Validators.required),
            anio: new FormControl('', [Validators.required, Validators.maxLength(4)]),
            mes: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', Validators.maxLength(5)),
            letra: new FormControl('', Validators.maxLength(1)),
            numero: new FormControl('', Validators.maxLength(8))
        })
    }
}