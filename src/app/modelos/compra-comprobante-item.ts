import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompraComprobanteItem {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            compraComprobante: new FormControl(),
            insumoProducto: new FormControl('', Validators.required),
            depositoInsumoProducto: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            importeNetoGravado: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            importeImpuestoInterno: new FormControl(),
            cuentaContable: new FormControl(),
            itcPorLitro: new FormControl(),
            importeITC: new FormControl(),
            observaciones: new FormControl()
        })
    }
}