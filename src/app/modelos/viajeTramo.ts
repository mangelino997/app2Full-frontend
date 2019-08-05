import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Viaje } from './viaje';
import { Injectable } from '@angular/core';
@Injectable()

//Define la entidad de la base de datos.
export class ViajeTramo {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor(private viajeFormulario: Viaje) {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viaje: new FormControl(),
            tramo: new FormControl('', Validators.required),
            numeroOrden: new FormControl(),
            fechaTramo: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            empresa: new FormControl('', Validators.required),
            km: new FormControl('', Validators.required),
            usuarioAlta: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(100)),
            viajeTipo: new FormControl('', Validators.required),
            viajeTipoCarga: new FormControl('', Validators.required),
            viajeTarifa: new FormControl('', Validators.required),
            viajeUnidadNegocio: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            viajeTramoClientes: new FormControl(),
            activo: new FormControl()
        })
    }
}