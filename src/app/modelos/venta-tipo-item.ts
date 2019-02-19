import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class VentaTipoItem {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            esContrareembolso: new FormControl('', Validators.required),
            afipConcepto: new FormControl('', Validators.required),
            esChequeRechazado: new FormControl('', Validators.required),
            estaHabilitado: new FormControl('', Validators.required)
        })
    }
}