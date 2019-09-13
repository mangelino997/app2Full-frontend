import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class RepartoEntrante {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresaEmision: new FormControl(),
            sucursal: new FormControl(),
            tipoComprobante: new FormControl(),
            fechaRegistracion: new FormControl(),
            fechaSalida: new FormControl(),
            horaSalida: new FormControl('', Validators.required),
            vehiculo: new FormControl(),
            vehiculoRemolque: new FormControl(),
            personal: new FormControl(),
            zona: new FormControl(),
            observaciones: new FormControl(),
            usuarioAlta: new FormControl(),
            estaCerrada: new FormControl(),
            fechaRegreso: new FormControl('', Validators.required),
            horaRegreso: new FormControl('', Validators.required),
            vehiculoProveedor: new FormControl(),
            vehiculoRemolqueProveedor: new FormControl(),

            tipoItem: new FormControl(),
            estado: new FormControl(),
            situacion: new FormControl(),
            cobranza: new FormControl(),
            contado: new FormControl(),
            cobranzaContraReembolso: new FormControl('', Validators.required),
            // tipoComprobante: new FormControl('', Validators.required)

        });
    }
}