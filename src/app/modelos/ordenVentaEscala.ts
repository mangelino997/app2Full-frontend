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
            escalaTarifa: new FormControl(),
            importeFijo: new FormControl(0.00),
            precioUnitario: new FormControl(0.00),
            porcentaje: new FormControl(),
            minimo: new FormControl(0.00),
            fechaDesde: new FormControl()
        })
    }
}