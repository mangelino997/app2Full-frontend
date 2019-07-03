import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class Pdf {
    //constructor
    constructor() {}
    //Crea un formulario nuevo
    public crearFormulario(): FormGroup {
        return new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl(),
            tipo: new FormControl(),
            tamanio: new FormControl(),
            datos: new FormControl(),
            tabla: new FormControl()
        });
    }
}