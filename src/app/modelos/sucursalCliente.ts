import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class SucursalCliente {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            domicilio: new FormControl('', Validators.maxLength(60)),
            barrio: new FormControl(),
            telefonoFijo: new FormControl('', Validators.maxLength(45)),
            telefonoMovil: new FormControl('', Validators.maxLength(45)),
            cliente: new FormControl('', Validators.required),
            localidad: new FormControl('', Validators.required)
        });
    }
}