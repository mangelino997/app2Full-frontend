import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompaniaSeguroPoliza {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            companiaSeguro: new FormControl('', Validators.required),
            empresa: new FormControl('', Validators.required),
            numeroPoliza: new FormControl('', Validators.required),
            vtoPoliza: new FormControl('', Validators.required),
            pdf: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl(),
                tabla: new FormControl()
            })
        })
    }
}