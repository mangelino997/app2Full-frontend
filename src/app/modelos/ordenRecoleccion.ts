import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenRecoleccion {
    //define un formulario FormGroup
    public formulario: FormGroup;
    public formularioReminente: FormGroup;
    //constructor
    constructor() {
        // crear el formulario general
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fecha: new FormControl('', Validators.required),
            reminente: new FormControl(null, Validators.required),
            fechaRecoleccion: new FormControl('', Validators.required),
            horaDesde: new FormControl('', Validators.required),
            horaHasta: new FormControl(),
            solicitadoPor: new FormControl('', Validators.required),
            telefonoContacto: new FormControl('8.00', Validators.required),
            descripcion: new FormControl('', Validators.required),
            bultos: new FormControl(),
            kgEfectivo: new FormControl(),
            m3: new FormControl(false, Validators.required),
            valorDeclarado: new FormControl(),
            sucursalDestino: new FormControl(),
            entregaDomicilio: new FormControl(),
            pagonEn: new FormControl(),
            observaciones: new FormControl()
        });
        // crear el formulario para el Reminente
        this.formularioReminente = new FormGroup({
            reminente: new FormControl(null, Validators.required),
            domicilio: new FormControl('', Validators.required),
            barrio: new FormControl('', Validators.required),
            localidad: new FormControl()
        });
    }
}