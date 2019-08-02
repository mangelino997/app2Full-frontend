import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CompraComprobante {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl('', Validators.required),
            version: new FormControl('', Validators.required),
            empresa: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', [Validators.maxLength(5), Validators.required]),
            letra: new FormControl('', [Validators.maxLength(1), Validators.required]),
            numero: new FormControl('', [Validators.maxLength(8), Validators.required]),
            tipoComprobante: new FormControl('', Validators.required),
            codigoAfip: new FormControl('', [Validators.maxLength(3), Validators.required]),
            fechaEmision: new FormControl('', Validators.required),
            fechaContable: new FormControl('', Validators.required),
            fechaRegistracion: new FormControl('', Validators.required),
            proveedor: new FormControl('', Validators.required),
            afipCondicionIva: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', Validators.required),
            condicionCompra: new FormControl('', Validators.required),
            importeNetoGravado: new FormControl('', Validators.required),
            importeExento: new FormControl('', Validators.required),
            importeImpuestoInterno: new FormControl('', Validators.required),
            impotePercepcion: new FormControl('', Validators.required),
            importeTotal: new FormControl('', Validators.required),
            importeSaldo: new FormControl('', Validators.required),
            usuarioAlta: new FormControl('', Validators.required),
            usuarioMod: new FormControl(),
            moneda: new FormControl('', Validators.required),
            monedaCotizacion: new FormControl('', Validators.required),
            observaciones: new FormControl()
        })
    }
}