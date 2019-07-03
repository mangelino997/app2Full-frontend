import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Soporte {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl('', Validators.required),
            subopcion: new FormControl('', Validators.required),
            mensaje: new FormControl('', Validators.required),
            usuario: new FormControl(),
            fecha: new FormControl(),
            bugImagen: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            soporteEstado: new FormControl(),
        });
    }
}