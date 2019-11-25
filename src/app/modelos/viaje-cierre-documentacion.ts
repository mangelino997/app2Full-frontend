import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajeCierreDocumentacion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            viaje: new FormControl(),
            fechaDocumentacion: new FormControl(),
            kmInicio: new FormControl(),
            kmFinal: new FormControl(),
            kmRecorridos: new FormControl(),
            kmTramos: new FormControl(),
            kmDiferencia: new FormControl(),
            litrosViaje: new FormControl(),
            litrosRendidos: new FormControl(),
            litrosDiferencia: new FormControl()
        })
    }
}