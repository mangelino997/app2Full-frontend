import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioGasto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viajePropio: new FormControl(),
            repartoPropio: new FormControl(),
            sucursal: new FormControl(),
            usuario: new FormControl(),
            tipoComprobante: new FormControl(),
            rubroProducto: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            observaciones: new FormControl('', Validators.maxLength(60)),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl('', Validators.maxLength(60)),
            importe: new FormControl()
        })
    }
}