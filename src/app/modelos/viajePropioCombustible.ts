import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioCombustible {
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
            proveedor: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            usuario: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            insumo: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl(),
            totalCombustible: new FormControl(),
            totalUrea: new FormControl(),
            importe: new FormControl()
        })
    }
}