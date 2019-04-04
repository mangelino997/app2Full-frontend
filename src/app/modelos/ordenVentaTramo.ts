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
            ordenVenta: new FormControl(),
            tramo: new FormControl(),
            kmTramo: new FormControl(),
            kmPactado: new FormControl(),
            importeFijoSeco: new FormControl(),
            importeFijoRef: new FormControl(),
            precioUnitarioSeco: new FormControl(),
            precioUnitarioRef: new FormControl(),
            preciosDesde: new FormControl()
        })
    }
}