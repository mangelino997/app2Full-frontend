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
            empresa: new FormControl(),
            sucursal: new FormControl(),
            fechaRegistracion: new FormControl(),
            personal: new FormControl(),
            usuarioAlta: new FormControl(),
            tipoViaje: new FormControl(),
            fechaRegreso: new FormControl('', Validators.required),
            horaRegreso: new FormControl('', Validators.required),
            tipoItem: new FormControl(),
            estado: new FormControl(),
            situacion: new FormControl(),
            cobranza: new FormControl(),
            contado: new FormControl(),
            cobranzaContraReembolso: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            tipoComprobante: new FormControl('', Validators.required)

        });
    }
}