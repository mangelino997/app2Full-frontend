import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ClienteEventual {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            razonSocial: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            nombreFantasia: new FormControl('', Validators.maxLength(45)),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
            localidad: new FormControl('', [Validators.required]),
            barrio: new FormControl(),
            telefono: new FormControl('', [Validators.maxLength(45)]),
            zona: new FormControl('', Validators.required),
            rubro: new FormControl('', Validators.required),
            cobrador: new FormControl('', Validators.required),
            afipCondicionIva: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            numeroIIBB: new FormControl('', Validators.maxLength(15)),
            sucursalLugarPago: new FormControl(),
            usuarioAlta: new FormControl()
        })
    }
}