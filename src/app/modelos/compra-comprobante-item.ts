import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompraComprobanteItem {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl('', Validators.required),
            version: new FormControl('', Validators.required),
            compraComprobante: new FormControl('', Validators.required),
            insumoProducto: new FormControl(),
            depositoInsumoProducto: new FormControl(),
            cantidad: new FormControl(),
            precioUnitario: new FormControl(),
            importeNetoGravado: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            alicuotaiva: new FormControl(),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            importeImpuestoInterno: new FormControl(),
            cuentaContable: new FormControl('', Validators.required),
            itcPorLitro: new FormControl(),
            importeITC: new FormControl(),
            observaciones: new FormControl()
        })
    }
}