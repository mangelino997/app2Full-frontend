import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class OrdenVentaEmpresa {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            fechaAlta: new FormControl(),
            fechaUltimaMod: new FormControl(),
            estaActiva: new FormControl()
        })
    }
}