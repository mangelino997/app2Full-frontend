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
            empresa: new FormControl(),
            sucursal: new FormControl(),
            fechaRegistracion: new FormControl(),
            personal: new FormControl(),
            usuarioAlta: new FormControl(),
            estaCerrada: new FormControl(),
            tipoViaje: new FormControl(),
            zona: new FormControl(),
            vehiculo: new FormControl(),
            remolque: new FormControl(),
            chofer: new FormControl(),
            acompaniantes: new FormControl(),
            fechaSalida: new FormControl(),
            horaSalida: new FormControl(),
            observaciones: new FormControl(),
            tipoItem: new FormControl(),
            tipoComprobante: new FormControl(),
            tipoDocumento: new FormControl(),
            vehiculoProveedor: new FormControl(),
            choferProveedor: new FormControl(),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            numeroComprobante: new FormControl(),
            numeroDocumento: new FormControl()


        })
    }
}