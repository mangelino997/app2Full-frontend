import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class PuntoVenta {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            sucursal: new FormControl('', Validators.required),
            empresa: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', [Validators.required, Validators.maxLength(5)]),
            fe: new FormControl('', Validators.required),
            feEnLinea: new FormControl('', Validators.required),
            feCAEA: new FormControl('', Validators.required),
            esCuentaOrden: new FormControl('', Validators.required),
            ultimoNumero: new FormControl(),
            copias: new FormControl('', [Validators.required, Validators.maxLength(3)]),
            imprime: new FormControl('', Validators.required),
            estaHabilitado: new FormControl('', Validators.required),
            porDefecto: new FormControl(),
            afipComprobante: new FormControl('', Validators.required)
        })
    }
}