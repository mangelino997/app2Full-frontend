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
            alias: new FormControl(),
            fechaEmision: new FormControl(),
            cliente: new FormControl('', Validators.required),
            fecha: new FormControl('', Validators.required),
            domicilio: new FormControl(),
            localidad: new FormControl(),
            barrio: new FormControl(),
            horaDesde: new FormControl('', Validators.required),
            horaHasta: new FormControl('', Validators.required),
            solicitadoPor: new FormControl('', Validators.required),
            telefonoContacto: new FormControl('', Validators.required),
            descripcionCarga: new FormControl('', Validators.required),
            bultos: new FormControl('', Validators.required),
            kilosEfectivo: new FormControl(),
            m3: new FormControl(),
            valorDeclarado: new FormControl('', Validators.required),
            sucursalDestino: new FormControl('', Validators.required),
            entregarEnDomicilio: new FormControl('', Validators.required),
            pagoEnOrigen: new FormControl('', Validators.required),
            estaEnReparto: new FormControl(),
            observaciones: new FormControl(),
            tipoComprobante: new FormControl(),
            sucursal: new FormControl(),
            empresa: new FormControl(),
            usuario: new FormControl(),
        })
    }
}