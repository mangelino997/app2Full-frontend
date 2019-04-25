import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ActualizacionPrecios {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            precioDesde: new FormControl('', Validators.required), //nueva fecha
            listaPrecios: new FormControl(),
            aumento: new FormControl(),
            porcentaje: new FormControl('', Validators.required),
            fechaDesde: new FormControl('', Validators.required) //la ultima fecha
        })
    }
}