import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()

//Define la entidad de la base de datos.
export class OrdenVenta {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', Validators.required),
            vendedor: new FormControl('', Validators.required),
            seguro: new FormControl(),
            comisionCR: new FormControl(),
            observaciones: new FormControl(),
            esContado: new FormControl(),
            estaActiva: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            activaDesde: new FormControl(),
            ordenesVentasTarifas: new FormControl(),
        })
    }
}