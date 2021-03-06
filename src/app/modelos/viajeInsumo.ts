import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Viaje } from './viaje';
@Injectable()
//Define la entidad de la base de datos.
export class ViajeInsumo {
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
            proveedor: new FormControl('', Validators.required),
            sucursal: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            usuarioBaja: new FormControl(),
            tipoComprobante: new FormControl(),
            fecha: new FormControl('', Validators.required),
            insumoProducto: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl(),
            importe: new FormControl(),
            importeTotal: new FormControl()
        })
    }
}