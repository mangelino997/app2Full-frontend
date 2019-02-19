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
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            precioDesde: new FormControl('', Validators.maxLength(45)),
            aumento: new FormControl('', Validators.maxLength(45)),
            porcentaje: new FormControl('', Validators.maxLength(45)),
            fechaDesde: new FormControl('', Validators.maxLength(30)),
            localidad: new FormControl('', Validators.required)
        })
    }
}