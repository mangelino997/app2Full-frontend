import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class PersonalAdelanto {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            personal: new FormControl(),
            tipoComprobante: new FormControl(),
            fechaEmision: new FormControl(),
            fechaVto: new FormControl(),
            importe: new FormControl('', Validators.required),
            cuota: new FormControl(),
            totalCuotas: new FormControl(),
            usuarioAlta: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(60)),
            estaAnulado: new FormControl(),
            observacionesAnulado: new FormControl(),
            usuarioMod: new FormControl(),
            usuarioBaja: new FormControl(),
            numeroLote: new FormControl(),
            viaje: new FormControl(),
            reparto: new FormControl(),
        })
    }
}