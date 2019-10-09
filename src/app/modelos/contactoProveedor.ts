import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ContactoProveedor {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            proveedor: new FormControl('', Validators.required),
            tipoContacto: new FormControl('', Validators.required),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            telefonoFijo: new FormControl('', Validators.maxLength(45)),
            telefonoMovil: new FormControl('', Validators.maxLength(45)),
            correoelectronico: new FormControl('', Validators.maxLength(30)),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl()
        })
    }
}