import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajeTramoCliente {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            clienteDador: new FormControl('', Validators.required),
            clienteDestinatario: new FormControl('', Validators. required),
            viajeTramo: new FormControl()
        })
    }
}