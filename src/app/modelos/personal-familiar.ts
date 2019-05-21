import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class PersonalFamiliar {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            personal: new FormControl('', Validators.required),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            apellido: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            tipoFamiliar: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', [Validators.required]),
            cuil: new FormControl('', [Validators.required]),
            fechaNacimiento: new FormControl('', Validators.required),
            localidadNacimiento: new FormControl('', Validators.required),
            sexo: new FormControl('', Validators.required),
            anioAltaImpGan: new FormControl('', Validators.maxLength(4)),
            anioBajaImpGan: new FormControl('', Validators.maxLength(4)),
            mesAltaImpGan: new FormControl(),
            mesBajaImpGan: new FormControl(),
            alias: new FormControl('', Validators.maxLength(100))
        })
    }
}