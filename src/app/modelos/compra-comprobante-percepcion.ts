import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class CompraComprobantePercepcion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            compraComprobante: new FormControl(),
            tipoPercepcion: new FormControl('', Validators.required),
            anio: new FormControl('', [Validators.required, Validators.maxLength(4)]),
            mes: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', Validators.maxLength(5)),
            letra: new FormControl('', Validators.maxLength(1)),
            numero: new FormControl('', Validators.maxLength(8)),
            compraCptePercepcionJurisdicciones: new FormControl() //Lista de compraCptePercepcionJurisdiccionForm
        })
    }
}