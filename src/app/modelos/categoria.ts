import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Categoria {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            adicionalBasicoVacaciones: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(5)]),
            topeBasicoAdelantos: new FormControl('',[Validators.required, Validators.min(1), Validators.maxLength(5)]),
            diasLaborables: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(2)]),
            horasLaborables: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(2)])
        })
    }
}