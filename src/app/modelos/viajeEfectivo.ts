import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Viaje } from './viaje';
@Injectable()
//Define la entidad de la base de datos.
export class ViajeEfectivo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor(private viajeFormulario: Viaje) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viaje: this.viajeFormulario.formulario,
            reparto: new FormControl(),
            empresa: new FormControl('', Validators.required),
            sucursal: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            usuarioBaja: new FormControl(),
            tipoComprobante: new FormControl(),
            fecha: new FormControl(),
            fechaCaja: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            observaciones: new FormControl('', Validators.maxLength(60)),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl(),
            importeTotal: new FormControl()
        })
    }
}