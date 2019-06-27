import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenVentaTarifa {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ordenVenta: new FormControl('', Validators.required),
            tipoTarifa: new FormControl('', Validators.required),
            preciosDesde: new FormControl('', Validators.required)
        })
    }
}