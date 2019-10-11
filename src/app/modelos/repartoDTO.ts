import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class RepartoDTO {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            idReparto: new FormControl(),
            idEmpresa: new FormControl(),
            esRepartoPropio: new FormControl(),
            fechaDesde: new FormControl(),
            fechaHasta: new FormControl(),
            idChofer: new FormControl(),
            estaCerrada: new FormControl(),
        });
    }
}