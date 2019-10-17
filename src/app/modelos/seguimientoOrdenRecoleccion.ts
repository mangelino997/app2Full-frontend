import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class SeguimientoOrdenRecoleccion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fecha: new FormControl(),
            sucursal: new FormControl(),
            seguimientoEstado: new FormControl(),
            seguimientoSituacion: new FormControl(),
            ordenRecoleccion: new FormControl(),
        });
    }
}