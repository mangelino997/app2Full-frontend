import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajePropioEfectivo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viajePropio: new FormControl(),
            repartoPropio: new FormControl(),
            empresa: new FormControl('', Validators.required),
            sucursal: new FormControl(),
            usuario: new FormControl(),
            tipoComprobante: new FormControl(),
            fecha: new FormControl(),
            fechaCaja: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            observaciones: new FormControl('', Validators.maxLength(60)),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl(),
            importeTotal: new FormControl()
        })
    }
}