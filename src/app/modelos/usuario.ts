import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Usuario {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            username: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            password: new FormControl('', Validators.required),
            rol: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            cuentaHabilitada: new FormControl('', Validators.required),
            rolSecundario: new FormControl(),
            esDesarrollador: new FormControl()
        })
    }
}