import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class PlanillaCerrrada {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            tipoViaje: new FormControl('', Validators.required),
            fechaDesde: new FormControl('', Validators.required),
            fechaHasta: new FormControl('', Validators.required),
            chofer: new FormControl(),
            personal: new FormControl(),
        })
    }
}