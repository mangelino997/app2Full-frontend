import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenRecoleccion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario general
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fechaEmision: new FormControl('', Validators.required),
            cliente: new FormControl(null, Validators.required),
            fecha: new FormControl('', Validators.required),
            domicilio: new FormControl(),
            localidad: new FormControl(),
            barrio: new FormControl(),
            horaDesde: new FormControl('', [Validators.required, Validators.maxLength(11)]),
            horaHasta: new FormControl('', [Validators.required, Validators.maxLength(11)]),
            solicitadoPor: new FormControl('', Validators.required),
            telefonoContacto: new FormControl('', Validators.required),
            descripcionCarga: new FormControl('', Validators.required),
            bultos: new FormControl('', [Validators.required, Validators.maxLength(5)]),
            kilosEfectivo: new FormControl(),
            m3: new FormControl(false, Validators.maxLength(3)),
            valorDeclarado: new FormControl('', [Validators.required, Validators.maxLength(12)]),
            sucursalDestino: new FormControl(),
            entregarEnDomicilio: new FormControl(),
            pagoEnOrigen: new FormControl(),
            estaEnReparto: new FormControl(),
            observaciones: new FormControl(),
            tipoComprobante: new FormControl(),
            sucursal: new FormControl(),
            empresa: new FormControl(),
            usuario: new FormControl()
        })
    }
}