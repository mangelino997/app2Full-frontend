import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenVenta {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', Validators.required),
            cliente: new FormControl('', Validators.required),
            empresa: new FormControl('', Validators.required),
            vendedor: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            tipoTarifa: new FormControl('', Validators.required),
            seguro: new FormControl('8.00', Validators.required),
            comisionCR: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            estaActiva: new FormControl(),
            activaDesde: new FormControl(),
            tipoOrdenVenta: new FormControl(false, Validators.required),
            ordenesVentasEscalas: new FormControl(),
            ordenesVentasTramos: new FormControl()
        })
    }
}