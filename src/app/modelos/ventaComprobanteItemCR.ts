import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class VentaComprobanteItemCR {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ventaComprobante: new FormControl(),
            pComision: new FormControl(),
            importeContraReembolso: new FormControl(),
            importeNetoGravado: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            fechaCobro: new FormControl(),
            fechaPago: new FormControl(),
            idProvincia:  new FormControl(),
        })
    }
}