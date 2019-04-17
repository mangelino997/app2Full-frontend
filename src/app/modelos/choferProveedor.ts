import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ChoferProveedor {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
            proveedor: new FormControl('', Validators.required),
            barrio: new FormControl(),
            localidad: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            fechaNacimiento: new FormControl('', Validators.required),
            telefonoFijo: new FormControl('', Validators.maxLength(45)),
            telefonoMovil: new FormControl('', Validators.maxLength(45)),
            vtoLicenciaConducir: new FormControl('', Validators.required),
            vtoCurso: new FormControl('', Validators.required),
            vtoCursoCargaPeligrosa: new FormControl(),
            vtoLINTI: new FormControl('', Validators.required),
            vtoLibretaSanidad: new FormControl(),
            usuarioAlta: new FormControl(),
            fechaAlta: new FormControl(),
            usuarioMod: new FormControl(),
            fechaUltimaMod: new FormControl(),
            usuarioBaja: new FormControl(),
            fechaBaja: new FormControl(),
            alias: new FormControl()
        })
    }
}