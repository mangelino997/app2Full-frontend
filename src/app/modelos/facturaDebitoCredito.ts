import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class FacturaDebitoCredito {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            numero: new FormControl(),
            tipoComprobante: new FormControl('', Validators.required),
            codigoAfip: new FormControl(),
            fechaEmision: new FormControl('', Validators.required),
            fechaContable: new FormControl('', Validators.required),
            fechaRegistracion: new FormControl(),
            proveedor: new FormControl('', Validators.required),
            afipCondicionIva: new FormControl(),
            tipoDocumento: new FormControl(),
            numeroDocumento: new FormControl(),
            condicionCompra: new FormControl('', Validators.required),
            importeNetoGravado: new FormControl(),
            importeIVA: new FormControl(),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            importeImpuestoInterno: new FormControl(),
            importePercepcion: new FormControl(),
            importeTotal: new FormControl(),
            importeSaldo: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            moneda: new FormControl(),
            monedaCotizacion: new FormControl(),
            observaciones: new FormControl(),
            compraComprobanteItems: new FormControl(), //lista de compraComprobanteItemForm
            compraComprobantePercepciones: new FormControl(), //lista de compraComprobantePercepcionForm
            compraComprobanteVencimientos: new FormControl(), //lista de compraComprobanteVencimientoForm
        })
    }
}