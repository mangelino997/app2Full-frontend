import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Tramo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            origen: new FormControl('', Validators.required),
            destino: new FormControl('', Validators.required),
            km: new FormControl(),
            estaActivo: new FormControl('', Validators.required),
            excluirLiqChofer: new FormControl('', Validators.required),
            rutaAlternativa: new FormControl('', Validators.maxLength(20))
        })
    }
}