import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Empresa {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            razonSocial: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
            barrio: new FormControl(),
            localidad: new FormControl('', Validators.required),
            afipCondicionIva: new FormControl('', Validators.required),
            cuit: new FormControl('', [Validators.required, Validators.maxLength(11)]),
            numeroIIBB: new FormControl('', Validators.maxLength(15)),
            abreviatura: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            logoBin: new FormControl(),
            estaActiva: new FormControl('', Validators.required),
            inicioActividad: new FormControl(),
            // feCaea: new FormControl(),
            // feModo: new FormControl(),
            // certificadoReal: new FormControl(),
            // certificadoPrueba: new FormControl()
        })
    }
}