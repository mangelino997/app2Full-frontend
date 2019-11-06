import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class VentaComprobanteItemFA {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            ventaComprobante: new FormControl(),
            ventaTipoItem: new FormControl(),
            viajeRemito: new FormControl(),
            viajeTramoClienteRemito: new FormControl(),
            numeroRemito: new FormControl(),
            bultos: new FormControl(),
            kilosEfectivo: new FormControl(),
            kilosAforado: new FormControl(),
            m3: new FormControl(),
            descripcionCarga: new FormControl('', Validators.required),
            valorDeclarado: new FormControl(),
            pSeguro: new FormControl(),
            importeSeguro: new FormControl(),
            flete: new FormControl(),
            descuentoFlete: new FormControl(),

            importeFlete: new FormControl(),
            importeRetiro: new FormControl(),
            importeEntrega: new FormControl(),
            ventaItemConcepto: new FormControl(),
            importeVentaItemConcepto: new FormControl(),

            importeNetoGravado: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),

            importeExento: new FormControl(),
            provincia: new FormControl(),
            ordenVentaTarifa: new FormControl('', Validators.required),
        })
    }
}