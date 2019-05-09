import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioTramo {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viajePropio: new FormControl(),
            tramo: new FormControl('', Validators.required),
            numeroOrden: new FormControl(),
            fechaTramo: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            empresa: new FormControl('', Validators.required),
            km: new FormControl('', Validators.required),
            usuario: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(100)),
            viajeTipo: new FormControl('', Validators.required),
            viajeTipoCarga: new FormControl('', Validators.required),
            viajeTarifa: new FormControl('', Validators.required),
            viajeUnidadNegocio: new FormControl('', Validators.required),
            cantidad: new FormControl('', Validators.required),
            precioUnitario: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            viajePropioTramoClientes: new FormControl(),
            activo: new FormControl()
        })
    }
}