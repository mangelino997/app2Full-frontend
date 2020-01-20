import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class VentaComprobanteItemNC {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ventaComprobante: new FormControl(),
            ventaTipoItem: new FormControl('', Validators.required),
            importeNetoGravado: new FormControl('', Validators.required),
            afipAlicuotaIva: new FormControl('', Validators.required),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            provincia: new FormControl(),
            ventaComprobanteAplicado: new FormControl(),
            estaRechazadaFCE: new FormControl()
        })
    }
}