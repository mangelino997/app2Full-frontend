import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class NotaCredito{
    //define un formulario FormGroup
    public formulario: FormGroup;
    //define un formulario 
    public f: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fechaEmision: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl(),
            numero: new FormControl(),
            codigoAfip: new FormControl('', Validators.required),
            ventaComprobante: new FormControl(),
            ventaTipoItem: new FormControl('', Validators.required),
            jurisdiccion: new FormControl('', Validators.required),
            cliente: new FormControl(),

            cli: new FormGroup({
                // cliente: new FormControl(),
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                numeroDocumento: new FormControl(),
                tipoDocumento: new FormControl(),
            }),
            numeroDocumento: new FormControl('', Validators.required),
            domicilio: new FormControl(),
            condicionIVA: new FormControl('', Validators.required),
            afipAlicuotaIva: new FormControl(),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeTotal: new FormControl(),
            importeExento: new FormControl(),
            provincia: new FormControl(),
            ventaComprobanteAplicado: new FormControl(),
            comprobanteAplicado: new FormControl(),
            observaciones: new FormControl(),

        });
        
    }
}