import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioPeaje {
    //Define un formulario
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
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
            empresaCFiscal: new FormControl(),
            registroCFiscal: new FormControl(),
            usuario: new FormControl(),
            importeTotal: new FormControl()
        })
    }
}