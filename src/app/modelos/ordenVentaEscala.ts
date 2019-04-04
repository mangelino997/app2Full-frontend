import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenVentaEscala {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ordenVenta: new FormControl(),
            escalaTarifa: new FormControl('', Validators.required),
            importeFijo: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            porcentaje: new FormControl('', Validators.required),
            minimo: new FormControl('', Validators.required),
            preciosDesde: new FormControl()
        })
    }
}