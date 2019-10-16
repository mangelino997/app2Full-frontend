import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class RepartoComprobante {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            reparto: new FormControl(),
            ventaComprobante: new FormControl(),
            ordenRecoleccion: new FormControl(),
            viajeRemito: new FormControl()
        });
    }
}