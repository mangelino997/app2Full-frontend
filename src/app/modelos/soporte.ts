import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BugImagen } from './bugImagen';
//Define la entidad de la base de datos.
@Injectable()
export class Soporte {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor(private bugImagen: BugImagen) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl('', Validators.required),
            subopcion: new FormControl('', Validators.required),
            mensaje: new FormControl('', Validators.required),
            usuario: new FormControl(),
            fecha: new FormControl(),
            bugImagen: this.bugImagen.formulario,
            soporteEstado: new FormControl(),
            alias: new FormControl(),
        });
    }
}