import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Cobrador {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            fechaAlta: new FormControl(),
            fechaBaja: new FormControl(),
            estaActivo: new FormControl('', Validators.required),
            usuarioAlta: new FormControl(),
            porDefectoClienteEventual: new FormControl(),
            correoElectronico: new FormControl('', [Validators.required, Validators.maxLength(60)])
        })
    }
}