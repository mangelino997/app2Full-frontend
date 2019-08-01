import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class Viaje {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresaEmision: new FormControl(),
            sucursal: new FormControl('', Validators.required),
            // usuario: new FormControl(),
            fecha: new FormControl(),
            esViajePropio: new FormControl('', Validators.required),
            personal: new FormControl(),
            choferProveedor: new FormControl(),
            esRemolquePropio: new FormControl('', Validators.required),
            vehiculoRemolque: new FormControl(),
            vehiculoRemolqueProveedor: new FormControl(),
            vehiculo: new FormControl(),
            vehiculoProveedor: new FormControl(),
            // empresa: new FormControl(),
            empresaRemolque: new FormControl(),
            afipCondicionIva: new FormControl(),
            numeroDocumentacion: new FormControl(),
            fechaDocumentacion: new FormControl(),
            usuarioDocumentacion: new FormControl(),
            numeroLiquidacion: new FormControl(),
            fechaLiquidacion: new FormControl(),
            usuarioLiquidacion: new FormControl(),
            usuarioVehiculoAutorizado: new FormControl(),
            usuarioVehiculoRemAutorizado: new FormControl(),
            usuarioChoferAutorizado: new FormControl(),
            observacionVehiculo: new FormControl(),
            observacionVehiculoRemolque: new FormControl(),
            observacionChofer: new FormControl(),
            observaciones: new FormControl(),
            alias: new FormControl(),
            usuarioAlta: new FormControl(),
        })
    }
}