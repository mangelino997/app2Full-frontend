import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Pdf } from './pdf';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class VehiculoProveedor {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            dominio: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            proveedor: new FormControl('', Validators.required),
            tipoVehiculo: new FormControl('', Validators.required),
            marcaVehiculo: new FormControl('', Validators.required),
            choferProveedor: new FormControl(),
            vehiculoRemolque: new FormControl(),
            anioFabricacion: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(4)]),
            numeroMotor: new FormControl('', Validators.maxLength(25)),
            numeroChasis: new FormControl('', Validators.maxLength(25)),
            companiaSeguro: new FormControl('', Validators.required),
            numeroPoliza: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            vtoPoliza: new FormControl('', Validators.required),
            vtoRTO: new FormControl('', Validators.required),
            numeroRuta: new FormControl('', Validators.required),
            vtoRuta: new FormControl('', Validators.required),
            vtoSenasa: new FormControl(),
            vtoHabBromatologica: new FormControl(),
            usuarioAlta: new FormControl(),
            fechaAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            fechaBaja: new FormControl(),
            usuarioMod: new FormControl(),
            fechaUltimaMod: new FormControl(),
            alias: new FormControl('', Validators.maxLength(100))
        })
    }
}