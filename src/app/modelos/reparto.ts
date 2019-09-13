import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Reparto {
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
            tipoComprobante: new FormControl('', Validators.required),
            fechaRegistracion: new FormControl(),
            fechaSalida: new FormControl(),
            horaSalida: new FormControl(),
            vehiculo: new FormControl(),
            vehiculoRemolque: new FormControl('', Validators.required),
            personal: new FormControl(),
            zona: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            usuarioAlta: new FormControl(),
            estaCerrada: new FormControl(),
            fechaRegreso: new FormControl(),
            horaRegreso: new FormControl(),
            vehiculoProveedor: new FormControl('', Validators.required),
            vehiculoRemolqueProveedor: new FormControl('', Validators.required),
            choferProveedor: new FormControl('', Validators.required),
            proveedor: new FormControl(),
            afipCondicionIvaProveedor: new FormControl(),
            usuarioMod: new FormControl(),
            acompaniantes: new FormControl(),
        });
    }
}