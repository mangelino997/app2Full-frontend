import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropio {
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
            usuario: new FormControl(),
            fecha: new FormControl('', Validators.required),
            vehiculo: new FormControl('', Validators.required),
            personal: new FormControl('', Validators.required),
            esRemolquePropio: new FormControl('', Validators.required),
            vehiculoRemolque: new FormControl(),
            vehiculoProveedorRemolque: new FormControl(),
            empresa: new FormControl('', Validators.required),
            empresaRemolque: new FormControl(),
            condicionIva: new FormControl('', Validators.required),
            numeroDocumentacion: new FormControl(),
            fechaDocumentacion: new FormControl(),
            usuarioDocumentacion: new FormControl(),
            numeroLiquidacion: new FormControl(),
            fechaLiquidacion: new FormControl(),
            usuarioLiquidacion: new FormControl(),
            usuarioVehiculoAutorizado: new FormControl(),
            usuarioVehiculoRemAutorizado: new FormControl(),
            usuarioChoferAutorizado: new FormControl(),
            observacionVehiculo: new FormControl('', Validators.maxLength(100)),
            observacionVehiculoRemolque: new FormControl('', Validators.maxLength(100)),
            observacionChofer: new FormControl('', Validators.maxLength(100)),
            observaciones: new FormControl('', Validators.maxLength(100)),
            viajePropioTramos: new FormControl()
        })
    }
}