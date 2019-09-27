import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ClienteVtoPago {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            cliente: new FormControl(),
            empresa: new FormControl('', Validators.required),
            diasFechaFactura: new FormControl(),
            enero: new FormControl(),
            febrero: new FormControl(),
            marzo: new FormControl(),
            abril: new FormControl(),
            mayo: new FormControl(),
            junio: new FormControl(),
            julio: new FormControl(),
            agosto: new FormControl(),
            septiembre: new FormControl(),
            octubre: new FormControl(),
            noviembre: new FormControl(),
            diciembre: new FormControl()
        })
    }
}