import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class NotaDebito{
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fecha: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl(),
            numero: new FormControl(),
            codigoAfip: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            jurisdiccion: new FormControl('', Validators.required),
            cuenta: new FormControl('', Validators.required),
            cliente: new FormControl(),
            tipoDocumento: new FormControl(),
            numeroDocumento: new FormControl('', Validators.required),
            domicilio: new FormControl(),
            condicionIVA: new FormControl('', Validators.required),
            localidad: new FormControl(),
            condicionesVenta: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(100)),
            importeExento: new FormControl('', Validators.maxLength(100)),
            importeGravado: new FormControl('', Validators.maxLength(100)),
            importeIVA: new FormControl('', Validators.maxLength(100)),
            importeTotal: new FormControl()
        })
    }
}