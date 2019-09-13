import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Seguimiento {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            fecha: new FormControl('', Validators.required),
            sucursal: new FormControl(),
            seguimientoEstado: new FormControl(),
            seguimientoSituacion: new FormControl(),
            ventaComprobante: new FormControl(),
            ordenRecoleccion: new FormControl(),
            viajeRemito: new FormControl(),
        });
    }
}