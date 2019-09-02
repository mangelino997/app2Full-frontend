import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class AdelantoLote {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Constructor
    constructor() {
        //Crear el formulario
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            personal: new FormControl(),
            tipoComprobante: new FormControl(),
            fechaEmision: new FormControl(),
            fechaVto: new FormControl(),
            importe: new FormControl(),
            cuota: new FormControl(),
            totalCuotas: new FormControl(),
            usuarioAlta: new FormControl(),
            observaciones: new FormControl(),
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