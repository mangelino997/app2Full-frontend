import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenVentaTramo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ordenVentaTarifa: new FormControl('', Validators.required),
            tramo: new FormControl('', Validators.required),
            kmTramo: new FormControl(),
            kmPactado: new FormControl(),
            importeFijoSeco: new FormControl('00'),
            importeFijoRef: new FormControl('00'),
            precioUnitarioSeco: new FormControl('00'),
            precioUnitarioRef: new FormControl('00'),
            preciosDesde: new FormControl(),
        })
    }
}