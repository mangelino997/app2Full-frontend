import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class ViajeTramoClienteRemito {
    //define un formulario como un FormGroup para los datos principales 
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario principal
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viajeTramoCliente: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', [Validators.required, Validators.maxLength(5)]),
            letra: new FormControl('', Validators.required),
            numero: new FormControl('', [Validators.required, Validators.maxLength(8)]),
            bultos: new FormControl('', Validators.required),
            kilosEfectivo: new FormControl(),
            kilosAforado: new FormControl(),
            m3: new FormControl(),
            valorDeclarado: new FormControl(),
            importeRetiro: new FormControl(),
            importeEntrega: new FormControl(),
            importeFlete: new FormControl(),
            observaciones: new FormControl(),
            estaFacturado: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            viajeTarifa: new FormControl('', Validators.required),
            cantidad: new FormControl(),
            precioUnitario: new FormControl(),
            importeCosto: new FormControl()
        });
    }
}