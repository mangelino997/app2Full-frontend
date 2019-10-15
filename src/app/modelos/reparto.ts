import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class Reparto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresaEmision: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            tipoComprobante: new FormControl(),
            fechaRegistracion: new FormControl(),
            fechaSalida: new FormControl(),
            horaSalida: new FormControl(),
            vehiculo: new FormControl(),
            vehiculoRemolque: new FormControl(),
            personal: new FormControl(),
            zona: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            estaCerrada: new FormControl(),
            fechaRegreso: new FormControl(),
            horaRegreso: new FormControl(),
            vehiculoProveedor: new FormControl(),
            vehiculoRemolqueProveedor: new FormControl(),
            choferProveedor: new FormControl(),
            proveedor: new FormControl(),
            afipCondicionIvaProveedor: new FormControl(),
            usuarioAlta: new FormControl('', Validators.required),
            usuarioMod: new FormControl(),
            acompaniantes: new FormControl(),
            esRepartoPropio: new FormControl(),
            repartoComprobantes: new FormControl(),

        });
    }
}