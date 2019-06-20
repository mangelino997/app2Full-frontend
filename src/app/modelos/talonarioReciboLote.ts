import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class TalonarioReciboLote{
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            codigo: new FormControl(),
            empresa: new FormControl(),
            cai: new FormControl('', Validators.maxLength(14)),
            caiVencimiento: new FormControl(),
            loteEntregado: new FormControl(),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            desde: new FormControl('', Validators.required),
            hasta: new FormControl('', Validators.required),
            fechaAlta: new FormControl(),
            usuarioAlta: new FormControl(),

        });
    }
}