import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioPeaje {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viajePropio: new FormControl(),
            proveedor: new FormControl('', Validators.required),
            tipoComprobante: new FormControl(),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl('', [Validators.required, Validators.maxLength(1)]),
            numeroComprobante: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            idEmpresaCFiscal: new FormControl(),
            idRegistroCFiscal: new FormControl(),
            idUsuario: new FormControl()
        })
    }
}