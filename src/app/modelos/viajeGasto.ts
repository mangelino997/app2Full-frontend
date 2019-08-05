import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Viaje } from './viaje';
@Injectable()
//Define la entidad de la base de datos.
export class ViajeGasto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor(private viajeFormulario: Viaje) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viaje: new FormControl(),
            reparto: new FormControl(),
            sucursal: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            usuarioMod: new FormControl(),
            tipoComprobante: new FormControl(),
            rubroProducto: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            observaciones: new FormControl('', Validators.maxLength(60)),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl('', Validators.maxLength(60)),
            importe: new FormControl(),
            importeTotal: new FormControl()
        })
    }
}